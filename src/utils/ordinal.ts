import type { DateEntry } from '../types';

export function ordinalLabel(n: number): string {
  const remainder10 = n % 10;
  const remainder100 = n % 100;
  let suffix = 'th';
  if (remainder10 === 1 && remainder100 !== 11) suffix = 'st';
  else if (remainder10 === 2 && remainder100 !== 12) suffix = 'nd';
  else if (remainder10 === 3 && remainder100 !== 13) suffix = 'rd';
  return `${n}${suffix} date`;
}

/** Maps each entry's id to its 1-based position within that person's dates, oldest first. */
export function computeEntryOrdinals(entries: DateEntry[]): Map<string, number> {
  const byPerson = new Map<string, DateEntry[]>();
  for (const entry of entries) {
    const list = byPerson.get(entry.personId) ?? [];
    list.push(entry);
    byPerson.set(entry.personId, list);
  }
  const ordinals = new Map<string, number>();
  for (const list of byPerson.values()) {
    const sorted = [...list].sort((a, b) => a.occurredAt - b.occurredAt);
    sorted.forEach((entry, index) => ordinals.set(entry.id, index + 1));
  }
  return ordinals;
}
