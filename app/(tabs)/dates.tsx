import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { EntryRow } from '../../src/components/EntryRow';
import { useStore } from '../../src/store/useStore';
import { groupByMonth } from '../../src/utils/date';
import { colors, fonts, spacing } from '../../src/theme';

export default function DatesScreen() {
  const entries = useStore((s) => s.entries);
  const people = useStore((s) => s.people);

  const groups = useMemo(() => {
    const sorted = [...entries].sort((a, b) => b.occurredAt - a.occurredAt);
    return groupByMonth(sorted, (e) => e.occurredAt);
  }, [entries]);

  return (
    <Screen title="Dates">
      {groups.length === 0 ? (
        <Text style={styles.empty}>No dates logged yet. Tap + to log your first one.</Text>
      ) : (
        groups.map((group) => (
          <View key={group.label} style={styles.section}>
            <Text style={styles.sectionLabel}>{group.label}</Text>
            {group.items.map((entry) => (
              <EntryRow
                key={entry.id}
                entry={entry}
                personName={people.find((p) => p.id === entry.personId)?.name ?? 'Unknown'}
              />
            ))}
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  sectionLabel: {
    fontFamily: fonts.serifItalic,
    fontStyle: 'italic',
    fontSize: 13,
    color: colors.rose,
    marginBottom: spacing.xs,
  },
  empty: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkFaint,
    fontStyle: 'italic',
    marginTop: 40,
    textAlign: 'center',
  },
});
