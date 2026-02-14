"use client"

import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts"

interface RadarChartProps {
  data: { dimension: string; value: number }[]
}

export function RadarChart({ data }: RadarChartProps) {
  return (
    <section
      style={{
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div style={{ paddingLeft: 12, borderLeft: "3px solid #C0392B", marginBottom: 4 }}>
        <h3
          className="font-serif"
          style={{ fontSize: 18, fontWeight: 600, color: "#2C3E50" }}
        >
          {"六维雷达图"}
        </h3>
      </div>
      <p style={{ fontSize: 13, color: "#5D6D7E", marginBottom: 12 }}>
        {"情感维度分析"}
      </p>

      <div style={{ height: 240, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#ECF0F1" strokeOpacity={0.8} />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: "#5D6D7E", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#95A5A6", fontSize: 9 }}
              axisLine={false}
            />
            <Radar
              name="指数"
              dataKey="value"
              stroke="#C0392B"
              fill="#C0392B"
              fillOpacity={0.12}
              strokeWidth={2}
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>

      {/* Dimension scores - 2-column grid */}
      <div className="grid grid-cols-2" style={{ gap: 6, marginTop: 12 }}>
        {data.map((item) => {
          let scoreColor = "#F39C12" // medium
          if (item.value > 85) scoreColor = "#27AE60"
          if (item.value < 60) scoreColor = "#E74C3C"
          return (
            <div
              key={item.dimension}
              className="flex items-center justify-between"
              style={{
                padding: "8px 12px",
                backgroundColor: "#FAF8F3",
                borderRadius: 6,
                border: "1px solid #ECF0F1",
              }}
            >
              <span style={{ fontSize: 12, color: "#5D6D7E" }}>
                {item.dimension}
              </span>
              <span
                className="font-serif"
                style={{ fontSize: 14, fontWeight: 700, color: scoreColor }}
              >
                {item.value}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
