// hooks/useAnimeApi.ts
import { useEffect, useState } from 'react';
import { fetchCurrentlyAiringAnime, searchAnime } from '../services/apiService';

export const useAnimeApi = () => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTrendingAnime = async () => {
      try {
        const data = await fetchCurrentlyAiringAnime();
        setTrendingAnime(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingAnime();
  }, []);

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

  return { trendingAnime, loading, error, search: handleSearch };
};