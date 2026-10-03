// @vitest-environment jsdom
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
const mocks=vi.hoisted(() => ({render:vi.fn(),dispose:vi.fn(),fail:false}));
vi.mock('three',async importOriginal => {
  const original=await importOriginal<typeof import('three')>();
  return {...original,WebGLRenderer:class {
    domElement=document.createElement('canvas');outputColorSpace='';
    constructor(){if(mocks.fail) throw new Error('WebGL unavailable');}
    setClearColor(){} setPixelRatio(){} setSize(){} render=mocks.render;dispose=mocks.dispose;
  }};
});
import {createLumoScene} from '../src/scene-engine';
let host:HTMLDivElement,visible:(entries:unknown[]) => void;
beforeEach(() => {
  vi.useFakeTimers();mocks.fail=false;mocks.render.mockReset();mocks.dispose.mockReset();
  vi.stubGlobal('requestAnimationFrame',(callback:FrameRequestCallback) => setTimeout(() => callback(performance.now()),16));
  vi.stubGlobal('cancelAnimationFrame',clearTimeout);
  vi.stubGlobal('IntersectionObserver',class {constructor(callback:(entries:unknown[])=>void){visible=callback;}observe(){visible([{isIntersecting:true}]);}disconnect(){}});
  vi.stubGlobal('ResizeObserver',class {observe(){}disconnect(){}});
  vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({fillRect:vi.fn(),fillText:vi.fn(),createLinearGradient:() => ({addColorStop:vi.fn()})} as unknown as CanvasRenderingContext2D);
  const root=document.createElement('div');root.className='lumo-story';host=document.createElement('div');root.append(host);document.body.append(root);
  vi.spyOn(host,'getBoundingClientRect').mockReturnValue({width:1280,height:720} as DOMRect);
});
afterEach(() => {host.parentElement?.remove();vi.useRealTimers();vi.restoreAllMocks();vi.unstubAllGlobals();});
it('reports unavailable WebGL and leaves the host safe',() => {mocks.fail=true;const ready=vi.fn();const destroy=createLumoScene(host,()=>false,ready);expect(ready).toHaveBeenCalledWith(false);expect(host.querySelector('canvas')).toBeNull();destroy();});
it('handles context loss and restoration without losing the product fallback',() => {
  const ready=vi.fn();const destroy=createLumoScene(host,()=>false,ready);vi.advanceTimersByTime(32);expect(ready).toHaveBeenCalledWith(true);
  const canvas=host.querySelector('canvas')!;canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));expect(ready).toHaveBeenLastCalledWith(false);
  const renders=mocks.render.mock.calls.length;vi.advanceTimersByTime(100);expect(mocks.render).toHaveBeenCalledTimes(renders);
  canvas.dispatchEvent(new Event('webglcontextrestored'));vi.advanceTimersByTime(32);expect(ready).toHaveBeenLastCalledWith(true);destroy();expect(host.querySelector('canvas')).toBeNull();expect(mocks.dispose).toHaveBeenCalledOnce();
});
it('pauses offscreen and while the demo is open',() => {
  let paused=true;const destroy=createLumoScene(host,()=>paused,vi.fn());vi.advanceTimersByTime(32);expect(mocks.render).not.toHaveBeenCalled();
  paused=false;host.dispatchEvent(new Event('lumo:pause'));vi.advanceTimersByTime(32);expect(mocks.render).toHaveBeenCalled();
  visible([{isIntersecting:false}]);const renders=mocks.render.mock.calls.length;vi.advanceTimersByTime(100);expect(mocks.render).toHaveBeenCalledTimes(renders);destroy();
});
it('restores fallback after a rendering exception',() => {mocks.render.mockImplementation(() => {throw new Error('GPU failed');});const ready=vi.fn();const destroy=createLumoScene(host,()=>false,ready);vi.advanceTimersByTime(32);expect(ready).toHaveBeenLastCalledWith(false);destroy();});
