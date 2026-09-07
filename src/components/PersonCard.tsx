import { Pressable, Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import type { Person } from '../types';
import { colors, fonts, radii, spacing } from '../theme';
import { Avatar } from './Avatar';

export function PersonCard({ person, dim = false }: { person: Person; dim?: boolean }) {
  return (
    <Pressable
      style={[styles.card, dim && { opacity: 0.55 }]}
      onPress={() => router.push(`/person/${person.id}`)}
    >
      <Avatar name={person.name} size={28} />
      <Text style={styles.name} numberOfLines={1}>
        {person.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.3,
    borderColor: colors.outlineDash,
    borderRadius: radii.sm,
    backgroundColor: colors.card,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  name: {
    fontFamily: fonts.sansMedium,
    fontSize: 13.5,
    color: colors.ink,
    flexShrink: 1,
  },
});
