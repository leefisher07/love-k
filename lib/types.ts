export type UserMode = "single" | "double"

export interface PersonInfo {
  name: string
  gender: "male" | "female"
  birthDate: string
  calendarType: "solar" | "lunar"
  birthHour: string
  birthPlace: string
  relationship: string
  wish: string
  note: string
}

export interface ReportData {
  id: string
  mode: UserMode
  person1: PersonInfo
  person2?: PersonInfo
  overview: {
    bazi: string[]
    verdict: string
  }
  kLineData: {
    year: number
    score1: number
    score2?: number
  }[]
  horseYearAnalysis: string
  radarData: {
    dimension: string
    value: number
  }[]
  advice: string
  createdAt: string
}

export const BIRTH_HOURS = [
  { value: "unknown", label: "时辰不详" },
  { value: "zi", label: "子时 (23:00-01:00)" },
  { value: "chou", label: "丑时 (01:00-03:00)" },
  { value: "yin", label: "寅时 (03:00-05:00)" },
  { value: "mao", label: "卯时 (05:00-07:00)" },
  { value: "chen", label: "辰时 (07:00-09:00)" },
  { value: "si", label: "巳时 (09:00-11:00)" },
  { value: "wu", label: "午时 (11:00-13:00)" },
  { value: "wei", label: "未时 (13:00-15:00)" },
  { value: "shen", label: "申时 (15:00-17:00)" },
  { value: "you", label: "酉时 (17:00-19:00)" },
  { value: "xu", label: "戌时 (19:00-21:00)" },
  { value: "hai", label: "亥时 (21:00-23:00)" },
]

export const RELATIONSHIPS = [
  { value: "normal", label: "普通" },
  { value: "crush", label: "暗恋" },
  { value: "ambiguous", label: "暧昧" },
  { value: "couple", label: "情侣" },
  { value: "married", label: "夫妻" },
]

export const PROVINCES = [
  "北京", "上海", "天津", "重庆", "广东", "浙江", "江苏",
  "山东", "河南", "四川", "湖北", "湖南", "福建", "安徽",
  "河北", "陕西", "辽宁", "江西", "广西", "云南", "贵州",
  "山西", "吉林", "黑龙江", "甘肃", "内蒙古", "新疆", "海南",
  "宁夏", "青海", "西藏", "台湾", "香港", "澳门",
]
