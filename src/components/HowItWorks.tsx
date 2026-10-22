import React from 'react';
import { UploadCloud, Cpu, Award } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Unggah Foto Makanan',
      desc: 'Ambil foto langsung piring makananmu dengan kamera HP atau pilih gambar dari galeri. Tanpa perlu registrasi akun.',
      icon: UploadCloud,
      accent: 'emerald',
      pill: 'Mudah & Instan',
    },
    {
      step: '02',
      title: 'AI Mengurai Isi Makanan',
      desc: 'Sistem vision AI canggih mendeteksi proporsi piring, jenis lauk, karbohidrat, protein, sayuran, saus, hingga takaran gramnya.',
      icon: Cpu,
      accent: 'teal',
      pill: 'Akurasi Vision AI',
    },
    {
      step: '03',
      title: 'Dapatkan Kalori & Health Score (A–E)',
      desc: 'Lihat total kkal akurat, rincian makronutrien (protein, karbo, lemak, serat), dan Health Score Nutri-Score dengan opsi koreksi porsi.',
      icon: Award,
      accent: 'emerald',
      pill: 'Standar TKPI & USDA',
    },
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-slate-100 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Cara Kerja</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Hitung Nutrisi Semudah Menjepret Foto
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Hanya dalam hitungan detik, ketahui apa saja kandungan yang masuk ke dalam tubuhmu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-600/80 group-hover:text-emerald-600 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-950 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg">
                    {item.pill}
                  </span>
                  <span className="text-slate-300 text-xs font-mono">Step {item.step}/03</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
