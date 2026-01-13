"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const [formData, setFormData] = useState({
    // 基本情報
    name: "",
    email: "",
    gradeAge: "",
    gender: "",
    experience: "",
    mbti: "",
    height: "",
    weight: "",
    
    // 生活習慣・食事
    sleepTime: "",
    mealStaple: "普通盛り（拳1つ分）",
    mealMainType: "肉中心",
    mealMainPortion: "手のひらサイズ",
    mealVegetable: "1日1回は食べる",
    mealSoup: "時々飲む",
    mealSupplement: "特に摂取しない",

    // ベスト記録
    PP: "",
    Snatch: "",
    HS: "",
    PSn: "",
    CJ: "",
    HJ: "",
    BSq: "",
    FSq: "",
    DL_S: "",
    DL_J: "",
    RJ: "",
    BS: "",
    BenchPress: "",
    SnatchStand: "",
    CJStand: "",

    // 体力テスト
    standingLongJump: "",
    run50M: "",
    gripRight: "",
    gripLeft: "",
    sitAndReach: "",
    ankleDorsiflexion: "",
    shoulderThoracic: "",
    hamstring: "",

    // コンディション
    injuryPainLocation: "",
    painLevel: "0",
    consultation: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const requestBody = {
        ...formData,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        sleepTime: formData.sleepTime ? Number(formData.sleepTime) : undefined,
        painLevel: Number(formData.painLevel),
        
        // 数値変換
        PP: formData.PP ? Number(formData.PP) : undefined,
        Snatch: formData.Snatch ? Number(formData.Snatch) : undefined,
        HS: formData.HS ? Number(formData.HS) : undefined,
        PSn: formData.PSn ? Number(formData.PSn) : undefined,
        CJ: formData.CJ ? Number(formData.CJ) : undefined,
        HJ: formData.HJ ? Number(formData.HJ) : undefined,
        BSq: formData.BSq ? Number(formData.BSq) : undefined,
        FSq: formData.FSq ? Number(formData.FSq) : undefined,
        DL_S: formData.DL_S ? Number(formData.DL_S) : undefined,
        DL_J: formData.DL_J ? Number(formData.DL_J) : undefined,
        RJ: formData.RJ ? Number(formData.RJ) : undefined,
        BS: formData.BS ? Number(formData.BS) : undefined,
        BenchPress: formData.BenchPress ? Number(formData.BenchPress) : undefined,
        SnatchStand: formData.SnatchStand ? Number(formData.SnatchStand) : undefined,
        CJStand: formData.CJStand ? Number(formData.CJStand) : undefined,
        
        standingLongJump: formData.standingLongJump ? Number(formData.standingLongJump) : undefined,
        run50M: formData.run50M ? Number(formData.run50M) : undefined,
        gripRight: formData.gripRight ? Number(formData.gripRight) : undefined,
        gripLeft: formData.gripLeft ? Number(formData.gripLeft) : undefined,
        sitAndReach: formData.sitAndReach ? Number(formData.sitAndReach) : undefined,
      };

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.analysis);
      } else {
        alert("エラーが発生しました: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl drop-shadow-sm">
            Weightlifting Analysis AI
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            三田村Gemini先生が、あなたの<span className="font-bold text-blue-600">「記録」</span>だけでなく
            <span className="font-bold text-orange-500">「食事・睡眠」</span>までトータルサポートします。
          </p>
        </div>

        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
          <div className="p-8 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* 1. 基本情報 (Blue) */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
                  <span className="text-2xl mr-2">👤</span> 基本情報
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">氏名 <span className="text-red-500">*</span></label>
                    <input type="text" name="name" required className="input-field" value={formData.name} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
                    <input type="email" name="email" required className="input-field" value={formData.email} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">MBTIタイプ (例: ENFP)</label>
                    <input type="text" name="mbti" className="input-field" value={formData.mbti} onChange={handleChange} />
                  </div>
                   <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">学年・年齢</label>
                    <input type="text" name="gradeAge" className="input-field" value={formData.gradeAge} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">性別</label>
                    <select name="gender" className="select-field" value={formData.gender} onChange={handleChange}>
                      <option value="">選択してください</option>
                      <option value="男性">男性</option>
                      <option value="女性">女性</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">競技歴</label>
                    <input type="text" name="experience" className="input-field" value={formData.experience} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">身長 (cm)</label>
                    <input type="number" name="height" className="input-field" value={formData.height} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">体重 (kg)</label>
                    <input type="number" name="weight" className="input-field" value={formData.weight} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* 2. 生活習慣・栄養 (Orange) */}
              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm">
                <h3 className="text-xl font-bold text-orange-800 mb-6 flex items-center">
                  <span className="text-2xl mr-2">🍱</span> 食事・睡眠・コンディション
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">昨晩の睡眠時間 (時間)</label>
                    <div className="flex items-center">
                       <input type="number" step="0.5" name="sleepTime" placeholder="例: 7.5" className="input-field max-w-[150px] mr-2" value={formData.sleepTime} onChange={handleChange} />
                       <span className="text-gray-600">時間</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">🍚 主食 (ご飯の量)</label>
                    <select name="mealStaple" className="select-field" value={formData.mealStaple} onChange={handleChange}>
                      <option value="食べない・かなり少ない">食べない・かなり少ない</option>
                      <option value="小盛り（拳1つ分以下）">小盛り（拳1つ分以下）</option>
                      <option value="普通盛り（拳1つ分）">普通盛り（拳1つ分）</option>
                      <option value="大盛り（拳1.5つ分）">大盛り（拳1.5つ分）</option>
                      <option value="特盛り（拳2つ分以上）">特盛り（拳2つ分以上）</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">🍖 主菜 (おかずの傾向)</label>
                    <select name="mealMainType" className="select-field" value={formData.mealMainType} onChange={handleChange}>
                      <option value="肉中心">肉中心</option>
                      <option value="魚中心">魚中心</option>
                      <option value="卵・大豆製品が多い">卵・大豆製品が多い</option>
                      <option value="揚げ物・加工食品が多い">揚げ物・加工食品が多い</option>
                      <option value="バランスよく食べている">バランスよく食べている</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">🥩 主菜のサイズ</label>
                    <select name="mealMainPortion" className="select-field" value={formData.mealMainPortion} onChange={handleChange}>
                      <option value="手のひらより小さい">手のひらより小さい</option>
                      <option value="手のひらサイズ">手のひらサイズ</option>
                      <option value="手のひらより大きい">手のひらより大きい</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">🥗 副菜 (野菜・海藻)</label>
                    <select name="mealVegetable" className="select-field" value={formData.mealVegetable} onChange={handleChange}>
                      <option value="毎食しっかり食べる">毎食しっかり食べる</option>
                      <option value="1日1回は食べる">1日1回は食べる</option>
                      <option value="ほとんど食べない">ほとんど食べない</option>
                      <option value="ジュース等で済ます">ジュース等で済ます</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">🥛 補食・プロテイン</label>
                    <select name="mealSupplement" className="select-field" value={formData.mealSupplement} onChange={handleChange}>
                      <option value="特に摂取しない">特に摂取しない</option>
                      <option value="練習後にプロテイン">練習後にプロテイン</option>
                      <option value="練習後におにぎり等">練習後におにぎり等</option>
                      <option value="両方とっている">両方とっている</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 mt-4 border-t border-orange-200 pt-4">
                     <label className="block text-sm font-semibold text-gray-700 mb-2">痛みレベル (0〜10)</label>
                     <div className="flex items-center gap-4">
                        <input type="range" name="painLevel" min="0" max="10" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" value={formData.painLevel} onChange={handleChange} />
                        <span className="text-xl font-bold text-red-600 w-12 text-center">{formData.painLevel}</span>
                     </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">痛み・怪我の場所 / 相談内容</label>
                    <textarea name="injuryPainLocation" placeholder="例：右肩が痛い、減量について相談したい" rows={3} className="input-field" value={formData.injuryPainLocation} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* 3. ベスト記録 (Purple) */}
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
                <h3 className="text-xl font-bold text-purple-800 mb-6 flex items-center">
                  <span className="text-2xl mr-2">🏋️</span> ベスト記録 (kg)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* ★ここを修正しました */}
                  {[
                    { label: "PP", name: "PP" },
                    { label: "スナッチ", name: "Snatch" },
                    { label: "HS（入スナッチ）", name: "HS" },
                    { label: "パワースナッチ", name: "PSn" },
                    { label: "C&J", name: "CJ" },
                    { label: "ハイジャーク", name: "HJ" },
                    { label: "バックスクワット", name: "BSq" },
                    { label: "フロントスクワット", name: "FSq" },
                    { label: "デッドリフト(S)", name: "DL_S" },
                    { label: "デッドリフト(J)", name: "DL_J" },
                    { label: "RJ（ラックジャーク）", name: "RJ" },
                    { label: "BS（バランススナッチ）", name: "BS" },
                    { label: "ベンチプレス", name: "BenchPress" },
                    { label: "スナッチ(台)", name: "SnatchStand" },
                    { label: "C&J(台)", name: "CJStand" },
                  ].map((item) => (
                    <div key={item.name}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{item.label}</label>
                      <input type="number" name={item.name} className="input-field text-center" placeholder="kg" value={formData[item.name as keyof typeof formData]} onChange={handleChange} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 4. 体力テスト・その他 (Gray) */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
                   <span className="text-2xl mr-2">🏃</span> 体力テスト・柔軟性
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1">立ち幅跳び(cm)</label>
                       <input type="number" name="standingLongJump" className="input-field" value={formData.standingLongJump} onChange={handleChange} />
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1">50M走(秒)</label>
                       <input type="number" name="run50M" className="input-field" value={formData.run50M} onChange={handleChange} />
                    </div>
                     <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1">握力(右)</label>
                       <input type="number" name="gripRight" className="input-field" value={formData.gripRight} onChange={handleChange} />
                    </div>
                     <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1">握力(左)</label>
                       <input type="number" name="gripLeft" className="input-field" value={formData.gripLeft} onChange={handleChange} />
                    </div>
                     <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1">長座体前屈(cm)</label>
                       <input type="number" name="sitAndReach" className="input-field" value={formData.sitAndReach} onChange={handleChange} />
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1">足首の背屈</label>
                       <select name="ankleDorsiflexion" className="select-field text-sm py-1" value={formData.ankleDorsiflexion} onChange={handleChange}>
                          <option value="">-</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1">肩・胸郭の可動域</label>
                       <select name="shoulderThoracic" className="select-field text-sm py-1" value={formData.shoulderThoracic} onChange={handleChange}>
                          <option value="">-</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-gray-600 mb-1">ハムストリングス</label>
                       <select name="hamstring" className="select-field text-sm py-1" value={formData.hamstring} onChange={handleChange}>
                          <option value="">-</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                       </select>
                    </div>
                 </div>
              </div>

              {/* 送信ボタン */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full py-4 px-6 rounded-xl shadow-lg text-lg font-bold text-white tracking-wide
                    transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"}
                  `}
                >
                  {loading ? "三田村先生が考え中... (分析しています)" : "詳しく分析してもらう"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 結果表示 */}
        {result && (
          <div className="mt-12 bg-white shadow-2xl rounded-3xl overflow-hidden border-t-8 border-indigo-600 animate-fade-in-up">
            <div className="p-8 md:p-12 bg-gradient-to-b from-white to-indigo-50">
              <h2 className="text-3xl font-extrabold text-indigo-900 mb-8 flex items-center border-b-2 border-indigo-100 pb-4">
                <span className="text-4xl mr-3">📝</span> 分析レポート
              </h2>
              <div className="prose prose-lg max-w-none text-gray-800">
                <ReactMarkdown
                  components={{
                    h2: ({ ...props }) => <h2 className="text-2xl font-bold text-indigo-800 mt-10 mb-4 flex items-center bg-indigo-100 p-3 rounded-lg" {...props} />,
                    h3: ({ ...props }) => <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3 border-l-4 border-orange-500 pl-3" {...props} />,
                    strong: ({ ...props }) => <strong className="font-extrabold text-orange-700 bg-orange-50 px-1 rounded" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc pl-6 space-y-2 my-4" {...props} />,
                    li: ({ ...props }) => <li className="pl-1" {...props} />,
                  }}
                >
                  {result}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .input-field {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        .select-field {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          background-color: white;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          outline: none;
        }
        .select-field:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
        }
      `}</style>
    </div>
  );
}