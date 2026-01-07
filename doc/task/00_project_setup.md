# タスク: プロジェクト初期設定

## 概要

Next.js App Routerを使用したWebアプリケーションの初期プロジェクトセットアップを行う。

## 作業内容

### 1. Next.jsプロジェクト作成

- [ ] `npx create-next-app@latest` でプロジェクト作成
- [ ] TypeScript設定を有効化
- [ ] App Router使用を選択
- [ ] 不要なサンプルファイルを削除

### 2. プロジェクト構成設定

- [ ] 基本的なフォルダ構成作成
  - `app/` (App Router)
  - `components/`
  - `hooks/` (Custom Hooks)
  - `lib/` (ビジネスロジック、データアクセス)
  - `types/` (TypeScript型定義)
  - `__tests__/` (テストファイル)

## 注意点

- プロトタイプなので、最小限の構成で開始
- ライブラリは必要になったタイミングでインストール
- 将来の拡張性を考慮した設計だが、過度に複雑化しない

### 3. テスト環境初期設定

- [ ] Jest設定ファイル作成 (`jest.config.js`)
- [ ] Testing Library設定
- [ ] Playwright E2Eテスト設定
- [ ] テストファイル構成作成
  - `__tests__/lib/` (Unit Tests)
  - `__tests__/components/` (Component Tests)
  - `__tests__/integration/` (Integration Tests)
  - `__tests__/e2e/` (E2E Tests)

### 4. 開発環境設定

- [ ] ESLint設定 (TypeScript + React)
- [ ] Prettier設定
- [ ] package.json スクリプト設定
  - `test:unit` - 単体テスト実行
  - `test:integration` - 結合テスト実行
  - `test:e2e` - E2Eテスト実行
  - `test:watch` - ウォッチモード
  - `lint` - ESLint実行
  - `type-check` - TypeScript型チェック

## 技術ルール遵守チェック

- [ ] `/doc/rule/` の全ルールファイル確認
- [ ] TypeScript strict mode有効化
- [ ] アーキテクチャ層に基づくフォルダ構成
- [ ] テストピラミッド構成の初期設定

## 完了条件

- Next.jsアプリケーションが正常に起動する
- 基本的なフォルダ構成が整っている
- テスト環境が動作する（サンプルテスト実行可能）
- ESLint・Prettier・TypeScriptが正常動作する
- 技術ルール遵守の開発環境が整備されている
