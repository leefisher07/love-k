"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ScrollText,
  Clock,
  User,
  Users,
  ChevronRight,
  ArrowLeft,
  Share2,
  RotateCcw,
  Loader2,
} from "lucide-react"
import { BaziOverview } from "@/components/report/bazi-overview"
import { KLineChart } from "@/components/report/kline-chart"
import { HorseYearCard } from "@/components/report/horse-year-card"
import { RadarChart } from "@/components/report/radar-chart"
import { AdviceCard } from "@/components/report/advice-card"
import { PeachBlossomYears } from "@/components/report/peach-blossom-years"
import { IdealPartner } from "@/components/report/ideal-partner"

interface HistoryReport {
  id: string
  code: string
  mode: 'single' | 'double'
  createdAt: string
  formData: any
  reportData: any
}

export function HistoryView() {
  const [searchCode, setSearchCode] = useState("")
  const [selectedReport, setSelectedReport] = useState<HistoryReport | null>(null)
  const [reports, setReports] = useState<HistoryReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      // 从 localStorage 读取已使用的验证码
      const savedCodes = localStorage.getItem('used_promo_codes')
      if (!savedCodes) {
        setReports([])
        setLoading(false)
        return
      }

      const codes: string[] = JSON.parse(savedCodes)
      const allReports: HistoryReport[] = []

      // 对每个验证码获取报告列表
      for (const code of codes) {
        try {
          const listResponse = await fetch(`/api/reports/list?code=${code}`)
          if (!listResponse.ok) continue

          const listData = await listResponse.json()

          // 获取每个报告的详细信息
          for (const reportItem of listData.reports || []) {
            try {
              const detailResponse = await fetch(`/api/report/${reportItem.reportId}?code=${code}`)
              if (!detailResponse.ok) continue

              const detailData = await detailResponse.json()
              allReports.push({
                id: reportItem.reportId,
                code,
                mode: reportItem.mode,
                createdAt: reportItem.createdAt,
                formData: detailData.formData,
                reportData: detailData.reportData,
              })
            } catch (error) {
              console.error('Failed to load report detail:', error)
            }
          }
        } catch (error) {
          console.error('Failed to load reports for code:', code, error)
        }
      }

      // 按创建时间倒序排序
      allReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setReports(allReports)
    } catch (error) {
      console.error('Failed to load reports:', error)
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = searchCode.trim()
    ? reports.filter(
        (r) =>
          r.code.toLowerCase().includes(searchCode.toLowerCase()) ||
          r.formData.person1.name.includes(searchCode) ||
          (r.formData.person2 && r.formData.person2.name.includes(searchCode))
      )
    : reports

  /* ---- Immersive report detail ---- */
  if (selectedReport) {
    const formData = selectedReport.formData
    const reportData = selectedReport.reportData
    const isDouble = formData.mode === 'double'

    return (
      <div className="relative min-h-screen" style={{ backgroundColor: "#FAF8F3" }}>
        {/* Top ink decoration */}
        <div className="w-full overflow-hidden" style={{ height: 80, opacity: 0.12 }} aria-hidden="true">
          <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path d="M0 50 Q50 10 100 40 T200 30 T300 45 T400 35" fill="none" stroke="#2C3E50" strokeWidth="0.8" />
            <path d="M0 60 Q60 20 120 50 T240 35 T360 55 T400 42" fill="none" stroke="#2C3E50" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Floating back */}
        <div className="fixed z-50" style={{ top: 16, left: 16 }}>
          <button
            type="button"
            onClick={() => setSelectedReport(null)}
            className="flex items-center justify-center transition-all active:scale-95"
            style={{
              width: 40, height: 40, borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: "none", cursor: "pointer",
            }}
            aria-label="返回列表"
          >
            <ArrowLeft style={{ width: 20, height: 20, color: "#2C3E50" }} />
          </button>
        </div>

        <div className="fixed z-50" style={{ top: 16, right: 16 }}>
          <button
            type="button"
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                navigator.share({
                  title: "红线运势报告",
                  url: `${window.location.origin}/report/${selectedReport.id}?code=${selectedReport.code}`
                })
              }
            }}
            className="flex items-center justify-center transition-all active:scale-95"
            style={{
              width: 40, height: 40, borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: "none", cursor: "pointer",
            }}
            aria-label="分享"
          >
            <Share2 style={{ width: 20, height: 20, color: "#2C3E50" }} />
          </button>
        </div>

        <div style={{ padding: "0 16px 40px" }}>
          <div className="text-center" style={{ marginBottom: 24 }}>
            <h1 className="font-serif" style={{ fontSize: 24, fontWeight: 700, color: "#2C3E50", letterSpacing: "0.15em" }}>
              {"红线运势报告"}
            </h1>
            <p style={{ fontSize: 13, color: "#95A5A6", marginTop: 6 }}>
              {isDouble
                ? `${formData.person1.name} & ${formData.person2?.name}`
                : formData.person1.name}
              {" · "}
              {new Date(selectedReport.createdAt).toLocaleDateString("zh-CN")}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {isDouble ? (
              <>
                <BaziOverview
                  bazi={reportData.user1.bazi_pillars ? Object.values(reportData.user1.bazi_pillars) : []}
                  verdict={reportData.user1.bazi_summary}
                  personName={formData.person1.name}
                />
                <BaziOverview
                  bazi={reportData.user2.bazi_pillars ? Object.values(reportData.user2.bazi_pillars) : []}
                  verdict={reportData.user2.bazi_summary}
                  personName={formData.person2.name}
                />
                <KLineChart
                  data={[
                    ...reportData.user1.k_line_data.map((d: any) => ({ ...d, score1: d.score })),
                    ...reportData.user2.k_line_data.map((d: any, i: number) => ({
                      year: d.year,
                      score2: d.score,
                      score1: reportData.user1.k_line_data[i]?.score
                    }))
                  ].reduce((acc: any[], curr: any) => {
                    const existing = acc.find(item => item.year === curr.year)
                    if (existing) {
                      Object.assign(existing, curr)
                    } else {
                      acc.push(curr)
                    }
                    return acc
                  }, [])}
                  isDouble={true}
                />
              </>
            ) : (
              <>
                <BaziOverview
                  bazi={reportData.bazi_pillars ? Object.values(reportData.bazi_pillars) : []}
                  verdict={reportData.bazi_summary}
                  personName={formData.person1.name}
                />
                <KLineChart
                  data={reportData.k_line_data.map((d: any) => ({ ...d, score1: d.score }))}
                  isDouble={false}
                />
              </>
            )}

            <HorseYearCard analysis={reportData.horse_year_analysis} />

            {!isDouble && reportData.peach_blossom_years && reportData.peach_blossom_years.length > 0 && (
              <PeachBlossomYears years={reportData.peach_blossom_years} />
            )}

            {!isDouble && reportData.radar_scores && (
              <RadarChart
                data={[
                  { dimension: "桃花运", value: reportData.radar_scores[0] || 0 },
                  { dimension: "稳定性", value: reportData.radar_scores[1] || 0 },
                  { dimension: "沟通力", value: reportData.radar_scores[2] || 0 },
                  { dimension: "包容度", value: reportData.radar_scores[3] || 0 },
                  { dimension: "激情度", value: reportData.radar_scores[4] || 0 },
                  { dimension: "长久性", value: reportData.radar_scores[5] || 0 },
                ]}
              />
            )}

            {!isDouble && reportData.ideal_partner && (
              <IdealPartner partner={reportData.ideal_partner} />
            )}

            <AdviceCard advice={reportData.final_advice} />
          </div>

          <div className="text-center" style={{ marginTop: 32 }}>
            <p style={{ fontSize: 11, color: "#BDC3C7" }}>{"此报告由 AI 生成，仅供娱乐参考"}</p>
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              type="button"
              onClick={() => setSelectedReport(null)}
              className="w-full flex items-center justify-center font-serif transition-all active:scale-[0.98]"
              style={{
                height: 52, borderRadius: 12,
                backgroundColor: "#FFFFFF",
                border: "2px solid rgba(192,57,43,0.3)",
                color: "#C0392B", fontSize: 16, fontWeight: 600,
                letterSpacing: "0.1em", gap: 8,
                boxShadow: "var(--shadow-sm)", cursor: "pointer",
              }}
            >
              <RotateCcw style={{ width: 16, height: 16 }} />
              {"返回书简列表"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ---- List view ---- */
  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Top decoration */}
      <div className="w-full overflow-hidden" style={{ height: 40, opacity: 0.15 }} aria-hidden="true">
        <svg viewBox="0 0 400 40" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d="M0 25 Q50 5 100 20 T200 15 T300 22 T400 18" fill="none" stroke="#2C3E50" strokeWidth="0.8" />
          <path d="M0 30 Q60 10 120 25 T240 18 T360 27 T400 22" fill="none" stroke="#2C3E50" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Title */}
      <div className="text-center" style={{ padding: "16px 16px 0" }}>
        <h1 className="font-serif" style={{ fontSize: 24, fontWeight: 700, color: "#2C3E50", letterSpacing: "0.15em" }}>
          {"我的书简"}
        </h1>
        <p className="font-serif" style={{ fontSize: 12, color: "#95A5A6", marginTop: 6, letterSpacing: "0.2em" }}>
          {"缘分记录，旧梦可追"}
        </p>
        <div className="mx-auto flex items-center justify-center" style={{ marginTop: 12, gap: 12 }}>
          <div style={{ height: 1, width: 40, backgroundColor: "rgba(192,57,43,0.2)" }} />
          <div style={{ width: 6, height: 6, border: "1px solid rgba(192,57,43,0.3)", backgroundColor: "rgba(192,57,43,0.08)", transform: "rotate(45deg)" }} />
          <div style={{ height: 1, width: 40, backgroundColor: "rgba(192,57,43,0.2)" }} />
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "20px 16px 0" }}>
        <div className="relative">
          <Search
            className="absolute pointer-events-none"
            style={{ left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#95A5A6" }}
          />
          <input
            type="text"
            placeholder="输入金钥找回旧梦"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full outline-none font-sans transition-shadow"
            style={{
              height: 44, paddingLeft: 40, paddingRight: 12,
              backgroundColor: "#FFFFFF", border: "1px solid #ECF0F1",
              borderRadius: 8, fontSize: 15, color: "#2C3E50",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#C0392B"
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(192,57,43,0.1)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#ECF0F1"
              e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)"
            }}
          />
        </div>
      </div>

      {/* Report List */}
      <div style={{ padding: "16px 16px 0" }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center text-center" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <Loader2 className="animate-spin" style={{ width: 48, height: 48, color: "#C0392B", marginBottom: 16 }} />
            <p className="font-serif" style={{ fontSize: 16, color: "#95A5A6" }}>{"加载中..."}</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <ScrollText style={{ width: 48, height: 48, color: "#BDC3C7", marginBottom: 16 }} />
            <p className="font-serif" style={{ fontSize: 16, color: "#95A5A6" }}>{"暂无书简记录"}</p>
            <p style={{ fontSize: 13, color: "#BDC3C7", marginTop: 6 }}>{"完成一次测算后，记录将自动保存于此"}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredReports.map((report) => {
              const isDouble = report.mode === 'double'
              const reportData = report.reportData
              const verdict = isDouble
                ? reportData.user1?.bazi_summary || '命理分析'
                : reportData.bazi_summary || '命理分析'

              return (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setSelectedReport(report)}
                  className="w-full text-left transition-all active:scale-[0.99]"
                  style={{
                    padding: 16,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <div className="flex items-center" style={{ gap: 12 }}>
                    {/* Icon */}
                    <div
                      className="flex items-center justify-center rounded-full shrink-0"
                      style={{
                        width: 44,
                        height: 44,
                        backgroundColor: "#F9E7E5",
                        border: "1px solid rgba(192,57,43,0.15)",
                      }}
                    >
                      {isDouble ? (
                        <Users style={{ width: 18, height: 18, color: "#C0392B" }} />
                      ) : (
                        <User style={{ width: 18, height: 18, color: "#C0392B" }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
                        <h3
                          className="truncate font-serif"
                          style={{ fontSize: 15, fontWeight: 600, color: "#2C3E50" }}
                        >
                          {isDouble
                            ? `${report.formData.person1.name} & ${report.formData.person2?.name}`
                            : report.formData.person1.name}
                        </h3>
                        <span
                          className="shrink-0 font-serif"
                          style={{
                            fontSize: 11, padding: "2px 8px",
                            backgroundColor: "#F9E7E5",
                            border: "1px solid rgba(192,57,43,0.15)",
                            borderRadius: 9999, color: "#C0392B",
                            fontWeight: 500, letterSpacing: "0.05em",
                          }}
                        >
                          {verdict}
                        </span>
                      </div>
                      <div className="flex items-center" style={{ gap: 12, fontSize: 12, color: "#95A5A6" }}>
                        <span className="flex items-center" style={{ gap: 3 }}>
                          <Clock style={{ width: 12, height: 12 }} />
                          {new Date(report.createdAt).toLocaleDateString("zh-CN")}
                        </span>
                        <span>{isDouble ? "双人" : "单人"}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight style={{ width: 16, height: 16, color: "#BDC3C7", flexShrink: 0 }} />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer count */}
      {!loading && (
        <div className="text-center" style={{ marginTop: 32 }}>
          <div className="mx-auto flex items-center justify-center" style={{ gap: 12 }}>
            <div style={{ height: 1, width: 40, backgroundColor: "#ECF0F1" }} />
            <span className="font-serif" style={{ fontSize: 11, color: "#BDC3C7", letterSpacing: "0.15em" }}>
              {"共 "}
              {filteredReports.length}
              {" 份书简"}
            </span>
            <div style={{ height: 1, width: 40, backgroundColor: "#ECF0F1" }} />
          </div>
        </div>
      )}
    </div>
  )
}
