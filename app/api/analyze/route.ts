import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import nodemailer from "nodemailer";
import { marked } from "marked";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// データ型定義（lineUserIdを追加）
interface AnalyzeRequest {
  name: string;
  email: string;
  lineUserId?: string; // ★追加：生徒のLINE ID
  gradeAge?: string;
  gender?: string;
  experience?: string;
  mbti?: string;
  height?: number;
  weight?: number;
  sleepTime?: number;
  mealStaple?: string;
  mealMainType?: string;
  mealMainPortion?: string;
  mealVegetable?: string;
  mealSoup?: string;
  mealSupplement?: string;
  PP?: number;
  Snatch?: number;
  HS?: number;
  PSn?: number;
  CJ?: number;
  HJ?: number;
  BSq?: number;
  FSq?: number;
  DL_S?: number;
  DL_J?: number;
  RJ?: number;
  BS?: number;
  BenchPress?: number;
  SnatchStand?: number;
  CJStand?: number;
  standingLongJump?: number;
  run50M?: number;
  gripRight?: number;
  gripLeft?: number;
  sitAndReach?: number;
  ankleDorsiflexion?: string;
  shoulderThoracic?: string;
  hamstring?: string;
  injuryPainLocation?: string;
  painLevel: number;
  consultation?: string;
}

// ★LINE送信機能（宛先を動的に変更）
async function sendLineMessage(userId: string | undefined, message: string) {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  // 宛先：生徒のIDがあればそれを使う。なければ先生(環境変数)に送る。
  const targetId = userId || process.env.LINE_USER_ID;

  if (!channelAccessToken || !targetId) {
    console.log("LINE通知スキップ: Tokenまたは宛先IDがありません");
    return;
  }

  try {
    await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${channelAccessToken}`,
      },
      body: JSON.stringify({
        to: targetId,
        messages: [{ type: "text", text: message }],
      }),
    });
    console.log(`LINE通知送信成功 (To: ${targetId})`);
  } catch (error) {
    console.error("LINE送信エラー:", error);
  }
}

// スプレッドシート保存
async function saveToSpreadsheet(data: AnalyzeRequest, advice: string): Promise<string | null> {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SPREADSHEET_ID) {
      return "環境変数不足";
    }

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);
    
    try {
      await doc.loadInfo();
    } catch (e: any) {
        if (e.message.includes("403")) return "権限エラー (403)";
        if (e.message.includes("404")) return "IDエラー (404)";
        return `接続エラー: ${e.message}`;
    }
    
    const sheet = doc.sheetsByIndex[0];
    const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

    await sheet.addRow({
      "日時": now,
      "氏名": data.name,
      "Email": data.email,
      "スナッチ": data.Snatch || "",
      "C&J": data.CJ || "",
      "BSq": data.BSq || "",
      "睡眠時間": data.sleepTime || "",
      "痛みLv": data.painLevel,
      "痛み箇所": data.injuryPainLocation || "",
      "MBTI": data.mbti || "",
      "AIアドバイス": advice.slice(0, 500) + "..."
    });
    return null;
  } catch (error: any) {
    console.error("Spreadsheet Error:", error);
    return error.message;
  }
}

// 分析ロジック（ヘルパー関数）
function getPainAnalysis(painLevel: number, injuryPainLocation?: string): string {
  if (painLevel === 0) return "痛みなし。";
  if (painLevel >= 7) return `⚠️ 痛みLv${painLevel}（${injuryPainLocation}）。医療機関受診を推奨。`;
  return `軽度の痛み（Lv${painLevel}）。${injuryPainLocation}の状態を確認しつつ実施。`;
}

// メイン処理
export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "氏名とメールアドレスは必須です。" }, { status: 400 });
    }

    // Gemini分析
    let model;
    try {
      model = getGeminiModel("gemini-2.5-flash");
    } catch (e) {
      return NextResponse.json({ error: "Gemini初期化エラー" }, { status: 500 });
    }

    const painAnalysis = getPainAnalysis(body.painLevel, body.injuryPainLocation);

    const prompt = `
あなたは三田村Gemini先生（ウェイトリフティング専門コーチ）です。
以下の選手データに基づき、Markdown形式で熱血指導を行ってください。

## 選手データ
- 氏名: ${body.name} (${body.experience || "歴不明"})
- 記録: S${body.Snatch || "-"} / CJ${body.CJ || "-"} / BSq${body.BSq || "-"}
- 痛み: ${painAnalysis}
- 相談: ${body.consultation || "なし"}

## 指導ポイント
1. 記録のバランス(S/CJ比率など)を分析せよ。
2. 痛みがある場合はケアの方法を提案せよ。
3. 食事・睡眠へのアドバイスを含めよ。
4. Markdownで見やすく出力せよ。
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    // スプレッドシート保存
    await saveToSpreadsheet(body, analysisText);

    // ★LINE通知（生徒本人へ！）
    const lineMessage = `
💪 ${body.name}選手、分析完了！

📊 今回の記録
Snatch: ${body.Snatch || "-"}kg
C&J: ${body.CJ || "-"}kg

【三田村Gemini先生からのアドバイス】
${analysisText.slice(0, 150)}...

(全文はメールまたは画面で確認してくれ！)
`;
    // ここで生徒のID（body.lineUserId）に送る
    await sendLineMessage(body.lineUserId, lineMessage);

    // メール送信（バックアップとして維持）
    if (process.env.SENDER_EMAIL && process.env.SENDER_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.SENDER_EMAIL, pass: process.env.SENDER_PASSWORD },
      });
      const parsedHtml = await marked.parse(analysisText);
      await transporter.sendMail({
        from: `"三田村Gemini先生" <${process.env.SENDER_EMAIL}>`,
        to: body.email,
        subject: `【分析結果】${body.name}選手へのフィードバック`,
        html: `<div style="font-family:sans-serif;">${parsedHtml}</div>`,
      });
    }

    return NextResponse.json({ success: true, analysis: analysisText });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}