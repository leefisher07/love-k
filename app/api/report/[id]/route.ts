import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: '缺少验证码参数' },
        { status: 400 }
      )
    }

    // 查询报告
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        promoCode: true,
      },
    })

    if (!report) {
      return NextResponse.json(
        { error: '报告不存在' },
        { status: 404 }
      )
    }

    // 验证验证码是否匹配
    if (report.promoCode.code !== code.trim().toUpperCase()) {
      return NextResponse.json(
        { error: '验证码不匹配' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      id: report.id,
      formData: report.formData,
      reportData: report.reportData,
      createdAt: report.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('Get report error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
