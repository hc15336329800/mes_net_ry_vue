export const energyData = {
  allData: {
    // 分钟级数据 (包含功率和辐照度)
    minute: Array.from({ length: 60 }, (_, i) => ({
      time: `06:${String(i).padStart(2, '0')}`,
      power: Math.random() * 5 + 1, // 随机功率数据 1-6 kW
      radiation: Math.random() * 200 + 50 // 随机辐照度 50-250 W/m²
    })),

    // 小时级数据 (今天 24 小时数据，仅功率)
    hour: Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      power: Math.random() * 5 + 1 // 随机功率数据 1-6 kW
    })),

    // 天级数据 (模拟 30 天的数据，仅功率)
    day: Array.from({ length: 30 }, (_, i) => ({
      time: `02-${String(i + 1).padStart(2, '0')}`,
      power: Math.random() * 250 + 50 // 随机功率 50-300 kWh
    })),

    // 月级数据 (模拟 12 个月的数据，仅功率)
    month: Array.from({ length: 12 }, (_, i) => ({
      time: `2024-${String(i + 1).padStart(2, '0')}`,
      power: Math.random() * 5000 + 1000 // 随机功率 1000-6000 kWh
    })),

    // 年级数据 (去年和今年的固定值，仅功率)
    year: [
      { time: "2022", power: 2000 },
      { time: "2023", power: 4000 },
      { time: "2024", power: 6000 }
    ]
  }
};
