import { Alert, Pressable, Text, View, StyleSheet } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Screen } from '../../src/components/Screen';
import { useStore } from '../../src/store/useStore';
import { colors, fonts, spacing } from '../../src/theme';

export default function SettingsScreen() {
  const people = useStore((s) => s.people);
  const entries = useStore((s) => s.entries);
  const notes = useStore((s) => s.notes);
  const resetAll = useStore((s) => s.resetAll);

  async function handleExport() {
    const payload = {
      exportedAt: new Date().toISOString(),
      people,
      entries,
      notes,
    };
    const file = new File(Paths.cache, 'throughline-export.json');
    file.create({ overwrite: true });
    file.write(JSON.stringify(payload, null, 2));
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Export Throughline data' });
    } else {
      Alert.alert('Export ready', `Saved to ${file.uri}`);
    }
  }

  function handleDeleteAll() {
    Alert.alert(
      'Delete everything?',
      'This permanently deletes every person, date, and note. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete everything', style: 'destructive', onPress: () => resetAll() },
      ]
    );
  }

  return (
    <Screen title="Settings">
      <Row label="Privacy & data" detail="Everything lives only on this device — nothing is uploaded." />
      <Row label="Export data" detail="Save a copy of everyone and every date as a JSON file." onPress={handleExport} />
      <Row
        label="About Throughline"
        detail="A dating journal built around two moments of writing: before and after."
      />
      <Row label="Delete all data" detail="Start over completely." onPress={handleDeleteAll} destructive />
    </Screen>
  );
}

function Row({
  label,
  detail,
  onPress,
  destructive = false,
}: {
  label: string;
  detail: string;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper style={styles.row} onPress={onPress}>
      <Text style={[styles.label, destructive && { color: colors.rose }]}>{label}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  label: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.ink },
  detail: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.inkFaint, marginTop: 4, lineHeight: 17 },
});
