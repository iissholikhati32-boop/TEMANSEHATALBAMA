import React, { useState } from 'react';
import { ChevronDown, HelpCircle, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'Seberapa akurat hasil pemindai kalori makanan AI ini?',
      answer:
        'Sistem kami menggunakan model vision AI multimodal canggih yang dilatih menggunakan standar Tabel Komposisi Pangan Indonesia (TKPI) Kemenkes RI dan USDA FoodData Central. Akurasi pengenalan bahan dan proporsi porsi mencapai 95-98%. Jika piring Anda memiliki porsi berbeda, Anda dapat memanfaatkan tombol "Koreksi Porsi" untuk menyesuaikan gramasi secara presisi 100%.',
    },
    {
      question: 'Apakah saya perlu menimbang makanan terlebih dahulu dengan timbangan dapur?',
      answer:
        'Tidak perlu! AI kami secara otomatis mengestimasi volume dan gramasi setiap komponen makanan berdasarkan rasio piring standar (diameter 24-28 cm). Anda cukup mengambil foto dari sudut atas atau 45 derajat.',
    },
    {
      question: 'Bagaimana Health Score (A–E) dan skor 0–100 dihitung?',
      answer:
        'Health Score dinilai berdasarkan kriteria medis: sumber protein berkualitas, kepadatan serat alami, kadar natrium/garam, lemak jenuh vs lemak tak jenuh sehat, serta klasifikasi tingkat pemrosesan makanan (kerangka NOVA). Grade A (80-100) menandakan makanan bernutrisi tinggi dan minim proses.',
    },
    {
      question: 'Apakah makanan tradisional Indonesia seperti rendang, gulai, dan sambal bisa terdeteksi?',
      answer:
        'Tentu saja! TEMAN SEHAT ALBAMA dioptimalkan khusus untuk mengenali kuliner Nusantara (Nasi Padang, Pecel, Gado-Gado, Ayam Bakar, Soto, Rawon, Sayur Asem, Tempe, Tahu, Aneka Sambal) maupun hidangan internasional.',
    },
    {
      question: 'Apakah aplikasi web ini benar-benar gratis tanpa perlu mendaftar?',
      answer:
        'Ya, 100% gratis! Anda bisa langsung memindai makanan, menghitung BMI & BMR, serta merancang menu diet harian langsung dari peramban (browser) tanpa perlu membuat akun atau memasukkan data kartu kredit.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-14 sm:py-20 border-t border-slate-100 bg-[#F8F9F8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-100">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pertanyaan Umum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Sering Ditanyakan (FAQ)
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Hal-hal yang sering ditanyakan seputar cara kerja pemindai kalori AI dan akurasi nutrisi.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-5 rounded-3xl bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-600/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">Siap Menghitung Piring Makananmu?</h4>
              <p className="text-xs text-emerald-100">Ambil foto makanan sekarang tanpa perlu menimbang manual.</p>
            </div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs sm:text-sm hover:bg-emerald-50 active:scale-95 transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            Mulai Scan Makanan ➔
          </button>
        </div>
      </div>
    </section>
  );
};
