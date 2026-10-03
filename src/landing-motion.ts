import {useEffect, RefObject} from 'react';
import {clamp, salesPhase, salesSceneMotion} from './scroll-motion';

// One scroll owner. The decorative renderer consumes this timeline, not scroll events.
export function useLandingMotion(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let disposed = false;
    let clean = () => {};
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{gsap}, {ScrollTrigger}]) => {
      if (disposed || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const page = root.current;
      const media = gsap.matchMedia();
      media.add({all:'all', desktop:'(min-width: 801px) and (min-height: 651px)', reduced:'(prefers-reduced-motion: reduce)'}, context => {
        const {desktop, reduced} = context.conditions!;
        const panels = [...page.querySelectorAll<HTMLElement>('.ls-sales-panel')];
        const controls = [...page.querySelectorAll<HTMLElement>('[data-story-step]')];
        const story = page.querySelector<HTMLElement>('.ls-sales-story');
        const reset = () => panels.forEach(panel => {panel.inert = false; panel.removeAttribute('aria-hidden');});
        reset();
        if (!reduced) {
          page.querySelectorAll<HTMLElement>('[data-motion]').forEach(el => {
            gsap.fromTo(el, {'--reveal':0, '--drift':.5}, {'--reveal':1, '--drift':-.5, ease:'none', scrollTrigger:{trigger:el, start:'top 94%', end:'top 45%', scrub:true}});
          });
        }
        if (desktop && !reduced && story) {
          const update = (progress:number, entry=1) => {
            const phase = salesPhase(progress);
            const active = Math.round(phase);
            panels.forEach((panel,index) => {
              const m = salesSceneMotion(phase,index);
              panel.style.setProperty('--scene-opacity', String(m.opacity));
              panel.style.setProperty('--scene-y', `${m.y}px`);
              panel.style.setProperty('--scene-scale', String(m.scale));
              panel.style.setProperty('--scene-cut-top', `${m.top}%`);
              panel.style.setProperty('--scene-cut-bottom', `${m.bottom}%`);
              panel.inert = active !== index;
              panel.setAttribute('aria-hidden', String(active !== index));
            });
            controls.forEach((el,index) => {if (index === active) el.setAttribute('aria-current','step'); else el.removeAttribute('aria-current');});
            story.style.setProperty('--story-progress', String(progress));
            page.dataset.scenePhase = String(phase);
            page.dataset.sceneProgress = String(progress);
            page.dataset.sceneEntry = String(entry);
            page.style.setProperty('--scene-entry',String(entry));
            page.dispatchEvent(new CustomEvent('lumo:scene', {detail:{phase, progress, entry}}));
          };
          ScrollTrigger.create({trigger:story,start:'top bottom',end:'top 80px',onUpdate:self => {if(self.progress<1) update(0,self.progress);}});
          const settlement = () => clamp((innerHeight-story.getBoundingClientRect().top)/(innerHeight-80));
          ScrollTrigger.create({trigger:story, start:'top 80px', end:'bottom bottom', onUpdate:self => update(self.progress,settlement()), onRefresh:self => update(self.progress,settlement())});
          update(0,settlement());
        } else {
          page.dataset.scenePhase = '0'; page.dataset.sceneProgress = '0';
          page.dataset.sceneEntry = '0';
          page.style.setProperty('--scene-entry','0');
          page.dispatchEvent(new CustomEvent('lumo:scene', {detail:{phase:0, progress:0, entry:0}}));
        }
        return reset;
      });
      const context = gsap.context(() => {
        const rail = page.querySelector('.ls-progress');
        if (rail) gsap.fromTo(rail,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:page,start:'top top',end:'bottom bottom',scrub:true}});
      },page);
      clean = () => {media.revert(); context.revert();};
      ScrollTrigger.refresh();
    }).catch(() => {if(!disposed) root.current?.classList.add('motion-unavailable');});
    return () => {disposed = true; clean();};
  }, [root]);
}
