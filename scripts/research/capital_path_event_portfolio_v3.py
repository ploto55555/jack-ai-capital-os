#!/usr/bin/env python3
"""V3 causal multi-symbol event portfolio research. No broker connection/orders."""
from __future__ import annotations
import argparse,itertools,math,sys
from pathlib import Path
import numpy as np,pandas as pd

sys.path.insert(0,str(Path(__file__).resolve().parent))
import old_500_to_100k_edge_reconstruction_v2 as v2

v2.SPECS.update({
 "USDJPY":dict(scale=1000.0,pip=.01,cost=1.2,minstop=6,maxstop=45),
 "GBPUSD":dict(scale=100000.0,pip=.0001,cost=1.2,minstop=5,maxstop=35),
 "EURUSD":dict(scale=100000.0,pip=.0001,cost=1.0,minstop=5,maxstop=30),
})
SPLITS={"DEV":("2012-01-01","2017-12-31 23:59:59"),
        "VAL":("2018-01-01","2019-12-31 23:59:59"),
        "OOS":("2020-01-01","2100-01-01"),
        "ALL":("1900-01-01","2100-01-01")}
SESSIONS=(6,7,8,12,13,14)

def bias_ok(r,d,mode):
    if mode=="none": return True
    if mode=="h4": return bool(r.h4u if d==1 else r.h4d)
    return bool((r.h4u if d==1 else r.h4d) and (r.d1u if d==1 else r.d1d))

def make_stop(x,j,k,d,mode,sym):
    s=v2.SPECS[sym];e=float(x.at[k,"open"]);a=float(x.at[j,"atr"])
    if mode.startswith("fixed"):
        mult=float(mode.replace("fixed",""))
        base={"GBPJPY":17,"XAUUSD":35,"USDJPY":12,"GBPUSD":10,"EURUSD":9}[sym]
        rp=base*mult;st=e-d*rp*s["pip"]
    else:
        n=int(mode.replace("struct",""))
        st=float(x.loc[max(0,j-n+1):j,"low"].min()-.08*a) if d==1 else float(x.loc[max(0,j-n+1):j,"high"].max()+.08*a)
        rp=((e-st) if d==1 else (st-e))/s["pip"]
    if not(s["minstop"]<=rp<=s["maxstop"]): return None
    return e,st,(rp*s["pip"]),rp

def event_entries(x,sym,cfg):
    family,session,bias,impulse,stop_mode,aux=cfg
    out=[]
    for day,g in x.groupby("day",sort=True):
        ids=g[(g.hour>=session)&(g.hour<session+3)].index.to_numpy(int)
        pre=g[(g.hour>=max(0,session-6))&(g.hour<session)]
        if len(ids)<2 or len(pre)<4: continue
        ph,pl=float(pre.high.max()),float(pre.low.min())
        atr0=float(x.at[ids[0],"atr"])
        if not np.isfinite(atr0): continue
        compressed=(ph-pl)<=float(aux)*atr0 if family=="COMP" else True
        chosen=None
        for i in ids[:-1]:
            if i<1 or i+1>=len(x): continue
            r=x.loc[i];a=float(r.atr);body=float(r.body)
            if not np.isfinite(a) or a<=0: continue
            candidates=[]
            if family in ("DRIVE","COMP"):
                if compressed and r.close>ph and x.at[i-1,"close"]<=ph and body>=impulse*a: candidates.append((1,ph))
                if compressed and r.close<pl and x.at[i-1,"close"]>=pl and body>=impulse*a: candidates.append((-1,pl))
            elif family=="PD":
                if np.isfinite(r.pdh) and r.close>r.pdh and x.at[i-1,"close"]<=r.pdh and body>=impulse*a:candidates.append((1,float(r.pdh)))
                if np.isfinite(r.pdl) and r.close<r.pdl and x.at[i-1,"close"]>=r.pdl and body>=impulse*a:candidates.append((-1,float(r.pdl)))
            elif family=="SWEEP":
                b=max(body,1e-12)
                if r.low<pl-.10*a and r.close>pl and r.lw>=1.25*b:candidates.append((1,pl))
                if r.high>ph+.10*a and r.close<ph and r.uw>=1.25*b:candidates.append((-1,ph))
            for d,level in candidates:
                if not bias_ok(r,d,bias):continue
                k=i+1;z=make_stop(x,i,k,d,stop_mode,sym)
                if z is None:continue
                e,st,risk,rp=z
                chosen=dict(symbol=sym,family=family,session_start=session,bias=bias,impulse=impulse,
                            retest_bars=int(aux) if family!="COMP" else 0,signal_time=r.timestamp,
                            entry_time=x.at[k,"timestamp"],entry_idx=k,direction=d,entry=e,stop=st,
                            risk=risk,risk_pips=rp,level=level,stop_mode=stop_mode,aux=aux)
                break
            if chosen:break
        if chosen:out.append(chosen)
    return pd.DataFrame(out)

def metrics(t,a,b):
    q=t[(pd.to_datetime(t.entry_time)>=a)&(pd.to_datetime(t.entry_time)<=b)] if not t.empty else t
    if q.empty:return dict(trades=0,ppy=0,win=np.nan,tp=np.nan,loss=np.nan,pf=np.nan,exp=np.nan,sumr=0,dd=np.nan)
    w=q.loc[q.r>0,"r"].sum();l=-q.loc[q.r<0,"r"].sum();z=q.sort_values("entry_time").r.cumsum()
    yrs=max((pd.Timestamp(q.entry_time.max())-pd.Timestamp(q.entry_time.min())).days/365.25,.5)
    return dict(trades=len(q),ppy=len(q)/yrs,win=(q.r>0).mean(),tp=(q.reason=="TP").mean(),
                loss=(q.reason=="SL").mean(),pf=w/l if l else np.inf,exp=q.r.mean(),
                sumr=q.r.sum(),dd=(z.cummax()-z).max())

def row_for(cfg,ex,t):
    r=dict(family=cfg[0],session_start=cfg[1],bias=cfg[2],impulse=cfg[3],stop_mode=cfg[4],aux=cfg[5],
           target_r=ex[0],lock_trigger=ex[1],lock_to=ex[2],hold=ex[3])
    for n,(a,b) in SPLITS.items():
        for k,v in metrics(t,a,b).items():r[f"{n}_{k}"]=v
    return r

def choose_entries(g,n=4):
    z=g[(g.DEV_trades>=24)&(g.VAL_trades>=8)&(g.DEV_exp>0)&(g.VAL_exp>0)].copy()
    if z.empty:z=g.copy()
    z["entry_score"]=np.minimum(z.DEV_exp,z.VAL_exp)+.03*np.log1p(z.DEV_trades+z.VAL_trades)-.01*np.maximum(z.DEV_dd,z.VAL_dd)
    picks=[]
    for _,r in z.sort_values("entry_score",ascending=False).iterrows():
        key=(r.family,int(r.session_start))
        if key in {(p.family,int(p.session_start)) for p in picks}:continue
        picks.append(r)
        if len(picks)>=n:break
    return picks

def select_exit(g):
    z=g[(g.DEV_trades>=20)&(g.VAL_trades>=7)&(g.DEV_exp>0)&(g.VAL_exp>0)].copy()
    if z.empty:z=g.copy()
    z["score"]=np.minimum(z.DEV_exp,z.VAL_exp)+.15*z.VAL_tp+.025*np.log1p(z.DEV_trades+z.VAL_trades)-.012*np.maximum(z.DEV_dd,z.VAL_dd)
    return z.sort_values("score",ascending=False).iloc[0]

def one_open(t):
    if t.empty:return t
    out=[];last=pd.Timestamp.min
    for r in t.sort_values(["entry_time","symbol"]).itertuples(index=False):
        if pd.Timestamp(r.entry_time)<=last:continue
        out.append(r._asdict());last=pd.Timestamp(r.exit_time)
    return pd.DataFrame(out)

def rolling(t):
    if t.empty:return pd.DataFrame()
    first=pd.Timestamp(t.entry_time.min()).replace(day=1).floor("D");last=pd.Timestamp(t.entry_time.max()).floor("D")
    rows=[]
    for st in pd.date_range(first,last-pd.Timedelta(days=365),freq="MS"):
        en=st+pd.DateOffset(years=1);q=t[(pd.to_datetime(t.entry_time)>=st)&(pd.to_datetime(t.entry_time)<en)]
        if q.empty:continue
        for name,risk in [("fixed_01",.01),("fixed_03",.03),("fixed_05",.05),("fixed_08",.08),("fixed_10",.10),("fixed_15",.15),("fixed_20",.20)]:
            e,d,h,a=v2.cap(q,"fixed",risk);rows.append(dict(start=st,end=en,model=name,trades=len(q),final=e,dd=d,hit=h,avgrisk=a))
        e,d,h,a=v2.cap(q,"adaptive");rows.append(dict(start=st,end=en,model="adaptive_3_5_8",trades=len(q),final=e,dd=d,hit=h,avgrisk=a))
    return pd.DataFrame(rows)

def main():
    p=argparse.ArgumentParser()
    for s in ["gbpjpy","xauusd","usdjpy","gbpusd","eurusd"]:p.add_argument(f"--{s}",type=Path,required=True)
    p.add_argument("--outdir",type=Path,required=True);a=p.parse_args();a.outdir.mkdir(parents=True,exist_ok=True)
    paths={"GBPJPY":a.gbpjpy,"XAUUSD":a.xauusd,"USDJPY":a.usdjpy,"GBPUSD":a.gbpusd,"EURUSD":a.eurusd}
    selected_trades=[];summaries=[]
    for sym,path in paths.items():
        x=v2.context(v2.load(path,sym));entry_rows=[];cache={}
        cfgs=[]
        for fam in ["DRIVE","PD","SWEEP","COMP"]:
            for ses,bias,imp,sm in itertools.product(SESSIONS,["none","h4","h4_d1"],[.30,.60],["fixed0.75","fixed1","fixed1.25","struct4","struct8"]):
                aux=4 if fam!="COMP" else 4.0
                cfgs.append((fam,ses,bias,imp,sm,aux))
                if fam=="COMP":cfgs.append((fam,ses,bias,imp,sm,6.0))
        base_exit=(5.0,1.0,.25,48)
        for cfg in cfgs:
            E=event_entries(x,sym,cfg);T=v2.sim(E,x,sym,*base_exit);entry_rows.append(row_for(cfg,base_exit,T));cache[cfg]=E
        eg=pd.DataFrame(entry_rows);eg.to_csv(a.outdir/f"{sym}_entry_grid.csv",index=False)
        picks=choose_entries(eg,4);exit_rows=[];store={}
        for pr in picks:
            cfg=(pr.family,int(pr.session_start),pr.bias,float(pr.impulse),pr.stop_mode,float(pr.aux))
            E=cache[cfg]
            for ex in itertools.product([4.,5.,6.,7.],[.75,1.,1.5],[.25,.5],[32,48,64]):
                if ex[2]>=ex[1]:continue
                T=v2.sim(E,x,sym,*ex);exit_rows.append(row_for(cfg,ex,T));store[(cfg,ex)]=T
        xg=pd.DataFrame(exit_rows);xg.to_csv(a.outdir/f"{sym}_exit_grid.csv",index=False)
        best=select_exit(xg);cfg=(best.family,int(best.session_start),best.bias,float(best.impulse),best.stop_mode,float(best.aux));ex=(float(best.target_r),float(best.lock_trigger),float(best.lock_to),int(best.hold))
        T=store[(cfg,ex)];T.to_csv(a.outdir/f"{sym}_selected_trades.csv",index=False);pd.DataFrame([best]).to_csv(a.outdir/f"{sym}_selected.csv",index=False)
        selected_trades.append(T);summaries.append((sym,best))
    combined=one_open(pd.concat(selected_trades,ignore_index=True));combined.to_csv(a.outdir/"combined_trades.csv",index=False)
    rw=rolling(combined);rw.to_csv(a.outdir/"rolling_12m.csv",index=False)
    sm=(rw.groupby("model").agg(windows=("start","count"),hits=("hit","sum"),hit_rate=("hit","mean"),median_final=("final","median"),best_final=("final","max"),worst_dd=("dd","max"),avg_trades=("trades","mean")).reset_index() if not rw.empty else pd.DataFrame())
    sm.to_csv(a.outdir/"rolling_summary.csv",index=False)
    lines=["# CAPITAL PATH EVENT PORTFOLIO V3","","Status: `[CAUSAL_MULTI_SYMBOL_BACKTEST] [PERSONAL_RESEARCH_ONLY]`","","Target unchanged: USD 500 to USD 100,000 in rolling 12 months.","","## Selected symbol engines"]
    for sym,r in summaries:
        lines+=["",f"### {sym}",f"- {r.family}, session {int(r.session_start):02d}:00, bias {r.bias}, impulse {r.impulse:.2f} ATR, stop {r.stop_mode}, target {r.target_r:.1f}R, lock {r.lock_trigger:.2f}R -> {r.lock_to:.2f}R, hold {int(r.hold)} bars"]
        for n in SPLITS:lines.append(f"- {n}: {int(r[f'{n}_trades'])} trades, {r[f'{n}_ppy']:.2f}/yr, win {100*r[f'{n}_win']:.2f}%, TP {100*r[f'{n}_tp']:.2f}%, PF {r[f'{n}_pf']:.3f}, exp {r[f'{n}_exp']:+.3f}R")
    lines+=["","## Combined one-open portfolio"]
    for n,(aa,bb) in SPLITS.items():
        m=metrics(combined,aa,bb);lines.append(f"- {n}: {m['trades']} trades, {m['ppy']:.2f}/yr, win {100*m['win']:.2f}%, TP {100*m['tp']:.2f}%, PF {m['pf']:.3f}, exp {m['exp']:+.3f}R, sum {m['sumr']:+.2f}R, DD {m['dd']:.2f}R")
    lines+=["","## Rolling capital","","| Model | Windows | Hits | Hit rate | Median final | Best final | Worst DD | Avg trades |","|---|---:|---:|---:|---:|---:|---:|---:|"]
    for r in sm.itertuples(index=False):lines.append(f"| {r.model} | {r.windows} | {r.hits} | {100*r.hit_rate:.2f}% | ${r.median_final:,.2f} | ${r.best_final:,.2f} | {r.worst_dd:.2f}% | {r.avg_trades:.2f} |")
    hit=(not sm.empty and sm.hits.sum()>0);lines+=["","## Decision","", "`TARGET_HIT_IN_AT_LEAST_ONE_WINDOW`" if hit else "`REJECTED_FOR_500_TO_100K_TARGET`"]
    (a.outdir/"REPORT.md").write_text("\n".join(lines)+"\n");print("\n".join(lines))
if __name__=="__main__":main()
