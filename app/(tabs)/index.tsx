import { useMemo } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { useStore } from '../../src/store/useStore';
import { Avatar } from '../../src/components/Avatar';
import { Thread } from '../../src/components/Thread';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { computeJourneyInsight } from '../../src/utils/journey';
import type { Person } from '../../src/types';

export default function HomeScreen() {
  const people = useStore((s) => s.people);
  const entries = useStore((s) => s.entries);
  const stepAway = useStore((s) => s.stepAway);

  const preDate = useMemo(() => people.filter((p) => p.status === 'pre-date'), [people]);
  const dating = useMemo(() => people.filter((p) => p.status === 'dating'), [people]);
  const journey = useMemo(() => computeJourneyInsight(entries), [entries]);

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
        <PipelineColumn label="Dating" color={colors.sage} people={dating} onLongPress={onLongPressCard} />
      </View>

      <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>Journey</Text>
      <View style={styles.journeyCard}>
        <Thread count={journey.entryCount} width={280} height={56} />
      </View>
      <Text style={styles.journeyInsight}>{journey.insight}</Text>
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
        <Text style={styles.emptyText}>Nobody here yet</Text>
      ) : (
        people.map((person) => (
          <Pressable
            key={person.id}
            style={styles.card}
            onPress={() => router.push(`/person/${person.id}`)}
            onLongPress={() => onLongPress(person)}
          >
            <Avatar name={person.name} size={26} />
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
  columns: { flexDirection: 'row', gap: spacing.md },
  column: { flex: 1 },
  columnLabel: {
    fontFamily: fonts.serifItalic,
    fontStyle: 'italic',
    fontSize: 11.5,
    marginBottom: spacing.sm,
  },
  card: {
    borderWidth: 1.3,
    borderColor: colors.outlineDash,
    borderRadius: radii.sm,
    backgroundColor: colors.card,
    padding: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardName: { fontFamily: fonts.sansMedium, fontSize: 12.5, color: colors.ink, flexShrink: 1 },
  emptyText: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkFaint, fontStyle: 'italic' },
  journeyCard: {
    borderWidth: 1.3,
    borderColor: colors.outlineDash,
    borderRadius: radii.sm,
    backgroundColor: colors.card,
    padding: 10,
    alignItems: 'center',
  },
  journeyInsight: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkDim,
    marginTop: spacing.sm,
    lineHeight: 19,
  },
});
