"use client"

import { useState, useEffect } from "react"
import { Plus, Download, Trash2, Ban, Loader2, Filter } from "lucide-react"

interface PromoCode {
  id: number
  code: string
  type: "SINGLE" | "COUPLE"
  status: "ACTIVE" | "EXHAUSTED" | "DISABLED"
  maxUsage: number
  usageCount: number
  batchNote: string | null
  createdAt: string
  firstUsedAt: string | null
  lastUsedAt: string | null
  hasReports: boolean
}

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  // 生成表单
  const [genType, setGenType] = useState<"SINGLE" | "COUPLE">("SINGLE")
  const [genQuantity, setGenQuantity] = useState(1)
  const [genMaxUsage, setGenMaxUsage] = useState(1)
  const [genBatchNote, setGenBatchNote] = useState("")

  // 筛选
  const [filterStatus, setFilterStatus] = useState("")
  const [filterType, setFilterType] = useState("")

  const authHeader = `Bearer ${password}`

  const loadPromoCodes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus) params.append("status", filterStatus)
      if (filterType) params.append("type", filterType)

      const response = await fetch(`/api/admin/promo-codes?${params}`, {
        headers: { Authorization: authHeader },
      })

      if (response.status === 401) {
        setAuthenticated(false)
        return
      }

      const data = await response.json()
      setPromoCodes(data.promoCodes || [])
    } catch (error) {
      console.error("加载失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    if (password) {
      setAuthenticated(true)
      loadPromoCodes()
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const response = await fetch("/api/admin/promo-codes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          type: genType,
          quantity: genQuantity,
          maxUsage: genMaxUsage,
          batchNote: genBatchNote || null,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        alert(`成功生成 ${data.count} 个验证码`)
        loadPromoCodes()
        setGenBatchNote("")
      } else {
        alert(data.error || "生成失败")
      }
    } catch (error) {
      alert("生成失败")
    } finally {
      setGenerating(false)
    }
  }

  const handleDisable = async (id: number) => {
    if (!confirm("确定要停用此验证码吗？")) return

    try {
      const response = await fetch(`/api/admin/promo-codes/${id}/disable`, {
        method: "PATCH",
        headers: { Authorization: authHeader },
      })

      if (response.ok) {
        alert("停用成功")
        loadPromoCodes()
      } else {
        const data = await response.json()
        alert(data.error || "停用失败")
      }
    } catch (error) {
      alert("停用失败")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除此验证码吗？")) return

    try {
      const response = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "DELETE",
        headers: { Authorization: authHeader },
      })

      if (response.ok) {
        alert("删除成功")
        loadPromoCodes()
      } else {
        const data = await response.json()
        alert(data.error || "删除失败")
      }
    } catch (error) {
      alert("删除失败")
    }
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (filterStatus) params.append("status", filterStatus)
      if (filterType) params.append("type", filterType)

      const response = await fetch(`/api/admin/promo-codes/export?${params}`, {
        headers: { Authorization: authHeader },
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `promo-codes-${Date.now()}.csv`
      a.click()
    } catch (error) {
      alert("导出失败")
    }
  }

  useEffect(() => {
    if (authenticated) {
      loadPromoCodes()
    }
  }, [filterStatus, filterType])

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAF8F3" }}>
        <div style={{ width: 400, padding: 32, backgroundColor: "#FFFFFF", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2C3E50", marginBottom: 24, textAlign: "center" }}>
            管理后台登录
          </h1>
          <input
            type="password"
            placeholder="请输入管理密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              height: 44,
              padding: "0 12px",
              border: "1px solid #ECF0F1",
              borderRadius: 8,
              fontSize: 15,
              marginBottom: 16,
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              height: 44,
              backgroundColor: "#C0392B",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            登录
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF8F3", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#2C3E50", marginBottom: 32 }}>
          验证码管理后台
        </h1>

        {/* 生成验证码 */}
        <div style={{ backgroundColor: "#FFFFFF", padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#2C3E50", marginBottom: 16 }}>
            生成验证码
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 14, color: "#5D6D7E", marginBottom: 6, display: "block" }}>类型</label>
              <select
                value={genType}
                onChange={(e) => setGenType(e.target.value as any)}
                style={{ width: "100%", height: 40, padding: "0 12px", border: "1px solid #ECF0F1", borderRadius: 8 }}
              >
                <option value="SINGLE">单人</option>
                <option value="COUPLE">双人</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 14, color: "#5D6D7E", marginBottom: 6, display: "block" }}>数量</label>
              <input
                type="number"
                min="1"
                value={genQuantity}
                onChange={(e) => setGenQuantity(parseInt(e.target.value) || 1)}
                style={{ width: "100%", height: 40, padding: "0 12px", border: "1px solid #ECF0F1", borderRadius: 8 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 14, color: "#5D6D7E", marginBottom: 6, display: "block" }}>可用次数</label>
              <input
                type="number"
                min="1"
                value={genMaxUsage}
                onChange={(e) => setGenMaxUsage(parseInt(e.target.value) || 1)}
                style={{ width: "100%", height: 40, padding: "0 12px", border: "1px solid #ECF0F1", borderRadius: 8 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 14, color: "#5D6D7E", marginBottom: 6, display: "block" }}>批次备注</label>
              <input
                type="text"
                placeholder="选填"
                value={genBatchNote}
                onChange={(e) => setGenBatchNote(e.target.value)}
                style={{ width: "100%", height: 40, padding: "0 12px", border: "1px solid #ECF0F1", borderRadius: 8 }}
              />
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              height: 40,
              padding: "0 24px",
              backgroundColor: generating ? "#95A5A6" : "#C0392B",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: generating ? "not-allowed" : "pointer",
            }}
          >
            {generating ? "生成中..." : "生成验证码"}
          </button>
        </div>

        {/* 筛选和操作 */}
        <div style={{ backgroundColor: "#FFFFFF", padding: 16, borderRadius: 12, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ height: 36, padding: "0 12px", border: "1px solid #ECF0F1", borderRadius: 8 }}
            >
              <option value="">全部状态</option>
              <option value="ACTIVE">可用</option>
              <option value="EXHAUSTED">已用尽</option>
              <option value="DISABLED">已停用</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ height: 36, padding: "0 12px", border: "1px solid #ECF0F1", borderRadius: 8 }}
            >
              <option value="">全部类型</option>
              <option value="SINGLE">单人</option>
              <option value="COUPLE">双人</option>
            </select>
            <button
              onClick={handleExport}
              style={{
                height: 36,
                padding: "0 16px",
                backgroundColor: "#27AE60",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              <Download style={{ width: 14, height: 14, display: "inline", marginRight: 6 }} />
              导出CSV
            </button>
          </div>
        </div>

        {/* 验证码列表 */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: "center" }}>
              <Loader2 className="animate-spin" style={{ width: 32, height: 32, color: "#95A5A6", margin: "0 auto" }} />
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#FAF8F3", borderBottom: "1px solid #ECF0F1" }}>
                  <th style={{ padding: 12, textAlign: "left", fontSize: 13, fontWeight: 600, color: "#5D6D7E" }}>验证码</th>
                  <th style={{ padding: 12, textAlign: "left", fontSize: 13, fontWeight: 600, color: "#5D6D7E" }}>类型</th>
                  <th style={{ padding: 12, textAlign: "left", fontSize: 13, fontWeight: 600, color: "#5D6D7E" }}>状态</th>
                  <th style={{ padding: 12, textAlign: "left", fontSize: 13, fontWeight: 600, color: "#5D6D7E" }}>使用情况</th>
                  <th style={{ padding: 12, textAlign: "left", fontSize: 13, fontWeight: 600, color: "#5D6D7E" }}>创建时间</th>
                  <th style={{ padding: 12, textAlign: "left", fontSize: 13, fontWeight: 600, color: "#5D6D7E" }}>备注</th>
                  <th style={{ padding: 12, textAlign: "right", fontSize: 13, fontWeight: 600, color: "#5D6D7E" }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {promoCodes.map((code) => (
                  <tr key={code.id} style={{ borderBottom: "1px solid #ECF0F1" }}>
                    <td style={{ padding: 12, fontFamily: "monospace", fontSize: 14, color: "#2C3E50" }}>{code.code}</td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      <span style={{
                        padding: "2px 8px",
                        backgroundColor: code.type === "SINGLE" ? "#E8F8F5" : "#EBF5FB",
                        color: code.type === "SINGLE" ? "#27AE60" : "#3498DB",
                        borderRadius: 4,
                        fontSize: 12,
                      }}>
                        {code.type === "SINGLE" ? "单人" : "双人"}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      <span style={{
                        padding: "2px 8px",
                        backgroundColor: code.status === "ACTIVE" ? "#E8F8F5" : code.status === "EXHAUSTED" ? "#FEF5E7" : "#FADBD8",
                        color: code.status === "ACTIVE" ? "#27AE60" : code.status === "EXHAUSTED" ? "#F39C12" : "#E74C3C",
                        borderRadius: 4,
                        fontSize: 12,
                      }}>
                        {code.status === "ACTIVE" ? "可用" : code.status === "EXHAUSTED" ? "已用尽" : "已停用"}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 14, color: "#5D6D7E" }}>
                      {code.usageCount} / {code.maxUsage}
                    </td>
                    <td style={{ padding: 12, fontSize: 13, color: "#95A5A6" }}>
                      {new Date(code.createdAt).toLocaleString("zh-CN")}
                    </td>
                    <td style={{ padding: 12, fontSize: 13, color: "#95A5A6" }}>{code.batchNote || "-"}</td>
                    <td style={{ padding: 12, textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        {code.status === "ACTIVE" && (
                          <button
                            onClick={() => handleDisable(code.id)}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#F39C12",
                              color: "#FFFFFF",
                              border: "none",
                              borderRadius: 4,
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            停用
                          </button>
                        )}
                        {!code.hasReports && (
                          <button
                            onClick={() => handleDelete(code.id)}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#E74C3C",
                              color: "#FFFFFF",
                              border: "none",
                              borderRadius: 4,
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            删除
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
