# テスト戦略・ルール

## 概要

nikkiプロジェクトにおける自動テストの戦略、レイヤー、粒度を定義する。

## テストピラミッド

### 1. Unit Tests（単体テスト）- 70%

**目的**: 個別の関数・モジュールの動作保証
**対象**:

- `lib/` 配下の全ユーティリティ関数
- データ変換・バリデーション関数
- ビジネスロジック関数

**粒度**:

- 1関数につき1テストファイル
- 正常系・異常系・境界値テスト
- モック・スタブを活用した外部依存の排除

**例**:

```typescript
// lib/diary.ts
export function generateDiaryPrompt(conversations: ConversationLog[]): string;

// __tests__/lib/diary.test.ts
describe('generateDiaryPrompt', () => {
  it('should generate structured prompt from conversations');
  it('should handle empty conversations');
  it('should filter invalid conversation entries');
});
```

### 2. Integration Tests（結合テスト）- 20%

**目的**: モジュール間の連携・データフローの保証
**対象**:

- IndexedDB操作とビジネスロジックの結合
- LLM API呼び出しとデータ保存の結合
- React Hooks とローカルストレージの結合

**粒度**:

- 機能単位での結合テスト
- 実際のIndexedDB（テスト用DB）を使用
- LLM APIはモック使用

**例**:

```typescript
// __tests__/integration/chat.test.ts
describe('Chat Integration', () => {
  it('should save conversation to IndexedDB after LLM response');
  it('should restore conversation from IndexedDB');
});
```

### 3. E2E Tests（エンドツーエンドテスト）- 10%

**目的**: ユーザーシナリオ全体の動作保証
**対象**:

- プロトタイプ完了条件の自動検証
- 画面遷移・UI操作の動作確認

**粒度**:

- 主要ユーザーフローのみ
- LLM APIはモック使用（テスト安定性のため）

**例**:

```typescript
// __tests__/e2e/user-flow.test.ts
describe('Complete User Flow', () => {
  it('should complete diary creation from chat to save');
});
```

## テストファイル構成

```
__tests__/
├── lib/                 # Unit tests
│   ├── db.test.ts
│   ├── llm.test.ts
│   └── diary.test.ts
├── components/          # Component tests
│   ├── ChatInterface.test.tsx
│   └── LLMSettings.test.tsx
├── integration/         # Integration tests
│   ├── chat.test.ts
│   └── diary-generation.test.ts
└── e2e/                # E2E tests
    └── user-flow.test.ts
```

## テストツール

### 基本構成

- **Test Runner**: Jest
- **React Testing**: @testing-library/react
- **E2E**: Playwright（軽量、クロスブラウザ対応）
- **Mock**: MSW（API モック）

### IndexedDB テスト

- **fake-indexeddb**: ブラウザ環境外でのIndexedDB動作再現
- テスト用データベース名で分離

## 必須テストルール

### 1. 新機能開発時

- [ ] 実装前にテストケースを定義（TDD推奨）
- [ ] Unit Test カバレッジ 80% 以上
- [ ] 該当する Integration Test を追加
- [ ] E2E Test は主要フローのみ

### 2. バグ修正時

- [ ] バグ再現テストを先に作成
- [ ] 修正後にテストが通ることを確認

### 3. リファクタリング時

- [ ] 既存テストが全て通ることを確認
- [ ] 機能変更がある場合はテスト更新

## テスト実行ルール

### 開発時

```bash
npm run test:watch    # Unit + Integration tests
npm run test:e2e:dev  # E2E tests (開発環境)
```

### CI/CD時

```bash
npm run test:unit     # Unit tests
npm run test:integration # Integration tests
npm run test:e2e      # E2E tests（プロダクション環境）
```

### 必須チェック

- Pull Request 作成時: 全テスト実行
- main ブランチ マージ前: カバレッジチェック
- デプロイ前: E2E テスト実行

## テスト除外対象

### プロトタイプ段階では以下を除外

- UIの細かなスタイリングテスト
- パフォーマンステスト
- セキュリティテスト
- アクセシビリティテスト

### 将来追加予定

- Visual Regression Test（Chromatic等）
- Load Test（サーバー機能追加時）
- Security Test（認証機能追加時）

## モック戦略

### LLM API

- 開発・テスト環境: 常にモック使用
- レスポンス時間・エラーパターンをシミュレート

### IndexedDB

- Unit Test: fake-indexeddb使用
- Integration Test: 実際のIndexedDB（テスト用DB）
- E2E Test: 実際のIndexedDB
