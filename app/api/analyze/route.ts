import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

interface AnalyzeRequest {
  // 基本情報
  name: string;
  email: string;
  // 身体データ
  gradeAge?: string;
  gender?: string;
  experience?: string;
  mbti?: string;
  height?: number;
  weight?: number;
  // ベスト記録
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
  // 体力テスト
  standingLongJump?: number;
  run50M?: number;
  gripRight?: number;
  gripLeft?: number;
  sitAndReach?: number;
  ankleDorsiflexion?: string;
  shoulderThoracic?: string;
  hamstring?: string;
  // コンディション
  injuryPainLocation?: string;
  painLevel: number;
  // 相談内容
  consultation?: string;
}

/**
 * MBTIタイプに基づく指導スタイルの設定
 */
function getMBTIGuidance(mbti?: string): string {
  if (!mbti) {
    return "一般的な熱血コーチとして、励ましと共に具体的なアドバイスを提供してください。";
  }

  const mbtiUpper = mbti.toUpperCase();

  // 分析家グループ (INTJ, INTP, ENTJ, ENTP)
  if (["INTJ", "INTP", "ENTJ", "ENTP"].includes(mbtiUpper)) {
    return `あなたは${mbti}タイプの選手に対して、データと理論を重視した指導を行います。分析的なアプローチで、数値や比率を明確に示しながら、論理的に改善点を説明してください。感情よりも事実と論理で説得するスタイルです。`;
  }

  // 外交官グループ (INFJ, INFP, ENFJ, ENFP)
  if (["INFJ", "INFP", "ENFJ", "ENFP"].includes(mbtiUpper)) {
    return `あなたは${mbti}タイプの選手に対して、情熱とイメージを大切にした指導を行います。選手の可能性を引き出すような言葉がけをし、理想的な未来像を描きながら、モチベーションを高めるアプローチを取ってください。感情に寄り添いながら、情熱的に語りかけてください。`;
  }

  // 番人グループ (ISTJ, ISFJ, ESTJ, ESFJ)
  if (["ISTJ", "ISFJ", "ESTJ", "ESFJ"].includes(mbtiUpper)) {
    return `あなたは${mbti}タイプの選手に対して、実践的で体系的な指導を行います。段階的な改善プロセスを示し、明確な手順とルールを提示してください。伝統的な方法と実績に基づいた、信頼できるアドバイスを心がけてください。`;
  }

  // 探検家グループ (ISTP, ISFP, ESTP, ESFP)
  if (["ISTP", "ISFP", "ESTP", "ESFP"].includes(mbtiUpper)) {
    return `あなたは${mbti}タイプの選手に対して、実践的で柔軟な指導を行います。体験を通じて学ぶことを重視し、即座に試せる具体的なアドバイスを提供してください。自由な発想を促しつつ、実践的な解決策を示してください。`;
  }

  return "一般的な熱血コーチとして、励ましと共に具体的なアドバイスを提供してください。";
}

/**
 * 柔軟性評価に基づく分析とアドバイス生成
 */
function getFlexibilityAnalysis(
  ankleDorsiflexion?: string,
  shoulderThoracic?: string,
  hamstring?: string
): string {
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (ankleDorsiflexion === "C") {
    issues.push("足首の背屈が硬い（C評価）");
    recommendations.push(
      "足首の背屈制限は、スクワットやクリーンの際に前傾姿勢を強制し、技術的エラーの原因となります。ウォールアンクルモビリティドリル、カーフストレッチ、アンクルモビリティルーティンを毎日のウォームアップに組み込んでください。"
    );
  }

  if (shoulderThoracic === "C") {
    issues.push("肩・胸郭の可動域が硬い（C評価）");
    recommendations.push(
      "肩・胸郭の可動域制限は、頭上保持（スナッチ、ジャーク）の姿勢不良と肩の痛みの主要原因です。ショルダーディスロケーション、チェストストレッチ、壁を使った胸椎エクステンション、ラットストレッチを重点的に行ってください。"
    );
  }

  if (hamstring === "C") {
    issues.push("ハムストリングスが硬い（C評価）");
    recommendations.push(
      "ハムストリングスの硬さは、スクワットの深さとクリーンの引き込み動作に影響します。PNFストレッチ、動的ストレッチ、ランジポジションでのストレッチを、トレーニング前後に行ってください。"
    );
  }

  if (issues.length === 0) {
    return "柔軟性の評価からは、特に大きな制限は見られません。現在の柔軟性を維持しつつ、コンディショニングを継続してください。";
  }

  return `
## 柔軟性の問題点
${issues.map((i) => `- ${i}`).join("\n")}

## 改善提案
${recommendations.map((r, idx) => `${idx + 1}. ${r}`).join("\n")}
`;
}

/**
 * 痛みレベルと場所に基づく警告とアドバイス生成
 */
function getPainAnalysis(
  painLevel: number,
  injuryPainLocation?: string
): string {
  if (painLevel === 0) {
    return "痛みは報告されていません。現在のコンディションは良好です。";
  }

  if (painLevel >= 7) {
    return `⚠️ **警告**: 痛みレベルが${painLevel}/10と高く、${injuryPainLocation || "特定部位"}に痛みがあります。**絶対にやってはいけない動作**:
- 痛みを誘発する種目の実施
- フルレンジでのリフト
- 高重量での挑戦
- 痛みを我慢してのトレーニング

**推奨される対応**:
- 専門医への相談を最優先してください
- 痛みのない範囲でのみ軽量トレーニング
- アイシングと安静
- 代替種目でのコンディショニング`;

  } else if (painLevel >= 4) {
    return `⚠️ **注意**: 痛みレベルが${painLevel}/10で、${injuryPainLocation || "特定部位"}に痛みがあります。
- 痛みを増悪させる動作は避けてください
- 重量とボリュームを調整してください
- ウォームアップとクールダウンを入念に行ってください
- 痛みの変化を記録し、悪化する場合はトレーニングを中止してください`;
  }

  return `軽度の痛み（${painLevel}/10）が${injuryPainLocation || "特定部位"}に報告されています。トレーニングの強度を調整し、痛みの変化に注意を払ってください。`;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    // 必須フィールドの確認
    if (!body.name || !body.email) {
      return NextResponse.json(
        {
          error: "氏名とメールアドレスは必須です。",
        },
        { status: 400 }
      );
    }

    // 痛みレベルの検証
    if (
      body.painLevel === undefined ||
      isNaN(body.painLevel) ||
      body.painLevel < 0 ||
      body.painLevel > 10
    ) {
      return NextResponse.json(
        {
          error: "痛みレベルは0-10の範囲で入力してください。",
        },
        { status: 400 }
      );
    }

    // Gemini APIの初期化チェック
    let model;
    try {
      model = getGeminiModel();
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Gemini APIの初期化に失敗しました。",
        },
        { status: 500 }
      );
    }

    // MBTIベースの指導スタイル
    const mbtiGuidance = getMBTIGuidance(body.mbti);

    // 柔軟性分析
    const flexibilityAnalysis = getFlexibilityAnalysis(
      body.ankleDorsiflexion,
      body.shoulderThoracic,
      body.hamstring
    );

    // 痛み分析
    const painAnalysis = getPainAnalysis(
      body.painLevel,
      body.injuryPainLocation
    );

    // 計算値（可能な場合）
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

    // プロンプトの構築
    const prompt = `
あなたは「三田村Gemini先生」として、スポーツ科学の専門家であり、熱血コーチです。
以下のウェイトリフティング選手のデータを詳細に分析し、Markdown形式で包括的なアドバイスを提供してください。

## 選手基本情報
- 氏名: ${body.name}
- メール: ${body.email}
${body.gradeAge ? `- 学年・年齢: ${body.gradeAge}` : ""}
${body.gender ? `- 性別: ${body.gender}` : ""}
${body.experience ? `- 競技歴: ${body.experience}` : ""}
${body.mbti ? `- MBTI: ${body.mbti}` : ""}
${body.height ? `- 身長: ${body.height} cm` : ""}
${body.weight ? `- 体重: ${body.weight} kg` : ""}

## ベスト記録 (kg)
${body.PP !== undefined ? `- PP: ${body.PP} kg` : ""}
${body.Snatch !== undefined ? `- Snatch: ${body.Snatch} kg` : ""}
${body.HS !== undefined ? `- HS: ${body.HS} kg` : ""}
${body.PSn !== undefined ? `- PSn: ${body.PSn} kg` : ""}
${body.CJ !== undefined ? `- C&J: ${body.CJ} kg` : ""}
${body.HJ !== undefined ? `- HJ: ${body.HJ} kg` : ""}
${body.BSq !== undefined ? `- BSq: ${body.BSq} kg` : ""}
${body.FSq !== undefined ? `- FSq: ${body.FSq} kg` : ""}
${body.DL_S !== undefined ? `- DL(S): ${body.DL_S} kg` : ""}
${body.DL_J !== undefined ? `- DL(J): ${body.DL_J} kg` : ""}
${body.RJ !== undefined ? `- RJ: ${body.RJ} kg` : ""}
${body.BS !== undefined ? `- BS: ${body.BS} kg` : ""}
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
${calculationsText || "計算可能な数値が不足しています。"}

## 重要な分析要件

### 1. 性格分析に基づく指導スタイル
${mbtiGuidance}
この方針に基づいて、アドバイスの口調とアプローチを調整してください。

### 2. 柔軟性評価の分析
${flexibilityAnalysis}

上記の柔軟性評価を踏まえ、以下の点を分析してください:
- スクワットやクリーンの技術的エラーと柔軟性制限の関連性
- 頭上保持（スナッチ、ジャーク）の姿勢不良と柔軟性制限の関連性
- C評価（硬い）がある部位について、具体的なストレッチや改善種目を提案してください

### 3. 弱点特定（補助種目分析）
以下の比率を分析し、基礎筋力と技術のバランスを評価してください:
- DL(S)とCJの比率: 基礎筋力が十分か、技術が足りないかを判定
- BSqとCJの比率: スクワット効率から、テクニックの習熟度を評価
- PSnとSnatchの差: テクニックの習熟度（スクワットの深さとタイミング）
- Snatch(台)とSnatchの差: 引き込み動作とタイミングの評価

基礎筋力が不足している場合は、補強種目（スクワット、デッドリフト、ベンチプレス）を推奨してください。
技術が不足している場合は、技術練習（パワースナッチ、パワークリーン、ハング）を推奨してください。

### 4. 痛みへの配慮
${painAnalysis}

痛みレベルと箇所に基づき、以下の点を明確にしてください:
- 絶対にやってはいけない動作
- 痛みを避けながらできる代替トレーニング
- 痛みの原因となる可能性のある技術的エラー

### 5. 総合的なアドバイス
上記の全ての情報を統合し、以下の観点から包括的なアドバイスを提供してください:
- 現状の強みと弱点
- 優先順位の高い改善ポイント
- 具体的なトレーニングプラン（種目、重量、回数、頻度）
- 技術的な改善ポイント
- コンディショニングとリカバリーの推奨事項

## 出力形式
Markdown形式で、以下のセクションを含めてください:
- ## 総合評価
- ## 性格タイプに基づく指導方針
- ## 柔軟性分析と改善提案
- ## 弱点特定と補強種目の推奨
- ## 痛み管理と安全なトレーニング
- ## 技術的分析
- ## 具体的な改善提案
- ## トレーニング推奨事項

専門的な見解を示しながらも、選手が理解しやすい言葉で説明してください。熱血コーチとして、励ましと共に具体的で実践的なアドバイスを提供してください。
`;

    // Gemini APIへのリクエスト
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      analysis: text,
    });
  } catch (error) {
    console.error("Error in analyze route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "分析処理中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
