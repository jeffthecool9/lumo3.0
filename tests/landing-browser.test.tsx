// @vitest-environment jsdom
import React, {act,useState} from 'react';
import {createRoot,Root} from 'react-dom/client';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {useDemoModal} from '../src/use-demo-modal';
import {LumoScene} from '../src/LumoScene';
import {DemoChat} from '../src/StoryLanding';
vi.mock('../src/scene-engine',() => ({createLumoScene:vi.fn((_host,_paused,ready) => {ready(false);return vi.fn();})}));
vi.mock('../src/api',() => ({readDraft:() => '',saveDraft:vi.fn()}));
let root:Root, container:HTMLDivElement;
const engine = async () => (await import('../src/scene-engine')).createLumoScene;
function Harness() {
  const demo=useDemoModal();const [business,setBusiness]=useState(2);
  return <><button id="try-lumo" onClick={e => demo.launch(e.currentTarget)}>Open</button><a href="#playground">Demo link</a><dialog ref={demo.dialog} onCancel={e => {e.preventDefault();demo.close();}}><button onClick={() => demo.close()}>Close</button><button onClick={() => setBusiness(0)}>Switch</button><DemoChat businessIndex={business} onInteraction={() => {}}/></dialog></>;
}
const click=async(selector:string) => {await act(async () => (container.querySelector(selector) as HTMLElement).click());};
beforeEach(() => {
  vi.useFakeTimers();vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT',true);
  vi.stubGlobal('matchMedia',vi.fn(() => ({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
  vi.spyOn(window,'scrollTo').mockImplementation(() => {});
  Object.defineProperty(HTMLDialogElement.prototype,'showModal',{configurable:true,value:vi.fn(function(this:HTMLDialogElement){this.open=true;})});
  Object.defineProperty(HTMLDialogElement.prototype,'close',{configurable:true,value:vi.fn(function(this:HTMLDialogElement){this.open=false;})});
  history.replaceState(null,'','#pricing');document.body.style.overflow='';
  container=document.createElement('div');document.body.append(container);root=createRoot(container);
});
afterEach(async () => {await act(async () => root.unmount());container.remove();vi.useRealTimers();vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('persistent demo dialog',() => {
  it('opens instantly, locks the background, restores hash and trigger focus',async () => {
    await act(async () => root.render(<Harness/>));await click('#try-lumo');
    expect(container.querySelector('dialog')?.open).toBe(true);expect(location.hash).toBe('#playground');expect(document.body.style.overflow).toBe('hidden');
    await click('dialog>button');expect(location.hash).toBe('#pricing');expect(document.body.style.overflow).toBe('');expect(document.activeElement?.id).toBe('try-lumo');
  });
  it('supports direct demo visits and Escape without a hidden anchor jump',async () => {
    history.replaceState(null,'','#playground');await act(async () => root.render(<Harness/>));
    expect(container.querySelector('dialog')?.open).toBe(true);
    await act(async () => container.querySelector('dialog')!.dispatchEvent(new Event('cancel',{cancelable:true})));
    expect(container.querySelector('dialog')?.open).toBe(false);expect(location.hash).toBe('#hero');
  });
  it('keeps a conversation across close/reopen but resets when business changes',async () => {
    await act(async () => root.render(<Harness/>));await click('#try-lumo');await click('.ls-suggestions button');
    await act(async () => vi.advanceTimersByTimeAsync(650));
    const transcript=container.querySelector('[role=log]')?.textContent;
    expect(container.querySelectorAll('.ls-demo-log .ls-message')).toHaveLength(3);
    await click('dialog>button');await click('#try-lumo');expect(container.querySelector('[role=log]')?.textContent).toBe(transcript);
    await click('dialog>button:nth-child(2)');expect(container.querySelectorAll('.ls-demo-log .ls-message')).toHaveLength(1);
  });
  it('closes on history navigation and intercepts demo links without losing scroll',async () => {
    await act(async () => root.render(<Harness/>));await click('a');expect(container.querySelector('dialog')?.open).toBe(true);
    history.replaceState(null,'','#hero');await act(async () => window.dispatchEvent(new PopStateEvent('popstate')));
    expect(container.querySelector('dialog')?.open).toBe(false);expect(location.hash).toBe('#hero');expect(window.scrollTo).toHaveBeenCalledWith({top:0,behavior:'instant'});
  });
});
describe('lazy scene safety',() => {
  it('renders local static product artwork before loading the engine',async () => {
    const create=await engine();vi.mocked(create).mockClear();
    await act(async () => root.render(<LumoScene demoOpen={false} onReady={() => {}}/>));
    expect(container.querySelector('.ls-static-art')?.textContent).toContain('RM129');expect(create).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTimeAsync(140));expect(create).toHaveBeenCalledOnce();
  });
  it('never loads a renderer under reduced motion',async () => {
    const create=await engine();vi.mocked(create).mockClear();
    vi.mocked(matchMedia).mockReturnValue({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()} as unknown as MediaQueryList);
    await act(async () => root.render(<LumoScene demoOpen={false} onReady={() => {}}/>));
    await act(async () => vi.advanceTimersByTimeAsync(500));expect(create).not.toHaveBeenCalled();expect(container.querySelector('.ls-static-art')).not.toBeNull();
  });
  it('retains product facts when the renderer fails and passes modal pause state',async () => {
    const create=await engine();vi.mocked(create).mockClear();const ready=vi.fn();
    await act(async () => root.render(<LumoScene demoOpen={true} onReady={ready}/>));await act(async () => vi.advanceTimersByTimeAsync(140));
    expect(ready).toHaveBeenCalledWith(false);expect(container.querySelector('.ls-static-art')).not.toBeNull();expect(vi.mocked(create).mock.calls[0][1]()).toBe(true);
  });
});
