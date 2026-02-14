import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'
import { getPromptConfig, fillPromptTemplate } from '@/lib/config'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
})

// 清理和提取 JSON 内容
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, mode, person1, person2 } = body

    // 获取客户端IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    // IP限流检查
    const rateLimitPassed = await checkRateLimit(ip, 10)
    if (!rateLimitPassed) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      )
    }

    // 验证验证码
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    })

    if (!promoCode || promoCode.status !== 'ACTIVE' || promoCode.usageCount >= promoCode.maxUsage) {
      return NextResponse.json(
        { error: '验证码无效或已用尽' },
        { status: 403 }
      )
    }

    // 检查类型匹配
    const expectedType = mode === 'single' ? 'SINGLE' : 'COUPLE'
    if (promoCode.type !== expectedType) {
      return NextResponse.json(
        { error: '验证码类型不匹配' },
        { status: 400 }
      )
    }

    let reportData: any

    try {
      if (mode === 'single') {
        // 单人模式：调用1次AI
        reportData = await generateSingleReport(person1)
      } else {
        // 双人模式：调用3次AI
        reportData = await generateCoupleReport(person1, person2!)
      }
    } catch (aiError: any) {
      console.error('AI调用失败:', aiError)
      // AI调用失败，不扣除次数
      return NextResponse.json(
        { error: 'AI生成失败，请重试', details: aiError.message },
        { status: 500 }
      )
    }

    // 创建报告记录
    const report = await prisma.report.create({
      data: {
        promoCodeId: promoCode.id,
        formData: { mode, person1, person2 },
        reportData,
      },
    })

    // 更新验证码使用次数
    await prisma.promoCode.update({
      where: { id: promoCode.id },
      data: {
        usageCount: promoCode.usageCount + 1,
        status: promoCode.usageCount + 1 >= promoCode.maxUsage ? 'EXHAUSTED' : 'ACTIVE',
        firstUsedAt: promoCode.firstUsedAt || new Date(),
        lastUsedAt: new Date(),
      },
    })

    return NextResponse.json({
      reportId: report.id,
      reportData,
    })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

async function generateSingleReport(person: any) {
  const config = getPromptConfig()

  const userPrompt = fillPromptTemplate(config.user_prompt_single, {
    name: person.name,
    gender: person.gender === 'male' ? '男' : '女',
    birth_date: person.birthDate,
    birth_hour: person.birthHour,
    location: person.birthPlace,
    status: person.relationship,
    wish: person.wish || '无',
    note: person.note || '无',
  })

  const completion = await openai.chat.completions.create({
    model: config.model_settings.model,
    messages: [
      { role: 'system', content: config.system_prompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: config.model_settings.temperature,
    max_tokens: config.model_settings.max_tokens,
  })

  const content = completion.choices[0]?.message?.content

  if (!content) {
    console.error('API 响应结构:', {
      choices: completion.choices,
      firstChoice: completion.choices[0],
      message: completion.choices[0]?.message
    })
    throw new Error('AI返回内容为空')
  }

  console.log('=== DeepSeek 返回的原始内容 ===')
  console.log(content)
  console.log('=== 内容结束 ===')

  // 清理和提取 JSON
  const cleanedContent = extractJSON(content)
  console.log('=== 清理后的内容 ===')
  console.log(cleanedContent)
  console.log('=== 清理内容结束 ===')

  try {
    const parsedData = JSON.parse(cleanedContent)

    // 验证并补全单人模式报告的必需字段
    const validatedData = validateSingleReport(parsedData)

    return validatedData
  } catch (parseError: any) {
    console.error('JSON 解析失败:', parseError.message)
    console.error('尝试解析的内容:', cleanedContent)
    throw new Error(`JSON解析失败: ${parseError.message}`)
  }
}

// 验证并补全单人模式报告数据
function validateSingleReport(data: any): any {
  const validated: any = {
    bazi_summary: data.bazi_summary || '命理分析',
    bazi_pillars: data.bazi_pillars || {
      year: '未知',
      month: '未知',
      day: '未知',
      hour: '未知'
    },
    horse_year_analysis: data.horse_year_analysis || {
      title: '2026 丙午马年·流年特批',
      content: '流年分析暂无'
    },
    k_line_data: Array.isArray(data.k_line_data) && data.k_line_data.length > 0
      ? data.k_line_data
      : [{ year: 2026, score: 50, keyword: '平稳', desc: '运势平稳' }],
    peach_blossom_years: Array.isArray(data.peach_blossom_years) && data.peach_blossom_years.length > 0
      ? data.peach_blossom_years
      : [
          {
            year: 2027,
            intensity: '旺',
            person_type: '性格温和、有责任心的人',
            reason: '此年桃花运势较旺，适合主动社交，易遇志同道合之人。'
          },
          {
            year: 2029,
            intensity: '中旺',
            person_type: '成熟稳重、事业有成的人',
            reason: '此年运势稳定，适合发展长期关系，易遇可靠伴侣。'
          },
          {
            year: 2031,
            intensity: '旺',
            person_type: '开朗活泼、积极向上的人',
            reason: '此年人际关系活跃，桃花运势上升，易遇阳光开朗之人。'
          }
        ],
    ideal_partner: data.ideal_partner || {
      personality_traits: ['温和体贴', '理性务实', '有责任心', '善于沟通'],
      career_fields: ['教育行业', '金融财会', '医疗健康', '文化创意'],
      element_match: '根据八字五行分析，宜找五行互补之人',
      zodiac_match: '生肖相合者为佳',
      advice: '建议寻找性格互补、价值观相近的伴侣，注重沟通和理解，共同成长。'
    },
    radar_scores: Array.isArray(data.radar_scores) && data.radar_scores.length === 6
      ? data.radar_scores
      : [70, 70, 70, 70, 70, 70],
    final_advice: data.final_advice || '建议保持积极心态，顺应自然规律，把握机遇。'
  }

  console.log('=== 数据验证结果 ===')
  console.log('peach_blossom_years:', validated.peach_blossom_years ? '已提供' : '使用默认值')
  console.log('ideal_partner:', validated.ideal_partner ? '已提供' : '使用默认值')

  return validated
}

// 验证并补全双人模式个人报告数据
function validateCouplePersonReport(data: any): any {
  const validated: any = {
    bazi_summary: data.bazi_summary || '命理分析',
    bazi_pillars: data.bazi_pillars || {
      year: '未知',
      month: '未知',
      day: '未知',
      hour: '未知'
    },
    k_line_data: Array.isArray(data.k_line_data) && data.k_line_data.length > 0
      ? data.k_line_data
      : [{ year: 2026, score: 50, keyword: '平稳', desc: '运势平稳' }],
    radar_scores: Array.isArray(data.radar_scores) && data.radar_scores.length === 6
      ? data.radar_scores
      : [70, 70, 70, 70, 70, 70],
  }

  return validated
}

// 验证并补全双人模式关系分析数据
function validateCoupleRelationshipReport(data: any): any {
  const validated: any = {
    horse_year_analysis: '',
    final_advice: '',
  }

  // 处理 horse_year_analysis
  if (data.horse_year_analysis) {
    if (typeof data.horse_year_analysis === 'string') {
      validated.horse_year_analysis = data.horse_year_analysis
    } else if (typeof data.horse_year_analysis === 'object') {
      // 如果是对象，提取 content 字段
      validated.horse_year_analysis = data.horse_year_analysis.content || data.horse_year_analysis.title || '流年分析暂无'
    } else {
      validated.horse_year_analysis = '流年分析暂无'
    }
  } else {
    validated.horse_year_analysis = '流年分析暂无'
  }

  // 处理 final_advice
  if (data.final_advice) {
    if (typeof data.final_advice === 'string') {
      validated.final_advice = data.final_advice
    } else if (typeof data.final_advice === 'object') {
      // 如果是对象，提取 content 字段
      validated.final_advice = data.final_advice.content || data.final_advice.advice || '建议保持积极心态，顺应自然规律，把握机遇。'
    } else {
      validated.final_advice = '建议保持积极心态，顺应自然规律，把握机遇。'
    }
  } else {
    validated.final_advice = '建议保持积极心态，顺应自然规律，把握机遇。'
  }

  console.log('=== 双人模式关系数据验证结果 ===')
  console.log('horse_year_analysis type:', typeof validated.horse_year_analysis)
  console.log('final_advice type:', typeof validated.final_advice)

  return validated
}

async function generateCoupleReport(person1: any, person2: any) {
  const config = getPromptConfig()

  // 第1次调用：生成用户1的报告
  const user1Prompt = fillPromptTemplate(config.user_prompt_couple_person, {
    name: person1.name,
    gender: person1.gender === 'male' ? '男' : '女',
    birth_date: person1.birthDate,
    birth_hour: person1.birthHour,
    location: person1.birthPlace,
  })

  const completion1 = await openai.chat.completions.create({
    model: config.model_settings.model,
    messages: [
      { role: 'system', content: config.system_prompt },
      { role: 'user', content: user1Prompt },
    ],
    temperature: config.model_settings.temperature,
    max_tokens: config.model_settings.max_tokens,
  })

  const user1Content = completion1.choices[0]?.message?.content
  if (!user1Content) {
    throw new Error('用户1的AI返回内容为空')
  }
  const user1Data = validateCouplePersonReport(JSON.parse(extractJSON(user1Content)))

  // 第2次调用：生成用户2的报告
  const user2Prompt = fillPromptTemplate(config.user_prompt_couple_person, {
    name: person2.name,
    gender: person2.gender === 'male' ? '男' : '女',
    birth_date: person2.birthDate,
    birth_hour: person2.birthHour,
    location: person2.birthPlace,
  })

  const completion2 = await openai.chat.completions.create({
    model: config.model_settings.model,
    messages: [
      { role: 'system', content: config.system_prompt },
      { role: 'user', content: user2Prompt },
    ],
    temperature: config.model_settings.temperature,
    max_tokens: config.model_settings.max_tokens,
  })

  const user2Content = completion2.choices[0]?.message?.content
  if (!user2Content) {
    throw new Error('用户2的AI返回内容为空')
  }
  const user2Data = validateCouplePersonReport(JSON.parse(extractJSON(user2Content)))

  // 第3次调用：生成关系分析
  const relationshipPrompt = fillPromptTemplate(config.user_prompt_couple_relationship, {
    name_1: person1.name,
    gender_1: person1.gender === 'male' ? '男' : '女',
    birth_1: person1.birthDate,
    hour_1: person1.birthHour,
    location_1: person1.birthPlace,
    name_2: person2.name,
    gender_2: person2.gender === 'male' ? '男' : '女',
    birth_2: person2.birthDate,
    hour_2: person2.birthHour,
    location_2: person2.birthPlace,
    status: person1.relationship,
    wish: person1.wish || '无',
    note: person1.note || '无',
  })

  const completion3 = await openai.chat.completions.create({
    model: config.model_settings.model,
    messages: [
      { role: 'system', content: config.system_prompt },
      { role: 'user', content: relationshipPrompt },
    ],
    temperature: config.model_settings.temperature,
    max_tokens: config.model_settings.max_tokens,
  })

  const relationshipContent = completion3.choices[0]?.message?.content
  if (!relationshipContent) {
    throw new Error('关系分析的AI返回内容为空')
  }
  const relationshipData = validateCoupleRelationshipReport(JSON.parse(extractJSON(relationshipContent)))

  // 合并结果
  return {
    user1: user1Data,
    user2: user2Data,
    horse_year_analysis: relationshipData.horse_year_analysis,
    final_advice: relationshipData.final_advice,
  }
}
