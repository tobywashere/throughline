import { getDb } from './client';
import type { Person, PersonStatus } from '../types';

interface PersonRow {
  id: string;
  name: string;
  howMet: string;
  status: PersonStatus;
  previousActiveStatus: 'pre-date' | 'dating' | null;
  greenFlags: string;
  yellowFlags: string;
  createdAt: number;
  updatedAt: number;
}

function fromRow(row: PersonRow): Person {
  return {
    ...row,
    greenFlags: JSON.parse(row.greenFlags),
    yellowFlags: JSON.parse(row.yellowFlags),
  };
}

export async function fetchAllPeople(): Promise<Person[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<PersonRow>('SELECT * FROM people ORDER BY name COLLATE NOCASE ASC');
  return rows.map(fromRow);
}

export async function insertPerson(person: Person): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO people (id, name, howMet, status, previousActiveStatus, greenFlags, yellowFlags, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    person.id,
    person.name,
    person.howMet,
    person.status,
    person.previousActiveStatus,
    JSON.stringify(person.greenFlags),
    JSON.stringify(person.yellowFlags),
    person.createdAt,
    person.updatedAt
  );
}

export async function updatePersonRow(person: Person): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE people SET name = ?, howMet = ?, status = ?, previousActiveStatus = ?, greenFlags = ?, yellowFlags = ?, updatedAt = ?
     WHERE id = ?`,
    person.name,
    person.howMet,
    person.status,
    person.previousActiveStatus,
    JSON.stringify(person.greenFlags),
    JSON.stringify(person.yellowFlags),
    person.updatedAt,
    person.id
  );
}

export async function deletePersonRow(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    "DELETE FROM notes WHERE targetType = 'date' AND targetId IN (SELECT id FROM date_entries WHERE personId = ?)",
    id
  );
  await db.runAsync('DELETE FROM date_entries WHERE personId = ?', id);
  await db.runAsync("DELETE FROM notes WHERE targetType = 'person' AND targetId = ?", id);
  await db.runAsync('DELETE FROM people WHERE id = ?', id);
}
