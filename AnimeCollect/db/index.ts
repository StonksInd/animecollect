import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

/**
 * Nom de la base de données
 */
const DATABASE_NAME = 'anime_collect.db';

/**
 * Initialisation de la base de données SQLite
 */
const expoDb = openDatabaseSync(DATABASE_NAME);

/**
 * Instance Drizzle configurée avec le schéma
 */
export const db = drizzle(expoDb, { schema });

/**
 * Fonction pour initialiser la base de données avec les tables
 * Cette fonction crée toutes les tables si elles n'existent pas
 */
export async function initializeDatabase() {
  try {
    console.log('🗄️ Initialisation de la base de données...');
    
    // Créer la table animes
    await expoDb.execAsync(`
      CREATE TABLE IF NOT EXISTS animes (
        id TEXT PRIMARY KEY,
        kitsu_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        canonical_title TEXT,
        synopsis TEXT,
        average_rating REAL,
        episode_count INTEGER,
        status TEXT,
        start_date TEXT,
        end_date TEXT,
        poster_image_url TEXT,
        cover_image_url TEXT,
        subtype TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Créer la table episodes
    await expoDb.execAsync(`
      CREATE TABLE IF NOT EXISTS episodes (
        id TEXT PRIMARY KEY,
        kitsu_id TEXT UNIQUE NOT NULL,
        anime_id TEXT NOT NULL,
        number INTEGER NOT NULL,
        title TEXT,
        canonical_title TEXT,
        synopsis TEXT,
        airdate TEXT,
        length INTEGER,
        thumbnail_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (anime_id) REFERENCES animes (id) ON DELETE CASCADE
      );
    `);

    // Créer la table categories
    await expoDb.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        kitsu_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Créer la table anime_categories
    await expoDb.execAsync(`
      CREATE TABLE IF NOT EXISTS anime_categories (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        anime_id TEXT NOT NULL,
        category_id TEXT NOT NULL,
        FOREIGN KEY (anime_id) REFERENCES animes (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      );
    `);

    // Créer la table user_collection
    await expoDb.execAsync(`
      CREATE TABLE IF NOT EXISTS user_collection (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        anime_id TEXT NOT NULL,
        status TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        rating REAL,
        notes TEXT,
        started_at TEXT,
        completed_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (anime_id) REFERENCES animes (id) ON DELETE CASCADE
      );
    `);

    // Créer la table watched_episodes
    await expoDb.execAsync(`
      CREATE TABLE IF NOT EXISTS watched_episodes (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        episode_id TEXT NOT NULL,
        anime_id TEXT NOT NULL,
        watched_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (episode_id) REFERENCES episodes (id) ON DELETE CASCADE,
        FOREIGN KEY (anime_id) REFERENCES animes (id) ON DELETE CASCADE
      );
    `);

    // Créer la table watch_later
    await expoDb.execAsync(`
      CREATE TABLE IF NOT EXISTS watch_later (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        anime_id TEXT,
        episode_id TEXT,
        added_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (anime_id) REFERENCES animes (id) ON DELETE CASCADE,
        FOREIGN KEY (episode_id) REFERENCES episodes (id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Base de données initialisée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

/**
 * Fonction pour réinitialiser la base de données (utile pour le développement)
 */
export async function resetDatabase() {
  try {
    console.log('🔄 Réinitialisation de la base de données...');
    
    const tables = [
      'watch_later',
      'watched_episodes', 
      'user_collection',
      'anime_categories',
      'categories',
      'episodes',
      'animes'
    ];

    for (const table of tables) {
      await expoDb.execAsync(`DROP TABLE IF EXISTS ${table};`);
    }

    await initializeDatabase();
    console.log('✅ Base de données réinitialisée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    throw error;
  }
}

export { schema };