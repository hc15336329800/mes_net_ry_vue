// 文件: ./data/熔炼记录数据.js
// export default [
//   ...Array.from({ length: 10 }, (_, i) => ({
//     // deviceName: `${Math.floor(1 + Math.random() * 9)}#低压融炉`, // 设备名称
//     deviceName: `1#融炉`, // 设备名称
//     deviceModel: "SG33CX-2P-CN", // 设备型号
//     // materialType: ["101铝", "202铜", "303铁", "404锡"][Math.floor(Math.random() * 4)], // 融料类型
//     materialType: '101铝', // 融料类型
//
//     taskType: ["溶料", "保温"][Math.floor(Math.random() * 2)], // 任务类型
//     startTime: `2025-03-${String(10 + Math.random() * 20).padStart(2, '0')} ${String(8 + Math.random() * 10).padStart(2, '0')}:00:00`, // 开始时间
//     endTime: `2025-03-${String(10 + Math.random() * 20).padStart(2, '0')} ${String(9 + Math.random() * 14).padStart(2, '0')}:00:00`, // 结束时间
//     duration: Math.floor(30 + Math.random() * 90), // 消耗时长（分钟）
//     gasConsumption: Math.floor(100 + Math.random() * 200), // 燃气用量（立方）
//     powerConsumption: Math.floor(30 + Math.random() * 100) // 电力消耗（kw）
//   }))
// ];


// 文件: ./data/熔炼记录数据.js
export default [
  ...Array.from({ length: 10 }, (_, i) => {
    const day = String(Math.floor(10 + Math.random() * 20)).padStart(2, '0'); // 生成 10-30 之间的日期
    const startHour = Math.floor(8 + Math.random() * 4); // 生成 08-12 之间的开始小时
    const endHour = startHour + Math.floor(1 + Math.random() * 3); // 结束时间比开始时间晚 1-3 小时
    return {
    deviceName: `1#融炉`, // 设备名称
      deviceModel: "SG33CX-2P-CN", // 设备型号
    materialType: '101铝', // 融料类型
      taskType: ["溶料", "保温"][Math.floor(Math.random() * 2)], // 任务类型
      startTime: `2025-03-${day} ${String(startHour).padStart(2, '0')}:00:00`, // 开始时间
      endTime: `2025-03-${day} ${String(endHour).padStart(2, '0')}:00:00`, // 结束时间
      duration: (endHour - startHour) * 60, // 消耗时长（分钟）
      gasConsumption: Math.floor(100 + Math.random() * 200), // 燃气用量（立方）
      powerConsumption: Math.floor(30 + Math.random() * 100) // 电力消耗（kw）
    };
  })
];
