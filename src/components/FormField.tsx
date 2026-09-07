import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';

export function FieldLabel({ children, color }: { children: string; color?: string }) {
  return <Text style={[styles.label, color ? { color } : null]}>{children}</Text>;
}

export function TextField({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.inkFaint}
      style={[styles.input, style]}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
  color,
}: {
  label: string;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <View style={styles.field}>
      <FieldLabel color={color}>{label}</FieldLabel>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.lg },
  label: {
    fontFamily: fonts.serifItalic,
    fontStyle: 'italic',
    fontSize: 12.5,
    color: colors.rose,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1.3,
    borderColor: colors.outlineDash,
    borderRadius: radii.sm,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.sans,
    fontSize: 14.5,
    color: colors.ink,
  },
});
