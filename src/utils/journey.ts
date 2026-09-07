import type { DateEntry } from '../types';

export interface JourneyInsight {
  points: number[];
  insight: string;
}

export function computeJourneyInsight(entries: DateEntry[]): JourneyInsight {
  const chronological = [...entries].sort((a, b) => a.occurredAt - b.occurredAt);
  const points = chronological.map((e) => e.rating);

  if (chronological.length === 0) {
    return { points: [], insight: 'Log a date to start seeing your patterns here.' };
  }
  if (chronological.length < 4) {
    return { points, insight: 'A few more logged dates and a pattern will start to show.' };
  }

  const mid = Math.floor(chronological.length / 2);
  const firstHalf = chronological.slice(0, mid);
  const secondHalf = chronological.slice(mid);
  const avg = (arr: DateEntry[]) => arr.reduce((sum, e) => sum + e.rating, 0) / arr.length;
  const earlyAvg = avg(firstHalf);
  const recentAvg = avg(secondHalf);
  const overallAvg = avg(chronological);
  const delta = recentAvg - earlyAvg;

  let trend: string;
  if (delta > 0.4) trend = 'trending up';
  else if (delta < -0.4) trend = 'trending down';
  else trend = 'holding steady';

  const insight = `Averaging ${overallAvg.toFixed(1)} of 5 across ${chronological.length} dates, ${trend} lately.`;
  return { points, insight };
}
