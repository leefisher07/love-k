"use client"

import { useState, useEffect } from "react"

const MESSAGES = [
  "AI 正在排盘...",
  "正在解析丙午流年...",
  "正在绘制红线趋势...",
  "正在计算缘分指数...",
]

interface LoadingViewProps {
  onComplete: () => void
}

export function LoadingView({ onComplete }: LoadingViewProps) {
  const [messageIdx, setMessageIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIdx((prev) => (prev + 1) % MESSAGES.length)
    }, 2000)
    return () => clearInterval(msgInterval)
  }, [])

  useEffect(() => {
    const progInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progInterval)
          return 100
        }
        return prev + 1.5
      })
    }, 60)
    return () => clearInterval(progInterval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(onComplete, 500)
      return () => clearTimeout(timer)
    }
  }, [progress, onComplete])

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center"
      style={{ backgroundColor: "#FAF8F3", padding: "0 20px" }}
    >
      {/* Ink texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ opacity: 0.03 }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <filter id="inkNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="400" height="800" filter="url(#inkNoise)" />
        </svg>
      </div>

      {/* Compass Animation - 120px, centered, offset up 60px */}
      <div className="relative" style={{ marginBottom: 32, marginTop: -60 }}>
        {/* Outer ring with glow */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "2px solid rgba(192, 57, 43, 0.15)",
            boxShadow: "0 0 30px rgba(192, 57, 43, 0.3)",
            position: "relative",
          }}
        >
          {/* Spinning compass SVG */}
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "2s", animationTimingFunction: "linear" }}
          >
            <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
              {/* 12 markings */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180
                const x1 = 60 + 52 * Math.cos(angle)
                const y1 = 60 + 52 * Math.sin(angle)
                const x2 = 60 + 46 * Math.cos(angle)
                const y2 = 60 + 46 * Math.sin(angle)
                return (
                  <line
                    key={`m-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#C0392B"
                    strokeWidth="1.5"
                    opacity="0.35"
                  />
                )
              })}
              {/* Four direction chars */}
              {["子", "卯", "午", "酉"].map((char, i) => {
                const angle = ((i * 90 - 90) * Math.PI) / 180
                const x = 60 + 38 * Math.cos(angle)
                const y = 60 + 38 * Math.sin(angle)
                return (
                  <text
                    key={char}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#C0392B"
                    fontSize="8"
                    opacity="0.45"
                    fontFamily="serif"
                  >
                    {char}
                  </text>
                )
              })}
            </svg>
          </div>

          {/* Inner horse symbol */}
          <div
            className="relative z-10 flex items-center justify-center rounded-full"
            style={{
              width: 52,
              height: 52,
              border: "1px solid rgba(192, 57, 43, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
            }}
          >
            <svg
              viewBox="0 0 64 64"
              className="animate-pulse"
              style={{ width: 32, height: 32, color: "rgba(192, 57, 43, 0.6)" }}
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M48 16c-2-4-6-6-10-6-2 0-4 2-6 4l-4 6c-2 2-6 4-8 4s-4 0-6 2c-2 2-2 4-2 6 0 4 2 8 4 10l2 4v8c0 2 2 2 2 2h4s2 0 2-2v-6h4v6c0 2 2 2 2 2h4s2 0 2-2v-8l4-6c2-4 4-8 4-12 0-2 0-4 2-6z" />
            </svg>
          </div>

          {/* Orbiting dot (reverse) */}
          <div
            className="absolute inset-0 animate-spin"
            style={{
              animationDuration: "4s",
              animationDirection: "reverse",
              animationTimingFunction: "linear",
            }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 6,
                height: 6,
                backgroundColor: "rgba(192, 57, 43, 0.55)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Horse silhouette - background decoration */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 200,
          opacity: 0.08,
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 120" fill="#E67E22" className="w-full h-auto animate-pulse" style={{ animationDuration: "3s" }}>
          <path d="M160 30c-6-12-18-18-30-18-6 0-12 6-18 12l-12 18c-6 6-18 12-24 12s-12 0-18 6c-6 6-6 12-6 18 0 12 6 24 12 30l6 12v24c0 6 6 6 6 6h12s6 0 6-6v-18h12v18c0 6 6 6 6 6h12s6 0 6-6v-24l12-18c6-12 12-24 12-36 0-6 0-12 6-18z" />
        </svg>
      </div>

      {/* Loading text - fade transition */}
      <p
        className="font-sans text-center transition-opacity duration-500"
        style={{
          fontSize: 16,
          color: "#5D6D7E",
          fontWeight: 500,
          marginBottom: 24,
        }}
      >
        {MESSAGES[messageIdx]}
      </p>

      {/* Progress bar - 240px width, 4px height */}
      <div
        style={{
          width: 240,
        }}
      >
        <div
          className="overflow-hidden"
          style={{
            height: 4,
            backgroundColor: "#ECF0F1",
            borderRadius: 2,
          }}
        >
          <div
            className="transition-all duration-200"
            style={{
              height: "100%",
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: "#C0392B",
              borderRadius: 2,
            }}
          />
        </div>
        <p
          className="text-center"
          style={{ fontSize: 11, color: "#95A5A6", marginTop: 8 }}
        >
          {Math.min(Math.round(progress), 100)}%
        </p>
      </div>
    </div>
  )
}
