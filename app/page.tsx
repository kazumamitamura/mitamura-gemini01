"use client";

import { useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult("");

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // 数値として扱う項目（これを変換しないとエラーになるため）
    const numericFields = [
      "height", "weight", "sleepTime", "painLevel",
      "PP", "Snatch", "HS", "PSn", "CJ", "HJ", "BSq", "FSq",
      "DL_S", "DL_J", "RJ", "BS", "BenchPress", "SnatchStand", "CJStand",
      "standingLongJump", "run50M", "gripRight", "gripLeft", "sitAndReach"
    ];

    const payload: any = { ...data };
    
    // 数値変換処理
    numericFields.forEach((field) => {
      if (payload[field]) {
        payload[field] = Number(payload[field]);
      }
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      if (json.success) {
        // AIの分析結果（テキスト）をセット
        setResult(json.analysis);
      } else {
        setResult("❌ エラー: " + json.error);
      }
    } catch (error) {
      setResult("❌ 通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* ヘッダー */}
      <div className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              🏋️ AI Weightlifting Coach
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Powered by Gemini Pro
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <p className="text-slate-300">
            日々の記録とコンディションを入力してください。<br/>
            <span className="text-indigo-400 font-bold">AI専属コーチ</span>が、あなたに最適なアドバイスを即座に提供します。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. 基本情報セクション */}
          <section className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <h2 className="text-xl font-bold text-indigo-400 mb-6 flex items-center">
              👤 選手プロフィール
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">氏名 <span className="text-rose-500">*</span></label>
                <input required name="name" type="text" placeholder="三田村 太郎" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email <span className="text-rose-500">*</span></label>
                <input required name="email" type="email" placeholder="student@example.com" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">MBTIタイプ</label>
                <input name="mbti" type="text" placeholder="例: ENFP, ISTJ" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">学年・年齢</label>
                <input name="gradeAge" type="text" placeholder="例: 大学2年生" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
            </div>
          </section>

          {/* 2. 生活・食事セクション */}
          <section className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            <h2 className="text-xl font-bold text-orange-400 mb-6 flex items-center">
              🍱 食事 & コンディション
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">昨晩の睡眠時間</label>
                 <div className="flex items-center">
                   <input name="sleepTime" type="number" step="0.5" placeholder="7.5" 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" />
                   <span className="ml-2 text-slate-400">時間</span>
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">主食の量</label>
                <select name="mealStaple" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition">
                  <option value="普通盛り（拳1つ分）">普通盛り（拳1つ分）</option>
                  <option value="大盛り（拳1.5つ分）">大盛り（拳1.5つ分）</option>
                  <option value="特盛り（拳2つ分以上）">特盛り（拳2つ分以上）</option>
                  <option value="小盛り（拳1つ分以下）">小盛り（拳1つ分以下）</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">痛みレベル (0-10)</label>
                <input name="painLevel" type="number" min="0" max="10" defaultValue="0"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">怪我・痛みの箇所</label>
                <input name="injuryPainLocation" type="text" placeholder="特になし" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" />
              </div>
            </div>
          </section>

          {/* 3. 記録入力セクション */}
          <section className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
            <h2 className="text-xl font-bold text-cyan-400 mb-6 flex items-center">
              🏆 ベスト記録 (kg)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 主要種目 */}
              {[
                { label: "スナッチ", name: "Snatch" },
                { label: "C&J", name: "CJ" },
                { label: "BSq", name: "BSq" },
                { label: "FSq", name: "FSq" }
              ].map((item) => (
                <div key={item.name}>
                  <label className="block text-xs font-medium text-cyan-200 mb-1 uppercase">{item.label}</label>
                  <input name={item.name} type="number" placeholder="kg" 
                    className="w-full bg-slate-900 border border-cyan-900/50 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition text-center font-mono text-lg" />
                </div>
              ))}
              
              {/* その他の種目 */}
              {[
                "PP", "HS", "PSn", "HJ", "DL_S", "DL_J", "RJ", "BS", "BenchPress", "SnatchStand", "CJStand"
              ].map((item) => (
                <div key={item}>
                  <label className="block text-xs font-medium text-slate-500 mb-1 uppercase truncate">{item}</label>
                  <input name={item} type="number" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 focus:border-cyan-500 outline-none transition text-center" />
                </div>
              ))}
            </div>
          </section>

          {/* 相談 */}
          <section className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-pink-500"></div>
             <h2 className="text-xl font-bold text-pink-400 mb-4">💬 コーチへの相談</h2>
             <textarea name="consultation" rows={3} placeholder="技術的な悩みや、次の目標について..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none transition"></textarea>
          </section>

          {/* 送信ボタン */}
          <div className="sticky bottom-6 z-10">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-2xl transition duration-300 transform hover:scale-[1.01] active:scale-[0.99]
                ${loading 
                  ? "bg-slate-600 cursor-not-allowed text-slate-400" 
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AIコーチが分析中...
                </span>
              ) : (
                "🚀 分析レポートを作成する"
              )}
            </button>
          </div>

          {/* 結果表示（Markdown対応） */}
          {result && (
            <div className={`mt-10 p-8 rounded-2xl shadow-2xl animate-fade-in ${result.includes("エラー") ? "bg-red-900/30 border border-red-500" : "bg-indigo-900/20 border border-indigo-500/50"}`}>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                📊 分析レポート
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                 {/* ここでMarkdownを綺麗に表示 */}
                 <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          )}

        </form>
      </main>
      
      <footer className="text-center py-8 text-slate-600 text-xs">
        © 2026 Weightlifting AI Lab.
      </footer>
    </div>
  );
}