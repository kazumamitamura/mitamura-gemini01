import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Google Generative AI SDKの初期化
 * APIキーは環境変数 GEMINI_API_KEY から読み込む
 */
export function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY環境変数が設定されていません。.env.localファイルにGEMINI_API_KEYを追加してください。"
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

/**
 * Geminiモデルのインスタンスを取得
 */
export function getGeminiModel(modelName: string = "gemini-1.5-pro") {
  const genAI = initializeGemini();
  return genAI.getGenerativeModel({ model: modelName });
}
