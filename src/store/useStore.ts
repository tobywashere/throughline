import { create } from 'zustand';
import type { DateEntry, Note, NoteTargetType, Person, PersonStatus } from '../types';
import { generateId } from '../utils/id';
import { fetchAllPeople, insertPerson, updatePersonRow, deletePersonRow } from '../db/people';
import { fetchAllEntries, insertEntry, updateEntryRow, deleteEntryRow } from '../db/entries';
import { fetchAllNotes, insertNote, deleteNoteRow } from '../db/notes';
import { resetAllData } from '../db/client';

interface NewPersonInput {
  name: string;
  howMet: string;
  status: 'prospect' | 'pre-date' | 'dating';
  greenFlags: string[];
  yellowFlags: string[];
}

interface NewEntryInput {
  personId: string;
  location: string;
  significantMoments: string;
  feelingTags: string[];
  activityTags: string[];
  occurredAt?: number;
}

interface Store {
  isHydrated: boolean;
  people: Person[];
  entries: DateEntry[];
  notes: Note[];

  hydrate: () => Promise<void>;
  resetAll: () => Promise<void>;

  addPerson: (input: NewPersonInput) => Promise<Person>;
  updatePerson: (id: string, patch: Partial<NewPersonInput>) => Promise<void>;
  stepAway: (id: string) => Promise<void>;
  resume: (id: string) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;

  addEntry: (input: NewEntryInput) => Promise<DateEntry>;
  updateEntry: (id: string, patch: Partial<NewEntryInput>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;

  addNote: (targetType: NoteTargetType, targetId: string, text: string) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;

  getPerson: (id: string) => Person | undefined;
  getEntry: (id: string) => DateEntry | undefined;
  entriesForPerson: (personId: string) => DateEntry[];
  notesFor: (targetType: NoteTargetType, targetId: string) => Note[];
}

export const useStore = create<Store>((set, get) => ({
  isHydrated: false,
  people: [],
  entries: [],
  notes: [],

  hydrate: async () => {
    const [people, entries, notes] = await Promise.all([
      fetchAllPeople(),
      fetchAllEntries(),
      fetchAllNotes(),
    ]);
    set({ people, entries, notes, isHydrated: true });
  },

  resetAll: async () => {
    await resetAllData();
    set({ people: [], entries: [], notes: [] });
  },

  addPerson: async (input) => {
    const now = Date.now();
    const person: Person = {
      id: generateId(),
      name: input.name.trim(),
      howMet: input.howMet.trim(),
      status: input.status,
      previousActiveStatus: null,
      greenFlags: input.greenFlags,
      yellowFlags: input.yellowFlags,
      createdAt: now,
      updatedAt: now,
    };
    await insertPerson(person);
    set((s) => ({ people: [...s.people, person] }));
    return person;
  },

  updatePerson: async (id, patch) => {
    const existing = get().people.find((p) => p.id === id);
    if (!existing) return;
    const updated: Person = {
      ...existing,
      ...patch,
      name: patch.name !== undefined ? patch.name.trim() : existing.name,
      howMet: patch.howMet !== undefined ? patch.howMet.trim() : existing.howMet,
      updatedAt: Date.now(),
    };
    await updatePersonRow(updated);
    set((s) => ({ people: s.people.map((p) => (p.id === id ? updated : p)) }));
  },

  stepAway: async (id) => {
    const existing = get().people.find((p) => p.id === id);
    if (!existing || existing.status === 'prospect' || existing.status === 'not-seeing') return;
    const updated: Person = {
      ...existing,
      status: 'not-seeing',
      previousActiveStatus: existing.status as 'pre-date' | 'dating',
      updatedAt: Date.now(),
    };
    await updatePersonRow(updated);
    set((s) => ({ people: s.people.map((p) => (p.id === id ? updated : p)) }));
  },

  resume: async (id) => {
    const existing = get().people.find((p) => p.id === id);
    if (!existing || existing.status !== 'not-seeing') return;
    const updated: Person = {
      ...existing,
      status: existing.previousActiveStatus ?? 'dating',
      previousActiveStatus: null,
      updatedAt: Date.now(),
    };
    await updatePersonRow(updated);
    set((s) => ({ people: s.people.map((p) => (p.id === id ? updated : p)) }));
  },

  deletePerson: async (id) => {
    await deletePersonRow(id);
    set((s) => ({
      people: s.people.filter((p) => p.id !== id),
      entries: s.entries.filter((e) => e.personId !== id),
      notes: s.notes.filter((n) => !(n.targetType === 'person' && n.targetId === id)),
    }));
  },

  addEntry: async (input) => {
    const now = Date.now();
    const entry: DateEntry = {
      id: generateId(),
      personId: input.personId,
      occurredAt: input.occurredAt ?? now,
      location: input.location.trim(),
      significantMoments: input.significantMoments.trim(),
      feelingTags: input.feelingTags,
      activityTags: input.activityTags,
      createdAt: now,
    };
    await insertEntry(entry);
    set((s) => ({ entries: [entry, ...s.entries] }));

    // Logging a date always brings the person into (or back to) 'dating'.
    const person = get().people.find((p) => p.id === input.personId);
    if (person && person.status !== 'dating') {
      const updated: Person = { ...person, status: 'dating', previousActiveStatus: null, updatedAt: now };
      await updatePersonRow(updated);
      set((s) => ({ people: s.people.map((p) => (p.id === person.id ? updated : p)) }));
    }

    return entry;
  },

  updateEntry: async (id, patch) => {
    const existing = get().entries.find((e) => e.id === id);
    if (!existing) return;
    const updated: DateEntry = {
      ...existing,
      ...patch,
      location: patch.location !== undefined ? patch.location.trim() : existing.location,
      significantMoments:
        patch.significantMoments !== undefined ? patch.significantMoments.trim() : existing.significantMoments,
    };
    await updateEntryRow(updated);
    set((s) => ({ entries: s.entries.map((e) => (e.id === id ? updated : e)) }));
  },

  deleteEntry: async (id) => {
    await deleteEntryRow(id);
    set((s) => ({
      entries: s.entries.filter((e) => e.id !== id),
      notes: s.notes.filter((n) => !(n.targetType === 'date' && n.targetId === id)),
    }));
  },

  addNote: async (targetType, targetId, text) => {
    const note: Note = {
      id: generateId(),
      targetType,
      targetId,
      text: text.trim(),
      createdAt: Date.now(),
    };
    await insertNote(note);
    set((s) => ({ notes: [note, ...s.notes] }));
    return note;
  },

  deleteNote: async (id) => {
    await deleteNoteRow(id);
    set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
  },

  getPerson: (id) => get().people.find((p) => p.id === id),
  getEntry: (id) => get().entries.find((e) => e.id === id),
  entriesForPerson: (personId) =>
    get()
      .entries.filter((e) => e.personId === personId)
      .sort((a, b) => b.occurredAt - a.occurredAt),
  notesFor: (targetType, targetId) =>
    get()
      .notes.filter((n) => n.targetType === targetType && n.targetId === targetId)
      .sort((a, b) => b.createdAt - a.createdAt),
}));

export type { PersonStatus };
