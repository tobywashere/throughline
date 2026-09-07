import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ModalScreen } from '../src/components/ModalScreen';
import { Field, TextField } from '../src/components/FormField';
import { PillSelector } from '../src/components/PillSelector';
import { PickerRow } from '../src/components/PickerRow';
import { PersonPickerModal } from '../src/components/PersonPickerModal';
import { EntryPickerModal } from '../src/components/EntryPickerModal';
import { useStore } from '../src/store/useStore';
import type { NoteTargetType } from '../src/types';
import { formatFullDate } from '../src/utils/date';

export default function NewNoteScreen() {
  const params = useLocalSearchParams<{ targetType?: NoteTargetType; targetId?: string }>();
  const locked = !!(params.targetType && params.targetId);

  const people = useStore((s) => s.people);
  const entries = useStore((s) => s.entries);
  const addNote = useStore((s) => s.addNote);

  const [targetType, setTargetType] = useState<NoteTargetType>(params.targetType ?? 'person');
  const [targetId, setTargetId] = useState<string | undefined>(params.targetId);
  const [text, setText] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const targetLabel = (() => {
    if (!targetId) return undefined;
    if (targetType === 'person') return people.find((p) => p.id === targetId)?.name;
    const entry = entries.find((e) => e.id === targetId);
    if (!entry) return undefined;
    const person = people.find((p) => p.id === entry.personId);
    return `${person?.name ?? 'Unknown'} — ${formatFullDate(entry.occurredAt)}`;
  })();

  const canSave = !!targetId && text.trim().length > 0;

  async function handleSave() {
    if (!canSave || !targetId) return;
    await addNote(targetType, targetId, text);
    router.back();
  }

  return (
    <ModalScreen title="New Note" onCancel={() => router.back()} onSave={handleSave} saveDisabled={!canSave}>
      <Field label="About">
        <PillSelector
          options={[
            { value: 'person', label: 'Person' },
            { value: 'date', label: 'Date entry' },
          ]}
          value={targetType}
          onChange={(value) => {
            setTargetType(value);
            setTargetId(undefined);
          }}
          disabled={locked}
        />
      </Field>

      <Field label={targetType === 'person' ? 'Which person?' : 'Which date?'}>
        <PickerRow
          value={targetLabel}
          placeholder={targetType === 'person' ? 'Choose someone' : 'Choose a logged date'}
          onPress={() => !locked && setPickerOpen(true)}
        />
      </Field>

      <Field label="Note">
        <TextField
          value={text}
          onChangeText={setText}
          placeholder="Write it as-is — this gets appended, timestamped, with nothing else changed."
          multiline
          autoFocus
          style={{ minHeight: 140, textAlignVertical: 'top' }}
        />
      </Field>

      {targetType === 'person' ? (
        <PersonPickerModal
          visible={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelectExisting={(person) => {
            setTargetId(person.id);
            setPickerOpen(false);
          }}
          allowCreate={false}
        />
      ) : (
        <EntryPickerModal
          visible={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(entry) => {
            setTargetId(entry.id);
            setPickerOpen(false);
          }}
        />
      )}
    </ModalScreen>
  );
}
