#!/usr/bin/env python3
"""GBPJPY Range-to-Expansion V1. Personal research only; no orders."""
from __future__ import annotations
import argparse,itertools,sys
from pathlib import Path
import numpy as np,pandas as pd
sys.path.insert(0,str(Path(__file__).resolve().parent))
import old_500_to_100k_edge_reconstruction_v2 as core
PIP=.01
SPLITS=core.SPLITS

def features(path):
 x=core.context(core.load(path,'GBPJPY'))
 x['ema20']=x.close.ewm(span=20,adjust=False,min_periods=20).mean();x['sma200']=x.close.rolling(200,min_periods=200).mean()
 mid=x.close.rolling(20,min_periods=20).mean();sd=x.close.rolling(20,min_periods=20).std(ddof=0)
 x['bbu1']=mid+sd;x['bbl1']=mid-sd;x['bbu2']=mid+2*sd;x['bbl2']=mid-2*sd;x['bbw']=(x.bbu2-x.bbl2)/mid.abs();x['bbw_med']=x.bbw.rolling(100,min_periods=50).median();x['bbw_ratio']=x.bbw/x.bbw_med.replace(0,np.nan)
 x['slope']=(x.ema20-x.ema20.shift(4))/x.atr.replace(0,np.nan);side=np.sign(x.close-x.ema20);x['crosses']=side.ne(side.shift()).rolling(12,min_periods=6).sum();x['clv']=(x.close-x.low)/(x.high-x.low).replace(0,np.nan)
 h=x.set_index('timestamp').resample('1h',label='left',closed='left',origin='start_day').agg(open=('open','first'),high=('high','max'),low=('low','min'),close=('close','last')).dropna().reset_index();h['ema20']=h.close.ewm(span=20,adjust=False,min_periods=20).mean();h['sma200']=h.close.rolling(200,min_periods=200).mean();h['slope']=h.ema20-h.ema20.shift(3);h['available']=h.timestamp+pd.Timedelta(hours=1);h=h[['available','close','ema20','sma200','slope']].rename(columns={c:f'h1_{c}' for c in ['close','ema20','sma200','slope']})
 x=pd.merge_asof(x.sort_values('timestamp'),h.sort_values('available'),left_on='timestamp',right_on='available',direction='backward').drop(columns='available')
 d=x.groupby('day').agg(open=('open','first'),high=('high','max'),low=('low','min'),close=('close','last')).reset_index();d['range_pips']=(d.high-d.low)/PIP;d['adr20']=d.range_pips.rolling(20,min_periods=10).mean().shift();d['pdh']=d.high.shift();d['pdl']=d.low.shift();d['pd_range_pips']=d.range_pips.shift();d['pd_ratio']=d.pd_range_pips/d.adr20.replace(0,np.nan);d['d2h']=d.high.shift(2);d['d2l']=d.low.shift(2)
 x=x.drop(columns=['pdh','pdl'],errors='ignore').merge(d[['day','pdh','pdl','pd_range_pips','pd_ratio','adr20','d2h','d2l']],on='day',how='left')
 rng=(x.bbw_ratio<=.95)&(x.slope.abs()<=.18)&(x.crosses>=3);tr=((x.close>=x.bbu1)&(x.slope>=.08)&(x.bbw>x.bbw.shift(4)))|((x.close<=x.bbl1)&(x.slope<=-.08)&(x.bbw>x.bbw.shift(4)));x['regime']=np.select([rng,tr],['RANGE','TREND'],default='WAIT')
 return x.reset_index(drop=True),d

def htf(x,d,mode):
 if mode=='none':return pd.Series(True,index=x.index)
 h=((x.h1_close>x.h1_sma200)&(x.h1_slope>0)) if d==1 else ((x.h1_close<x.h1_sma200)&(x.h1_slope<0))
 if mode=='h1':return h.fillna(False)
 q=x.h4u if d==1 else x.h4d
 return (h&q).fillna(False)

def compressed(x,pips,ratio):return x.pd_range_pips.notna()&x.pd_ratio.notna()&((x.pd_range_pips<=pips)|(x.pd_ratio<=ratio))
def quarter(p):return round(p*4)/4

def breakout_entries(x,cfg):
 pips,ratio,buf,body,mode,entry_mode=cfg;b=buf*PIP;c=compressed(x,pips,ratio);prev=x.close.shift();base=c&x.pdh.notna()&x.pdl.notna()&x.atr.notna()&(x.body>=body*x.atr)&(x.bbw>x.bbw.shift(4))
 lm=base&(prev<=x.pdh)&(x.close>x.pdh+b)&(x.clv>=.65)&(x.slope>.05)&htf(x,1,mode);sm=base&(prev>=x.pdl)&(x.close<x.pdl-b)&(x.clv<=.35)&(x.slope<-.05)&htf(x,-1,mode)
 out=[];seen=set()
 for i in np.flatnonzero((lm|sm).to_numpy()):
  if i+2>=len(x) or x.at[i,'day'] in seen:continue
  d=1 if lm.iat[i] else -1;lev=float(x.at[i,'pdh'] if d==1 else x.at[i,'pdl']);j=i+1;a=x.loc[j]
  if not((a.close>lev) if d==1 else (a.close<lev)):continue
  if entry_mode=='retest' and not((a.low<=lev+.15*a.atr) if d==1 else (a.high>=lev-.15*a.atr)):continue
  k=j+1
  if x.at[k,'day']!=x.at[i,'day']:continue
  en=float(x.at[k,'open']);st=en-d*17*PIP;out.append(dict(symbol='GBPJPY',family='BREAKOUT',signal_time=x.at[i,'timestamp'],entry_time=x.at[k,'timestamp'],entry_idx=k,direction=d,entry=en,stop=st,risk=17*PIP,risk_pips=17.,level=lev,quarter_level=quarter(lev),quarter_distance_pips=abs(lev-quarter(lev))/PIP,pd_range_pips=x.at[i,'pd_range_pips'],pd_ratio=x.at[i,'pd_ratio'],**dict(zip(['pips_cut','ratio_cut','buffer_pips','body_atr','htf_mode','entry_mode'],cfg))));seen.add(x.at[i,'day'])
 return pd.DataFrame(out)

def range_entries(x,cfg):
 pips,ratio,sweep,stopmode,target=cfg;c=compressed(x,pips,ratio);w=x.pdh-x.pdl;pos=(x.close-x.pdl)/w.replace(0,np.nan);base=(~c)&(x.regime=='RANGE')&(w>0)
 lm=base&(x.low<x.pdl-sweep*PIP)&(x.close>x.pdl)&(pos<=.3);sm=base&(x.high>x.pdh+sweep*PIP)&(x.close<x.pdh)&(pos>=.7);out=[];seen=set()
 for i in np.flatnonzero((lm|sm).to_numpy()):
  if i+1>=len(x) or x.at[i,'day'] in seen:continue
  d=1 if lm.iat[i] else -1;lev=float(x.at[i,'pdl'] if d==1 else x.at[i,'pdh']);k=i+1;en=float(x.at[k,'open'])
  if stopmode=='fixed17':risk=17*PIP;st=en-d*risk
  else:
   st=float(x.loc[max(0,i-7):i,'low'].min()-.08*x.at[i,'atr']) if d==1 else float(x.loc[max(0,i-7):i,'high'].max()+.08*x.at[i,'atr']);risk=(en-st)*d
  if not(8<=risk/PIP<=55):continue
  out.append(dict(symbol='GBPJPY',family='RANGE',signal_time=x.at[i,'timestamp'],entry_time=x.at[k,'timestamp'],entry_idx=k,direction=d,entry=en,stop=st,risk=risk,risk_pips=risk/PIP,level=lev,quarter_level=quarter(lev),quarter_distance_pips=abs(lev-quarter(lev))/PIP,pd_range_pips=x.at[i,'pd_range_pips'],pd_ratio=x.at[i,'pd_ratio'],pips_cut=pips,ratio_cut=ratio,buffer_pips=sweep,body_atr=np.nan,htf_mode='range',entry_mode='sweep_reclaim',stop_mode=stopmode,target_r=target));seen.add(x.at[i,'day'])
 return pd.DataFrame(out)

def stats(t):
 r={}
 for n,(a,b) in SPLITS.items():
  m=core.met(t,a,b)
  for k,v in m.items():r[f'{n}_{k}']=v
 return r

def choose(g):
 q=g.copy();valid=q[(q.DEV_trades>=20)&(q.VAL_trades>=8)&(q.DEV_exp>0)&(q.VAL_exp>0)]
 q=valid if not valid.empty else q;q['score']=np.minimum(q.DEV_exp.fillna(-9),q.VAL_exp.fillna(-9))+.02*np.log1p(q.DEV_trades+q.VAL_trades)+.2*np.minimum(q.DEV_tp.fillna(0),q.VAL_tp.fillna(0))-.01*np.maximum(q.DEV_dd.fillna(99),q.VAL_dd.fillna(99));return q.sort_values('score',ascending=False).iloc[0]

def compression_report(d):
 q=d.dropna(subset=['pdh','pdl','pd_range_pips','pd_ratio']).copy();q['up']=((q.high-q.pdh)/PIP).clip(lower=0);q['dn']=((q.pdl-q.low)/PIP).clip(lower=0);q['exp']=q[['up','dn']].max(axis=1);rows=[]
 for name,mask in {'pd_le50':q.pd_range_pips<=50,'pd_50_75':(q.pd_range_pips>50)&(q.pd_range_pips<=75),'pd_75_100':(q.pd_range_pips>75)&(q.pd_range_pips<=100),'pd_gt100':q.pd_range_pips>100,'pd_ratio_le50':q.pd_ratio<=.5,'all':pd.Series(True,index=q.index)}.items():
  z=q[mask]
  if z.empty:continue
  rows.append(dict(bucket=name,days=len(z),prev_range=z.pd_range_pips.median(),next_range=z.range_pips.median(),median_exp=z.exp.median(),p25=(z.exp>=25).mean(),p50=(z.exp>=50).mean(),p75=(z.exp>=75).mean(),p100=(z.exp>=100).mean()))
 return pd.DataFrame(rows)

def regime_cap(t):
 e=p=500.;dd=0.;hit=False
 for z in t.sort_values('entry_time').itertuples(index=False):
  risk=.0025 if z.family=='RANGE' else .01;e*=max(0,1+risk*z.r);p=max(p,e);dd=max(dd,(p-e)/p);hit|=e>=100000
 return e,100*dd,hit

def rolling(t):
 if t.empty:return pd.DataFrame()
 first=pd.Timestamp(t.entry_time.min()).replace(day=1).floor('D');last=pd.Timestamp(t.entry_time.max()).floor('D');rows=[]
 for st in pd.date_range(first,last-pd.Timedelta(days=365),freq='MS'):
  en=st+pd.DateOffset(years=1);q=t[(pd.to_datetime(t.entry_time)>=st)&(pd.to_datetime(t.entry_time)<en)]
  if q.empty:continue
  for name,r in [('fixed_01',.01),('fixed_03',.03),('fixed_05',.05),('fixed_08',.08),('fixed_10',.10),('fixed_15',.15),('fixed_20',.20)]:
   e,d,h,a=core.cap(q,'fixed',r);rows.append(dict(start=st,end=en,model=name,trades=len(q),final=e,dd=d,hit=h))
  e,d,h=regime_cap(q);rows.append(dict(start=st,end=en,model='regime_025_100',trades=len(q),final=e,dd=d,hit=h))
 return pd.DataFrame(rows)

def main():
 p=argparse.ArgumentParser();p.add_argument('--m15',type=Path,required=True);p.add_argument('--outdir',type=Path,required=True);a=p.parse_args();a.outdir.mkdir(parents=True,exist_ok=True);x,d=features(a.m15)
 cr=compression_report(d);cr.to_csv(a.outdir/'compression_stats.csv',index=False);rg=x.groupby('regime').size().rename('bars').reset_index();rg['share']=rg.bars/rg.bars.sum();rg.to_csv(a.outdir/'regime_occupancy.csv',index=False)
 rows=[];cache={}
 for cfg in itertools.product([40.,50.,60.],[.4,.5,.6],[2.,4.,6.],[.4,.6],['none','h1','h1h4'],['accept','retest']):
  E=breakout_entries(x,cfg);T=core.sim(E,x,'GBPJPY',6.,1.,.25,64);rows.append({**dict(zip(['pips_cut','ratio_cut','buffer_pips','body_atr','htf_mode','entry_mode'],cfg)),**stats(T)});cache[cfg]=E
 g=pd.DataFrame(rows);g.to_csv(a.outdir/'breakout_stage1.csv',index=False);b=choose(g);cfg=(float(b.pips_cut),float(b.ratio_cut),float(b.buffer_pips),float(b.body_atr),b.htf_mode,b.entry_mode);E=cache[cfg]
 rows=[];cache2={}
 for ex in itertools.product([4.,6.,8.],[1.,1.5],[.25,.5],[32,64,96]):
  T=core.sim(E,x,'GBPJPY',*ex);rows.append({**dict(zip(['target_r','lock_trigger','lock_to','hold'],ex)),**stats(T)});cache2[ex]=T
 egrid=pd.DataFrame(rows);egrid.to_csv(a.outdir/'breakout_stage2.csv',index=False);be=choose(egrid);ex=(float(be.target_r),float(be.lock_trigger),float(be.lock_to),int(be.hold));bt=cache2[ex];bt.to_csv(a.outdir/'breakout_trades.csv',index=False)
 rows=[];rc={}
 for c in itertools.product([40.,50.,60.],[.4,.5,.6],[1.,2.,4.],['fixed17','structure8'],[1.25,1.5,2.]):
  E=range_entries(x,c);T=core.sim(E,x,'GBPJPY',c[-1],.75,.10,16);rows.append({**dict(zip(['pips_cut','ratio_cut','sweep','stop_mode','target_r'],c)),**stats(T)});rc[c]=T
 rgrid=pd.DataFrame(rows);rgrid.to_csv(a.outdir/'range_grid.csv',index=False);br=choose(rgrid);rk=(float(br.pips_cut),float(br.ratio_cut),float(br.sweep),br.stop_mode,float(br.target_r));rt=rc[rk];rt.to_csv(a.outdir/'range_trades.csv',index=False)
 comb=core.nooverlap(pd.concat([bt,rt],ignore_index=True));comb.to_csv(a.outdir/'combined_trades.csv',index=False);rw=rolling(comb);rw.to_csv(a.outdir/'rolling_12m.csv',index=False);sm=rw.groupby('model').agg(windows=('start','count'),hits=('hit','sum'),hit_rate=('hit','mean'),median_final=('final','median'),best_final=('final','max'),worst_dd=('dd','max'),avg_trades=('trades','mean')).reset_index() if not rw.empty else pd.DataFrame();sm.to_csv(a.outdir/'rolling_summary.csv',index=False)
 L=['# GBPJPY RANGE-TO-EXPANSION V1','','Status: `[CAUSAL_M15_BACKTEST] [M1_NOT_YET_TESTED]`','','Target unchanged: USD 500 to USD 100,000 in rolling 12 months.','','## Compression evidence','',cr.to_markdown(index=False,floatfmt='.3f'),'','## Regime occupancy','',rg.to_markdown(index=False,floatfmt='.4f'),'','## Selected breakout',f'- Compression <= {cfg[0]:.0f} pips OR <= {cfg[1]:.0%} ADR20; buffer {cfg[2]} pips; body {cfg[3]} ATR; HTF {cfg[4]}; entry {cfg[5]}',f'- Exit {ex[0]}R; lock {ex[1]}R -> {ex[2]}R; hold {ex[3]} M15 bars']
 for n,(u,v) in SPLITS.items():
  m=core.met(bt,u,v);L.append(f"- {n}: {m['trades']} trades, {m['ppy']:.2f}/yr, win {100*m['win']:.2f}%, TP {100*m['tp']:.2f}%, PF {m['pf']:.3f}, exp {m['exp']:+.3f}R, sum {m['sumr']:+.2f}R")
 L+=['','## Selected range',f'- Non-compressed only; rule {rk[0]:.0f} pips / {rk[1]:.0%} ADR20; sweep {rk[2]} pips; stop {rk[3]}; target {rk[4]}R']
 for n,(u,v) in SPLITS.items():
  m=core.met(rt,u,v);L.append(f"- {n}: {m['trades']} trades, {m['ppy']:.2f}/yr, win {100*m['win']:.2f}%, PF {m['pf']:.3f}, exp {m['exp']:+.3f}R, sum {m['sumr']:+.2f}R")
 L+=['','## Combined']
 for n,(u,v) in SPLITS.items():
  m=core.met(comb,u,v);L.append(f"- {n}: {m['trades']} trades, {m['ppy']:.2f}/yr, win {100*m['win']:.2f}%, TP {100*m['tp']:.2f}%, PF {m['pf']:.3f}, exp {m['exp']:+.3f}R, sum {m['sumr']:+.2f}R, DD {m['dd']:.2f}R")
 L+=['','## Rolling capital','',sm.to_markdown(index=False,floatfmt='.3f') if not sm.empty else 'No eligible windows.','','## Decision','', '`TARGET_HIT_IN_AT_LEAST_ONE_WINDOW`' if (not sm.empty and sm.hits.sum()>0) else '`NOT_YET_AT_500_TO_100K_TARGET`','','V1 uses M15 as execution proxy. M1 precision entry is a separate next validation.'];(a.outdir/'REPORT.md').write_text('\n'.join(L)+'\n');print('\n'.join(L))
if __name__=='__main__':main()
