import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PromoCodeType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, selectedType } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: '请输入验证码' },
        { status: 400 }
      )
    }

    // 查询验证码
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    })

    // 验证码不存在
    if (!promoCode) {
      return NextResponse.json(
        { valid: false, error: '验证码无效' },
        { status: 404 }
      )
    }

    // 验证码已停用
    if (promoCode.status === 'DISABLED') {
      return NextResponse.json(
        { valid: false, error: '验证码已停用' },
        { status: 403 }
      )
    }

    // 验证码已用尽
    if (promoCode.status === 'EXHAUSTED' || promoCode.usageCount >= promoCode.maxUsage) {
      return NextResponse.json(
        { valid: false, error: '验证码已用尽' },
        { status: 403 }
      )
    }

    // 智能切换逻辑：检查类型是否匹配
    const correctType = promoCode.type === PromoCodeType.SINGLE ? 'single' : 'double'
    const remainingUsage = promoCode.maxUsage - promoCode.usageCount

    return NextResponse.json({
      valid: true,
      correctType,
      remainingUsage,
    })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { valid: false, error: '服务器错误' },
      { status: 500 }
    )
  }
}
