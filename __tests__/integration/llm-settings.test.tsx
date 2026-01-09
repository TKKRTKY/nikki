import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../app/page';
import type { LLMSettings } from '../../types';

// Clean up database before each test
beforeEach(async () => {
  const deleteRequest = indexedDB.deleteDatabase('nikki-db');
  await new Promise<void>((resolve) => {
    deleteRequest.onsuccess = () => resolve();
    deleteRequest.onerror = () => resolve();
  });
});

describe('LLM Settings Integration', () => {
  it('should display empty form when no settings exist', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/読み込み中/i)).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText(/base url/i)).toHaveValue('');
    expect(screen.getByLabelText(/model/i)).toHaveValue('');
    expect(screen.getByLabelText(/api key/i)).toHaveValue('');
  });

  it('should save settings to IndexedDB and display them', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/読み込み中/i)).not.toBeInTheDocument();
    });

    const baseUrlInput = screen.getByLabelText(/base url/i);
    const modelInput = screen.getByLabelText(/model/i);
    const apiKeyInput = screen.getByLabelText(/api key/i);
    const saveButton = screen.getByRole('button', { name: /保存/i });

    fireEvent.change(baseUrlInput, {
      target: { value: 'https://api.openai.com/v1' },
    });
    fireEvent.change(modelInput, { target: { value: 'gpt-4' } });
    fireEvent.change(apiKeyInput, { target: { value: 'sk-test-key' } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/設定が保存されています/i)).toBeInTheDocument();
    });

    // Verify settings are saved
    expect(baseUrlInput).toHaveValue('https://api.openai.com/v1');
    expect(modelInput).toHaveValue('gpt-4');
    expect(apiKeyInput).toHaveValue('sk-test-key');
  });

  it('should persist settings across page remounts', async () => {
    // First render - save settings
    const { unmount } = render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/読み込み中/i)).not.toBeInTheDocument();
    });

    const baseUrlInput = screen.getByLabelText(/base url/i);
    const modelInput = screen.getByLabelText(/model/i);
    const apiKeyInput = screen.getByLabelText(/api key/i);
    const saveButton = screen.getByRole('button', { name: /保存/i });

    fireEvent.change(baseUrlInput, {
      target: { value: 'https://api.anthropic.com/v1' },
    });
    fireEvent.change(modelInput, { target: { value: 'claude-3' } });
    fireEvent.change(apiKeyInput, { target: { value: 'sk-ant-key' } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/設定が保存されています/i)).toBeInTheDocument();
    });

    unmount();

    // Second render - verify settings are loaded
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/読み込み中/i)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/base url/i)).toHaveValue(
        'https://api.anthropic.com/v1'
      );
    });

    expect(screen.getByLabelText(/model/i)).toHaveValue('claude-3');
    expect(screen.getByLabelText(/api key/i)).toHaveValue('sk-ant-key');
    expect(screen.getByText(/設定が保存されています/i)).toBeInTheDocument();
  });

  it('should clear settings when clear button is clicked', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/読み込み中/i)).not.toBeInTheDocument();
    });

    // Save settings first
    const baseUrlInput = screen.getByLabelText(/base url/i);
    const modelInput = screen.getByLabelText(/model/i);
    const apiKeyInput = screen.getByLabelText(/api key/i);
    const saveButton = screen.getByRole('button', { name: /保存/i });

    fireEvent.change(baseUrlInput, {
      target: { value: 'https://api.openai.com/v1' },
    });
    fireEvent.change(modelInput, { target: { value: 'gpt-4' } });
    fireEvent.change(apiKeyInput, { target: { value: 'sk-test-key' } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/設定が保存されています/i)).toBeInTheDocument();
    });

    // Clear settings
    const clearButton = screen.getByRole('button', { name: /クリア/i });

    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/設定が保存されています/i)
      ).not.toBeInTheDocument();
    });

    // Verify form is empty
    await waitFor(() => {
      expect(baseUrlInput).toHaveValue('');
    });
    expect(modelInput).toHaveValue('');
    expect(apiKeyInput).toHaveValue('');
  });
});
