import {
  initDB,
  saveLLMSettings,
  getLLMSettings,
  clearLLMSettings,
} from '@/lib/db';
import type { LLMSettings } from '@/types';

// Clean up database before each test
beforeEach(async () => {
  // Delete the test database to ensure clean state
  const deleteRequest = indexedDB.deleteDatabase('nikki-db');
  await new Promise<void>((resolve) => {
    deleteRequest.onsuccess = () => resolve();
    deleteRequest.onerror = () => resolve(); // Resolve even on error
  });
});

describe('initDB', () => {
  it('should initialize database with correct version and stores', async () => {
    const db = await initDB();

    expect(db.name).toBe('nikki-db');
    expect(db.version).toBe(1);
    expect(db.objectStoreNames.contains('settings')).toBe(true);

    db.close();
  });

  it('should create settings store', async () => {
    const db = await initDB();

    const transaction = db.transaction('settings', 'readonly');
    const store = transaction.objectStore('settings');

    expect(store).toBeDefined();
    expect(store.name).toBe('settings');

    db.close();
  });
});

describe('saveLLMSettings', () => {
  it('should save LLM settings to IndexedDB', async () => {
    const settings: LLMSettings = {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: 'test-api-key',
    };

    await saveLLMSettings(settings);

    const savedSettings = await getLLMSettings();
    expect(savedSettings).toEqual(settings);
  });

  it('should update existing settings when saving', async () => {
    const initialSettings: LLMSettings = {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: 'initial-key',
    };

    await saveLLMSettings(initialSettings);

    const updatedSettings: LLMSettings = {
      baseUrl: 'https://api.anthropic.com/v1',
      model: 'claude-3',
      apiKey: 'updated-key',
    };

    await saveLLMSettings(updatedSettings);

    const savedSettings = await getLLMSettings();
    expect(savedSettings).toEqual(updatedSettings);
  });
});

describe('getLLMSettings', () => {
  it('should return null when no settings exist', async () => {
    const settings = await getLLMSettings();
    expect(settings).toBeNull();
  });

  it('should return saved settings', async () => {
    const settings: LLMSettings = {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: 'test-api-key',
    };

    await saveLLMSettings(settings);

    const savedSettings = await getLLMSettings();
    expect(savedSettings).toEqual(settings);
  });
});

describe('clearLLMSettings', () => {
  it('should clear all settings from database', async () => {
    const settings: LLMSettings = {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: 'test-api-key',
    };

    await saveLLMSettings(settings);
    await clearLLMSettings();

    const savedSettings = await getLLMSettings();
    expect(savedSettings).toBeNull();
  });

  it('should not throw error when clearing empty database', async () => {
    await expect(clearLLMSettings()).resolves.not.toThrow();
  });
});
