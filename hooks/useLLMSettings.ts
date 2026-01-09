import { useState, useEffect, useCallback } from 'react';
import {
  getLLMSettings,
  saveLLMSettings as saveLLMSettingsDB,
  clearLLMSettings as clearLLMSettingsDB,
} from '@/lib/db';
import type { LLMSettings } from '@/types';

interface UseLLMSettingsReturn {
  settings: LLMSettings | null;
  loading: boolean;
  saveSettings: (settings: LLMSettings) => Promise<void>;
  clearSettings: () => Promise<void>;
}

/**
 * Custom hook for managing LLM settings
 * Handles loading, saving, and clearing of LLM configuration
 */
export function useLLMSettings(): UseLLMSettingsReturn {
  const [settings, setSettings] = useState<LLMSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings(): Promise<void> {
      try {
        const savedSettings = await getLLMSettings();
        setSettings(savedSettings);
      } catch (error) {
        console.error('Failed to load LLM settings:', error);
        setSettings(null);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Save settings to IndexedDB
  const saveSettings = useCallback(
    async (newSettings: LLMSettings): Promise<void> => {
      await saveLLMSettingsDB(newSettings);
      setSettings(newSettings);
    },
    []
  );

  // Clear settings from IndexedDB
  const clearSettings = useCallback(async (): Promise<void> => {
    await clearLLMSettingsDB();
    setSettings(null);
  }, []);

  return {
    settings,
    loading,
    saveSettings,
    clearSettings,
  };
}
