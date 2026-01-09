import type { LLMSettings } from '@/types';

const DB_NAME = 'nikki-db';
const DB_VERSION = 1;
const SETTINGS_STORE = 'settings';

/**
 * Initialize IndexedDB database
 * Creates database with required object stores
 */
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create settings store if it doesn't exist
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        // Use fixed key 'config' instead of autoIncrement
        db.createObjectStore(SETTINGS_STORE);
      }
    };
  });
}

/**
 * Save LLM settings to IndexedDB
 * Overwrites existing settings if present
 */
export async function saveLLMSettings(settings: LLMSettings): Promise<void> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SETTINGS_STORE, 'readwrite');
    const store = transaction.objectStore(SETTINGS_STORE);

    // Use put with fixed key 'config' to overwrite
    const request = store.put(settings, 'config');

    request.onsuccess = () => {
      db.close();
      resolve();
    };

    request.onerror = () => {
      db.close();
      reject(new Error('Failed to save settings'));
    };
  });
}

/**
 * Get LLM settings from IndexedDB
 * Returns null if no settings exist
 */
export async function getLLMSettings(): Promise<LLMSettings | null> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SETTINGS_STORE, 'readonly');
    const store = transaction.objectStore(SETTINGS_STORE);
    const request = store.get('config');

    request.onsuccess = () => {
      const result = request.result;
      db.close();

      if (result) {
        resolve(result as LLMSettings);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => {
      db.close();
      reject(new Error('Failed to get settings'));
    };
  });
}

/**
 * Clear all LLM settings from IndexedDB
 */
export async function clearLLMSettings(): Promise<void> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SETTINGS_STORE, 'readwrite');
    const store = transaction.objectStore(SETTINGS_STORE);
    const request = store.delete('config');

    request.onsuccess = () => {
      db.close();
      resolve();
    };

    request.onerror = () => {
      db.close();
      reject(new Error('Failed to clear settings'));
    };
  });
}
