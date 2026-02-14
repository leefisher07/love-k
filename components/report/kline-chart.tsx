"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Dot,
  Area,
} from "recharts"
import type { ReportData } from "@/lib/types"

interface KLineChartProps {
  data: ReportData["kLineData"]
  isDouble: boolean
}

function CustomDot1(props: {
  cx?: number
  cy?: number
  payload?: { score1: number }
}) {
  const { cx = 0, cy = 0, payload } = props
  if (!payload) return null
  const score = payload.score1
  if (score > 85) {
    return (
      <g>
        <Dot cx={cx} cy={cy} r={5} fill="#27AE60" stroke="#FFFFFF" strokeWidth={2} />
        <text x={cx} y={cy - 12} textAnchor="middle" fontSize="8" fill="#27AE60" fontFamily="serif">
          {"桃花"}
        </text>
      </g>
    )
  }
  if (score < 60) {
    return (
      <g>
        <Dot cx={cx} cy={cy} r={5} fill="#E74C3C" stroke="#FFFFFF" strokeWidth={2} />
        <text x={cx} y={cy - 12} textAnchor="middle" fontSize="8" fill="#E74C3C" fontFamily="serif">
          {"结"}
        </text>
      </g>
    )
  }
  return <Dot cx={cx} cy={cy} r={3} fill="#C0392B" stroke="none" />
}

function CustomDot2(props: {
  cx?: number
  cy?: number
  payload?: { score2?: number }
}) {
  const { cx = 0, cy = 0, payload } = props
  if (!payload || payload.score2 === undefined) return null
  const score = payload.score2
  if (score > 85) {
    return (
      <g>
        <Dot cx={cx} cy={cy} r={5} fill="#27AE60" stroke="#FFFFFF" strokeWidth={2} />
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="8" fill="#27AE60" fontFamily="serif">
          {"桃花"}
        </text>
      </g>
    )
  }
  if (score < 60) {
    return (
      <g>
        <Dot cx={cx} cy={cy} r={5} fill="#E74C3C" stroke="#FFFFFF" strokeWidth={2} />
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="8" fill="#E74C3C" fontFamily="serif">
          {"结"}
        </text>
      </g>
    )
  }
  return <Dot cx={cx} cy={cy} r={3} fill="#3498DB" stroke="none" />
}

export function KLineChart({ data, isDouble }: KLineChartProps) {
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
          {"红线运势 K 线图"}
        </h3>
      </div>
      <p style={{ fontSize: 13, color: "#5D6D7E", marginBottom: 16 }}>
        {"2026-2035 十年运势走势"}
      </p>

      {/* Legend */}
      <div className="flex flex-wrap items-center" style={{ gap: 12, marginBottom: 12 }}>
        <div className="flex items-center" style={{ gap: 4 }}>
          <div style={{ width: 16, height: 2, backgroundColor: "#C0392B" }} />
          <span style={{ fontSize: 11, color: "#5D6D7E" }}>
            {isDouble ? "用户 1" : "我的运势"}
          </span>
        </div>
        {isDouble && (
          <div className="flex items-center" style={{ gap: 4 }}>
            <div
              style={{
                width: 16,
                height: 0,
                borderTop: "2px dashed #3498DB",
              }}
            />
            <span style={{ fontSize: 11, color: "#5D6D7E" }}>{"用户 2"}</span>
          </div>
        )}
        <div className="flex items-center" style={{ gap: 3 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#27AE60",
            }}
          />
          <span style={{ fontSize: 11, color: "#5D6D7E" }}>{"桃花 >85"}</span>
        </div>
        <div className="flex items-center" style={{ gap: 3 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#E74C3C",
            }}
          />
          <span style={{ fontSize: 11, color: "#5D6D7E" }}>{"绳结 <60"}</span>
        </div>
      </div>

      <div style={{ height: 220, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 10, bottom: 5, left: -15 }}
          >
            <defs>
              <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(192, 57, 43, 0.3)" />
                <stop offset="100%" stopColor="rgba(192, 57, 43, 0.05)" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ECF0F1"
              opacity={0.8}
            />
            <XAxis
              dataKey="year"
              fontSize={10}
              tick={{ fill: "#5D6D7E" }}
              axisLine={{ stroke: "#95A5A6" }}
              tickLine={false}
            />
            <YAxis
              domain={[40, 100]}
              fontSize={10}
              tick={{ fill: "#5D6D7E" }}
              axisLine={{ stroke: "#95A5A6" }}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #ECF0F1",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            />
            <ReferenceLine
              y={85}
              stroke="#27AE60"
              strokeDasharray="5 5"
              opacity={0.4}
              label={{ value: "85", position: "right", fill: "#27AE60", fontSize: 9 }}
            />
            <ReferenceLine
              y={60}
              stroke="#E74C3C"
              strokeDasharray="5 5"
              opacity={0.4}
              label={{ value: "60", position: "right", fill: "#E74C3C", fontSize: 9 }}
            />
            <Area
              type="monotone"
              dataKey="score1"
              fill="url(#areaGrad1)"
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="score1"
              stroke="#C0392B"
              strokeWidth={2}
              dot={<CustomDot1 />}
              name={isDouble ? "用户 1" : "运势分"}
            />
            {isDouble && (
              <Line
                type="monotone"
                dataKey="score2"
                stroke="#3498DB"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={<CustomDot2 />}
                name="用户 2"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
