import { useMemo } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { useStore } from '../../src/store/useStore';
import { Avatar } from '../../src/components/Avatar';
import { colors, fonts, radii, spacing } from '../../src/theme';
import type { Person } from '../../src/types';

export default function HomeScreen() {
  const people = useStore((s) => s.people);
  const entries = useStore((s) => s.entries);
  const stepAway = useStore((s) => s.stepAway);

  const entryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      counts.set(entry.personId, (counts.get(entry.personId) ?? 0) + 1);
    }
    return counts;
  }, [entries]);

  const preDate = useMemo(() => people.filter((p) => p.status === 'pre-date'), [people]);
  const dating = useMemo(() => people.filter((p) => p.status === 'dating'), [people]);
  const firstDate = useMemo(() => dating.filter((p) => (entryCounts.get(p.id) ?? 0) === 1), [dating, entryCounts]);
  const secondDate = useMemo(() => dating.filter((p) => (entryCounts.get(p.id) ?? 0) === 2), [dating, entryCounts]);
  const thirdPlusDate = useMemo(() => dating.filter((p) => (entryCounts.get(p.id) ?? 0) >= 3), [dating, entryCounts]);

  function onLongPressCard(person: Person) {
    Alert.alert(person.name, undefined, [
      { text: 'Step away', style: 'destructive', onPress: () => stepAway(person.id) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <Screen title="Home">
      <Text style={styles.sectionLabel}>Pipeline</Text>
      <View style={styles.columns}>
        <PipelineColumn label="Pre-date" color={colors.rose} people={preDate} onLongPress={onLongPressCard} />
        <PipelineColumn label="1st date" color={colors.sage} people={firstDate} onLongPress={onLongPressCard} />
        <PipelineColumn label="2nd date" color={colors.sage} people={secondDate} onLongPress={onLongPressCard} />
        <PipelineColumn label="3rd+ date" color={colors.sage} people={thirdPlusDate} onLongPress={onLongPressCard} />
      </View>

      <Text style={[styles.sectionLabel, { marginTop: spacing.xl, opacity: 0.5 }]}>Journey</Text>
      <View style={styles.journeyCard}>
        <Text style={styles.journeyPaused}>on hold for now</Text>
      </View>
    </Screen>
  );
}

function PipelineColumn({
  label,
  color,
  people,
  onLongPress,
}: {
  label: string;
  color: string;
  people: Person[];
  onLongPress: (p: Person) => void;
}) {
  return (
    <View style={styles.column}>
      <Text style={[styles.columnLabel, { color }]}>{label}</Text>
      {people.length === 0 ? (
        <Text style={styles.emptyText}>—</Text>
      ) : (
        people.map((person) => (
          <Pressable
            key={person.id}
            style={styles.card}
            onPress={() => router.push(`/person/${person.id}`)}
            onLongPress={() => onLongPress(person)}
          >
            <Avatar name={person.name} size={22} />
            <Text style={styles.cardName} numberOfLines={1}>
              {person.name}
            </Text>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: fonts.serifItalic,
    fontStyle: 'italic',
    fontSize: 13,
    color: colors.rose,
    marginBottom: spacing.sm,
  },
  columns: { flexDirection: 'row', gap: spacing.xs },
  column: { flex: 1, minWidth: 0 },
  columnLabel: {
    fontFamily: fonts.serifItalic,
    fontStyle: 'italic',
    fontSize: 10.5,
    marginBottom: spacing.sm,
  },
  card: {
    borderWidth: 1.3,
    borderColor: colors.outlineDash,
    borderRadius: radii.sm,
    backgroundColor: colors.card,
    padding: 6,
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.xs,
  },
  cardName: { fontFamily: fonts.sansMedium, fontSize: 10, color: colors.ink, textAlign: 'center' },
  emptyText: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkFaint, opacity: 0.4 },
  journeyCard: {
    borderWidth: 1.3,
    borderColor: colors.outlineDash,
    borderRadius: radii.sm,
    backgroundColor: colors.card,
    padding: 10,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  journeyPaused: {
    fontFamily: fonts.serifItalic,
    fontStyle: 'italic',
    fontSize: 12.5,
    color: colors.inkFaint,
  },
});
