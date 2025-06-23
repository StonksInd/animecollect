import { useCallback, useEffect, useState } from 'react';
import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from '../db';
import { 
  animes, 
  episodes, 
  categories, 
  userCollection, 
  watchedEpisodes, 
  watchLater,
  animeCategories,
  type Anime,
  type Episode,
  type UserCollection,
  type WatchedEpisode,
  type WatchLater,
  type NewAnime,
  type NewEpisode,
  type NewUserCollection,
  type NewWatchedEpisode,
  type NewWatchLater
} from '../db/schema';

/**
 * Hook pour gérer les animes dans la base de données
 */
export function useAnimes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ajouter ou mettre à jour un anime
   */
  const upsertAnime = useCallback(async (animeData: NewAnime): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await db.insert(animes)
        .values(animeData)
        .onConflictDoUpdate({
          target: animes.kitsuId,
          set: {
            ...animeData,
            updatedAt: new Date().toISOString()
          }
        });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de l\'ajout/mise à jour de l\'anime:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupérer un anime par son ID Kitsu
   */
  const getAnimeByKitsuId = useCallback(async (kitsuId: string): Promise<Anime | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await db.select()
        .from(animes)
        .where(eq(animes.kitsuId, kitsuId))
        .limit(1);

      return result[0] || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la récupération de l\'anime:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupérer tous les animes stockés localement
   */
  const getAllAnimes = useCallback(async (): Promise<Anime[]> => {
    try {
      setLoading(true);
      setError(null);

      const result = await db.select()
        .from(animes)
        .orderBy(desc(animes.createdAt));

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la récupération des animes:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    upsertAnime,
    getAnimeByKitsuId,
    getAllAnimes
  };
}

/**
 * Hook pour gérer les épisodes dans la base de données
 */
export function useEpisodes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ajouter ou mettre à jour un épisode
   */
  const upsertEpisode = useCallback(async (episodeData: NewEpisode): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await db.insert(episodes)
        .values(episodeData)
        .onConflictDoUpdate({
          target: episodes.kitsuId,
          set: {
            ...episodeData,
            updatedAt: new Date().toISOString()
          }
        });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de l\'ajout/mise à jour de l\'épisode:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupérer les épisodes d'un anime
   */
  const getEpisodesByAnimeId = useCallback(async (animeId: string): Promise<Episode[]> => {
    try {
      setLoading(true);
      setError(null);

      const result = await db.select()
        .from(episodes)
        .where(eq(episodes.animeId, animeId))
        .orderBy(asc(episodes.number));

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la récupération des épisodes:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupérer un épisode par son ID Kitsu
   */
  const getEpisodeByKitsuId = useCallback(async (kitsuId: string): Promise<Episode | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await db.select()
        .from(episodes)
        .where(eq(episodes.kitsuId, kitsuId))
        .limit(1);

      return result[0] || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la récupération de l\'épisode:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    upsertEpisode,
    getEpisodesByAnimeId,
    getEpisodeByKitsuId
  };
}

/**
 * Hook pour gérer la collection personnelle de l'utilisateur
 */
export function useUserCollection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ajouter un anime à la collection
   */
  const addToCollection = useCallback(async (
    animeId: string, 
    status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'on_hold' = 'plan_to_watch'
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const collectionData: NewUserCollection = {
        animeId,
        status,
        progress: 0,
        startedAt: status === 'watching' ? new Date().toISOString() : null
      };

      await db.insert(userCollection)
        .values(collectionData)
        .onConflictDoUpdate({
          target: userCollection.animeId,
          set: {
            status,
            updatedAt: new Date().toISOString()
          }
        });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de l\'ajout à la collection:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Mettre à jour le statut d'un anime dans la collection
   */
  const updateCollectionStatus = useCallback(async (
    animeId: string, 
    status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'on_hold',
    progress?: number
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const updateData: Partial<UserCollection> = {
        status,
        updatedAt: new Date().toISOString()
      };

      if (progress !== undefined) {
        updateData.progress = progress;
      }

      if (status === 'completed') {
        updateData.completedAt = new Date().toISOString();
      }

      if (status === 'watching' && !updateData.startedAt) {
        updateData.startedAt = new Date().toISOString();
      }

      await db.update(userCollection)
        .set(updateData)
        .where(eq(userCollection.animeId, animeId));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la mise à jour du statut:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupérer la collection de l'utilisateur
   */
  const getUserCollection = useCallback(async (): Promise<(UserCollection & { anime: Anime })[]> => {
    try {
      setLoading(true);
      setError(null);

      const result = await db.select({
        id: userCollection.id,
        animeId: userCollection.animeId,
        status: userCollection.status,
        progress: userCollection.progress,
        rating: userCollection.rating,
        notes: userCollection.notes,
        startedAt: userCollection.startedAt,
        completedAt: userCollection.completedAt,
        createdAt: userCollection.createdAt,
        updatedAt: userCollection.updatedAt,
        anime: animes
      })
      .from(userCollection)
      .innerJoin(animes, eq(userCollection.animeId, animes.id))
      .orderBy(desc(userCollection.updatedAt));

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la récupération de la collection:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Supprimer un anime de la collection
   */
  const removeFromCollection = useCallback(async (animeId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await db.delete(userCollection)
        .where(eq(userCollection.animeId, animeId));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la suppression de la collection:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Vérifier si un anime est dans la collection
   */
  const isInCollection = useCallback(async (animeId: string): Promise<UserCollection | null> => {
    try {
      const result = await db.select()
        .from(userCollection)
        .where(eq(userCollection.animeId, animeId))
        .limit(1);

      return result[0] || null;
    } catch (err) {
      console.error('Erreur lors de la vérification de la collection:', err);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    addToCollection,
    updateCollectionStatus,
    getUserCollection,
    removeFromCollection,
    isInCollection
  };
}

/**
 * Hook pour gérer les épisodes vus
 */
export function useWatchedEpisodes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Marquer un épisode comme vu
   */
  const markEpisodeAsWatched = useCallback(async (
    episodeId: string, 
    animeId: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const watchedData: NewWatchedEpisode = {
        episodeId,
        animeId,
        watchedAt: new Date().toISOString()
      };

      await db.insert(watchedEpisodes)
        .values(watchedData)
        .onConflictDoNothing();

      // Mettre à jour le progrès dans la collection
      const totalWatched = await db.select()
        .from(watchedEpisodes)
        .where(eq(watchedEpisodes.animeId, animeId));

      await db.update(userCollection)
        .set({ 
          progress: totalWatched.length,
          updatedAt: new Date().toISOString()
        })
        .where(eq(userCollection.animeId, animeId));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors du marquage de l\'épisode:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Démarquer un épisode comme vu
   */
  const unmarkEpisodeAsWatched = useCallback(async (
    episodeId: string, 
    animeId: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await db.delete(watchedEpisodes)
        .where(and(
          eq(watchedEpisodes.episodeId, episodeId),
          eq(watchedEpisodes.animeId, animeId)
        ));

      // Mettre à jour le progrès dans la collection
      const totalWatched = await db.select()
        .from(watchedEpisodes)
        .where(eq(watchedEpisodes.animeId, animeId));

      await db.update(userCollection)
        .set({ 
          progress: totalWatched.length,
          updatedAt: new Date().toISOString()
        })
        .where(eq(userCollection.animeId, animeId));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors du démarquage de l\'épisode:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupérer les épisodes vus pour un anime
   */
  const getWatchedEpisodes = useCallback(async (animeId: string): Promise<WatchedEpisode[]> => {
    try {
      setLoading(true);
      setError(null);

      const result = await db.select()
        .from(watchedEpisodes)
        .where(eq(watchedEpisodes.animeId, animeId))
        .orderBy(desc(watchedEpisodes.watchedAt));

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la récupération des épisodes vus:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Vérifier si un épisode est marqué comme vu
   */
  const isEpisodeWatched = useCallback(async (
    episodeId: string, 
    animeId: string
  ): Promise<boolean> => {
    try {
      const result = await db.select()
        .from(watchedEpisodes)
        .where(and(
          eq(watchedEpisodes.episodeId, episodeId),
          eq(watchedEpisodes.animeId, animeId)
        ))
        .limit(1);

      return result.length > 0;
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'épisode:', err);
      return false;
    }
  }, []);

  return {
    loading,
    error,
    markEpisodeAsWatched,
    unmarkEpisodeAsWatched,
    getWatchedEpisodes,
    isEpisodeWatched
  };
}

/**
 * Hook pour gérer la liste "à regarder"
 */
export function useWatchLater() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ajouter à la liste "à regarder"
   */
  const addToWatchLater = useCallback(async (
    animeId?: string, 
    episodeId?: string
  ): Promise<void> => {
    if (!animeId && !episodeId) {
      setError('Au moins un ID anime ou épisode doit être fourni');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const watchLaterData: NewWatchLater = {
        animeId: animeId || null,
        episodeId: episodeId || null,
        addedAt: new Date().toISOString()
      };

      await db.insert(watchLater)
        .values(watchLaterData)
        .onConflictDoNothing();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de l\'ajout à la liste:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Supprimer de la liste "à regarder"
   */
  const removeFromWatchLater = useCallback(async (
    animeId?: string, 
    episodeId?: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (animeId && episodeId) {
        await db.delete(watchLater)
          .where(and(
            eq(watchLater.animeId, animeId),
            eq(watchLater.episodeId, episodeId)
          ));
      } else if (animeId) {
        await db.delete(watchLater)
          .where(eq(watchLater.animeId, animeId));
      } else if (episodeId) {
        await db.delete(watchLater)
          .where(eq(watchLater.episodeId, episodeId));
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la suppression de la liste:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupérer la liste "à regarder"
   */
  const getWatchLaterList = useCallback(async (): Promise<(WatchLater & { 
    anime?: Anime, 
    episode?: Episode 
  })[]> => {
    try {
      setLoading(true);
      setError(null);

      const result = await db.select({
        id: watchLater.id,
        animeId: watchLater.animeId,
        episodeId: watchLater.episodeId,
        addedAt: watchLater.addedAt,
        anime: animes,
        episode: episodes
      })
      .from(watchLater)
      .leftJoin(animes, eq(watchLater.animeId, animes.id))
      .leftJoin(episodes, eq(watchLater.episodeId, episodes.id))
      .orderBy(desc(watchLater.addedAt));

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la récupération de la liste:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    addToWatchLater,
    removeFromWatchLater,
    getWatchLaterList
  };
}