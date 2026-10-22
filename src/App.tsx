/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { HeroScanner } from './components/HeroScanner';
import { HowItWorks } from './components/HowItWorks';
import { FAQSection } from './components/FAQSection';
import { AnalysisResult } from './components/AnalysisResult';
import { BMIBMRCalculator } from './components/BMIBMRCalculator';
import { DietPlanner } from './components/DietPlanner';
import { FoodDiary } from './components/FoodDiary';
import { WebcamModal } from './components/WebcamModal';
import { Footer } from './components/Footer';
import { FoodAnalysisResult, LoggedMeal, HealthScoreGrade } from './types/nutrition';
import { AlertCircle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('scanner');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState<boolean>(false);

  // Diet planner connection from BMI/BMR
  const [plannerCalories, setPlannerCalories] = useState<number>(1800);
  const [plannerWeight, setPlannerWeight] = useState<number>(68);

  // Food Diary persistent state
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>(() => {
    try {
      const saved = localStorage.getItem('albama_logged_meals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('albama_logged_meals', JSON.stringify(loggedMeals));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [loggedMeals]);

  const handleAnalyzeStart = () => {
    setIsAnalyzing(true);
    setErrorMessage(null);
  };

  const handleAnalyzeSuccess = (data: FoodAnalysisResult, imagePreviewData?: string) => {
    setIsAnalyzing(false);
    setAnalysisResult(data);
    setImagePreview(imagePreviewData);
    // Smooth scroll down to analysis result
    setTimeout(() => {
      const resultElem = document.getElementById('analysis-result-section');
      if (resultElem) {
        resultElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleAnalyzeError = (err: string) => {
    setIsAnalyzing(false);
    setErrorMessage(err);
  };

  const handleSaveToDiary = (meal: {
    mealName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    healthScore: HealthScoreGrade;
    imageUrl?: string;
  }) => {
    const newEntry: LoggedMeal = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...meal,
    };
    setLoggedMeals((prev) => [newEntry, ...prev]);
  };

  const handleRemoveLoggedMeal = (id: string) => {
    setLoggedMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearDiary = () => {
    if (window.confirm('Yakin ingin mengosongkan seluruh riwayat makanan hari ini?')) {
      setLoggedMeals([]);
    }
  };

  const handleWebcamCapture = async (base64Image: string) => {
    handleAnalyzeStart();
    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: 'image/jpeg',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        handleAnalyzeSuccess(data.data, base64Image);
      } else {
        handleAnalyzeError(data.error || 'Gagal menganalisis foto kamera.');
      }
    } catch {
      handleAnalyzeError('Terjadi gangguan saat memproses foto kamera.');
    }
  };

  const handleApplyBmiToDiet = (data: {
    bmr: number;
    tdee: number;
    currentWeight: number;
    targetCalories: number;
  }) => {
    setPlannerCalories(data.targetCalories);
    setPlannerWeight(data.currentWeight);
    setActiveTab('diet_plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        loggedMealsCount={loggedMeals.length}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-rose-800 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded-md hover:bg-rose-100 text-rose-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Viewport Content based on activeTab */}
      <main className="flex-1">
        {activeTab === 'scanner' && (
          <>
            {/* 1. Hero Section */}
            <HeroScanner
              onAnalyzeStart={handleAnalyzeStart}
              onAnalyzeSuccess={handleAnalyzeSuccess}
              onAnalyzeError={handleAnalyzeError}
              onOpenLiveCamera={() => setIsWebcamOpen(true)}
              isAnalyzing={isAnalyzing}
            />

            {/* 3. Hasil Analisis (Tampil setelah foto diunggah / dianalisis) */}
            {analysisResult && (
              <div id="analysis-result-section">
                <AnalysisResult
                  initialResult={analysisResult}
                  imagePreview={imagePreview}
                  onSaveToDiary={handleSaveToDiary}
                  onResetScan={() => {
                    setAnalysisResult(null);
                    setImagePreview(undefined);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}

            {/* 2. Cara Kerja (3 Langkah) */}
            <HowItWorks />

            {/* 4. Tanya Jawab (FAQ) Mirip Calsy */}
            <FAQSection />
          </>
        )}

        {/* Menu Perhitungan BMI dan BMR */}
        {activeTab === 'bmi_bmr' && (
          <BMIBMRCalculator onApplyToDietPlan={handleApplyBmiToDiet} />
        )}

        {/* Menu Menentukan Menu Diet Sehat, Berat Badan, dan Kalori yang Dibutuhkan */}
        {activeTab === 'diet_plan' && (
          <DietPlanner
            initialTargetCalories={plannerCalories}
            initialWeight={plannerWeight}
          />
        )}

        {/* Menu Buku Harian Makanan */}
        {activeTab === 'food_diary' && (
          <FoodDiary
            loggedMeals={loggedMeals}
            onRemoveMeal={handleRemoveLoggedMeal}
            onClearDiary={handleClearDiary}
            targetDailyCalories={plannerCalories}
            onGoToScanner={() => {
              setActiveTab('scanner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Live Camera Modal */}
      <WebcamModal
        isOpen={isWebcamOpen}
        onClose={() => setIsWebcamOpen(false)}
        onCapture={handleWebcamCapture}
      />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
