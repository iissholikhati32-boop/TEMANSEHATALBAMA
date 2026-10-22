import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Sparkles, UploadCloud, Flame, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SAMPLE_FOODS, SampleFoodOption } from '../data/sampleFoods';
import { FoodAnalysisResult } from '../types/nutrition';

interface HeroScannerProps {
  onAnalyzeStart: () => void;
  onAnalyzeSuccess: (data: FoodAnalysisResult, imagePreview?: string) => void;
  onAnalyzeError: (error: string) => void;
  onOpenLiveCamera: () => void;
  isAnalyzing: boolean;
}

export const HeroScanner: React.FC<HeroScannerProps> = ({
  onAnalyzeStart,
  onAnalyzeSuccess,
  onAnalyzeError,
  onOpenLiveCamera,
  isAnalyzing,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [customFoodHint, setCustomFoodHint] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onAnalyzeError('Mohon unggah file berupa gambar (JPG, PNG, WEBP, atau HEIC).');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result as string;
      await uploadAndAnalyze(base64String, file.type);
    };
    reader.onerror = () => {
      onAnalyzeError('Gagal membaca berkas gambar.');
    };
    reader.readAsDataURL(file);
  };

  const uploadAndAnalyze = async (base64Data: string, mimeType: string) => {
    onAnalyzeStart();
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: mimeType || 'image/jpeg',
          foodHint: customFoodHint.trim() || undefined,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        onAnalyzeSuccess(resData.data, base64Data);
      } else {
        onAnalyzeError(resData.error || 'Gagal menganalisis gambar makanan.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      onAnalyzeError('Terjadi gangguan jaringan saat memproses gambar. Silakan coba kembali.');
    }
  };

  const handleSelectSample = async (sample: SampleFoodOption) => {
    setSelectedSample(sample.id);
    onAnalyzeStart();
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleKey: sample.id,
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        onAnalyzeSuccess(resData.data, sample.imageUrl);
      } else {
        // Fallback to local sample dataset
        onAnalyzeSuccess(sample.analysis, sample.imageUrl);
      }
    } catch (e) {
      onAnalyzeSuccess(sample.analysis, sample.imageUrl);
    }
  };

  return (
    <section className="relative pt-8 pb-14 sm:pt-12 sm:pb-20 overflow-hidden">
      {/* Background Subtle Gradient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-emerald-100/60 to-teal-100/40 blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 1. Hero Badge kecil */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200/80 shadow-xs mb-6 animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-800 tracking-wide uppercase">
            Alat online gratis
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-600 font-medium hidden sm:inline">
            Tanpa perlu daftar
          </span>
        </div>

        {/* 2. Judul Utama */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] font-display">
          Pemindai Kalori Makanan AI
        </h1>

        {/* 3. Sub-teks */}
        <p className="mt-4 sm:mt-5 max-w-2xl mx-auto text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
          Foto makananmu dan hitung kalorinya seketika. Tanpa perlu daftar.
        </p>

        {/* 4. Area Unggah (Drag & Drop Zone / Tombol Ambil Foto / Pilih dari Galeri) */}
        <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-3xl p-6 sm:p-10 text-center transition-all duration-200 bg-white shadow-xl shadow-slate-200/50 border-2 ${
              isDragOver
                ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                : 'border-dashed border-slate-300 hover:border-emerald-400'
            } ${isAnalyzing ? 'pointer-events-none opacity-80' : ''}`}
          >
            {isAnalyzing ? (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-5">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  AI Sedang Mengurai Piring Makanan...
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                  Mengidentifikasi bahan, protein, porsi gram, dan menghitung kalori sesuai standar nutrisi TKPI & USDA.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Akurasi estimasi porsi tingkat klinis</span>
                </div>
              </div>
            ) : (
              <>
                {/* Kamera / Unggah Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-100/80 text-emerald-600 flex items-center justify-center mb-5 shadow-xs group-hover:scale-105 transition-transform">
                  <Camera className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.75]" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 font-display">
                  Tarik & letakkan foto makanan di sini
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                  Mendukung format JPG, PNG, WEBP, atau foto langsung dari kamera smartphone
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  {/* Tombol Ambil Foto Langsung */}
                  <button
                    onClick={onOpenLiveCamera}
                    type="button"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Ambil Foto Sekarang</span>
                  </button>

                  {/* Tombol Pilih dari Galeri */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-sm transition-all cursor-pointer border border-slate-200/80"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-500" />
                    <span>Pilih dari Galeri</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>

                {/* Optional Food Hint / Note for Extra Accuracy */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <input
                        type="text"
                        value={customFoodHint}
                        onChange={(e) => setCustomFoodHint(e.target.value)}
                        placeholder="Ketik nama makanan jika ada catatan khusus (misal: Sate ayam 10 tusuk, Bakso urat, dll.)..."
                        className="w-full text-xs text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block text-left pl-1">
                      💡 AI akan memindai foto secara otomatis. Anda juga dapat mengetikkan nama hidangan untuk akurasi ekstra tinggi.
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Instant Food Presets Bar */}
          <div className="mt-8 text-left">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Coba langsung contoh makanan populer:
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Klik untuk simulasi instan
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {SAMPLE_FOODS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  disabled={isAnalyzing}
                  className={`group p-2.5 rounded-2xl bg-white border text-left transition-all hover:border-emerald-300 hover:shadow-md cursor-pointer ${
                    selectedSample === sample.id
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                      : 'border-slate-200/80 shadow-xs'
                  }`}
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-slate-100">
                    <img
                      src={sample.imageUrl}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      {sample.calories} kkal
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {sample.emoji} {sample.name}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                    <span>Grade {sample.healthScore}</span>
                    <span className="text-emerald-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Coba ➔
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
