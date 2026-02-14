"use client"

import { Users, Briefcase, Sparkle, Star } from "lucide-react"

interface IdealPartner {
  personality_traits: string[]
  career_fields: string[]
  element_match: string
  zodiac_match: string
  advice: string
}

interface IdealPartnerProps {
  partner: IdealPartner
}

export function IdealPartner({ partner }: IdealPartnerProps) {
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
            backgroundColor: "#E8F5E9",
            border: "1px solid rgba(76, 175, 80, 0.2)",
          }}
        >
          <Users style={{ width: 16, height: 16, color: "#4CAF50" }} />
        </div>
        <div>
          <h3
            className="font-serif"
            style={{ fontSize: 18, fontWeight: 600, color: "#2C3E50" }}
          >
            {"理想对象"}
          </h3>
          <p style={{ fontSize: 11, color: "#95A5A6" }}>{"八字相配之人"}</p>
        </div>
      </div>

      {/* Personality traits */}
      <div style={{ marginBottom: 14 }}>
        <div className="flex items-center" style={{ gap: 6, marginBottom: 8 }}>
          <Sparkle style={{ width: 14, height: 14, color: "#4CAF50" }} />
          <span
            className="font-serif"
            style={{ fontSize: 13, fontWeight: 600, color: "#2C3E50" }}
          >
            {"性格特质"}
          </span>
        </div>
        <div className="flex flex-wrap" style={{ gap: 8 }}>
          {partner.personality_traits.map((trait, index) => (
            <div
              key={index}
              style={{
                padding: "6px 12px",
                backgroundColor: "#F1F8E9",
                borderRadius: 16,
                border: "1px solid rgba(76, 175, 80, 0.2)",
              }}
            >
              <span style={{ fontSize: 12, color: "#4CAF50", fontWeight: 500 }}>
                {trait}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Career fields */}
      <div style={{ marginBottom: 14 }}>
        <div className="flex items-center" style={{ gap: 6, marginBottom: 8 }}>
          <Briefcase style={{ width: 14, height: 14, color: "#4CAF50" }} />
          <span
            className="font-serif"
            style={{ fontSize: 13, fontWeight: 600, color: "#2C3E50" }}
          >
            {"职业领域"}
          </span>
        </div>
        <div className="flex flex-wrap" style={{ gap: 8 }}>
          {partner.career_fields.map((career, index) => (
            <div
              key={index}
              style={{
                padding: "6px 12px",
                backgroundColor: "#E8F5E9",
                borderRadius: 16,
                border: "1px solid rgba(76, 175, 80, 0.2)",
              }}
            >
              <span style={{ fontSize: 12, color: "#388E3C", fontWeight: 500 }}>
                {career}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Element and zodiac match */}
      <div
        style={{
          padding: 12,
          backgroundColor: "#FAF8F3",
          borderRadius: 8,
          border: "1px solid #ECF0F1",
          marginBottom: 14,
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <div className="flex items-center" style={{ gap: 6, marginBottom: 4 }}>
            <Star style={{ width: 12, height: 12, color: "#4CAF50" }} />
            <span style={{ fontSize: 11, color: "#7F8C8D", fontWeight: 600 }}>
              {"五行相配"}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#2C3E50", lineHeight: 1.5 }}>
            {partner.element_match}
          </p>
        </div>
        <div>
          <div className="flex items-center" style={{ gap: 6, marginBottom: 4 }}>
            <Star style={{ width: 12, height: 12, color: "#4CAF50" }} />
            <span style={{ fontSize: 11, color: "#7F8C8D", fontWeight: 600 }}>
              {"生肖相合"}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#2C3E50", lineHeight: 1.5 }}>
            {partner.zodiac_match}
          </p>
        </div>
      </div>

      {/* Advice */}
      <div
        style={{
          padding: 12,
          backgroundColor: "rgba(76, 175, 80, 0.05)",
          borderRadius: 8,
          border: "1px solid rgba(76, 175, 80, 0.15)",
        }}
      >
        <p style={{ fontSize: 12, lineHeight: 1.7, color: "#2C3E50" }}>
          {partner.advice}
        </p>
      </div>

      {/* Bottom decoration */}
      <div className="flex items-center justify-center" style={{ marginTop: 14, gap: 8 }}>
        <div style={{ height: 1, width: 30, backgroundColor: "rgba(76, 175, 80, 0.2)" }} />
        <span
          className="font-serif"
          style={{ fontSize: 10, color: "rgba(76, 175, 80, 0.5)", letterSpacing: "0.15em" }}
        >
          {"天作之合"}
        </span>
        <div style={{ height: 1, width: 30, backgroundColor: "rgba(76, 175, 80, 0.2)" }} />
      </div>
    </section>
  )
}
