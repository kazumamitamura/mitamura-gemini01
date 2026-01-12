"use client";

import { useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";

const MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

const GENDER_OPTIONS = ["男性", "女性", "その他"];

const FLEXIBILITY_OPTIONS = ["A", "B", "C"];

// 食事データの選択肢
const MEAL_STAPLE_OPTIONS = [
  "小盛り（少なめ）",
  "普通",
  "大盛り（多め）",
  "おかわりする",
];

const MEAL_MAIN_TYPE_OPTIONS = [
  "肉中心",
  "魚中心",
  "揚げ物が多い",
  "蒸し・煮物中心",
  "バランス型",
];

const MEAL_MAIN_PORTION_OPTIONS = [
  "手のひらサイズ（小）",
  "手のひらサイズ（中）",
  "手のひらサイズ（大）",
  "手のひらより大きい",
];

const MEAL_VEGETABLE_OPTIONS = [
  "毎食食べる",
  "1日2回",
  "1日1回",
  "ほとんど食べない",
];

const MEAL_SOUP_OPTIONS = [
  "毎食食べる",
  "1日1-2回",
  "時々",
  "ほとんど飲まない",
];

const MEAL_SUPPLEMENT_OPTIONS = [
  "プロテインを毎日飲む",
  "プロテインを時々飲む",
  "補食（おにぎり等）を活用",
  "特に取っていない",
];

interface FormData {
  // 基本情報
  name: string;
  email: string;
  // 身体データ
  gradeAge: string;
  gender: string;
  experience: string;
  mbti: string;
  height: string;
  weight: string;
  // 生活習慣（新規追加）
  sleepTime: string;
  mealStaple: string;
  mealMainType: string;
  mealMainPortion: string;
  mealVegetable: string;
  mealSoup: string;
  mealSupplement: string;
  // ベスト記録 (kg)
  PP: string;
  Snatch: string;
  HS: string;
  PSn: string;
  CJ: string;
  HJ: string;
  BSq: string;
  FSq: string;
  DL_S: string;
  DL_J: string;
  RJ: string;
  BS: string;
  BenchPress: string;
  SnatchStand: string;
  CJStand: string;
  // 体力テスト
  standingLongJump: string;
  run50M: string;
  gripRight: string;
  gripLeft: string;
  sitAndReach: string;
  ankleDorsiflexion: string;
  shoulderThoracic: string;
  hamstring: string;
  // コンディション
  injuryPainLocation: string;
  painLevel: string;
  // 相談内容
  consultation: string;
}

interface AnalysisResponse {
  success: boolean;
  analysis?: string;
  error?: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    gradeAge: "",
    gender: "",
    experience: "",
    mbti: "",
    height: "",
    weight: "",
    sleepTime: "",
    mealStaple: "",
    mealMainType: "",
    mealMainPortion: "",
    mealVegetable: "",
    mealSoup: "",
    mealSupplement: "",
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
    standingLongJump: "",
    run50M: "",
    gripRight: "",
    gripLeft: "",
    sitAndReach: "",
    ankleDorsiflexion: "",
    shoulderThoracic: "",
    hamstring: "",
    injuryPainLocation: "",
    painLevel: "0",
    consultation: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // 必須フィールドの検証
      if (!formData.name || !formData.email) {
        throw new Error("氏名とメールアドレスは必須です。");
      }

      // 数値フィールドの変換（空文字列は0またはundefinedとして扱う）
      const parseOptionalNumber = (value: string) =>
        value === "" ? undefined : parseFloat(value);

      const requestData = {
        // 基本情報
        name: formData.name,
        email: formData.email,
        // 身体データ
        gradeAge: formData.gradeAge || undefined,
        gender: formData.gender || undefined,
        experience: formData.experience || undefined,
        mbti: formData.mbti || undefined,
        height: parseOptionalNumber(formData.height),
        weight: parseOptionalNumber(formData.weight),
        // 生活習慣
        sleepTime: parseOptionalNumber(formData.sleepTime),
        mealStaple: formData.mealStaple || undefined,
        mealMainType: formData.mealMainType || undefined,
        mealMainPortion: formData.mealMainPortion || undefined,
        mealVegetable: formData.mealVegetable || undefined,
        mealSoup: formData.mealSoup || undefined,
        mealSupplement: formData.mealSupplement || undefined,
        // ベスト記録
        PP: parseOptionalNumber(formData.PP),
        Snatch: parseOptionalNumber(formData.Snatch),
        HS: parseOptionalNumber(formData.HS),
        PSn: parseOptionalNumber(formData.PSn),
        CJ: parseOptionalNumber(formData.CJ),
        HJ: parseOptionalNumber(formData.HJ),
        BSq: parseOptionalNumber(formData.BSq),
        FSq: parseOptionalNumber(formData.FSq),
        DL_S: parseOptionalNumber(formData.DL_S),
        DL_J: parseOptionalNumber(formData.DL_J),
        RJ: parseOptionalNumber(formData.RJ),
        BS: parseOptionalNumber(formData.BS),
        BenchPress: parseOptionalNumber(formData.BenchPress),
        SnatchStand: parseOptionalNumber(formData.SnatchStand),
        CJStand: parseOptionalNumber(formData.CJStand),
        // 体力テスト
        standingLongJump: parseOptionalNumber(formData.standingLongJump),
        run50M: parseOptionalNumber(formData.run50M),
        gripRight: parseOptionalNumber(formData.gripRight),
        gripLeft: parseOptionalNumber(formData.gripLeft),
        sitAndReach: parseOptionalNumber(formData.sitAndReach),
        ankleDorsiflexion: formData.ankleDorsiflexion || undefined,
        shoulderThoracic: formData.shoulderThoracic || undefined,
        hamstring: formData.hamstring || undefined,
        // コンディション
        injuryPainLocation: formData.injuryPainLocation || undefined,
        painLevel: parseFloat(formData.painLevel),
        // 相談内容
        consultation: formData.consultation || undefined,
      };

      // 痛みレベルの検証
      if (
        isNaN(requestData.painLevel) ||
        requestData.painLevel < 0 ||
        requestData.painLevel > 10
      ) {
        throw new Error("痛みレベルは0-10の範囲で入力してください。");
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data: AnalysisResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "分析に失敗しました。");
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期しないエラーが発生しました。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#333333]">
      <header className="border-b border-[#333333] py-8">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Weightlifting Performance Analysis System
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報エリア（青色テーマ） */}
          <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-blue-900">
              基本情報
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  氏名 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  メールアドレス <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>
            </div>
          </section>

          {/* 身体データ */}
          <section className="border-b border-[#333333] pb-8">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-[#333333]">
              身体データ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="gradeAge"
                  className="block text-sm font-medium mb-2"
                >
                  学年・年齢
                </label>
                <input
                  type="text"
                  id="gradeAge"
                  name="gradeAge"
                  value={formData.gradeAge}
                  onChange={handleInputChange}
                  placeholder="例: 大学2年 / 20歳"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium mb-2"
                >
                  性別
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                >
                  <option value="">選択してください</option>
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium mb-2"
                >
                  競技歴
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="例: 3年"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="mbti"
                  className="block text-sm font-medium mb-2"
                >
                  MBTI診断
                </label>
                <select
                  id="mbti"
                  name="mbti"
                  value={formData.mbti}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                >
                  <option value="">選択してください</option>
                  {MBTI_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="height"
                  className="block text-sm font-medium mb-2"
                >
                  身長 (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium mb-2"
                >
                  体重 (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>
            </div>
          </section>

          {/* ベスト記録エリア（紫色テーマ） */}
          <section className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-purple-900">
              ベスト記録 (kg)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div>
                <label
                  htmlFor="PP"
                  className="block text-sm font-medium mb-2"
                >
                  PP
                </label>
                <input
                  type="number"
                  id="PP"
                  name="PP"
                  value={formData.PP}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="Snatch"
                  className="block text-sm font-medium mb-2"
                >
                  Snatch
                </label>
                <input
                  type="number"
                  id="Snatch"
                  name="Snatch"
                  value={formData.Snatch}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label htmlFor="HS" className="block text-sm font-medium mb-2">
                  HS
                </label>
                <input
                  type="number"
                  id="HS"
                  name="HS"
                  value={formData.HS}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="PSn"
                  className="block text-sm font-medium mb-2"
                >
                  PSn
                </label>
                <input
                  type="number"
                  id="PSn"
                  name="PSn"
                  value={formData.PSn}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label htmlFor="CJ" className="block text-sm font-medium mb-2">
                  C&J
                </label>
                <input
                  type="number"
                  id="CJ"
                  name="CJ"
                  value={formData.CJ}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label htmlFor="HJ" className="block text-sm font-medium mb-2">
                  HJ
                </label>
                <input
                  type="number"
                  id="HJ"
                  name="HJ"
                  value={formData.HJ}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="BSq"
                  className="block text-sm font-medium mb-2"
                >
                  BSq
                </label>
                <input
                  type="number"
                  id="BSq"
                  name="BSq"
                  value={formData.BSq}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="FSq"
                  className="block text-sm font-medium mb-2"
                >
                  FSq
                </label>
                <input
                  type="number"
                  id="FSq"
                  name="FSq"
                  value={formData.FSq}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="DL_S"
                  className="block text-sm font-medium mb-2"
                >
                  DL(S)
                </label>
                <input
                  type="number"
                  id="DL_S"
                  name="DL_S"
                  value={formData.DL_S}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="DL_J"
                  className="block text-sm font-medium mb-2"
                >
                  DL(J)
                </label>
                <input
                  type="number"
                  id="DL_J"
                  name="DL_J"
                  value={formData.DL_J}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label htmlFor="RJ" className="block text-sm font-medium mb-2">
                  RJ
                </label>
                <input
                  type="number"
                  id="RJ"
                  name="RJ"
                  value={formData.RJ}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label htmlFor="BS" className="block text-sm font-medium mb-2">
                  BS
                </label>
                <input
                  type="number"
                  id="BS"
                  name="BS"
                  value={formData.BS}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="BenchPress"
                  className="block text-sm font-medium mb-2"
                >
                  Bench Press
                </label>
                <input
                  type="number"
                  id="BenchPress"
                  name="BenchPress"
                  value={formData.BenchPress}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="SnatchStand"
                  className="block text-sm font-medium mb-2"
                >
                  Snatch(台)
                </label>
                <input
                  type="number"
                  id="SnatchStand"
                  name="SnatchStand"
                  value={formData.SnatchStand}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="CJStand"
                  className="block text-sm font-medium mb-2"
                >
                  C&J(台)
                </label>
                <input
                  type="number"
                  id="CJStand"
                  name="CJStand"
                  value={formData.CJStand}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>
            </div>
          </section>

          {/* 体力テスト */}
          <section className="border-b border-[#333333] pb-8">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-[#333333]">
              体力テスト
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="standingLongJump"
                  className="block text-sm font-medium mb-2"
                >
                  立ち幅跳び (cm)
                </label>
                <input
                  type="number"
                  id="standingLongJump"
                  name="standingLongJump"
                  value={formData.standingLongJump}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="run50M"
                  className="block text-sm font-medium mb-2"
                >
                  50M走 (秒)
                </label>
                <input
                  type="number"
                  id="run50M"
                  name="run50M"
                  value={formData.run50M}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="gripRight"
                  className="block text-sm font-medium mb-2"
                >
                  握力(右) (kg)
                </label>
                <input
                  type="number"
                  id="gripRight"
                  name="gripRight"
                  value={formData.gripRight}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="gripLeft"
                  className="block text-sm font-medium mb-2"
                >
                  握力(左) (kg)
                </label>
                <input
                  type="number"
                  id="gripLeft"
                  name="gripLeft"
                  value={formData.gripLeft}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="sitAndReach"
                  className="block text-sm font-medium mb-2"
                >
                  長座体前屈 (cm)
                </label>
                <input
                  type="number"
                  id="sitAndReach"
                  name="sitAndReach"
                  value={formData.sitAndReach}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="ankleDorsiflexion"
                  className="block text-sm font-medium mb-2"
                >
                  足首の背屈
                </label>
                <select
                  id="ankleDorsiflexion"
                  name="ankleDorsiflexion"
                  value={formData.ankleDorsiflexion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                >
                  <option value="">選択してください</option>
                  {FLEXIBILITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="shoulderThoracic"
                  className="block text-sm font-medium mb-2"
                >
                  肩・胸郭の可動域
                </label>
                <select
                  id="shoulderThoracic"
                  name="shoulderThoracic"
                  value={formData.shoulderThoracic}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                >
                  <option value="">選択してください</option>
                  {FLEXIBILITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="hamstring"
                  className="block text-sm font-medium mb-2"
                >
                  ハムストリングス
                </label>
                <select
                  id="hamstring"
                  name="hamstring"
                  value={formData.hamstring}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                >
                  <option value="">選択してください</option>
                  {FLEXIBILITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* コンディション */}
          <section className="border-b border-[#333333] pb-8">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-[#333333]">
              コンディション
            </h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="injuryPainLocation"
                  className="block text-sm font-medium mb-2"
                >
                  怪我・痛みの場所
                </label>
                <input
                  type="text"
                  id="injuryPainLocation"
                  name="injuryPainLocation"
                  value={formData.injuryPainLocation}
                  onChange={handleInputChange}
                  placeholder="例: 右肩、腰など"
                  className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                />
              </div>

              <div>
                <label
                  htmlFor="painLevel"
                  className="block text-sm font-medium mb-2"
                >
                  痛みレベル: <span className="font-bold">{formData.painLevel}</span> / 10
                </label>
                <input
                  type="range"
                  id="painLevel"
                  name="painLevel"
                  value={formData.painLevel}
                  onChange={handleSliderChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#333333]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </section>

          {/* 相談内容 */}
          <section className="border-b border-[#333333] pb-8">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-[#333333]">
              相談内容
            </h2>
            <div>
              <label
                htmlFor="consultation"
                className="block text-sm font-medium mb-2"
              >
                自由記述
              </label>
              <textarea
                id="consultation"
                name="consultation"
                value={formData.consultation}
                onChange={handleInputChange}
                rows={6}
                placeholder="相談したい内容を自由に記述してください..."
                className="w-full px-4 py-2 border border-[#333333] bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#333333] resize-y"
              />
            </div>
          </section>

          {/* 送信ボタン */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-white font-bold text-lg rounded-lg shadow-lg hover:from-blue-700 hover:via-purple-700 hover:to-orange-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? "分析中..." : "Analyze Performance"}
            </button>
          </div>
        </form>

        {error && (
          <section className="mt-12 p-6 border border-red-500 bg-red-50">
            <h2 className="text-xl font-semibold mb-2 text-red-700">エラー</h2>
            <p className="text-red-600">{error}</p>
          </section>
        )}

        {result && result.success && (
          <section className="mt-12 pb-8 border-b border-[#333333]">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-[#333333]">
              分析結果
            </h2>

            {result.analysis && (
              <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-[#333333] prose-p:text-[#333333] prose-strong:text-[#333333] prose-ul:text-[#333333] prose-ol:text-[#333333] prose-li:text-[#333333]">
                <ReactMarkdown>{result.analysis}</ReactMarkdown>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="border-t border-[#333333] py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-sm text-gray-600 text-center">
          <p>Weightlifting Performance Analysis System</p>
        </div>
      </footer>
    </div>
  );
}
