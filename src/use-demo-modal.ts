import {useCallback, useEffect, useRef, useState} from 'react';
import {previousDemoHash} from './scene-state';

export function useDemoModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const preceding = useRef('#hero');
  const scroll = useRef(0);
  const [open,setOpen] = useState(false);
  const restore = useRef<() => void>(() => {});
  const show = useCallback(() => {
    if (!dialog.current || dialog.current.open) return;
    scroll.current = window.scrollY;
    const body = document.body;
    const overflow = body.style.overflow;
    const padding = body.style.paddingRight;
    body.style.paddingRight = `${innerWidth-document.documentElement.clientWidth}px`;
    body.style.overflow='hidden';
    restore.current = () => {body.style.overflow=overflow;body.style.paddingRight=padding;};
    dialog.current.showModal(); setOpen(true);
  },[]);
  const close = useCallback((restoreHash=true) => {
    if (!dialog.current?.open) return;
    dialog.current.close();restore.current();setOpen(false);
    if (restoreHash && location.hash === '#playground') history.replaceState(null,'',preceding.current);
    window.scrollTo({top:scroll.current,behavior:'instant'});
    (trigger.current ?? document.getElementById('try-lumo'))?.focus({preventScroll:true});
  },[]);
  const launch = useCallback((element?:HTMLElement) => {
    trigger.current=element ?? (document.activeElement as HTMLElement);
    preceding.current=previousDemoHash(location.hash);
    if (location.hash !== '#playground') history.pushState(null,'','#playground');
    show();
  },[show]);
  useEffect(() => {
    const requested = () => launch();
    const hash = () => {if(location.hash === '#playground') show();else {close(false);preceding.current=previousDemoHash(location.hash);}};
    const intercept = (event:MouseEvent) => {
      const target=(event.target as Element).closest<HTMLAnchorElement>('a[href="#playground"]');
      if (target && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button===0) {event.preventDefault();launch(target);}
    };
    hash();window.addEventListener('hashchange',hash);window.addEventListener('popstate',hash);document.addEventListener('click',intercept);document.addEventListener('lumo:open-demo',requested);
    return () => {restore.current();dialog.current?.close();window.removeEventListener('hashchange',hash);window.removeEventListener('popstate',hash);document.removeEventListener('click',intercept);document.removeEventListener('lumo:open-demo',requested);};
  },[show,close,launch]);
  return {dialog,open,launch,close};
}
