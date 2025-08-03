<template>
  <div class="container">
    <el-card v-if="deviceInfo" class="device-info-card" shadow="hover">
      <div class="title">{{ deviceInfo.label || '设备名称未知' }}</div>
      <div class="info">型号：{{ deviceInfo.model || '—' }}</div>
      <div class="info">厂家：{{ deviceInfo.manufacturer || '—' }}</div>
      <div class="info">保养：{{ deviceInfo.remark || '—' }}</div>
    </el-card>

    <el-card class="record-list" shadow="never">
      <el-timeline  style="    padding: 0px;">
        <el-timeline-item
          v-for="item in maintList"
          :key="item.id"
          :timestamp="formatTime(item.createTime)"
          placement="top"
        >
          <div class="record-content">
            <div class="content">
              内容：{{ (item.content || '—').length > 120 ? item.content.slice(0, 120) + '...' : item.content || '—' }}
            </div>
            <el-image
              v-if="getFirstImage(item)"
              :src="getFirstImage(item)"
              class="preview-img"
              :preview-src-list="item.imageUrl ? item.imageUrl.split(',') : []"
              fit="cover"
              style="width: 120px; height: 120px; margin-top: 8px;"
            />
          </div>
        </el-timeline-item>
      </el-timeline>

      <div v-if="!maintList.length" class="empty">暂无保养记录</div>
    </el-card>
  </div>
</template>

<script>
import { getDeviceDetail } from '@/api/zm_device/DeviceMaint'

export default {
  name: 'MaintList',
  data() {
    return {
      deviceId: null,
      deviceInfo: null,
      maintList: []
    }
  },
  created() {
    this.deviceId = this.$route.query.deviceId
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const res = await getDeviceDetail(this.deviceId)
      if (res && res.data && res.data.deviceInfo) {
        this.deviceInfo = res.data.deviceInfo || {}
        this.maintList = res.data.maintList?.rows || []
      }
    },
    formatTime(time) {
      return time ? time.replace('T', ' ').slice(0, 19) : '—'
    },
    getFirstImage(item) {
      if (!item.imageUrl) return ''
      return item.imageUrl.split(',')[0]
    }
  }
}
</script>

<style scoped>
.device-info-card {
  margin-bottom: 20px;
}
.device-info-card .title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.device-info-card .info {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;

  line-height: 1.6;
  //white-space: pre-wrap; /* ✅ 关键：支持 \n 换行显示 */
}
.record-list {
  padding: 20px;
}
.record-content .content {
  font-size: 14px;
  color: #333;
  letter-spacing: 0.2px; /* 设置字间距 */
  line-height: 1.6;       /* 设置行间距（1.6倍行高） */
}
.empty {
  text-align: center;
  color: #999;
  margin-top: 20px;
}
</style>
