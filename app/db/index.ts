import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite/next';

const expoDb = openDatabaseSync('animecollect.db');
export const db = drizzle(expoDb);