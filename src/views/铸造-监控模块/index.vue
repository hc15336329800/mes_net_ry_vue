<template>
  <div class="container">
    <div class="home-container">
      <!-- 背景图展示区域 -->
      <div class="bigscreen-bg" @click="" title="点击进入监控列表"></div>
      <!--      <div class="bigscreen-bg" @click="goToMonitorList" title="点击进入监控列表"></div>-->

      <!-- 新增的浮动滚动表 -->
      <div class="floating-scroll-board">
        <!-- dv-scroll-board 必须撑满父容器才能显示 -->


        <dv-scroll-board  :config="scrollConfig"  />


      </div>

    </div>
  </div>
</template>

<script>


export default {
  name: "Index",
  components: {
  },
  data() {
    return {
      scrollConfig: {
        header: ['序号', '事件名称', '时间', '状态'],
        data: [
          [1, '事件 A', '2025-04-17 10:00', '正常'],
          [2, '事件 B', '2025-04-17 10:05', '警告'],
          [3, '事件 C', '2025-04-17 10:10', '正常'],
          [4, '事件 D', '2025-04-17 10:20', '故障'],
          [5, '事件 E', '2025-04-17 10:30', '正常']
        ],
        rowNum: 5,         // 每页显示行数（可选）
        headerBGC: '#1981f6', // 表头背景色（可选）
        oddRowBGC: '#001f3f', // 奇数行背景色（可选）
        evenRowBGC: '#003366', // 偶数行背景色（可选）
        index: true,         // 是否显示序号（可选）
        columnWidth: [],     // 每列宽度（可选）
        align: ['center', 'center', 'center', 'center'] // 对齐方式（可选）
      }
    }
  },
  methods: {
    // 跳转到监控列表
    goToMonitorList() {
      this.$router.push('/camera/monitorList');
    }
  }
};
</script>

<style scoped lang="scss">
.home-container {
  padding: 0;
  background: transparent;
  height: 100%;
  border-radius: 0;
  position: relative;
}

/* 背景图样式 */
.bigscreen-bg {
  width: 100%;
  height: 100%;
  background-image: url('~@/assets/images/智慧园区监控看板.png'); /* 你需要把图放在这个路径 */
  background-size: 100% 100%;     // 🔥 拉伸：宽度和高度都强制填满容器
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.bigscreen-bg:hover {
  transform: scale(1.01);
}

.floating-scroll-board {
  position: fixed;
  bottom: 20px;                /* 距离底部 20px */
  left: 50%;                   /* 水平居中定位的关键 */
  transform: translateX(-50%);
  width: 300px;                /* 固定宽度 */
  height: 150px;               /* 固定高度 */
   box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  border-radius: 4px;
  padding: 8px;
  z-index: 1000;               /* 确保浮在最上层 */
}


</style>
