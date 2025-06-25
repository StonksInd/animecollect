// db/schema.ts
import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';

export const anime = sqliteTable('anime', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  posterImage: text('poster_image'),
  episodeCount: integer('episode_count'),
  // autres champs...
});

export const episodes = sqliteTable('episodes', {
  id: integer('id').primaryKey(),
  animeId: integer('anime_id').references(() => anime.id),
  number: integer('number').notNull(),
  title: text('title'),
  watched: integer('watched', { mode: 'boolean' }).default(false),
  // autres champs...
});

// Configuration de Drizzle
// db/index.ts
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite/next';

const expoDb = openDatabaseSync('animecollect.db');
export const db = drizzle(expoDb);