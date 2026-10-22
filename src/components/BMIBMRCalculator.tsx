import React, { useState, useMemo } from 'react';
import { ActivityLevel, BMIBMRResult } from '../types/nutrition';
import { Scale, Heart, Flame, ArrowRight, Info, CheckCircle, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

interface BMIBMRCalculatorProps {
  onApplyToDietPlan: (data: { bmr: number; tdee: number; currentWeight: number; targetCalories: number }) => void;
}

export const BMIBMRCalculator: React.FC<BMIBMRCalculatorProps> = ({ onApplyToDietPlan }) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(26);
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(68);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  // Activity multipliers
  const activityMultipliers: Record<ActivityLevel, { factor: number; label: string; desc: string }> = {
    sedentary: { factor: 1.2, label: 'Sedentary (Jarang Bergerak)', desc: 'Bekerja di meja, sedikit atau tanpa olahraga rutin' },
    light: { factor: 1.375, label: 'Aktivitas Ringan', desc: 'Olahraga ringan 1 - 3 hari per minggu' },
    moderate: { factor: 1.55, label: 'Aktivitas Sedang', desc: 'Olahraga sedang atau jalan cepat 3 - 5 hari per minggu' },
    very_active: { factor: 1.725, label: 'Sangat Aktif', desc: 'Olahraga intensif 6 - 7 hari per minggu' },
    extra_active: { factor: 1.9, label: 'Ekstra Aktif / Atlet', desc: 'Latihan fisik berat 2x sehari atau pekerja fisik berat' },
  };

  // Calculations
  const results = useMemo(() => {
    // 1. BMI calculation: weight / (height/100)^2
    const hMeter = heightCm / 100;
    const bmiVal = Math.round((weightKg / (hMeter * hMeter)) * 10) / 10;

    // Classification (Standar Kemenkes RI & WHO Asia-Pasifik)
    let category: 'Kurus' | 'Normal' | 'Kelebihan Berat' | 'Obesitas I' | 'Obesitas II' = 'Normal';
    let categoryColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    let gaugePositionPct = 50;

    if (bmiVal < 18.5) {
      category = 'Kurus';
      categoryColor = 'text-sky-700 bg-sky-50 border-sky-200';
      gaugePositionPct = Math.max(5, (bmiVal / 18.5) * 20);
    } else if (bmiVal <= 22.9) {
      category = 'Normal';
      categoryColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      gaugePositionPct = 20 + ((bmiVal - 18.5) / (22.9 - 18.5)) * 25;
    } else if (bmiVal <= 24.9) {
      category = 'Kelebihan Berat';
      categoryColor = 'text-amber-700 bg-amber-50 border-amber-200';
      gaugePositionPct = 45 + ((bmiVal - 23.0) / (24.9 - 23.0)) * 20;
    } else if (bmiVal <= 29.9) {
      category = 'Obesitas I';
      categoryColor = 'text-orange-700 bg-orange-50 border-orange-200';
      gaugePositionPct = 65 + ((bmiVal - 25.0) / (29.9 - 25.0)) * 20;
    } else {
      category = 'Obesitas II';
      categoryColor = 'text-rose-700 bg-rose-50 border-rose-200';
      gaugePositionPct = Math.min(95, 85 + ((bmiVal - 30.0) / 10) * 15);
    }

    // Ideal Weight Range for this height (BMI 18.5 to 22.9)
    const idealMin = Math.round(18.5 * (hMeter * hMeter) * 10) / 10;
    const idealMax = Math.round(22.9 * (hMeter * hMeter) * 10) / 10;

    // 2. BMR via Mifflin-St Jeor formula
    // Male: (10 × W) + (6.25 × H) - (5 × A) + 5
    // Female: (10 × W) + (6.25 × H) - (5 × A) - 161
    let bmrVal = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (gender === 'male') {
      bmrVal += 5;
    } else {
      bmrVal -= 161;
    }
    bmrVal = Math.round(bmrVal);

    // 3. TDEE = BMR * activityMultiplier
    const tdeeVal = Math.round(bmrVal * activityMultipliers[activityLevel].factor);

    // Targets
    const cutCalories = tdeeVal - 450;
    const maintainCalories = tdeeVal;
    const bulkCalories = tdeeVal + 350;

    return {
      bmi: bmiVal,
      category,
      categoryColor,
      gaugePositionPct,
      idealMin,
      idealMax,
      bmr: bmrVal,
      tdee: tdeeVal,
      cutCalories,
      maintainCalories,
      bulkCalories,
    };
  }, [gender, age, heightCm, weightKg, activityLevel]);

  return (
    <div className="py-10 sm:py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-100">
          <Scale className="w-3.5 h-3.5" />
          <span>Kalkulator Klinis Tubuh</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Perhitungan BMI & BMR Presisi
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Ketahui indeks massa tubuh standar Kemenkes RI, kalori metabolisme dasar (BMR), dan total pengeluaran energi harian (TDEE).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span>Masukkan Data Fisik Anda</span>
          </h3>

          {/* Gender */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Jenis Kelamin</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  gender === 'male'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>👨 Laki-Laki</span>
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  gender === 'female'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>👩 Perempuan</span>
              </button>
            </div>
          </div>

          {/* Age */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Usia</span>
              <span className="font-mono text-emerald-700 font-extrabold">{age} Tahun</span>
            </div>
            <input
              type="range"
              min="14"
              max="90"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Height & Weight Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tinggi Badan</label>
              <div className="relative">
                <input
                  type="number"
                  min="100"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Math.max(80, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-emerald-500 bg-slate-50/50"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">
                  cm
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Berat Badan</label>
              <div className="relative">
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Math.max(25, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-emerald-500 bg-slate-50/50"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">
                  kg
                </span>
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Tingkat Aktivitas Fisik Sehari-hari
            </label>
            <div className="space-y-2">
              {(Object.keys(activityMultipliers) as ActivityLevel[]).map((level) => {
                const item = activityMultipliers[level];
                const isSelected = activityLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setActivityLevel(level)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all text-xs flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{item.label}</span>
                      <span className="text-[11px] text-slate-500">{item.desc}</span>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Section: Results Cards */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. BMI Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-600" />
                Body Mass Index (BMI)
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${results.categoryColor}`}>
                {results.category}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 font-display">
                {results.bmi}
              </span>
              <span className="text-sm text-slate-500 font-medium">kg/m² (Standar Asia-Pasifik)</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="relative pt-6 pb-2">
              {/* Pointer Marker */}
              <div
                style={{ left: `${results.gaugePositionPct}%` }}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
              >
                <span className="text-[10px] font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded-md shadow-xs">
                  {results.bmi}
                </span>
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-900"></div>
              </div>

              {/* Gradient Track */}
              <div className="h-3.5 w-full rounded-full overflow-hidden flex shadow-inner">
                <div className="w-[20%] bg-sky-400" title="Kurus (< 18.5)"></div>
                <div className="w-[25%] bg-emerald-500" title="Normal (18.5 - 22.9)"></div>
                <div className="w-[20%] bg-amber-400" title="Kelebihan (23.0 - 24.9)"></div>
                <div className="w-[20%] bg-orange-500" title="Obesitas I (25.0 - 29.9)"></div>
                <div className="w-[15%] bg-rose-500" title="Obesitas II (>= 30.0)"></div>
              </div>

              {/* Labels */}
              <div className="flex justify-between text-[10px] font-semibold text-slate-500 mt-2">
                <span>&lt; 18.5 Kurus</span>
                <span>18.5 - 22.9 Normal</span>
                <span>23 - 24.9 Over</span>
                <span>25+ Obesitas</span>
              </div>
            </div>

            {/* Ideal Weight Box */}
            <div className="mt-5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-emerald-950 block">Berat Badan Ideal Anda:</span>
                <span className="text-emerald-800">
                  {results.idealMin} kg — {results.idealMax} kg (untuk tinggi {heightCm} cm)
                </span>
              </div>
              <div className="text-right">
                {weightKg >= results.idealMin && weightKg <= results.idealMax ? (
                  <span className="font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                    ✓ Sudah Ideal
                  </span>
                ) : weightKg > results.idealMax ? (
                  <span className="font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-lg">
                    Turunkan ± {Math.round((weightKg - results.idealMax) * 10) / 10} kg
                  </span>
                ) : (
                  <span className="font-bold text-sky-700 bg-sky-100/80 px-2.5 py-1 rounded-lg">
                    Tambahkan ± {Math.round((results.idealMin - weightKg) * 10) / 10} kg
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2. BMR & TDEE Dual Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* BMR */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-2">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                BMR (Mifflin-St Jeor)
              </span>
              <div className="text-3xl font-black text-slate-900 font-display">
                {results.bmr} <span className="text-xs font-semibold text-slate-400">kkal/hari</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Energi minimal yang dibakar organ vital tubuh (jantung, otak, paru-paru) saat istirahat total 24 jam.
              </p>
            </div>

            {/* TDEE */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-2">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                TDEE (Total Energi)
              </span>
              <div className="text-3xl font-black text-emerald-700 font-display">
                {results.tdee} <span className="text-xs font-semibold text-slate-400">kkal/hari</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Total kalori yang Anda bakar per hari termasuk aktivitas fisik harian. (Kalori pemeliharaan/maintenance).
              </p>
            </div>
          </div>

          {/* 3. Target Kalori Harian Sesuai Goals */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Target Kalori Sesuai Tujuan Anda
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {/* Fat Loss */}
              <button
                onClick={() =>
                  onApplyToDietPlan({
                    bmr: results.bmr,
                    tdee: results.tdee,
                    currentWeight: weightKg,
                    targetCalories: results.cutCalories,
                  })
                }
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-left border border-white/10 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-300 mb-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Turun Berat Badan</span>
                </div>
                <div className="text-2xl font-black font-display">{results.cutCalories}</div>
                <span className="text-[11px] text-slate-300">kkal/hari (-450 kkal defisit)</span>
              </button>

              {/* Maintenance */}
              <button
                onClick={() =>
                  onApplyToDietPlan({
                    bmr: results.bmr,
                    tdee: results.tdee,
                    currentWeight: weightKg,
                    targetCalories: results.maintainCalories,
                  })
                }
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-left border border-white/10 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-sky-300 mb-1">
                  <span>⚖️ Jaga Berat Badan</span>
                </div>
                <div className="text-2xl font-black font-display">{results.maintainCalories}</div>
                <span className="text-[11px] text-slate-300">kkal/hari (Maintenance)</span>
              </button>

              {/* Muscle Gain */}
              <button
                onClick={() =>
                  onApplyToDietPlan({
                    bmr: results.bmr,
                    tdee: results.tdee,
                    currentWeight: weightKg,
                    targetCalories: results.bulkCalories,
                  })
                }
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-left border border-white/10 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-amber-300 mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Naik Massa Otot</span>
                </div>
                <div className="text-2xl font-black font-display">{results.bulkCalories}</div>
                <span className="text-[11px] text-slate-300">kkal/hari (+350 kkal surplus)</span>
              </button>
            </div>

            <button
              onClick={() =>
                onApplyToDietPlan({
                  bmr: results.bmr,
                  tdee: results.tdee,
                  currentWeight: weightKg,
                  targetCalories: results.cutCalories,
                })
              }
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
            >
              <span>Terapkan Angka Ini ke Perencana Menu Diet Sehat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
