"use client"

import { Flame } from "lucide-react"
import { FormattedText } from "@/components/formatted-text"

interface HorseYearCardProps {
  analysis: string
}

export function HorseYearCard({ analysis }: HorseYearCardProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        border: "2px solid #D4AF37",
        boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
      }}
    >
      {/* Corner decorations - golden */}
      <div
        className="absolute"
        style={{ top: 6, left: 6, width: 12, height: 12, borderTop: "2px solid #D4AF37", borderLeft: "2px solid #D4AF37" }}
      />
      <div
        className="absolute"
        style={{ top: 6, right: 6, width: 12, height: 12, borderTop: "2px solid #D4AF37", borderRight: "2px solid #D4AF37" }}
      />
      <div
        className="absolute"
        style={{ bottom: 6, left: 6, width: 12, height: 12, borderBottom: "2px solid #D4AF37", borderLeft: "2px solid #D4AF37" }}
      />
      <div
        className="absolute"
        style={{ bottom: 6, right: 6, width: 12, height: 12, borderBottom: "2px solid #D4AF37", borderRight: "2px solid #D4AF37" }}
      />

      {/* Header */}
      <div className="relative flex items-center" style={{ gap: 10, marginBottom: 14 }}>
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 36,
            height: 36,
            backgroundColor: "rgba(212, 175, 55, 0.1)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
          }}
        >
          <Flame style={{ width: 18, height: 18, color: "#E67E22" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-serif"
            style={{ fontSize: 18, fontWeight: 600, color: "#2C3E50" }}
          >
            {"丙午年特批"}
          </h3>
          <p style={{ fontSize: 11, color: "#D4AF37", fontWeight: 500, letterSpacing: "0.1em" }}>
            {"2026 \u00B7 火马之年"}
          </p>
        </div>
        <div
          className="shrink-0 flex items-center rounded-full"
          style={{
            height: 24,
            padding: "0 10px",
            backgroundColor: "rgba(212, 175, 55, 0.08)",
            border: "1px solid rgba(212, 175, 55, 0.25)",
          }}
        >
          <span
            className="font-serif"
            style={{ fontSize: 11, fontWeight: 500, color: "#D4AF37", letterSpacing: "0.1em" }}
          >
            {"午火当旺"}
          </span>
        </div>
      </div>

      {/* Analysis content */}
      <FormattedText text={analysis} />

      {/* Bottom decoration */}
      <div className="flex items-center justify-center" style={{ marginTop: 14, gap: 8 }}>
        <div style={{ height: 1, width: 40, backgroundColor: "rgba(212, 175, 55, 0.25)" }} />
        <span
          className="font-serif"
          style={{ fontSize: 11, color: "rgba(212, 175, 55, 0.6)", letterSpacing: "0.15em" }}
        >
          {"火马呈祥"}
        </span>
        <div style={{ height: 1, width: 40, backgroundColor: "rgba(212, 175, 55, 0.25)" }} />
      </div>
    </section>
  )
}
