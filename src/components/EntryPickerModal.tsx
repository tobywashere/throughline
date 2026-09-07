import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { SelectModal } from './SelectModal';
import { formatFullDate } from '../utils/date';
import type { DateEntry } from '../types';

export function EntryPickerModal({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (entry: DateEntry) => void;
}) {
  const entries = useStore((s) => s.entries);
  const people = useStore((s) => s.people);

  const options = useMemo(
    () =>
      entries
        .slice()
        .sort((a, b) => b.occurredAt - a.occurredAt)
        .map((e) => ({
          id: e.id,
          title: people.find((p) => p.id === e.personId)?.name ?? 'Unknown',
          subtitle: `${formatFullDate(e.occurredAt)}${e.location ? ` · ${e.location}` : ''}`,
        })),
    [entries, people]
  );

  return (
    <SelectModal
      visible={visible}
      title="Which date?"
      onClose={onClose}
      options={options}
      emptyLabel="No dates logged yet."
      onSelect={(id) => {
        const entry = entries.find((e) => e.id === id);
        if (entry) onSelect(entry);
      }}
    />
  );
}
