export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

export function smoothRange(value: number, start: number, end: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

export function journeyPhase(progress: number) {
  return smoothRange(progress, .23, .39) + smoothRange(progress, .61, .77);
}

export function journeyProgress(top: number, height: number, viewport: number, header: number) {
  return clamp((header - top) / Math.max(1, height - viewport + header));
}

export function sceneMotion(phase: number, index: number) {
  const distance = phase - index;
  return {top: clamp(-distance) * 100, bottom: clamp(distance) * 100, drift: clamp(distance, -1, 1) * -36, copyOpacity: clamp(1 - Math.abs(distance) * 2)};
}
