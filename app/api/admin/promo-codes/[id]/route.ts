import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD || '014105041515Li'
  return authHeader === `Bearer ${password}`
}

// PATCH /api/admin/promo-codes/[id]/disable - 停用验证码
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)

    const promoCode = await prisma.promoCode.findUnique({
      where: { id },
    })

    if (!promoCode) {
      return NextResponse.json({ error: '验证码不存在' }, { status: 404 })
    }

    if (promoCode.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: '只能停用状态为ACTIVE的验证码' },
        { status: 400 }
      )
    }

    await prisma.promoCode.update({
      where: { id },
      data: { status: 'DISABLED' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Disable promo code error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// DELETE /api/admin/promo-codes/[id] - 删除验证码
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)

    const promoCode = await prisma.promoCode.findUnique({
      where: { id },
      include: {
        _count: {
          select: { reports: true },
        },
      },
    })

    if (!promoCode) {
      return NextResponse.json({ error: '验证码不存在' }, { status: 404 })
    }

    if (promoCode._count.reports > 0) {
      return NextResponse.json(
        { error: '此验证码已被使用，无法删除' },
        { status: 400 }
      )
    }

    await prisma.promoCode.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete promo code error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
