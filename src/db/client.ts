import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('throughline.db').then(async (db) => {
      await db.execAsync('PRAGMA journal_mode = WAL;');
      await migrate(db);
      return db;
    });
  }
  return dbPromise;
}

export async function resetAllData(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    DELETE FROM notes;
    DELETE FROM date_entries;
    DELETE FROM people;
  `);
}

async function migrate(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS people (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      howMet TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL,
      previousActiveStatus TEXT,
      greenFlags TEXT NOT NULL DEFAULT '[]',
      yellowFlags TEXT NOT NULL DEFAULT '[]',
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS date_entries (
      id TEXT PRIMARY KEY NOT NULL,
      personId TEXT NOT NULL,
      occurredAt INTEGER NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      rating INTEGER NOT NULL DEFAULT 0,
      significantMoments TEXT NOT NULL DEFAULT '',
      feelingTags TEXT NOT NULL DEFAULT '[]',
      activityTags TEXT NOT NULL DEFAULT '[]',
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (personId) REFERENCES people(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY NOT NULL,
      targetType TEXT NOT NULL,
      targetId TEXT NOT NULL,
      text TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_entries_person ON date_entries(personId);
    CREATE INDEX IF NOT EXISTS idx_notes_target ON notes(targetType, targetId);
  `);
}
