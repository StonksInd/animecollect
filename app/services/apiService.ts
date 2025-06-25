import axios from 'axios';

const BASE_URL = 'https://kitsu.io/api/edge';

export const fetchCurrentlyAiringAnime = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/anime?filter[status]=current&sort=-startDate&page[limit]=20&include=categories`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching currently airing anime:', error);
    return [];
  }
};

export const fetchUpcomingAnime = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/anime?filter[status]=upcoming&sort=startDate&page[limit]=20&include=categories`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching upcoming anime:', error);
    return [];
  }
};

export const searchAnime = async (query: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=20`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};

export const fetchAnimeById = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime/${id}?include=categories,episodes`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching anime by id:', error);
    return null;
  }
};

export const fetchEpisodesByAnimeId = async (animeId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime/${animeId}/episodes?sort=number`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return [];
  }
};

export const fetchEpisodeById = async (episodeId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/episodes/${episodeId}?include=media`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching episode:', error);
    return null;
  }
};