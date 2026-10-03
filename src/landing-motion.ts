import {useEffect, RefObject} from 'react';
import {clamp, journeyProgress, salesPhase, salesSceneMotion} from './scroll-motion';

export function useLandingMotion(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const targets = [...page.querySelectorAll<HTMLElement>('[data-motion]')];
    const story = page.querySelector<HTMLElement>('.ls-sales-story');
    const panels = [...page.querySelectorAll<HTMLElement>('.ls-sales-panel')];
    const controls = [...page.querySelectorAll<HTMLElement>('[data-story-step]')];
    const rail = page.querySelector<HTMLElement>('.ls-progress');
    const hero = page.querySelector<HTMLElement>('.ls-hero');
    const nearby = new Set<HTMLElement>();
    let frame = 0;
    let active = -1;
    let frozen = false;
    let storyProgress = 0;
    let previousPhase = -1;
    let previousPinned: boolean | null = null;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) nearby.add(el); else nearby.delete(el);
      });
      update();
    }, {rootMargin:'160px 0px'});
    targets.forEach(el => observer.observe(el));
    if (story) observer.observe(story);

    function update() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const header = page!.querySelector('.ls-header')?.getBoundingClientRect().height ?? 80;
        const pinned = innerWidth > 800 && innerHeight > 650 && !media.matches;
        const heroRect = hero?.getBoundingClientRect();
        const holdDecoration = frozen && !!heroRect && heroRect.bottom > header && heroRect.top < innerHeight;
        const max = document.documentElement.scrollHeight - innerHeight;
        // Read layout first, then batch all animation writes.
        const measurements = [...nearby].filter(el => el !== story).map(el => {
          const rect = el.getBoundingClientRect();
          return {el, reveal:clamp((innerHeight * .95 - rect.top) / (innerHeight * .32)), drift:clamp((rect.top + rect.height / 2 - innerHeight / 2) / innerHeight, -1, 1)};
        });
        if (story && (nearby.has(story) || active < 0)) {
          const rect = story.getBoundingClientRect();
          storyProgress = journeyProgress(rect.top, rect.height, innerHeight, header);
        }
        const phase = salesPhase(storyProgress);
        const next = Math.round(phase);
        rail?.style.setProperty('transform', `scaleX(${max > 0 ? scrollY / max : 0})`);
        if (!holdDecoration || media.matches) {
          measurements.forEach(({el, reveal, drift}) => {
            el.style.setProperty('--reveal', String(media.matches ? 1 : reveal));
            el.style.setProperty('--drift', String(media.matches ? 0 : drift));
          });
        }
        if (phase !== previousPhase || pinned !== previousPinned) {
          panels.forEach((panel, index) => {
            const motion = salesSceneMotion(phase, index);
            panel.style.setProperty('--scene-opacity', String(motion.opacity));
            panel.style.setProperty('--scene-y', `${motion.y}px`);
            panel.style.setProperty('--scene-scale', String(motion.scale));
            panel.style.setProperty('--scene-cut-top', `${motion.top}%`);
            panel.style.setProperty('--scene-cut-bottom', `${motion.bottom}%`);
            panel.setAttribute('aria-hidden', String(pinned && index !== next));
            panel.inert = pinned && index !== next;
          });
          if (active !== next) {
            controls.forEach((button, index) => {
              if (index === next) button.setAttribute('aria-current','step'); else button.removeAttribute('aria-current');
            });
            active = next;
          }
          previousPhase = phase;
          previousPinned = pinned;
        }
        if (story && nearby.has(story)) story.style.setProperty('--story-progress', String(storyProgress));
        frame = 0;
      });
    }
    function focusChanged() {
      frozen = !!page!.querySelector('.ls-hero-demo input:focus');
      update();
    }
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    page.addEventListener('focusin', focusChanged);
    page.addEventListener('focusout', focusChanged);
    media.addEventListener('change', update);
    update();
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update); window.removeEventListener('resize', update);
      page.removeEventListener('focusin', focusChanged); page.removeEventListener('focusout', focusChanged);
      media.removeEventListener('change', update);
    };
  }, [root]);
}
