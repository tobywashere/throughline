import { Modal, View, Text, Pressable, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { colors, fonts, spacing } from '../theme';

export interface SelectOption {
  id: string;
  title: string;
  subtitle?: string;
}

export function SelectModal({
  visible,
  title,
  options,
  onSelect,
  onClose,
  header,
  emptyLabel = 'Nothing here yet.',
}: {
  visible: boolean;
  title: string;
  options: SelectOption[];
  onSelect: (id: string) => void;
  onClose: () => void;
  header?: React.ReactNode;
  emptyLabel?: string;
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={onClose} hitSlop={8}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
          <Text style={styles.title}>{title}</Text>
          <View style={{ width: 50 }} />
        </View>
        {header}
        <FlatList
          data={options}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.lg }}
          ListEmptyComponent={<Text style={styles.empty}>{emptyLabel}</Text>}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => onSelect(item.id)}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.rowSubtitle}>{item.subtitle}</Text> : null}
            </Pressable>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  cancel: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkFaint, width: 50 },
  title: { fontFamily: fonts.serif, fontSize: 17, color: colors.ink },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowTitle: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.ink },
  rowSubtitle: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.inkFaint, marginTop: 2 },
  empty: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkFaint, textAlign: 'center', marginTop: 40 },
});
