# コーディング規約

## 概要
nikkiプロジェクトにおけるコード品質・可読性・保守性を保つための規約。

## TypeScript規約

### 基本ルール
- **Strict Mode**: 必須（`strict: true`）
- **No Any**: `any` 型の使用禁止（`unknown` 使用）
- **Explicit Return Types**: パブリック関数には戻り値型を明示
- **Optional Chaining**: null/undefined チェックに `?.` を使用

### 型定義
```typescript
// ✅ Good
interface ConversationLog {
  id: string;
  date: string; // YYYY-MM-DD
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

// ❌ Bad
interface ConversationLog {
  id: any;
  date: string;
  role: string; // Union type を使うべき
  content: string;
  createdAt: any;
}
```

### 関数定義
```typescript
// ✅ Good
export async function generateDiary(
  conversations: ConversationLog[]
): Promise<DiaryEntry> {
  // implementation
}

// ❌ Bad
export async function generateDiary(conversations) {
  // 型が不明
}
```

## React規約

### コンポーネント設計
- **関数コンポーネント**: 必須（クラスコンポーネント禁止）
- **Props Interface**: 全コンポーネントでProps型を定義
- **Default Export**: コンポーネントファイルは default export
- **Named Export**: ユーティリティは named export

### ファイル命名
```
components/
├── ChatInterface.tsx        # PascalCase
├── LLMSettings.tsx         # PascalCase
└── ui/
    ├── Button.tsx          # 再利用可能コンポーネント
    └── Card.tsx

lib/
├── db.ts                   # camelCase
├── llm.ts                  # camelCase
└── diary.ts

types/
└── index.ts                # 型定義は集約
```

### Hooks使用ルール
```typescript
// ✅ Good
const [settings, setSettings] = useState<LLMSettings | null>(null);
const { data, error, loading } = useLLMChat();

// ❌ Bad  
const [settings, setSettings] = useState(); // 型指定なし
```

## ディレクトリ構成

```
nikki/
├── app/                    # Next.js App Router
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/             # Reactコンポーネント
│   ├── ChatInterface.tsx
│   ├── DiaryDisplay.tsx
│   ├── LLMSettings.tsx
│   └── ui/                 # 再利用可能UI
├── lib/                    # ビジネスロジック・ユーティリティ
│   ├── db.ts              # IndexedDB操作
│   ├── llm.ts             # LLM API呼び出し
│   ├── diary.ts           # 日記生成ロジック
│   └── utils.ts           # 汎用ユーティリティ
├── types/                  # 型定義
│   └── index.ts
├── __tests__/             # テストファイル
└── doc/                   # ドキュメント
```

## 命名規約

### 変数・関数
```typescript
// ✅ Good
const conversationLogs = [];
const generateDiaryPrompt = () => {};
const isLLMConfigured = true;

// ❌ Bad
const logs = [];           // 不明確
const generate = () => {};  // 何を生成するのか不明
const flag = true;         // 意味が不明
```

### 定数
```typescript
// ✅ Good
const DB_NAME = 'nikki-db';
const MAX_RETRY_COUNT = 3;
const DEFAULT_MODEL = 'gpt-3.5-turbo';

// ❌ Bad
const dbname = 'nikki-db';
const max = 3;
```

### 型・インターフェース
```typescript
// ✅ Good
interface LLMSettings {}
type ConversationRole = 'user' | 'assistant';
enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// ❌ Bad
interface llmSettings {}   // PascalCaseを使用
type role = string;        // Union typeを使用すべき
```

## エラーハンドリング

### 基本方針
- **Error Boundary**: React エラーには Error Boundary 使用
- **Try-Catch**: 非同期処理には必須
- **カスタムエラー**: ドメイン固有エラーにはカスタムクラス

```typescript
// ✅ Good
class LLMAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public apiResponse?: unknown
  ) {
    super(message);
    this.name = 'LLMAPIError';
  }
}

export async function callLLM(prompt: string): Promise<string> {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new LLMAPIError(
        'LLM API call failed',
        response.status,
        await response.text()
      );
    }
    
    return await response.text();
  } catch (error) {
    if (error instanceof LLMAPIError) {
      throw error;
    }
    throw new LLMAPIError('Unexpected error in LLM API call', undefined, error);
  }
}
```

## パフォーマンス規約

### React最適化
```typescript
// ✅ Good
const ChatMessage = memo(({ message }: { message: ConversationLog }) => {
  // コンポーネント実装
});

const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// ❌ Bad
const ChatMessage = ({ message }) => {
  const expensiveValue = calculateExpensiveValue(data); // 毎レンダリング実行
  // コンポーネント実装
};
```

### DB操作最適化
```typescript
// ✅ Good
const conversations = await db.conversations
  .where('date')
  .equals(today)
  .limit(100)
  .toArray();

// ❌ Bad  
const allConversations = await db.conversations.toArray();
const todayConversations = allConversations.filter(c => c.date === today);
```

## Lint・Format設定

### ESLint Rules
```json
{
  "extends": [
    "@next/next/core-web-vitals",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier設定
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## コミット規約

### コミットメッセージ
```
feat: add LLM chat interface
fix: resolve IndexedDB connection issue
test: add unit tests for diary generation
docs: update API documentation
refactor: simplify chat message handling
style: fix ESLint warnings
```

### ブランチ命名
```
feature/llm-settings
fix/indexeddb-connection
test/chat-interface
docs/api-specification
```