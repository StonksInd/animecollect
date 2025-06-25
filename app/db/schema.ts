import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const anime = sqliteTable('anime', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    posterImage: text('poster_image'),
    episodeCount: integer('episode_count'),
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

export const episodes = sqliteTable('episodes', {
    id: text('id').primaryKey(),
    animeId: text('anime_id').references(() => anime.id),
    number: integer('number').notNull(),
    title: text('title'),
    watched: integer('watched', { mode: 'boolean' }).default(false),
});