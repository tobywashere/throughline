import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../theme';

export function DetailHeader({ title, onEdit }: { title: string; onEdit?: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backWrap}>
        <Text style={styles.back}>‹ Back</Text>
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {onEdit ? (
        <Pressable onPress={onEdit} hitSlop={8}>
          <Text style={styles.edit}>Edit</Text>
        </Pressable>
      ) : (
        <View style={styles.backWrap} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  backWrap: { minWidth: 50 },
  back: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkFaint },
  title: { fontFamily: fonts.serif, fontSize: 16, color: colors.ink, flex: 1, textAlign: 'center' },
  edit: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.rose, minWidth: 50, textAlign: 'right' },
});
