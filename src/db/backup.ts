import { getDb, resetAllData } from './client';
import { insertPerson } from './people';
import { insertEntry } from './entries';
import { insertNote } from './notes';
import type { DateEntry, Note, Person } from '../types';

export interface BackupPayload {
  exportedAt?: string;
  people: Person[];
  entries: DateEntry[];
  notes: Note[];
}

const PERSON_STATUSES = ['prospect', 'pre-date', 'dating', 'not-seeing'];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

function requireArray(obj: Record<string, unknown>, key: string): unknown[] {
  const value = obj[key];
  if (!Array.isArray(value)) throw new Error(`Missing "${key}" list — is this a Throughline export?`);
  return value;
}

function requireId(item: unknown, kind: string, index: number): Record<string, unknown> {
  if (!isObject(item) || typeof item.id !== 'string' || !item.id) {
    throw new Error(`${kind} #${index + 1} is missing an id.`);
  }
  return item;
}

/** Parses and validates an exported JSON string. Throws with a readable message if it isn't usable. */
export function parseBackup(json: string): BackupPayload {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error("That file isn't valid JSON.");
  }
  if (!isObject(raw)) throw new Error("That file isn't a Throughline export.");

  const now = Date.now();

  const people: Person[] = requireArray(raw, 'people').map((item, i) => {
    const p = requireId(item, 'Person', i);
    const status = PERSON_STATUSES.includes(p.status as string) ? (p.status as Person['status']) : 'prospect';
    const prev = p.previousActiveStatus === 'pre-date' || p.previousActiveStatus === 'dating' ? p.previousActiveStatus : null;
    return {
      id: p.id as string,
      name: str(p.name, 'Unnamed'),
      howMet: str(p.howMet),
      status,
      previousActiveStatus: prev,
      greenFlags: strList(p.greenFlags),
      yellowFlags: strList(p.yellowFlags),
      createdAt: num(p.createdAt, now),
      updatedAt: num(p.updatedAt, now),
    };
  });

  const personIds = new Set(people.map((p) => p.id));
  const entries: DateEntry[] = requireArray(raw, 'entries').map((item, i) => {
    const e = requireId(item, 'Date', i);
    if (typeof e.personId !== 'string' || !personIds.has(e.personId)) {
      throw new Error(`Date #${i + 1} refers to a person who isn't in the file.`);
    }
    return {
      id: e.id as string,
      personId: e.personId,
      occurredAt: num(e.occurredAt, now),
      location: str(e.location),
      rating: num(e.rating, 0),
      significantMoments: str(e.significantMoments),
      feelingTags: strList(e.feelingTags),
      activityTags: strList(e.activityTags),
      createdAt: num(e.createdAt, now),
    };
  });

  const notes: Note[] = requireArray(raw, 'notes').map((item, i) => {
    const n = requireId(item, 'Note', i);
    if (n.targetType !== 'person' && n.targetType !== 'date') {
      throw new Error(`Note #${i + 1} has an unknown target type.`);
    }
    return {
      id: n.id as string,
      targetType: n.targetType,
      targetId: str(n.targetId),
      text: str(n.text),
      createdAt: num(n.createdAt, now),
    };
  });

  return { exportedAt: str(raw.exportedAt) || undefined, people, entries, notes };
}

/** Replaces everything on the device with the backup's contents. All-or-nothing. */
export async function restoreBackup(backup: BackupPayload): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await resetAllData();
    for (const person of backup.people) await insertPerson(person);
    for (const entry of backup.entries) await insertEntry(entry);
    for (const note of backup.notes) await insertNote(note);
  });
}
