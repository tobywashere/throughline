import { Pressable, Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import type { Person } from '../types';
import { colors, fonts, spacing } from '../theme';
import { Avatar } from './Avatar';

export function PersonRow({ person, dim = false }: { person: Person; dim?: boolean }) {
  return (
    <Pressable style={styles.row} onPress={() => router.push(`/person/${person.id}`)}>
      <Avatar name={person.name} size={30} dim={dim} />
      <View style={styles.textCol}>
        <Text style={[styles.name, dim && styles.dimText]} numberOfLines={1}>
          {person.name}
        </Text>
        {person.howMet ? (
          <Text style={[styles.subtitle, dim && styles.dimText]} numberOfLines={1}>
            {person.howMet}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 8,
  },
  textCol: { flex: 1 },
  name: { fontFamily: fonts.sansMedium, fontSize: 14.5, color: colors.ink },
  subtitle: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkFaint, marginTop: 2 },
  dimText: { opacity: 0.55 },
});
