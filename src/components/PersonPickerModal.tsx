import { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';
import { SelectModal } from './SelectModal';
import { TextField } from './FormField';
import { colors, fonts, radii, spacing } from '../theme';
import type { Person } from '../types';

export function PersonPickerModal({
  visible,
  onClose,
  onSelectExisting,
  onCreateNew,
  allowCreate = true,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectExisting: (person: Person) => void;
  onCreateNew?: (name: string) => void;
  allowCreate?: boolean;
}) {
  const people = useStore((s) => s.people);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...people].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return sorted;
    return sorted.filter((p) => p.name.toLowerCase().includes(q));
  }, [people, query]);

  const exactMatch = people.some((p) => p.name.toLowerCase() === query.trim().toLowerCase());
  const showCreate = allowCreate && query.trim().length > 0 && !exactMatch;

  return (
    <SelectModal
      visible={visible}
      title="Who was this with?"
      onClose={() => {
        setQuery('');
        onClose();
      }}
      options={filtered.map((p) => ({ id: p.id, title: p.name, subtitle: statusLabel(p) }))}
      onSelect={(id) => {
        const person = people.find((p) => p.id === id);
        if (person) onSelectExisting(person);
        setQuery('');
      }}
      emptyLabel="No one matches yet — add them as new below."
      header={
        <View style={styles.header}>
          <TextField
            value={query}
            onChangeText={setQuery}
            placeholder="Search or add a new name"
            autoFocus
          />
          {showCreate && (
            <Pressable
              style={styles.createRow}
              onPress={() => {
                onCreateNew?.(query.trim());
                setQuery('');
              }}
            >
              <View style={styles.plusDot}>
                <Text style={styles.plusDotText}>+</Text>
              </View>
              <Text style={styles.createText}>Add “{query.trim()}” as someone new</Text>
            </Pressable>
          )}
        </View>
      }
    />
  );
}

function statusLabel(p: Person): string {
  switch (p.status) {
    case 'prospect':
      return 'Prospect';
    case 'pre-date':
      return 'Pre-date';
    case 'dating':
      return 'Dating';
    case 'not-seeing':
      return 'No longer seeing';
  }
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.sm },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.3,
    borderStyle: 'dashed',
    borderColor: colors.outlineDash,
    borderRadius: radii.sm,
    padding: 10,
  },
  plusDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.3,
    borderColor: colors.outlineDash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusDotText: { fontSize: 11, color: colors.inkFaint, lineHeight: 12 },
  createText: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkDim },
});
