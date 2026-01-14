import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import nodemailer from "nodemailer";
import { marked } from "marked";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

interface AnalyzeRequest {
  name: string;
  email: string;
  lineUserId?: string;
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

// LINE送信関数
async function sendLineMessage(userId: string | undefined, message: string) {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const targetId = userId || process.env.LINE_USER_ID;

  if (!channelAccessToken || !targetId) return;

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
  } catch (error) {
    console.error("LINE送信エラー:", error);
  }
}

// スプレッドシート保存
async function saveToSpreadsheet(data: AnalyzeRequest, advice: string, id: string): Promise<string | null> {
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
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

    await sheet.addRow({
      "ID": id,
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
      "AIアドバイス": advice
    });
    return null;
  } catch (error: any) {
    console.error("Spreadsheet Error:", error);
    return error.message;
  }
}

function getPainAnalysis(painLevel: number, injuryPainLocation?: string): string {
  if (painLevel === 0) return "痛みなし。";
  if (painLevel >= 7) return `⚠️ 痛みLv${painLevel}（${injuryPainLocation}）。医療機関受診を推奨。`;
  return `軽度の痛み（Lv${painLevel}）。${injuryPainLocation}の状態を確認しつつ実施。`;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "氏名とメールアドレスは必須です。" }, { status: 400 });
    }

    // ID発行
    const analysisId = Date.now().toString(36) + Math.random().toString(36).substring(2);

    // Gemini分析
    let model;
    try {
      model = getGeminiModel("gemini-2.5-flash");
    } catch (e) {
      return NextResponse.json({ error: "Gemini初期化エラー" }, { status: 500 });
    }

    const painAnalysis = getPainAnalysis(body.painLevel, body.injuryPainLocation);

    // ★ここを修正しました！項目を明確に分けてAIに伝えます
    const prompt = `
あなたは三田村Gemini先生（ウェイトリフティング専門コーチ）です。
以下の選手データに基づき、Markdown形式で熱血指導を行ってください。

## 選手プロフィール
- 氏名: ${body.name}
- 学年・年齢: ${body.gradeAge || "不明"}
- 性別: ${body.gender || "不明"}
- 競技歴: ${body.experience || "不明"}
- 身長: ${body.height ? body.height + "cm" : "不明"}
- 体重: ${body.weight ? body.weight + "kg" : "不明"}
- MBTI: ${body.mbti || "不明"}

## コンディション・記録
- 記録: Snatch ${body.Snatch || "-"}kg / C&J ${body.CJ || "-"}kg / BSq ${body.BSq || "-"}kg
- 痛み: ${painAnalysis}
- 睡眠時間: ${body.sleepTime ? body.sleepTime + "時間" : "不明"}
- 相談内容: ${body.consultation || "特になし"}

## 指導のポイント
1. 競技歴と年齢を考慮し、適切なレベルのアドバイスを行うこと。（初心者に高度すぎる話をしない、ベテランに基本すぎる話をしない）
2. S/CJの比率や、スクワットに対する効率を分析すること。
3. 痛みがある場合はケアの方法を提案すること。
4. Markdownで見やすく出力すること。
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    // スプレッドシート保存
    await saveToSpreadsheet(body, analysisText, analysisId);

    // URL作成
    const appUrl = "https://mitamura-gemini01.vercel.app"; 
    const resultUrl = `${appUrl}/result/${analysisId}`;

    // LINE通知
    const lineMessage = `
💪 ${body.name}選手、分析完了！

📊 今回の記録
Snatch: ${body.Snatch || "-"}kg
C&J: ${body.CJ || "-"}kg

▼ 詳細なアドバイスはこちらのページで確認できます！
${resultUrl}

(三田村Gemini先生より)
`;
    
    await sendLineMessage(body.lineUserId, lineMessage);

    // メール送信
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
        html: `<div style="font-family:sans-serif;">
          <p>詳細な結果は以下のリンクからも確認できます：<br><a href="${resultUrl}">${resultUrl}</a></p>
          <hr>
          ${parsedHtml}
        </div>`,
      });
    }

    return NextResponse.json({ success: true, analysis: analysisText });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}