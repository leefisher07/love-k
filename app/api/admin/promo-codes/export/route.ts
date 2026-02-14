import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD || '014105041515Li'
  return authHeader === `Bearer ${password}`
}

// GET /api/admin/promo-codes/export - 导出CSV
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const batchNote = searchParams.get('batchNote')

    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type
    if (batchNote) where.batchNote = { contains: batchNote }

    const promoCodes = await prisma.promoCode.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // 生成CSV
    const headers = ['Code', 'Type', 'Status', 'MaxUsage', 'UsageCount', 'CreatedAt', 'FirstUsedAt', 'LastUsedAt', 'BatchNote']
    const rows = promoCodes.map(pc => [
      pc.code,
      pc.type,
      pc.status,
      pc.maxUsage.toString(),
      pc.usageCount.toString(),
      pc.createdAt.toISOString(),
      pc.firstUsedAt?.toISOString() || '',
      pc.lastUsedAt?.toISOString() || '',
      pc.batchNote || '',
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="promo-codes-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export promo codes error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
