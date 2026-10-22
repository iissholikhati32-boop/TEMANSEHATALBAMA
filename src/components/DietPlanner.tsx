import React, { useState, useEffect } from 'react';
import { DietGoal, DietType, DailyDietPlan } from '../types/nutrition';
import {
  UtensilsCrossed,
  Sparkles,
  Flame,
  Droplet,
  Clock,
  Calendar,
  CheckCircle,
  RefreshCw,
  Printer,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Apple,
} from 'lucide-react';

interface DietPlannerProps {
  initialTargetCalories?: number;
  initialWeight?: number;
}

export const DietPlanner: React.FC<DietPlannerProps> = ({
  initialTargetCalories = 1800,
  initialWeight = 68,
}) => {
  const [goal, setGoal] = useState<DietGoal>('lose');
  const [currentWeight, setCurrentWeight] = useState<number>(initialWeight);
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight > 5 ? initialWeight - 5 : 60);
  const [dailyCalories, setDailyCalories] = useState<number>(initialTargetCalories);
  const [dietType, setDietType] = useState<DietType>('seimbang');
  const [allergies, setAllergies] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dietPlan, setDietPlan] = useState<DailyDietPlan | null>(null);

  // Sync when prop updates
  useEffect(() => {
    if (initialTargetCalories) {
      setDailyCalories(initialTargetCalories);
    }
  }, [initialTargetCalories]);

  useEffect(() => {
    if (initialWeight) {
      setCurrentWeight(initialWeight);
      if (goal === 'lose') {
        setTargetWeight(Math.max(40, initialWeight - 5));
      } else if (goal === 'gain') {
        setTargetWeight(initialWeight + 4);
      }
    }
  }, [initialWeight]);

  // Handle Goal Change
  const handleGoalSelect = (newGoal: DietGoal) => {
    setGoal(newGoal);
    if (newGoal === 'lose') {
      setTargetWeight(Math.max(40, currentWeight - 5));
      setDailyCalories(Math.max(1200, dailyCalories > 1800 ? dailyCalories - 400 : 1600));
    } else if (newGoal === 'gain') {
      setTargetWeight(currentWeight + 4);
      setDailyCalories(dailyCalories < 2200 ? dailyCalories + 400 : 2400);
    } else {
      setTargetWeight(currentWeight);
    }
  };

  // Calculation for timeline
  const weightDiff = Math.abs(currentWeight - targetWeight);
  const weeklyRateKg = goal === 'lose' ? 0.5 : goal === 'gain' ? 0.35 : 0;
  const estimatedWeeks = weeklyRateKg > 0 ? Math.ceil(weightDiff / weeklyRateKg) : 0;

  // Generate / Fetch Diet Plan
  const generatePlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCalories: dailyCalories,
          goal,
          dietType,
          allergies: allergies.trim() || undefined,
          currentWeight,
          targetWeight,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setDietPlan(data.data);
      }
    } catch (e) {
      console.error('Failed to generate diet plan:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial auto-generation on mount if not yet generated
  useEffect(() => {
    generatePlan();
  }, [dailyCalories, goal, dietType]);

  const dietTypesList: { id: DietType; name: string; desc: string }[] = [
    {
      id: 'seimbang',
      name: 'Diet Seimbang Nusantara',
      desc: 'Kombinasi sehat karbohidrat kompleks, lauk pauk lokal, dan aneka sayuran',
    },
    {
      id: 'tinggi_protein',
      name: 'Tinggi Protein (Fitness / Fat Loss)',
      desc: 'Optimal untuk pembentukan otot, pembakaran lemak, dan rasa kenyang panjang',
    },
    {
      id: 'rendah_karbo',
      name: 'Rendah Karbohidrat (Low-Carb)',
      desc: 'Membatasi nasi/tepung berlebih, memperbanyak serat sayur dan lemak sehat',
    },
    {
      id: 'ramah_jantung',
      name: 'Ramah Jantung & Rendah Kolesterol',
      desc: 'Bebas santan jenuh, tinggi Omega-3, minim natrium dan kaya antioksidan',
    },
    {
      id: 'vegetarian',
      name: 'Plant-Based / Vegetarian Sehat',
      desc: 'Didominasi tempe, tahu, polong-polongan, jamur, dan sayuran organik',
    },
  ];

  return (
    <div className="py-10 sm:py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-100">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Perencana Menu Gizi Sehat</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Rencana Diet & Target Kalori Harian
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Tentukan target berat badanmu dan nikmati rekomendasi menu lezat ramah kuliner Indonesia yang pas dengan jatah kalorimu.
        </p>
      </div>

      {/* Main Grid: Parameters on Left, Meal Plan on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Goals */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Konfigurasi Target Anda</span>
            <span className="text-xs font-normal text-slate-500">Personalisasi Cepat</span>
          </h3>

          {/* Goal Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Tujuan Diet</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleGoalSelect('lose')}
                className={`py-2.5 px-2 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                  goal === 'lose'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                <span>Turun Berat</span>
              </button>

              <button
                type="button"
                onClick={() => handleGoalSelect('maintain')}
                className={`py-2.5 px-2 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                  goal === 'maintain'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>⚖️ Jaga Berat</span>
              </button>

              <button
                type="button"
                onClick={() => handleGoalSelect('gain')}
                className={`py-2.5 px-2 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                  goal === 'gain'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Naik Otot</span>
              </button>
            </div>
          </div>

          {/* Weight Target & Timeline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Berat Saat Ini</label>
              <div className="relative">
                <input
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 focus:outline-emerald-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">kg</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Berat Badan</label>
              <div className="relative">
                <input
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 focus:outline-emerald-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">kg</span>
              </div>
            </div>
          </div>

          {/* Estimated Timeline Box */}
          {goal !== 'maintain' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs flex items-center gap-3">
              <Calendar className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold text-emerald-950 block">Estimasi Waktu Capaian:</span>
                <span className="text-emerald-800">
                  Target selisih {weightDiff} kg diproyeksikan tercapai dalam ± <strong>{estimatedWeeks} minggu</strong> secara bertahap & sehat.
                </span>
              </div>
            </div>
          )}

          {/* Daily Calorie Target Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
              <span>Target Kalori Harian</span>
              <span className="font-mono text-base font-extrabold text-emerald-700">
                {dailyCalories} kkal
              </span>
            </div>
            <input
              type="range"
              min="1200"
              max="3500"
              step="50"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1200 kkal (Defisit Tinggi)</span>
              <span>2000 kkal (Standar)</span>
              <span>3500 kkal (Bulking)</span>
            </div>
          </div>

          {/* Diet Type Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Pola Makan / Tipe Diet</label>
            <div className="space-y-1.5">
              {dietTypesList.map((dt) => {
                const isSelected = dietType === dt.id;
                return (
                  <button
                    key={dt.id}
                    type="button"
                    onClick={() => setDietType(dt.id)}
                    className={`w-full text-left p-3 rounded-2xl border text-xs transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{dt.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{dt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergies / Restrictions */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Alergi / Makanan yang Dihindari (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Udang, kacang tanah, susu sapi, santan pekat..."
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-emerald-500"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePlan}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Meracik Menu Diet AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Perbarui / Buat Menu Diet AI</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Generated Meal Plan */}
        <div className="lg:col-span-7 space-y-6">
          {dietPlan && (
            <>
              {/* Daily Target Summary Card */}
              <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-7 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                      Rancangan Nutrisi Harian Anda
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                      {dietPlan.planName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-emerald-200 block">Total Rencana:</span>
                    <span className="text-3xl font-black font-display">
                      {dietPlan.totalCalculatedCalories} <span className="text-sm font-semibold">kkal</span>
                    </span>
                  </div>
                </div>

                {/* Macro Target Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/15 text-center">
                  <div className="bg-white/10 rounded-2xl p-2.5">
                    <span className="text-[10px] text-emerald-200 block">Target Protein</span>
                    <span className="text-lg font-black">{dietPlan.macroDistribution.proteinGrams}g</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-2.5">
                    <span className="text-[10px] text-emerald-200 block">Target Karbo</span>
                    <span className="text-lg font-black">{dietPlan.macroDistribution.carbsGrams}g</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-2.5">
                    <span className="text-[10px] text-emerald-200 block">Target Lemak</span>
                    <span className="text-lg font-black">{dietPlan.macroDistribution.fatGrams}g</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-2.5">
                    <span className="text-[10px] text-emerald-200 block flex items-center justify-center gap-1">
                      <Droplet className="w-3 h-3 text-sky-300" /> Air Putih
                    </span>
                    <span className="text-lg font-black">{dietPlan.macroDistribution.waterLiters}L</span>
                  </div>
                </div>
              </div>

              {/* 4 Meals Schedule (Sarapan, Siang, Snack, Malam) */}
              <div className="space-y-4">
                {dietPlan.meals.map((meal, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          {meal.mealType}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {meal.time}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-900 font-display">
                          {meal.calories} <span className="text-xs font-semibold text-slate-400">kkal</span>
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2 font-display">
                      {meal.title}
                    </h4>

                    {/* Ingredients List */}
                    <div className="bg-slate-50 rounded-2xl p-3.5 mb-3">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Bahan & Porsi:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                        {meal.ingredients.map((ing, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Preparation / Nutrition Tip */}
                    <p className="text-xs text-slate-600 italic border-l-2 border-emerald-400 pl-3 py-0.5">
                      💡 {meal.prepTips}
                    </p>

                    {/* Meal Macro Chips */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>Protein: <strong className="text-slate-800">{meal.macros.protein}g</strong></span>
                      <span>•</span>
                      <span>Karbo: <strong className="text-slate-800">{meal.macros.carbs}g</strong></span>
                      <span>•</span>
                      <span>Lemak: <strong className="text-slate-800">{meal.macros.fat}g</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* General Health & Discipline Tips */}
              {dietPlan.healthTips && dietPlan.healthTips.length > 0 && (
                <div className="bg-emerald-50/60 rounded-3xl p-6 border border-emerald-200/80">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Apple className="w-4 h-4 text-emerald-600" />
                    Kunci Sukses Menjalani Diet Sehat Albama:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-900">
                    {dietPlan.healthTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
