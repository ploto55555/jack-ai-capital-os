#!/usr/bin/env python3
"""Causal GBPJPY/XAUUSD day-trade research. Personal research only; no orders."""
from __future__ import annotations
import argparse,itertools,math
from pathlib import Path
import numpy as np,pandas as pd

START,TARGET=500.0,100000.0
SPECS={
 'GBPJPY':dict(scale=1000.0,pip=.01,cost=2.0,minstop=8,maxstop=55),
 'XAUUSD':dict(scale=100.0,pip=.10,cost=4.0,minstop=15,maxstop=140),
}
SPLITS={'DEV':('2012-01-01','2018-12-31 23:59:59'),'VAL':('2019-01-01','2021-12-31 23:59:59'),'OOS':('2022-01-01','2100-01-01'),'ALL':('1900-01-01','2100-01-01')}

def tr(x):
 p=x.close.shift();return pd.concat([x.high-x.low,(x.high-p).abs(),(x.low-p).abs()],axis=1).max(axis=1)

def load(path,sym):
 s=SPECS[sym];x=pd.read_csv(path);c={str(k).lower().strip():k for k in x.columns};t=c.get('date') or c.get('time')
 x=pd.DataFrame({'timestamp':pd.to_datetime(x[t]),**{k:pd.to_numeric(x[c[k]],errors='coerce')/s['scale'] for k in ['open','high','low','close']}}).dropna().sort_values('timestamp').drop_duplicates('timestamp').reset_index(drop=True)
 x['atr']=tr(x).ewm(alpha=1/14,adjust=False,min_periods=14).mean();x['body']=(x.close-x.open).abs();x['lw']=x[['open','close']].min(axis=1)-x.low;x['uw']=x.high-x[['open','close']].max(axis=1);x['day']=x.timestamp.dt.floor('D');x['hour']=x.timestamp.dt.hour
 return x

def tf(x,rule,h,p):
 z=x.set_index('timestamp').resample(rule,label='left',closed='left',origin='start_day').agg(open=('open','first'),high=('high','max'),low=('low','min'),close=('close','last')).dropna().reset_index()
 z['ema20']=z.close.ewm(span=20,adjust=False,min_periods=20).mean();z['ema50']=z.close.ewm(span=50,adjust=False,min_periods=50).mean();z['hi20']=z.high.rolling(20).max().shift();z['lo20']=z.low.rolling(20).min().shift();z['available']=z.timestamp+pd.Timedelta(hours=h)
 return z[['available','close','ema20','ema50','hi20','lo20']].rename(columns={k:f'{p}_{k}' for k in ['close','ema20','ema50','hi20','lo20']})

def context(x):
 for z in [tf(x,'4h',4,'h4'),tf(x,'1D',24,'d1')]:x=pd.merge_asof(x.sort_values('timestamp'),z.sort_values('available'),left_on='timestamp',right_on='available',direction='backward').drop(columns='available')
 d=x.groupby('day').agg(dh=('high','max'),dl=('low','min')).reset_index();d['pdh']=d.dh.shift();d['pdl']=d.dl.shift();x=x.merge(d[['day','pdh','pdl']],on='day',how='left')
 for h in [6,7,8]:
  a=x[x.hour<h].groupby('day').agg(**{f'ah{h}':('high','max'),f'al{h}':('low','min')}).reset_index();x=x.merge(a,on='day',how='left')
 x['h4u']=x.h4_close>x.h4_ema20;x['h4d']=x.h4_close<x.h4_ema20;x['d1u']=x.d1_close>x.d1_ema50;x['d1d']=x.d1_close<x.d1_ema50
 return x.reset_index(drop=True)

def okbias(r,d,m):
 return bool((r.h4u if d==1 else r.h4d) and (m=='h4' or (r.d1u if d==1 else r.d1d)))

def room(r,d,e,risk):
 lv=[r.h4_hi20,r.d1_hi20] if d==1 else [r.h4_lo20,r.d1_lo20];ds=[(v-e if d==1 else e-v) for v in lv if np.isfinite(v) and ((v>e) if d==1 else (v<e))];return 99 if not ds else min(ds)/risk

def entries(x,sym,cfg):
 fam,ss,bias,imp,rb=cfg;s=SPECS[sym];O,H,L,C,A=[x[k].to_numpy(float) for k in ['open','high','low','close','atr']];out=[]
 for _,g in x.groupby('day',sort=True):
  ids=g[(g.hour>=ss)&(g.hour<11)].index.to_numpy(int);chosen=None
  for q,i in enumerate(ids):
   if i<1 or not np.isfinite(A[i]):continue
   r=x.loc[i];hl=(r[f'ah{ss}'],r[f'al{ss}']) if fam=='ASIA' else (r.pdh,r.pdl)
   cand=[]
   if np.isfinite(hl[0]) and C[i-1]<=hl[0] and C[i]>hl[0] and x.at[i,'body']>=imp*A[i] and okbias(r,1,bias):cand.append((1,hl[0]))
   if np.isfinite(hl[1]) and C[i-1]>=hl[1] and C[i]<hl[1] and x.at[i,'body']>=imp*A[i] and okbias(r,-1,bias):cand.append((-1,hl[1]))
   for d,lev in cand:
    for j in ids[q+1:q+1+rb]:
     if j+1>=len(x):break
     b=max(x.at[j,'body'],1e-12);touch=L[j]<=lev+.15*A[j] if d==1 else H[j]>=lev-.15*A[j];rec=C[j]>lev if d==1 else C[j]<lev;pa=(C[j]>O[j] or x.at[j,'lw']>=1.25*b) if d==1 else (C[j]<O[j] or x.at[j,'uw']>=1.25*b)
     if not(touch and rec and pa):continue
     k=j+1;e=O[k];st=(L[max(0,j-7):j+1].min()-.1*A[j]) if d==1 else (H[max(0,j-7):j+1].max()+.1*A[j]);risk=(e-st) if d==1 else (st-e);rp=risk/s['pip']
     if s['minstop']<=rp<=s['maxstop'] and room(x.loc[k],d,e,risk)>=6:
      chosen=dict(symbol=sym,family=fam,session_start=ss,bias=bias,impulse=imp,retest_bars=rb,signal_time=x.at[j,'timestamp'],entry_time=x.at[k,'timestamp'],entry_idx=k,direction=d,entry=e,stop=st,risk=risk,risk_pips=rp);break
    if chosen:break
   if chosen:break
  if chosen:out.append(chosen)
 return pd.DataFrame(out)

def sim(E,x,sym,target,locktrig,lockto,hold):
 if E.empty:
  return pd.DataFrame()
 s=SPECS[sym]
 H,L,C=[x[k].to_numpy(float) for k in ['high','low','close']]
 T=x.timestamp.to_numpy()
 out=[]
 last=-1
 for e in E.itertuples(index=False):
  i=int(e.entry_idx)
  if i<=last:continue
  d=int(e.direction);en=float(e.entry);risk=float(e.risk);st=float(e.stop);tp=en+d*target*risk;end=min(len(x)-1,i+hold);mr=0;lock=False;reason='TIME';ex=end;px=C[end]
  for j in range(i,end+1):
   fav=((H[j]-en) if d==1 else (en-L[j]))/risk;mr=max(mr,fav);sh=L[j]<=st if d==1 else H[j]>=st;th=H[j]>=tp if d==1 else L[j]<=tp
   if sh:reason='LOCK' if lock else 'SL';ex=j;px=st;break
   if th:reason='TP';ex=j;px=tp;break
   if mr>=locktrig:st=max(st,en+lockto*risk) if d==1 else min(st,en-lockto*risk);lock=True
  net=(px-en)*d-s['cost']*s['pip'];out.append({**e._asdict(),'exit_time':pd.Timestamp(T[ex]),'target_r':target,'lock_trigger':locktrig,'lock_to':lockto,'hold':hold,'r':net/risk,'pips':net/s['pip'],'reason':reason});last=ex
 return pd.DataFrame(out)

def met(t,a,b):
 q=t[(pd.to_datetime(t.entry_time)>=a)&(pd.to_datetime(t.entry_time)<=b)] if not t.empty else t
 if q.empty:return dict(trades=0,ppy=0,win=np.nan,tp=np.nan,loss=np.nan,pf=np.nan,exp=np.nan,sumr=0,dd=np.nan)
 w=q.loc[q.r>0,'r'].sum();l=-q.loc[q.r<0,'r'].sum();z=q.sort_values('entry_time').r.cumsum();yrs=max((pd.Timestamp(q.entry_time.max())-pd.Timestamp(q.entry_time.min())).days/365.25,.25)
 return dict(trades=len(q),ppy=len(q)/yrs,win=(q.r>0).mean(),tp=(q.reason=='TP').mean(),loss=(q.reason=='SL').mean(),pf=w/l if l else np.inf,exp=q.r.mean(),sumr=q.r.sum(),dd=(z.cummax()-z).max())

def flatten(cfg,ex,t):
 r=dict(family=cfg[0],session_start=cfg[1],bias=cfg[2],impulse=cfg[3],retest_bars=cfg[4],target_r=ex[0],lock_trigger=ex[1],lock_to=ex[2],hold=ex[3])
 for n,(a,b) in SPLITS.items():
  for k,v in met(t,a,b).items():r[f'{n}_{k}']=v
 return r

def choose(grid):
 g=grid.copy();g['score']=g.DEV_exp.fillna(-9)+.15*np.log1p(g.DEV_trades)+.25*g.DEV_tp.fillna(0)-.015*g.DEV_dd.fillna(99);top=g.sort_values('score',ascending=False).head(20);v=top[(top.VAL_trades>=8)&(top.VAL_exp>0)&(top.VAL_pf>1)]
 return (v.assign(gate=np.minimum(v.DEV_exp,v.VAL_exp)-.01*np.maximum(v.DEV_dd,v.VAL_dd)).sort_values('gate',ascending=False).iloc[0] if not v.empty else top.iloc[0])

def nooverlap(t):
 out=[];last=pd.Timestamp.min
 for r in t.sort_values(['entry_time','symbol']).itertuples(index=False):
  if pd.Timestamp(r.entry_time)<=last:continue
  out.append(r._asdict());last=pd.Timestamp(r.exit_time)
 return pd.DataFrame(out)

def cap(t,mode,risk=.05):
 e=p=START;dd=0;pr=None;ls=0;hit=False;rs=[]
 for q in t.sort_values('entry_time').itertuples(index=False):
  cur=(e-p)/p
  rr=risk if mode=='fixed' else (.03 if cur<=-.2 or ls>=2 else (.08 if e>=.95*p and pr is not None and pr>0 and cur>-.1 else .05));rs.append(rr);e*=max(0,1+rr*q.r);p=max(p,e);dd=max(dd,(p-e)/p);pr=q.r;ls=ls+1 if pr<0 else 0;hit=hit or e>=TARGET
 return e,100*dd,hit,np.mean(rs) if rs else np.nan

def rolling(t):
 if t.empty:
  return pd.DataFrame()
 first=pd.Timestamp(t.entry_time.min()).floor('D').replace(day=1)
 last=pd.Timestamp(t.entry_time.max()).floor('D')
 rows=[]
 for st in pd.date_range(first,last-pd.Timedelta(days=365),freq='MS'):
  en=st+pd.DateOffset(years=1);q=t[(pd.to_datetime(t.entry_time)>=st)&(pd.to_datetime(t.entry_time)<en)]
  if q.empty:continue
  for name,r in [('fixed_01',.01),('fixed_03',.03),('fixed_05',.05),('fixed_08',.08),('fixed_10',.10),('fixed_15',.15),('fixed_20',.20)]:
   e,d,h,a=cap(q,'fixed',r);rows.append(dict(start=st,end=en,model=name,trades=len(q),final=e,dd=d,hit=h,avgrisk=a))
  e,d,h,a=cap(q,'adaptive');rows.append(dict(start=st,end=en,model='adaptive_3_5_8',trades=len(q),final=e,dd=d,hit=h,avgrisk=a))
 return pd.DataFrame(rows)

def main():
 p=argparse.ArgumentParser();p.add_argument('--gbpjpy',type=Path,required=True);p.add_argument('--xauusd',type=Path,required=True);p.add_argument('--outdir',type=Path,required=True);a=p.parse_args();a.outdir.mkdir(parents=True,exist_ok=True)
 sel={};trades={}
 for sym,path in [('GBPJPY',a.gbpjpy),('XAUUSD',a.xauusd)]:
  x=context(load(path,sym));rows=[];cache={}
  cfgs=list(itertools.product(['ASIA','PREV_DAY'],[6,7,8],['h4_d1','h4'],[.4,.6],[4,8]));exits=list(itertools.product([6.,7.],[1.,1.5],[.25,.5],[32,64]))
  for cfg in cfgs:
   E=entries(x,sym,cfg)
   for ex in exits:
    T=sim(E,x,sym,*ex);rows.append(flatten(cfg,ex,T));cache[(cfg,ex)]=T
  g=pd.DataFrame(rows);g.to_csv(a.outdir/f'{sym}_grid.csv',index=False);q=choose(g);sel[sym]=q;cfg=(q.family,int(q.session_start),q.bias,float(q.impulse),int(q.retest_bars));ex=(float(q.target_r),float(q.lock_trigger),float(q.lock_to),int(q.hold));trades[sym]=cache[(cfg,ex)];trades[sym].to_csv(a.outdir/f'{sym}_selected_trades.csv',index=False);pd.DataFrame([q]).to_csv(a.outdir/f'{sym}_selected.csv',index=False)
 comb=nooverlap(pd.concat(trades.values(),ignore_index=True));comb.to_csv(a.outdir/'combined_trades.csv',index=False);rw=rolling(comb);rw.to_csv(a.outdir/'rolling_12m.csv',index=False)
 sm=(rw.groupby('model').agg(windows=('start','count'),hits=('hit','sum'),hit_rate=('hit','mean'),median_final=('final','median'),best_final=('final','max'),worst_dd=('dd','max'),avg_trades=('trades','mean')).reset_index() if not rw.empty else pd.DataFrame());sm.to_csv(a.outdir/'rolling_summary.csv',index=False)
 lines=['# OLD 500 TO 100K EDGE RECONSTRUCTION V2','','Status: `[CAUSAL_BACKTEST] [PERSONAL_RESEARCH_ONLY]`','','Target unchanged: USD 500 to USD 100,000 in rolling 12 months.','','## Selected candidates']
 for sym,q in sel.items():
  lines+=['',f'### {sym}',f'- `{q.family}` session {int(q.session_start):02d}:00-11:00, bias `{q.bias}`, impulse {q.impulse:.2f} ATR, retest {int(q.retest_bars)} bars',f'- target {q.target_r:.1f}R; lock {q.lock_trigger:.1f}R to {q.lock_to:.2f}R; hold {int(q.hold)} M15 bars']
  for n in SPLITS:lines.append(f"- {n}: {int(q[f'{n}_trades'])} trades, {q[f'{n}_ppy']:.2f}/yr, win {100*q[f'{n}_win']:.2f}%, TP {100*q[f'{n}_tp']:.2f}%, PF {q[f'{n}_pf']:.3f}, exp {q[f'{n}_exp']:+.3f}R, sum {q[f'{n}_sumr']:+.2f}R")
 lines+=['','## Combined']
 for n,(u,v) in SPLITS.items():
  m=met(comb,u,v);lines.append(f"- {n}: {m['trades']} trades, {m['ppy']:.2f}/yr, win {100*m['win']:.2f}%, TP {100*m['tp']:.2f}%, PF {m['pf']:.3f}, exp {m['exp']:+.3f}R, sum {m['sumr']:+.2f}R, DD {m['dd']:.2f}R")
 lines+=['','## Rolling capital','']
 if sm.empty:lines.append('No eligible windows.')
 else:
  lines+=['| Model | Windows | Hits | Hit rate | Median final | Best final | Worst DD |','|---|---:|---:|---:|---:|---:|---:|']
  for r in sm.itertuples(index=False):lines.append(f'| {r.model} | {r.windows} | {r.hits} | {100*r.hit_rate:.2f}% | ${r.median_final:,.2f} | ${r.best_final:,.2f} | {r.worst_dd:.2f}% |')
 hit=(not sm.empty and sm.hits.sum()>0);lines+=['','## Decision','', '`TARGET_HIT_IN_AT_LEAST_ONE_WINDOW`' if hit else '`REJECTED_FOR_500_TO_100K_TARGET`','', 'A hit is not live-capital approval; broker-specific replication is still required.']
 (a.outdir/'REPORT.md').write_text('\n'.join(lines)+'\n');print('\n'.join(lines))
if __name__=='__main__':main()
