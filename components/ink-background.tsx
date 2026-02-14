"use client"

export function InkBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Rice paper base */}
      <div className="absolute inset-0" style={{ backgroundColor: "#FAF8F3" }} />

      {/* Ink wash mountain silhouette - bottom */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        style={{ opacity: 0.04 }}
        viewBox="0 0 1440 400"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
      >
        <path
          d="M0 400V280C50 260 120 200 200 220C280 240 320 180 400 160C480 140 520 200 600 180C680 160 720 100 800 120C880 140 920 200 1000 180C1080 160 1120 100 1200 140C1280 180 1360 160 1440 180V400H0Z"
          fill="#2C3E50"
        />
        <path
          d="M0 400V320C80 300 160 260 240 280C320 300 400 240 480 260C560 280 640 220 720 240C800 260 880 300 960 280C1040 260 1120 220 1200 260C1280 300 1360 280 1440 300V400H0Z"
          fill="#2C3E50"
        />
      </svg>

      {/* Subtle moon circle */}
      <div
        className="absolute rounded-full"
        style={{
          top: 60,
          right: 30,
          width: 50,
          height: 50,
          border: "1px solid rgba(192, 57, 43, 0.06)",
        }}
      />
    </div>
  )
}
