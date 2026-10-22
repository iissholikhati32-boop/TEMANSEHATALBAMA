import React from 'react';
import { HeartPulse, ShieldCheck, Sparkles, Scale, UtensilsCrossed, Camera } from 'lucide-react';
import { NavTab } from './Header';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-slate-200 bg-white/80 py-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 font-display">
                TEMAN SEHAT ALBAMA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              Platform kesehatan cerdas dengan teknologi AI vision untuk memindai kalori makanan, kalkulator komposisi tubuh (BMI & BMR), serta panduan diet sehat berdasar standar gizi terakreditasi.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Standar TKPI Kemenkes RI & USDA FoodData Central</span>
            </div>
          </div>

          {/* Quick Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Fitur Utama
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Pemindai Kalori Makanan AI</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('bmi_bmr')}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Kalkulator BMI & BMR</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('diet_plan')}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Rencana Menu Diet Sehat</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Health Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Catatan Kesehatan
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Hasil estimasi kalori dan nutrisi AI dirancang untuk memandu pola makan sehat harian. Konsultasikan dengan dokter spesialis gizi untuk kondisi medis atau terapi diet klinis khusus.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            © {new Date().getFullYear()} TEMAN SEHAT ALBAMA. Seluruh hak cipta dilindungi.
          </span>
          <span className="text-[11px]">
            Desain Bersih, Modern & Minimalis • Calsy Inspired UI/UX
          </span>
        </div>
      </div>
    </footer>
  );
};
