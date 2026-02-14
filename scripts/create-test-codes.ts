import { PrismaClient, PromoCodeType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建单人测试验证码
  const singleCode = await prisma.promoCode.create({
    data: {
      code: 'TEST1111',
      type: PromoCodeType.SINGLE,
      maxUsage: 10,
      batchNote: '单人测试验证码',
    },
  })

  // 创建双人测试验证码
  const coupleCode = await prisma.promoCode.create({
    data: {
      code: 'TEST2222',
      type: PromoCodeType.COUPLE,
      maxUsage: 10,
      batchNote: '双人测试验证码',
    },
  })

  console.log('✅ 测试验证码创建成功:')
  console.log('单人测试验证码:', singleCode.code)
  console.log('双人测试验证码:', coupleCode.code)
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
