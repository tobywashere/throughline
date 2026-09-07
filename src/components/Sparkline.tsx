import Svg, { Polyline, Circle } from 'react-native-svg';
import { colors } from '../theme';

export function Sparkline({
  points,
  width = 240,
  height = 44,
  min = 1,
  max = 5,
}: {
  points: number[];
  width?: number;
  height?: number;
  min?: number;
  max?: number;
}) {
  if (points.length < 2) {
    return <Svg width={width} height={height} />;
  }
  const padding = 6;
  const stepX = (width - padding * 2) / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = padding + i * stepX;
    const ratio = (p - min) / (max - min || 1);
    const y = height - padding - ratio * (height - padding * 2);
    return [x, y] as const;
  });
  const polylineStr = coords.map(([x, y]) => `${x},${y}`).join(' ');
  const [lastX, lastY] = coords[coords.length - 1];

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={polylineStr}
        fill="none"
        stroke={colors.sage}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={lastX} cy={lastY} r={3.5} fill={colors.sage} />
    </Svg>
  );
}
