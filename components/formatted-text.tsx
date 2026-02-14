"use client"

interface FormattedTextProps {
  text: string
  style?: React.CSSProperties
}

export function FormattedText({ text, style }: FormattedTextProps) {
  // Split by double newlines for paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, ...style }}>
      {paragraphs.map((para, idx) => {
        const trimmed = para.trim()

        // Check if it's a numbered list item (starts with "1.", "2.", etc.)
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/)
        if (numberedMatch) {
          return (
            <div key={idx} style={{ display: 'flex', gap: 8 }}>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#C0392B',
                flexShrink: 0,
                width: 20
              }}>
                {numberedMatch[1]}.
              </span>
              <p style={{
                fontSize: 13,
                lineHeight: 1.75,
                color: '#2C3E50',
                margin: 0,
                flex: 1
              }}>
                {numberedMatch[2]}
              </p>
            </div>
          )
        }

        // Regular paragraph
        return (
          <p key={idx} style={{
            fontSize: 13,
            lineHeight: 1.75,
            color: '#2C3E50',
            margin: 0
          }}>
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}
