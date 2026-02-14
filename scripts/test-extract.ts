// 测试 extractJSON 函数
function extractJSON(content: string): string {
  // 移除可能的 markdown 代码块标记
  let cleaned = content.trim()

  // 如果内容被 ```json 或 ``` 包裹，提取出来
  const jsonBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (jsonBlockMatch) {
    cleaned = jsonBlockMatch[1].trim()
  }

  // 移除可能的前导文本（如 "这是结果："等）
  const jsonStartMatch = cleaned.match(/\{[\s\S]*\}/)
  if (jsonStartMatch) {
    cleaned = jsonStartMatch[0]
  }

  return cleaned
}

const testContent = `\`\`\`json
{
    "bazi_summary": "金寒水冷",
    "bazi_pillars": {
        "year": "己巳",
        "month": "丙子",
        "day": "壬子",
        "hour": "庚子"
    },
    "horse_year_analysis": {
        "title": "2026 丙午马年·流年特批",
        "content": "测试内容"
    },
    "k_line_data": [
        {
            "year": 2026,
            "score": 88,
            "keyword": "红鸾星动",
            "desc": "流年桃花入命，正缘机遇显现"
        }
    ],
    "radar_scores": [85, 70, 90, 60, 80, 75],
    "final_advice": "测试建议"
}
\`\`\``

console.log('原始内容:')
console.log(testContent)
console.log('\n提取后的内容:')
const extracted = extractJSON(testContent)
console.log(extracted)

console.log('\n尝试解析 JSON:')
try {
  const parsed = JSON.parse(extracted)
  console.log('✅ 解析成功!')
  console.log(JSON.stringify(parsed, null, 2))
} catch (e: any) {
  console.error('❌ 解析失败:', e.message)
}
