// listData.js - 设备数据
export default [
  {
    location: "1#融炉",
    status: "运行", // "运行"、"保温"、"停止"
    model: "SG33CX-2P-CN", // 设备型号
    material: "101铝", // 当前溶料
    startTime: "2025-03-15 12:22", // 开始时间
    usedTime: 120, // 已用时间（分钟）
    furnaceTemp: 1550, // 炉膛温度
    aluminumTemp: 750 // 铝液温度
  },
  {
    location: "2#融炉",
    status: "保温",
    model: "SG33CX-2P-CN",
    material: "101铝",
    startTime: "2025-03-15 13:10",
    usedTime: 90,
    furnaceTemp: 1400,
    aluminumTemp: 720
  },
  {
    location: "3#融炉",
    status: "停止",
    model: "SG33CX-2P-CN",
    material: "101铝",
    startTime: "2025-03-15 14:45",
    usedTime: 0,
    furnaceTemp: 0,
    aluminumTemp: 0
  },
  {
    location: "4#融炉",
    status: "运行",
    model: "SG33CX-2P-CN",
    material: "101铝",
    startTime: "2025-03-15 16:00",
    usedTime: 180,
    furnaceTemp: 1600,
    aluminumTemp: 760
  },
  {
    location: "5#融炉",
    status: "保温",
    model: "SG33CX-2P-CN",
    material: "101铝",
    startTime: "2025-03-15 10:30",
    usedTime: 110,
    furnaceTemp: 1380,
    aluminumTemp: 710
  },
  {
    location: "6#融炉",
    status: "运行",
    model: "SG33CX-2P-CN",
    material: "101铝",
    startTime: "2025-03-15 09:15",
    usedTime: 240,
    furnaceTemp: 1650,
    aluminumTemp: 770
  },
  {
    location: "7#融炉",
    status: "停止",
    model: "SG33CX-2P-CN",
    material: "101铝",
    startTime: "2025-03-15 08:00",
    usedTime: 0,
    furnaceTemp: 0,
    aluminumTemp: 0
  },
  {
    location: "8#融炉",
    status: "运行",
    model: "SG33CX-2P-CN",
    material: "101铝",
    startTime: "2025-03-15 18:45",
    usedTime: 135,
    furnaceTemp: 1570,
    aluminumTemp: 745
  }
];
