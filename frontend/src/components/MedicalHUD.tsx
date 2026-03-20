import type { GeminiResponse } from '../types';
import { AlertTriangle, CheckCircle2, ShieldAlert, Activity } from 'lucide-react';

interface MedicalHUDProps {
  data: GeminiResponse | null;
}

export const MedicalHUD: React.FC<MedicalHUDProps> = ({ data }) => {
  if (!data) return null;

  const isCritical = data.alert.status === "CRITICAL";
  const isWarning = data.alert.status === "WARNING";
  
  const alertStyles = isCritical 
    ? "bg-medical-red/10 border-medical-red text-medical-red box-glow-red" 
    : isWarning 
      ? "bg-[#eab308]/10 border-[#eab308] text-[#eab308] drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
      : "bg-medical-green/10 border-medical-green text-medical-green drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]";

  const renderList = (items: { name: string, verified: boolean }[], title: string, fallback: string, delayIndex: number) => (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 animate-fade-up" style={{ animationDelay: `${delayIndex * 150}ms`, animationFillMode: 'both' }}>
      <h3 className="text-medical-cyan/70 text-xs font-black uppercase tracking-[0.2em] mb-4 flex justify-between items-center border-b border-white/5 pb-2">
        {title} 
        <span className="text-[10px] bg-medical-cyan/10 text-medical-cyan border border-medical-cyan/20 px-2 py-0.5 rounded-full font-mono-hud">{items.length} records</span>
      </h3>
      {items.length === 0 ? (
        <p className="text-gray-600 text-sm italic font-mono-hud">{fallback}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center justify-between text-white p-3 bg-black/40 rounded-xl border border-white/5 hover:border-medical-cyan/30 transition-colors group">
              <span className="font-bold text-lg tracking-wide group-hover:text-medical-cyan transition-colors">{item.name}</span>
              {item.verified ? (
                <span className="flex items-center gap-1.5 text-[10px] text-medical-cyan uppercase tracking-[0.2em] font-black bg-medical-cyan/10 px-2 py-1 rounded">
                  <CheckCircle2 size={12} /> VERIFIED
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[10px] text-[#eab308] uppercase tracking-[0.2em] font-black bg-[#eab308]/10 px-2 py-1 rounded">
                  <ShieldAlert size={12} /> INFERRED
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 mt-8">
      {/* Alert Banner */}
      <div className={`relative overflow-hidden border-2 p-6 md:p-8 rounded-2xl shadow-2xl animate-fade-up ${alertStyles}`}>
        {isCritical && <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDQwbDQwLTQwSDB6TTQwIDBMMCA0MGg0MHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-50 pointer-events-none" />}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10 transition-transform hover:scale-[1.02] duration-300">
          <div className="p-4 bg-black/40 rounded-full border border-current shadow-inner">
             {isCritical ? <AlertTriangle size={48} className="animate-breathe" /> : <Activity size={48} />}
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2" style={{ textShadow: '0 0 20px currentColor' }}>
              ALERT: {data.alert.status}
            </h2>
            <p className="font-medium leading-relaxed text-lg md:text-xl opacity-90 font-mono-hud tracking-wide">{data.alert.message}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl animate-fade-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
        <h3 className="text-medical-cyan/70 text-xs font-black uppercase tracking-[0.2em] mb-3">Transcribed Medical Intent</h3>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-medical-cyan rounded-l animate-pulse-fast drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          <p className="text-lg md:text-xl text-white font-mono-hud bg-black/60 p-4 pl-6 rounded-r-xl border border-transparent hover:border-medical-cyan/30 transition-colors">
            $ {data.transcription}
            <span className="inline-block w-2 h-5 bg-medical-cyan ml-2 animate-pulse align-middle" />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderList(data.medicalRecord.allergies, "Known Allergies", "No allergies detected", 2)}
        {renderList(data.medicalRecord.medications, "Active Medications", "No active medications detected", 3)}
        <div className="md:col-span-2">
          {renderList(data.medicalRecord.conditions, "Underlying Conditions", "No underlying conditions detected", 4)}
        </div>
      </div>
    </div>
  );
};
