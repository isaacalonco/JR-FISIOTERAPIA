"use client";

import React, { useState } from "react";
import { formatCurrencyBRL } from "@/utils/formatters";
import { Calculator, Percent, User, Calendar, Award } from "lucide-react";

interface ProfessionalOption {
  id: string;
  name: string;
  specialtyName: string;
  commissionRate: number;
}

interface PayoutCalculatorProps {
  professionals: ProfessionalOption[];
}

export default function PayoutCalculator({ professionals }: PayoutCalculatorProps) {
  const [selectedProfId, setSelectedProfId] = useState<string>(professionals[0]?.id || "");
  const [volume, setVolume] = useState<number>(2500);

  const selectedProf = professionals.find((p) => p.id === selectedProfId) || professionals[0];
  const rate = selectedProf ? selectedProf.commissionRate : 0;
  const payout = (volume * rate) / 100;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-cyan-400" />
          Simulador e Fechamento de Repasses Profissionais
        </h3>
        <span className="text-xs text-slate-400">Regras dinâmicas por comissão</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4 text-xs col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-300">Profissional da Saúde</label>
              <select
                value={selectedProfId}
                onChange={(e) => setSelectedProfId(e.target.value)}
                className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.specialtyName} - {p.commissionRate}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-300">Volume Total de Serviços (R$)</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Calculation Output Card */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Repasse Líquido Devido
            </span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              {formatCurrencyBRL(payout)}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 space-y-1">
            <div className="flex justify-between">
              <span>Taxa de Comissão:</span>
              <strong className="text-cyan-400">{rate}%</strong>
            </div>
            <div className="flex justify-between">
              <span>Retenção Clínica:</span>
              <strong className="text-slate-300">{formatCurrencyBRL(volume - payout)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
