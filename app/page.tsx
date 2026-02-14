"use client"

import { useState, useCallback, useEffect } from "react"
import { InkBackground } from "@/components/ink-background"
import { BottomTabBar, type TabKey } from "@/components/nav-header"
import { FortuneTab } from "@/components/fortune-tab"
import { LoadingView } from "@/components/loading-view"
import { ReportView } from "@/components/report-view"
import { HistoryView } from "@/components/history-view"
import { MOCK_REPORT, MOCK_SINGLE_REPORT } from "@/lib/mock-data"
import type { UserMode } from "@/lib/types"

type AppPhase = "main" | "loading" | "report" | "generating"

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("fortune")
  const [phase, setPhase] = useState<AppPhase>("main")
  const [mode, setMode] = useState<UserMode>("single")

  const handleSubmit = (submitMode: UserMode) => {
    setMode(submitMode)
    setPhase("loading")
  }

  const handleGeneratingStart = () => {
    setPhase("generating")
  }

  const handleLoadingComplete = useCallback(() => {
    setPhase("report")
  }, [])

  const handleBackToHome = () => {
    setPhase("main")
    setActiveTab("fortune")
  }

  const report = mode === "double" ? MOCK_REPORT : MOCK_SINGLE_REPORT

  // Hide tab bar during loading and report (immersive)
  const showTabs = phase === "main"

  return (
    <div className="min-h-screen bg-background">
      <InkBackground />

      {/* Generating phase - full screen, blocks all interaction */}
      {phase === "generating" && <GeneratingLoadingView />}

      {/* Loading phase - full screen */}
      {phase === "loading" && (
        <LoadingView onComplete={handleLoadingComplete} />
      )}

      {/* Report phase - immersive full screen, no tab bar */}
      {phase === "report" && (
        <ReportView report={report} onBack={handleBackToHome} />
      )}

      {/* Main phase - tab bar visible */}
      {phase === "main" && (
        <>
          {activeTab === "fortune" && (
            <main className="relative" style={{ paddingBottom: 64 }}>
              <FortuneTab onSubmit={handleSubmit} onGeneratingStart={handleGeneratingStart} />
            </main>
          )}

          {activeTab === "history" && (
            <main className="relative" style={{ paddingBottom: 64 }}>
              <HistoryView />
            </main>
          )}

          <BottomTabBar active={activeTab} onChange={setActiveTab} />
        </>
      )}
    </div>
  )
}

// 生成报告时的全屏加载界面
function GeneratingLoadingView() {
  const [messageIdx, setMessageIdx] = useState(0)
  const [dots, setDots] = useState("")

  const MESSAGES = [
    "AI 正在排盘",
    "正在解析八字格局",
    "正在分析丙午流年",
    "正在计算桃花运势",
    "正在绘制红线趋势",
    "正在生成深度报告",
  ]

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIdx((prev) => (prev + 1) % MESSAGES.length)
    }, 3000)
    return () => clearInterval(msgInterval)
  }, [])

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(dotsInterval)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center"
      style={{ backgroundColor: "#FAF8F3" }}
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

      {/* Compass Animation */}
      <div className="relative" style={{ marginBottom: 32, marginTop: -60 }}>
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
          {/* Spinning compass */}
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "2s", animationTimingFunction: "linear" }}
          >
            <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
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

          {/* Orbiting dot */}
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

      {/* Loading text with animated dots */}
      <p
        className="font-sans text-center transition-opacity duration-500"
        style={{
          fontSize: 16,
          color: "#5D6D7E",
          fontWeight: 500,
          marginBottom: 16,
          minHeight: 24,
        }}
      >
        {MESSAGES[messageIdx]}
        <span style={{ display: "inline-block", width: 24, textAlign: "left" }}>
          {dots}
        </span>
      </p>

      {/* Hint text */}
      <p
        className="text-center"
        style={{
          fontSize: 13,
          color: "#95A5A6",
          maxWidth: 280,
          lineHeight: 1.6,
        }}
      >
        AI 正在深度分析您的八字命盘
        <br />
        预计需要 1-3 分钟，请耐心等待
      </p>

      {/* Warning text - new */}
      <div
        className="flex items-center justify-center"
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: "rgba(231, 76, 60, 0.08)",
          borderRadius: 8,
          border: "1px solid rgba(231, 76, 60, 0.2)",
          maxWidth: 280,
        }}
      >
        <p
          className="text-center"
          style={{
            fontSize: 12,
            color: "#E74C3C",
            fontWeight: 500,
          }}
        >
          为保证解析正常，请不要做任何操作
        </p>
      </div>

      {/* Pulsing indicator */}
      <div className="flex items-center justify-center" style={{ marginTop: 24, gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-full animate-pulse"
            style={{
              width: 8,
              height: 8,
              backgroundColor: "#C0392B",
              opacity: 0.4,
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1.5s",
            }}
          />
        ))}
      </div>
    </div>
  )
}
