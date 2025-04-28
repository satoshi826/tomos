# Backend API

## プロジェクト概要
このプロジェクトはCloudflare Workers上で動作するAPIサーバーです。主な機能は以下の通りです：

- ユーザー管理
- エリア管理
- トピック管理
- メッセージ管理
- タグ管理

## 技術スタック

- **ランタイム**: Cloudflare Workers
- **Webフレームワーク**: Hono
- **ORM**: Prisma
- **データベース**: SQLite (Cloudflare D1)
- **テストフレームワーク**: Vitest
- **バリデーション**: Zod

## 開発環境のセットアップ

1. 依存パッケージのインストール

```bash
npm install
```

1. Prismaクライアントの生成

```bash
npm run generate
```

1. ローカル開発サーバーの起動

```bash
npm run dev
```

## データベースマイグレーション

### 新しいマイグレーションファイルの作成

```bash
npm run migrate generate <migration_name>
```

### ローカル環境へのマイグレーション適用

```bash
npm run migrate apply:local
```

### リモート環境へのマイグレーション適用

```bash
npm run migrate apply:remote
```

## テストの実行

```bash
npm test
```

## デプロイ

Cloudflare Workersへのデプロイ

```bash
npm run deploy
```
