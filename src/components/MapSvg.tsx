import { PointItem, LineItem, Color, getViewBox, MapFile } from '../maps';

const SCALE = 10;
const scale = (x: number) => x * SCALE;

export function MapSvg(props: { mapFile: MapFile; width: number; height: number }): JSX.Element {
  const { mapFile, width, height } = props;
  const items = mapFile.items;

  const { minX, minY, width: w, height: h } = getViewBox(mapFile);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`${scale(minX)} ${scale(minY)} ${scale(w)} ${scale(h)}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {items.map((item, i) => {
        switch (item.type) {
          case 'line':
            return <LineDisplay key={i} item={item} />;
          case 'point':
            return <PointDisplay key={i} item={item} />;
        }
      })}
    </svg>
  );
}

function PointDisplay(props: { item: PointItem }): JSX.Element {
  const { item } = props;
  return (
    <>
      <circle cx={scale(item.point.x)} cy={scale(item.point.y)} r="10" style={{ fill: rgb(item.color) }} />
      <text
        x={scale(item.point.x)}
        y={scale(item.point.y + 2)}
        fontSize="10"
        textAnchor="middle"
        style={{ fill: 'red' }}
      >
        {item.label}
      </text>
    </>
  );
}

function LineDisplay(props: { item: LineItem }): JSX.Element {
  const { item } = props;
  return (
    <path
      d={`M ${scale(item.from.x)} ${scale(item.from.y)} L ${scale(item.to.x)} ${scale(item.to.y)}`}
      stroke={rgb(item.color)}
      strokeWidth="10"
    />
  );
}

function rgb(color: Color) {
  return `rgb(${color.r}, ${color.g}, ${color.g})`;
}
