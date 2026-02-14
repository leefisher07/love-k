// IP限流工具 - 内存存储
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

export async function checkRateLimit(ip: string, limit: number = 10): Promise<boolean> {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  // 如果没有记录或已过期（1分钟），创建新记录
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 60000, // 1分钟后重置
    })
    return true
  }

  // 检查是否超限
  if (entry.count >= limit) {
    return false
  }

  // 增加计数
  entry.count++
  return true
}

// 清理过期记录（每5分钟执行一次）
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, 300000)
