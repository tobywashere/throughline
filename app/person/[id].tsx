import { View, Text, Pressable, Alert, ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { DetailHeader } from '../../src/components/DetailHeader';
import { StatusPill } from '../../src/components/StatusPill';
import { NoteList } from '../../src/components/NoteList';
import { EntryRow } from '../../src/components/EntryRow';
import { useStore } from '../../src/store/useStore';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { computeEntryOrdinals } from '../../src/utils/ordinal';

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = useStore((s) => s.getPerson(id));
  const entries = useStore(useShallow((s) => s.entriesForPerson(id)));
  const entryOrdinals = computeEntryOrdinals(entries);
  const notes = useStore(useShallow((s) => s.notesFor('person', id)));
  const stepAway = useStore((s) => s.stepAway);
  const resume = useStore((s) => s.resume);
  const deletePerson = useStore((s) => s.deletePerson);

  if (!person) {
    return (
      <View style={styles.container}>
        <DetailHeader title="Not found" />
      </View>
    );
  }

  function handleDelete() {
    Alert.alert(`Delete ${person!.name}?`, 'This removes them and every date and note attached to them.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deletePerson(person!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <DetailHeader title={person.name} onEdit={() => router.push(`/new-person?id=${person.id}`)} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusRow}>
          <StatusPill status={person.status} />
          {entries.length > 0 && (
            <Text style={styles.entryCountText}>
              {entries.length} {entries.length === 1 ? 'date' : 'dates'} logged
            </Text>
          )}
        </View>

        {person.howMet ? <Text style={styles.howMet}>{person.howMet}</Text> : null}

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.primaryAction}
            onPress={() => router.push(`/new-date?personId=${person.id}`)}
          >
            <Text style={styles.primaryActionText}>Log a date</Text>
          </Pressable>
          {person.status === 'not-seeing' ? (
            <Pressable style={styles.secondaryAction} onPress={() => resume(person.id)}>
              <Text style={styles.secondaryActionText}>Resume</Text>
            </Pressable>
          ) : person.status !== 'prospect' ? (
            <Pressable style={styles.secondaryAction} onPress={() => stepAway(person.id)}>
              <Text style={styles.secondaryActionText}>Step away</Text>
            </Pressable>
          ) : null}
        </View>

        {(person.greenFlags.length > 0 || person.yellowFlags.length > 0) && (
          <View style={styles.flagsSection}>
            {person.greenFlags.length > 0 && (
              <View style={styles.flagRow}>
                <Text style={styles.flagLabel}>Green flags</Text>
                <View style={styles.chipRow}>
                  {person.greenFlags.map((f) => (
                    <View key={f} style={styles.chip}>
                      <Text style={styles.chipText}>{f}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {person.yellowFlags.length > 0 && (
              <View style={styles.flagRow}>
                <Text style={styles.flagLabel}>Yellow flags</Text>
                <View style={styles.chipRow}>
                  {person.yellowFlags.map((f) => (
                    <View key={f} style={styles.chip}>
                      <Text style={styles.chipText}>{f}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        <Text style={styles.sectionLabel}>Notes</Text>
        <NoteList notes={notes} onAdd={() => router.push(`/new-note?targetType=person&targetId=${person.id}`)} />

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>Entries</Text>
        {entries.length === 0 ? (
          <Text style={styles.emptyText}>No dates logged yet.</Text>
        ) : (
          entries.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              personName={person.name}
              ordinal={entryOrdinals.get(entry.id) ?? 1}
              showPersonName={false}
            />
          ))
        )}

        <Pressable style={styles.deleteRow} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete person</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: spacing.lg, paddingBottom: 80 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  entryCountText: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkFaint },
  howMet: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.inkDim, lineHeight: 19, marginBottom: spacing.md },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  primaryAction: {
    backgroundColor: colors.rose,
    borderRadius: radii.sm,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  primaryActionText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.white },
  secondaryAction: {
    borderWidth: 1.3,
    borderColor: colors.outlineDash,
    borderRadius: radii.sm,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  secondaryActionText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.inkDim },
  flagsSection: { marginBottom: spacing.lg, gap: spacing.sm },
  flagRow: { gap: 6 },
  flagLabel: { fontFamily: fonts.serifItalic, fontStyle: 'italic', fontSize: 12, color: colors.rose },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderWidth: 1.3,
    borderColor: colors.ink,
    borderRadius: radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 11.5, color: colors.ink },
  sectionLabel: {
    fontFamily: fonts.serifItalic,
    fontStyle: 'italic',
    fontSize: 13,
    color: colors.rose,
    marginBottom: spacing.sm,
  },
  emptyText: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.inkFaint, fontStyle: 'italic' },
  deleteRow: { marginTop: spacing.xxl, alignItems: 'center', paddingVertical: 12 },
  deleteText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.rose },
});
