import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LLMSettingsForm } from '../../components/LLMSettingsForm';
import type { LLMSettings } from '../../types';

describe('LLMSettingsForm', () => {
  const mockOnSave = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form with empty fields when no settings provided', () => {
    render(
      <LLMSettingsForm
        settings={null}
        onSave={mockOnSave}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByLabelText(/base url/i)).toHaveValue('');
    expect(screen.getByLabelText(/model/i)).toHaveValue('');
    expect(screen.getByLabelText(/api key/i)).toHaveValue('');
  });

  it('should render form with existing settings', () => {
    const settings: LLMSettings = {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: 'test-key',
    };

    render(
      <LLMSettingsForm
        settings={settings}
        onSave={mockOnSave}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByLabelText(/base url/i)).toHaveValue(settings.baseUrl);
    expect(screen.getByLabelText(/model/i)).toHaveValue(settings.model);
    expect(screen.getByLabelText(/api key/i)).toHaveValue(settings.apiKey);
  });

  it('should call onSave with form data when save button clicked', async () => {
    render(
      <LLMSettingsForm
        settings={null}
        onSave={mockOnSave}
        onClear={mockOnClear}
      />
    );

    const baseUrlInput = screen.getByLabelText(/base url/i);
    const modelInput = screen.getByLabelText(/model/i);
    const apiKeyInput = screen.getByLabelText(/api key/i);
    const saveButton = screen.getByRole('button', { name: /save|保存/i });

    fireEvent.change(baseUrlInput, {
      target: { value: 'https://api.openai.com/v1' },
    });
    fireEvent.change(modelInput, { target: { value: 'gpt-4' } });
    fireEvent.change(apiKeyInput, { target: { value: 'test-key' } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4',
        apiKey: 'test-key',
      });
    });
  });

  it('should not call onSave when fields are empty', () => {
    render(
      <LLMSettingsForm
        settings={null}
        onSave={mockOnSave}
        onClear={mockOnClear}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save|保存/i });

    fireEvent.click(saveButton);

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should call onClear when clear button clicked', () => {
    const settings: LLMSettings = {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: 'test-key',
    };

    render(
      <LLMSettingsForm
        settings={settings}
        onSave={mockOnSave}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear|クリア/i });

    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('should update form fields when typing', () => {
    render(
      <LLMSettingsForm
        settings={null}
        onSave={mockOnSave}
        onClear={mockOnClear}
      />
    );

    const baseUrlInput = screen.getByLabelText(/base url/i) as HTMLInputElement;

    fireEvent.change(baseUrlInput, {
      target: { value: 'https://api.anthropic.com/v1' },
    });

    expect(baseUrlInput.value).toBe('https://api.anthropic.com/v1');
  });
});
