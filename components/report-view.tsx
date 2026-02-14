"use client"

import { BaziOverview } from "@/components/report/bazi-overview"
import { KLineChart } from "@/components/report/kline-chart"
import { HorseYearCard } from "@/components/report/horse-year-card"
import { RadarChart } from "@/components/report/radar-chart"
import { AdviceCard } from "@/components/report/advice-card"
import { ArrowLeft, Share2, RotateCcw } from "lucide-react"
import type { ReportData } from "@/lib/types"

interface ReportViewProps {
  report: ReportData
  onBack: () => void
}

export function ReportView({ report, onBack }: ReportViewProps) {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "#FAF8F3" }}>
      {/* Top ink decoration - 80px, opacity 0.2 */}
      <div
        className="w-full overflow-hidden"
        style={{ height: 80, opacity: 0.12 }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d="M0 50 Q50 10 100 40 T200 30 T300 45 T400 35" fill="none" stroke="#2C3E50" strokeWidth="0.8" />
          <path d="M0 60 Q60 20 120 50 T240 35 T360 55 T400 42" fill="none" stroke="#2C3E50" strokeWidth="0.5" />
          <path d="M0 70 Q80 40 160 60 T320 50 T400 62" fill="none" stroke="#2C3E50" strokeWidth="0.3" />
        </svg>
      </div>

      {/* Floating back button - spec: 40x40, top-16, left-16 */}
      <div className="fixed z-50" style={{ top: 16, left: 16 }}>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center transition-all active:scale-95"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="返回首页"
        >
          <ArrowLeft style={{ width: 20, height: 20, color: "#2C3E50" }} />
        </button>
      </div>

      {/* Floating share button */}
      <div className="fixed z-50" style={{ top: 16, right: 16 }}>
        <button
          type="button"
          onClick={() => {
            if (typeof navigator !== "undefined" && navigator.share) {
              navigator.share({
                title: "红线运势报告",
                url: window.location.href,
              })
            }
          }}
          className="flex items-center justify-center transition-all active:scale-95"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="分享"
        >
          <Share2 style={{ width: 20, height: 20, color: "#2C3E50" }} />
        </button>
      </div>

      {/* Report content */}
      <div style={{ padding: "0 16px 40px" }}>
        {/* Title */}
        <div className="text-center" style={{ marginBottom: 24 }}>
          <h1
            className="font-serif"
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#2C3E50",
              letterSpacing: "0.15em",
            }}
          >
            {"红线运势报告"}
          </h1>
          <p style={{ fontSize: 13, color: "#95A5A6", marginTop: 6 }}>
            {report.mode === "double"
              ? `${report.person1.name} & ${report.person2?.name}`
              : report.person1.name}
            {" \u00B7 "}
            {new Date(report.createdAt).toLocaleDateString("zh-CN")}
          </p>
          <div className="mx-auto flex items-center justify-center" style={{ marginTop: 12, gap: 12 }}>
            <div style={{ height: 1, width: 40, backgroundColor: "rgba(192,57,43,0.2)" }} />
            <div
              style={{
                width: 6,
                height: 6,
                backgroundColor: "rgba(192,57,43,0.3)",
                transform: "rotate(45deg)",
              }}
            />
            <div style={{ height: 1, width: 40, backgroundColor: "rgba(192,57,43,0.2)" }} />
          </div>
        </div>

        {/* Report Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <BaziOverview
            bazi={report.overview.bazi}
            verdict={report.overview.verdict}
            personName={report.person1.name}
          />
          <KLineChart
            data={report.kLineData}
            isDouble={report.mode === "double"}
          />
          <HorseYearCard analysis={report.horseYearAnalysis} />
          <RadarChart data={report.radarData} />
          <AdviceCard advice={report.advice} />
        </div>

        {/* Footer disclaimer */}
        <div className="text-center" style={{ marginTop: 32 }}>
          <div className="mx-auto flex items-center justify-center" style={{ gap: 12 }}>
            <div style={{ height: 1, width: 40, backgroundColor: "#ECF0F1" }} />
            <span
              className="font-serif"
              style={{ fontSize: 11, color: "#BDC3C7", letterSpacing: "0.15em" }}
            >
              {"红线运势 \u00B7 丙午年"}
            </span>
            <div style={{ height: 1, width: 40, backgroundColor: "#ECF0F1" }} />
          </div>
          <p style={{ fontSize: 11, color: "#BDC3C7", marginTop: 6 }}>
            {"此报告由 AI 生成，仅供娱乐参考"}
          </p>
        </div>

        {/* Bottom action button */}
        <div style={{ marginTop: 32 }}>
          <button
            type="button"
            onClick={onBack}
            className="w-full flex items-center justify-center font-serif transition-all active:scale-[0.98]"
            style={{
              height: 52,
              borderRadius: 12,
              backgroundColor: "#FFFFFF",
              border: "2px solid rgba(192, 57, 43, 0.3)",
              color: "#C0392B",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.1em",
              gap: 8,
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            <RotateCcw style={{ width: 16, height: 16 }} />
            {"返回首页 / 开启新测算"}
          </button>
        </div>
      </div>
    </div>
  )
}
