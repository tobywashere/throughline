import { View, Text, StyleSheet, ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../theme';

export function ScreenHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {right}
    </View>
  );
}

export function Screen({
  title,
  right,
  children,
  scroll = true,
  contentStyle,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ScrollViewProps['contentContainerStyle'];
}) {
  const insets = useSafeAreaInsets();
  const Wrapper = scroll ? ScrollView : View;
  const wrapperProps = scroll
    ? { contentContainerStyle: [{ padding: spacing.lg, paddingBottom: 140 }, contentStyle] }
    : { style: [{ flex: 1, padding: spacing.lg }, contentStyle] };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title={title} right={right} />
      <Wrapper {...(wrapperProps as any)}>{children}</Wrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.ink,
  },
});
