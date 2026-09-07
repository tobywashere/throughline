import { Pressable, Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import type { DateEntry } from '../types';
import { colors, fonts, spacing } from '../theme';
import { Avatar } from './Avatar';
import { formatFullDate } from '../utils/date';

export function EntryRow({
  entry,
  personName,
  showPersonName = true,
}: {
  entry: DateEntry;
  personName: string;
  showPersonName?: boolean;
}) {
  const subtitleParts = [entry.location, entry.significantMoments].filter(Boolean);
  return (
    <Pressable style={styles.row} onPress={() => router.push(`/date/${entry.id}`)}>
      {showPersonName && <Avatar name={personName} size={26} />}
      <View style={styles.textCol}>
        <Text style={styles.title} numberOfLines={1}>
          {showPersonName ? personName : formatFullDate(entry.occurredAt)}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitleParts.join(' — ') || 'No details yet'}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 9,
  },
  textCol: { flex: 1 },
  title: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink },
  subtitle: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkFaint, marginTop: 2 },
  chevron: { fontSize: 15, color: colors.outlineDash },
});
