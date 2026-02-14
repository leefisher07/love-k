import type { ReportData } from "./types"

export const MOCK_REPORT: ReportData = {
  id: "rpt-001",
  mode: "double",
  person1: {
    name: "李明",
    gender: "male",
    birthDate: "1995-06-15",
    calendarType: "solar",
    birthHour: "wu",
    birthPlace: "浙江",
    relationship: "ambiguous",
    wish: "希望能够修成正果",
    note: "",
  },
  person2: {
    name: "王静",
    gender: "female",
    birthDate: "1996-03-22",
    calendarType: "solar",
    birthHour: "mao",
    birthPlace: "江苏",
    relationship: "ambiguous",
    wish: "想知道未来走向",
    note: "",
  },
  overview: {
    bazi: ["乙亥", "壬午", "甲子", "庚午"],
    verdict: "红鸾天喜",
  },
  kLineData: [
    { year: 2026, score1: 78, score2: 72 },
    { year: 2027, score1: 82, score2: 80 },
    { year: 2028, score1: 88, score2: 86 },
    { year: 2029, score1: 75, score2: 70 },
    { year: 2030, score1: 92, score2: 88 },
    { year: 2031, score1: 55, score2: 58 },
    { year: 2032, score1: 68, score2: 65 },
    { year: 2033, score1: 85, score2: 90 },
    { year: 2034, score1: 79, score2: 82 },
    { year: 2035, score1: 88, score2: 85 },
  ],
  horseYearAnalysis:
    "丙午年，天干丙火照耀，地支午火当旺。火势汹涌之际，命主桃花星入命，红鸾星动。此年感情如奔马疾行，热烈而奔放。双方八字中火土相生，能量共振，主感情升温迅猛。建议把握春夏之交的桃花运势，尤其是农历四月、五月间，为姻缘最旺之时。需注意午火过旺容易引发口舌之争，宜以水济火，多一分耐心与包容。",
  radarData: [
    { dimension: "桃花指数", value: 85 },
    { dimension: "稳定指数", value: 72 },
    { dimension: "沟通指数", value: 68 },
    { dimension: "默契指数", value: 78 },
    { dimension: "激情指数", value: 90 },
    { dimension: "成长指数", value: 75 },
  ],
  advice:
    "综合来看，二位八字中木火相生，感情基础稳固。2026丙午年桃花运旺盛，是推进关系的绝佳时机。建议多创造共同经历，在日常中培养默契。沟通方面仍需加强，遇事多商量、少意气用事。若能在今年把握良机，未来十年的感情走势总体向好，尤其2028与2030年将迎来两次重要的感情升华期。",
  createdAt: "2026-02-10T10:00:00Z",
}

export const MOCK_SINGLE_REPORT: ReportData = {
  id: "rpt-002",
  mode: "single",
  person1: {
    name: "张华",
    gender: "female",
    birthDate: "1998-09-08",
    calendarType: "solar",
    birthHour: "you",
    birthPlace: "北京",
    relationship: "normal",
    wish: "何时能遇到对的人",
    note: "",
  },
  overview: {
    bazi: ["戊寅", "辛酉", "丙午", "丁酉"],
    verdict: "天作之合",
  },
  kLineData: [
    { year: 2026, score1: 65 },
    { year: 2027, score1: 72 },
    { year: 2028, score1: 88 },
    { year: 2029, score1: 90 },
    { year: 2030, score1: 78 },
    { year: 2031, score1: 82 },
    { year: 2032, score1: 70 },
    { year: 2033, score1: 75 },
    { year: 2034, score1: 95 },
    { year: 2035, score1: 88 },
  ],
  horseYearAnalysis:
    "丙午年对命主而言，火势旺盛，命中桃花有望绽放。天干丙火为正印，主贵人相助；地支午火为比肩，主社交活跃。此年命主有望在社交场合遇到心仪之人，尤其在职场或学习进修的环境中。建议命主主动出击，不要过于矜持，缘分往往在不经意间到来。",
  radarData: [
    { dimension: "桃花指数", value: 70 },
    { dimension: "稳定指数", value: 80 },
    { dimension: "沟通指数", value: 75 },
    { dimension: "默契指数", value: 65 },
    { dimension: "激情指数", value: 72 },
    { dimension: "成长指数", value: 88 },
  ],
  advice:
    "命主八字中水木相济，性格温柔而坚韧。2026年虽非桃花大旺之年，但命中自有贵人相助。建议在春季多参加社交活动，拓展人脉。2028-2029年将迎来桃花巅峰期，届时姻缘运势极佳。在此之前，不妨提升自我，为未来的美好姻缘做好准备。",
  createdAt: "2026-02-08T14:30:00Z",
}
