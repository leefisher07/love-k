"use client"

import React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BIRTH_HOURS, RELATIONSHIPS, PROVINCES, type PersonInfo } from "@/lib/types"
import { Switch } from "@/components/ui/switch"

interface PersonFormProps {
  title: string
  value: PersonInfo
  onChange: (data: PersonInfo) => void
  accent?: "red" | "blue"
}

export function PersonForm({
  title,
  value,
  onChange,
  accent = "red",
}: PersonFormProps) {
  const update = (key: keyof PersonInfo, val: string) => {
    onChange({ ...value, [key]: val })
  }

  const accentColor = accent === "red" ? "#C0392B" : "#3498DB"

  return (
    <div
      style={{
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Section title with left accent bar */}
      <div
        className="flex items-center"
        style={{
          marginBottom: 16,
          paddingLeft: 12,
          borderLeft: `3px solid ${accentColor}`,
        }}
      >
        <h3
          className="font-serif"
          style={{ fontSize: 18, fontWeight: 600, color: "#2C3E50" }}
        >
          {title}
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Name */}
        <div>
          <FieldLabel required>{"姓名"}</FieldLabel>
          <SpecInput
            placeholder="请输入姓名"
            value={value.name}
            onChange={(v) => update("name", v)}
          />
        </div>

        {/* Gender - Radio */}
        <div>
          <FieldLabel required>{"性别"}</FieldLabel>
          <div className="flex" style={{ gap: 16, marginTop: 6 }}>
            {[
              { value: "male", label: "男" },
              { value: "female", label: "女" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center cursor-pointer"
                style={{ gap: 8 }}
              >
                <span
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2px solid ${value.gender === opt.value ? "#C0392B" : "#BDC3C7"}`,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  {value.gender === opt.value && (
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "#C0392B",
                      }}
                    />
                  )}
                </span>
                <input
                  type="radio"
                  name={`${title}-gender`}
                  value={opt.value}
                  checked={value.gender === opt.value}
                  onChange={(e) => update("gender", e.target.value)}
                  className="sr-only"
                />
                <span style={{ fontSize: 15, color: "#2C3E50" }}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Birth Date */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
            <FieldLabel required style={{ marginBottom: 0 }}>
              {"出生日期"}
            </FieldLabel>
            <div className="flex items-center" style={{ gap: 6 }}>
              <span
                style={{
                  fontSize: 12,
                  color: value.calendarType === "solar" ? "#C0392B" : "#95A5A6",
                  fontWeight: value.calendarType === "solar" ? 500 : 400,
                }}
              >
                {"公历"}
              </span>
              <Switch
                checked={value.calendarType === "lunar"}
                onCheckedChange={(checked) =>
                  update("calendarType", checked ? "lunar" : "solar")
                }
                className="h-4 w-7"
              />
              <span
                style={{
                  fontSize: 12,
                  color: value.calendarType === "lunar" ? "#C0392B" : "#95A5A6",
                  fontWeight: value.calendarType === "lunar" ? 500 : 400,
                }}
              >
                {"农历"}
              </span>
            </div>
          </div>
          <SpecInput
            type="date"
            value={value.birthDate}
            onChange={(v) => update("birthDate", v)}
          />
        </div>

        {/* Birth Hour */}
        <div>
          <FieldLabel>{"出生时辰"}</FieldLabel>
          <Select
            value={value.birthHour}
            onValueChange={(v) => update("birthHour", v)}
          >
            <SelectTrigger
              className="font-sans"
              style={{
                height: 44,
                backgroundColor: "#FAF8F3",
                border: "1px solid #ECF0F1",
                borderRadius: 8,
                fontSize: 15,
                color: "#2C3E50",
              }}
            >
              <SelectValue placeholder="选择时辰" />
            </SelectTrigger>
            <SelectContent
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                maxHeight: 240,
              }}
            >
              {BIRTH_HOURS.map((h) => (
                <SelectItem
                  key={h.value}
                  value={h.value}
                  style={{ height: 40, fontSize: 14 }}
                >
                  {h.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Birth Place */}
        <div>
          <FieldLabel required>{"出生地点"}</FieldLabel>
          <Select
            value={value.birthPlace}
            onValueChange={(v) => update("birthPlace", v)}
          >
            <SelectTrigger
              className="font-sans"
              style={{
                height: 44,
                backgroundColor: "#FAF8F3",
                border: "1px solid #ECF0F1",
                borderRadius: 8,
                fontSize: 15,
                color: "#2C3E50",
              }}
            >
              <SelectValue placeholder="选择省份" />
            </SelectTrigger>
            <SelectContent
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                maxHeight: 240,
              }}
            >
              {PROVINCES.map((p) => (
                <SelectItem key={p} value={p} style={{ height: 40, fontSize: 14 }}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Relationship - radio group */}
        <div>
          <FieldLabel>{"关系状态"}</FieldLabel>
          <div className="flex flex-wrap" style={{ gap: "8px 16px", marginTop: 6 }}>
            {RELATIONSHIPS.map((r) => (
              <label
                key={r.value}
                className="flex items-center cursor-pointer"
                style={{ gap: 6 }}
              >
                <span
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2px solid ${value.relationship === r.value ? "#C0392B" : "#BDC3C7"}`,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  {value.relationship === r.value && (
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "#C0392B",
                      }}
                    />
                  )}
                </span>
                <input
                  type="radio"
                  name={`${title}-relationship`}
                  value={r.value}
                  checked={value.relationship === r.value}
                  onChange={(e) => update("relationship", e.target.value)}
                  className="sr-only"
                />
                <span style={{ fontSize: 15, color: "#2C3E50" }}>
                  {r.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Wish - Textarea */}
        <div>
          <FieldLabel>
            {"心中所愿"}
            <span style={{ fontSize: 12, color: "#95A5A6", marginLeft: 4 }}>
              {"（选填）"}
            </span>
          </FieldLabel>
          <div className="relative">
            <Textarea
              placeholder="说说你的心愿...（选填）"
              value={value.wish}
              onChange={(e) => update("wish", e.target.value)}
              maxLength={200}
              className="font-sans resize-none"
              style={{
                minHeight: 80,
                maxHeight: 120,
                backgroundColor: "#FAF8F3",
                border: "1px solid #ECF0F1",
                borderRadius: 8,
                padding: 12,
                fontSize: 15,
                lineHeight: 1.5,
                color: "#2C3E50",
              }}
            />
            <span
              className="absolute bottom-2 right-3"
              style={{ fontSize: 12, color: "#95A5A6" }}
            >
              {value.wish.length}/200
            </span>
          </div>
        </div>

        {/* Note */}
        <div>
          <FieldLabel>
            {"备注"}
            <span style={{ fontSize: 12, color: "#95A5A6", marginLeft: 4 }}>
              {"（选填，限100字）"}
            </span>
          </FieldLabel>
          <div className="relative">
            <SpecInput
              placeholder="补充说明...（选填，限100字）"
              value={value.note}
              onChange={(v) => {
                if (v.length <= 100) update("note", v)
              }}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ fontSize: 12, color: "#95A5A6" }}
            >
              {value.note.length}/100
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---- Helper: Field Label ---- */
function FieldLabel({
  children,
  required,
  style,
}: {
  children: React.ReactNode
  required?: boolean
  style?: React.CSSProperties
}) {
  return (
    <label
      className="block font-sans"
      style={{
        fontSize: 14,
        color: "#5D6D7E",
        fontWeight: 500,
        marginBottom: 6,
        ...style,
      }}
    >
      {required && (
        <span style={{ color: "#E74C3C", marginRight: 2 }}>{"*"}</span>
      )}
      {children}
    </label>
  )
}

/* ---- Helper: Styled Input ---- */
function SpecInput({
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full outline-none font-sans transition-shadow"
      style={{
        height: 44,
        backgroundColor: "#FAF8F3",
        border: "1px solid #ECF0F1",
        borderRadius: 8,
        padding: "0 12px",
        fontSize: 15,
        color: "#2C3E50",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#C0392B"
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(192, 57, 43, 0.1)"
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#ECF0F1"
        e.currentTarget.style.boxShadow = "none"
      }}
    />
  )
}
