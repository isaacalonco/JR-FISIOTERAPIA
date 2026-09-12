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
    sm: { width: 32, height: 32, text: "text-base", sub: "text-[10px]" },
    md: { width: 44, height: 44, text: "text-xl", sub: "text-xs" },
    lg: { width: 64, height: 64, text: "text-2xl", sub: "text-sm" },
    xl: { width: 96, height: 96, text: "text-4xl", sub: "text-base" },
  }[size];

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center p-1 rounded-2xl bg-gradient-to-br from-[#011733] to-[#010F25] border border-[#C1801F]/40 shadow-lg shadow-[#E5A838]/10 group">
        {/* Standard img tag for static public asset to avoid Webpack module interop mismatches */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="JR Saúde Logo"
          width={dimensions.width}
          height={dimensions.height}
          className="object-contain filter drop-shadow-[0_2px_8px_rgba(229,168,56,0.35)] transition-transform group-hover:scale-105"
        />
      </div>
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-gold-gradient ${dimensions.text}`}>
              JR SAÚDE
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#C1801F]/20 text-[#F5CD67] border border-[#C1801F]/40">
              v1.0
            </span>
          </div>
          {subtitle && (
            <span className={`text-[#E3DCBE]/70 font-medium leading-none mt-0.5 ${dimensions.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
