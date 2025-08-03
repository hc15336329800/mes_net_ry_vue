// 文件: ./treedata.js
export default [
  {
    id: 1,
    label: "厂房A",
    children: [
      {
        id: 2,
        label: "车间1",
        children: [
          {
            id: 3,
            label: "包装设备",
            children: [
              { id: 4, label: "自动包装机-01", deviceType: "包装机", model: "P-500", capacity: "500", quantity: "2", weight: "300", manufacturer: "XX公司", installDate: "2024-01-10" },
              { id: 5, label: "高速包装机-02", deviceType: "包装机", model: "P-600", capacity: "600", quantity: "1", weight: "350", manufacturer: "YY科技", installDate: "2023-12-15" },
              { id: 6, label: "智能包装机-03", deviceType: "包装机", model: "P-700", capacity: "700", quantity: "2", weight: "320", manufacturer: "ZZ包装", installDate: "2023-10-20" }
            ]
          },
          {
            id: 7,
            label: "消毒设备",
            children: [
              { id: 8, label: "高温消毒柜-01", deviceType: "消毒柜", model: "D-300", capacity: "100L", quantity: "2", weight: "500", manufacturer: "ZZ医疗", installDate: "2023-05-20" },
              { id: 9, label: "紫外线消毒柜-02", deviceType: "消毒柜", model: "UV-200", capacity: "80L", quantity: "3", weight: "450", manufacturer: "消毒科技", installDate: "2023-07-15" },
              { id: 10, label: "臭氧消毒机-03", deviceType: "消毒柜", model: "O3-500", capacity: "120L", quantity: "1", weight: "550", manufacturer: "环保医疗", installDate: "2023-09-01" }
            ]
          },
          {
            id: 11,
            label: "冷冻设备",
            children: [
              { id: 12, label: "低温冷冻柜-01", deviceType: "冷冻柜", model: "F-200", capacity: "200L", quantity: "1", weight: "250", manufacturer: "冷冻科技", installDate: "2023-11-05" },
              { id: 13, label: "超低温冷冻柜-02", deviceType: "冷冻柜", model: "F-300", capacity: "150L", quantity: "2", weight: "260", manufacturer: "冷藏设备", installDate: "2023-08-20" },
              { id: 14, label: "血液存储冷冻柜-03", deviceType: "冷冻柜", model: "F-400", capacity: "250L", quantity: "1", weight: "280", manufacturer: "血清存储", installDate: "2023-06-12" }
            ]
          },
          {
            id: 15,
            label: "离心设备",
            children: [
              { id: 16, label: "低速离心机-01", deviceType: "离心机", model: "XCJ-500", capacity: "5000rpm", quantity: "2", weight: "400", manufacturer: "精密仪器", installDate: "2023-09-30" },
              { id: 17, label: "高速离心机-02", deviceType: "离心机", model: "XCJ-1000", capacity: "10000rpm", quantity: "1", weight: "450", manufacturer: "高精仪器", installDate: "2023-07-25" },
              { id: 18, label: "超速离心机-03", deviceType: "离心机", model: "XCJ-2000", capacity: "20000rpm", quantity: "1", weight: "500", manufacturer: "离心科技", installDate: "2023-05-18" }
            ]
          },
          {
            id: 19,
            label: "过滤设备",
            children: [
              { id: 20, label: "微孔过滤器-01", deviceType: "过滤设备", model: "FILT-0.8μm", capacity: "100L", quantity: "2", weight: "200", manufacturer: "过滤科技", installDate: "2023-04-10" },
              { id: 21, label: "微孔过滤器-02", deviceType: "过滤设备", model: "FILT-0.45μm", capacity: "80L", quantity: "3", weight: "180", manufacturer: "净化设备", installDate: "2023-03-22" },
              { id: 22, label: "终极过滤器-03", deviceType: "过滤设备", model: "FILT-0.22μm", capacity: "60L", quantity: "1", weight: "150", manufacturer: "精细过滤", installDate: "2023-02-15" }
            ]
          }
        ]
      }
    ]
  }
];
