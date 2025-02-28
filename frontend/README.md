# Frontend Application

## プロジェクト概要
このプロジェクトはReactベースのフロントエンドアプリケーションです。主な機能は以下の通りです：

- リアルタイムUI更新
- 多言語対応 (i18n)
- 状態管理 (Jotai)
- レスポンシブデザイン

## 技術スタック
- **ビルドツール**: Vite
- **UIフレームワーク**: React 19
- **状態管理**: Jotai
- **国際化**: i18next
- **CSSフレームワーク**: TailwindCSS + DaisyUI
- **型チェック**: TypeScript
- **リンター**: Biome

## 開発環境のセットアップ

1. 依存パッケージのインストール
```bash
npm install
```

2. 開発サーバーの起動
```bash
npm run dev
```

## ビルドとプレビュー

### プロダクションビルド
```bash
npm run build
```

### ビルド結果のプレビュー
```bash
npm run preview
```

## リンターとフォーマッター

### コードのチェックと自動修正
```bash
npm run check
```

### 手動でのリンター実行
```bash
npm run lint
