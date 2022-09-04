import { MapFile } from './types';

export * from './types';

export function getViewBox({ items }: MapFile) {
  const xs = items.flatMap((item) => {
    return item.type === 'line' ? [item.from.x, item.to.x] : [item.point.x];
  });

  const ys = items.flatMap((item) => {
    return item.type === 'line' ? [item.from.y, item.to.y] : [item.point.y];
  });

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  const width = maxX - minX;
  const height = maxY - minY;

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
  };
}
