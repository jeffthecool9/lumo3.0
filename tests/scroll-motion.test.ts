import {describe, expect, it} from 'vitest';
import {clamp, journeyPhase, journeyProgress, sceneMotion, salesPhase, salesSceneMotion, salesStops} from '../src/scroll-motion';

describe('five-stage connected sales story', () => {
  it('lands controls on readable dwell states', () => {
    salesStops.forEach((stop,index) => expect(salesPhase(stop)).toBe(index));
  });
  it('crossfades product evidence continuously without blank stages', () => {
    for (let i=0;i<=100;i++) {
      const phase = salesPhase(i/100);
      const scenes = salesStops.map((_,index) => salesSceneMotion(phase,index));
      expect(scenes.reduce((sum,scene) => sum + scene.opacity,0)).toBeCloseTo(1);
      expect(scenes.every(scene => scene.scale >= .94 && scene.scale <= 1)).toBe(true);
      const outgoing = Math.min(3,Math.floor(phase));
      expect(scenes[outgoing].bottom + scenes[outgoing + 1].top).toBeCloseTo(100);
      if (i) expect(phase).toBeGreaterThanOrEqual(salesPhase((i-1)/100));
    }
    expect(salesPhase(-1)).toBe(0);
    expect(salesPhase(2)).toBe(4);
  });
});

describe('cinematic scroll choreography', () => {
  it('holds each scene long enough to read before transitioning', () => {
    expect(journeyPhase(0)).toBe(0);
    expect(journeyPhase(.20)).toBe(0);
    expect(journeyPhase(.48)).toBe(1);
    expect(journeyPhase(.9)).toBe(2);
  });
  it('scrubs continuously in either direction', () => {
    const phases = Array.from({length: 101}, (_, n) => journeyPhase(n / 100));
    expect(phases.every((value, i) => !i || value >= phases[i - 1])).toBe(true);
    expect(journeyPhase(.31)).toBeCloseTo(.5);
    expect(journeyPhase(.69)).toBeCloseTo(1.5);
  });
  it('uses complementary product masks and keeps headings from overlapping', () => {
    for (const phase of [.1, .3, .5, .9]) {
      expect(sceneMotion(phase, 0).bottom + sceneMotion(phase, 1).top).toBeCloseTo(100);
    }
    expect(sceneMotion(1, 1)).toMatchObject({top:0,bottom:0});
    expect(sceneMotion(2, 0).bottom).toBe(100);
    expect(sceneMotion(.5, 0).copyOpacity).toBe(0);
    expect(sceneMotion(.5, 1).copyOpacity).toBe(0);
    expect(sceneMotion(1, 1).copyOpacity).toBe(1);
  });
  it('bounds progress before and after the pinned section and on short viewports', () => {
    expect(journeyProgress(1000, 2000, 720, 80)).toBe(0);
    expect(journeyProgress(-5000, 2000, 720, 80)).toBe(1);
    expect(journeyProgress(80, 2000, 720, 80)).toBe(0);
    expect(Number.isFinite(journeyProgress(0, 100, 720, 80))).toBe(true);
    expect(clamp(-10, -1, 1)).toBe(-1);
  });
});
