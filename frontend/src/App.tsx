import { useState } from 'react';
import { Scanner } from './components/Scanner';
import { MedicalHUD } from './components/MedicalHUD';
import type { GeminiResponse } from './types';
import { ShieldPlus } from 'lucide-react';

function App() {
  const [data, setData] = useState<GeminiResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (files: File[], intentText: string) => {
    setIsProcessing(true);
    setError(null);
    setData(null);

    try {
      const formData = new FormData();
      if (intentText.trim()) formData.append('intentText', intentText);
      files.forEach((file) => formData.append('files', file));

      const response = await fetch('/process-emergency', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process emergency context');
      }

      const responseData: GeminiResponse = await response.json();
      setData(responseData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-5xl mx-auto animate-fade-up">
      {/* Premium Glass Header */}
      <header className="w-full flex justify-between items-center mb-10 glass-panel px-6 py-4 rounded-2xl relative overflow-hidden">
        {/* Subtle glow behind the header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 blur-xl bg-medical-cyan/50" />
        
        <div className="flex items-center gap-4 text-medical-cyan relative z-10 transition-transform hover:scale-105 duration-300">
          <ShieldPlus size={40} className="animate-pulse-fast drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white m-0 flex items-center gap-2">
            Med-Pass <span className="text-medical-cyan text-glow-cyan">HUD</span>
          </h1>
        </div>
        <div className="text-xs md:text-sm rounded-full border border-medical-cyan/30 px-4 py-1.5 bg-medical-cyan/10 hidden sm:flex items-center gap-2 tracking-[0.2em] font-mono-hud text-medical-cyan animate-breathe drop-shadow-md">
           <div className="w-2 h-2 rounded-full bg-medical-cyan animate-pulse-fast shadow-[0_0_10px_rgba(0,240,255,1)]" />
           U-BRIDGE ACTIVE
        </div>
      </header>

      <main className="w-full flex-grow space-y-8">
        <Scanner onCapture={handleCapture} isProcessing={isProcessing} />

        {isProcessing && (
          <div className="glass-panel p-8 rounded-2xl border-2 border-medical-cyan/50 text-center flex flex-col items-center justify-center animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-medical-cyan/5 blur-3xl rounded-full" />
            <div className="w-16 h-16 border-4 border-medical-cyan/30 border-t-medical-cyan rounded-full animate-spin mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
            <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-medical-cyan mb-2 text-glow-cyan">Neural Processing...</h2>
            <p className="text-medical-cyan/70 font-mono-hud text-sm tracking-widest">Cross-referencing intent against medical history stack</p>
          </div>
        )}

        {error && (
          <div className="bg-medical-red/10 text-medical-red p-6 rounded-2xl border-2 border-medical-red/50 text-center font-bold font-mono-hud tracking-[0.1em] box-glow-red relative overflow-hidden">
             <div className="absolute inset-0 bg-medical-red/5 blur-xl" />
            <span className="relative z-10">CRITICAL ERROR: {error}</span>
          </div>
        )}

        <MedicalHUD data={data} />
      </main>
    </div>
  );
}

export default App;
