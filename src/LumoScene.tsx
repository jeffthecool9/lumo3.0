import React, {useEffect, useRef} from 'react';
import {BrandMark} from './Brand';

export function LumoScene({demoOpen,onReady}: {demoOpen:boolean; onReady:(ready:boolean) => void}) {
  const host = useRef<HTMLDivElement>(null);
  const paused = useRef(demoOpen);
  useEffect(() => {paused.current = demoOpen; host.current?.dispatchEvent(new Event('lumo:pause'));},[demoOpen]);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let destroy = () => {};
    let timer:number;
    let generation=0;
    const start = () => {
      clearTimeout(timer);
      const current=++generation;
      destroy(); destroy = () => {}; onReady(false);
      if (media.matches) return;
      // Load only after the HTML first paint. No engine imports in the entry bundle.
      timer = window.setTimeout(() => {
        import('./scene-engine').then(({createLumoScene}) => {
          if (disposed || media.matches || current!==generation) return;
          destroy = createLumoScene(el, () => paused.current, onReady);
        }).catch(() => onReady(false));
      },120);
    };
    start(); media.addEventListener('change',start);
    return () => {disposed = true; generation++; clearTimeout(timer); destroy(); media.removeEventListener('change',start);};
  },[onReady]);
  return <div className="ls-scene-shell" aria-hidden="true"><div className="ls-scene-stick"><div className="ls-scene-host" ref={host}/><div className="ls-static-art">
    <div className="ls-static-logo"><BrandMark/></div>
    <div className="ls-static-enquiry"><span>ENQUIRY / EN + BM + 中文</span><strong>Hi, tote ni berapa?<br/>有黑色吗？</strong></div>
    <div className="ls-static-facts"><span>APPROVED FACT</span><strong>Canvas tote<br/>RM129</strong><small>Stock & delivery: ask the team.</small></div>
    <div className="ls-static-lead"><span>BUYING INTENT</span><strong>Gift. Below RM150.</strong><small>Needed by Friday / Team follow-up</small></div>
  </div></div></div>;
}
