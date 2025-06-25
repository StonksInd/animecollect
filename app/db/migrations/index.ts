import { db } from '../index';
import { sql } from 'drizzle-orm';

export const runMigrations = async () => {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS anime (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      posterImage TEXT,
      episodeCount INTEGER,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS episodes (
      id TEXT PRIMARY KEY,
      animeId TEXT NOT NULL,
      number INTEGER NOT NULL,
      title TEXT,
      watched INTEGER DEFAULT 0,
      FOREIGN KEY (animeId) REFERENCES anime(id)
    )
  `);
};