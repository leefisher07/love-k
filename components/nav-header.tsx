"use client"

import { cn } from "@/lib/utils"
import { Compass, ScrollText } from "lucide-react"

export type TabKey = "fortune" | "history"

interface BottomTabBarProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

const tabs: { key: TabKey; label: string; icon: typeof Compass }[] = [
  { key: "fortune", label: "缘分测算", icon: Compass },
  { key: "history", label: "我的书简", icon: ScrollText },
]

export function BottomTabBar({ active, onChange }: BottomTabBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
      style={{
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #ECF0F1",
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.05)",
      }}
      role="tablist"
      aria-label="主导航"
    >
      <div className="mx-auto flex max-w-lg" style={{ height: 64 }}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center transition-transform active:scale-95"
              )}
              style={{ gap: 4 }}
            >
              <Icon
                className="transition-colors"
                style={{
                  width: 24,
                  height: 24,
                  color: isActive ? "#C0392B" : "#95A5A6",
                  strokeWidth: isActive ? 2.2 : 1.8,
                }}
              />
              <span
                className="font-sans"
                style={{
                  fontSize: 14,
                  color: isActive ? "#C0392B" : "#5D6D7E",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {tab.label}
              </span>
              {/* Bottom indicator */}
              {isActive && (
                <div
                  className="absolute bottom-1.5 rounded-full animate-in slide-in-from-bottom-1 duration-200"
                  style={{
                    width: 20,
                    height: 3,
                    backgroundColor: "#C0392B",
                    borderRadius: 9999,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
