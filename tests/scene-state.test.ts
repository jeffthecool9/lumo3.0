import {describe,it,expect} from 'vitest';
import {scenePose,canRenderScene,previousDemoHash} from '../src/scene-state';
import {salesPhase,salesStops} from '../src/scroll-motion';
describe('cinematic scene contract',() => {
  it('maps five readable pauses to reversible camera poses',() => {
    const forward=salesStops.map(progress => scenePose(salesPhase(progress),progress));
    const reverse=[...salesStops].reverse().map(progress => scenePose(salesPhase(progress),progress));
    expect(reverse).toEqual([...forward].reverse());
    expect(forward.map(p => Math.round(p.phase))).toEqual([0,1,2,3,4]);
    expect(forward[0].logoTurn).not.toBe(forward[4].logoTurn);
  });
  it('bounds camera and logo transforms even with fast or out-of-range scroll',() => {
    for(const phase of [-99,0,2,4,99]) for(const progress of [-3,0,.4,1,8]) {
      const pose=scenePose(phase,progress);
      expect(pose.phase).toBeGreaterThanOrEqual(0);expect(pose.phase).toBeLessThanOrEqual(4);
      expect(pose.entering).toBeGreaterThanOrEqual(0);expect(pose.entering).toBeLessThanOrEqual(1);
      expect(pose.logoScale).toBeGreaterThan(.53);
      expect(Number.isFinite(pose.cameraZ)).toBe(true);
    }
  });
  it('keeps the mobile camera centred',() => {expect(scenePose(3,.7,true).cameraX).toBe(0);expect(scenePose(3,.7,true).logoX).toBe(0);});
  it('never renders offscreen, behind the demo, in a hidden tab or after failure',() => {
    expect(canRenderScene(true,false,false,false)).toBe(true);
    expect(canRenderScene(false,false,false,false)).toBe(false);
    expect(canRenderScene(true,true,false,false)).toBe(false);
    expect(canRenderScene(true,false,true,false)).toBe(false);
    expect(canRenderScene(true,false,false,true)).toBe(false);
  });
  it('restores a readable hash after a direct demo visit',() => {
    expect(previousDemoHash('#pricing')).toBe('#pricing');expect(previousDemoHash('#playground')).toBe('#hero');expect(previousDemoHash('')).toBe('#hero');
  });
});
