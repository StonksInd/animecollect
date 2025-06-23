import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Table pour stocker les informations des animés
 */
export const animes = sqliteTable('animes', {
  id: text('id').primaryKey(),
  kitsuId: text('kitsu_id').unique().notNull(),
  title: text('title').notNull(),
  canonicalTitle: text('canonical_title'),
  synopsis: text('synopsis'),
  averageRating: real('average_rating'),
  episodeCount: integer('episode_count'),
  status: text('status'), // current, finished, upcoming, etc.
  startDate: text('start_date'),
  endDate: text('end_date'),
  posterImageUrl: text('poster_image_url'),
  coverImageUrl: text('cover_image_url'),
  subtype: text('subtype'), // TV, movie, OVA, etc.
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

/**
 * Table pour stocker les épisodes
 */
export const episodes = sqliteTable('episodes', {
  id: text('id').primaryKey(),
  kitsuId: text('kitsu_id').unique().notNull(),
  animeId: text('anime_id').references(() => animes.id, { onDelete: 'cascade' }).notNull(),
  number: integer('number').notNull(),
  title: text('title'),
  canonicalTitle: text('canonical_title'),
  synopsis: text('synopsis'),
  airdate: text('airdate'),
  length: integer('length'), // durée en minutes
  thumbnailUrl: text('thumbnail_url'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

/**
 * Table pour stocker les catégories/genres
 */
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  kitsuId: text('kitsu_id').unique().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

/**
 * Table de liaison entre animés et catégories (relation many-to-many)
 */
export const animeCategories = sqliteTable('anime_categories', {
  id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
  animeId: text('anime_id').references(() => animes.id, { onDelete: 'cascade' }).notNull(),
  categoryId: text('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull()
});

/**
 * Table pour stocker la collection personnelle de l'utilisateur
 */
export const userCollection = sqliteTable('user_collection', {
  id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
  animeId: text('anime_id').references(() => animes.id, { onDelete: 'cascade' }).notNull(),
  status: text('status').notNull(), // watching, completed, plan_to_watch, dropped, on_hold
  progress: integer('progress').default(0), // nombre d'épisodes vus
  rating: real('rating'), // note personnelle de l'utilisateur
  notes: text('notes'), // notes personnelles
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

/**
 * Table pour stocker les épisodes vus par l'utilisateur
 */
export const watchedEpisodes = sqliteTable('watched_episodes', {
  id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
  episodeId: text('episode_id').references(() => episodes.id, { onDelete: 'cascade' }).notNull(),
  animeId: text('anime_id').references(() => animes.id, { onDelete: 'cascade' }).notNull(),
  watchedAt: text('watched_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

/**
 * Table pour la liste "à regarder" de l'utilisateur
 */
export const watchLater = sqliteTable('watch_later', {
  id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
  animeId: text('anime_id').references(() => animes.id, { onDelete: 'cascade' }),
  episodeId: text('episode_id').references(() => episodes.id, { onDelete: 'cascade' }),
  addedAt: text('added_at').default(sql`CURRENT_TIMESTAMP`)
});

// Types TypeScript pour l'utilisation dans l'application
export type Anime = typeof animes.$inferSelect;
export type NewAnime = typeof animes.$inferInsert;

export type Episode = typeof episodes.$inferSelect;
export type NewEpisode = typeof episodes.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type UserCollection = typeof userCollection.$inferSelect;
export type NewUserCollection = typeof userCollection.$inferInsert;

export type WatchedEpisode = typeof watchedEpisodes.$inferSelect;
export type NewWatchedEpisode = typeof watchedEpisodes.$inferInsert;

export type WatchLater = typeof watchLater.$inferSelect;
export type NewWatchLater = typeof watchLater.$inferInsert;