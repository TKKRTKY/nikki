'use client';

import { useLLMSettings } from '@/hooks/useLLMSettings';
import { LLMSettingsForm } from '@/components/LLMSettingsForm';

export default function Home(): React.ReactElement {
  const { settings, loading, saveSettings, clearSettings } = useLLMSettings();

  const handleSave = async (newSettings: {
    baseUrl: string;
    model: string;
    apiKey: string;
  }): Promise<void> => {
    try {
      await saveSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('設定の保存に失敗しました');
    }
  };

  const handleClear = async (): Promise<void> => {
    try {
      await clearSettings();
    } catch (error) {
      console.error('Failed to clear settings:', error);
      alert('設定のクリアに失敗しました');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">nikki</h1>
        <p className="text-center text-gray-600 mb-8">
          AI-Powered Diary App - プロトタイプ開発中
        </p>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">LLM設定</h2>
          {settings && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 text-sm">✓ 設定が保存されています</p>
            </div>
          )}
          <LLMSettingsForm
            settings={settings}
            onSave={handleSave}
            onClear={handleClear}
          />
        </div>
      </div>
    </main>
  );
}
