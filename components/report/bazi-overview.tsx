"use client"

interface BaziOverviewProps {
  bazi: string[]
  verdict: string
  personName: string
}

export function BaziOverview({ bazi, verdict, personName }: BaziOverviewProps) {
  const pillars = ["年柱", "月柱", "日柱", "时柱"]

  return (
    <section
      style={{
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Title with left accent */}
      <div style={{ paddingLeft: 12, borderLeft: "3px solid #C0392B", marginBottom: 4 }}>
        <h3
          className="font-serif"
          style={{ fontSize: 18, fontWeight: 600, color: "#2C3E50" }}
        >
          {"命盘概览"}
        </h3>
      </div>
      <p style={{ fontSize: 13, color: "#5D6D7E", marginBottom: 16 }}>
        {personName}
        {"的八字排盘"}
      </p>

      {/* Bazi Pillars */}
      <div className="grid grid-cols-4" style={{ gap: 8, marginBottom: 16 }}>
        {bazi.map((pillar, i) => (
          <div
            key={pillars[i]}
            className="flex flex-col items-center"
            style={{
              padding: "12px 4px",
              backgroundColor: "#FAF8F3",
              borderRadius: 8,
              border: "1px solid #ECF0F1",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 11, color: "#95A5A6" }}>{pillars[i]}</span>
            <div className="flex flex-col items-center">
              <span
                className="font-serif"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#2C3E50",
                  letterSpacing: "0.1em",
                  lineHeight: 1.2,
                }}
              >
                {pillar[0]}
              </span>
              <span
                className="font-serif"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#C0392B",
                  letterSpacing: "0.1em",
                  lineHeight: 1.2,
                }}
              >
                {pillar[1]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 4-char Verdict */}
      <div
        className="flex items-center justify-center"
        style={{
          padding: 14,
          backgroundColor: "#F9E7E5",
          borderRadius: 8,
          border: "1px solid rgba(192, 57, 43, 0.15)",
          gap: 10,
        }}
      >
        <div style={{ height: 1, width: 24, backgroundColor: "rgba(192,57,43,0.25)" }} />
        <span
          className="font-serif"
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#C0392B",
            letterSpacing: "0.3em",
          }}
        >
          {verdict}
        </span>
        <div style={{ height: 1, width: 24, backgroundColor: "rgba(192,57,43,0.25)" }} />
      </div>
    </section>
  )
}
