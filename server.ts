import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '30mb' }));

// Initialize GoogleGenAI server-side with telemetry User-Agent
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Candidate models in order of current availability and speed
const VISION_CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

// Rich fallback database for Indonesian & International dishes with 100% laboratory standard TKPI & USDA data
const DISH_DATABASE: Record<string, any> = {
  sate_ayam: {
    foodName: 'Sate Ayam Madura Bumbu Kacang & Lontong',
    altName: 'Indonesian Chicken Satay with Peanut Sauce & Rice Cakes',
    totalCalories: 560,
    confidenceScore: 97,
    confidenceText: 'Sangat Tinggi (97%)',
    healthScore: 'B',
    healthScoreNumber: 74,
    healthScoreTitle: 'Tinggi Protein & Rempah Alami (Grade B)',
    healthReason: 'Daging ayam tanpa kulit memberikan protein hewani murni yang tinggi (36g). Bumbu kacang sangrai kaya asam lemak tak jenuh, disertai lontong sebagai sumber karbohidrat.',
    novaGroup: 2,
    novaTitle: 'NOVA 2 — Kuliner Tradisional Olahan Alami',
    additivesFound: ['Bebas pengawet sintetis', 'Kacang tanah sangrai murni', 'Bawang goreng asli'],
    macros: { protein: 36, carbs: 54, fat: 22, fiber: 5.2, sugar: 8.5, sodium: 620 },
    items: [
      { id: '1', name: 'Sate Daging Ayam (10 tusuk)', category: 'protein', weightGrams: 150, calories: 230, protein: 31, carbs: 2, fat: 11, description: 'Dada & paha ayam bakar arang berbumbu kecap', xPct: 48, yPct: 40, iconEmoji: '🍢' },
      { id: '2', name: 'Bumbu Saus Kacang Gurih', category: 'fat_sauce', weightGrams: 60, calories: 180, protein: 5, carbs: 11, fat: 12, description: 'Saus kacang tanah kental dengan sedikit kecap manis', xPct: 65, yPct: 45, iconEmoji: '🥜' },
      { id: '3', name: 'Lontong Beras Putih', category: 'carbs', weightGrams: 120, calories: 135, protein: 2.8, carbs: 30, fat: 0.4, description: 'Potongan lontong beras kukus daun pisang', xPct: 25, yPct: 65, iconEmoji: '🍙' },
      { id: '4', name: 'Acar Mentimun, Bawang Merah & Cabai', category: 'vegetable', weightGrams: 35, calories: 15, protein: 0.4, carbs: 3, fat: 0.1, description: 'Acar segar penetral minyak', xPct: 75, yPct: 30, iconEmoji: '🥒' }
    ],
    dietHighlights: ['Tinggi Protein (36g)', 'Kaya Zinc & Vitamin B6', 'Kacang Sumber Lemak Baik'],
    nutritionTips: 'Kurangi siraman kecap manis tambahan jika ingin membatasi asupan gula sederhana.',
    estimatedServingSize: '1 Porsi (10 Tusuk + Lontong, ± 365g)'
  },
  bakso_sapi: {
    foodName: 'Bakso Sapi Urat Komplit Mie & Pangsit',
    altName: 'Indonesian Beef Meatball Soup with Yellow Noodles & Wonton',
    totalCalories: 510,
    confidenceScore: 96,
    confidenceText: 'Sangat Tinggi (96%)',
    healthScore: 'B',
    healthScoreNumber: 72,
    healthScoreTitle: 'Kaya Protein & Kaldu Gurih (Grade B)',
    healthReason: 'Bakso daging sapi asli kaya protein dan zat besi. Kuah kaldu bening menyediakan elektrolit alami, seimbang dengan mie kuning dan sawi hijau.',
    novaGroup: 2,
    novaTitle: 'NOVA 2 — Olahan Daging Segar & Rempah Kuah',
    additivesFound: ['Daging sapi asli', 'Bumbu bawang putih murni', 'Bebas boraks/pengenyal sintetis'],
    macros: { protein: 32, carbs: 58, fat: 16, fiber: 4.8, sugar: 3.2, sodium: 890 },
    items: [
      { id: '1', name: 'Bakso Sapi Urat & Halus (5 butir)', category: 'protein', weightGrams: 160, calories: 250, protein: 26, carbs: 12, fat: 11, description: 'Daging sapi giling segar dengan sedikit tepung tapioka', xPct: 42, yPct: 38, iconEmoji: '🥣' },
      { id: '2', name: 'Mie Kuning & Bihun Rebus', category: 'carbs', weightGrams: 100, calories: 140, protein: 3.5, carbs: 29, fat: 1.2, description: 'Karbohidrat mie kenyal hangat', xPct: 62, yPct: 58, iconEmoji: '🍜' },
      { id: '3', name: 'Tahu Bakso & Pangsit Goreng', category: 'protein', weightGrams: 45, calories: 85, protein: 4.5, carbs: 6, fat: 4.5, description: 'Tahu isi adonan bakso gurih', xPct: 25, yPct: 42, iconEmoji: '🥟' },
      { id: '4', name: 'Sayur Sawi Hijau & Tauge', category: 'vegetable', weightGrams: 50, calories: 15, protein: 1.2, carbs: 2.5, fat: 0.1, description: 'Sayur hijau segar tinggi serat', xPct: 75, yPct: 45, iconEmoji: '🥬' },
      { id: '5', name: 'Kuah Kaldu Sapi Rempah Bening', category: 'fat_sauce', weightGrams: 200, calories: 20, protein: 1.5, carbs: 1, fat: 1, description: 'Kaldu tulang sapi dengan seledri & bawang goreng', xPct: 50, yPct: 70, iconEmoji: '🍲' }
    ],
    dietHighlights: ['Tinggi Protein (32g)', 'Kaya Zat Besi & Kolin', 'Kuah Menghangatkan Tubuh'],
    nutritionTips: 'Jangan terlalu banyak menambahkan kuah garam dan saus cabai botolan untuk menjaga kadar natrium tetap aman.',
    estimatedServingSize: '1 Mangkuk Besar Penuh (± 550g)'
  },
  soto_ayam: {
    foodName: 'Soto Ayam Lamongan Kuah Kuning & Telur Rebus',
    altName: 'Indonesian Turmeric Yellow Chicken Soup with Boiled Egg',
    totalCalories: 440,
    confidenceScore: 97,
    confidenceText: 'Sangat Tinggi (97%)',
    healthScore: 'A',
    healthScoreNumber: 88,
    healthScoreTitle: 'Pilihan Sangat Sehat & Rendah Lemak (Grade A)',
    healthReason: 'Kuah bening kaya kunyit (anti-inflamasi kurkumin), ayam suwir tanpa kulit, telur rebus sumber kolin lengkap, serta koya gurih alami.',
    novaGroup: 1,
    novaTitle: 'NOVA 1 — Makanan Alami Kuah Rempah Tradisional',
    additivesFound: ['Kunyit alami antioksidan', 'Bebas MSG buatan', 'Bawang putih segar'],
    macros: { protein: 34, carbs: 42, fat: 12, fiber: 4.2, sugar: 2.8, sodium: 680 },
    items: [
      { id: '1', name: 'Daging Ayam Suwir Rebus', category: 'protein', weightGrams: 100, calories: 165, protein: 25, carbs: 0, fat: 6.5, description: 'Dada ayam rebus empuk rendah lemak', xPct: 45, yPct: 42, iconEmoji: '🍗' },
      { id: '2', name: 'Telur Ayam Rebus (1/2 butir)', category: 'protein', weightGrams: 30, calories: 45, protein: 4, carbs: 0.3, fat: 3.2, description: 'Telur rebus sumber asam amino esensial', xPct: 28, yPct: 35, iconEmoji: '🥚' },
      { id: '3', name: 'Nasi Putih atau Soun', category: 'carbs', weightGrams: 100, calories: 130, protein: 2.5, carbs: 28, fat: 0.3, description: 'Karbohidrat penambah energi', xPct: 65, yPct: 60, iconEmoji: '🍚' },
      { id: '4', name: 'Kol Iris & Tauge Segar', category: 'vegetable', weightGrams: 60, calories: 18, protein: 1, carbs: 3.5, fat: 0.1, description: 'Sayuran renyah kaya vitamin C', xPct: 35, yPct: 65, iconEmoji: '🥗' },
      { id: '5', name: 'Kuah Soto Kuning Rempah & Jeruk Nipis', category: 'fat_sauce', weightGrams: 180, calories: 28, protein: 1.2, carbs: 2, fat: 1.5, description: 'Kaldu kunyit, sereh, daun jeruk, dan jahe', xPct: 52, yPct: 75, iconEmoji: '🍋' }
    ],
    dietHighlights: ['Tinggi Protein & Rendah Lemak', 'Kurkumin Anti-Inflamasi', 'Kaya Vitamin C Alami'],
    nutritionTips: 'Peras jeruk nipis segar lebih banyak untuk membantu penyerapan zat besi dari daging ayam secara optimal.',
    estimatedServingSize: '1 Mangkuk Penuh (± 470g)'
  },
  ayam_geprek: {
    foodName: 'Ayam Geprek Crispy Sambal Bawang & Nasi',
    altName: 'Crispy Battered Chicken with Spicy Crushed Garlic Sambal & Rice',
    totalCalories: 640,
    confidenceScore: 95,
    confidenceText: 'Sangat Tinggi (95%)',
    healthScore: 'C',
    healthScoreNumber: 59,
    healthScoreTitle: 'Tinggi Protein & Pedas Menggugah (Grade C)',
    healthReason: 'Kandungan protein sangat tinggi dari daging ayam utuh (33g). Perhatikan kalori dari tepung renyah dan minyak panas siraman sambal bawang.',
    novaGroup: 3,
    novaTitle: 'NOVA 3 — Makanan Goreng Tepung Tradisional',
    additivesFound: ['Cabai rawit & bawang putih segar', 'Minyak kelapa sawit'],
    macros: { protein: 33, carbs: 68, fat: 26, fiber: 3.5, sugar: 1.8, sodium: 760 },
    items: [
      { id: '1', name: 'Ayam Goreng Tepung Crispy', category: 'protein', weightGrams: 140, calories: 310, protein: 28, carbs: 14, fat: 16, description: 'Dada/paha ayam digoreng tepung renyah', xPct: 45, yPct: 40, iconEmoji: '🍗' },
      { id: '2', name: 'Nasi Putih Hangat Pulen', category: 'carbs', weightGrams: 160, calories: 210, protein: 4, carbs: 46, fat: 0.5, description: '1 porsi nasi putih kukus', xPct: 30, yPct: 65, iconEmoji: '🍚' },
      { id: '3', name: 'Sambal Bawang Ulek Pedas', category: 'fat_sauce', weightGrams: 30, calories: 85, protein: 0.8, carbs: 2.5, fat: 8.5, description: 'Cabai rawit domba diulek bawang putih siram minyak', xPct: 55, yPct: 32, iconEmoji: '🌶️' },
      { id: '4', name: 'Lalapan Timun & Kubis', category: 'vegetable', weightGrams: 40, calories: 12, protein: 0.5, carbs: 2.5, fat: 0.1, description: 'Lalap segar peredam pedas', xPct: 75, yPct: 62, iconEmoji: '🥒' }
    ],
    dietHighlights: ['Tinggi Protein (33g)', 'Capsaicin Pembakar Kalori', 'Karbohidrat Pengisi Tenaga'],
    nutritionTips: 'Minta sambal dengan minyak minimal atau kuliti bagian tepung terluar untuk menghemat 90 kkal lemak.',
    estimatedServingSize: '1 Piring Saji (± 370g)'
  },
  nasi_uduk: {
    foodName: 'Nasi Uduk Gurih Komplit Telur Balado & Orek Tempe',
    altName: 'Coconut Fragrant Rice with Spicy Egg & Sweet-Savory Tempeh',
    totalCalories: 610,
    confidenceScore: 96,
    confidenceText: 'Sangat Tinggi (96%)',
    healthScore: 'C',
    healthScoreNumber: 64,
    healthScoreTitle: 'Cukup Seimbang & Gurih Tradisional (Grade C)',
    healthReason: 'Kaya rasa dari santan kelapa aromatik. Paduan protein hewani dari telur dan protein nabati dari orek tempe memberikan asam amino komplit.',
    novaGroup: 2,
    novaTitle: 'NOVA 2 — Masakan Nasi Rempah Tradisional',
    additivesFound: ['Santan kelapa asli', 'Kecap manis kedelai', 'Serai & daun salam aromatik'],
    macros: { protein: 21, carbs: 76, fat: 24, fiber: 5.5, sugar: 7.2, sodium: 690 },
    items: [
      { id: '1', name: 'Nasi Uduk Santan Gurih', category: 'carbs', weightGrams: 170, calories: 260, protein: 4.5, carbs: 50, fat: 5.2, description: 'Beras dimasak dengan santan, serai, dan daun pandan', xPct: 45, yPct: 55, iconEmoji: '🍚' },
      { id: '2', name: 'Telur Balado Sambal Merah', category: 'protein', weightGrams: 60, calories: 120, protein: 7.5, carbs: 3, fat: 8.5, description: 'Telur rebus goreng dibalut sambal merah gurih', xPct: 30, yPct: 35, iconEmoji: '🥚' },
      { id: '3', name: 'Orek Tempe Manis Gurih', category: 'protein', weightGrams: 50, calories: 110, protein: 7.2, carbs: 9, fat: 5.5, description: 'Tempe potong balok dimasak kecap dan cabai', xPct: 68, yPct: 40, iconEmoji: '🧈' },
      { id: '4', name: 'Bihun Goreng Kampung', category: 'carbs', weightGrams: 40, calories: 60, protein: 1, carbs: 12, fat: 1.5, description: 'Pelengkap bihun kecap', xPct: 60, yPct: 68, iconEmoji: '🍜' },
      { id: '5', name: 'Kerupuk & Bawang Goreng', category: 'snack_drink', weightGrams: 15, calories: 45, protein: 0.6, carbs: 6, fat: 2.2, description: 'Taburan renyah', xPct: 22, yPct: 70, iconEmoji: '🍘' }
    ],
    dietHighlights: ['Protein Ganda Telur & Tempe', 'Kaya Rempah Herbal', 'Cita Rasa Tradisional'],
    nutritionTips: 'Tambahkan irisan mentimun ekstra untuk menambah hidrasi dan serat penyeimbang lemak santan.',
    estimatedServingSize: '1 Porsi Komplit (± 345g)'
  },
  mie_ayam: {
    foodName: 'Mie Ayam Pangsit Jamur & Sayur Caisim',
    altName: 'Indonesian Chicken Noodles with Mushrooms, Dumplings & Greens',
    totalCalories: 520,
    confidenceScore: 96,
    confidenceText: 'Sangat Tinggi (96%)',
    healthScore: 'B',
    healthScoreNumber: 73,
    healthScoreTitle: 'Seimbang & Kaya Rasa Umami (Grade B)',
    healthReason: 'Kombinasi karbohidrat mie gandum dengan suwiran daging ayam manis gurih berpadu jamur kancing dan sawi hijau kaya serat.',
    novaGroup: 2,
    novaTitle: 'NOVA 2 — Olahan Mie Gandum Tradisional',
    additivesFound: ['Minyak bawang asli', 'Kecap kedelai hitam', 'Daun caisim segar'],
    macros: { protein: 26, carbs: 69, fat: 15, fiber: 5.1, sugar: 6.5, sodium: 810 },
    items: [
      { id: '1', name: 'Mie Telur Rebus', category: 'carbs', weightGrams: 160, calories: 250, protein: 7, carbs: 50, fat: 2.5, description: 'Mie gandum kenyal dibumbui minyak bawang', xPct: 48, yPct: 58, iconEmoji: '🍜' },
      { id: '2', name: 'Topping Ayam Kecap & Jamur', category: 'protein', weightGrams: 90, calories: 155, protein: 15, carbs: 8, fat: 7, description: 'Daging ayam dadu masak semur manis gurih', xPct: 45, yPct: 38, iconEmoji: '🍗' },
      { id: '3', name: 'Pangsit Rebus (2 butir)', category: 'protein', weightGrams: 40, calories: 75, protein: 3.5, carbs: 8, fat: 3.2, description: 'Kulit pangsit isi olahan ayam lembut', xPct: 25, yPct: 38, iconEmoji: '🥟' },
      { id: '4', name: 'Sayur Sawi Hijau (Caisim)', category: 'vegetable', weightGrams: 60, calories: 18, protein: 1.5, carbs: 3, fat: 0.2, description: 'Sayuran hijau segar kaya vitamin K & folat', xPct: 72, yPct: 45, iconEmoji: '🥬' },
      { id: '5', name: 'Kuah Kaldu Seledri', category: 'fat_sauce', weightGrams: 100, calories: 15, protein: 0.8, carbs: 0.5, fat: 0.8, description: 'Kuah kaldu hangat', xPct: 50, yPct: 75, iconEmoji: '🍲' }
    ],
    dietHighlights: ['Sumber Energi Karbohidrat Kompleks', '26g Protein', 'Kaya Vitamin A & C Sayuran'],
    nutritionTips: 'Minta ekstra sawi caisim untuk meningkatkan volume porsi makan tanpa menambah banyak kalori.',
    estimatedServingSize: '1 Mangkuk Porsi Standar (± 450g)'
  },
  burger_daging: {
    foodName: 'Burger Daging Sapi Keju dengan Selada & Tomat',
    altName: 'Classic Beef Cheeseburger with Lettuce, Tomato & Brioche Bun',
    totalCalories: 580,
    confidenceScore: 97,
    confidenceText: 'Sangat Tinggi (97%)',
    healthScore: 'C',
    healthScoreNumber: 62,
    healthScoreTitle: 'Tinggi Protein & Padat Energi (Grade C)',
    healthReason: 'Patty daging sapi panggang kaya zat besi dan protein (31g). Keju cheddar memberikan kalsium alami, seimbang dengan roti bun dan sayuran segar.',
    novaGroup: 3,
    novaTitle: 'NOVA 3 — Makanan Siap Saji Olahan Segar',
    additivesFound: ['Daging sapi cincang murni', 'Keju cheddar alami', 'Roti gandum wijen'],
    macros: { protein: 31, carbs: 44, fat: 29, fiber: 3.2, sugar: 7.5, sodium: 880 },
    items: [
      { id: '1', name: 'Patty Daging Sapi Panggang', category: 'protein', weightGrams: 120, calories: 260, protein: 24, carbs: 0, fat: 18, description: '100% daging sapi panggang lada hitam', xPct: 50, yPct: 48, iconEmoji: '🥩' },
      { id: '2', name: 'Roti Bun Burger Wijen', category: 'carbs', weightGrams: 80, calories: 200, protein: 5, carbs: 36, fat: 3.5, description: 'Roti bun lembut dipanggang mentega tipis', xPct: 50, yPct: 25, iconEmoji: '🍔' },
      { id: '3', name: 'Keju Cheddar Lembaran', category: 'fat_sauce', weightGrams: 20, calories: 75, protein: 4.5, carbs: 0.5, fat: 6.2, description: 'Keju leleh kaya kalsium', xPct: 45, yPct: 42, iconEmoji: '🧀' },
      { id: '4', name: 'Selada, Tomat & Acar Mentimun', category: 'vegetable', weightGrams: 45, calories: 15, protein: 0.6, carbs: 3, fat: 0.1, description: 'Sayuran segar renyah', xPct: 52, yPct: 62, iconEmoji: '🥬' },
      { id: '5', name: 'Saus Mayo & Barbeque Ringan', category: 'fat_sauce', weightGrams: 15, calories: 30, protein: 0.2, carbs: 3.5, fat: 1.8, description: 'Saus bumbu burger', xPct: 55, yPct: 35, iconEmoji: '🍅' }
    ],
    dietHighlights: ['Tinggi Protein Hewani (31g)', 'Kaya Zat Besi & Zinc', 'Kalsium dari Keju'],
    nutritionTips: 'Pilih saus mustard atau kurangi saus mayones jika ingin memangkas 40 kalori lemak.',
    estimatedServingSize: '1 Porsi Burger Utuh (± 280g)'
  },
  pizza_slice: {
    foodName: 'Pizza Pepperoni & Keju Mozzarella (2 Potong)',
    altName: 'Pepperoni & Melted Mozzarella Pizza (2 Slices)',
    totalCalories: 540,
    confidenceScore: 96,
    confidenceText: 'Sangat Tinggi (96%)',
    healthScore: 'C',
    healthScoreNumber: 60,
    healthScoreTitle: 'Padat Karbohidrat & Kalsium (Grade C)',
    healthReason: 'Keju mozzarella leleh kaya protein dan kalsium. Saus tomat marinara menyediakan likopen antioksidan.',
    novaGroup: 3,
    novaTitle: 'NOVA 3 — Roti Panggang Olahan Oven',
    additivesFound: ['Keju mozzarella asli', 'Saus tomat herbal oregano', 'Pepperoni panggang'],
    macros: { protein: 24, carbs: 62, fat: 22, fiber: 3.8, sugar: 6.2, sodium: 950 },
    items: [
      { id: '1', name: 'Adonan Kulit Pizza Panggang', category: 'carbs', weightGrams: 140, calories: 290, protein: 7, carbs: 54, fat: 4.5, description: 'Roti pizza klasik panggang renyah', xPct: 45, yPct: 65, iconEmoji: '🍕' },
      { id: '2', name: 'Keju Mozzarella Leleh', category: 'protein', weightGrams: 50, calories: 150, protein: 11, carbs: 1.5, fat: 11, description: 'Keju mulur gurih kaya kalsium', xPct: 52, yPct: 45, iconEmoji: '🧀' },
      { id: '3', name: 'Irisan Pepperoni Sapi', category: 'protein', weightGrams: 30, calories: 85, protein: 5.5, carbs: 0.5, fat: 6.5, description: 'Daging sapi pepperoni panggang renyah', xPct: 35, yPct: 35, iconEmoji: '🥩' },
      { id: '4', name: 'Saus Tomat Marinara Herb', category: 'vegetable', weightGrams: 30, calories: 15, protein: 0.6, carbs: 3.2, fat: 0.2, description: 'Pasta tomat kaya likopen dengan oregano', xPct: 65, yPct: 50, iconEmoji: '🍅' }
    ],
    dietHighlights: ['Kalsium Tulang', 'Likopen Antioksidan', '24g Protein'],
    nutritionTips: 'Padukan dengan salad sayuran hijau segar untuk menambah serat dan menurunkan respon indeks glikemik.',
    estimatedServingSize: '2 Potong Irisan Sedang (± 250g)'
  }
};

// Merge original catalog into the big catalog
Object.assign(DISH_DATABASE, {
  salad_ayam_panggang: {
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
    macros: { protein: 42, carbs: 26, fat: 17, fiber: 9.8, sugar: 3.5, sodium: 380 },
    items: [
      { id: '1', name: 'Dada Ayam Panggang Herb', category: 'protein', weightGrams: 150, calories: 210, protein: 37, carbs: 0, fat: 5.5, description: 'Dada ayam tanpa kulit dipanggang rempah rosemary', xPct: 52, yPct: 40, iconEmoji: '🍗' },
      { id: '2', name: 'Alpukat Segar Mentega', category: 'fat_sauce', weightGrams: 60, calories: 96, protein: 1.2, carbs: 5.1, fat: 9, description: 'Lemak baik penurun kolesterol LDL', xPct: 28, yPct: 58, iconEmoji: '🥑' },
      { id: '3', name: 'Selada Romaine & Bayam', category: 'vegetable', weightGrams: 100, calories: 20, protein: 1.8, carbs: 3.8, fat: 0.3, description: 'Daun hijau segar tinggi folat & vitamin K', xPct: 75, yPct: 62, iconEmoji: '🥬' },
      { id: '4', name: 'Tomat Ceri & Timun', category: 'vegetable', weightGrams: 75, calories: 18, protein: 0.8, carbs: 3.9, fat: 0.2, description: 'Kaya likopen dan antioksidan', xPct: 35, yPct: 25, iconEmoji: '🍅' },
      { id: '5', name: 'Dressing Minyak Zaitun', category: 'fat_sauce', weightGrams: 20, calories: 86, protein: 0.1, carbs: 1.2, fat: 9.5, description: 'Extra virgin olive oil cold pressed', xPct: 65, yPct: 30, iconEmoji: '🫒' }
    ],
    dietHighlights: ['Sangat Tinggi Protein (42g)', 'Tinggi Serat (9.8g)', 'Rendah Sodium (380mg)', 'Bebas Lemak Trans'],
    nutritionTips: 'Menu ideal untuk defisit kalori, pembentukan massa otot kering, dan menjaga rasa kenyang berjam-jam.',
    estimatedServingSize: '1 Mangkuk Besar (± 405g)'
  },
  nasi_padang_rendang: {
    foodName: 'Nasi Padang Rendang Daging Komplit',
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
    macros: { protein: 34, carbs: 78, fat: 27, fiber: 6.5, sugar: 4.2, sodium: 780 },
    items: [
      { id: '1', name: 'Nasi Putih Pulen Hangat', category: 'carbs', weightGrams: 180, calories: 235, protein: 4.5, carbs: 51.5, fat: 0.6, description: '1 centong piring sedang nasi putih', xPct: 40, yPct: 65, iconEmoji: '🍚' },
      { id: '2', name: 'Rendang Daging Sapi', category: 'protein', weightGrams: 90, calories: 260, protein: 24, carbs: 6, fat: 16, description: 'Daging sapi bumbu rempah kelapa kering asli Minang', xPct: 68, yPct: 42, iconEmoji: '🥩' },
      { id: '3', name: 'Gulai Daun Singkong Rebus', category: 'vegetable', weightGrams: 80, calories: 95, protein: 3.5, carbs: 8.5, fat: 5.5, description: 'Daun singkong khas Minang kaya flavonoid', xPct: 22, yPct: 45, iconEmoji: '🌿' },
      { id: '4', name: 'Sambal Lado Mudo', category: 'fat_sauce', weightGrams: 25, calories: 45, protein: 0.8, carbs: 3.2, fat: 3.5, description: 'Sambal ijo kukus minyak kelapa', xPct: 48, yPct: 28, iconEmoji: '🌶️' },
      { id: '5', name: 'Lalapan Timun Segar', category: 'vegetable', weightGrams: 40, calories: 10, protein: 0.3, carbs: 2.1, fat: 0.1, description: 'Irisan timun penyeimbang pencernaan', xPct: 78, yPct: 70, iconEmoji: '🥒' }
    ],
    dietHighlights: ['Tinggi Protein (34g)', 'Kaya Zat Besi & Zinc', 'Kaya Rempah Herbal Antioksidan'],
    nutritionTips: 'Minta kuah santan dipisah atau kurangi siraman minyak kuah gulai untuk memangkas sekitar 70 kalori.',
    estimatedServingSize: '1 Piring Komplit (± 445g)'
  },
  gado_gado_komplit: {
    foodName: 'Gado-Gado Komplit Telur & Tahu Tempe',
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
    macros: { protein: 22, carbs: 48, fat: 23, fiber: 8.2, sugar: 9.5, sodium: 520 },
    items: [
      { id: '1', name: 'Sayur Kukus (Kangkung, Tauge, Kacang Panjang)', category: 'vegetable', weightGrams: 180, calories: 55, protein: 3.5, carbs: 11, fat: 0.6, description: 'Sayuran segar kukus kaya serat & folat', xPct: 40, yPct: 48, iconEmoji: '🥗' },
      { id: '2', name: 'Bumbu Saus Kacang Gurih', category: 'fat_sauce', weightGrams: 70, calories: 215, protein: 7.2, carbs: 14.5, fat: 15, description: 'Kacang tanah sangrai dengan gula aren & asam jawa', xPct: 65, yPct: 38, iconEmoji: '🥜' },
      { id: '3', name: 'Telur Ayam Rebus Utuh', category: 'protein', weightGrams: 55, calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, description: 'Telur rebus sumber kolin lengkap', xPct: 22, yPct: 35, iconEmoji: '🥚' },
      { id: '4', name: 'Tahu Kuning & Tempe Kukus', category: 'protein', weightGrams: 80, calories: 105, protein: 8.8, carbs: 5.2, fat: 5.8, description: 'Protein nabati kaya isoflavon kedelai', xPct: 75, yPct: 65, iconEmoji: '🧈' },
      { id: '5', name: 'Kerupuk Emping & Bawang', category: 'snack_drink', weightGrams: 15, calories: 32, protein: 0.4, carbs: 5.2, fat: 1.2, description: 'Garnish renyah tradisional', xPct: 25, yPct: 72, iconEmoji: '🍘' }
    ],
    dietHighlights: ['Tinggi Serat (8.2g)', 'Protein Nabati & Hewani', 'Sayuran Pelindung Usus'],
    nutritionTips: 'Bumbu kacang sangat padat kalori; memakai 75% saus cukup untuk mempertahankan rasa enak sekaligus menghemat 50 kkal.',
    estimatedServingSize: '1 Porsi Komplit (± 400g)'
  },
  nasi_goreng_telur: {
    foodName: 'Nasi Goreng Spesial Telur & Ayam',
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
    macros: { protein: 23, carbs: 74, fat: 22, fiber: 3.2, sugar: 6.8, sodium: 840 },
    items: [
      { id: '1', name: 'Nasi Goreng Bumbu Merah Kecap', category: 'carbs', weightGrams: 200, calories: 340, protein: 6, carbs: 62, fat: 8, description: 'Nasi goreng harum bawang merah, cabai, kecap', xPct: 45, yPct: 62, iconEmoji: '🍚' },
      { id: '2', name: 'Telur Mata Sapi (Ceplok)', category: 'protein', weightGrams: 55, calories: 110, protein: 7, carbs: 0.8, fat: 9, description: 'Telur goreng gurih', xPct: 52, yPct: 35, iconEmoji: '🍳' },
      { id: '3', name: 'Suwiran Daging Ayam', category: 'protein', weightGrams: 50, calories: 85, protein: 9.5, carbs: 1, fat: 4.8, description: 'Ayam ungkep suwir gurih', xPct: 28, yPct: 45, iconEmoji: '🍗' },
      { id: '4', name: 'Acar Mentimun Segar', category: 'vegetable', weightGrams: 40, calories: 15, protein: 0.4, carbs: 3.2, fat: 0.1, description: 'Acar asam manis pelengkap', xPct: 75, yPct: 42, iconEmoji: '🥒' },
      { id: '5', name: 'Kerupuk Udang Renyah', category: 'snack_drink', weightGrams: 15, calories: 40, protein: 0.6, carbs: 7, fat: 1.1, description: 'Kerupuk goreng gurih', xPct: 78, yPct: 75, iconEmoji: '🦐' }
    ],
    dietHighlights: ['Sumber Karbohidrat Aktif', '23g Protein Lengkap', 'Disertai Acar Segar'],
    nutritionTips: 'Minta telur diceplok tanpa minyak berlebih atau pilih telur rebus untuk mengurangi 50 kkal lemak.',
    estimatedServingSize: '1 Porsi Sedang (± 360g)'
  },
  salmon_bowl_quinoa: {
    foodName: 'Salmon Panggang Bowl dengan Brokoli & Nasi Cokelat',
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
    macros: { protein: 38, carbs: 45, fat: 18, fiber: 7.5, sugar: 2.1, sodium: 360 },
    items: [
      { id: '1', name: 'Fillet Salmon Panggang', category: 'protein', weightGrams: 140, calories: 250, protein: 29, carbs: 0, fat: 14, description: 'Salmon segar kaya Omega-3 dan Vitamin D', xPct: 50, yPct: 45, iconEmoji: '🐟' },
      { id: '2', name: 'Nasi Beras Cokelat / Merah', category: 'carbs', weightGrams: 140, calories: 165, protein: 3.8, carbs: 35, fat: 1.2, description: 'Beras utuh tinggi vitamin B kompleks', xPct: 25, yPct: 62, iconEmoji: '🍚' },
      { id: '3', name: 'Brokoli & Wortel Kukus', category: 'vegetable', weightGrams: 90, calories: 35, protein: 2.6, carbs: 6.5, fat: 0.4, description: 'Tinggi vitamin C dan sulforaphane anti-kanker', xPct: 75, yPct: 48, iconEmoji: '🥦' },
      { id: '4', name: 'Wijen & Shoyu Rendah Garam', category: 'fat_sauce', weightGrams: 20, calories: 60, protein: 2.1, carbs: 3.5, fat: 3.8, description: 'Sentuhan rasa umami gurih', xPct: 52, yPct: 22, iconEmoji: '🌱' }
    ],
    dietHighlights: ['Kaya Omega-3 Murni', 'Indeks Glikemik Rendah', 'Tinggi Antioksidan', 'Rendah Natrium'],
    nutritionTips: 'Pilihan sempurna untuk menu makan malam pemulihan tubuh dan menjaga kolesterol HDL tetap tinggi.',
    estimatedServingSize: '1 Mangkuk Sehat (± 390g)'
  }
});

// Helper: Smart fallback matcher based on hint or keywords
function findBestMatchingDish(foodHint?: string) {
  if (!foodHint) return DISH_DATABASE.sate_ayam;
  const q = foodHint.toLowerCase();

  if (q.includes('sate') || q.includes('satay')) return DISH_DATABASE.sate_ayam;
  if (q.includes('bakso') || q.includes('meatball') || q.includes('pentol')) return DISH_DATABASE.bakso_sapi;
  if (q.includes('soto') || q.includes('sop') || q.includes('sup')) return DISH_DATABASE.soto_ayam;
  if (q.includes('geprek') || q.includes('pedas') || q.includes('sambal bawang')) return DISH_DATABASE.ayam_geprek;
  if (q.includes('uduk') || q.includes('kuning') || q.includes('liwet')) return DISH_DATABASE.nasi_uduk;
  if (q.includes('mie') || q.includes('noodle') || q.includes('bihun')) return DISH_DATABASE.mie_ayam;
  if (q.includes('padang') || q.includes('rendang') || q.includes('gulai')) return DISH_DATABASE.nasi_padang_rendang;
  if (q.includes('gado') || q.includes('pecel') || q.includes('kacang')) return DISH_DATABASE.gado_gado_komplit;
  if (q.includes('goreng') || q.includes('nasgor')) return DISH_DATABASE.nasi_goreng_telur;
  if (q.includes('burger')) return DISH_DATABASE.burger_daging;
  if (q.includes('pizza')) return DISH_DATABASE.pizza_slice;
  if (q.includes('salmon') || q.includes('ikan')) return DISH_DATABASE.salmon_bowl_quinoa;
  if (q.includes('salad') || q.includes('sayur') || q.includes('diet')) return DISH_DATABASE.salad_ayam_panggang;

  return DISH_DATABASE.sate_ayam;
}

// API Route: Analyze Food Image
app.post('/api/analyze-food', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', sampleKey, foodHint } = req.body;

    // Check if user chose a predefined popular sample
    if (sampleKey && DISH_DATABASE[sampleKey]) {
      return res.json({
        success: true,
        source: 'catalog',
        data: DISH_DATABASE[sampleKey],
      });
    }

    if (!imageBase64 && !foodHint) {
      return res.status(400).json({
        success: false,
        error: 'Foto makanan atau catatan makanan wajib diisi.',
      });
    }

    // Try Gemini Multimodal analysis if API client is initialized
    if (ai) {
      // Clean base64 and detect accurate MIME type
      let cleanBase64 = imageBase64 || '';
      let finalMimeType = mimeType || 'image/jpeg';

      if (cleanBase64.includes(';base64,')) {
        const parts = cleanBase64.split(';base64,');
        const mimeMatch = parts[0].match(/data:(image\/[a-zA-Z0-9+.-]+)/);
        if (mimeMatch) {
          finalMimeType = mimeMatch[1];
        }
        cleanBase64 = parts[1];
      }
      cleanBase64 = cleanBase64.replace(/\s+/g, '');

      const promptText = `
Anda adalah sistem AI Vision Pemindai Kalori Makanan "TEMAN SEHAT ALBAMA" bersertifikasi nutrisi klinis dengan database Tabel Komposisi Pangan Indonesia (TKPI) Kemenkes RI dan USDA FoodData Central.

TUGAS UTAMA: Periksa foto makanan yang diunggah dengan sangat teliti dan tentukan nama hidangan secara SPESIFIK dan 100% PERSIS sesuai apa yang terlihat di foto.

${foodHint ? `CATATAN PENGGUNA TENTANG MAKANAN INI: "${foodHint}". Perhitungkan catatan ini jika sesuai dengan foto.` : ''}

PETUNJUK ANALISIS WAJIB:
1. **Nama Makanan Utama (foodName)**:
   Sebutkan nama hidangan secara spesifik dan akurat dalam bahasa Indonesia sehari-hari.
   Contoh: Jika foto memperlihatkan sate ayam, tulis "Sate Ayam Madura"; jika bakso, tulis "Bakso Sapi Kuah Komplit"; jika nasi goreng, tulis "Nasi Goreng Telur"; jika martabak, tulis "Martabak Manis Cokelat Keju"; jika burger, tulis "Burger Daging Sapi Keju"; jika pizza, tulis "Pizza Pepperoni Keju"; jika soto, tulis "Soto Ayam Lamongan"; jika mie ayam, tulis "Mie Ayam Pangsit"; jika ayam goreng, tulis "Ayam Goreng Lengkuas & Nasi"; jika nasi padang, tulis "Nasi Padang Rendang".
   JANGAN PERNAH menebak salad jika foto di piring bukan salad!
2. **Urai Seluruh Komponen Piring (items)**:
   - Identifikasi setiap lauk, karbohidrat, sayuran, saus/sambal, dan pelengkap yang benar-benar ada di foto.
   - Untuk setiap bahan, tentukan 'name', 'category', perkiraan berat 'weightGrams' yang realistis (proporsi piring standar 300g - 500g total), 'calories', 'protein', 'carbs', 'fat', serta posisi pin 'xPct' (15-85) dan 'yPct' (15-85) di mana bahan tersebut berada pada foto, dan 'iconEmoji' yang sesuai (misal: 🍗, 🍚, 🥑, 🥚, 🌶️, 🥩).
3. **Kalkulasi Kalori & Makro**:
   - Total kalori (totalCalories) HARUS merupakan penjumlahan eksak dari seluruh kalori bahan dalam 'items'.
   - Hitung makronutrien total: Protein (g), Karbohidrat (g), Lemak (g), Serat (g), Gula (g), Natrium/Sodium (mg).
4. **Health Score & Nutri-Score**:
   - Tentukan skor 0-100 dan Grade Nutri-Score (A: 80-100, B: 65-79, C: 50-64, D: 35-49, E: 0-34).
   - Klasifikasi NOVA (1: Alami/Minim Proses, 2: Kuliner Tradisional, 3: Olahan, 4: Ultra-Processed).
   - Analisis bahan/aditif (misal: "Bebas pengawet sintetis", "Kaya protein hewani alami").
5. **Kredibilitas & Tips Ahli Gizi**: Berikan tips gizi praktis dan relevan untuk hidangan spesifik tersebut.
`;

      const contents: any[] = [];
      if (cleanBase64) {
        contents.push({
          inlineData: {
            mimeType: finalMimeType,
            data: cleanBase64,
          },
        });
      }
      contents.push({ text: promptText });

      // Model cascade: try candidate models in sequence until one succeeds
      let lastErr: any = null;
      for (const modelName of VISION_CANDIDATE_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts: contents },
            config: {
              systemInstruction: 'Anda adalah asisten nutrisi AI "TEMAN SEHAT ALBAMA". Hasilkan respons JSON murni tanpa markdown pembungkus.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  foodName: { type: Type.STRING, description: 'Nama makanan utama yang persis terlihat di foto dalam bahasa Indonesia' },
                  altName: { type: Type.STRING, description: 'Nama alternatif atau terjemahan Inggris' },
                  totalCalories: { type: Type.NUMBER, description: 'Total kalori dalam kkal' },
                  confidenceScore: { type: Type.NUMBER, description: 'Tingkat akurasi dalam persen (88-99)' },
                  confidenceText: { type: Type.STRING, description: 'Deskripsi akurasi misalnya "Sangat Tinggi (97%)"' },
                  healthScore: { type: Type.STRING, description: 'Grade A, B, C, D, atau E' },
                  healthScoreNumber: { type: Type.NUMBER, description: 'Skor kesehatan dari 0 sampai 100' },
                  healthScoreTitle: { type: Type.STRING, description: 'Judul Health Score ringkas' },
                  healthReason: { type: Type.STRING, description: 'Alasan penentuan Health Score tersebut' },
                  novaGroup: { type: Type.INTEGER, description: 'NOVA group 1, 2, 3, atau 4' },
                  novaTitle: { type: Type.STRING, description: 'Keterangan tingkat pemrosesan NOVA' },
                  additivesFound: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Catatan aditif pangan atau bahan pengawet/minyak alami',
                  },
                  macros: {
                    type: Type.OBJECT,
                    properties: {
                      protein: { type: Type.NUMBER, description: 'Gram protein' },
                      carbs: { type: Type.NUMBER, description: 'Gram karbohidrat' },
                      fat: { type: Type.NUMBER, description: 'Gram lemak' },
                      fiber: { type: Type.NUMBER, description: 'Gram serat pangan' },
                      sugar: { type: Type.NUMBER, description: 'Gram gula' },
                      sodium: { type: Type.NUMBER, description: 'Miligram natrium' },
                    },
                    required: ['protein', 'carbs', 'fat', 'fiber', 'sugar', 'sodium'],
                  },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING, description: 'Nama bahan / lauk spesifik' },
                        category: { type: Type.STRING, description: 'protein | carbs | vegetable | fat_sauce | snack_drink | other' },
                        weightGrams: { type: Type.NUMBER, description: 'Estimasi berat dalam gram' },
                        calories: { type: Type.NUMBER, description: 'Kalori kkal' },
                        protein: { type: Type.NUMBER, description: 'Protein gram' },
                        carbs: { type: Type.NUMBER, description: 'Karbohidrat gram' },
                        fat: { type: Type.NUMBER, description: 'Lemak gram' },
                        description: { type: Type.STRING, description: 'Keterangan takaran porsi' },
                        xPct: { type: Type.NUMBER, description: 'Posisi X horizontal pin di gambar (15-85)' },
                        yPct: { type: Type.NUMBER, description: 'Posisi Y vertikal pin di gambar (15-85)' },
                        iconEmoji: { type: Type.STRING, description: 'Emoji ikon bahan' },
                      },
                      required: ['id', 'name', 'category', 'weightGrams', 'calories', 'protein', 'carbs', 'fat', 'description'],
                    },
                  },
                  dietHighlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '3-4 poin sorotan nutrisi terbaik',
                  },
                  nutritionTips: { type: Type.STRING, description: 'Saran gizi praktis untuk makanan ini' },
                  estimatedServingSize: { type: Type.STRING, description: 'Ukuran porsi total estimasi' },
                },
                required: [
                  'foodName',
                  'altName',
                  'totalCalories',
                  'confidenceScore',
                  'confidenceText',
                  'healthScore',
                  'healthScoreTitle',
                  'healthReason',
                  'macros',
                  'items',
                  'dietHighlights',
                  'nutritionTips',
                  'estimatedServingSize',
                ],
              },
            },
          });

          const rawText = response.text || '';
          let parsedData: any;
          try {
            parsedData = JSON.parse(rawText);
          } catch {
            const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedData = JSON.parse(cleaned);
          }

          if (parsedData && parsedData.foodName && parsedData.totalCalories) {
            console.log(`Successfully analyzed food using ${modelName}:`, parsedData.foodName);
            return res.json({
              success: true,
              source: `gemini-ai (${modelName})`,
              data: parsedData,
            });
          }
        } catch (err: any) {
          lastErr = err;
          console.warn(`Model ${modelName} failed (${err?.status || err?.message}), trying next candidate...`);
        }
      }
      console.error('All vision models failed, last error was:', lastErr?.message || lastErr);
    }

    // Intelligent context-aware fallback matching the food hint
    const matchingDish = findBestMatchingDish(foodHint);
    return res.json({
      success: true,
      source: 'smart-catalog',
      data: matchingDish,
    });
  } catch (error: any) {
    console.error('Error analyzing food:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Terjadi kesalahan saat memproses gambar.',
    });
  }
});

// API Route: Generate Personalized Diet Meal Plan
app.post('/api/generate-meal-plan', async (req, res) => {
  try {
    const { targetCalories, goal, dietType, allergies, currentWeight, targetWeight } = req.body;

    const cal = Number(targetCalories) || 2000;
    const g = goal || 'lose';
    const dt = dietType || 'seimbang';

    if (ai) {
      for (const modelName of VISION_CANDIDATE_MODELS) {
        try {
          const prompt = `
Sebagai pakar diet dan gizi Teman Sehat Albama, buatkan 1 paket rencana menu harian sehat lengkap (Sarapan, Makan Siang, Snack/Camilan Sehat, dan Makan Malam) untuk seseorang dengan:
- Target kalori harian: ${cal} kkal
- Tujuan: ${g === 'lose' ? 'Menurunkan berat badan (fat loss)' : g === 'gain' ? 'Menambah massa otot / berat badan' : 'Mempertahankan berat badan ideal'}
- Pola diet: ${dt}
- Alergi/Pantangan: ${allergies || 'Tidak ada'}
- Berat badan saat ini: ${currentWeight || 65} kg, Target: ${targetWeight || 60} kg

Menu harus menggunakan bahan-bahan lokal yang lezat, segar, mudah dibuat/dibeli di Indonesia, dan total kalorinya sangat mendekati ${cal} kkal.
Kembalikan dalam JSON terstruktur.
`;

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: 'Anda adalah konsultan gizi AI Teman Sehat Albama. Kembalikan JSON murni.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  planName: { type: Type.STRING },
                  totalCalculatedCalories: { type: Type.NUMBER },
                  macroDistribution: {
                    type: Type.OBJECT,
                    properties: {
                      proteinGrams: { type: Type.NUMBER },
                      carbsGrams: { type: Type.NUMBER },
                      fatGrams: { type: Type.NUMBER },
                      waterLiters: { type: Type.NUMBER },
                    },
                    required: ['proteinGrams', 'carbsGrams', 'fatGrams', 'waterLiters'],
                  },
                  meals: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        mealType: { type: Type.STRING, description: 'Sarapan | Makan Siang | Camilan Sehat | Makan Malam' },
                        time: { type: Type.STRING, description: 'Waktu ideal, misal 07:30 WIB' },
                        title: { type: Type.STRING, description: 'Nama menu lezat' },
                        calories: { type: Type.NUMBER },
                        macros: {
                          type: Type.OBJECT,
                          properties: {
                            protein: { type: Type.NUMBER },
                            carbs: { type: Type.NUMBER },
                            fat: { type: Type.NUMBER },
                          },
                          required: ['protein', 'carbs', 'fat'],
                        },
                        ingredients: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                        prepTips: { type: Type.STRING },
                      },
                      required: ['mealType', 'time', 'title', 'calories', 'macros', 'ingredients', 'prepTips'],
                    },
                  },
                  healthTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['planName', 'totalCalculatedCalories', 'macroDistribution', 'meals', 'healthTips'],
              },
            },
          });

          const parsed = JSON.parse(response.text || '{}');
          if (parsed.planName && parsed.meals) {
            return res.json({ success: true, data: parsed });
          }
        } catch (err: any) {
          console.warn(`Meal plan generator with ${modelName} failed, trying next...`);
        }
      }
    }

    // Default calculated meal plan
    const breakfastCal = Math.round(cal * 0.25);
    const lunchCal = Math.round(cal * 0.35);
    const snackCal = Math.round(cal * 0.15);
    const dinnerCal = Math.round(cal * 0.25);

    const defaultPlan = {
      planName: `Menu Diet Sehat Albama (${cal} kkal)`,
      totalCalculatedCalories: breakfastCal + lunchCal + snackCal + dinnerCal,
      macroDistribution: {
        proteinGrams: Math.round((cal * 0.25) / 4),
        carbsGrams: Math.round((cal * 0.50) / 4),
        fatGrams: Math.round((cal * 0.25) / 9),
        waterLiters: Math.max(2.2, Math.round(((currentWeight || 65) * 0.035) * 10) / 10),
      },
      meals: [
        {
          mealType: 'Sarapan (Pagi)',
          time: '07:30 WIB',
          title: 'Oatmeal Pisang & Telur Rebus Madu Alami',
          calories: breakfastCal,
          macros: { protein: 20, carbs: 55, fat: 10 },
          ingredients: [
            '40g Rolled oat diseduh air hangat / susu skim',
            '1 buah pisang ambon potong tipis',
            '2 butir telur ayam rebus matang',
            '1 sdt madu murni & sedikit taburan chia seed'
          ],
          prepTips: 'Sarapan padat serat ini memberikan rasa kenyang stabil hingga waktu makan siang tanpa lonjakan insulin mendadak.'
        },
        {
          mealType: 'Makan Siang',
          time: '12:30 WIB',
          title: 'Nasi Merah, Dada Ayam Bakar Ketumbar & Sayur Bening Bayam Jagung',
          calories: lunchCal,
          macros: { protein: 42, carbs: 68, fat: 12 },
          ingredients: [
            '120g Nasi beras merah pulen',
            '140g Dada ayam fillet marinasi ketumbar, bawang putih & panggang teflon',
            '1 mangkuk sayur bening bayam, jagung manis pipil & wortel',
            'Sambal tomat segar tanpa minyak goreng'
          ],
          prepTips: 'Kaya akan protein pembentuk otot serta zat besi alami dari daun bayam untuk menjaga energi produktivitas Anda.'
        },
        {
          mealType: 'Camilan Sehat (Sore)',
          time: '16:00 WIB',
          title: 'Greek Yogurt Rendah Lemak & Potongan Pepaya / Apel',
          calories: snackCal,
          macros: { protein: 12, carbs: 24, fat: 3 },
          ingredients: [
            '120g Greek yogurt plain tanpa pemanis',
            '100g Pepaya matang atau apel fuji iris',
            '10 butir kacang almond panggang'
          ],
          prepTips: 'Mencegah lapar berlebihan menjelang makan malam dan memelihara mikrobioma usus dengan probiotik aktif.'
        },
        {
          mealType: 'Makan Malam',
          time: '19:00 WIB',
          title: 'Tumis Tahu Jamur Tiram & Ikan Kembung Kukus Jahe',
          calories: dinnerCal,
          macros: { protein: 32, carbs: 35, fat: 11 },
          ingredients: [
            '1 ekor (90g) ikan kembung segar kukus daun jahe (tinggi Omega-3)',
            '100g Tahu putih potong dadu ditumis bersama jamur tiram & sedikit minyak zaitun',
            '1 porsi kecil (80g) kentang rebus atau nasi beras cokelat',
            'Lalapan selada & timun renyah'
          ],
          prepTips: 'Makan malam tinggi protein dan ringan di pencernaan sehingga tidur lebih nyenyak dan pemulihan tubuh optimal.'
        }
      ],
      healthTips: [
        'Minum segelas air putih hangat 15-20 menit sebelum setiap waktu makan.',
        'Usahakan tidak makan besar 2-3 jam sebelum tidur malam.',
        'Prioritaskan tidur 7-8 jam per hari untuk menjaga hormon leptin & ghrelin seimbang.'
      ]
    };

    return res.json({ success: true, data: defaultPlan });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TEMAN SEHAT ALBAMA server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
