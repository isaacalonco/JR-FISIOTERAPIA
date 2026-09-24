import React from "react";

interface JRLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string;
}

export function JRLogo({
  className = "",
  size = "md",
  showText = true,
  subtitle = "Gestão Clínica & Multidisciplinar",
}: JRLogoProps) {
  const dimensions = {
    sm: { width: 28, height: 28, text: "text-xs", sub: "text-[9px]" },
    md: { width: 36, height: 36, text: "text-sm", sub: "text-[10px]" },
    lg: { width: 52, height: 52, text: "text-base sm:text-lg", sub: "text-xs" },
    xl: { width: 72, height: 72, text: "text-2xl sm:text-3xl", sub: "text-sm" },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 font-sans ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="JR Fisioterapia Logo"
          width={dimensions.width}
          height={dimensions.height}
          className="object-contain filter drop-shadow-[0_2px_8px_rgba(229,168,56,0.35)] transition-transform group-hover:scale-105"
        />
      </div>
      {showText && (
        <div className="flex flex-col justify-center text-left min-w-0">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className={`font-black tracking-tight text-gold-gradient ${dimensions.text}`}>
              JR FISIOTERAPIA
            </span>
            <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-[#C1801F]/20 text-[#F5CD67] border border-[#C1801F]/40 leading-none shrink-0">
              v1.0
            </span>
          </div>
          {subtitle && (
            <span className={`text-[#E3DCBE]/70 font-medium leading-tight truncate ${dimensions.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
