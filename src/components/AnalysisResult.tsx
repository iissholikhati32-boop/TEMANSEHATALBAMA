import React, { useState, useMemo } from 'react';
import {
  FoodAnalysisResult,
  FoodIngredientItem,
  HealthScoreGrade,
} from '../types/nutrition';
import {
  Flame,
  Activity,
  Heart,
  Sliders,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  BookmarkCheck,
  Copy,
  Info,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  Leaf,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface AnalysisResultProps {
  initialResult: FoodAnalysisResult;
  imagePreview?: string;
  onSaveToDiary: (meal: {
    mealName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    healthScore: HealthScoreGrade;
    imageUrl?: string;
  }) => void;
  onResetScan: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  initialResult,
  imagePreview,
  onSaveToDiary,
  onResetScan,
}) => {
  const [items, setItems] = useState<FoodIngredientItem[]>(initialResult.items || []);
  const [foodTitle, setFoodTitle] = useState<string>(initialResult.foodName);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPins, setShowPins] = useState(true);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedToDiary, setSavedToDiary] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [portionScale, setPortionScale] = useState<number>(1.0);

  // Sync foodTitle if initialResult changes
  React.useEffect(() => {
    setFoodTitle(initialResult.foodName);
    setItems(initialResult.items || []);
  }, [initialResult]);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'protein' | 'carbs' | 'vegetable' | 'fat_sauce' | 'snack_drink' | 'other'>('protein');
  const [newItemWeight, setNewItemWeight] = useState(60);
  const [newItemCalories, setNewItemCalories] = useState(90);

  // Quick portion multiplier (0.5x, 1.0x, 1.5x, 2.0x)
  const applyPortionScale = (scale: number) => {
    setPortionScale(scale);
    const originalItems = initialResult.items || [];
    setItems(
      originalItems.map((item) => {
        const newWeight = Math.round(item.weightGrams * scale);
        return {
          ...item,
          weightGrams: newWeight,
          calories: Math.round(item.calories * scale),
          protein: Math.round(item.protein * scale * 10) / 10,
          carbs: Math.round(item.carbs * scale * 10) / 10,
          fat: Math.round(item.fat * scale * 10) / 10,
        };
      })
    );
  };

  // Calculate live dynamic totals based on current items
  const dynamicTotals = useMemo(() => {
    let cal = 0;
    let prot = 0;
    let carbs = 0;
    let fat = 0;
    let totalGrams = 0;

    items.forEach((item) => {
      cal += item.calories;
      prot += item.protein;
      carbs += item.carbs;
      fat += item.fat;
      totalGrams += item.weightGrams;
    });

    const scaleFactor = initialResult.totalCalories > 0 ? cal / initialResult.totalCalories : 1;
    const fiber = Math.round((initialResult.macros.fiber || 5) * scaleFactor * 10) / 10;
    const sugar = Math.round((initialResult.macros.sugar || 4) * scaleFactor * 10) / 10;
    const sodium = Math.round((initialResult.macros.sodium || 450) * scaleFactor);

    // Calculate dynamic health score
    let score: HealthScoreGrade = initialResult.healthScore;
    let numericScore = initialResult.healthScoreNumber || 75;

    if (fat > 35 || cal > 850) {
      score = 'D';
      numericScore = Math.min(numericScore, 45);
    } else if (prot >= 30 && fiber >= 7 && fat <= 20) {
      score = 'A';
      numericScore = Math.max(numericScore, 90);
    } else if (prot >= 20 && fiber >= 5) {
      score = 'B';
      numericScore = Math.max(numericScore, 75);
    } else if (fat > 25) {
      score = 'C';
      numericScore = Math.min(numericScore, 65);
    }

    return {
      calories: Math.round(cal),
      protein: Math.round(prot * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      fiber,
      sugar,
      sodium,
      totalGrams,
      healthScore: score,
      numericScore,
    };
  }, [items, initialResult]);

  // Adjust item portion
  const updateItemGrams = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newWeight = Math.max(5, item.weightGrams + delta);
          const ratio = newWeight / item.weightGrams;
          return {
            ...item,
            weightGrams: newWeight,
            calories: Math.round(item.calories * ratio),
            protein: Math.round(item.protein * ratio * 10) / 10,
            carbs: Math.round(item.carbs * ratio * 10) / 10,
            fat: Math.round(item.fat * ratio * 10) / 10,
          };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const resetToOriginal = () => {
    setItems(initialResult.items || []);
    setPortionScale(1.0);
  };

  const handleAddNewItem = () => {
    if (!newItemName.trim()) return;
    const newItem: FoodIngredientItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      category: newItemCategory,
      weightGrams: Number(newItemWeight) || 50,
      calories: Number(newItemCalories) || 80,
      protein: Math.round((Number(newItemCalories) * 0.15) / 4),
      carbs: Math.round((Number(newItemCalories) * 0.5) / 4),
      fat: Math.round((Number(newItemCalories) * 0.35) / 9),
      description: 'Ditambahkan via koreksi porsi pengguna',
      xPct: 50,
      yPct: 50,
      iconEmoji: '🍽️',
    };
    setItems((prev) => [...prev, newItem]);
    setNewItemName('');
    setShowAddModal(false);
  };

  const handleCopySummary = () => {
    const summaryText = `TEMAN SEHAT ALBAMA — Hasil Analisis Makanan
🍽️ ${foodTitle} (${dynamicTotals.totalGrams}g)
🔥 Total Kalori: ${dynamicTotals.calories} kkal
💪 Protein: ${dynamicTotals.protein}g
🍞 Karbohidrat: ${dynamicTotals.carbs}g
🥑 Lemak: ${dynamicTotals.fat}g
🥗 Serat: ${dynamicTotals.fiber}g
⭐ Health Score: Grade ${dynamicTotals.healthScore} (${dynamicTotals.numericScore}/100)
🔬 Akurasi AI: ${initialResult.confidenceText}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveMeal = () => {
    onSaveToDiary({
      mealName: foodTitle,
      calories: dynamicTotals.calories,
      protein: dynamicTotals.protein,
      carbs: dynamicTotals.carbs,
      fat: dynamicTotals.fat,
      healthScore: dynamicTotals.healthScore,
      imageUrl: imagePreview || initialResult.imageUrl,
    });
    setSavedToDiary(true);
    setTimeout(() => setSavedToDiary(false), 3000);
  };

  const getScoreColor = (score: HealthScoreGrade) => {
    switch (score) {
      case 'A':
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          lightBg: 'bg-emerald-50',
          badgeText: 'Pilihan Sangat Sehat',
          badgeGradient: 'from-emerald-500 to-teal-600',
        };
      case 'B':
        return {
          bg: 'bg-teal-500',
          text: 'text-teal-700',
          border: 'border-teal-200',
          lightBg: 'bg-teal-50',
          badgeText: 'Sehat & Baik',
          badgeGradient: 'from-teal-500 to-emerald-600',
        };
      case 'C':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-700',
          border: 'border-amber-200',
          lightBg: 'bg-amber-50',
          badgeText: 'Cukup Seimbang',
          badgeGradient: 'from-amber-500 to-yellow-600',
        };
      case 'D':
        return {
          bg: 'bg-orange-500',
          text: 'text-orange-700',
          border: 'border-orange-200',
          lightBg: 'bg-orange-50',
          badgeText: 'Kurang Sehat',
          badgeGradient: 'from-orange-500 to-amber-600',
        };
      case 'E':
        return {
          bg: 'bg-rose-500',
          text: 'text-rose-700',
          border: 'border-rose-200',
          lightBg: 'bg-rose-50',
          badgeText: 'Batasi Konsumsi',
          badgeGradient: 'from-rose-500 to-red-600',
        };
    }
  };

  const activeColor = getScoreColor(dynamicTotals.healthScore);

  // Macro calorie shares
  const protCal = dynamicTotals.protein * 4;
  const carbCal = dynamicTotals.carbs * 4;
  const fatCal = dynamicTotals.fat * 9;
  const totalMacroCal = Math.max(1, protCal + carbCal + fatCal);

  const protPct = Math.round((protCal / totalMacroCal) * 100);
  const carbPct = Math.round((carbCal / totalMacroCal) * 100);
  const fatPct = Math.max(0, 100 - protPct - carbPct);

  return (
    <section className="py-8 sm:py-12 bg-[#FBFBFA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Hasil Pemindaian Kalori AI
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Data'}</span>
            </button>

            <button
              onClick={onResetScan}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Pindai Foto Lain</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Food Photo with Calsy-Style Interactive Vision Pins */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Preview Foto Makanan dengan Tag AI Pin Overlay */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md group">
              <div className="aspect-4/3 w-full bg-slate-100 relative overflow-hidden">
                {imagePreview || initialResult.imageUrl ? (
                  <img
                    src={imagePreview || initialResult.imageUrl}
                    alt={initialResult.foodName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    Tidak ada preview foto
                  </div>
                )}

                {/* Dark gradient vignette for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

                {/* Accuracy Badge */}
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 z-10">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Akurasi {initialResult.confidenceText || 'Tinggi (96%)'}</span>
                </div>

                {/* Toggle Show/Hide Pins button */}
                <button
                  type="button"
                  onClick={() => setShowPins(!showPins)}
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 border border-white/10 hover:bg-black/80 transition-colors z-10 cursor-pointer"
                >
                  {showPins ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                  <span>{showPins ? 'Sembunyikan Pin' : 'Tampilkan Pin'}</span>
                </button>

                {/* Interactive AI Vision Pin Overlay (Like Calsy) */}
                {showPins &&
                  items.map((item, idx) => {
                    const x = item.xPct !== undefined ? item.xPct : 20 + (idx * 22) % 65;
                    const y = item.yPct !== undefined ? item.yPct : 25 + (idx * 18) % 60;
                    const isActive = activePinId === item.id;

                    return (
                      <div
                        key={item.id}
                        style={{ left: `${x}%`, top: `${y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin"
                        onMouseEnter={() => setActivePinId(item.id)}
                        onMouseLeave={() => setActivePinId(null)}
                      >
                        {/* Glowing connector dot */}
                        <div className="relative flex items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-60"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white border-2 border-emerald-600 shadow-md"></span>
                        </div>

                        {/* Floating Tooltip Pill */}
                        <div
                          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap px-2.5 py-1 rounded-xl text-[11px] font-bold backdrop-blur-md shadow-lg transition-all ${
                            isActive
                              ? 'bg-slate-900 text-white scale-110 ring-2 ring-emerald-400 z-30'
                              : 'bg-black/75 text-white hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <span>{item.iconEmoji || '🍽️'}</span>
                            <span>{item.name}</span>
                            <span className="text-emerald-300 font-extrabold">• {item.calories} kkal</span>
                          </div>
                          <div className="text-[9px] text-slate-300 font-medium text-center">
                            {item.weightGrams}g ({item.category})
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="p-5">
                {isEditMode ? (
                  <div className="mb-2">
                    <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      Koreksi Nama Makanan:
                    </label>
                    <input
                      type="text"
                      value={foodTitle}
                      onChange={(e) => setFoodTitle(e.target.value)}
                      className="w-full text-base font-bold text-slate-900 px-3 py-1.5 rounded-xl border border-emerald-400 bg-emerald-50/40 focus:outline-emerald-600 font-display"
                    />
                  </div>
                ) : (
                  <h2 className="text-xl font-black text-slate-900 font-display">
                    {foodTitle}
                  </h2>
                )}
                {initialResult.altName && (
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 italic">
                    {initialResult.altName}
                  </p>
                )}

                {/* Diet Highlight Badges */}
                {initialResult.dietHighlights && initialResult.dietHighlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {initialResult.dietHighlights.map((hl, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100"
                      >
                        ✓ {hl}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Health Score Nutri-Score & NOVA Framework Card (Calsy Style) */}
            <div className={`rounded-3xl p-6 border ${activeColor.border} ${activeColor.lightBg} shadow-xs space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Health Score & Kualitas Gizi
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-slate-900 font-display">
                      {dynamicTotals.numericScore}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">/ 100</span>
                  </div>
                </div>

                <div className={`text-center px-4 py-1.5 rounded-2xl bg-gradient-to-r ${activeColor.badgeGradient} text-white shadow-sm`}>
                  <span className="text-xs font-extrabold uppercase tracking-wide block">
                    Grade {dynamicTotals.healthScore}
                  </span>
                  <span className="text-[10px] font-medium opacity-90">
                    {activeColor.badgeText}
                  </span>
                </div>
              </div>

              {/* Nutri-Score Visual Meter */}
              <div className="grid grid-cols-5 gap-1.5">
                {(['A', 'B', 'C', 'D', 'E'] as HealthScoreGrade[]).map((grade) => {
                  const isCurrent = dynamicTotals.healthScore === grade;
                  const colors: Record<HealthScoreGrade, string> = {
                    A: 'bg-emerald-500',
                    B: 'bg-teal-500',
                    C: 'bg-amber-500',
                    D: 'bg-orange-500',
                    E: 'bg-rose-500',
                  };
                  return (
                    <div
                      key={grade}
                      className={`text-center py-2 rounded-xl font-black text-sm transition-all duration-300 ${
                        isCurrent
                          ? `${colors[grade]} text-white scale-105 shadow-md ring-2 ring-white`
                          : 'bg-slate-200/80 text-slate-400 opacity-60'
                      }`}
                    >
                      {grade}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {initialResult.healthReason}
              </p>

              {/* NOVA Food Processing Badge */}
              {initialResult.novaTitle && (
                <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/70 flex items-center gap-2.5 text-xs text-slate-700">
                  <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Klasifikasi Pemrosesan:</span>
                    <span>{initialResult.novaTitle}</span>
                  </div>
                </div>
              )}

              {/* Additives & Clean Quality */}
              {initialResult.additivesFound && initialResult.additivesFound.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                    Cek Bahan & Aditif:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {initialResult.additivesFound.map((add, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-0.5 rounded-md bg-white border border-slate-200/80 text-slate-700 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{add}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutritionist Practical Tip */}
              {initialResult.nutritionTips && (
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Saran Ahli Gizi:</span>
                    <span>{initialResult.nutritionTips}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Save to Diary CTA */}
            <button
              onClick={handleSaveMeal}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                savedToDiary
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20 active:scale-98'
              }`}
            >
              {savedToDiary ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-emerald-300" />
                  <span>Tersimpan di Buku Harian Makanan!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Simpan ke Buku Harian Hari Ini</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Big Calories Card, Macros, Portion Multiplier, & Portion Correction */}
          <div className="lg:col-span-7 space-y-6">
            {/* 2. Kartu Ringkasan Total Kalori Besar di Atas (Gaya Calsy) */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl shadow-emerald-700/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12"></div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                  Total Kalori Makanan
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white">
                  {initialResult.estimatedServingSize || `Porsi Total ± ${dynamicTotals.totalGrams}g`}
                </span>
              </div>

              <div className="flex items-baseline gap-2 my-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight font-display">
                  {dynamicTotals.calories}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-100">
                  kkal
                </span>
              </div>

              <p className="text-xs text-emerald-100/90 max-w-lg mb-6">
                Dihitung dari kombinasi {items.length} elemen piring berdasarkan berat estimasi dan standar gizi laboratorium TKPI & USDA.
              </p>

              {/* Macro Calorie Share Bar */}
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden flex p-0.5">
                  <div
                    style={{ width: `${protPct}%` }}
                    className="h-full bg-sky-300 rounded-l-full transition-all duration-300"
                    title={`Protein: ${protPct}%`}
                  />
                  <div
                    style={{ width: `${carbPct}%` }}
                    className="h-full bg-amber-300 transition-all duration-300"
                    title={`Karbohidrat: ${carbPct}%`}
                  />
                  <div
                    style={{ width: `${fatPct}%` }}
                    className="h-full bg-rose-300 rounded-r-full transition-all duration-300"
                    title={`Lemak: ${fatPct}%`}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-100 pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-300"></span>
                    Protein ({protPct}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                    Karbo ({carbPct}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-300"></span>
                    Lemak ({fatPct}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Portion Multiplier Selector (Calsy Style) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Skala Porsi Cepat:</span>
                <span className="text-[11px] text-slate-500">Sesuaikan seluruh piring sekaligus</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { scale: 0.5, label: '½ Porsi (50%)' },
                  { scale: 1.0, label: '1x Standar' },
                  { scale: 1.5, label: '1.5x Besar' },
                  { scale: 2.0, label: '2x Jumbo' },
                ].map((opt) => (
                  <button
                    key={opt.scale}
                    type="button"
                    onClick={() => applyPortionScale(opt.scale)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      portionScale === opt.scale
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Rincian Makronutrien Visual */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Protein */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-bold">Protein</span>
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-display">
                  {dynamicTotals.protein}
                  <span className="text-xs font-semibold text-slate-400 ml-0.5">g</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-500 font-medium">
                  {Math.round(dynamicTotals.protein * 4)} kkal energi
                </div>
              </div>

              {/* Karbohidrat */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-bold">Karbohidrat</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-display">
                  {dynamicTotals.carbs}
                  <span className="text-xs font-semibold text-slate-400 ml-0.5">g</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-500 font-medium">
                  {Math.round(dynamicTotals.carbs * 4)} kkal energi
                </div>
              </div>

              {/* Lemak */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-bold">Lemak</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-display">
                  {dynamicTotals.fat}
                  <span className="text-xs font-semibold text-slate-400 ml-0.5">g</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-500 font-medium">
                  {Math.round(dynamicTotals.fat * 9)} kkal energi
                </div>
              </div>

              {/* Serat */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-bold">Serat</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-display">
                  {dynamicTotals.fiber}
                  <span className="text-xs font-semibold text-slate-400 ml-0.5">g</span>
                </div>
                <div className="mt-2 text-[10px] text-emerald-700 font-medium">
                  {dynamicTotals.fiber >= 6 ? 'Tinggi Serat 👍' : 'Cukup Serat'}
                </div>
              </div>
            </div>

            {/* Micro / Electrolytes row */}
            <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-500">Gula: </span>
                <span className="font-bold text-slate-900">{dynamicTotals.sugar}g</span>
              </div>
              <div className="h-3 w-px bg-slate-200"></div>
              <div>
                <span className="font-semibold text-slate-500">Natrium/Sodium: </span>
                <span className="font-bold text-slate-900">{dynamicTotals.sodium}mg</span>
              </div>
              <div className="h-3 w-px bg-slate-200"></div>
              <div>
                <span className="font-semibold text-slate-500">Total Berat: </span>
                <span className="font-bold text-slate-900">± {dynamicTotals.totalGrams}g</span>
              </div>
            </div>

            {/* 5. Daftar Rincian Bahan dan Tombol "Koreksi Porsi" */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Rincian Komponen Bahan & Porsi
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEditMode
                      ? 'Sesuaikan gramasi atau tambah lauk untuk mendapatkan hasil 100% presisi.'
                      : 'Komponen isi piring yang diidentifikasi oleh AI.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isEditMode && (
                    <button
                      onClick={resetToOriginal}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Kembalikan takaran semula"
                    >
                      Reset AI
                    </button>
                  )}

                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      isEditMode
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{isEditMode ? 'Selesai Koreksi' : 'Koreksi Porsi'}</span>
                  </button>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="space-y-3">
                {items.map((item) => {
                  const isHovered = activePinId === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setActivePinId(item.id)}
                      onMouseLeave={() => setActivePinId(null)}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isHovered
                          ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400'
                          : 'bg-slate-50/80 border-slate-200/70 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.iconEmoji || '🍽️'}</span>
                          <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        {/* Portion Controls when Edit Mode is active */}
                        {isEditMode ? (
                          <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200">
                            <button
                              onClick={() => updateItemGrams(item.id, -10)}
                              className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs font-bold text-slate-800 w-12 text-center">
                              {item.weightGrams}g
                            </span>
                            <button
                              onClick={() => updateItemGrams(item.id, 10)}
                              className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="font-mono text-xs font-bold text-slate-600 block">
                              {item.weightGrams}g
                            </span>
                          </div>
                        )}

                        {/* Calorie Pill */}
                        <div className="text-right w-20">
                          <span className="font-extrabold text-sm text-emerald-700 block font-display">
                            {item.calories} <span className="text-[10px] font-semibold text-slate-400">kkal</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            P: {item.protein}g • L: {item.fat}g
                          </span>
                        </div>

                        {isEditMode && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus bahan ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Ingredient in Edit Mode */}
              {isEditMode && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  {showAddModal ? (
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                      <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                        Tambah Komponen Makanan Baru
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Nama bahan (misal: Sambal Terasi)"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-emerald-500"
                        />
                        <input
                          type="number"
                          placeholder="Berat (gram)"
                          value={newItemWeight}
                          onChange={(e) => setNewItemWeight(Number(e.target.value))}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-emerald-500"
                        />
                        <input
                          type="number"
                          placeholder="Estimasi Kalori (kkal)"
                          value={newItemCalories}
                          onChange={(e) => setNewItemCalories(Number(e.target.value))}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-emerald-500"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setShowAddModal(false)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleAddNewItem}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
                        >
                          Simpan Bahan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-dashed border-slate-300 text-slate-600 hover:text-emerald-700 hover:border-emerald-400 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Bahan / Lauk Tambahan</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
