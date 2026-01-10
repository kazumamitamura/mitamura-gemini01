# Weightlifting Performance Analysis System

ウェイトリフティングパフォーマンス分析システム - Gemini AIを使用した選手データ分析アプリケーション

## セットアップ

### 環境変数の設定

#### ローカル開発環境
`.env.local`ファイルをプロジェクトルートに作成し、以下の環境変数を設定してください：

```
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Vercelデプロイ環境
Vercelの管理画面で環境変数を設定してください：

1. Vercelのプロジェクト管理画面にアクセス
2. 「Settings」→「Environment Variables」を選択
3. 以下の環境変数を追加：
   - **Name**: `GEMINI_API_KEY`
   - **Value**: あなたのGemini APIキー
   - **Environment**: Production, Preview, Development すべてにチェック

## 技術スタック

- **Framework**: Next.js 15.1.3
- **Runtime**: React 19
- **Styling**: Tailwind CSS 3.4.1
- **AI**: Google Generative AI SDK 0.21.0
- **Model**: gemini-pro (stable)
- **Language**: TypeScript

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
npm start
```

## 使用方法

1. フォームに必要な情報を入力
2. 「Analyze Performance」ボタンをクリック
3. AI（三田村Gemini先生）による分析結果が表示されます

## 注意事項

- Gemini APIキーは必ず環境変数として設定してください
- 本番環境では環境変数が正しく設定されているか確認してください
