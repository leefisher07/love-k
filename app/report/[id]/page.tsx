"use client"

import { use, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Share2, RotateCcw, Loader2 } from "lucide-react"
import { BaziOverview } from "@/components/report/bazi-overview"
import { KLineChart } from "@/components/report/kline-chart"
import { HorseYearCard } from "@/components/report/horse-year-card"
import { RadarChart } from "@/components/report/radar-chart"
import { AdviceCard } from "@/components/report/advice-card"
import { PeachBlossomYears } from "@/components/report/peach-blossom-years"
import { IdealPartner } from "@/components/report/ideal-partner"

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get('code')
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!code) {
      setError('缺少验证码参数')
      setLoading(false)
      return
    }

    fetch(`/api/report/${id}?code=${code}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setReport(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('加载失败')
        setLoading(false)
      })
  }, [id, code])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAF8F3" }}>
        <Loader2 className="animate-spin" style={{ width: 48, height: 48, color: "#C0392B" }} />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAF8F3", padding: 24 }}>
        <div className="text-center">
          <p style={{ fontSize: 16, color: "#E74C3C", marginBottom: 16 }}>{error || '报告不存在'}</p>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: "12px 24px",
              backgroundColor: "#C0392B",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  const formData = report.formData
  const reportData = report.reportData
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

      {/* Floating back button */}
      <div className="fixed z-50" style={{ top: 16, left: 16 }}>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center transition-all active:scale-95"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="返回"
        >
          <ArrowLeft style={{ width: 20, height: 20, color: "#2C3E50" }} />
        </button>
      </div>

      {/* Share button */}
      <div className="fixed z-50" style={{ top: 16, right: 16 }}>
        <button
          type="button"
          onClick={() => {
            if (typeof navigator !== "undefined" && navigator.share) {
              navigator.share({ title: "红线运势报告", url: window.location.href })
            }
          }}
          className="flex items-center justify-center transition-all active:scale-95"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="分享"
        >
          <Share2 style={{ width: 20, height: 20, color: "#2C3E50" }} />
        </button>
      </div>

      <div style={{ padding: "0 16px 40px" }}>
        <div className="text-center" style={{ marginBottom: 24 }}>
          <h1 className="font-serif" style={{ fontSize: 24, fontWeight: 700, color: "#2C3E50", letterSpacing: "0.15em" }}>
            红线运势报告
          </h1>
          <p style={{ fontSize: 13, color: "#95A5A6", marginTop: 6 }}>
            {isDouble
              ? `${formData.person1.name} & ${formData.person2?.name}`
              : formData.person1.name}
            {" · "}
            {new Date(report.createdAt).toLocaleDateString("zh-CN")}
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

          <HorseYearCard analysis={reportData.horse_year_analysis?.content || reportData.horse_year_analysis} />

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
          <p style={{ fontSize: 11, color: "#BDC3C7" }}>此报告由 AI 生成，仅供娱乐参考</p>
        </div>

        <div style={{ marginTop: 24 }}>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center font-serif transition-all active:scale-[0.98]"
            style={{
              height: 52,
              borderRadius: 12,
              backgroundColor: "#FFFFFF",
              border: "2px solid rgba(192,57,43,0.3)",
              color: "#C0392B",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.1em",
              gap: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              cursor: "pointer",
            }}
          >
            <RotateCcw style={{ width: 16, height: 16 }} />
            返回首页
          </button>
        </div>
      </div>
    </div>
  )
}
