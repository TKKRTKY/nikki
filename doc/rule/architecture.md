# アーキテクチャルール

## 概要

nikkiプロジェクトの技術アーキテクチャ設計原則と制約を定義する。

## 基本設計原則

### 1. レイヤー分離

```
┌─────────────────────┐
│   Presentation      │ ← React Components
│     (components/)   │
├─────────────────────┤
│   Application       │ ← Custom Hooks, State Management
│     (hooks/)        │
├─────────────────────┤
│   Business Logic    │ ← Core Logic, Data Transformation
│     (lib/)          │
├─────────────────────┤
│   Data Access       │ ← IndexedDB, API Calls
│     (lib/db.ts)     │
├─────────────────────┤
│   External Services │ ← LLM API, Browser API
│                     │
└─────────────────────┘
```

### 2. 依存関係ルール

- **上位レイヤーから下位レイヤーへの依存のみ許可**
- **下位レイヤーは上位レイヤーを知ってはならない**
- **外部サービスへの依存は最下位レイヤーのみ**

## データフロー設計

### 1. 単方向データフロー

```
User Action → Component → Hook → Business Logic → Data Layer → IndexedDB/API
     ↑                                                               │
     └─────────── State Update ← Data Processing ←──────────────────┘
```

### 2. 状態管理方針

- **Local State**: `useState` でコンポーネント内状態
- **Shared State**: React Context（最小限）
- **Server State**: TanStack Query（将来）
- **Persistent State**: IndexedDB

## ディレクトリ構成ルール

### 必須構成

```
nikki/
├── app/                    # Next.js App Router（ルーティング専用）
├── components/             # UI コンポーネント
│   ├── {Feature}Interface.tsx  # 機能別インターフェース
│   ├── {Feature}Display.tsx    # 表示専用コンポーネント
│   └── ui/                     # 再利用可能コンポーネント
├── hooks/                  # Custom Hooks（状態管理・副作用）
│   ├── use{Feature}.ts     # 機能別 Hook
│   └── useLocalStorage.ts  # 汎用 Hook
├── lib/                    # ビジネスロジック・データアクセス
│   ├── {feature}.ts        # 機能別ロジック
│   ├── db.ts              # データベース操作
│   ├── api.ts             # API 呼び出し
│   └── utils.ts           # 汎用ユーティリティ
└── types/                  # 型定義
    └── index.ts
```

### 禁止パターン

- **components/ 内でのビジネスロジック記述**
- **lib/ 内でのReact依存**
- **直接的なAPIコール（components内）**

## コンポーネント設計ルール

### 1. コンポーネント責務分離

```typescript
// ✅ Good: Container/Presentation パターン
export default function ChatInterfaceContainer() {
  const { messages, sendMessage, loading } = useChat();

  return (
    <ChatInterfacePresentation
      messages={messages}
      onSendMessage={sendMessage}
      loading={loading}
    />
  );
}

function ChatInterfacePresentation({ messages, onSendMessage, loading }) {
  // UI のみに集中
}
```

### 2. Props設計ルール

```typescript
// ✅ Good: 明確なProps定義
interface ChatInterfaceProps {
  messages: ConversationLog[];
  onSendMessage: (message: string) => Promise<void>;
  loading?: boolean;
  className?: string;
}

// ❌ Bad: あいまいなProps
interface ChatInterfaceProps {
  data: any;
  handlers: any;
}
```

## Hook設計ルール

### 1. 単一責任の原則

```typescript
// ✅ Good: 単一機能に特化
export function useChat(date: string) {
  const [messages, setMessages] = useState<ConversationLog[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    // チャット機能のみの実装
  }, []);

  return { messages, sendMessage, loading };
}

// ❌ Bad: 複数責務を持つ
export function useApp() {
  // チャット、設定、日記など複数の責務
}
```

### 2. Hook組み合わせルール

```typescript
// ✅ Good: Hook の組み合わせ
export function useDiaryPage() {
  const settings = useLLMSettings();
  const chat = useChat(today);
  const diary = useDiary(today);

  return { settings, chat, diary };
}
```

## データアクセス層設計

### 1. Repository パターン

```typescript
// ✅ Good: 抽象化されたデータアクセス
export interface ConversationRepository {
  save(conversation: ConversationLog): Promise<void>;
  findByDate(date: string): Promise<ConversationLog[]>;
  deleteByDate(date: string): Promise<void>;
}

export class IndexedDBConversationRepository implements ConversationRepository {
  async save(conversation: ConversationLog): Promise<void> {
    // IndexedDB実装
  }
}
```

### 2. Database Schema 管理

```typescript
// ✅ Good: バージョン管理された schema
export const DB_VERSION = 1;
export const DB_NAME = 'nikki-db';

export const schemas = {
  v1: {
    conversations: '++id, date, role, createdAt',
    diaries: 'date, updatedAt',
    settings: '++id',
  },
};
```

## API設計ルール

### 1. エラーハンドリング

```typescript
// ✅ Good: 構造化されたエラー処理
export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function callLLM(
  prompt: string,
  settings: LLMSettings
): Promise<Result<string, APIError>> {
  try {
    // API実装
    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      error: new APIError('API call failed', 'LLM_ERROR'),
    };
  }
}
```

### 2. 型安全性

```typescript
// ✅ Good: 型安全なAPI定義
export interface LLMRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
}

export interface LLMResponse {
  choices: Array<{
    message: {
      role: 'assistant';
      content: string;
    };
  }>;
}
```

## パフォーマンス設計原則

### 1. レンダリング最適化

- **memo()**: 不要な再レンダリング防止
- **useMemo()**: 重い計算のキャッシュ
- **useCallback()**: 関数参照の安定化

### 2. データローディング最適化

- **Lazy Loading**: 必要時のみデータ取得
- **Progressive Loading**: 段階的なデータ表示
- **Optimistic Updates**: 楽観的更新

## セキュリティ設計原則

### 1. API Key管理

```typescript
// ✅ Good: 暗号化での保存（将来）
export class SecureStorage {
  async saveAPIKey(key: string): Promise<void> {
    const encrypted = await encrypt(key);
    await localStorage.setItem('api_key', encrypted);
  }
}

// ❌ Bad: 平文での保存
localStorage.setItem('api_key', apiKey);
```

### 2. XSS対策

- **HTML Sanitization**: ユーザー入力のサニタイズ
- **CSP**: Content Security Policy 設定
- **Escape**: 動的コンテンツのエスケープ

## 将来拡張のための設計

### 1. プラグイン アーキテクチャ準備

```typescript
// 将来のプラグインシステム用インターフェース
export interface DiaryPlugin {
  name: string;
  version: string;
  generateDiary(conversations: ConversationLog[]): Promise<DiaryEntry>;
}
```

### 2. マルチテナント準備

```typescript
// 将来のマルチユーザー対応
export interface UserContext {
  userId: string;
  preferences: UserPreferences;
}
```

## アーキテクチャ規約チェック

### 必須チェックリスト

- [ ] 依存関係が正しい方向（上位→下位）
- [ ] ビジネスロジックがlib/に分離
- [ ] コンポーネントがプレゼンテーション専用
- [ ] 外部依存が最下位レイヤーのみ
- [ ] 型定義が適切に分離
- [ ] エラーハンドリングが統一
