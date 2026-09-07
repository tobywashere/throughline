import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { ModalScreen } from '../src/components/ModalScreen';
import { Field, TextField } from '../src/components/FormField';
import { ChipInput } from '../src/components/ChipInput';
import { StarRating } from '../src/components/StarRating';
import { PickerRow } from '../src/components/PickerRow';
import { PersonPickerModal } from '../src/components/PersonPickerModal';
import { NoteList } from '../src/components/NoteList';
import { useStore } from '../src/store/useStore';
import { colors, fonts } from '../src/theme';
import type { Person } from '../src/types';

export default function NewDateScreen() {
  const { id, personId: prefillPersonId } = useLocalSearchParams<{ id?: string; personId?: string }>();
  const existing = useStore((s) => (id ? s.getEntry(id) : undefined));
  const people = useStore((s) => s.people);
  const addEntry = useStore((s) => s.addEntry);
  const updateEntry = useStore((s) => s.updateEntry);
  const addPerson = useStore((s) => s.addPerson);
  const notes = useStore(useShallow((s) => (id ? s.notesFor('date', id) : [])));

  const initialPersonId = existing?.personId ?? prefillPersonId;
  const [personId, setPersonId] = useState<string | undefined>(initialPersonId);
  const [location, setLocation] = useState(existing?.location ?? '');
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [significantMoments, setSignificantMoments] = useState(existing?.significantMoments ?? '');
  const [feelingTags, setFeelingTags] = useState<string[]>(existing?.feelingTags ?? []);
  const [activityTags, setActivityTags] = useState<string[]>(existing?.activityTags ?? []);
  const [pickerOpen, setPickerOpen] = useState(false);

  const selectedPerson = people.find((p) => p.id === personId);
  const canSave = !!personId && rating > 0;

  async function handleSave() {
    if (!canSave || !personId) return;
    if (existing) {
      await updateEntry(existing.id, { location, rating, significantMoments, feelingTags, activityTags });
    } else {
      await addEntry({ personId, location, rating, significantMoments, feelingTags, activityTags });
    }
    router.back();
  }

  async function handleCreatePerson(name: string) {
    const person = await addPerson({ name, howMet: '', status: 'dating', greenFlags: [], yellowFlags: [] });
    setPersonId(person.id);
    setPickerOpen(false);
  }

  function handleSelectPerson(person: Person) {
    setPersonId(person.id);
    setPickerOpen(false);
  }

  return (
    <ModalScreen
      title={existing ? 'Edit Date' : 'New Date'}
      onCancel={() => router.back()}
      onSave={handleSave}
      saveDisabled={!canSave}
    >
      <Field label="Who was this with?">
        <PickerRow
          value={selectedPerson?.name}
          placeholder="Choose or add someone"
          onPress={() => setPickerOpen(true)}
        />
      </Field>

      <Field label="Location">
        <TextField value={location} onChangeText={setLocation} placeholder="Where'd you go?" />
      </Field>

      <Field label="Overall rating">
        <StarRating rating={rating} onChange={setRating} />
        <Text style={styles.hint}>Rates the date, not the person.</Text>
      </Field>

      <Field label="Significant moments">
        <TextField
          value={significantMoments}
          onChangeText={setSignificantMoments}
          placeholder="What actually happened — the parts worth remembering."
          multiline
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />
      </Field>

      <Field label="How did it feel?">
        <ChipInput values={feelingTags} onChange={setFeelingTags} placeholder="Add a feeling" />
      </Field>

      <Field label="Activities">
        <ChipInput values={activityTags} onChange={setActivityTags} placeholder="Add an activity" />
      </Field>

      <Field label="Notes">
        {existing ? (
          <NoteList notes={notes} onAdd={() => router.push(`/new-note?targetType=date&targetId=${existing.id}`)} />
        ) : (
          <View style={styles.disabledAdd}>
            <Text style={styles.disabledText}>Available once this date is saved.</Text>
          </View>
        )}
      </Field>

      <PersonPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectExisting={handleSelectPerson}
        onCreateNew={handleCreatePerson}
      />
    </ModalScreen>
  );
}

const styles = StyleSheet.create({
  hint: { fontFamily: fonts.sans, fontSize: 11.5, color: colors.inkFaint, marginTop: 6, fontStyle: 'italic' },
  disabledAdd: {
    borderWidth: 1.3,
    borderStyle: 'dashed',
    borderColor: colors.outlineDash,
    borderRadius: 8,
    padding: 10,
  },
  disabledText: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkFaint, fontStyle: 'italic' },
});
