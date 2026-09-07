import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';

type DotStyle = 'rose' | 'sage' | 'dashed';

export function PillSelector<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
}: {
  options: { value: T; label: string; dot?: DotStyle }[];
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
            {opt.dot && <Dot style={opt.dot} inverted={selected} />}
            <Text style={[styles.label, selected && styles.labelSelected]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Dot({ style, inverted }: { style: DotStyle; inverted: boolean }) {
  if (style === 'dashed') {
    return <View style={[dotStyles.base, dotStyles.dashed, { borderColor: inverted ? colors.card : colors.ink }]} />;
  }
  const color = style === 'rose' ? colors.rose : colors.sage;
  return <View style={[dotStyles.base, { backgroundColor: color }]} />;
}

const dotStyles = StyleSheet.create({
  base: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  dashed: { borderWidth: 1.2, borderStyle: 'dashed', opacity: 0.6 },
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.3,
    borderColor: colors.ink,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    opacity: 0.65,
  },
  pillSelected: {
    backgroundColor: colors.ink,
    opacity: 1,
  },
  pillDisabled: { opacity: 0.3 },
  label: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.ink },
  labelSelected: { color: colors.card },
});
