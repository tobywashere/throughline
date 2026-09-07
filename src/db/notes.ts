import { getDb } from './client';
import type { Note, NoteTargetType } from '../types';

export async function fetchAllNotes(): Promise<Note[]> {
  const db = await getDb();
  return db.getAllAsync<Note>('SELECT * FROM notes ORDER BY createdAt DESC');
}

export async function insertNote(note: Note): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO notes (id, targetType, targetId, text, createdAt) VALUES (?, ?, ?, ?, ?)`,
    note.id,
    note.targetType,
    note.targetId,
    note.text,
    note.createdAt
  );
}

export async function deleteNoteRow(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM notes WHERE id = ?', id);
}

export function noteTargetKey(targetType: NoteTargetType, targetId: string): string {
  return `${targetType}:${targetId}`;
}
