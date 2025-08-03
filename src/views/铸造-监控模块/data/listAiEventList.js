// listAiEventList.js - AI摄像头报警数据（新增字段版本）

const alarmTypes = ['火灾', '安全帽', '抽烟','离岗']
const alarmLevels = ['高', '中', '低']
const alarmStatuses = ['未处理', '已处理']
const cameraNames = ['1号摄像头', '2号摄像头', 'A区摄像头', '西门摄像头', '主干道摄像头']
const cameraLocations = ['北区 / 冶炼车间 / 厂房入口', '北区 / 冶炼车间 /仓库东侧', '北区 / 冶炼车间 /车间走廊', '南区 / 冶炼车间 /楼梯间', '南区 / 冶炼车间 /主控室']
const alarmDescriptions = {
  火灾: '检测到明火或烟雾报警',
  安全帽: '未佩戴安全帽进入高危区域',
  抽烟: '作业区域内抽烟行为检测',
  离岗: '工作时间擅自外出'
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function randomTime() {
  const now = new Date().getTime()
  const past = now - 7 * 24 * 60 * 60 * 1000
  return new Date(past + Math.random() * (now - past)).toISOString().replace('T', ' ').slice(0, 19)
}

function randomConfidence() {
  return Number((85 + Math.random() * 15).toFixed(1)) // 85 ~ 100
}

function randomLocation() {
  // 在北京附近随机经纬度
  const baseLng = 116.38 + Math.random() * 0.05
  const baseLat = 39.90 + Math.random() * 0.05
  return { lng: Number(baseLng.toFixed(6)), lat: Number(baseLat.toFixed(6)) }
}

const listData = []

for (let i = 1; i <= 20; i++) {
  const alarmType = randomItem(alarmTypes)
  const alarmStatus = randomItem(alarmStatuses)
  const isHandled = alarmStatus === '已处理'
  const idStr = i.toString().padStart(3, '0')

  listData.push({
    id: `AL-20240501-${idStr}`, // ✅ 新增唯一报警ID
    alarmType,
    description: alarmDescriptions[alarmType], // ✅ 报警描述
    cameraName: randomItem(cameraNames),
    cameraLocation: randomItem(cameraLocations),
    location: randomLocation(), // ✅ 经纬度对象
    alarmTime: randomTime(),
    alarmLevel: randomItem(alarmLevels),
    image_url: require('@/assets/images/监控图.png'),
    confidence: randomConfidence(),
    alarmStatus,
    handler: isHandled ? `值班员${Math.ceil(Math.random() * 5)}` : '',
    handleTime: isHandled ? randomTime() : '',
    remark: isHandled ? '已完成处置' : '',
    deviceStatus: randomItem(['运行', '故障', '停止']), // ✅ 插入在这里

  })
}

export default listData
