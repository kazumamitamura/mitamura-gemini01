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

    // 数値として扱う項目（サーバー側でエラーにならないように変換）
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
          
          {/* 1. 基本情報セクション (Blue) */}
          <section className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
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
                <input name="mbti" type="text" placeholder="例: ENFP" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">学年・年齢</label>
                <input name="gradeAge" type="text" placeholder="例: 大学2年生" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">性別</label>
                <select name="gender" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition">
                  <option value="">選択してください</option>
                  <option value="男性">男性</option>
                  <option value="女性">女性</option>
                  <option value="その他">その他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">競技歴</label>
                <input name="experience" type="text" placeholder="例: 3年" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">身長 (cm)</label>
                <input name="height" type="number" placeholder="170" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">体重 (kg)</label>
                <input name="weight" type="number" placeholder="73.0" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
              </div>
            </div>
          </section>

          {/* 2. 生活・食事セクション (Orange) */}
          <section className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            <h2 className="text-xl font-bold text-orange-400 mb-6 flex items-center">
              🍱 食事 & コンディション
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">昨晩の睡眠時間 (時間)</label>
                 <div className="flex items-center">
                   <input name="sleepTime" type="number" step="0.5" placeholder="7.5" 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">主食 (ご飯の量)</label>
                <select name="mealStaple" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition">
                  <option value="普通盛り（拳1つ分）">普通盛り（拳1つ分）</option>
                  <option value="大盛り（拳1.5つ分）">大盛り（拳1.5つ分）</option>
                  <option value="特盛り（拳2つ分以上）">特盛り（拳2つ分以上）</option>
                  <option value="小盛り（拳1つ分以下）">小盛り（拳1つ分以下）</option>
                  <option value="食べない・かなり少ない">食べない・かなり少ない</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">主菜の傾向</label>
                <select name="mealMainType" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition">
                  <option value="肉中心">肉中心</option>
                  <option value="魚中心">魚中心</option>
                  <option value="卵・大豆製品が多い">卵・大豆製品が多い</option>
                  <option value="揚げ物・加工食品が多い">揚げ物・加工食品が多い</option>
                  <option value="バランスよく食べている">バランスよく食べている</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">主菜のサイズ</label>
                <select name="mealMainPortion" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition">
                  <option value="手のひらサイズ">手のひらサイズ</option>
                  <option value="手のひらより小さい">手のひらより小さい</option>
                  <option value="手のひらより大きい">手のひらより大きい</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">副菜 (野菜・海藻)</label>
                <select name="mealVegetable" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition">
                  <option value="1日1回は食べる">1日1回は食べる</option>
                  <option value="毎食しっかり食べる">毎食しっかり食べる</option>
                  <option value="ほとんど食べない">ほとんど食べない</option>
                  <option value="ジュース等で済ます">ジュース等で済ます</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">汁物</label>
                <select name="mealSoup" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition">
                  <option value="時々飲む">時々飲む</option>
                  <option value="毎食飲む">毎食飲む</option>
                  <option value="ほとんど飲まない">ほとんど飲まない</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">補食・プロテイン</label>
                <select name="mealSupplement" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition">
                  <option value="特に摂取しない">特に摂取しない</option>
                  <option value="練習後にプロテイン">練習後にプロテイン</option>
                  <option value="練習後におにぎり等">練習後におにぎり等</option>
                  <option value="両方とっている">両方とっている</option>
                </select>
              </div>
              
              <div className="md:col-span-2 border-t border-slate-700 pt-4 mt-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">痛みレベル (0:なし 〜 10:激痛)</label>
                <div className="flex items-center gap-4">
                   <input name="painLevel" type="range" min="0" max="10" defaultValue="0"
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                   {/* 注: リアルタイム数値表示はReact Stateが必要ですが、シンプルにするため省略 */}
                </div>
              </div>
               <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">怪我・痛みの箇所</label>
                <input name="injuryPainLocation" type="text" placeholder="例: 右肩、左膝など" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" />
              </div>
            </div>
          </section>

          {/* 3. ベスト記録セクション (Cyan) */}
          <section className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
            <h2 className="text-xl font-bold text-cyan-400 mb-6 flex items-center">
              🏆 ベスト記録 (kg)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "PP", name: "PP" },
                { label: "スナッチ", name: "Snatch" },
                { label: "HS (入)", name: "HS" },
                { label: "PSn", name: "PSn" },
                { label: "C&J", name: "CJ" },
                { label: "HJ", name: "HJ" },
                { label: "BSq", name: "BSq" },
                { label: "FSq", name: "FSq" },
                { label: "DL(S)", name: "DL_S" },
                { label: "DL(J)", name: "DL_J" },
                { label: "RJ", name: "RJ" },
                { label: "BS", name: "BS" },
                { label: "ベンチ", name: "BenchPress" },
                { label: "Sn(台)", name: "SnatchStand" },
                { label: "CJ(台)", name: "CJStand" },
              ].map((item) => (
                <div key={item.name}>
                  <label className="block text-xs font-medium text-cyan-200 mb-1 uppercase truncate">{item.label}</label>
                  <input name={item.name} type="number" placeholder="kg" 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition text-center font-mono" />
                </div>
              ))}
            </div>
          </section>

          {/* 4. 体力テスト・柔軟性セクション (Green - New!) */}
          <section className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
             <h2 className="text-xl font-bold text-emerald-400 mb-6 flex items-center">
               🏃 体力テスト & 柔軟性
             </h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                   <label className="block text-xs font-medium text-slate-300 mb-1">立ち幅跳び(cm)</label>
                   <input name="standingLongJump" type="number" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-300 mb-1">50M走(秒)</label>
                   <input name="run50M" type="number" step="0.1" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-300 mb-1">握力(右)</label>
                   <input name="gripRight" type="number" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-300 mb-1">握力(左)</label>
                   <input name="gripLeft" type="number" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-300 mb-1">長座体前屈(cm)</label>
                   <input name="sitAndReach" type="number" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center" />
                </div>
                
                {/* 柔軟性チェック */}
                <div>
                   <label className="block text-xs font-medium text-slate-300 mb-1">足首の背屈</label>
                   <select name="ankleDorsiflexion" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center text-sm">
                      <option value="">-</option>
                      <option value="A">A (良)</option>
                      <option value="B">B (普)</option>
                      <option value="C">C (硬)</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-300 mb-1">肩・胸郭</label>
                   <select name="shoulderThoracic" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center text-sm">
                      <option value="">-</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-300 mb-1">ハムストリング</label>
                   <select name="hamstring" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center text-sm">
                      <option value="">-</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                   </select>
                </div>
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