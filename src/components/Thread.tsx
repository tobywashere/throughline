import Svg, { Line, Circle } from 'react-native-svg';
import { colors } from '../theme';

/**
 * The brand kit's motif: a dashed thread with solid dots marking completed
 * entries. Progress here looks like a thread getting longer, never a meter
 * filling up — so this replaces any chart/score visualization of dates logged.
 */
export function Thread({
  count,
  width = 280,
  height = 56,
  maxDots = 10,
}: {
  count: number;
  width?: number;
  height?: number;
  maxDots?: number;
}) {
  const dotCount = Math.min(count, maxDots);
  const y = height / 2;
  const padding = 16;

  if (dotCount === 0) {
    return (
      <Svg width={width} height={height}>
        <Circle
          cx={width / 2}
          cy={y}
          r={7}
          fill="none"
          stroke={colors.ink}
          strokeWidth={1.3}
          strokeDasharray="2 2"
          opacity={0.4}
        />
      </Svg>
    );
  }

  const step = dotCount > 1 ? (width - padding * 2) / (dotCount - 1) : 0;
  const dots = Array.from({ length: dotCount }, (_, i) => padding + i * step);

  return (
    <Svg width={width} height={height}>
      <Line
        x1={padding}
        y1={y}
        x2={width - padding}
        y2={y}
        stroke={colors.ink}
        strokeWidth={1}
        strokeDasharray="1 6"
        opacity={0.4}
      />
      {dots.map((x, i) => {
        const isLast = i === dots.length - 1;
        return <Circle key={i} cx={x} cy={y} r={7} fill={isLast ? colors.rose : colors.ink} />;
      })}
    </Svg>
  );
}
