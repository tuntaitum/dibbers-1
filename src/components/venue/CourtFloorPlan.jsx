import React from "react";

const sportStyles = {
  Padel: { selectedBg: "bg-brand-orange", selectedText: "text-white", label: "rgba(255,255,255,0.7)" },
  Squash: { selectedBg: "bg-brand-green", selectedText: "text-white", label: "rgba(255,255,255,0.7)" },
  Pickleball: { selectedBg: "bg-brand-sky", selectedText: "text-brand-brown", label: "rgba(93,55,42,0.6)" },
};

export default function CourtFloorPlan({ courts = [], selectedCourt, onSelect }) {
  if (courts.length === 0) return null;

  return (
    <div className="relative rounded-2xl border border-border overflow-hidden" style={{ background: "#F2EFE8" }}>
      {/* Grid background pattern — gives the "blueprint" feel */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between px-3 pt-2.5 pb-1">
        <span className="text-[9px] font-light tracking-[0.15em] uppercase text-[#1a1a1a]/35">
          Floor Plan
        </span>
        <span className="text-[9px] font-light text-[#1a1a1a]/35">↓ Entrance</span>
      </div>

      {/* Court grid */}
      <div className="relative z-10 grid grid-cols-2 gap-2.5 p-3 pt-1">
        {courts.map((court) => {
          const isSelected = selectedCourt?.id === court.id;
          const sport = sportStyles[court.sport] || sportStyles.Padel;
          return (
            <button
              key={court.id}
              onClick={() => onSelect(court)}
              className={`relative aspect-[5/3] rounded-lg border-2 transition-all duration-200 overflow-hidden active:scale-[0.97] ${
                isSelected
                  ? `${sport.selectedBg} ${sport.selectedText} shadow-md scale-[1.02]`
                  : "bg-white border-[#1a1a1a]/10 hover:border-brand-orange/40 hover:shadow-sm"
              }`}
            >
              {/* Net line */}
              <div
                className={`absolute top-1/2 left-3 right-3 -translate-y-1/2 border-t-2 border-dashed ${
                  isSelected ? "border-white/50" : "border-[#1a1a1a]/10"
                }`}
              />
              {/* Center service line */}
              <div
                className="absolute top-3 bottom-3 left-1/2 -translate-x-1/2 w-px"
                style={{
                  backgroundColor: isSelected ? "rgba(255,255,255,0.25)" : "rgba(26,26,26,0.08)",
                }}
              />

              {/* Court name */}
              <span
                className={`absolute top-1.5 left-2 text-[10px] font-bold leading-none ${
                  isSelected ? sport.selectedText : "text-[#1a1a1a]/55"
                }`}
              >
                {court.name}
              </span>

              {/* Selected dot indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1.5 w-4 h-4 rounded-full bg-white/25 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              )}

              {/* Bottom info: sport + price */}
              <div className="absolute bottom-1.5 left-2 right-2 flex items-end justify-between">
                <span
                  className="text-[8px] font-medium leading-none"
                  style={{ color: isSelected ? sport.label : "rgba(26,26,26,0.35)" }}
                >
                  {court.sport}
                </span>
                <span
                  className={`text-[10px] font-bold leading-none ${
                    isSelected ? sport.selectedText : "text-brand-orange"
                  }`}
                >
                  ฿{court.price_per_hour}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}