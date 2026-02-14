"use client"

import { useState, useRef, useEffect } from "react"
import { PersonForm } from "@/components/person-form"
import { cn } from "@/lib/utils"
import {
  KeyRound,
  Loader2,
  Heart,
  User,
  Users,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import type { UserMode, PersonInfo } from "@/lib/types"


const emptyPerson = (): PersonInfo => ({
  name: "",
  gender: "male",
  birthDate: "",
  calendarType: "solar",
  birthHour: "unknown",
  birthPlace: "",
  relationship: "ambiguous",
  wish: "",
  note: "",
})

interface FortuneTabProps {
  onSubmit: (mode: UserMode) => void
  onGeneratingStart?: () => void
}

export function FortuneTab({ onSubmit, onGeneratingStart }: FortuneTabProps) {
  const [mode, setMode] = useState<UserMode>("single")
  const [code, setCode] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [codeError, setCodeError] = useState("")
  const [toast, setToast] = useState("")
  const [person1, setPerson1] = useState<PersonInfo>(emptyPerson())
  const [person2, setPerson2] = useState<PersonInfo>({
    ...emptyPerson(),
    gender: "female",
  })
  const [submitting, setSubmitting] = useState(false)

  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (verified && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 350)
    }
  }, [verified])

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 3000)
      return () => clearTimeout(t)
    }
  }, [toast])

  const handleVerify = async () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) {
      setCodeError("请输入缘分金钥")
      return
    }
    setVerifying(true)
    setCodeError("")

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, selectedType: mode })
      })

      const data = await response.json()

      if (!data.valid) {
        setCodeError(data.error || '验证码无效')
        setVerifying(false)
        return
      }

      // 智能切换
      if (data.correctType && data.correctType !== mode) {
        setMode(data.correctType)
        setToast(
          data.correctType === "double"
            ? "已为您自动切换至双人模式"
            : "已为您自动切换至单人模式"
        )
      }

      setVerified(true)
      setVerifying(false)
    } catch (error) {
      setCodeError('网络错误，请重试')
      setVerifying(false)
    }
  }

  const handleModeChange = (newMode: UserMode) => {
    if (verified) return
    setMode(newMode)
  }

  const handleSubmit = async () => {
    if (!person1.name || !person1.birthDate || !person1.birthPlace) {
      setToast("请完善用户信息后提交")
      return
    }
    if (
      mode === "double" &&
      (!person2.name || !person2.birthDate || !person2.birthPlace)
    ) {
      setToast("请完善用户 2 的信息")
      return
    }

    setSubmitting(true)

    // 通知父组件显示全屏加载界面
    if (onGeneratingStart) {
      onGeneratingStart()
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          mode,
          person1,
          person2: mode === 'double' ? person2 : undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setToast(data.error || '生成失败，请重试')
        setSubmitting(false)
        return
      }

      // 保存验证码到localStorage
      const savedCodes = localStorage.getItem('used_promo_codes')
      const codes = savedCodes ? JSON.parse(savedCodes) : []
      if (!codes.includes(code.trim().toUpperCase())) {
        codes.unshift(code.trim().toUpperCase())
        localStorage.setItem('used_promo_codes', JSON.stringify(codes.slice(0, 10)))
      }

      // 跳转到报告页
      window.location.href = `/report/${data.reportId}?code=${code.trim().toUpperCase()}`
    } catch (error) {
      setToast('网络错误，请重试')
      setSubmitting(false)
    }
  }

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* ---- Toast ---- */}
      {toast && (
        <div className="fixed top-4 left-1/2 z-[99] -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-2.5"
            style={{
              backgroundColor: "#E8F8F5",
              border: "1px solid #27AE60",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <CheckCircle2 style={{ width: 14, height: 14, color: "#27AE60" }} />
            <p
              className="whitespace-nowrap font-sans"
              style={{ fontSize: 13, color: "#27AE60", fontWeight: 500 }}
            >
              {toast}
            </p>
          </div>
        </div>
      )}

      {/* ---- Top decoration ---- */}
      <div
        className="w-full overflow-hidden"
        style={{ height: 40, opacity: 0.15 }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 40" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d="M0 25 Q50 5 100 20 T200 15 T300 22 T400 18" fill="none" stroke="#2C3E50" strokeWidth="0.8" />
          <path d="M0 30 Q60 10 120 25 T240 18 T360 27 T400 22" fill="none" stroke="#2C3E50" strokeWidth="0.5" />
          <circle cx="200" cy="20" r="8" fill="none" stroke="#C0392B" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </div>

      {/* ---- Header ---- */}
      <div className="text-center" style={{ padding: "16px 16px 0" }}>
        <h1
          className="font-serif"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#2C3E50",
            letterSpacing: "0.15em",
          }}
        >
          {"缘分测算"}
        </h1>
        <p
          className="font-serif"
          style={{
            fontSize: 12,
            color: "#95A5A6",
            marginTop: 6,
            letterSpacing: "0.2em",
          }}
        >
          {"丙午年 \u00B7 红线运势"}
        </p>
        <div className="mx-auto flex items-center justify-center gap-3" style={{ marginTop: 12 }}>
          <div style={{ height: 1, width: 40, backgroundColor: "rgba(192,57,43,0.2)" }} />
          <div
            style={{
              width: 6,
              height: 6,
              border: "1px solid rgba(192,57,43,0.3)",
              backgroundColor: "rgba(192,57,43,0.08)",
              transform: "rotate(45deg)",
            }}
          />
          <div style={{ height: 1, width: 40, backgroundColor: "rgba(192,57,43,0.2)" }} />
        </div>
      </div>

      {/* ---- Decorative Compass & Romance Illustration (before form) ---- */}
      {!verified && (
        <div
          className="flex flex-col items-center justify-center"
          style={{ padding: "40px 16px 0" }}
          aria-hidden="true"
        >
          {/* Compass with three rotating rings */}
          <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
            {/* Outer ring: Twelve Earthly Branches */}
            <svg
              viewBox="0 0 220 220"
              className="absolute inset-0"
              style={{ animation: "spin-slow 45s linear infinite" }}
            >
              <circle cx="110" cy="110" r="105" fill="none" stroke="#C0392B" strokeWidth="0.5" opacity="0.2" />
              <circle cx="110" cy="110" r="100" fill="none" stroke="#C0392B" strokeWidth="1" opacity="0.15" />
              {/* 12 tick marks */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180
                const x1 = 110 + 95 * Math.cos(angle)
                const y1 = 110 + 95 * Math.sin(angle)
                const x2 = 110 + 88 * Math.cos(angle)
                const y2 = 110 + 88 * Math.sin(angle)
                return (
                  <line
                    key={`tick-${i}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#C0392B" strokeWidth="1" opacity="0.3"
                  />
                )
              })}
              {/* Twelve Branches text */}
              {["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"].map((char, i) => {
                const angle = ((i * 30 - 90) * Math.PI) / 180
                const x = 110 + 80 * Math.cos(angle)
                const y = 110 + 80 * Math.sin(angle)
                return (
                  <text
                    key={char}
                    x={x} y={y}
                    textAnchor="middle" dominantBaseline="central"
                    fill="#C0392B" fontSize="9" opacity="0.4"
                    fontFamily="serif"
                  >
                    {char}
                  </text>
                )
              })}
            </svg>

            {/* Middle ring: Eight Trigrams */}
            <svg
              viewBox="0 0 220 220"
              className="absolute inset-0"
              style={{ animation: "spin-reverse 30s linear infinite" }}
            >
              <circle cx="110" cy="110" r="68" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.25" />
              {/* 8 trigram symbols */}
              {["乾", "兑", "离", "震", "巽", "坎", "艮", "坤"].map((char, i) => {
                const angle = ((i * 45 - 90) * Math.PI) / 180
                const x = 110 + 60 * Math.cos(angle)
                const y = 110 + 60 * Math.sin(angle)
                return (
                  <text
                    key={char}
                    x={x} y={y}
                    textAnchor="middle" dominantBaseline="central"
                    fill="#D4AF37" fontSize="10" opacity="0.4"
                    fontFamily="serif"
                  >
                    {char}
                  </text>
                )
              })}
              {/* Inner decorative dashes */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = ((i * 45 + 22.5) * Math.PI) / 180
                const x1 = 110 + 70 * Math.cos(angle)
                const y1 = 110 + 70 * Math.sin(angle)
                const x2 = 110 + 66 * Math.cos(angle)
                const y2 = 110 + 66 * Math.sin(angle)
                return (
                  <line
                    key={`d-${i}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#D4AF37" strokeWidth="0.8" opacity="0.3"
                  />
                )
              })}
            </svg>

            {/* Inner core: Tai Chi with romance motif */}
            <svg
              viewBox="0 0 220 220"
              className="absolute inset-0"
              style={{ animation: "spin-slow 20s linear infinite" }}
            >
              <circle cx="110" cy="110" r="40" fill="none" stroke="#C0392B" strokeWidth="0.5" opacity="0.2" />
              {/* Simplified Tai Chi */}
              <path
                d="M110 70 A40 40 0 0 1 110 150 A20 20 0 0 0 110 110 A20 20 0 0 1 110 70 Z"
                fill="#C0392B" opacity="0.08"
              />
              <path
                d="M110 70 A40 40 0 0 0 110 150 A20 20 0 0 1 110 110 A20 20 0 0 0 110 70 Z"
                fill="#2C3E50" opacity="0.06"
              />
              <circle cx="110" cy="90" r="4" fill="#2C3E50" opacity="0.1" />
              <circle cx="110" cy="130" r="4" fill="#C0392B" opacity="0.12" />
            </svg>

            {/* Center: Heart icon */}
            <div
              className="relative z-10 flex items-center justify-center rounded-full"
              style={{
                width: 36,
                height: 36,
                backgroundColor: "rgba(192, 57, 43, 0.06)",
                border: "1px solid rgba(192, 57, 43, 0.15)",
              }}
            >
              <Heart style={{ width: 16, height: 16, color: "#C0392B", opacity: 0.5 }} fill="rgba(192,57,43,0.1)" />
            </div>
          </div>

          {/* Red thread decoration below compass */}
          <div className="flex items-center justify-center" style={{ marginTop: 24, gap: 12 }}>
            <div style={{ height: 0, width: 50, borderTop: "1px dashed rgba(192,57,43,0.2)" }} />
            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, opacity: 0.3 }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#C0392B" />
            </svg>
            <div style={{ height: 0, width: 50, borderTop: "1px dashed rgba(192,57,43,0.2)" }} />
          </div>

          {/* Tagline */}
          <p
            className="font-serif text-center"
            style={{ marginTop: 16, fontSize: 13, color: "#95A5A6", letterSpacing: "0.2em" }}
          >
            {"天定良缘 · 红线系之"}
          </p>

          {/* Five Elements decorative row */}
          <div
            className="flex items-center justify-center"
            style={{ marginTop: 20, gap: 20 }}
          >
            {["金", "木", "水", "火", "土"].map((el) => (
              <div
                key={el}
                className="flex items-center justify-center rounded-full font-serif"
                style={{
                  width: 32,
                  height: 32,
                  border: "1px solid rgba(192,57,43,0.12)",
                  backgroundColor: "rgba(192,57,43,0.03)",
                  fontSize: 12,
                  color: "#C0392B",
                  opacity: 0.45,
                }}
              >
                {el}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- Area A: Mode Switch ---- */}
      <div style={{ padding: "24px 16px 0" }}>
        <div className="flex" style={{ gap: 12 }}>
          {(["single", "double"] as UserMode[]).map((m) => {
            const isActive = mode === m
            const Icon = m === "single" ? User : Users
            const label = m === "single" ? "单人模式" : "双人模式"
            return (
              <button
                key={m}
                type="button"
                disabled={verified}
                onClick={() => handleModeChange(m)}
                className={cn(
                  "flex-1 flex items-center justify-center transition-all active:scale-[0.98]",
                  verified && "opacity-60 cursor-not-allowed"
                )}
                style={{
                  height: 48,
                  borderRadius: 8,
                  border: isActive ? "2px solid #C0392B" : "2px solid #ECF0F1",
                  backgroundColor: isActive ? "#F9E7E5" : "#FFFFFF",
                  boxShadow: isActive
                    ? "0 2px 8px rgba(192, 57, 43, 0.15)"
                    : "none",
                  gap: 8,
                }}
              >
                <Icon
                  style={{
                    width: 18,
                    height: 18,
                    color: isActive ? "#C0392B" : "#5D6D7E",
                  }}
                />
                <span
                  className="font-sans"
                  style={{
                    fontSize: 16,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#C0392B" : "#5D6D7E",
                  }}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ---- Area B: Verification Code ---- */}
      <div style={{ padding: "24px 16px 0" }}>
        <div
          style={{
            padding: 20,
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Label */}
          <div className="flex items-center" style={{ marginBottom: 8, gap: 6 }}>
            <KeyRound style={{ width: 14, height: 14, color: "#5D6D7E" }} />
            <span
              className="font-sans"
              style={{ fontSize: 14, color: "#5D6D7E" }}
            >
              {"请输入缘分金钥"}
            </span>
            {verified && (
              <span
                className="ml-auto flex items-center rounded-full"
                style={{
                  fontSize: 11,
                  color: "#27AE60",
                  backgroundColor: "#E8F8F5",
                  border: "1px solid #27AE60",
                  padding: "2px 8px",
                  gap: 3,
                }}
              >
                <CheckCircle2 style={{ width: 10, height: 10 }} />
                {"已验证"}
              </span>
            )}
          </div>

          {/* Input + Button row */}
          <div className="flex" style={{ gap: 8 }}>
            <input
              type="text"
              placeholder="请输入验证码"
              value={code}
              disabled={verified}
              onChange={(e) => {
                setCode(e.target.value)
                setCodeError("")
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && !verified && handleVerify()
              }
              className={cn(
                "flex-1 outline-none font-mono transition-shadow",
                verified && "opacity-50"
              )}
              style={{
                height: 44,
                backgroundColor: verified ? "#F5F5F5" : "#FAF8F3",
                border: "1px solid #ECF0F1",
                borderRadius: 8,
                padding: "0 12px",
                fontSize: 16,
                color: "#2C3E50",
                letterSpacing: "0.15em",
                textAlign: "center",
              }}
              onFocus={(e) => {
                if (!verified) {
                  e.currentTarget.style.borderColor = "#C0392B"
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(192, 57, 43, 0.1)"
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#ECF0F1"
                e.currentTarget.style.boxShadow = "none"
              }}
            />
            {!verified && (
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying}
                className="shrink-0 font-sans transition-colors active:scale-[0.98]"
                style={{
                  width: 72,
                  height: 44,
                  backgroundColor: verifying ? "#95A5A6" : "#C0392B",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 8,
                  border: "none",
                  cursor: verifying ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!verifying)
                    e.currentTarget.style.backgroundColor = "#A93226"
                }}
                onMouseLeave={(e) => {
                  if (!verifying)
                    e.currentTarget.style.backgroundColor = "#C0392B"
                }}
              >
                {verifying ? (
                  <Loader2
                    className="mx-auto animate-spin"
                    style={{ width: 18, height: 18 }}
                  />
                ) : (
                  "验证"
                )}
              </button>
            )}
          </div>

          {/* Error hint */}
          {codeError && (
            <div
              className="flex items-center"
              style={{ marginTop: 8, gap: 4 }}
            >
              <AlertCircle style={{ width: 12, height: 12, color: "#E74C3C" }} />
              <p style={{ fontSize: 12, color: "#E74C3C" }}>{codeError}</p>
            </div>
          )}

        </div>
      </div>

      {/* ---- Area C: Form (expands after verification) ---- */}
      {verified && (
        <div
          ref={formRef}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ padding: "24px 16px 0" }}
        >
          <div className="space-y-4">
            <PersonForm
              title={mode === "single" ? "我的信息" : "用户 1"}
              value={person1}
              onChange={setPerson1}
              accent="red"
            />

            {mode === "double" && (
              <>
                {/* Red thread connector */}
                <div
                  className="flex items-center justify-center"
                  style={{ height: 60, gap: 12 }}
                >
                  <div
                    style={{
                      height: 0,
                      width: 40,
                      borderTop: "2px dashed #C0392B",
                      opacity: 0.4,
                    }}
                  />
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 32,
                      height: 32,
                      backgroundColor: "#F9E7E5",
                      border: "2px solid rgba(192,57,43,0.3)",
                    }}
                  >
                    <Heart
                      style={{ width: 16, height: 16, color: "#C0392B" }}
                      fill="rgba(192,57,43,0.15)"
                    />
                  </div>
                  <div
                    style={{
                      height: 0,
                      width: 40,
                      borderTop: "2px dashed #C0392B",
                      opacity: 0.4,
                    }}
                  />
                </div>

                <PersonForm
                  title="用户 2"
                  value={person2}
                  onChange={setPerson2}
                  accent="blue"
                />
              </>
            )}
          </div>

          {/* ---- Area D: Submit Button ---- */}
          <div style={{ marginTop: 24, marginBottom: 8 }}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center transition-all active:scale-[0.98]"
              style={{
                height: 52,
                borderRadius: 12,
                background: submitting
                  ? "#95A5A6"
                  : "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)",
                color: "#FFFFFF",
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "0.15em",
                border: "none",
                boxShadow: submitting
                  ? "none"
                  : "0 4px 12px rgba(192, 57, 43, 0.3)",
                cursor: submitting ? "not-allowed" : "pointer",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #A93226 0%, #C0392B 100%)"
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(192, 57, 43, 0.4)"
                  e.currentTarget.style.transform = "translateY(-2px)"
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)"
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(192, 57, 43, 0.3)"
                  e.currentTarget.style.transform = "translateY(0)"
                }
              }}
            >
              {submitting ? (
                <Loader2
                  className="animate-spin"
                  style={{ width: 24, height: 24 }}
                />
              ) : (
                <>
                  <Sparkles style={{ width: 18, height: 18 }} />
                  {"开启红线运势"}
                </>
              )}
            </button>
            <p
              className="text-center"
              style={{ fontSize: 11, color: "#95A5A6", marginTop: 8 }}
            >
              {"AI 调用超时或网络异常不扣除验证码"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
