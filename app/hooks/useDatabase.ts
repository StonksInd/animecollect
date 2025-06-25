import { useEffect, useState } from 'react';
import { db } from '../db';
import { anime, episodes } from '../db/schema';
import { eq } from 'drizzle-orm';

export const useDatabase = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCollection = async () => {
    try {
      setLoading(true);
      const result = await db.select().from(anime).all();
      const collectionWithEpisodes = await Promise.all(
        result.map(async (animeItem) => {
          const eps = await db.select()
            .from(episodes)
            .where(eq(episodes.animeId, animeItem.id))
            .all();
          return {
            anime: animeItem,
            episodes: eps,
            watchedEpisodes: eps.filter(e => e.watched)
          };
        })
      );
      setCollection(collectionWithEpisodes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollection();
  }, []);

  const addToCollection = async (animeData) => {
    try {
      await db.insert(anime).values({
        id: animeData.id,
        title: animeData.attributes.canonicalTitle,
        posterImage: animeData.attributes.posterImage?.medium,
        episodeCount: animeData.attributes.episodeCount,
        // autres champs...
      }).run();
      
      // Ajouter les épisodes
      const episodesData = await fetchEpisodes(animeData.id); // Implémentez cette fonction
      for (const ep of episodesData) {
        await db.insert(episodes).values({
          id: ep.id,
          animeId: animeData.id,
          number: ep.attributes.number,
          title: ep.attributes.canonicalTitle,
          watched: false,
        }).run();
      }
      
      await loadCollection();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleWatched = async (animeId, episodeId) => {
    try {
      const episode = await db.select()
        .from(episodes)
        .where(eq(episodes.id, episodeId))
        .get();
      
      if (episode) {
        await db.update(episodes)
          .set({ watched: !episode.watched })
          .where(eq(episodes.id, episodeId))
          .run();
        await loadCollection();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const isInCollection = (animeId) => {
    return collection.some(item => item.anime.id === animeId);
  };

  const isWatched = (animeId, episodeId) => {
    const animeItem = collection.find(item => item.anime.id === animeId);
    if (!animeItem) return false;
    const episode = animeItem.episodes.find(ep => ep.id === episodeId);
    return episode?.watched || false;
  };

  return { 
    collection, 
    loading, 
    error, 
    addToCollection, 
    toggleWatched, 
    isInCollection, 
    isWatched,
    refresh: loadCollection
  };
};