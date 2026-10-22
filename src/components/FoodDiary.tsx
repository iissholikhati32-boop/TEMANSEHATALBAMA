import React from 'react';
import { LoggedMeal, HealthScoreGrade } from '../types/nutrition';
import { BookOpen, Flame, Trash2, Plus, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

interface FoodDiaryProps {
  loggedMeals: LoggedMeal[];
  onRemoveMeal: (id: string) => void;
  onClearDiary: () => void;
  targetDailyCalories: number;
  onGoToScanner: () => void;
}

export const FoodDiary: React.FC<FoodDiaryProps> = ({
  loggedMeals,
  onRemoveMeal,
  onClearDiary,
  targetDailyCalories = 1800,
  onGoToScanner,
}) => {
  const totalCaloriesConsumed = loggedMeals.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProteinConsumed = loggedMeals.reduce((acc, curr) => acc + curr.protein, 0);
  const totalCarbsConsumed = loggedMeals.reduce((acc, curr) => acc + curr.carbs, 0);
  const totalFatConsumed = loggedMeals.reduce((acc, curr) => acc + curr.fat, 0);

  const remainingCalories = targetDailyCalories - totalCaloriesConsumed;
  const progressPercent = Math.min(100, Math.round((totalCaloriesConsumed / targetDailyCalories) * 100));

  const getScoreBadge = (score: HealthScoreGrade) => {
    switch (score) {
      case 'A':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'B':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'C':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'D':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'E':
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="py-10 sm:py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-100">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Buku Harian Makanan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Catatan Makanan Hari Ini
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pantau asupan kalori dan nutrisi harianmu secara transparan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {loggedMeals.length > 0 && (
            <button
              onClick={onClearDiary}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Kosongkan Catatan
            </button>
          )}

          <button
            onClick={onGoToScanner}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Scan Makanan Baru</span>
          </button>
        </div>
      </div>

      {/* Daily Calorie Budget Tracker */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Anggaran Kalori Hari Ini
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-display mt-0.5">
              {totalCaloriesConsumed}{' '}
              <span className="text-sm font-semibold text-slate-400">
                / {targetDailyCalories} kkal
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sisa Jatah Kalori
            </span>
            <div
              className={`text-2xl sm:text-3xl font-black font-display mt-0.5 ${
                remainingCalories >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {remainingCalories >= 0 ? `+${remainingCalories}` : remainingCalories}{' '}
              <span className="text-xs font-semibold text-slate-400">kkal</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
          <div
            style={{ width: `${progressPercent}%` }}
            className={`h-full rounded-full transition-all duration-500 ${
              remainingCalories >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
        </div>
        <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2">
          <span>0 kkal</span>
          <span>{progressPercent}% dari target</span>
          <span>{targetDailyCalories} kkal</span>
        </div>

        {/* Total Macros Consumed */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="p-2.5 rounded-2xl bg-sky-50/60 border border-sky-100">
            <span className="text-[10px] font-bold text-sky-800 uppercase">Protein</span>
            <div className="text-base font-extrabold text-sky-950">{Math.round(totalProteinConsumed)}g</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-amber-50/60 border border-amber-100">
            <span className="text-[10px] font-bold text-amber-800 uppercase">Karbohidrat</span>
            <div className="text-base font-extrabold text-amber-950">{Math.round(totalCarbsConsumed)}g</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-rose-50/60 border border-rose-100">
            <span className="text-[10px] font-bold text-rose-800 uppercase">Lemak</span>
            <div className="text-base font-extrabold text-rose-950">{Math.round(totalFatConsumed)}g</div>
          </div>
        </div>
      </div>

      {/* Logged Meals List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
          Daftar Makanan yang Dicatat ({loggedMeals.length})
        </h3>

        {loggedMeals.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <BookOpen className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-800 text-base mb-1">Belum Ada Makanan yang Dicatat Hari Ini</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              Gunakan Pemindai Kalori AI untuk memotret makananmu dan simpan ke buku harian ini seketika.
            </p>
            <button
              onClick={onGoToScanner}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <span>Mulai Pindai Makanan Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          loggedMeals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                {meal.imageUrl && (
                  <img
                    src={meal.imageUrl}
                    alt={meal.mealName}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{meal.mealName}</h4>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${getScoreBadge(meal.healthScore)}`}>
                      Grade {meal.healthScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{meal.timestamp}</span>
                    <span>•</span>
                    <span>P: {meal.protein}g</span>
                    <span>•</span>
                    <span>K: {meal.carbs}g</span>
                    <span>•</span>
                    <span>L: {meal.fat}g</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="font-extrabold text-base text-emerald-800 font-display">
                  {meal.calories} <span className="text-xs font-semibold text-slate-400">kkal</span>
                </span>
                <button
                  onClick={() => onRemoveMeal(meal.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Hapus catatan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
