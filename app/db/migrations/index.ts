import { db } from '../index';
import { sql } from 'drizzle-orm';

export const runMigrations = async () => {
    // Table des anime
    await db.run(sql`
        CREATE TABLE IF NOT EXISTS anime (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            poster_image TEXT,
            episode_count INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Table des épisodes
    await db.run(sql`
        CREATE TABLE IF NOT EXISTS episodes (
            id TEXT PRIMARY KEY,
            anime_id TEXT NOT NULL,
            number INTEGER NOT NULL,
            title TEXT,
            watched INTEGER DEFAULT 0,
            FOREIGN KEY (anime_id) REFERENCES anime(id)
        )
    `);
};