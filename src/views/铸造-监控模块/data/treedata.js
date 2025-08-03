export default [
  {
    id: 1,
    label: "南区",
    children: [
      {
        id: 2,
        label: "一车间",
        children: [
          {
            id: 3,
            label: "熔炼工序",
            children: [
              { id: 4, label: "1#熔炉摄像头" },
              { id: 5, label: "2#熔炉摄像头" }
            ]
          },
          {
            id: 6,
            label: "浇铸工序",
            children: [
              { id: 7, label: "浇铸线1#摄像头" },
              { id: 8, label: "浇铸线2#摄像头" }
            ]
          }
        ]
      },
      {
        id: 9,
        label: "二车间",
        children: [
          {
            id: 10,
            label: "清理工序",
            children: [
              { id: 11, label: "清理区1#摄像头" },
              { id: 12, label: "清理区2#摄像头" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 13,
    label: "北区",
    children: [
      {
        id: 14,
        label: "三车间",
        children: [
          {
            id: 15,
            label: "机加工序",
            children: [
              { id: 16, label: "机床1#摄像头" },
              { id: 17, label: "机床2#摄像头" }
            ]
          },
          {
            id: 18,
            label: "装配工序",
            children: [
              { id: 19, label: "装配线1#摄像头" },
              { id: 20, label: "装配线2#摄像头" }
            ]
          }
        ]
      },
      {
        id: 21,
        label: "四车间",
        children: [
          {
            id: 22,
            label: "质检工序",
            children: [
              { id: 23, label: "质检台1#摄像头" },
              { id: 24, label: "质检台2#摄像头" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 25,
    label: "东区",
    children: [
      {
        id: 26,
        label: "仓储车间",
        children: [
          {
            id: 27,
            label: "入库工序",
            children: [
              { id: 28, label: "入库门摄像头" }
            ]
          },
          {
            id: 29,
            label: "出库工序",
            children: [
              { id: 30, label: "出库门摄像头" }
            ]
          }
        ]
      }
    ]
  }
];
