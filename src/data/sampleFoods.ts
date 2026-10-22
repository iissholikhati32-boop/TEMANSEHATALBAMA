import { FoodAnalysisResult } from '../types/nutrition';

export interface SampleFoodOption {
  id: string;
  name: string;
  category: string;
  calories: number;
  healthScore: 'A' | 'B' | 'C' | 'D' | 'E';
  emoji: string;
  imageUrl: string;
  analysis: FoodAnalysisResult;
}

export const SAMPLE_FOODS: SampleFoodOption[] = [
  {
    id: 'salad_ayam_panggang',
    name: 'Salad Dada Ayam & Alpukat',
    category: 'Clean Eating / Tinggi Protein',
    calories: 430,
    healthScore: 'A',
    emoji: '🥗',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    analysis: {
      foodName: 'Salad Dada Ayam Panggang & Alpukat Segar',
      altName: 'Grilled Chicken Breast, Avocado, Quinoa & Greens Salad',
      totalCalories: 430,
      confidenceScore: 98,
      confidenceText: 'Sangat Tinggi (98%)',
      healthScore: 'A',
      healthScoreNumber: 94,
      healthScoreTitle: 'Pilihan Sangat Sehat (Nutri-Score A)',
      healthReason: 'Sangat tinggi protein murni tanpa lemak jenuh jahat. Sumber asam lemak tak jenuh tunggal dari alpukat ramah pembuluh darah, disertai serat sayuran hijau segar tinggi klorofil.',
      novaGroup: 1,
      novaTitle: 'NOVA 1 — Makanan Alami / Minim Proses',
      additivesFound: ['Bebas dari pengawet kimia', 'Bebas pemanis buatan', 'Minyak zaitun murni alami'],
      macros: {
        protein: 42,
        carbs: 26,
        fat: 17,
        fiber: 9.8,
        sugar: 3.5,
        sodium: 380,
      },
      items: [
        { id: '1', name: 'Dada Ayam Panggang Herb', category: 'protein', weightGrams: 150, calories: 210, protein: 37, carbs: 0, fat: 5.5, description: 'Dada ayam tanpa kulit dipanggang rempah rosemary', xPct: 52, yPct: 40, iconEmoji: '🍗' },
        { id: '2', name: 'Alpukat Segar Mentega', category: 'fat_sauce', weightGrams: 60, calories: 96, protein: 1.2, carbs: 5.1, fat: 9, description: 'Lemak baik penurun kolesterol LDL', xPct: 28, yPct: 58, iconEmoji: '🥑' },
        { id: '3', name: 'Selada Romaine & Bayam', category: 'vegetable', weightGrams: 100, calories: 20, protein: 1.8, carbs: 3.8, fat: 0.3, description: 'Daun hijau segar tinggi folat & vitamin K', xPct: 75, yPct: 62, iconEmoji: '🥬' },
        { id: '4', name: 'Tomat Ceri & Timun', category: 'vegetable', weightGrams: 75, calories: 18, protein: 0.8, carbs: 3.9, fat: 0.2, description: 'Kaya likopen dan antioksidan', xPct: 35, yPct: 25, iconEmoji: '🍅' },
        { id: '5', name: 'Dressing Minyak Zaitun', category: 'fat_sauce', weightGrams: 20, calories: 86, protein: 0.1, carbs: 1.2, fat: 9.5, description: 'Extra virgin olive oil cold pressed', xPct: 65, yPct: 30, iconEmoji: '🫒' }
      ],
      dietHighlights: ['Sangat Tinggi Protein (42g)', 'Tinggi Serat (9.8g)', 'Rendah Sodium (380mg)', 'Bebas Lemak Trans'],
      nutritionTips: 'Menu ideal untuk defisit kalori, pembentukan massa otot kering, dan menjaga rasa kenyang berjam-jam.',
      estimatedServingSize: '1 Mangkuk Besar (± 405g)',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    }
  },
  {
    id: 'nasi_padang_rendang',
    name: 'Nasi Padang Rendang Daging Komplit',
    category: 'Kuliner Nusantara Populer',
    calories: 685,
    healthScore: 'C',
    emoji: '🍛',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    analysis: {
      foodName: 'Nasi Padang Rendang Sapi Komplit',
      altName: 'Padang Rice with Beef Rendang, Boiled Cassava Leaves, & Green Sambal',
      totalCalories: 685,
      confidenceScore: 95,
      confidenceText: 'Sangat Tinggi (95%)',
      healthScore: 'C',
      healthScoreNumber: 62,
      healthScoreTitle: 'Cukup Seimbang & Padat Energi (Nutri-Score C)',
      healthReason: 'Tinggi protein hewani (34g) dan zat besi dari rendang sapi, serat baik dari daun singkong rebus. Namun memiliki kadar lemak santan dan minyak yang cukup pekat.',
      novaGroup: 2,
      novaTitle: 'NOVA 2 — Olahan Kuliner Tradisional',
      additivesFound: ['Bebas pengawet sintetis', 'Rempah herbal murni', 'Minyak kelapa alami'],
      macros: {
        protein: 34,
        carbs: 78,
        fat: 27,
        fiber: 6.5,
        sugar: 4.2,
        sodium: 780,
      },
      items: [
        { id: '1', name: 'Nasi Putih Pulen Hangat', category: 'carbs', weightGrams: 180, calories: 235, protein: 4.5, carbs: 51.5, fat: 0.6, description: '1 centong piring sedang nasi putih', xPct: 40, yPct: 65, iconEmoji: '🍚' },
        { id: '2', name: 'Rendang Daging Sapi', category: 'protein', weightGrams: 90, calories: 260, protein: 24, carbs: 6, fat: 16, description: 'Daging sapi bumbu rempah kelapa kering asli Minang', xPct: 68, yPct: 42, iconEmoji: '🥩' },
        { id: '3', name: 'Gulai Daun Singkong Rebus', category: 'vegetable', weightGrams: 80, calories: 95, protein: 3.5, carbs: 8.5, fat: 5.5, description: 'Daun singkong khas Minang kaya flavonoid', xPct: 22, yPct: 45, iconEmoji: '🌿' },
        { id: '4', name: 'Sambal Lado Mudo', category: 'fat_sauce', weightGrams: 25, calories: 45, protein: 0.8, carbs: 3.2, fat: 3.5, description: 'Sambal ijo kukus minyak kelapa', xPct: 48, yPct: 28, iconEmoji: '🌶️' },
        { id: '5', name: 'Lalapan Timun Segar', category: 'vegetable', weightGrams: 40, calories: 10, protein: 0.3, carbs: 2.1, fat: 0.1, description: 'Irisan timun penyeimbang pencernaan', xPct: 78, yPct: 70, iconEmoji: '🥒' }
      ],
      dietHighlights: ['Tinggi Protein (34g)', 'Kaya Zat Besi & Zinc', 'Kaya Rempah Herbal Antioksidan'],
      nutritionTips: 'Minta kuah santan dipisah atau kurangi siraman minyak kuah gulai untuk memangkas sekitar 70 kalori.',
      estimatedServingSize: '1 Piring Komplit (± 445g)',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    }
  },
  {
    id: 'salmon_bowl_quinoa',
    name: 'Salmon Panggang & Brokoli Rebus',
    category: 'Sehat Jantung & Fitness',
    calories: 510,
    healthScore: 'A',
    emoji: '🍣',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    analysis: {
      foodName: 'Salmon Panggang dengan Brokoli & Nasi Cokelat',
      altName: 'Pan-seared Salmon Bowl with Steamed Broccoli & Brown Rice',
      totalCalories: 510,
      confidenceScore: 97,
      confidenceText: 'Sangat Tinggi (97%)',
      healthScore: 'A',
      healthScoreNumber: 96,
      healthScoreTitle: 'Pilihan Super Sehat (Nutri-Score A)',
      healthReason: 'Kaya asam lemak Omega-3 rantai panjang (EPA & DHA) yang melindungi sistem kardiovaskular. Karbohidrat lambat serap dari beras merah menjaga stabilitas gula darah.',
      novaGroup: 1,
      novaTitle: 'NOVA 1 — Makanan Alami / Minim Proses',
      additivesFound: ['Bebas dari aditif pangan', 'Bebas gluten', 'Rendah natrium alami'],
      macros: {
        protein: 38,
        carbs: 45,
        fat: 18,
        fiber: 7.5,
        sugar: 2.1,
        sodium: 360,
      },
      items: [
        { id: '1', name: 'Fillet Salmon Panggang', category: 'protein', weightGrams: 140, calories: 250, protein: 29, carbs: 0, fat: 14, description: 'Salmon segar kaya Omega-3 dan Vitamin D', xPct: 50, yPct: 45, iconEmoji: '🐟' },
        { id: '2', name: 'Nasi Beras Cokelat / Merah', category: 'carbs', weightGrams: 140, calories: 165, protein: 3.8, carbs: 35, fat: 1.2, description: 'Beras utuh tinggi vitamin B kompleks', xPct: 25, yPct: 62, iconEmoji: '🍚' },
        { id: '3', name: 'Brokoli & Wortel Kukus', category: 'vegetable', weightGrams: 90, calories: 35, protein: 2.6, carbs: 6.5, fat: 0.4, description: 'Tinggi vitamin C dan sulforaphane anti-kanker', xPct: 75, yPct: 48, iconEmoji: '🥦' },
        { id: '4', name: 'Wijen & Shoyu Rendah Garam', category: 'fat_sauce', weightGrams: 20, calories: 60, protein: 2.1, carbs: 3.5, fat: 3.8, description: 'Sentuhan rasa umami gurih', xPct: 52, yPct: 22, iconEmoji: '🌱' }
      ],
      dietHighlights: ['Kaya Omega-3 Murni', 'Indeks Glikemik Rendah', 'Tinggi Antioksidan', 'Rendah Natrium'],
      nutritionTips: 'Pilihan sempurna untuk menu makan malam pemulihan tubuh dan menjaga kolesterol HDL tetap tinggi.',
      estimatedServingSize: '1 Piring Sehat (± 390g)',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    }
  },
  {
    id: 'gado_gado_komplit',
    name: 'Gado-Gado Komplit Telur & Tahu Tempe',
    category: 'Tradisional Kaya Serat',
    calories: 485,
    healthScore: 'B',
    emoji: '🥜',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    analysis: {
      foodName: 'Gado-Gado Komplit Telur Rebus & Tahu Tempe',
      altName: 'Indonesian Mixed Vegetable Salad with Peanut Sauce, Egg & Tofu',
      totalCalories: 485,
      confidenceScore: 96,
      confidenceText: 'Sangat Tinggi (96%)',
      healthScore: 'B',
      healthScoreNumber: 78,
      healthScoreTitle: 'Sehat & Bernutrisi Tinggi (Nutri-Score B)',
      healthReason: 'Kombinasi sayuran kukus aneka warna melimpah memberikan serat alami. Protein gabungan telur dan fermentasi kedelai (tempe) menyehatkan mikrobioma usus.',
      novaGroup: 2,
      novaTitle: 'NOVA 2 — Olahan Kuliner Tradisional',
      additivesFound: ['Bebas pengawet kimia', 'Gula aren alami', 'Bebas MSG sintetis'],
      macros: {
        protein: 22,
        carbs: 48,
        fat: 23,
        fiber: 8.2,
        sugar: 9.5,
        sodium: 520,
      },
      items: [
        { id: '1', name: 'Sayur Kukus (Kangkung, Tauge, Kacang Panjang)', category: 'vegetable', weightGrams: 180, calories: 55, protein: 3.5, carbs: 11, fat: 0.6, description: 'Sayuran segar kukus kaya serat & folat', xPct: 40, yPct: 48, iconEmoji: '🥗' },
        { id: '2', name: 'Bumbu Saus Kacang Gurih', category: 'fat_sauce', weightGrams: 70, calories: 215, protein: 7.2, carbs: 14.5, fat: 15, description: 'Kacang tanah sangrai dengan gula aren & asam jawa', xPct: 65, yPct: 38, iconEmoji: '🥜' },
        { id: '3', name: 'Telur Ayam Rebus Utuh', category: 'protein', weightGrams: 55, calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, description: 'Telur rebus sumber kolin lengkap', xPct: 22, yPct: 35, iconEmoji: '🥚' },
        { id: '4', name: 'Tahu Kuning & Tempe Kukus', category: 'protein', weightGrams: 80, calories: 105, protein: 8.8, carbs: 5.2, fat: 5.8, description: 'Protein nabati kaya isoflavon kedelai', xPct: 75, yPct: 65, iconEmoji: '🧈' },
        { id: '5', name: 'Kerupuk Emping & Bawang', category: 'snack_drink', weightGrams: 15, calories: 32, protein: 0.4, carbs: 5.2, fat: 1.2, description: 'Garnish renyah tradisional', xPct: 25, yPct: 72, iconEmoji: '🍘' }
      ],
      dietHighlights: ['Tinggi Serat (8.2g)', 'Protein Nabati & Hewani', 'Sayuran Pelindung Usus'],
      nutritionTips: 'Bumbu kacang sangat padat kalori; memakai 75% saus cukup untuk mempertahankan rasa enak sekaligus menghemat 50 kkal.',
      estimatedServingSize: '1 Porsi Komplit (± 400g)',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    }
  },
  {
    id: 'nasi_goreng_telur',
    name: 'Nasi Goreng Spesial Telur & Ayam',
    category: 'Comfort Food Nusantara',
    calories: 590,
    healthScore: 'C',
    emoji: '🍳',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    analysis: {
      foodName: 'Nasi Goreng Spesial Telur Mata Sapi & Ayam Suwir',
      altName: 'Indonesian Fried Rice with Fried Egg & Shredded Chicken',
      totalCalories: 590,
      confidenceScore: 94,
      confidenceText: 'Tinggi (94%)',
      healthScore: 'C',
      healthScoreNumber: 58,
      healthScoreTitle: 'Cukup Seimbang (Nutri-Score C)',
      healthReason: 'Menyediakan energi instan yang tinggi dari karbohidrat nasi dan protein dari telur serta ayam suwir. Perhatikan kadar minyak penggorengan dan kecap manis.',
      novaGroup: 2,
      novaTitle: 'NOVA 2 — Olahan Kuliner Tradisional',
      additivesFound: ['Kecap kedelai hitam', 'Bumbu bawang merah asli'],
      macros: {
        protein: 23,
        carbs: 74,
        fat: 22,
        fiber: 3.2,
        sugar: 6.8,
        sodium: 840,
      },
      items: [
        { id: '1', name: 'Nasi Goreng Bumbu Merah Kecap', category: 'carbs', weightGrams: 200, calories: 340, protein: 6, carbs: 62, fat: 8, description: 'Nasi goreng harum bawang merah, cabai, kecap', xPct: 45, yPct: 62, iconEmoji: '🍚' },
        { id: '2', name: 'Telur Mata Sapi (Ceplok)', category: 'protein', weightGrams: 55, calories: 110, protein: 7, carbs: 0.8, fat: 9, description: 'Telur goreng gurih', xPct: 52, yPct: 35, iconEmoji: '🍳' },
        { id: '3', name: 'Suwiran Daging Ayam', category: 'protein', weightGrams: 50, calories: 85, protein: 9.5, carbs: 1, fat: 4.8, description: 'Ayam ungkep suwir gurih', xPct: 28, yPct: 45, iconEmoji: '🍗' },
        { id: '4', name: 'Acar Mentimun Segar', category: 'vegetable', weightGrams: 40, calories: 15, protein: 0.4, carbs: 3.2, fat: 0.1, description: 'Acar asam manis pelengkap', xPct: 75, yPct: 42, iconEmoji: '🥒' },
        { id: '5', name: 'Kerupuk Udang Renyah', category: 'snack_drink', weightGrams: 15, calories: 40, protein: 0.6, carbs: 7, fat: 1.1, description: 'Kerupuk goreng gurih', xPct: 78, yPct: 75, iconEmoji: '🦐' }
      ],
      dietHighlights: ['Sumber Karbohidrat Aktif', '23g Protein Lengkap', 'Disertai Acar Segar'],
      nutritionTips: 'Minta telur diceplok tanpa minyak berlebih atau pilih telur rebus untuk mengurangi 50 kkal lemak.',
      estimatedServingSize: '1 Porsi Sedang (± 360g)',
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    }
  }
];
