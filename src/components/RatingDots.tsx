import { View, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme';

/**
 * A 1-5 rating rendered with the brand kit's own dot motif (filled = present,
 * dashed hollow = not yet) rather than a borrowed star-rating pattern.
 */
export function RatingDots({
  rating,
  onChange,
  size = 11,
}: {
  rating: number;
  onChange?: (value: number) => void;
  size?: number;
}) {
  const values = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      {values.map((value) => {
        const filled = value <= rating;
        const Dot = onChange ? Pressable : View;
        return (
          <Dot key={value} onPress={onChange ? () => onChange(value) : undefined} hitSlop={4}>
            <View
              style={[
                { width: size, height: size, borderRadius: size / 2 },
                filled ? { backgroundColor: colors.ink } : styles.empty,
              ]}
            />
          </Dot>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 5 },
  empty: {
    borderWidth: 1.3,
    borderColor: colors.ink,
    borderStyle: 'dashed',
    opacity: 0.4,
  },
});
