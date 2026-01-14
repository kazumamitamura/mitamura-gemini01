# 🏋️ AI Weightlifting Coach (AIウェイトリフティング・コーチ)

**Google Gemini 2.5 × LINE LIFF を活用した、次世代のスポーツ指導DXツール**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-8E75B2)

## 📖 概要 (Overview)

「AI Weightlifting Coach」は、ウェイトリフティングの練習記録やコンディションを入力すると、専属のAIコーチが**LINEを通じて即座に個別フィードバック**を行うWebアプリケーションです。

指導者が多数の生徒を抱える教育現場において、「一人ひとりの日誌に毎日細やかなアドバイスを返す時間が足りない」という課題を解決するために開発されました。

### 📱 実際の画面 (Demo)
| 入力フォーム (LIFF) | LINE通知 & 分析結果 |
|:---:|:---:|
| <img src="https://placehold.co/300x600/1e293b/white?text=Input+Form" width="250" alt="Input Form"> | <img src="https://placehold.co/300x600/06c755/white?text=LINE+Result" width="250" alt="LINE Notification"> |

## ✨ 主な機能 (Features)

* **LINE完全連携 (LIFF)**
    * 専用アプリのインストール不要。LINEのトーク画面からQRコード/メニューで即座に起動。
    * `liff.getProfile()` により、ユーザーIDを自動取得してログインレスな体験を実現。
* **高度なAI分析 (Gemini 2.5 Flash)**
    * 選手の「年齢」「競技歴」「記録」「痛みレベル」を多角的に分析。
    * 初心者には基礎重視、ベテランには戦略重視など、相手に合わせた指導スタイルを自動調整。
* **リアルタイムUI & 可視化**
    * 痛みレベル（0〜10）をスライダーで直感的に入力し、数値化。
    * 結果ページでは、マークダウン形式のAIアドバイスを美しくレンダリング。
* **自動データベース化 (Google Sheets)**
    * 入力データと分析結果は、Googleスプレッドシートに自動保存。
    * 指導者はExcel感覚で全生徒のデータを管理・閲覧可能。
* **詳細レポート機能**
    * LINEの短文メッセージに加え、詳細な分析結果ページへのパーマリンク（固定URL）を自動発行。

## 🛠️ 技術スタック (Tech Stack)

* **Frontend**: Next.js (App Router), React, Tailwind CSS
* **Platform**: LINE LIFF (LINE Front-end Framework)
* **AI Model**: Google Gemini API (gemini-2.5-flash)
* **Messaging**: LINE Messaging API
* **Database**: Google Sheets API (via `google-spreadsheet`)
* **Infrastructure**: Vercel

## ⚙️ 環境変数 (Environment Variables)

このプロジェクトを実行するには、以下の環境変数を設定する必要があります。

```bash
# LINE関連
NEXT_PUBLIC_LIFF_ID=your_liff_id
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
LINE_USER_ID=your_debug_user_id

# Google Sheets関連
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_SPREADSHEET_ID=your_sheet_id

# Gemini API関連
GEMINI_API_KEY=your_gemini_api_key

# その他
SENDER_EMAIL=your_gmail_for_backup
SENDER_PASSWORD=your_app_password

🚀 開発の背景とこだわり (Background)
課題 (Problem)
従来の部活動やクラブチームでは、指導者1名に対して数十名の選手がいる状況が一般的であり、練習日誌へのフィードバックは「確認印のみ」や「定型文」になりがちでした。これでは選手のモチベーション維持や、怪我の予兆検知が困難でした。

解決策 (Solution)
「入力のハードルを下げる（LINE）」と「フィードバックの質を高める（Gemini）」を組み合わせることで、指導者が不在の時間でも、質の高いコーチングを提供できるシステムを構築しました。

工夫した点
プロンプトエンジニアリング: 「競技歴3年」を「3歳」と誤認しないよう、AIへの指示書（Prompt）でコンテキストを明確に分離しました。

UXの最適化: 入力完了後、LINEのトークルームに自動で通知が届くスムーズな導線を設計しました。

運用コストゼロ: サーバーレス（Vercel）とスプレッドシートを活用し、ランニングコストを実質無料に抑えました。

👨‍💻 Author
Mitamura Gemini Coach

Weightlifting Coach / Engineer

This project was created with Next.js and Vercel.

---

### 💡 使い方のアドバイス

1.  **画像の貼り付け**:
    * `### 📱 実際の画面 (Demo)` のところにある `<img src...>` の部分はダミー画像になっています。
    * GitHubの「Issues」などに自分のアプリのスクリーンショットをドラッグ＆ドロップしてアップロードし、その発行されたURLに書き換えると、ご自身のアプリの画像が表示されてより魅力的になります！（難しければ、そのままでも「画像予定地」として機能します）
2.  **英語と日本語の併記**:
    * エンジニアのポートフォリオは英語で書かれることも多いですが、国内転職を意識して**「日本語メイン＋英語の見出し」**という構成にしました。これなら誰が読んでも理解できます。

これを貼り付けるだけで、リポジトリの見た目が一気に本格的なアプリっぽくなりますよ！
