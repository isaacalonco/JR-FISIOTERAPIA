"use client";

import React, { useState } from "react";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { exportReportCSVAction } from "@/app/actions/reports.actions";

interface ExportButtonProps {
  reportType: "FINANCIAL" | "PRODUCTIVITY";
  label: string;
}

export default function ExportReportButton({ reportType, label }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await exportReportCSVAction(reportType);
      if (res.success && res.csvContent && res.filename) {
        const blob = new Blob([res.csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", res.filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(res.error || "Erro ao exportar relatório.");
      }
    } catch (err) {
      alert("Erro ao realizar o download do relatório.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="px-3.5 py-2 rounded-xl bg-[#011733] border border-[#C1801F]/40 hover:bg-[#011733]/80 text-[#E3DCBE] hover:text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 text-[#F5CD67] animate-spin" />
      ) : (
        <FileSpreadsheet className="w-4 h-4 text-[#F5CD67]" />
      )}
      <span>{label}</span>
    </button>
  );
}
