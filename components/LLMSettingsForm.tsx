'use client';

import React, { useState, useEffect } from 'react';
import type { LLMSettings } from '@/types';

interface LLMSettingsFormProps {
  settings: LLMSettings | null;
  onSave: (settings: LLMSettings) => void;
  onClear: () => void;
}

/**
 * LLM Settings Form Component
 * Presentational component for managing LLM API configuration
 */
export function LLMSettingsForm({
  settings,
  onSave,
  onClear,
}: LLMSettingsFormProps): React.ReactElement {
  const [baseUrl, setBaseUrl] = useState('');
  const [model, setModel] = useState('');
  const [apiKey, setApiKey] = useState('');

  // Update form fields when settings change
  useEffect(() => {
    if (settings) {
      setBaseUrl(settings.baseUrl);
      setModel(settings.model);
      setApiKey(settings.apiKey);
    } else {
      setBaseUrl('');
      setModel('');
      setApiKey('');
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    // Validate all fields are filled
    if (!baseUrl.trim() || !model.trim() || !apiKey.trim()) {
      return;
    }

    onSave({
      baseUrl: baseUrl.trim(),
      model: model.trim(),
      apiKey: apiKey.trim(),
    });
  };

  const handleClear = (): void => {
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="baseUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Base URL
        </label>
        <input
          id="baseUrl"
          type="url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://api.openai.com/v1"
        />
      </div>

      <div>
        <label
          htmlFor="model"
          className="block text-sm font-medium text-gray-700"
        >
          Model
        </label>
        <input
          id="model"
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="gpt-4"
        />
      </div>

      <div>
        <label
          htmlFor="apiKey"
          className="block text-sm font-medium text-gray-700"
        >
          API Key
        </label>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="sk-..."
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          保存
        </button>
        {settings && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            クリア
          </button>
        )}
      </div>
    </form>
  );
}
