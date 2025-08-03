
<template>
  <div class="container"  style="height: 100%;">

    <div style="background-color: #FFFFFF; height: 90%; padding: 10px 0px 10px 0px;">


        <!--工具栏-->
        <div class="flexHorizontal"   style="padding: 5px ; border-bottom: 1px solid #DCDFE6;">
          <div class="flexHorizontal"  style="padding: 15px ;  font-size: 14px;">

            <span>选择区域：</span>


            <div class="search-container">
              <!-- ✅ 下拉选择框 -->
              <treeselect
                v-model="selectedDevice"
                :options="treeOptions"
                :show-count="true"
                :disable-branch-nodes="true"
                placeholder="请选择设备"
                clearable
                class="device-treeselect"
              />
            </div>

            <el-button type="primary" @click="isGridView = true">  <!-- ✅ 修改：点击时切换到平铺模式 -->
              <i class="el-icon-search el-icon--left"></i> 平铺
            </el-button>

            <el-button type="primary" @click="isGridView = false"> <!-- ✅ 修改：点击时切换到列表模式 -->
              <i class="el-icon-download el-icon--left"></i> 列表
            </el-button>

          </div>
        </div>
        <!--内容-->
        <!-- ✅ 视图切换：如果是 "平铺" 模式 -->
        <div v-if="isGridView" class="gridView ">
          <div v-for="(item, index) in inverterData" :key="index" class="flexVerticalImg  "    style="width: 32%; height: 500px"          >
            <!--             顶部-->
            <div class="imgList"  style="background-color: #e5f6f4; justify-content: space-between; height: 45px; padding: 10px 10px; width: 100%;">
              <span  style=" font-size: 15px;  font-weight: bold;  color: #333;  letter-spacing: 1px">{{ item.name }}</span>

              <el-button-group class="inline-button-group">
                <el-button type="primary" size="small  "  @click="cameraDialogVisible = true">设备详情</el-button>
                 <el-button type="warning" size="small" @click="goToAiPage(item)">AI分析</el-button>

              </el-button-group>
<!--              <span :style="getStatusStyle(item.status)">{{ item.status }}</span>-->
            </div>

              <!-- 内一列：图片 -->
              <div style=" height: 60% ; width: 100%" class=" ">
                <div class="bg-container" @click="" title="点击进入监控详情"></div>

              </div>

              <!-- 内二列：数据信息 -->
              <div style=" height: .30% ; width: 100%">

                <el-descriptions
                  :column="2"
                  class="margin-top"
                  :label-style="{ width: '70px', display: 'inline-block', 'white-space': 'nowrap' }"
                  border
                >
                  <!-- 第 1 行 -->
                  <el-descriptions-item label="名称">
                    <el-tooltip :content="item.name || '暂无'" placement="top">
                      <span class="truncate">{{ item.name || '暂无' }}</span>
                    </el-tooltip>
                  </el-descriptions-item>
                  <el-descriptions-item label="状态">
                    <el-tooltip :content="item.status || '暂无'" placement="top">
                      <el-tag
                        :type="getTagType(item.status)"
                        class="status-tag"
                        size="medium"
                        effect="light"
                      >
                        {{ item.status || '暂无' }}
                      </el-tag>
                    </el-tooltip>
                  </el-descriptions-item>

                  <!-- 第 2 行 -->
                  <el-descriptions-item label="位置">
                    <el-tooltip :content="item.location || '暂无'" placement="top">
                      <span class="truncate">{{ item.location || '暂无' }}</span>
                    </el-tooltip>
                  </el-descriptions-item>
                  <el-descriptions-item label="IP">
                    <el-tooltip :content="item.ip || '暂无'" placement="top">
                      <span class="truncate">{{ item.ip || '暂无' }}</span>
                    </el-tooltip>
                  </el-descriptions-item>

                  <!-- 第 3 行 -->
                  <!-- 第 3 行 -->
                  <el-descriptions-item label="连接方式">
                    <el-tooltip :content="item.connection || '未知'" placement="top">
                      <span class="truncate">{{ item.connection || '未知' }}</span>
<!--                      <el-tag size="small" class="truncate">{{ item.connection || '未知' }}</el-tag>-->
                    </el-tooltip>
                  </el-descriptions-item>
                  <el-descriptions-item label="最后登录">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <el-tooltip :content="item.lastOnline || '未知'" placement="top">
                        <span class="truncate">{{ item.lastOnline || '未知' }}</span>
                      </el-tooltip>
                    </div>
                  </el-descriptions-item>

                </el-descriptions>

              </div>



          </div>

        </div>


        <!-- ✅ 视图切换：如果是 "列表" 模式 -->
        <el-table v-else :data="inverterData" border stripe style="width: 100%;  height: 90%">
          <el-table-column prop="name" label="设备名称" align="center" ></el-table-column>
          <el-table-column label="设备状态" align="center"  >
            <template slot-scope="scope">
              <span :style="getStatusStyle(scope.row.status)">{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="设备型号" align="center"></el-table-column>
           <el-table-column prop="location" label="设备位置" align="center"></el-table-column>
           <el-table-column prop="ip" label="设备IP" align="center"></el-table-column>
          <el-table-column prop="connection" label="连接方式" align="center"></el-table-column>
          <el-table-column prop="lastOnline" label="最后登录" align="center"></el-table-column>
        </el-table>


        <!-- 分页组件 -->
        <div style="padding:15px; display: flex; flex-direction: row; justify-content: flex-end;     background-color: white;   ">

           <pagination
             :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="handlePageChange"
          />


        </div>


      <!-- 摄像头详情弹窗 -->
      <el-dialog
        title="摄像头监控详情"
        :visible.sync="cameraDialogVisible"
        width="80%"
        top="5vh"
        custom-class="custom-camera-dialog"

      >
        <div style="display: flex; gap: 20px; height: 650px;">
          <!-- 左侧 -->
          <div style="flex: 2; display: flex; flex-direction: column; justify-content: space-between;">
            <!-- 视频窗口 -->
            <div style="background: #000; height: 450px; border-radius: 6px; position: relative;">
              <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 40px; background: rgba(255,255,255,0.1); display: flex; align-items: center; padding: 0 10px; color: #fff;">
                <span style="font-size: 12px;">🔁 回放进度条</span>
                <div style="flex: 1; height: 6px; background: #666; margin-left: 10px; border-radius: 4px;">
                  <div style="width: 40%; height: 100%; background: #01ADA8; border-radius: 4px;"></div>
                </div>
              </div>
            </div>

            <!-- ✅ 操作区：按钮组左对齐，占位图右对齐 -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <!-- 原有按钮组 -->
              <div style="display: flex; gap: 10px;">
                <el-button type="primary" icon="el-icon-video-play" plain>开始回放</el-button>
                <el-button type="primary" icon="el-icon-refresh" plain>倍速 x2</el-button>
                <el-button type="warning" icon="el-icon-d-arrow-left" plain>快退</el-button>
                <el-button type="warning" icon="el-icon-video-pause" plain>暂停</el-button>

                <el-button type="warning" icon="el-icon-d-arrow-right" plain>快进</el-button>

                <el-button type="primary" icon="el-icon-download" plain>下载</el-button>
              </div>

              <!-- 🎯 新增的小方块   按键 -->
              <div  class="camera-placeholder"  ></div>
            </div>


          </div>


          <!-- 右侧：固定日历 -->
          <div style="flex: 1; border: 1px solid #e4e7ed; border-radius: 6px;   height: 400px; width: 500px">
            <!-- 加一层缩放容器 -->
            <div style="transform: scale(0.82); transform-origin: top left; width: 600px;">
              <el-calendar v-model="calendarDate" :fullscreen="false">
                <template slot="dateCell" slot-scope="{ date, data }">
                  <div class="custom-day-cell">
                    <div class="date-number">{{ date.getDate() }}</div>
                    <!-- 彩色圆点 -->
                    <div
                      v-if="dateStatusMap[formatDateInline(date)]"
                      class="status-dot"
                      :class="dateStatusMap[formatDateInline(date)]"
                    />
                  </div>
                </template>
              </el-calendar>
          </div>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
    <el-button @click="cameraDialogVisible = false">关闭</el-button>
  </span>
      </el-dialog>



    </div>
  </div>

</template>


<script>

import { mapState } from 'vuex'
import listData from "./data/listData"; // ✅ 引入设备数据
import treeData from "./data/treedata.js";
import Treeselect from '@riophae/vue-treeselect' // ✅ 引入 vue-treeselect 树组件
import '@riophae/vue-treeselect/dist/vue-treeselect.css'// ✅ 引入 vue-treeselect 树样式


// 引入生成的数据模块

export default {
  name: 'ElectricData',
  components: {
    Treeselect
  },

  data() {
    return {

      cameraDialogVisible: false, // 控制弹窗显示
      calendarDate: new Date(), // 当前日期
      dateStatusMap: {
        '2025-04-13': 'alarm',   // 有录像
        '2025-04-14': 'video',   // 有录像
        '2025-04-15': 'video',   // 有录像
        '2025-04-16': 'alarm'    // 有报警
      },
      cameraBg: require('@/assets/images/摄像头背景.png') ,// ✅ 正确路径


      /////////////////////////////////树//////////////////////////////////////
      // selectedValue: "", // 选中的节点值
      // treeData: [], // ✅ 绑定 treedata.js 的数据
      // defaultProps: {
      //   children: "children",
      //   label: "label"
      // },
      selectedDevice: null,  // ✅ 绑定的选中设备
      treeOptions: []  ,      // ✅ 存储设备树

/////////////////////////////////工具栏//////////////////////////////////////
      rname:"",
      searchQuery: "熔炉" ,// ✅ 默认值

      formInline: {
        user: '',
        region: ''
      },

      ////////////////////////////////平铺列表切换///////////////////////////////////////
      isGridView: true, // ✅ 默认平铺模式
      inverterData: listData, // ✅ 设备数据来源于 listData.js

      ////////////////////////////////时间选择///////////////////////////////////////




      ////////////////////////////////树形菜单///////////////////////////////////////

      //  ==================表格=======================

      userList: [],
      tableData: [],
      total: 10,   //设置0会隐藏
      queryParams: {
        pageNum: 1,
        pageSize: 11,
        defectName: undefined,  // 名称
        taskId: undefined,  // 单号
        //  defectStatus: '已处理' // 单选默认值
        defectStatus: undefined, // 单选默认值
        defectCategory:'维修'  //固定值
      },

    }
  },

  computed: {
    ...mapState({
      theme: (state) => state.settings.theme // // 从 Vuex 获取主题
    }),
    tableHeaderStyle() {
      return {
        backgroundColor: this.theme || '#fa0623', // 表头背景颜色
        color: this.theme.cardHeaderText || '#ffffff', // 表头文字颜色
        fontWeight: 'bold' ,// 加粗文字
        // textAlign: "center", // 表头水平居中
        // verticalAlign: "middle", // 表头垂直居中
      }
    },
  },


  methods: {

    ////////////////////////////////日历///////////////////////////////////////

    formatDateInline(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    formatDate(d) {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    getDateStatus(date) {
      return this.dateStatusMap[this.formatDate(date)]
    },

    getStatusIcon(status) {
      switch (status) {
        case 'video': return '🔴'
        case 'alarm': return '🟡'
        default: return ''
      }
    },

    getStatusText(status) {
      switch (status) {
        case 'video': return '有录像'
        case 'alarm': return '有报警'
        default: return ''
      }
    },

    getStatusColor(status) {
      switch (status) {
        case 'video': return 'red'
        case 'alarm': return 'orange'
        default: return '#ccc'
      }
    },


    // 标签映射
    getTagType(status) {
      switch (status) {
        case '运行':
          return 'success';        // 灰色标签
        case '故障':
          return 'warning';     // 橙色标签
        case '停止':
          return 'info';        // 同样灰色
        default:
          return 'default';     // 默认标签样式
      }
    },

    //  树选择初始化
    loadTreeData() {
      this.treeOptions = treeData; // 赋值设备树
      if (this.treeOptions.length > 0) {
        this.selectedDevice = this.treeOptions[0].id; // ✅ 默认选中第一个设备
      }},


    // 设备状态颜色自动切换
    getStatusStyle(status) {
      switch (status) {
        case "运行":
          return { color: "green", fontWeight: "bold" };
        case "保温":
          return { color: "orange", fontWeight: "bold" };
        case "停止":
          return { color: "red", fontWeight: "bold" };
        default:
          return { color: "black" };
      }
    },

    // 日期格式化方法
    formatMonth(row, column, cellValue) {
      if (!cellValue) return ''
      const date = new Date(cellValue)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份补零
      return `${year}年${month}月`
    },

    /** f分页事件 */
    handlePageChange(page) {
      this.queryParams.pageNum = page;
      //this.getList();
    },

    // 跳转
    goToAiPage(item) {
      // 可以传参或不传参，示例带设备名跳转
      this.$router.push({
        path: '/camera/aiEventList',
        query: { name: item.name } // 可选，想带数据就用 query
      });
    },


  },

  created() {
    this.loadTreeData(); // ✅ 组件加载时初始化树数据

  },

  mounted() {
    // console.log('组件已挂载');

  }

}
</script>

<style scoped>

/* ##################################  通用布局  ##################################*/

/* 去掉主页面的垂直滚动条*/



/* 主容器*/

/* 水平盒子容器*/
.flexVertical {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  gap: 10px;
  font-size: 15px;
}

/* 水平盒子容器*/
.flexVerticalImg {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  padding: 20px;
}

/* 垂直盒子容器*/
.imgList {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: center;

}

/* 垂直盒子容器*/
.flexHorizontal {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}


/* 垂直*/
.flexBox {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* 文字不换行*/
.spanInline {
  display: inline-block;
  white-space: nowrap;
}

/* ##################################  平铺列表切换  ##################################*/

/* ✅ 限制 `gridView` 的高度，防止撑开主容器 */
.gridView {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  align-items: flex-start;

  /* ✅ 限制最大高度，防止撑开 */
  max-height:90%; /* 视图高度 - 适当留白 */
  overflow-y: auto; /* ✅ 开启垂直滚动 */
}

/* ✅ 让 `gridView` 项目不会撑开父级 */
.card {
  width: 30%; /* ✅ 每行最多显示 3 个 */
  background: #fff;
  border: 1px solid #e6ebf5;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  /* ✅ 确保 `card` 高度不会撑开 `gridView` */
  min-height: 200px; /* 适当设置最小高度 */
  max-height: 280px; /* 限制最大高度 */
  overflow: hidden;
}

/* ✅ 新增：列表视图（List 模式） */
.listView {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.listView .card {
  width: 100%; /* ✅ 列表模式时，让每个卡片占满整行 */
  display: flex;
  flex-direction: row;
  align-items: center;
}

/* ✅ 卡片样式 */
.header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  background-color: #e5f6f4;
  padding: 5px 10px;
}

.content {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
}

.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}

.image-icon {
  width: 100px;
  height: 100px;
}
.info p {
  margin: 5px 0;
}

/* ##################################  卡片  ##################################*/


/* 使用 CSS 变量动态设置背景颜色 */
>>> .el-card {
  height: 100%; /* 自适应 */
  width: 100%;
  //overflow: hidden;
  border: 0px solid #e6ebf5;
  border-radius: 0px; /* 圆角 */
}

>>> .el-card__header {
  background-color: var(--card-header-bg, theme); /* 默认颜色为淡蓝色 */
  color: #ffffff; /* 白色字体 */
  padding: 7px; /* 内边距 */
  //border-radius: 4px 4px 0 0;
  padding-left: 20px;
  font-size: 16px;
  line-height: 32px;

  font-weight: 600;
  letter-spacing: 2px;
  min-height: 35px;
}

.aa >>> .el-card__body {
  padding: 0px ;
  //padding: 5px 0px 0px 15px;
  /* height: 55%; */
  /* height: 100%;  这个必须减去头才是正确的高度 */
  height: calc(100% - 40px);

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
}






/*  ================右侧====================== */

/* 滚动盒子,容器*/
.flexHorizontalSco {

  justify-content: flex-start;

  overflow-y: auto;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-line-pack: center;
  align-content: flex-start;
  -webkit-box-pack: start;
  -ms-flex-pack: start;

  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  flex-wrap: wrap;
}

/*  ================图片背景====================== */

/* ✅ 让 `flex: 3` 的容器作为背景 */
/* ✅ 背景图片容器 */
.bg-container {
  flex: 3;
  height: 100%;
  padding: 20px; /* ✅ 内边距 */
  //background-image: url('~@/assets/images/guolvqi.png'); /* ✅ Vue/Webpack 正确路径 逆变器.png*/
  background-size: 80% 80%; /* ✅ 这里可以自定义大小，例如 150px * 150px */
  background-position: center; /* ✅ 居中 */
  background-repeat: no-repeat; /* ✅ 不重复 */
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box; /* ✅ 确保 padding 不影响宽高 */
  background-color: black;
}

/*  ================搜索框====================== */

/* ✅ 搜索框外层容器 */
.search-container {
  width: 300px;
  margin-left: -10px;
}

/*  ================描述列表相关====================== */

.truncate {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle; /* 确保与标签对齐 */
}

.status-tag {    /* 标签 */
  font-size: 13px;
  font-weight: bold;
  padding: 0px 30px; /* 控制内部大小 */
  height: auto;       /* 允许高度自适应 */
}

/*  ================日历====================== */

/* 日期单元格外壳，包含数字和圆点 */
.custom-day-cell {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
}

/* 日期数字样式 */
.date-number {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 2px;
}

/* 右下角彩色圆点 */
.status-dot {
  position: absolute;
  bottom: 4px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* 马卡龙绿：有录像 */
.status-dot.video {
  background-color: #00C9A7;
}

/* 卡卡龙橙：有报警 */
.status-dot.alarm {
  background-color: #FFA94D;
}

/* 表格结构优化 */
::v-deep .el-calendar-table td {
  padding: 4px !important;
  vertical-align: top;
}



.camera-placeholder {
  width: 180px;
  height: 180px;
  background-image: url('~@/assets/images/摄像头背景.png'); /* ✅ 写法 */
  background-size: cover;
  background-position: center;
  //border: 1px dashed #ccc;
  border-radius: 8px;
}

/* ✅ 弹窗圆角 */
::v-deep .custom-camera-dialog {
  border-radius: 12px; /* ✅ 圆角设置 */
  overflow: hidden;    /* 防止圆角失效 */
}

</style>
