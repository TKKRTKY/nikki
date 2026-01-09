import { renderHook, act, waitFor } from '@testing-library/react';
import { useLLMSettings } from '../../hooks/useLLMSettings';
import * as db from '../../lib/db';
import type { LLMSettings } from '../../types';

// Mock the db module
jest.mock('../../lib/db');

const mockDb = db as jest.Mocked<typeof db>;

describe('useLLMSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load settings on mount', async () => {
    const mockSettings: LLMSettings = {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: 'test-key',
    };

    mockDb.getLLMSettings.mockResolvedValue(mockSettings);

    const { result } = renderHook(() => useLLMSettings());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.settings).toEqual(mockSettings);
    expect(mockDb.getLLMSettings).toHaveBeenCalledTimes(1);
  });

  it('should handle no settings on mount', async () => {
    mockDb.getLLMSettings.mockResolvedValue(null);

    const { result } = renderHook(() => useLLMSettings());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.settings).toBeNull();
  });

  it('should save settings successfully', async () => {
    const newSettings: LLMSettings = {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: 'new-key',
    };

    mockDb.getLLMSettings.mockResolvedValue(null);
    mockDb.saveLLMSettings.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLLMSettings());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.saveSettings(newSettings);
    });

    expect(mockDb.saveLLMSettings).toHaveBeenCalledWith(newSettings);
    expect(result.current.settings).toEqual(newSettings);
  });

  it('should handle save error', async () => {
    const newSettings: LLMSettings = {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: 'new-key',
    };

    mockDb.getLLMSettings.mockResolvedValue(null);
    mockDb.saveLLMSettings.mockRejectedValue(new Error('Save failed'));

    const { result } = renderHook(() => useLLMSettings());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(async () => {
      await act(async () => {
        await result.current.saveSettings(newSettings);
      });
    }).rejects.toThrow('Save failed');

    expect(result.current.settings).toBeNull();
  });

  it('should clear settings successfully', async () => {
    const initialSettings: LLMSettings = {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: 'test-key',
    };

    mockDb.getLLMSettings.mockResolvedValue(initialSettings);
    mockDb.clearLLMSettings.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLLMSettings());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.settings).toEqual(initialSettings);

    await act(async () => {
      await result.current.clearSettings();
    });

    expect(mockDb.clearLLMSettings).toHaveBeenCalledTimes(1);
    expect(result.current.settings).toBeNull();
  });

  it('should handle clear error', async () => {
    const initialSettings: LLMSettings = {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: 'test-key',
    };

    mockDb.getLLMSettings.mockResolvedValue(initialSettings);
    mockDb.clearLLMSettings.mockRejectedValue(new Error('Clear failed'));

    const { result } = renderHook(() => useLLMSettings());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(async () => {
      await act(async () => {
        await result.current.clearSettings();
      });
    }).rejects.toThrow('Clear failed');

    expect(result.current.settings).toEqual(initialSettings);
  });
});
