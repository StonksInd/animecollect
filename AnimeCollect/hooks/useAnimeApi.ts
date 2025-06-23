import { useState, useEffect, useCallback } from 'react';
import {
  fetchCurrentlyAiringAnime,
  fetchUpcomingAnime,
  searchAnime,
  fetchAnimeById,
  fetchEpisodeById,
  fetchEpisodesByAnimeId,
  fetchAnimeCategories,
  fetchAllCategories,
  searchAnimeByCategory,
  type KitsuAnime,
  type KitsuEpisode,
  type KitsuCategory
} from '../services/apiService';

/**
 * Hook pour gérer les données des animes actuellement en cours
 */
export function useCurrentlyAiringAnime() {
  const [animes, setAnimes] = useState<KitsuAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCurrentlyAiringAnime();
      setAnimes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des animes';
      setError(errorMessage);
      console.error('Erreur useCurrentlyAiringAnime:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    animes,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook pour gérer les données des animes à venir
 */
export function useUpcomingAnime() {
  const [animes, setAnimes] = useState<KitsuAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUpcomingAnime();
      setAnimes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des animes';
      setError(errorMessage);
      console.error('Erreur useUpcomingAnime:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    animes,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook pour la recherche d'animes
 */
export function useAnimeSearch() {
  const [animes, setAnimes] = useState<KitsuAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setAnimes([]);
      setQuery('');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setQuery(searchQuery);
      const data = await searchAnime(searchQuery);
      setAnimes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche';
      setError(errorMessage);
      console.error('Erreur useAnimeSearch:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setAnimes([]);
    setQuery('');
    setError(null);
  }, []);

  return {
    animes,
    loading,
    error,
    query,
    search,
    clear
  };
}

/**
 * Hook pour récupérer les détails d'un anime
 */
export function useAnimeDetails(animeId: string | null) {
  const [anime, setAnime] = useState<KitsuAnime | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!animeId) {
      setAnime(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchAnimeById(animeId);
      setAnime(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement de l\'anime';
      setError(errorMessage);
      console.error('Erreur useAnimeDetails:', err);
    } finally {
      setLoading(false);
    }
  }, [animeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    anime,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook pour récupérer les épisodes d'un anime
 */
export function useAnimeEpisodes(animeId: string | null) {
  const [episodes, setEpisodes] = useState<KitsuEpisode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!animeId) {
      setEpisodes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchEpisodesByAnimeId(animeId);
      setEpisodes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des épisodes';
      setError(errorMessage);
      console.error('Erreur useAnimeEpisodes:', err);
    } finally {
      setLoading(false);
    }
  }, [animeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    episodes,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook pour récupérer les détails d'un épisode
 */
export function useEpisodeDetails(episodeId: string | null) {
  const [episode, setEpisode] = useState<KitsuEpisode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!episodeId) {
      setEpisode(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchEpisodeById(episodeId);
      setEpisode(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement de l\'épisode';
      setError(errorMessage);
      console.error('Erreur useEpisodeDetails:', err);
    } finally {
      setLoading(false);
    }
  }, [episodeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    episode,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook pour récupérer les catégories d'un anime
 */
export function useAnimeCategories(animeId: string | null) {
  const [categories, setCategories] = useState<KitsuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!animeId) {
      setCategories([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchAnimeCategories(animeId);
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des catégories';
      setError(errorMessage);
      console.error('Erreur useAnimeCategories:', err);
    } finally {
      setLoading(false);
    }
  }, [animeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    categories,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook pour récupérer toutes les catégories disponibles
 */
export function useAllCategories() {
  const [categories, setCategories] = useState<KitsuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllCategories();
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des catégories';
      setError(errorMessage);
      console.error('Erreur useAllCategories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    categories,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook pour rechercher des animes par catégorie
 */
export function useAnimesByCategory() {
  const [animes, setAnimes] = useState<KitsuAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const searchByCategory = useCallback(async (categoryId: string) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCategory(categoryId);
      const data = await searchAnimeByCategory(categoryId);
      setAnimes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche par catégorie';
      setError(errorMessage);
      console.error('Erreur useAnimesByCategory:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setAnimes([]);
    setSelectedCategory(null);
    setError(null);
  }, []);

  return {
    animes,
    loading,
    error,
    selectedCategory,
    searchByCategory,
    clear
  };
}

/**
 * Hook combiné pour gérer les données de la page d'accueil
 */
export function useHomeData() {
  const currentlyAiring = useCurrentlyAiringAnime();
  const upcoming = useUpcomingAnime();

  const loading = currentlyAiring.loading || upcoming.loading;
  const error = currentlyAiring.error || upcoming.error;

  const refetch = useCallback(async () => {
    await Promise.all([
      currentlyAiring.refetch(),
      upcoming.refetch()
    ]);
  }, [currentlyAiring.refetch, upcoming.refetch]);

  return {
    currentlyAiring: currentlyAiring.animes,
    upcoming: upcoming.animes,
    loading,
    error,
    refetch
  };
}

/**
 * Hook pour gérer le cache et la synchronisation des données
 */
export function useDataSync() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  /**
   * Synchroniser les données avec l'API
   */
  const sync = useCallback(async () => {
    try {
      setSyncing(true);
      
      // Récupérer les données les plus récentes
      const [currentAnimes, upcomingAnimes] = await Promise.all([
        fetchCurrentlyAiringAnime(),
        fetchUpcomingAnime()
      ]);

      // Ici on pourrait sauvegarder en base de données locale
      // pour le mode hors ligne
      
      setLastSync(new Date());
      console.log('📱 Synchronisation terminée');
      
    } catch (err) {
      console.error('❌ Erreur lors de la synchronisation:', err);
      throw err;
    } finally {
      setSyncing(false);
    }
  }, []);

  /**
   * Synchronisation automatique au démarrage
   */
  useEffect(() => {
    sync();
  }, [sync]);

  return {
    syncing,
    lastSync,
    sync
  };
}