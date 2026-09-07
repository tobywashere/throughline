import { View, Text, Pressable, Alert, ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { DetailHeader } from '../../src/components/DetailHeader';
import { StarRating } from '../../src/components/StarRating';
import { NoteList } from '../../src/components/NoteList';
import { useStore } from '../../src/store/useStore';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { formatDateTime } from '../../src/utils/date';

export default function DateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = useStore((s) => s.getEntry(id));
  const person = useStore((s) => (entry ? s.getPerson(entry.personId) : undefined));
  const notes = useStore(useShallow((s) => s.notesFor('date', id)));
  const deleteEntry = useStore((s) => s.deleteEntry);

  if (!entry) {
    return (
      <View style={styles.container}>
        <DetailHeader title="Not found" />
      </View>
    );
  }

  function handleDelete() {
    Alert.alert('Delete this date?', 'This removes the entry and any notes attached to it.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteEntry(entry!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <DetailHeader title={person?.name ?? 'Date'} onEdit={() => router.push(`/new-date?id=${entry.id}`)} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.dateText}>{formatDateTime(entry.occurredAt)}</Text>
        {entry.location ? <Text style={styles.location}>{entry.location}</Text> : null}

        <View style={styles.ratingRow}>
          <StarRating rating={entry.rating} size={22} />
        </View>

        {entry.significantMoments ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Significant moments</Text>
            <Text style={styles.body}>{entry.significantMoments}</Text>
          </View>
        ) : null}

        {(entry.feelingTags.length > 0 || entry.activityTags.length > 0) && (
          <View style={styles.section}>
            {entry.feelingTags.length > 0 && (
              <View style={styles.tagGroup}>
                <Text style={styles.sectionLabel}>How it felt</Text>
                <View style={styles.chipRow}>
                  {entry.feelingTags.map((t) => (
                    <View key={t} style={styles.chip}>
                      <Text style={styles.chipText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {entry.activityTags.length > 0 && (
              <View style={styles.tagGroup}>
                <Text style={styles.sectionLabel}>Activities</Text>
                <View style={styles.chipRow}>
                  {entry.activityTags.map((t) => (
                    <View key={t} style={styles.chip}>
                      <Text style={styles.chipText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        <Text style={[styles.sectionLabel, { marginTop: spacing.sm }]}>Notes</Text>
        <NoteList notes={notes} onAdd={() => router.push(`/new-note?targetType=date&targetId=${entry.id}`)} />

        <Pressable style={styles.deleteRow} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete date</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: spacing.lg, paddingBottom: 80 },
  dateText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.inkFaint },
  location: { fontFamily: fonts.serif, fontSize: 19, color: colors.ink, marginTop: 4 },
  ratingRow: { marginTop: spacing.md, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  tagGroup: { marginBottom: spacing.md },
  sectionLabel: {
    fontFamily: fonts.serifItalic,
    fontStyle: 'italic',
    fontSize: 13,
    color: colors.rose,
    marginBottom: spacing.sm,
  },
  body: { fontFamily: fonts.sans, fontSize: 14, color: colors.ink, lineHeight: 21 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderWidth: 1.3,
    borderColor: colors.ink,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 11.5, color: colors.ink },
  deleteRow: { marginTop: spacing.xxl, alignItems: 'center', paddingVertical: 12 },
  deleteText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.rose },
});
