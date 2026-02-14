"use client"

import { Heart, Sparkles } from "lucide-react"

interface PeachBlossomYear {
  year: number
  intensity: string
  person_type: string
  reason: string
}

interface PeachBlossomYearsProps {
  years: PeachBlossomYear[]
}

export function PeachBlossomYears({ years }: PeachBlossomYearsProps) {
  const getIntensityColor = (intensity: string) => {
    if (intensity === "极旺") return "#E74C3C"
    if (intensity === "旺") return "#E67E22"
    return "#F39C12"
  }

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
      <div className="flex items-center" style={{ gap: 10, marginBottom: 16 }}>
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 36,
            height: 36,
            backgroundColor: "#FCE4EC",
            border: "1px solid rgba(233, 30, 99, 0.2)",
          }}
        >
          <Heart style={{ width: 16, height: 16, color: "#E91E63" }} />
        </div>
        <div>
          <h3
            className="font-serif"
            style={{ fontSize: 18, fontWeight: 600, color: "#2C3E50" }}
          >
            {"桃花旺年"}
          </h3>
          <p style={{ fontSize: 11, color: "#95A5A6" }}>{"良缘易现之时"}</p>
        </div>
      </div>

      {/* Years list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {years.map((item, index) => (
          <div
            key={item.year}
            style={{
              padding: 14,
              backgroundColor: "#FAF8F3",
              borderRadius: 8,
              border: "1px solid #ECF0F1",
              position: "relative",
            }}
          >
            {/* Year and intensity badge */}
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <div className="flex items-center" style={{ gap: 8 }}>
                <span
                  className="font-serif"
                  style={{ fontSize: 16, fontWeight: 600, color: "#2C3E50" }}
                >
                  {item.year}年
                </span>
                <div
                  className="flex items-center rounded-full"
                  style={{
                    height: 22,
                    padding: "0 10px",
                    backgroundColor: `${getIntensityColor(item.intensity)}15`,
                    border: `1px solid ${getIntensityColor(item.intensity)}40`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: getIntensityColor(item.intensity),
                    }}
                  >
                    {item.intensity}
                  </span>
                </div>
              </div>
              <Sparkles
                style={{
                  width: 16,
                  height: 16,
                  color: getIntensityColor(item.intensity),
                  opacity: 0.6,
                }}
              />
            </div>

            {/* Person type */}
            <div
              className="flex items-center"
              style={{
                gap: 6,
                marginBottom: 8,
                padding: "6px 10px",
                backgroundColor: "#FFFFFF",
                borderRadius: 6,
                border: "1px dashed rgba(233, 30, 99, 0.2)",
              }}
            >
              <span style={{ fontSize: 12, color: "#E91E63", fontWeight: 500 }}>
                {"易遇："}
              </span>
              <span style={{ fontSize: 12, color: "#2C3E50", fontWeight: 500 }}>
                {item.person_type}
              </span>
            </div>

            {/* Reason */}
            <p style={{ fontSize: 12, lineHeight: 1.6, color: "#7F8C8D" }}>
              {item.reason}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom decoration */}
      <div className="flex items-center justify-center" style={{ marginTop: 14, gap: 8 }}>
        <div style={{ height: 1, width: 30, backgroundColor: "rgba(233, 30, 99, 0.2)" }} />
        <span
          className="font-serif"
          style={{ fontSize: 10, color: "rgba(233, 30, 99, 0.5)", letterSpacing: "0.15em" }}
        >
          {"良缘可期"}
        </span>
        <div style={{ height: 1, width: 30, backgroundColor: "rgba(233, 30, 99, 0.2)" }} />
      </div>
    </section>
  )
}
