const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function formatMonthYear(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  const label = MONTH_NAMES[d.getMonth()];
  return d.getFullYear() === now.getFullYear() ? label : `${label} ${d.getFullYear()}`;
}

export function formatFullDate(timestamp: number): string {
  const d = new Date(timestamp);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatShortDate(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${formatFullDate(timestamp)} · ${hours}:${minutes} ${ampm}`;
}

export function groupByMonth<T>(
  items: T[],
  getTimestamp: (item: T) => number
): { label: string; items: T[] }[] {
  const groups: { key: string; label: string; items: T[] }[] = [];
  for (const item of items) {
    const ts = getTimestamp(item);
    const d = new Date(ts);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = { key, label: formatMonthYear(ts), items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups.map(({ label, items }) => ({ label, items }));
}
