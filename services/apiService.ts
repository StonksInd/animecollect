/**
 * Service API pour interagir avec l'API Kitsu
 * Base URL: https://kitsu.io/api/edge
 */

const BASE_URL = 'https://kitsu.io/api/edge';

// Types TypeScript basés sur la documentation Kitsu
export interface KitsuAnime {
  id: string;
  type: string;
  attributes: {
    slug: string;
    synopsis: string;
    titles: {
      en?: string;
      en_jp?: string;
      ja_jp?: string;
      [key: string]: string | undefined;
    };
    canonicalTitle: string;
    abbreviatedTitles: string[];
    averageRating: string;
    ratingFrequencies: { [key: string]: string };
    userCount: number;
    favoritesCount: number;
    startDate: string;
    endDate: string;
    nextRelease: string | null;
    popularityRank: number;
    ratingRank: number;
    ageRating: string;
    ageRatingGuide: string;
    subtype: string;
    status: string;
    tba: string | null;
    posterImage: {
      tiny?: string;
      small?: string;
      medium?: string;
      large?: string;
      original?: string;
    } | null;
    coverImage: {
      tiny?: string;
      small?: string;
      medium?: string;
      large?: string;
      original?: string;
    } | null;
    episodeCount: number;
    episodeLength: number;
    totalLength: number;
    youtubeVideoId: string | null;
    showType: string;
    nsfw: boolean;
  };
  relationships: {
    genres: {
      links: {
        self: string;
        related: string;
      };
    };
    categories: {
      links: {
        self: string;
        related: string;
      };
    };
    episodes: {
      links: {
        self: string;
        related: string;
      };
    };
  };
}

export interface KitsuEpisode {
  id: string;
  type: string;
  attributes: {
    titles: {
      en?: string;
      en_jp?: string;
      ja_jp?: string;
      [key: string]: string | undefined;
    };
    canonicalTitle: string;
    synopsis: string;
    number: number;
    season: number;
    airdate: string;
    length: number;
    thumbnail: {
      original?: string;
      [key: string]: string | undefined;
    } | null;
  };
  relationships: {
    media: {
      links: {
        self: string;
        related: string;
      };
    };
  };
}

export interface KitsuCategory {
  id: string;
  type: string;
  attributes: {
    title: string;
    description: string;
    totalMediaCount: number;
    slug: string;
    nsfw: boolean;
    childCount: number;
  };
}

export interface KitsuResponse<T> {
  data: T[];
  meta: {
    count: number;
  };
  links: {
    first: string;
    next?: string;
    last: string;
  };
}

/**
 * Fonction utilitaire pour récupérer l'URL d'une image avec fallback
 */
export function getImageUrl(
  imageObj: { [key: string]: string | undefined } | null | undefined,
  size: 'tiny' | 'small' | 'medium' | 'large' | 'original' = 'medium'
): string {
  if (!imageObj) {
    return 'https://via.placeholder.com/300x400/333/fff?text=No+Image';
  }

  return imageObj[size] || 
         imageObj.medium || 
         imageObj.original || 
         imageObj.large || 
         imageObj.small || 
         'https://via.placeholder.com/300x400/333/fff?text=No+Image';
}

/**
 * Fonction utilitaire pour récupérer le meilleur titre disponible
 */
export function getBestTitle(
  titles: { [key: string]: string | undefined } | undefined,
  canonicalTitle?: string
): string {
  if (!titles && !canonicalTitle) {
    return 'Titre inconnu';
  }

  if (canonicalTitle) {
    return canonicalTitle;
  }

  // Priorité des langues pour le titre
  const titlePriority = ['en', 'en_jp', 'ja_jp'];
  
  for (const lang of titlePriority) {
    if (titles?.[lang]) {
      return titles[lang]!;
    }
  }

  // Si aucun titre prioritaire, prendre le premier disponible
  const firstTitle = titles ? Object.values(titles).find(title => title) : undefined;
  return firstTitle || 'Titre inconnu';
}

/**
 * Fonction utilitaire pour faire les requêtes à l'API
 */
async function fetchFromKitsu<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erreur lors de la requête vers ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Récupère les animes actuellement en cours de diffusion
 */
export async function fetchCurrentlyAiringAnime(): Promise<KitsuAnime[]> {
  try {
    const endpoint = '/anime?filter[status]=current&sort=-startDate&page[limit]=20&include=categories';
    const response = await fetchFromKitsu<KitsuResponse<KitsuAnime>>(endpoint);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des animes en cours:', error);
    return [];
  }
}

/**
 * Récupère les animes à venir
 */
export async function fetchUpcomingAnime(): Promise<KitsuAnime[]> {
  try {
    const endpoint = '/anime?filter[status]=upcoming&sort=startDate&page[limit]=20&include=categories';
    const response = await fetchFromKitsu<KitsuResponse<KitsuAnime>>(endpoint);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des animes à venir:', error);
    return [];
  }
}

/**
 * Recherche des animes par titre
 */
export async function searchAnime(query: string): Promise<KitsuAnime[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const endpoint = `/anime?filter[text]=${encodedQuery}&page[limit]=20`;
    const response = await fetchFromKitsu<KitsuResponse<KitsuAnime>>(endpoint);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'animes:', error);
    return [];
  }
}

/**
 * Récupère les détails d'un anime par son ID
 */
export async function fetchAnimeById(id: string): Promise<KitsuAnime | null> {
  try {
    const endpoint = `/anime/${id}`;
    const response = await fetchFromKitsu<{ data: KitsuAnime }>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'anime ${id}:`, error);
    return null;
  }
}

/**
 * Récupère les détails d'un épisode par son ID
 */
export async function fetchEpisodeById(id: string): Promise<KitsuEpisode | null> {
  try {
    const endpoint = `/episodes/${id}?include=media`;
    const response = await fetchFromKitsu<{ data: KitsuEpisode }>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'épisode ${id}:`, error);
    return null;
  }
}

/**
 * Récupère tous les épisodes d'un anime
 */
export async function fetchEpisodesByAnimeId(animeId: string): Promise<KitsuEpisode[]> {
  try {
    const endpoint = `/anime/${animeId}/episodes?sort=number&page[limit]=50`;
    const response = await fetchFromKitsu<KitsuResponse<KitsuEpisode>>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des épisodes pour l'anime ${animeId}:`, error);
    return [];
  }
}

/**
 * Récupère les catégories d'un anime
 */
export async function fetchAnimeCategories(animeId: string): Promise<KitsuCategory[]> {
  try {
    const endpoint = `/anime/${animeId}/categories`;
    const response = await fetchFromKitsu<KitsuResponse<KitsuCategory>>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des catégories pour l'anime ${animeId}:`, error);
    return [];
  }
}

/**
 * Récupère toutes les catégories disponibles
 */
export async function fetchAllCategories(): Promise<KitsuCategory[]> {
  try {
    const endpoint = '/categories?page[limit]=40&sort=title';
    const response = await fetchFromKitsu<KitsuResponse<KitsuCategory>>(endpoint);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les catégories:', error);
    return [];
  }
}

/**
 * Recherche des animes par catégorie
 */
export async function searchAnimeByCategory(categoryId: string): Promise<KitsuAnime[]> {
  try {
    const endpoint = `/categories/${categoryId}/anime?page[limit]=20`;
    const response = await fetchFromKitsu<KitsuResponse<KitsuAnime>>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la recherche d'animes par catégorie ${categoryId}:`, error);
    return [];
  }
}