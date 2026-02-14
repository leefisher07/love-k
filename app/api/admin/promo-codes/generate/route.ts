import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 简单的密码验证中间件
function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD || '014105041515Li'

  if (!authHeader || authHeader !== `Bearer ${password}`) {
    return false
  }

  return true
}

// 生成随机验证码
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 排除易混淆字符
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// POST /api/admin/promo-codes/generate - 生成验证码
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, quantity = 1, maxUsage = 1, batchNote } = body

    if (!type || !['SINGLE', 'COUPLE'].includes(type)) {
      return NextResponse.json(
        { error: '类型必须是SINGLE或COUPLE' },
        { status: 400 }
      )
    }

    const codes: string[] = []
    const existingCodes = new Set(
      (await prisma.promoCode.findMany({ select: { code: true } })).map(c => c.code)
    )

    // 生成唯一验证码
    while (codes.length < quantity) {
      const code = generateCode()
      if (!existingCodes.has(code) && !codes.includes(code)) {
        codes.push(code)
      }
    }

    // 批量插入
    const promoCodes = await prisma.promoCode.createMany({
      data: codes.map(code => ({
        code,
        type,
        maxUsage,
        batchNote,
      })),
    })

    return NextResponse.json({
      success: true,
      count: promoCodes.count,
      codes,
    })
  } catch (error) {
    console.error('Generate promo codes error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
