import { useEffect, useState } from 'react';
import { db } from '../db';
import { anime, episodes } from '../db/schema';
import { eq } from 'drizzle-orm';
import { fetchEpisodesByAnimeId } from '../services/apiService';

export const useDatabase = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCollection = async () => {
    try {
      setLoading(true);
      const result = await db.select().from(anime);
      const collectionWithEpisodes = await Promise.all(
        result.map(async (animeItem) => {
          const eps = await db.select()
            .from(episodes)
            .where(eq(episodes.animeId, animeItem.id));
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
      // Vérifier si l'anime existe déjà
      const existingResult = await db.select()
        .from(anime)
        .where(eq(anime.id, animeData.id))
        .limit(1);
      
      if (existingResult.length > 0) {
        console.log('Anime already in collection');
        return;
      }

      await db.insert(anime).values({
        id: animeData.id,
        title: animeData.attributes.canonicalTitle,
        posterImage: animeData.attributes.posterImage?.medium,
        episodeCount: animeData.attributes.episodeCount,
      });
      
      // Ajouter les épisodes depuis l'API
      const episodesData = await fetchEpisodesByAnimeId(animeData.id);
      for (const ep of episodesData) {
        await db.insert(episodes).values({
          id: ep.id,
          animeId: animeData.id,
          number: ep.attributes.number,
          title: ep.attributes.canonicalTitle,
          watched: false,
        });
      }
      
      await loadCollection();
    } catch (err) {
      setError(err.message);
      console.error('Error adding to collection:', err);
    }
  };

  const toggleWatched = async (animeId, episodeId) => {
    try {
      const episodeResult = await db.select()
        .from(episodes)
        .where(eq(episodes.id, episodeId))
        .limit(1);
      
      const episode = episodeResult[0];
      
      if (episode) {
        await db.update(episodes)
          .set({ watched: !episode.watched })
          .where(eq(episodes.id, episodeId));
        await loadCollection();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const markAsWatched = async (animeId, episodeId) => {
    return toggleWatched(animeId, episodeId);
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
    markAsWatched,
    isInCollection, 
    isWatched,
    refresh: loadCollection
  };
};