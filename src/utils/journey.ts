import type { DateEntry } from '../types';

export interface JourneyInsight {
  entryCount: number;
  insight: string;
}

function mostFrequentTag(entries: DateEntry[]): { tag: string; count: number } | null {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const tag of [...entry.feelingTags, ...entry.activityTags]) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  let best: { tag: string; count: number } | null = null;
  for (const [tag, count] of counts) {
    if (!best || count > best.count) best = { tag, count };
  }
  return best;
}

export function computeJourneyInsight(entries: DateEntry[]): JourneyInsight {
  const entryCount = entries.length;

  if (entryCount === 0) {
    return { entryCount, insight: 'Log a date to start seeing your patterns here.' };
  }

  const dateWord = entryCount === 1 ? 'date' : 'dates';
  let insight = `You've logged ${entryCount} ${dateWord} since you started paying attention.`;

  const top = mostFrequentTag(entries);
  if (top && top.count >= 2) {
    insight += ` "${top.tag}" keeps showing up.`;
  }

  return { entryCount, insight };
}
