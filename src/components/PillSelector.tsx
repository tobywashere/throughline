import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';

export function PillSelector<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            disabled={disabled}
            onPress={() => onChange(opt.value)}
            style={[
              styles.pill,
              selected && styles.pillSelected,
              disabled && !selected && styles.pillDisabled,
            ]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  pill: {
    borderWidth: 1.3,
    borderColor: colors.ink,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    opacity: 0.55,
  },
  pillSelected: {
    borderColor: colors.rose,
    backgroundColor: colors.roseFaint,
    opacity: 1,
  },
  pillDisabled: { opacity: 0.3 },
  label: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.ink },
  labelSelected: { color: colors.rose },
});
