import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check } from 'lucide-react';

interface WebcamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string) => void;
}

export const WebcamModal: React.FC<WebcamModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, cameraFacing]);

  const startCamera = async () => {
    stopCamera();
    setErrorMsg(null);
    setCapturedImage(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access failed, falling back to any video device:', err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      } catch (fallbackErr: any) {
        setErrorMsg('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan pada browser Anda.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const switchCamera = () => {
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Ambil Foto Makanan</h3>
              <p className="text-[11px] text-slate-500">Arahkan kamera ke piring makananmu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="relative bg-black aspect-4/3 flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-white">
              <p className="text-sm text-red-300 font-medium mb-3">{errorMsg}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold"
              >
                Coba Lagi
              </button>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured food" className="w-full h-full object-cover" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Aiming Reticle / Guide */}
              <div className="absolute inset-8 border-2 border-dashed border-white/60 rounded-3xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] font-semibold text-white/90 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
                  Posisikan makanan di tengah bingkai
                </span>
              </div>
            </>
          )}

          {/* Switch Camera Button (Environment / User) */}
          {!capturedImage && !errorMsg && (
            <button
              onClick={switchCamera}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
              title="Ganti Kamera Depan/Belakang"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 bg-white flex items-center justify-center gap-4">
          {capturedImage ? (
            <>
              <button
                onClick={retake}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Foto Ulang</span>
              </button>
              <button
                onClick={confirmCapture}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Gunakan Foto Ini</span>
              </button>
            </>
          ) : (
            <button
              onClick={takeSnapshot}
              disabled={!!errorMsg}
              className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/40 active:scale-90 transition-all disabled:opacity-50"
              title="Ambil Foto"
            >
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
