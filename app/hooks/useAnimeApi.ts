import { useEffect, useState } from 'react';
import { fetchCurrentlyAiringAnime, searchAnime, fetchAnimeById } from '../services/apiService';

export const useAnimeApi = (animeId?: string) => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (animeId) {
      loadAnimeById(animeId);
    } else {
      loadTrendingAnime();
    }
  }, [animeId]);

  const loadTrendingAnime = async () => {
    try {
      setLoading(true);
      const data = await fetchCurrentlyAiringAnime();
      setTrendingAnime(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAnimeById = async (id: string) => {
    try {
      setLoading(true);
      const data = await fetchAnimeById(id);
      setAnime(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const results = await searchAnime(query);
      return results;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    if (animeId) {
      loadAnimeById(animeId);
    } else {
      loadTrendingAnime();
    }
  };

  return { 
    trendingAnime, 
    anime, 
    loading, 
    error, 
    search: handleSearch,
    refresh 
  };
};