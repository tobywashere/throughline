import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Note } from '../types';
import { colors, fonts, spacing, radii } from '../theme';
import { formatDateTime } from '../utils/date';

export function NoteList({ notes, onAdd }: { notes: Note[]; onAdd: () => void }) {
  return (
    <View>
      {notes.map((note) => (
        <View key={note.id} style={styles.note}>
          <Text style={styles.noteText}>{note.text}</Text>
          <Text style={styles.noteMeta}>{formatDateTime(note.createdAt)}</Text>
        </View>
      ))}
      <Pressable style={styles.addRow} onPress={onAdd}>
        <View style={styles.plusDot}>
          <Text style={styles.plusDotText}>+</Text>
        </View>
        <Text style={styles.addText}>Add a note</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    padding: 10,
    marginBottom: spacing.sm,
  },
  noteText: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.ink, lineHeight: 19 },
  noteMeta: { fontFamily: fonts.sans, fontSize: 10.5, color: colors.inkFaint, marginTop: 6 },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.3,
    borderStyle: 'dashed',
    borderColor: colors.outlineDash,
    borderRadius: 8,
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
  addText: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.inkFaint },
});
