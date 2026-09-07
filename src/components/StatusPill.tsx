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
  // Rose = pre-date, sage = dating — pipeline stage only, never a verdict.
  // Prospect / stepped-away sit outside the pipeline: neutral and dashed.
  const isNeutral = status === 'prospect' || status === 'not-seeing';
  const color = status === 'pre-date' ? colors.rose : status === 'dating' ? colors.sage : colors.inkFaint;
  return (
    <View style={[styles.pill, { borderColor: color }, isNeutral && styles.pillDashed]}>
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
  pillDashed: {
    borderStyle: 'dashed',
    opacity: 0.7,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
  },
});
