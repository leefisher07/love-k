import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: '缺少验证码参数' },
        { status: 400 }
      )
    }

    // 查询验证码
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: {
        reports: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!promoCode) {
      return NextResponse.json(
        { error: '验证码不存在' },
        { status: 404 }
      )
    }

    // 返回报告列表
    const reports = promoCode.reports.map((report) => {
      const formData = report.formData as any
      return {
        reportId: report.id,
        mode: formData.mode || 'single',
        createdAt: report.createdAt.toISOString(),
      }
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Get reports list error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
