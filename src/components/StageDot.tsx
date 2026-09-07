import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

export type StageDotStyle = 'rose' | 'sage' | 'dashed';

/** The brand kit's status dot: rose = pre-date, sage = dating, dashed = outside the pipeline. */
export function StageDot({ style }: { style: StageDotStyle }) {
  if (style === 'dashed') {
    return <View style={[styles.base, styles.dashed]} />;
  }
  return <View style={[styles.base, { backgroundColor: style === 'rose' ? colors.rose : colors.sage }]} />;
}

const styles = StyleSheet.create({
  base: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  dashed: { borderWidth: 1.2, borderColor: colors.ink, borderStyle: 'dashed', opacity: 0.5 },
});
