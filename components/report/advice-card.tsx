"use client"

import { Scroll } from "lucide-react"
import { FormattedText } from "@/components/formatted-text"

interface AdviceCardProps {
  advice: string
}

export function AdviceCard({ advice }: AdviceCardProps) {
  return (
    <section
      style={{
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-center" style={{ gap: 10, marginBottom: 14 }}>
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 36,
            height: 36,
            backgroundColor: "#F9E7E5",
            border: "1px solid rgba(192, 57, 43, 0.2)",
          }}
        >
          <Scroll style={{ width: 16, height: 16, color: "#C0392B" }} />
        </div>
        <div>
          <h3
            className="font-serif"
            style={{ fontSize: 18, fontWeight: 600, color: "#2C3E50" }}
          >
            {"情感锦囊"}
          </h3>
          <p style={{ fontSize: 11, color: "#95A5A6" }}>{"感情综合建议"}</p>
        </div>
      </div>

      {/* Advice content */}
      <div
        style={{
          padding: 14,
          backgroundColor: "#FAF8F3",
          borderRadius: 8,
          border: "1px solid #ECF0F1",
        }}
      >
        <FormattedText text={advice} />
      </div>

      {/* Seal decoration */}
      <div className="flex justify-end" style={{ marginTop: 12 }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: 4,
            border: "1px solid rgba(192, 57, 43, 0.25)",
            backgroundColor: "rgba(192, 57, 43, 0.03)",
            transform: "rotate(6deg)",
          }}
        >
          <span
            className="font-serif text-center whitespace-pre-line"
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#C0392B",
              letterSpacing: "0.1em",
              lineHeight: 1.3,
            }}
          >
            {"缘定\n今生"}
          </span>
        </div>
      </div>
    </section>
  )
}
