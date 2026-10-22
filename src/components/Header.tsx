import React from 'react';
import { Camera, Scale, UtensilsCrossed, BookOpen, Sparkles, HeartPulse } from 'lucide-react';

export type NavTab = 'scanner' | 'bmi_bmr' | 'diet_plan' | 'food_diary';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  loggedMealsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  loggedMealsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-display">
                  TEMAN SEHAT
                </span>
                <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-800 tracking-wider">
                  ALBAMA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                AI Food Calorie Scanner & Nutrition Hub
              </p>
            </div>
          </button>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'scanner'
                  ? 'bg-white text-emerald-700 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Pemindai Kalori AI</span>
            </button>

            <button
              onClick={() => setActiveTab('bmi_bmr')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'bmi_bmr'
                  ? 'bg-white text-emerald-700 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Kalkulator BMI & BMR</span>
            </button>

            <button
              onClick={() => setActiveTab('diet_plan')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'diet_plan'
                  ? 'bg-white text-emerald-700 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Rencana Menu Diet</span>
            </button>

            <button
              onClick={() => setActiveTab('food_diary')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'food_diary'
                  ? 'bg-white text-emerald-700 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Buku Harian</span>
              {loggedMealsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                  {loggedMealsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Right CTA */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-emerald-50/80 px-2.5 py-1.5 rounded-full border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-emerald-800">Akurasi Standar TKPI & USDA</span>
            </div>

            <button
              onClick={() => setActiveTab('scanner')}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm shadow-emerald-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Scan Foto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden border-t border-slate-100 bg-white px-2 py-1.5 overflow-x-auto scrollbar-none flex items-center justify-around">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[11px] font-semibold transition-colors ${
            activeTab === 'scanner' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-500'
          }`}
        >
          <Camera className="w-4 h-4 mb-0.5" />
          <span>Scanner AI</span>
        </button>

        <button
          onClick={() => setActiveTab('bmi_bmr')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[11px] font-semibold transition-colors ${
            activeTab === 'bmi_bmr' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-500'
          }`}
        >
          <Scale className="w-4 h-4 mb-0.5" />
          <span>BMI & BMR</span>
        </button>

        <button
          onClick={() => setActiveTab('diet_plan')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[11px] font-semibold transition-colors ${
            activeTab === 'diet_plan' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-500'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 mb-0.5" />
          <span>Menu Diet</span>
        </button>

        <button
          onClick={() => setActiveTab('food_diary')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[11px] font-semibold transition-colors relative ${
            activeTab === 'food_diary' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-500'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-4 h-4 mb-0.5" />
            {loggedMealsCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-emerald-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {loggedMealsCount}
              </span>
            )}
          </div>
          <span>Buku Harian</span>
        </button>
      </div>
    </header>
  );
};
