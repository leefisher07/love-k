import OpenAI from 'openai'
import * as fs from 'fs'
import * as path from 'path'

// 手动加载 .env 文件
const envPath = path.join(__dirname, '..', '.env')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envLines = envContent.split('\n')
for (const line of envLines) {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    const value = match[2].trim().replace(/^["']|["']$/g, '')
    process.env[key] = value
  }
}

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
})

async function testDeepSeek() {
  console.log('开始测试 DeepSeek API...')
  console.log('API Key:', process.env.DEEPSEEK_API_KEY?.substring(0, 10) + '...')
  console.log('Base URL:', process.env.DEEPSEEK_BASE_URL)

  const systemPrompt = `你是一位精通《三命通会》与现代心理学的AI情感咨询师。你的语言风格是'新中式'（半文半白，优美），但内核是现代心理学建议。当前流年：2026年 (丙午年 - 火马年)。

【重要】你必须只返回有效的JSON格式，不要添加任何解释文字、markdown标记或其他内容。直接输出JSON对象，确保所有字符串都正确转义，数组和对象结构完整。`

  const userPrompt = `【指令】请根据以下信息生成JSON格式的运势报告。

[用户信息]: 姓名=测试用户, 性别=男, 出生日期=1990-01-01（公历，请自动转干支计算日柱）, 出生时辰=子时, 出生地点=北京
[关系状态]: 单身
[心中所愿]: 希望找到真爱
[备注]: 无

【输出JSON格式】
{
  "bazi_summary": "4字标签",
  "bazi_pillars": {
    "year": "己巳",
    "month": "丙子",
    "day": "壬子",
    "hour": "庚子"
  },
  "horse_year_analysis": {
    "title": "2026 丙午马年·流年特批",
    "content": "约200字分析"
  },
  "k_line_data": [
    {
      "year": 2026,
      "score": 88,
      "keyword": "红鸾星动",
      "desc": "简短解释"
    }
  ],
  "radar_scores": [85, 70, 90, 60, 80, 75],
  "final_advice": "300字建议"
}`

  try {
    console.log('\n发送请求到 DeepSeek...')
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 1.3,
      max_tokens: 4000,
    })

    console.log('\n=== API 响应 ===')
    console.log('完整响应:', JSON.stringify(completion, null, 2))

    console.log('\n=== 提取的内容 ===')
    const content = completion.choices[0]?.message?.content
    console.log(content)

    if (content) {
      console.log('\n=== 尝试解析 JSON ===')
      try {
        const parsed = JSON.parse(content)
        console.log('✅ JSON 解析成功!')
        console.log(JSON.stringify(parsed, null, 2))
      } catch (e: any) {
        console.error('❌ JSON 解析失败:', e.message)
      }
    } else {
      console.error('❌ 内容为空')
    }
  } catch (error: any) {
    console.error('❌ API 调用失败:', error.message)
    if (error.response) {
      console.error('响应数据:', error.response.data)
    }
  }
}

testDeepSeek()
