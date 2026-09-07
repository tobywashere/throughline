import { getDb } from './client';
import type { DateEntry } from '../types';

interface EntryRow {
  id: string;
  personId: string;
  occurredAt: number;
  location: string;
  significantMoments: string;
  feelingTags: string;
  activityTags: string;
  createdAt: number;
}

function fromRow(row: EntryRow): DateEntry {
  return {
    ...row,
    feelingTags: JSON.parse(row.feelingTags),
    activityTags: JSON.parse(row.activityTags),
  };
}

export async function fetchAllEntries(): Promise<DateEntry[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<EntryRow>('SELECT * FROM date_entries ORDER BY occurredAt DESC');
  return rows.map(fromRow);
}

export async function insertEntry(entry: DateEntry): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO date_entries (id, personId, occurredAt, location, significantMoments, feelingTags, activityTags, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    entry.id,
    entry.personId,
    entry.occurredAt,
    entry.location,
    entry.significantMoments,
    JSON.stringify(entry.feelingTags),
    JSON.stringify(entry.activityTags),
    entry.createdAt
  );
}

export async function updateEntryRow(entry: DateEntry): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE date_entries SET occurredAt = ?, location = ?, significantMoments = ?, feelingTags = ?, activityTags = ?
     WHERE id = ?`,
    entry.occurredAt,
    entry.location,
    entry.significantMoments,
    JSON.stringify(entry.feelingTags),
    JSON.stringify(entry.activityTags),
    entry.id
  );
}

export async function deleteEntryRow(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM notes WHERE targetType = 'date' AND targetId = ?", id);
  await db.runAsync('DELETE FROM date_entries WHERE id = ?', id);
}
