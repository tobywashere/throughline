import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';

type Variant = 'default' | 'green' | 'yellow';

const VARIANT_STYLES: Record<Variant, { border: string; text: string; bg: string }> = {
  default: { border: colors.ink, text: colors.ink, bg: 'transparent' },
  green: { border: colors.sage, text: colors.sage, bg: colors.sageFaint },
  yellow: { border: colors.amber, text: colors.amber, bg: colors.amberFaint },
};

export function ChipInput({
  values,
  onChange,
  placeholder = 'Add',
  variant = 'default',
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  variant?: Variant;
}) {
  const [draft, setDraft] = useState('');
  const style = VARIANT_STYLES[variant];

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft('');
  }

  function remove(value: string) {
    onChange(values.filter((v) => v !== value));
  }

  return (
    <View style={styles.wrap}>
      {values.map((value) => (
        <Pressable
          key={value}
          onPress={() => remove(value)}
          style={[styles.chip, { borderColor: style.border, backgroundColor: style.bg }]}
        >
          <Text style={[styles.chipText, { color: style.text }]}>{value}</Text>
          <Text style={[styles.chipText, { color: style.text, marginLeft: 4 }]}>×</Text>
        </Pressable>
      ))}
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={commit}
        onBlur={commit}
        placeholder={placeholder}
        placeholderTextColor={colors.inkFaint}
        style={[styles.chip, styles.chipInput, { borderColor: colors.outlineDash }]}
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.3,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
  },
  chipInput: {
    minWidth: 90,
    borderStyle: 'dashed',
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink,
  },
});
