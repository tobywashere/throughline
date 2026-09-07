import { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/FormField';
import { PersonRow } from '../../src/components/PersonRow';
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

  const dating = filtered.filter((p) => p.status === 'pre-date' || p.status === 'dating');
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

      <Section label="Dating" people={dating} />
      <Section label="Prospects" people={prospects} />
      <Section label="No longer seeing" people={notSeeing} dim />
    </Screen>
  );
}

function Section({ label, people, dim = false }: { label: string; people: Person[]; dim?: boolean }) {
  if (people.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, dim && { opacity: 0.6 }]}>{label}</Text>
      {people.map((p) => (
        <PersonRow key={p.id} person={p} dim={dim} />
      ))}
    </View>
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
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
});
