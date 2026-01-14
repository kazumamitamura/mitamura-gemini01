import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { marked } from "marked";

// スプレッドシートからデータを取得する関数
async function getAnalysisData(id: string) {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    // 全データを読み込んで、IDが一致する行を探す
    const rows = await sheet.getRows();
    const targetRow = rows.find(row => row.get("ID") === id);

    if (!targetRow) return null;

    // 必要なデータを取り出す
    const markdown = targetRow.get("AIアドバイス");
    const name = targetRow.get("氏名");
    const snatch = targetRow.get("スナッチ");
    const cj = targetRow.get("C&J");
    const date = targetRow.get("日時");

    // MarkdownをHTMLに変換
    const htmlContent = await marked.parse(markdown);

    return { name, snatch, cj, date, htmlContent };
  } catch (error) {
    console.error("Data fetch error:", error);
    return null;
  }
}

export default async function ResultPage({ params }: { params: { id: string } }) {
  const data = await getAnalysisData(params.id);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">データが見つかりません</h1>
          <p className="text-slate-400">URLが間違っているか、データが削除された可能性があります。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans py-10 px-4">
      <div className="max-w-3xl mx-auto bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        
        {/* ヘッダー部分 */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <p className="text-indigo-200 text-sm mb-1">{data.date} 分析完了</p>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            🏋️ {data.name} 選手の分析レポート
          </h1>
        </div>

        {/* 記録サマリー */}
        <div className="grid grid-cols-2 border-b border-slate-700 bg-slate-800/50">
          <div className="p-4 text-center border-r border-slate-700">
            <p className="text-slate-400 text-xs uppercase tracking-wider">Snatch</p>
            <p className="text-2xl font-bold text-cyan-400">{data.snatch || "-"} <span className="text-sm text-slate-500">kg</span></p>
          </div>
          <div className="p-4 text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wider">C&J</p>
            <p className="text-2xl font-bold text-orange-400">{data.cj || "-"} <span className="text-sm text-slate-500">kg</span></p>
          </div>
        </div>

        {/* 本文（AIアドバイス） */}
        <div className="p-8 prose prose-invert prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: data.htmlContent }} />
        </div>

        {/* フッター */}
        <div className="bg-slate-900 p-6 text-center border-t border-slate-700">
          <a href="/" className="inline-block px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">
            📝 新しい記録を入力する
          </a>
        </div>
      </div>
    </div>
  );
}