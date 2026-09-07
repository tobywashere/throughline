import { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/FormField';
import { PersonRow } from '../../src/components/PersonRow';
import { StageDot, type StageDotStyle } from '../../src/components/StageDot';
import { useStore } from '../../src/store/useStore';
import { colors, fonts, spacing } from '../../src/theme';
import type { Person } from '../../src/types';

export default function PeopleScreen() {
  const people = useStore((s) => s.people);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter((p) => p.name.toLowerCase().includes(q));
  }, [people, query]);

  const dating = filtered.filter((p) => p.status === 'dating');
  const preDate = filtered.filter((p) => p.status === 'pre-date');
  const prospects = filtered.filter((p) => p.status === 'prospect');
  const notSeeing = filtered.filter((p) => p.status === 'not-seeing');

  return (
    <Screen title="People">
      <TextField
        value={query}
        onChangeText={setQuery}
        placeholder="Search people"
        style={{ marginBottom: spacing.lg }}
      />

      <Section label="Dating" dot="sage" people={dating} />
      <Section label="Pre-date" dot="rose" people={preDate} />
      <Section label="Prospects" dot="dashed" people={prospects} />
      <Section label="No longer seeing" people={notSeeing} dim />
    </Screen>
  );
}

function Section({
  label,
  dot,
  people,
  dim = false,
}: {
  label: string;
  dot?: StageDotStyle;
  people: Person[];
  dim?: boolean;
}) {
  if (people.length === 0) return null;
  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, dim && { opacity: 0.6 }]}>
        {dot && <StageDot style={dot} />}
        <Text style={styles.sectionLabel}>{label}</Text>
      </View>
      {people.map((p) => (
        <PersonRow key={p.id} person={p} dim={dim} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    marginBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sectionLabel: {
    fontFamily: fonts.serifItalic,
    fontStyle: 'italic',
    fontSize: 13,
    color: colors.rose,
  },
});
