"use client";

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
    sm: { width: 36, height: 36, text: "text-base", sub: "text-[10px]" },
    md: { width: 48, height: 48, text: "text-xl", sub: "text-xs" },
    lg: { width: 72, height: 72, text: "text-2xl", sub: "text-sm" },
    xl: { width: 104, height: 104, text: "text-4xl", sub: "text-base" },
  }[size];

  return (
    <div className={`flex items-center gap-3 font-sans ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="JR Fisioterapia Logo"
          width={dimensions.width}
          height={dimensions.height}
          className="object-contain filter drop-shadow-[0_2px_10px_rgba(229,168,56,0.35)] transition-transform group-hover:scale-105"
        />
      </div>
      {showText && (
        <div className="flex flex-col justify-center text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-gold-gradient ${dimensions.text}`}>
              JR FISIOTERAPIA
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#C1801F]/20 text-[#F5CD67] border border-[#C1801F]/40">
              v1.0
            </span>
          </div>
          {subtitle && (
            <span className={`text-[#E3DCBE]/70 font-medium leading-none mt-1 ${dimensions.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
