import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme';

export function PickerRow({
  value,
  placeholder,
  onPress,
}: {
  value?: string;
  placeholder: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
        {value || placeholder}
      </Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1.3,
    borderColor: colors.outlineDash,
    borderRadius: radii.sm,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontFamily: fonts.sans,
    fontSize: 14.5,
    color: colors.ink,
    flex: 1,
  },
  placeholder: {
    color: colors.inkFaint,
  },
  chevron: {
    fontSize: 16,
    color: colors.outlineDash,
    marginLeft: 8,
  },
});
