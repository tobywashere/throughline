import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';

export function ChipInput({
  values,
  onChange,
  placeholder = 'Add',
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

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
        <Pressable key={value} onPress={() => remove(value)} style={styles.chip}>
          <Text style={styles.chipText}>{value}</Text>
          <Text style={[styles.chipText, { marginLeft: 4 }]}>×</Text>
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
    borderColor: colors.ink,
    borderRadius: radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink,
  },
  chipInput: {
    minWidth: 90,
    borderStyle: 'dashed',
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink,
  },
});
