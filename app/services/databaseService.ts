import { db } from '../db';
import { anime, episodes } from '../db/schema';
import { eq } from 'drizzle-orm';

export const addAnimeToCollection = async (animeData) => {
  return db.insert(anime).values({
    id: animeData.id,
    title: animeData.attributes.canonicalTitle,
    posterImage: animeData.attributes.posterImage?.medium,
    episodeCount: animeData.attributes.episodeCount,
  }).run();
};

export const toggleWatchedEpisode = async (episodeId: string, watched: boolean) => {
  return db.update(episodes)
    .set({ watched })
    .where(eq(episodes.id, episodeId))
    .run();
};

export const getAnimeCollection = async () => {
  return db.select().from(anime).all();
};