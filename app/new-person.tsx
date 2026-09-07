import { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { ModalScreen } from '../src/components/ModalScreen';
import { Field, TextField } from '../src/components/FormField';
import { ChipInput } from '../src/components/ChipInput';
import { PillSelector } from '../src/components/PillSelector';
import { NoteList } from '../src/components/NoteList';
import { useStore } from '../src/store/useStore';
import { colors, fonts, radii, spacing } from '../src/theme';

export default function NewPersonScreen() {
  const { id, prefillName } = useLocalSearchParams<{ id?: string; prefillName?: string }>();
  const existing = useStore((s) => (id ? s.getPerson(id) : undefined));
  const addPerson = useStore((s) => s.addPerson);
  const updatePerson = useStore((s) => s.updatePerson);
  const notes = useStore(useShallow((s) => (id ? s.notesFor('person', id) : [])));

  const [name, setName] = useState(existing?.name ?? prefillName ?? '');
  const [howMet, setHowMet] = useState(existing?.howMet ?? '');
  const [status, setStatus] = useState<'prospect' | 'pre-date'>(
    existing && existing.status === 'pre-date' ? 'pre-date' : 'prospect'
  );
  const [greenFlags, setGreenFlags] = useState<string[]>(existing?.greenFlags ?? []);
  const [yellowFlags, setYellowFlags] = useState<string[]>(existing?.yellowFlags ?? []);

  const statusLocked = existing ? existing.status === 'dating' || existing.status === 'not-seeing' : false;

  const canSave = name.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    if (existing) {
      await updatePerson(existing.id, { name, howMet, greenFlags, yellowFlags });
    } else {
      await addPerson({ name, howMet, status, greenFlags, yellowFlags });
    }
    router.back();
  }

  return (
    <ModalScreen
      title={existing ? 'Edit Person' : 'New Person'}
      onCancel={() => router.back()}
      onSave={handleSave}
      saveDisabled={!canSave}
    >
      <Field label="Name">
        <TextField value={name} onChangeText={setName} placeholder="Their name" autoFocus={!existing} />
      </Field>

      <Field label="How you met">
        <TextField
          value={howMet}
          onChangeText={setHowMet}
          placeholder="A party, a dating app, a mutual friend…"
          multiline
          style={{ minHeight: 60, textAlignVertical: 'top' }}
        />
      </Field>

      <Field label="Status">
        <PillSelector
          options={[
            { value: 'prospect', label: 'Prospect' },
            { value: 'pre-date', label: 'Pre-date' },
          ]}
          value={status}
          onChange={setStatus}
          disabled={statusLocked}
        />
        {statusLocked && existing && (
          <Text style={styles.statusNote}>
            Currently {existing.status === 'dating' ? 'Dating' : 'No longer seeing'} — this changes automatically
            once dates are logged.
          </Text>
        )}
      </Field>

      <Field label="Green flags" color={colors.sage}>
        <ChipInput values={greenFlags} onChange={setGreenFlags} placeholder="Add a green flag" variant="green" />
      </Field>

      <Field label="Yellow flags" color={colors.inkFaint}>
        <ChipInput values={yellowFlags} onChange={setYellowFlags} placeholder="Add a yellow flag" variant="yellow" />
      </Field>

      <Field label="Notes">
        {existing ? (
          <NoteList notes={notes} onAdd={() => router.push(`/new-note?targetType=person&targetId=${existing.id}`)} />
        ) : (
          <View style={styles.disabledAdd}>
            <Text style={styles.disabledText}>Save this person first — notes start once they exist.</Text>
          </View>
        )}
      </Field>
    </ModalScreen>
  );
}

const styles = StyleSheet.create({
  statusNote: {
    fontFamily: fonts.serifItalic,
    fontStyle: 'italic',
    fontSize: 11,
    color: colors.inkFaint,
    marginTop: spacing.sm,
  },
  disabledAdd: {
    borderWidth: 1.3,
    borderStyle: 'dashed',
    borderColor: colors.outlineDash,
    borderRadius: radii.sm,
    padding: 10,
  },
  disabledText: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkFaint, fontStyle: 'italic' },
});
