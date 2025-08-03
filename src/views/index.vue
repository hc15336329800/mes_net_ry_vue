<template>
  <div class="home-container">
    <!-- 顶部天气时间信息 -->
    <div class="weather-time">
      📍 济南 ｜ {{ weather }} ｜ 🕒 {{ currentTime }}
    </div>

    <!-- 欢迎语区域 -->
    <div class="welcome">
      <h2>欢迎使用中煤数采平台</h2>
      <p class="sub-title">助力设备全生命周期数字化管理</p>
    </div>

    <!-- 公告栏（右下角漂浮） -->
    <div class="notice-float" v-if="notices.length">
      <!-- 公告标题及收缩按钮 -->
      <div class="notice-header">
        <span class="notice-title">
          <i class="el-icon-bell"></i> 最新公告
        </span>
        <span class="toggle-btn" @click="toggleNotice">
          {{ noticeExpanded ? '收起' : '展开' }}
        </span>
      </div>
      <!-- 公告内容采用过渡效果 -->
      <transition name="fade">
        <div v-show="noticeExpanded">
          <el-carousel height="100px" :interval="4000" arrow="never" indicator-position="none">
            <el-carousel-item v-for="(item, index) in notices" :key="index">
              <div class="notice-item">
                <!-- 直接拼接后使用纯文本显示 -->
                <div class="notice-text">
                  {{ item.noticeTitle + getPlainText(item.noticeContent) }}
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </transition>
    </div>

    <!-- 功能模块入口 -->
    <el-row :gutter="20" class="module-grid" style="height: 75%; padding: 20px">
      <el-col :span="6" v-for="item in modules" :key="item.name">
        <!-- 保持原来卡片的居中布局，只额外增加 margin: 20px 0 和 box-shadow -->
        <el-card shadow="hover" class="module-card" @click.native="goPage(item.path)">
          <div class="module-icon">
            <svg-icon :icon-class="item.icon" />
          </div>
          <div class="module-name">{{ item.name }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部版权信息 -->
    <div class="footer">
      Copyright © 2025 中煤智能数采平台
    </div>
  </div>
</template>

<script>
import { listNotice } from '@/api/system/notice'

export default {
  name: "Index",
  data() {
    return {
      modules: [
        { name: "设备档案", icon: "table", path: "/KRTSB/KRTDA/KRTDAGL" },           // 设备档案管理
        { name: "保养记录", icon: "edit", path: "/KRTSB/KRTDA/KRTDABB" },            // 设备保养信息
        { name: "巡检任务", icon: "clipboard", path: "/KRTSB/KRTWX/KRTWXRW" },       // 巡检任务管理
        { name: "巡检记录", icon: "edit", path: "/KRTSB/KRTWX/KRTWXXJ" },            // 巡检记录
        { name: "缺陷记录", icon: "edit", path: "/KRTSB/KRTWX/KRTWXQX" },            // 缺陷记录
        { name: "维修记录", icon: "edit", path: "/KRTSB/KRTWX/KRTWXXX" }             // 维修记录
      ],
      notices: [],
      currentTime: '',
      weather: '晴 25℃',
      // 控制公告显示/隐藏的状态
      noticeExpanded: true
    };
  },
  methods: {
    goPage(path) {
      this.$router.push(path);
    },
    async getNoticeList() {
      const res = await listNotice({ pageNum: 1, pageSize: 5 });
      if (res && res.rows) {
        this.notices = res.rows;
      }
    },
    updateTime() {
      const now = new Date();
      const Y = now.getFullYear();
      const M = String(now.getMonth() + 1).padStart(2, '0');
      const D = String(now.getDate()).padStart(2, '0');
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      this.currentTime = `${Y}-${M}-${D} ${h}:${m}:${s}`;
    },
    // 切换公告区域显示与隐藏
    toggleNotice() {
      this.noticeExpanded = !this.noticeExpanded;
    },
    /**
     * 将包含 HTML 标签的文本转换为纯文本
     * 如果 noticeContent 中包含诸如 <p>、<br> 等标签，将其去除
     */
    getPlainText(html) {
      return html.replace(/<\/?[^>]+(>|$)/g, "");
    }
  },
  mounted() {
    this.getNoticeList();
    this.updateTime();
    setInterval(this.updateTime, 1000);
  }
};
</script>

<style scoped lang="scss">
.home-container {
  display: flex;
  flex-direction: column;
  padding: 30px;
  background: #fff;
  min-height: 100vh; /* 占满整个视口高度 */
  position: relative;

  margin: 10px;
  border-radius: 7px;
}
.weather-time {
  text-align: right;
  font-size: 16px;
  color: #606266;
  margin-bottom: 10px;
}
.welcome {
  text-align: center;
  margin-bottom: 20px;
}
.welcome h2 {
  font-size: 26px;
  color: #01ADA8;
}
.sub-title {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}
.notice-float {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 300px;
  background: #F0F8FF;  /* 清新的 AliceBlue 风格背景 */
  border: 1px solid #B0E0E6;
  border-radius: 6px;
  padding: 10px 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
}
.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.notice-title {
  font-size: 15px;
  font-weight: bold;
  color: #007ACC;
}
.toggle-btn {
  cursor: pointer;
  color: #007ACC;
  font-size: 14px;
}
.notice-item {
  padding: 5px 0;
  font-size: 14px;
  color: #606266;
}
.notice-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.4;
}
.module-grid {
  flex-grow: 1; /* 占据剩余空间 */
}
.module-grid .module-card {
  /* 保持原本的居中布局 */
  text-align: center;
  cursor: pointer;
  border-radius: 12px;
  padding: 20px 0;        /* 上下留白，让图标和标题居中 */
  min-height: 120px;

  /* 新增的上下间距和阴影 */
  margin: 20px 0;        /* 给卡片上下间距 20px */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* 默认卡片阴影 */
  transition: box-shadow 0.3s ease;
}

/* 悬停时阴影增强 */
.module-grid .module-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
}

.module-icon {
  font-size: 30px;
  margin-bottom: 10px;
  color: #01ADA8;
}
.module-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.footer {
  margin-top: auto; /* 将 footer 推到页面底部 */
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 13px;
  padding-top: 20px;
  padding-bottom: 20px;
}
/* fade 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
