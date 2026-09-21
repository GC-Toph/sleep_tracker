/*
 * ============================================================
 * Sleep Protocol Tracker — DATA / CONFIG ONLY
 * ============================================================
 *
 * 日后通常只需要修改这个文件。
 * app.js 会根据这里的参数和数据自动生成页面。
 *
 * 最常改的参数：
 * - meta.dayCount: 本轮协议天数，例如 21 / 28 / 30
 * - meta.sectionSize: 表格视觉分段间隔，例如每 7 天一条粗线
 * - columns: 主表列定义
 * - footerPanels: 底部说明卡片
 *
 * 文案中可使用 {days}，app.js 会自动替换成本轮协议天数。
 *
 * 支持的 inputType：
 * - "checkbox"  勾选
 * - "time"      24 小时制时间，统一显示 HH:MM
 * - "number"    数字
 * - "text"      自由填写
 * - "rating"    评分
 * - "day"       Day 序号，仅主表使用
 */

window.SLEEP_TRACKER_DATA = {
  version: "1.2",

  meta: {
    // 修改这一处即可统一改变 Day 行数和标题中的天数。
    dayCount: 28,
    // 每多少天增加一条视觉分隔线。设为 0 可取消。
    sectionSize: 7,
    title: "SLEEP PROTOCOL TRACKER",
    storageKey: "sleep-protocol-tracker-v1"
  },

  columns: [
    {
      id: "day",
      label: "Day",
      sublabel: "",
      inputType: "day",
      width: "42px"
    },
    {
      id: "wake",
      label: "起床时间",
      sublabel: "",
      inputType: "time",
      width: "72px"
    },
    {
      id: "morningState",
      label: "白天精力",
      sublabel: "打 1–5 分",
      inputType: "rating",
      min: 1,
      max: 5,
      width: "62px"
    },
    {
      id: "morningLight",
      label: "[!]晨光",
      sublabel: "醒后尽快接触10分钟户外光",
      inputType: "checkbox",
      width: "68px",
      printMark: "✓"
    },
    {
      id: "caffeineLast",
      label: "咖啡因",
      sublabel: "最后一次摄入时间 不要超过12:30",
      inputType: "time",
      width: "76px"
    },
    {
      id: "nap",
      label: "午睡时长",
      sublabel: "不要超过半小时闹钟",
      inputType: "number",
      min: 0,
      max: 180,
      step: 5,
      placeholder: "",
      width: "58px"
    },
    {
      id: "eveningLight",
      label: "傍晚光",
      sublabel: "推荐接触10分钟户外光",
      inputType: "checkbox",
      width: "68px",
      printMark: "✓"
    },
    {
      id: "water",
      label: "18:00前饮水量",
      sublabel: "推荐≥2000毫升",
      inputType: "number",
      min: 0,
      max: 5000,
      step: 10,
      placeholder: "",
      width: "58px"
    },
    {
      id: "avoidFood",
      label: "20:30后避免进食",
      sublabel: "减少夜间消化负荷",
      inputType: "checkbox",
      width: "78px",
      printMark: "✓"
    },
    {
      id: "avoidLight",
      label: "20:30后避免光线",
      sublabel: "进入昏暗环境",
      inputType: "checkbox",
      width: "78px",
      printMark: "✓"
    },
    {
      id: "windDown",
      label: "睡前黑暗",
      sublabel: "手机离床至少5米",
      inputType: "checkbox",
      width: "78px",
      printMark: "✓"
    },
    {
      id: "roomTemp",
      label: "卧室凉爽",
      sublabel: "手脚可以放被子外",
      inputType: "checkbox",
      printMark: "✓",
      width: "58px"
    },
    {
      id: "bed",
      label: "上床时间",
      sublabel: "大概估计",
      inputType: "time",
      width: "72px"
    },
    {
      id: "nightAwakenings",
      label: "夜醒次数",
      sublabel: "少量夜醒很正常",
      inputType: "number",
      min: 0,
      max: 20,
      step: 1,
      placeholder: "",
      width: "54px"
    }
  ],

  footerPanels: [
    {
      id: "night-awakening",
      title: "半夜醒来：CBT-I流程",
      type: "steps",
      items: [
        "短暂醒来：不要看时间，不拿手机，不处理工作和其他问题。",
        "如果感觉清醒很久、开始烦躁或努力逼自己睡：立刻离开床。",
        "去光线较暗的地方，轻微伸展、安静坐着 或 呼吸训练。",
        "直到有困意后再回床。",
        "如果再次长时间清醒，重复同样流程。"
      ]
    },
    {
      id: "bedroom",
      title: "睡眠环境",
      type: "bullets",
      items: [
        "尽可能黑暗，夜间照明使用落地灯较低位置的暖色暗光源，避免头顶强光",
        "凉爽，通常睡眠的前半段约 18–24°C，后半段可略微升温",
        "手机不放床边",
        "低任务感、低刺激",
        "床尽量简单, 只与睡眠关联"
      ]
    },
    {
      id: "switch-off",
      title: "睡前放松",
      type: "bullets",
      items: [
        "渐进式肌肉放松 1–3 次：绷紧全身肌肉 → 持续4秒 → 缓慢松开。",
        "呼吸训练 1–3 次：鼻深吸 → 再补一次短吸气 → 缓慢长吐气。"
      ]
    }
  ]
};
