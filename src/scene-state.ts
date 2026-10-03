export const sceneStops = [0,1,2,3,4] as const;
export function scenePose(phase:number, progress:number, mobile=false, entry=progress*12) {
  const p = Math.max(0,Math.min(4,phase));
  const entering = mobile ? 0 : Math.max(0,Math.min(1,entry));
  return {phase:p, entering, cameraX:mobile ? 0 : entering * -.7, cameraZ:(mobile ? 12 : 10) - entering * .6, logoX:mobile ? 0 : entering * 3.2, logoY:(mobile ? -.95 : -1.2) + entering * 2.7, logoScale:(mobile ? .72 : .82) - entering * .28, logoTurn:-.28 + p * .22};
}
export function canRenderScene(visible:boolean, hidden:boolean, demoOpen:boolean, failed:boolean) {
  return visible && !hidden && !demoOpen && !failed;
}
export function previousDemoHash(hash:string) {return hash && hash !== '#playground' ? hash : '#hero';}
