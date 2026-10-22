export type HealthScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface MacroNutrients {
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber: number;   // in grams
  sugar: number;   // in grams
  sodium: number;  // in mg
}

export interface FoodIngredientItem {
  id: string;
  name: string;
  category: 'protein' | 'carbs' | 'vegetable' | 'fat_sauce' | 'snack_drink' | 'other';
  weightGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  xPct?: number; // Pin position X percentage on photo (10-90%)
  yPct?: number; // Pin position Y percentage on photo (10-90%)
  iconEmoji?: string;
}

export interface FoodAnalysisResult {
  foodName: string;
  altName: string;
  totalCalories: number;
  confidenceScore: number;
  confidenceText: string;
  healthScore: HealthScoreGrade;
  healthScoreNumber?: number; // 0 - 100 (e.g. 88/100)
  healthScoreTitle: string;
  healthReason: string;
  novaGroup?: 1 | 2 | 3 | 4;
  novaTitle?: string;
  additivesFound?: string[];
  macros: MacroNutrients;
  items: FoodIngredientItem[];
  dietHighlights: string[];
  nutritionTips: string;
  estimatedServingSize: string;
  imageUrl?: string;
  analyzedAt?: string;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';

export interface BMIBMRResult {
  gender: 'male' | 'female';
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  bmi: number;
  bmiCategory: 'Kurus' | 'Normal' | 'Kelebihan Berat' | 'Obesitas I' | 'Obesitas II';
  bmiCategoryColor: string;
  idealWeightMin: number;
  idealWeightMax: number;
  bmr: number;
  tdee: number;
}

export type DietGoal = 'lose' | 'maintain' | 'gain';
export type DietType = 'seimbang' | 'tinggi_protein' | 'rendah_karbo' | 'ramah_jantung' | 'vegetarian';

export interface MealItem {
  mealType: string;
  time: string;
  title: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: string[];
  prepTips: string;
}

export interface DailyDietPlan {
  planName: string;
  totalCalculatedCalories: number;
  macroDistribution: {
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    waterLiters: number;
  };
  meals: MealItem[];
  healthTips: string[];
}

export interface LoggedMeal {
  id: string;
  timestamp: string;
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthScore: HealthScoreGrade;
  imageUrl?: string;
}
