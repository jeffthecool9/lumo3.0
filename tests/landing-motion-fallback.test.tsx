// @vitest-environment jsdom
import React,{act,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {it,expect,vi} from 'vitest';
import {useLandingMotion} from '../src/landing-motion';
vi.mock('gsap',() => {throw new Error('Motion chunk blocked');});
function Page(){const root=useRef<HTMLDivElement>(null);useLandingMotion(root);return <div ref={root}><h1>Lumo</h1><button>Try Lumo</button></div>;}
it('switches to readable vertical content when the motion bundle is blocked',async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT',true);
  const host=document.createElement('div');document.body.append(host);const root=createRoot(host);
  try {await act(async () => root.render(<Page/>));expect(host.firstElementChild?.className).toContain('motion-unavailable');expect(host.querySelector('button')?.textContent).toBe('Try Lumo');}
  finally {await act(async () => root.unmount());host.remove();vi.unstubAllGlobals();}
});
