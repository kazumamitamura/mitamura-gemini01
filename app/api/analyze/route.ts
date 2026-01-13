import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import nodemailer from "nodemailer";
import { marked } from "marked";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

interface AnalyzeRequest {
  name: string;
  email: string;
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

// ★改良版: エラーの内容を「文字」で返すように変更
async function saveToSpreadsheet(data: AnalyzeRequest, advice: string): Promise<string | null> {
  try {
    // 環境変数のチェック
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SPREADSHEET_ID) {
      return "環境変数（Email, Key, ID）のいずれかがVercelに設定されていません。";
    }

    // 認証設定
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);
    
    // シート読み込み（ここで失敗しやすい）
    try {
      await doc.loadInfo();
    } catch (e: any) {
      if (e.message.includes("403")) return "権限エラー (403): スプレッドシートにロボットのアドレス(client_email)を招待していないか、APIが無効です。";
      if (e.message.includes("404")) return "IDエラー (404): スプレッドシートIDが間違っています。";
      return `接続エラー: ${e.message}`;
    }

    const sheet = doc.sheetsByIndex[0];
    const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

    // 書き込み
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

    return null; // 成功（エラーなし）

  } catch (error: any) {
    console.error("Spreadsheet Error:", error);
    return `書き込み中の不明なエラー: ${error.message}`;
  }
}

// ...（以下、Gemini関連の関数は変更なし）...
function getMBTIGuidance(mbti?: string): string {
  if (!mbti) return "一般的な熱血コーチとして、励ましと共に具体的なアドバイスを提供してください。";
  const mbtiUpper = mbti.toUpperCase();
  if (["INTJ", "INTP", "ENTJ", "ENTP"].includes(mbtiUpper)) return `あなたは${mbti}タイプの選手に対して、データと理論を重視した指導を行います。`;
  if (["INFJ", "INFP", "ENFJ", "ENFP"].includes(mbtiUpper)) return `あなたは${mbti}タイプの選手に対して、情熱とイメージを大切にした指導を行います。`;
  if (["ISTJ", "ISFJ", "ESTJ", "ESFJ"].includes(mbtiUpper)) return `あなたは${mbti}タイプの選手に対して、実践的で体系的な指導を行います。`;
  if (["ISTP", "ISFP", "ESTP", "ESFP"].includes(mbtiUpper)) return `あなたは${mbti}タイプの選手に対して、実践的で柔軟な指導を行います。`;
  return "一般的な熱血コーチとして、励ましと共に具体的なアドバイスを提供してください。";
}

function getFlexibilityAnalysis(ankleDorsiflexion?: string, shoulderThoracic?: string, hamstring?: string): string {
  const issues: string[] = [];
  const recommendations: string[] = [];
  if (ankleDorsiflexion === "C") {
    issues.push("足首の背屈が硬い（C評価）");
    recommendations.push("足首の背屈制限は技術的エラーの原因となります。ウォールアンクルモビリティドリルなどを実施してください。");
  }
  if (shoulderThoracic === "C") {
    issues.push("肩・胸郭の可動域が硬い（C評価）");
    recommendations.push("肩・胸郭の制限は頭上保持の姿勢不良の原因です。チェストストレッチなどを行ってください。");
  }
  if (hamstring === "C") {
    issues.push("ハムストリングスが硬い（C評価）");
    recommendations.push("ハムストリングスの硬さはスクワットの深さに影響します。PNFストレッチなどを実施してください。");
  }
  if (issues.length === 0) return "柔軟性は良好です。";
  return `## 柔軟性の問題点\n${issues.map((i) => `- ${i}`).join("\n")}\n## 改善提案\n${recommendations.map((r, idx) => `${idx + 1}. ${r}`).join("\n")}`;
}

function getPainAnalysis(painLevel: number, injuryPainLocation?: string): string {
  if (painLevel === 0) return "痛みは報告されていません。";
  if (painLevel >= 7) return `⚠️ **警告**: 痛みレベル${painLevel}。専門医への相談を最優先してください。`;
  if (painLevel >= 4) return `⚠️ **注意**: 痛みレベル${painLevel}。無理な動作は避け、ケアを徹底してください。`;
  return `軽度の痛み（レベル${painLevel}）があります。注意してトレーニングしてください。`;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "氏名とメールアドレスは必須です。" }, { status: 400 });
    }

    if (!process.env.SENDER_EMAIL || !process.env.SENDER_PASSWORD) {
      return NextResponse.json({ error: "システム設定エラー: メール送信情報が不足しています。" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    let model;
    try {
      // 万能な gemini-pro を指定
      model = getGeminiModel("gemini-2.5-flash");
    } catch (error) {
      return NextResponse.json({ error: "Gemini APIの初期化に失敗しました。" }, { status: 500 });
    }

    const mbtiGuidance = getMBTIGuidance(body.mbti);
    const flexibilityAnalysis = getFlexibilityAnalysis(body.ankleDorsiflexion, body.shoulderThoracic, body.hamstring);
    const painAnalysis = getPainAnalysis(body.painLevel, body.injuryPainLocation);

    let calculationsText = "";
    if (body.Snatch && body.CJ && body.CJ !== 0) {
      const goldenRatio = (body.Snatch / body.CJ) * 100;
      calculationsText += `- 黄金比率 (Golden Ratio): ${goldenRatio.toFixed(2)}% (理想範囲: 80-84%)\n`;
    }
    if (body.CJ && body.BSq && body.BSq !== 0) {
      const squatEfficiency = (body.CJ / body.BSq) * 100;
      calculationsText += `- スクワット効率 (CJ/BSq): ${squatEfficiency.toFixed(2)}%\n`;
    }
    if (body.DL_S && body.CJ && body.CJ !== 0) {
      const dlRatio = (body.DL_S / body.CJ) * 100;
      calculationsText += `- デッドリフト比率 (DL(S)/CJ): ${dlRatio.toFixed(2)}% (理想: 120-130%)\n`;
    }

    const prompt = `
あなたは「三田村Gemini先生」として、スポーツ科学の専門家であり、熱血コーチです。
(以下、プロンプトは前回と同じなので省略しませんが、スペース節約のため中略します。実際は元のプロンプトを使ってください)
以下のウェイトリフティング選手のデータを詳細に分析し、Markdown形式で包括的なアドバイスを提供してください。
## 選手基本情報
- 氏名: ${body.name}
${body.gradeAge ? `- 学年・年齢: ${body.gradeAge}` : ""}
${body.gender ? `- 性別: ${body.gender}` : ""}
${body.experience ? `- 競技歴: ${body.experience}` : ""}
${body.mbti ? `- MBTI: ${body.mbti}` : ""}
${body.height ? `- 身長: ${body.height} cm` : ""}
${body.weight ? `- 体重: ${body.weight} kg` : ""}

## 生活習慣
${body.sleepTime !== undefined ? `- 睡眠時間: ${body.sleepTime} 時間` : ""}
${body.mealStaple ? `- 主食の量: ${body.mealStaple}` : ""}
${body.mealMainType ? `- 主菜の傾向: ${body.mealMainType}` : ""}
${body.mealMainPortion ? `- 主菜のサイズ: ${body.mealMainPortion}` : ""}
${body.mealVegetable ? `- 副菜の頻度: ${body.mealVegetable}` : ""}
${body.mealSoup ? `- 汁物: ${body.mealSoup}` : ""}
${body.mealSupplement ? `- 補食・プロテイン活用: ${body.mealSupplement}` : ""}

## ベスト記録 (kg)
${body.PP !== undefined ? `- PP: ${body.PP} kg` : ""}
${body.Snatch !== undefined ? `- Snatch: ${body.Snatch} kg` : ""}
${body.HS !== undefined ? `- HS (入スナッチ): ${body.HS} kg` : ""}
${body.PSn !== undefined ? `- PSn: ${body.PSn} kg` : ""}
${body.CJ !== undefined ? `- C&J: ${body.CJ} kg` : ""}
${body.HJ !== undefined ? `- HJ: ${body.HJ} kg` : ""}
${body.BSq !== undefined ? `- BSq (バックスクワット): ${body.BSq} kg` : ""}
${body.FSq !== undefined ? `- FSq: ${body.FSq} kg` : ""}
${body.DL_S !== undefined ? `- DL(S): ${body.DL_S} kg` : ""}
${body.DL_J !== undefined ? `- DL(J): ${body.DL_J} kg` : ""}
${body.RJ !== undefined ? `- RJ (ラックジャーク): ${body.RJ} kg` : ""}
${body.BS !== undefined ? `- BS (バランススナッチ): ${body.BS} kg` : ""}
${body.BenchPress !== undefined ? `- Bench Press: ${body.BenchPress} kg` : ""}
${body.SnatchStand !== undefined ? `- Snatch(台): ${body.SnatchStand} kg` : ""}
${body.CJStand !== undefined ? `- C&J(台): ${body.CJStand} kg` : ""}

## 体力テスト
${body.standingLongJump !== undefined ? `- 立ち幅跳び: ${body.standingLongJump} cm` : ""}
${body.run50M !== undefined ? `- 50M走: ${body.run50M} 秒` : ""}
${body.gripRight !== undefined ? `- 握力(右): ${body.gripRight} kg` : ""}
${body.gripLeft !== undefined ? `- 握力(左): ${body.gripLeft} kg` : ""}
${body.sitAndReach !== undefined ? `- 長座体前屈: ${body.sitAndReach} cm` : ""}
${body.ankleDorsiflexion ? `- 足首の背屈: ${body.ankleDorsiflexion}` : ""}
${body.shoulderThoracic ? `- 肩・胸郭の可動域: ${body.shoulderThoracic}` : ""}
${body.hamstring ? `- ハムストリングス: ${body.hamstring}` : ""}

## コンディション
${body.injuryPainLocation ? `- 怪我・痛みの場所: ${body.injuryPainLocation}` : ""}
- 痛みレベル: ${body.painLevel}/10

## 相談内容
${body.consultation || "特になし"}

## 計算結果
${calculationsText}

## 重要な分析要件
1. **性格分析に基づく指導スタイル**: ${mbtiGuidance}
2. **柔軟性評価の分析**: ${flexibilityAnalysis}
3. **弱点特定**: バランススナッチ(BS)やラックジャーク(RJ)の記録も含め、技術と筋力のバランスを評価してください。
4. **痛みへの配慮**: ${painAnalysis}
5. **食事・栄養指導**: エネルギー、タンパク質、コンディション、睡眠の観点から指導してください。
6. **総合的なアドバイス**: 熱血コーチとして、具体的で実践的なアドバイスを提供してください。

## 出力形式
Markdown形式で出力してください。
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    const parsedHtml = await marked.parse(analysisText);
    const styledHtml = parsedHtml
      .replace(/<h1>/g, '<h1 style="color: #4f46e5; font-size: 24px; border-bottom: 2px solid #e0e7ff; padding-bottom: 10px;">')
      .replace(/<h2>/g, '<h2 style="color: #c2410c; font-size: 20px; margin-top: 25px; border-left: 4px solid #fdba74; padding-left: 10px;">')
      .replace(/<h3>/g, '<h3 style="color: #4338ca; font-size: 18px; margin-top: 20px;">')
      .replace(/<p>/g, '<p style="margin-bottom: 15px; color: #374151; line-height: 1.8;">')
      .replace(/<ul>/g, '<ul style="padding-left: 20px; color: #374151;">')
      .replace(/<li>/g, '<li style="margin-bottom: 8px;">')
      .replace(/<strong>/g, '<strong style="color: #be185d;">');

    // ★重要: 先にスプレッドシートへの保存を試みる
    // 失敗したら、その理由（エラーメッセージ）が返ってくる
    const spreadsheetError = await saveToSpreadsheet(body, analysisText);

    // ★メールにエラー情報を追加するエリアを作成
    let debugSection = "";
    if (spreadsheetError) {
      debugSection = `
        <div style="margin-top: 30px; padding: 15px; background-color: #fee2e2; border: 2px solid #ef4444; color: #b91c1c; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0;">⚠️ システム警告: スプレッドシート保存エラー</h3>
          <p style="font-size: 14px; font-weight: bold;">保存に失敗しました。以下の理由を確認してください：</p>
          <p style="font-size: 12px; font-family: monospace; background: white; padding: 5px; border: 1px solid #fab5b5;">${spreadsheetError}</p>
          <p style="font-size: 12px; margin-top: 10px;">
             <strong>対策:</strong><br>
             1. スプレッドシートの「共有」にロボットのアドレスが入っていますか？<br>
             2. VercelのID設定は正しいですか？
          </p>
        </div>
      `;
    }

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #4f46e5; margin: 0;">🏋️ 三田村Gemini先生</h1>
          <p style="color: #6b7280; font-size: 14px;">Weightlifting Performance Analysis</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <p style="font-size: 16px; font-weight: bold; color: #111827;">${body.name} 選手、お疲れ様です！</p>
          <p>今回の分析結果をお届けします。日々のトレーニングの参考にしてください。</p>
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;">
          
          ${styledHtml}
          
          ${debugSection}  </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #9ca3af;">
          <p>※このメールは自動送信されています。</p>
          <p>© 2026 Weightlifting Analysis System</p>
        </div>
      </div>
    `;

    // メール送信
    await transporter.sendMail({
      from: `"三田村Gemini先生" <${process.env.SENDER_EMAIL}>`,
      to: body.email,
      subject: `【分析結果】三田村Gemini先生からのフィードバック (${body.name}様)`,
      html: htmlContent,
    });
    console.log("Email sent successfully");

    return NextResponse.json({ success: true, analysis: analysisText });
  } catch (error) {
    console.error("Error in analyze route:", error);
    return NextResponse.json({ error: "分析処理中にエラーが発生しました。" }, { status: 500 });
  }
}