import { useState, useRef } from 'react';
import { UploadCloud, FileText, Image, File as FileIcon, X, Send } from 'lucide-react';

interface ScannerProps {
  onCapture: (files: File[], intentText: string) => void;
  isProcessing: boolean;
}

export const Scanner = ({ onCapture, isProcessing }: ScannerProps) => {
  const [intentText, setIntentText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={24} className="text-blue-400" />;
    if (type === 'application/pdf') return <FileText size={24} className="text-red-400" />;
    return <FileIcon size={24} className="text-gray-400" />;
  };

  const submitInputs = () => {
    if (files.length === 0 && !intentText.trim()) return;
    onCapture(files, intentText);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-medical-cyan/5 rounded-full blur-3xl -z-10 group-hover:bg-medical-cyan/10 transition-colors duration-700" />
      
      <div className="relative z-10">
        <label className="flex items-center gap-2 text-medical-cyan text-sm font-bold uppercase tracking-[0.15em] mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-medical-cyan animate-pulse-fast" /> Paramedic Intent Log
        </label>
        <div className="relative">
          <textarea
            value={intentText}
            rows={12}
            cols={100}
            onChange={(e) => setIntentText(e.target.value)}
            placeholder="e.g. Preparing to administer 50mg of Penicillin IV push...&#10;&#10;(Type out the paramedic's intended action or paste detailed medical records logs here)"
            className="w-full bg-black/40 border border-medical-cyan/20 rounded-xl p-5 pb-10 text-white placeholder-gray-600 min-h-[400px] focus:outline-none focus:border-medical-cyan/60 focus:ring-1 focus:ring-medical-cyan/50 transition-all font-mono-hud text-sm md:text-base resize shadow-inner"
          />
          <div className="absolute bottom-4 right-4 text-xs text-medical-cyan/40 font-mono-hud pointer-events-none">VOICE/TEXT DIRECTIVE</div>
        </div>
      </div>

      <div className="relative z-10">
        <label 
          htmlFor="medical-records-upload"
          className="flex items-center gap-2 text-medical-cyan text-sm font-bold uppercase tracking-[0.15em] mb-4 cursor-pointer"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-medical-cyan animate-pulse-fast" /> Medical Records Feed
        </label>
        
        <div 
          className="relative border-2 border-dashed border-medical-cyan/30 rounded-xl p-10 text-center cursor-pointer hover:border-medical-cyan hover:bg-medical-cyan/5 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden group/dropzone"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="absolute inset-0 bg-medical-cyan/0 group-hover/dropzone:bg-medical-cyan/5 transition-colors duration-500" />
          <UploadCloud size={56} className="text-medical-cyan/50 mb-4 group-hover/dropzone:text-medical-cyan transition-colors duration-300 animate-breathe drop-shadow-md" />
          <p className="text-white font-bold tracking-wide text-lg relative z-10">INITIALIZE SECURE UPLOAD</p>
          <p className="text-medical-cyan/60 font-mono-hud text-sm mt-2 tracking-widest relative z-10">Supports image, pdf, txt extraction</p>
          <input 
            id="medical-records-upload"
            type="file" 
            ref={fileInputRef} 
            multiple 
            accept="image/*,.pdf,.txt" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </div>

        {files.length > 0 && (
          <ul className="mt-6 space-y-3 relative z-10">
            {files.map((f, i) => (
              <li key={i} className="flex justify-between items-center bg-black/60 p-4 rounded-xl border border-medical-cyan/20 hover:border-medical-cyan/40 transition-colors group/item shadow-lg">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-2 bg-medical-cyan/10 rounded-lg group-hover/item:bg-medical-cyan/20 transition-colors">
                     {getFileIcon(f.type)}
                  </div>
                  <span className="text-gray-200 font-mono-hud text-sm truncate tracking-wide">{f.name}</span>
                </div>
                <button onClick={() => removeFile(i)} className="text-gray-500 hover:text-medical-red transition-colors p-2 rounded-lg hover:bg-medical-red/10 focus:outline-none">
                  <X size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={submitInputs}
        disabled={isProcessing || (files.length === 0 && !intentText.trim())}
        className="relative w-full overflow-hidden flex items-center justify-center gap-3 bg-medical-cyan/20 hover:bg-medical-cyan/30 border border-medical-cyan/50 disabled:bg-gray-800 disabled:border-gray-700 disabled:text-gray-600 focus:outline-none text-medical-cyan p-5 rounded-xl font-black tracking-[0.2em] uppercase transition-all duration-300 active:scale-[0.98] group/btn shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] disabled:shadow-none"
      >
        {isProcessing ? (
          <>
            <div className="w-6 h-6 border-2 border-medical-cyan border-t-transparent rounded-full animate-spin drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            <span className="text-glow-cyan z-10">ENGAGING NEURAL LINK...</span>
          </>
        ) : (
          <>
            <Send size={22} className="relative z-10 group-hover/btn:translate-x-1 transition-transform drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" /> 
            <span className="relative z-10 text-glow-cyan">EXECUTE CROSS-REFERENCE</span>
          </>
        )}
      </button>

    </div>
  );
};
