#!/usr/bin/env python3
"""V3 causal multi-engine London expansion research. Personal research only."""
from __future__ import annotations
import argparse,itertools
from pathlib import Path
import numpy as np,pandas as pd

START,TARGET=500.0,100000.0
SPECS={
 'GBPJPY':dict(scale=1000.0,pip=.01,cost=2.0,minstop=8,maxstop=70,fixed=17,wide=25),
 'XAUUSD':dict(scale=100.0,pip=.10,cost=4.0,minstop=15,maxstop=160,fixed=35,wide=50),
}
SPLITS={'DEV':('2012-01-01','2018-12-31 23:59:59'),'VAL':('2019-01-01','2021-12-31 23:59:59'),'OOS':('2022-01-01','2100-01-01'),'ALL':('1900-01-01','2100-01-01')}

def tr(x):
 p=x.close.shift();return pd.concat([x.high-x.low,(x.high-p).abs(),(x.low-p).abs()],axis=1).max(axis=1)

def load(path,sym):
 s=SPECS[sym];r=pd.read_csv(path);c={str(k).lower().strip():k for k in r.columns};tc=c.get('date') or c.get('time')
 x=pd.DataFrame({'timestamp':pd.to_datetime(r[tc]),**{k:pd.to_numeric(r[c[k]],errors='coerce')/s['scale'] for k in ['open','high','low','close']}}).dropna().sort_values('timestamp').drop_duplicates('timestamp').reset_index(drop=True)
 x['atr']=tr(x).ewm(alpha=1/14,adjust=False,min_periods=14).mean();x['body']=(x.close-x.open).abs();x['range']=(x.high-x.low).clip(lower=1e-12);x['clv']=(x.close-x.low)/x['range'];x['day']=x.timestamp.dt.floor('D');x['hour']=x.timestamp.dt.hour
 x['hi8']=x.high.rolling(8).max().shift();x['lo8']=x.low.rolling(8).min().shift();x['swlo8']=x.low.rolling(8).min();x['swhi8']=x.high.rolling(8).max()
 return x

def tf(x,rule,h,p):
 z=x.set_index('timestamp').resample(rule,label='left',closed='left',origin='start_day').agg(open=('open','first'),high=('high','max'),low=('low','min'),close=('close','last')).dropna().reset_index()
 z['ema20']=z.close.ewm(span=20,adjust=False,min_periods=20).mean();z['ema50']=z.close.ewm(span=50,adjust=False,min_periods=50).mean();z['available']=z.timestamp+pd.Timedelta(hours=h)
 return z[['available','close','ema20','ema50']].rename(columns={k:f'{p}_{k}' for k in ['close','ema20','ema50']})

def context(x):
 for z in [tf(x,'4h',4,'h4'),tf(x,'1D',24,'d1')]:
  x=pd.merge_asof(x.sort_values('timestamp'),z.sort_values('available'),left_on='timestamp',right_on='available',direction='backward').drop(columns='available')
 d=x.groupby('day').agg(dh=('high','max'),dl=('low','min')).reset_index();d['pdh']=d.dh.shift();d['pdl']=d.dl.shift();x=x.merge(d[['day','pdh','pdl']],on='day',how='left')
 for h in [6,7,8]:
  a=x[x.hour<h].groupby('day').agg(**{f'ah{h}':('high','max'),f'al{h}':('low','min')}).reset_index();x=x.merge(a,on='day',how='left')
 x['h4u']=x.h4_close>x.h4_ema20;x['h4d']=x.h4_close<x.h4_ema20;x['d1u']=x.d1_close>x.d1_ema50;x['d1d']=x.d1_close<x.d1_ema50
 return x.reset_index(drop=True)

def bias_arrays(x,mode):
 if mode=='none':return pd.Series(True,index=x.index),pd.Series(True,index=x.index)
 lo=x.h4u.fillna(False);sh=x.h4d.fillna(False)
 if mode=='h4_d1':lo&=x.d1u.fillna(False);sh&=x.d1d.fillna(False)
 return lo,sh

def signals(x,cfg):
 fam,ss,bias,imp=cfg;lo_bias,sh_bias=bias_arrays(x,bias);session=(x.hour>=ss)&(x.hour<11);strong=x.body>=imp*x.atr
 ah=x[f'ah{ss}'];al=x[f'al{ss}'];prev=x.close.shift()
 if fam=='ASIA_BREAK':
  lo=session&strong&lo_bias&(prev<=ah)&(x.close>ah);sh=session&strong&sh_bias&(prev>=al)&(x.close<al)
 elif fam=='PD_BREAK':
  lo=session&strong&lo_bias&(prev<=x.pdh)&(x.close>x.pdh);sh=session&strong&sh_bias&(prev>=x.pdl)&(x.close<x.pdl)
 elif fam=='COMP_BREAK':
  comp=(ah-al)/x.atr<=4.0;lo=session&comp&strong&lo_bias&(prev<=ah)&(x.close>ah);sh=session&comp&strong&sh_bias&(prev>=al)&(x.close<al)
 elif fam=='ASIA_SWEEP':
  lo=session&lo_bias&(x.low<al-.10*x.atr)&(x.close>al)&(x.clv>=.55);sh=session&sh_bias&(x.high>ah+.10*x.atr)&(x.close<ah)&(x.clv<=.45)
 elif fam=='MOMENTUM':
  lo=session&strong&lo_bias&(x.close>x.hi8)&(x.clv>=.75);sh=session&strong&sh_bias&(x.close<x.lo8)&(x.clv<=.25)
 else:raise ValueError(fam)
 both=lo&sh;lo&=~both;sh&=~both;idx=np.flatnonzero((lo|sh).fillna(False).to_numpy())
 if not len(idx):return pd.DataFrame()
 z=pd.DataFrame({'signal_idx':idx,'day':x.day.iloc[idx].to_numpy(),'direction':np.where(lo.iloc[idx].to_numpy(),1,-1)})
 return z.drop_duplicates('day',keep='first').reset_index(drop=True)

def entries(x,sym,cfg,stop_mode):
 z=signals(x,cfg)
 if z.empty:return pd.DataFrame()
 s=SPECS[sym];rows=[]
 for q in z.itertuples(index=False):
  i=int(q.signal_idx);k=i+1
  if k>=len(x) or x.day.iat[k]!=x.day.iat[i]:continue
  d=int(q.direction);en=float(x.open.iat[k]);atr=float(x.atr.iat[i])
  if stop_mode=='fixed':dist=s['fixed']*s['pip'];st=en-d*dist
  elif stop_mode=='wide':dist=s['wide']*s['pip'];st=en-d*dist
  elif stop_mode=='signal':st=float(x.low.iat[i]-.10*atr) if d==1 else float(x.high.iat[i]+.10*atr);dist=(en-st)*d
  elif stop_mode=='swing8':st=float(x.swlo8.iat[i]-.05*atr) if d==1 else float(x.swhi8.iat[i]+.05*atr);dist=(en-st)*d
  else:raise ValueError(stop_mode)
  rp=dist/s['pip']
  if not np.isfinite(dist) or dist<=0 or not(s['minstop']<=rp<=s['maxstop']):continue
  rows.append(dict(symbol=sym,family=cfg[0],session_start=cfg[1],bias=cfg[2],impulse=cfg[3],stop_mode=stop_mode,signal_time=x.timestamp.iat[i],entry_time=x.timestamp.iat[k],entry_idx=k,direction=d,entry=en,stop=st,risk=dist,risk_pips=rp))
 return pd.DataFrame(rows)

def sim(E,x,sym,target,locktrig,lockto,hold):
 if E.empty:return pd.DataFrame()
 s=SPECS[sym];H=x.high.to_numpy(float);L=x.low.to_numpy(float);C=x.close.to_numpy(float);T=x.timestamp.to_numpy();out=[];last=-1
 for e in E.itertuples(index=False):
  i=int(e.entry_idx)
  if i<=last:continue
  d=int(e.direction);en=float(e.entry);risk=float(e.risk);st=float(e.stop);tp=en+d*target*risk;end=min(len(x)-1,i+hold);mr=0.;lock=False;reason='TIME';ex=end;px=C[end]
  for j in range(i,end+1):
   fav=((H[j]-en) if d==1 else (en-L[j]))/risk;mr=max(mr,fav);stop_hit=L[j]<=st if d==1 else H[j]>=st;tp_hit=H[j]>=tp if d==1 else L[j]<=tp
   if stop_hit:reason='LOCK' if lock else 'SL';ex=j;px=st;break
   if tp_hit:reason='TP';ex=j;px=tp;break
   if mr>=locktrig:st=max(st,en+lockto*risk) if d==1 else min(st,en-lockto*risk);lock=True
  net=(px-en)*d-s['cost']*s['pip'];out.append({**e._asdict(),'exit_time':pd.Timestamp(T[ex]),'target_r':target,'lock_trigger':locktrig,'lock_to':lockto,'hold':hold,'r':net/risk,'pips':net/s['pip'],'mfe_r':mr,'reason':reason});last=ex
 return pd.DataFrame(out)

def met(t,a,b):
 q=t[(pd.to_datetime(t.entry_time)>=a)&(pd.to_datetime(t.entry_time)<=b)] if not t.empty else t
 if q.empty:return dict(trades=0,ppy=0,win=np.nan,tp=np.nan,loss=np.nan,pf=np.nan,exp=np.nan,sumr=0,dd=np.nan)
 w=q.loc[q.r>0,'r'].sum();l=-q.loc[q.r<0,'r'].sum();eq=q.sort_values('entry_time').r.cumsum();yrs=max((pd.Timestamp(q.entry_time.max())-pd.Timestamp(q.entry_time.min())).days/365.25,.25)
 return dict(trades=len(q),ppy=len(q)/yrs,win=(q.r>0).mean(),tp=(q.reason=='TP').mean(),loss=(q.reason=='SL').mean(),pf=w/l if l else np.inf,exp=q.r.mean(),sumr=q.r.sum(),dd=(eq.cummax()-eq).max())

def row_metrics(meta,t):
 r=dict(meta)
 for n,(a,b) in SPLITS.items():
  for k,v in met(t,a,b).items():r[f'{n}_{k}']=v
 return r

def robust_score(r):
 mn=min(r.DEV_exp,r.VAL_exp);freq=min(r.DEV_ppy,r.VAL_ppy);tp=min(r.DEV_tp,r.VAL_tp);dd=max(r.DEV_dd,r.VAL_dd)
 return mn+.018*min(freq,30)+.35*tp-.012*dd

def nooverlap(t):
 if t.empty:return t
 out=[];last=pd.Timestamp.min
 for r in t.sort_values(['entry_time','symbol','family']).itertuples(index=False):
  if pd.Timestamp(r.entry_time)<=last:continue
  out.append(r._asdict());last=pd.Timestamp(r.exit_time)
 return pd.DataFrame(out)

def select_engines(grid,cache,max_engines=3):
 g=grid.copy();valid=g[(g.DEV_trades>=45)&(g.VAL_trades>=15)&(g.DEV_exp>0)&(g.VAL_exp>0)&(g.DEV_pf>1)&(g.VAL_pf>1)].copy()
 pool=valid if not valid.empty else g[(g.DEV_trades>=25)&(g.VAL_trades>=8)].copy()
 if pool.empty:pool=g.copy()
 pool['robust']=pool.apply(robust_score,axis=1);pool=pool.sort_values('robust',ascending=False)
 chosen=[];families=set()
 for r in pool.itertuples(index=False):
  if r.family in families:continue
  chosen.append(r);families.add(r.family)
  if len(chosen)>=max_engines:break
 keys=[r.engine_key for r in chosen];t=nooverlap(pd.concat([cache[k] for k in keys],ignore_index=True)) if keys else pd.DataFrame()
 return chosen,t,not valid.empty

def cap(t,mode,risk=.05):
 e=p=START;dd=0.;prev=None;losses=0;hit=False;rs=[]
 for q in t.sort_values('entry_time').itertuples(index=False):
  cur=(e-p)/p;rr=risk if mode=='fixed' else (.03 if cur<=-.20 or losses>=2 else (.08 if e>=.95*p and prev is not None and prev>0 and cur>-.10 else .05));rs.append(rr);e*=max(0.,1+rr*q.r);p=max(p,e);dd=max(dd,(p-e)/p);prev=q.r;losses=losses+1 if q.r<0 else 0;hit|=e>=TARGET
 return e,100*dd,hit,np.mean(rs) if rs else np.nan

def rolling(t):
 if t.empty:return pd.DataFrame()
 first=pd.Timestamp(t.entry_time.min()).floor('D').replace(day=1);last=pd.Timestamp(t.entry_time.max()).floor('D');rows=[]
 for st in pd.date_range(first,last-pd.Timedelta(days=365),freq='MS'):
  en=st+pd.DateOffset(years=1);q=t[(pd.to_datetime(t.entry_time)>=st)&(pd.to_datetime(t.entry_time)<en)]
  if q.empty:continue
  for name,r in [('fixed_01',.01),('fixed_03',.03),('fixed_05',.05),('fixed_08',.08),('fixed_10',.10),('fixed_15',.15),('fixed_20',.20)]:
   e,d,h,av=cap(q,'fixed',r);rows.append(dict(start=st,end=en,model=name,trades=len(q),final=e,dd=d,hit=h,avgrisk=av))
  e,d,h,av=cap(q,'adaptive');rows.append(dict(start=st,end=en,model='adaptive_3_5_8',trades=len(q),final=e,dd=d,hit=h,avgrisk=av))
 return pd.DataFrame(rows)

def research_symbol(x,sym,outdir):
 base_cfgs=list(itertools.product(['ASIA_BREAK','PD_BREAK','COMP_BREAK','ASIA_SWEEP','MOMENTUM'],[6,7,8],['h4_d1','h4','none'],[.25,.40,.60],['fixed','wide','signal','swing8']))
 stage=[];entry_cache={}
 for fam,ss,bias,imp,stop in base_cfgs:
  cfg=(fam,ss,bias,imp);E=entries(x,sym,cfg,stop);key=f'{fam}|{ss}|{bias}|{imp}|{stop}';entry_cache[key]=E;T=sim(E,x,sym,6.,1.,.5,64);stage.append(row_metrics(dict(engine_key=key,family=fam,session_start=ss,bias=bias,impulse=imp,stop_mode=stop,target_r=6.,lock_trigger=1.,lock_to=.5,hold=64),T))
 s1=pd.DataFrame(stage);s1['screen']=s1.apply(lambda r:min(r.DEV_exp,r.VAL_exp)+.012*min(r.DEV_ppy,r.VAL_ppy)+.20*min(r.DEV_tp,r.VAL_tp),axis=1);top=s1.sort_values('screen',ascending=False).head(15)
 exits=list(itertools.product([4.,5.,6.,7.],[.75,1.,1.5],[.25,.5],[32,64]));rows=[];cache={}
 for b in top.itertuples(index=False):
  E=entry_cache[b.engine_key]
  for ex in exits:
   T=sim(E,x,sym,*ex);k=f'{b.engine_key}|{ex[0]}|{ex[1]}|{ex[2]}|{ex[3]}';cache[k]=T;meta=dict(engine_key=k,family=b.family,session_start=b.session_start,bias=b.bias,impulse=b.impulse,stop_mode=b.stop_mode,target_r=ex[0],lock_trigger=ex[1],lock_to=ex[2],hold=ex[3]);rows.append(row_metrics(meta,T))
 grid=pd.DataFrame(rows);selected,portfolio,passed=select_engines(grid,cache);s1.to_csv(outdir/f'{sym}_stage1.csv',index=False);grid.to_csv(outdir/f'{sym}_stage2.csv',index=False);pd.DataFrame([r._asdict() for r in selected]).to_csv(outdir/f'{sym}_selected_engines.csv',index=False);portfolio.to_csv(outdir/f'{sym}_portfolio_trades.csv',index=False)
 return selected,portfolio,passed

def main():
 p=argparse.ArgumentParser();p.add_argument('--gbpjpy',type=Path,required=True);p.add_argument('--xauusd',type=Path,required=True);p.add_argument('--outdir',type=Path,required=True);a=p.parse_args();a.outdir.mkdir(parents=True,exist_ok=True)
 selected={};ports={};gates={}
 for sym,path in [('GBPJPY',a.gbpjpy),('XAUUSD',a.xauusd)]:selected[sym],ports[sym],gates[sym]=research_symbol(context(load(path,sym)),sym,a.outdir)
 combined=nooverlap(pd.concat(ports.values(),ignore_index=True));combined.to_csv(a.outdir/'combined_trades.csv',index=False);rw=rolling(combined);rw.to_csv(a.outdir/'rolling_12m.csv',index=False)
 sm=rw.groupby('model').agg(windows=('start','count'),hits=('hit','sum'),hit_rate=('hit','mean'),median_final=('final','median'),best_final=('final','max'),worst_dd=('dd','max'),avg_trades=('trades','mean')).reset_index() if not rw.empty else pd.DataFrame();sm.to_csv(a.outdir/'rolling_summary.csv',index=False)
 lines=['# CAPITAL PATH LONDON EXPANSION MULTI-ENGINE V3','','Status: `[CAUSAL_BACKTEST] [PERSONAL_RESEARCH_ONLY]`','','Target unchanged: USD 500 to USD 100,000 in rolling 12 months.']
 for sym in ['GBPJPY','XAUUSD']:
  lines+=['',f'## {sym} selected engines',f'- strict development/validation gate available: `{gates[sym]}`']
  for i,r in enumerate(selected[sym],1):lines.append(f"- E{i}: {r.family}, session {int(r.session_start):02d}, bias {r.bias}, impulse {r.impulse:.2f}, stop {r.stop_mode}, target {r.target_r:.0f}R, lock {r.lock_trigger:.2f}R→{r.lock_to:.2f}R, hold {int(r.hold)}; DEV {r.DEV_ppy:.1f}/yr {r.DEV_exp:+.3f}R; VAL {r.VAL_ppy:.1f}/yr {r.VAL_exp:+.3f}R")
  for n,(u,v) in SPLITS.items():
   m=met(ports[sym],u,v);lines.append(f"- {n} portfolio: {m['trades']} trades, {m['ppy']:.2f}/yr, win {100*m['win']:.2f}%, TP {100*m['tp']:.2f}%, PF {m['pf']:.3f}, exp {m['exp']:+.3f}R, sum {m['sumr']:+.2f}R, DD {m['dd']:.2f}R")
 lines+=['','## Combined portfolio']
 for n,(u,v) in SPLITS.items():
  m=met(combined,u,v);lines.append(f"- {n}: {m['trades']} trades, {m['ppy']:.2f}/yr, win {100*m['win']:.2f}%, TP {100*m['tp']:.2f}%, PF {m['pf']:.3f}, exp {m['exp']:+.3f}R, sum {m['sumr']:+.2f}R, DD {m['dd']:.2f}R")
 lines+=['','## Rolling capital','','| Model | Windows | Hits | Hit rate | Median final | Best final | Worst DD | Avg trades |','|---|---:|---:|---:|---:|---:|---:|---:|']
 for r in sm.itertuples(index=False):lines.append(f'| {r.model} | {r.windows} | {r.hits} | {100*r.hit_rate:.2f}% | ${r.median_final:,.2f} | ${r.best_final:,.2f} | {r.worst_dd:.2f}% | {r.avg_trades:.2f} |')
 hit=not sm.empty and sm.hits.sum()>0;lines+=['','## Decision','', '`TARGET_HIT_IN_AT_LEAST_ONE_WINDOW`' if hit else '`REJECTED_FOR_500_TO_100K_TARGET`','', 'A target hit is only a research event and is not approval for live capital.']
 (a.outdir/'REPORT.md').write_text('\n'.join(lines)+'\n');print('\n'.join(lines))

if __name__=='__main__':main()
