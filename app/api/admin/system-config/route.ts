import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD || '014105041515Li'
  return authHeader === `Bearer ${password}`
}

// GET /api/admin/system-config - 获取系统配置
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const configs = await prisma.systemConfig.findMany()

    const configMap: Record<string, any> = {}
    configs.forEach(config => {
      configMap[config.key] = {
        value: config.value,
        description: config.description,
        updatedAt: config.updatedAt.toISOString(),
      }
    })

    return NextResponse.json({ configs: configMap })
  } catch (error) {
    console.error('Get system config error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// PUT /api/admin/system-config - 更新系统配置
export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: '缺少key或value参数' },
        { status: 400 }
      )
    }

    const config = await prisma.systemConfig.upsert({
      where: { key },
      update: { value: value.toString() },
      create: {
        key,
        value: value.toString(),
        description: key === 'rate_limit_per_minute' ? 'IP限流：每分钟最大请求数' : null,
      },
    })

    return NextResponse.json({
      success: true,
      config: {
        key: config.key,
        value: config.value,
        updatedAt: config.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Update system config error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
