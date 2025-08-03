<!--index.vue-->
<template>
  <div class="container">
    <el-row :gutter="20" style="height: 100%;">

      <!-- 左侧 -->

      <!-- 右侧 -->
      <el-col :span="24" style="background-color: #FFFFFF; height: 100%;   padding:10px;">



        <!--工具栏-->
        <div class="flexHorizontal"   style="padding: 5px ; border-bottom: 1px solid #DCDFE6;">
          <div class="flexHorizontal"  style="padding: 15px ;  font-size: 14px;">

            <span>选择设备：</span>
<!--            <div class="search-container"  style="    margin-left: -10px;">-->
<!--              <el-input v-model="searchQuery" placeholder="请输入搜索内容" class="search-input">-->
<!--                &lt;!&ndash; ✅ 右侧添加搜索图标按钮 &ndash;&gt;-->
<!--                <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>-->
<!--              </el-input>-->
<!--            </div>-->

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
            <div v-for="(item, index) in inverterData" :key="index" class="flexVertical  "    style="width: 31%; height: 300px"          >
<!--             顶部-->
            <div class="flexHorizontal"
                 style="background-color: #e5f6f4; justify-content: space-between; height: 36px; padding: 10px 10px; width: 100%;"
            >
              <span>{{ item.location }}</span>
              <span :style="getStatusStyle(item.status)">{{ item.status }}</span>
            </div>
             <!--             中间-->
             <div class="flexHorizontal" style="height: 100% ;width: 100%;">
              <!-- 内一列：图片 -->
              <div style="flex: 3; height: 100%" class="bg-container">

              </div>

              <!-- 内二列：数据信息 -->
              <div style="flex: 4; height: 100%">
                <div class="flexVertical_betweenn" style="height: 100% ;padding: 15px;">

                  <p><b>设备型号：</b> {{ item.model }}</p>
                  <p><b>当前溶料：</b> {{ item.material }}</p>
                  <p><b>开始时间：</b> {{ item.startTime }}</p>
                  <p><b>已用时：</b> {{ item.usedTime }} 分钟</p>
                  <p><b>炉膛温度：</b> {{ item.furnaceTemp }} ℃</p>
                  <p><b>铝液温度：</b> {{ item.aluminumTemp }} ℃</p>


                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ✅ 视图切换：如果是 "列表" 模式 -->
        <el-table v-else :data="inverterData" border stripe style="width: 100%;">
          <el-table-column prop="location" label="设备名称" align="center" width="150"></el-table-column>
          <el-table-column label="设备状态" align="center" width="100">
            <template slot-scope="scope">
              <span :style="getStatusStyle(scope.row.status)">{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="设备型号" align="center"></el-table-column>
          <el-table-column prop="material" label="当前溶料" align="center"></el-table-column>
          <el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
          <el-table-column prop="usedTime" label="已用时（分钟）" align="center"></el-table-column>
          <el-table-column prop="furnaceTemp" label="炉膛温度（℃）" align="center"></el-table-column>
          <el-table-column prop="aluminumTemp" label="铝液温度（℃）" align="center"></el-table-column>
        </el-table>


      </el-col>

    </el-row>
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



      ////////////////////////////////tab标签///////////////////////////////////////


      ////////////////////////////////树形菜单///////////////////////////////////////

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
.container {
  display: flex;
  flex-direction: column;
  margin: 10px;
  height: calc(100vh - 130px);
  gap: 5px;
}

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
  background-image: url('~@/assets/images/guolvqi.png'); /* ✅ Vue/Webpack 正确路径 逆变器.png*/
  background-size: 80% 80%; /* ✅ 这里可以自定义大小，例如 150px * 150px */
  background-position: center; /* ✅ 居中 */
  background-repeat: no-repeat; /* ✅ 不重复 */
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box; /* ✅ 确保 padding 不影响宽高 */
}

/*  ================搜索框====================== */

/* ✅ 搜索框外层容器 */
.search-container {
  width: 300px;
  margin-left: -10px;
 }

</style>
