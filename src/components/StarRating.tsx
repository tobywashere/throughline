import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export function StarRating({
  rating,
  onChange,
  size = 26,
}: {
  rating: number;
  onChange?: (value: number) => void;
  size?: number;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      {stars.map((value) => {
        const filled = value <= rating;
        const Star = onChange ? Pressable : View;
        return (
          <Star key={value} onPress={onChange ? () => onChange(value) : undefined} hitSlop={4}>
            <Text style={{ fontSize: size, color: filled ? colors.rose : '#d8d4c8', letterSpacing: 2 }}>
              {filled ? '★' : '☆'}
            </Text>
          </Star>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
});
