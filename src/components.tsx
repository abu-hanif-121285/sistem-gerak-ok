import React from "react";
import { CheckCircle2, ChevronRight, Sparkles, Trophy } from "lucide-react";
import { useStore } from "./store";
import { Art, type ArtKey } from "./art";

function headerArtwork(title: string): ArtKey | null {
  if (title.includes("Laboratorium")) return "lab";
  if (title.includes("Penyakit")) return "spine";
  if (title.includes("Kesehatan")) return "health";
  if (title.includes("Kuis") || title.includes("Tantangan") || title.includes("Progres")) return "trophy";
  if (title.includes("Sendi")) return "joint";
  if (title.includes("Otot")) return "muscle";
  if (title.includes("Bergerak")) return "movement";
  if (title.includes("Sistem Gerak")) return "system";
  if (title.includes("Rangka")) return "bone";
  if (title.includes("Tujuan")) return "lab";
  if (title.includes("Latihan")) return "system";
  if (title.includes("Glosarium")) return "bone";
  return null;
}

export function PageHeader({ icon, title, sub, color = "from-blue-600 to-cyan-500" }: { icon: string; title: string; sub: string; color?: string }) {
  const artwork = headerArtwork(title);
  return (
    <div className={`rounded-3xl bg-gradient-to-r ${color} p-5 md:p-7 text-white card-shadow-lg relative overflow-hidden mb-5 min-h-[138px] flex items-center`}>
      <div className="absolute inset-0 pattern-dots opacity-40" />
      {artwork && (
        <div className="absolute inset-y-0 right-0 w-[45%] md:w-[34%] pointer-events-none opacity-75" style={{ maskImage: "linear-gradient(to right, transparent, black 48%)" }}>
          <Art name={artwork} className="w-full h-full" />
        </div>
      )}
      <div className="relative z-10 max-w-[85%] md:max-w-[72%]">
        <div className="flex items-center gap-2 text-[11px] md:text-xs font-black text-white/85 mb-1.5 tracking-wide">
          <span>SCIENCE BODY EXPLORER</span>
          <ChevronRight size={13} />
          <span>SISTEM GERAK MANUSIA</span>
        </div>
        <h1 className="font-display text-2xl md:text-[2.15rem] md:leading-tight font-bold flex items-center gap-2.5 page-heading-3d"><span className="shrink-0">{icon}</span> {title}</h1>
        <p className="text-white/95 font-bold mt-1 text-xs md:text-sm max-w-2xl leading-relaxed">{sub}</p>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-3xl card-shadow p-4 md:p-6 ${className}`}>{children}</div>;
}

export function ProgressBar({ value, color = "from-emerald-400 to-green-500", height = "h-3" }: { value: number; color?: string; height?: string }) {
  return (
    <div className={`w-full bg-slate-100 rounded-full ${height} overflow-hidden`}>
      <div className={`bg-gradient-to-r ${color} ${height} rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Feedback({ ok, text, explain }: { ok: boolean | null; text?: string; explain?: string }) {
  if (ok === null) return null;
  return (
    <div className={`animate-pop-in rounded-2xl p-4 mt-3 border-2 ${ok ? "bg-green-50 border-green-300" : "bg-amber-50 border-amber-300"}`}>
      <div className={`font-display font-bold flex items-center gap-2 ${ok ? "text-green-700" : "text-amber-700"}`}>
        {ok ? "🎉 Hebat! Jawabanmu benar." : "💡 Belum tepat. Yuk, pelajari kembali konsepnya."}
      </div>
      {text && <div className="font-bold text-sm mt-1">{text}</div>}
      {explain && <div className="text-sm mt-1 text-slate-600 font-semibold bg-white/70 rounded-xl p-2">💬 Pembahasan: {explain}</div>}
    </div>
  );
}

export function CompleteButton({ missionId, label = "Tandai Selesai & Lanjut", xp = 100 }: { missionId: string; label?: string; xp?: number }) {
  const { s, completeMateri } = useStore();
  const [celebrate, setCelebrate] = React.useState<string | null>(null);
  const done = s.completed.includes(missionId);
  const badgeId = ((): string | null => {
    const map: Record<string, string> = { rangka: "rangka", sendi: "sendi", otot: "otot", mekanik: "gerak", penyakit: "detektif", sehat: "penjaga" };
    return map[missionId] ?? null;
  })();
  const badgeInfo = badgeId ? { rangka: { icon: "🦴", name: "Penjelajah Rangka" }, sendi: { icon: "🔗", name: "Master Sendi" }, otot: { icon: "💪", name: "Ahli Otot" }, gerak: { icon: "🏃", name: "Jago Gerak" }, detektif: { icon: "🩺", name: "Detektif Kesehatan" }, penjaga: { icon: "❤️", name: "Penjaga Tubuh" } }[badgeId as "rangka"] : null;

  const handleClick = () => {
    const hadBadge = badgeId ? (s.badges as string[]).includes(badgeId) : true;
    completeMateri(missionId, xp);
    if (badgeId && !hadBadge && badgeInfo) {
      setCelebrate(badgeId);
      setTimeout(() => setCelebrate(null), 5000);
    }
  };

  if (done) {
    const hasBadge = badgeId ? (s.badges as string[]).includes(badgeId) : true;
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-green-100 text-green-700 font-display font-bold px-5 py-3 rounded-2xl border-2 border-green-300">
          <CheckCircle2 size={20} /> ✅ SELESAI — Kamu hebat!
        </div>
        {badgeId && badgeInfo && (
          <div className={`flex items-center gap-2 font-display font-bold text-sm px-4 py-2 rounded-2xl border-2 ${hasBadge ? "bg-amber-50 text-amber-700 border-amber-300" : "bg-red-50 text-red-600 border-red-300"}`}>
            <span className="text-xl">{hasBadge ? badgeInfo.icon : "🔒"}</span>
            {hasBadge ? `🏅 Badge ${badgeInfo.name} terbuka!` : "⏳ Badge belum terbuka — coba muat ulang"}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <button onClick={handleClick} className="btn-shine bg-gradient-to-r from-emerald-500 to-green-500 text-white font-display font-bold px-6 py-3 rounded-2xl card-shadow hover:scale-105 transition-transform flex items-center gap-2">
        <CheckCircle2 size={20} /> {label} (+{xp} XP){badgeInfo ? ` + 🏅` : ""}
      </button>
      {badgeInfo && <div className="text-xs font-bold text-slate-500">Menyelesaikan misi ini membuka badge <b>{badgeInfo.icon} {badgeInfo.name}</b> (+200 XP)</div>}
      {celebrate && badgeInfo && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50" onClick={() => setCelebrate(null)}>
          <div className="animate-pop-in bg-white rounded-3xl p-6 max-w-xs w-full text-center card-shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="text-6xl animate-bounce-soft">{badgeInfo.icon}</div>
            <div className="font-display font-black text-xl mt-2">Badge Terbuka! 🎉</div>
            <div className="font-display font-bold text-amber-600">🏅 {badgeInfo.name}</div>
            <p className="text-xs font-bold text-slate-500 mt-1">+200 XP • Lihat di Beranda & Progres</p>
            <button onClick={() => setCelebrate(null)} className="mt-3 w-full bg-amber-500 text-white font-display font-bold py-2.5 rounded-2xl">Hore! 🎉</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Avatar({ kind, size = 64 }: { kind: "boy" | "girl"; size?: number }) {
  return (
    <img
      src={`images/avatar-${kind}.png`}
      alt={kind === "girl" ? "Avatar siswi berhijab panjang dan bergamis" : "Avatar siswa berpakaian sopan"}
      width={size}
      height={size}
      className="rounded-full border-[3px] border-white object-cover bg-blue-100 shadow-[0_3px_12px_rgba(7,42,112,.25)] shrink-0"
      style={{ width: size, height: size, objectPosition: "center 24%" }}
    />
  );
}

export function Mascot({ size = 90 }: { size?: number }) {
  return (
    <img
      src="images/avatar-girl.png"
      alt="Pemandu sains memakai hijab panjang dan gamis"
      width={size}
      height={size}
      className="animate-floaty rounded-2xl object-cover border-2 border-white/70 shadow-lg"
      style={{ width: size, height: size, objectPosition: "center 30%" }}
    />
  );
}

export function XPPill({ xp }: { xp: number }) {
  return (
    <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-display font-bold px-3 py-1.5 rounded-full card-shadow text-sm">
      <Sparkles size={16} /> {xp.toLocaleString()} XP
    </div>
  );
}

export function LevelPill({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-display font-bold px-3 py-1.5 rounded-full card-shadow text-sm">
      <Trophy size={16} /> Level {level}
    </div>
  );
}

export function QuizOption({ label, selected, correct, showResult, onClick, prefix }: { label: string; selected: boolean; correct?: boolean; showResult: boolean; onClick: () => void; prefix: string }) {
  let cls = "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50";
  if (showResult && correct) cls = "border-green-400 bg-green-100";
  else if (showResult && selected && !correct) cls = "border-red-300 bg-red-50";
  else if (selected) cls = "border-blue-500 bg-blue-100";
  return (
    <button onClick={onClick} disabled={showResult} className={`w-full text-left border-2 rounded-2xl p-3.5 font-bold text-sm md:text-base transition-all flex items-center gap-3 ${cls}`}>
      <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-display font-bold text-white ${showResult && correct ? "bg-green-500" : selected ? "bg-blue-600" : "bg-slate-400"}`}>{prefix}</span>
      <span className="flex-1">{label}</span>
      {showResult && correct && <span>✅</span>}
      {showResult && selected && !correct && <span>❌</span>}
    </button>
  );
}
