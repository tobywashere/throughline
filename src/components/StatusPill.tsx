import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme';
import type { PersonStatus } from '../types';

const LABELS: Record<PersonStatus, string> = {
  prospect: 'Prospect',
  'pre-date': 'Pre-date',
  dating: 'Dating',
  'not-seeing': 'No longer seeing',
};

export function StatusPill({ status }: { status: PersonStatus }) {
  const color = status === 'dating' ? colors.rose : status === 'not-seeing' ? colors.inkFaint : colors.sage;
  return (
    <View style={[styles.pill, { borderColor: color }]}>
      <Text style={[styles.label, { color }]}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderWidth: 1.3,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
  },
});
