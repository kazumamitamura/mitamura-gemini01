import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 利用可能なモデル一覧を取得する（デバッグ用）
 * 使用方法: node -r ts-node/register lib/list-models.ts
 */
async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY環境変数が設定されていません。");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const models = await genAI.listModels();
    console.log("利用可能なモデル一覧:");
    console.log("====================");
    
    for await (const model of models) {
      console.log(`- ${model.name}`);
      console.log(`  説明: ${model.displayName || "説明なし"}`);
      console.log(`  サポート: ${model.supportedGenerationMethods?.join(", ") || "不明"}`);
      console.log("");
    }
  } catch (error) {
    console.error("モデル一覧の取得に失敗しました:", error);
    process.exit(1);
  }
}

// スクリプトとして実行された場合のみ実行
if (require.main === module) {
  listAvailableModels();
}

export { listAvailableModels };
