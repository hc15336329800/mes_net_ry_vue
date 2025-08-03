<!--index.vue-->
<template>
  <div class="container">
    <el-row :gutter="20" style="height: 100%;">

      <!-- 左侧 -->
      <el-col :span="4" style="height: 100%;">
        <div class="flexVertical" style="background-color: #FFFFFF; height: 100%;">

          <!-- 下拉框 -->
          <div class="form" style="padding: 0px; width: 100%;  ">
<!--            <span style="    margin-bottom: 10px;">站点名称</span>-->
            <el-select v-model="selectedValue" placeholder="请选择" style="width: 100%;  margin-top: 10px;">
              <el-option label="厂房 1" value="66"></el-option>
              <el-option label="厂房 2" value="67"></el-option>
            </el-select>
          </div>

          <!-- 树结构 -->
          <div class="flexBoxHorizontal" style="flex: 1; overflow: auto; width: 100%; margin-top: 20px;">
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              empty-text="加载中，请稍候"
              show-checkbox
              default-expand-all
              @node-click="handleNodeClick"
              :default-checked-keys="[11]"
            ></el-tree>
          </div>

        </div>
      </el-col>

      <!-- 右侧 -->
      <el-col :span="20" style="height: 100%;     padding-left: 0px;">
        <el-tabs v-model="activeTab" type="border-card" style="height: 100%;" class="animated-tabs">

          <!-- TAB 标签一 -->
          <el-tab-pane label="按日" name="user" style="height: 100%;">

            <!--工具栏-->
            <div class="flexHorizontal">

              <div>
                <el-form :model="formTimeModel" label-width="80px" id="form-1">
                  <el-form-item label="选择日期">
                    <el-date-picker
                      v-model="selectedDate"
                      type="date"
                      placeholder="请选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :clearable="true"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-form>
              </div>


              <!-- 操作按钮 -->
              <div class="flexHorizontal">


                <!-- 查询按钮 -->
                <el-button type="primary" @click="createEchartsData">
                  <i class="el-icon-search  el-icon--left"></i> 查 询
                </el-button>

                <!-- 导出按钮 -->
                <el-button type="primary" @click="exportData">
                  <i class="el-icon-download  el-icon--left"></i> 导 出
                </el-button>
              </div>


            </div>

            <!-- 注意这个内容不能是100%  因为还有表头高度呢    -->
            <div class="flexHorizontal" style="height: 90%;  margin-top: 10px;">

              <!--  表格-->

              <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%;"
                height="100%"
                :header-cell-style="tableHeaderStyle"
                :cell-style="cellStyle"
              >
                <el-table-column prop="circuit" label="回路名称"/>
                <el-table-column prop="currentMonth" label="本周期用电 / kW·h"/>
                <el-table-column prop="previousMonth" label="本周期用电 / kW·h"/>
                <el-table-column prop="increment" label="增加值"/>
                <!--                <el-table-column prop="percentage" label="环比(%)"/>-->

                <!-- 环比 -->
                <el-table-column label="环比(%)" width="120">
                  <template #default="{ row }">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span>{{ row.percentage }}</span>
                      <i
                        v-if="row.percentage > 0"
                        class="el-icon-arrow-up"
                        style="color: red;"
                      ></i>
                      <i
                        v-else-if="row.percentage < 0"
                        class="el-icon-arrow-down"
                        style="color: green;"
                      ></i>
                    </div>
                  </template>
                </el-table-column>


              </el-table>


            </div>


          </el-tab-pane>

          <!-- TAB 标签二 -->
          <el-tab-pane label="按月" name="config" style="height: 100%;">

            <!--工具栏-->
            <div class="flexHorizontal">

              <div>
                <el-form :model="formTimeModel" label-width="80px" id="form-1">
                  <el-form-item label="选择日期">
                    <el-date-picker
                      v-model="selectedDate"
                      type="date"
                      placeholder="请选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :clearable="true"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-form>
              </div>


              <!-- 操作按钮 -->
              <div class="flexHorizontal">


                <!-- 查询按钮 -->
                <el-button type="primary" @click="createEchartsData">
                  <i class="el-icon-search  el-icon--left"></i> 查 询
                </el-button>

                <!-- 导出按钮 -->
                <el-button type="primary" @click="exportData">
                  <i class="el-icon-download  el-icon--left"></i> 导 出
                </el-button>
              </div>


            </div>

            <!-- 注意这个内容不能是100%  因为还有表头高度呢    -->
            <div class="flexHorizontal" style="height: 90%;  margin-top: 10px;">

              <!--  表格-->

              <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%;"
                height="100%"
                :header-cell-style="tableHeaderStyle"
              >
                <el-table-column prop="circuit" label="回路名称"/>
                <el-table-column prop="currentMonth" label="本周期用电 / kW·h"/>
                <el-table-column prop="previousMonth" label="本周期用电 / kW·h"/>
                <el-table-column prop="increment" label="增加值"/>
                <el-table-column prop="percentage" label="环比(%)"/>

              </el-table>


            </div>

          </el-tab-pane>

          <!-- TAB 标签三-->
          <el-tab-pane label="按周" name="zhou" style="height: 100%;">

            <!--工具栏-->
            <div class="flexHorizontal">

              <div>
                <el-form :model="formTimeModel" label-width="80px" id="form-1">
                  <el-form-item label="选择日期">
                    <el-date-picker
                      v-model="selectedDate"
                      type="date"
                      placeholder="请选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :clearable="true"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-form>
              </div>


              <!-- 操作按钮 -->
              <div class="flexHorizontal">


                <!-- 查询按钮 -->
                <el-button type="primary" @click="createEchartsData">
                  <i class="el-icon-search  el-icon--left"></i> 查 询
                </el-button>

                <!-- 导出按钮 -->
                <el-button type="primary" @click="exportData">
                  <i class="el-icon-download  el-icon--left"></i> 导 出
                </el-button>
              </div>


            </div>

            <!-- 注意这个内容不能是100%  因为还有表头高度呢    -->
            <div class="flexHorizontal" style="height: 90%;  margin-top: 10px;">

              <!--  表格-->

              <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%;"
                height="100%"
                :header-cell-style="tableHeaderStyle"
              >
                <el-table-column prop="circuit" label="回路名称"/>
                <el-table-column prop="currentMonth" label="本周期用电 / kW·h"/>
                <el-table-column prop="previousMonth" label="本周期用电 / kW·h"/>
                <el-table-column prop="increment" label="增加值"/>
                <el-table-column prop="percentage" label="环比(%)"/>

              </el-table>


            </div>


          </el-tab-pane>


        </el-tabs>


      </el-col>

    </el-row>
  </div>
</template>


<script>
import EnergySubstationStatus from '@/views/echarts/EnergySubstationStatus电力曲线折线图.vue'
import { mapState } from 'vuex'
import treeData from './data/treedata.js';
// 引入生成的数据模块

export default {
  name: 'ElectricData',
  components: { EnergySubstationStatus },

  data() {
    return {

      // ======================================================

      // 绑定的下拉框值
      selectedValue: '66',
      // 当前选中的标签页，初始值为 "用户管理"
      activeTab: 'user',

      // 树形数据
      treeData,

      // 属性配置，自定义指定树形结构的数据字段
      defaultProps: {
        children: 'children', // 子节点字段
        label: 'label' // 显示的文本字段
      },

      // 右侧数据
      powerCategory: null, // 电力类别
      selectedPhases: [], // 选中的相

      ////////////////////////////////时间选择///////////////////////////////////////
      selectedDate: null, // 时间范围
      formTimeModel: {},
      selectedMonth: '', // 存储用户选择的月份

      ////////////////////////////////表格数据///////////////////////////////////////
      tableData: [
        { circuit: "回路A", currentMonth: 45212, previousMonth: 38034, increment: 38034, percentage: 84.12 },
        { circuit: "回路B", currentMonth: 1.2, previousMonth: 0, increment: 0, percentage: 0 },
        { circuit: "回路C", currentMonth: 14416, previousMonth: 31998.5, increment: 31998.5, percentage: 221.97 },
        { circuit: "回路D", currentMonth: 28384, previousMonth: 5636.75, increment: 5636.75, percentage: 19.86 },
        { circuit: "回路E", currentMonth: 15823.23, previousMonth: 1093.41, increment: 1093.41, percentage: 6.91 },
        { circuit: "回路F", currentMonth: 386.59, previousMonth: -24.57, increment: -24.57, percentage: -6.36 },
      ],
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
    cellStyle() {
      return {
        // textAlign: "center", // 单元格水平居中
        // verticalAlign: "middle", // 单元格垂直居中
      };
    },

  },

  methods: {

    // 日期格式化方法
    formatMonth(row, column, cellValue) {
      if (!cellValue) return ''
      const date = new Date(cellValue)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份补零
      return `${year}年${month}月`
    },

    /**
     * 点击节点事件
     */
    handleNodeClick(node) {
      // 确保 tree 实例存在
      if (!this.$refs.tree) {
        console.error('Tree instance is not available')
        return
      }
      // 清除所有勾选状态
      this.$refs.tree.setCheckedKeys([])
      // 勾选当前节点
      this.$refs.tree.setChecked(node.id, true)
      console.log('当前点击的节点:', node)
    },

    queryData() {
      // console.log('查询数据:', {
      //   dateRange: this.dateRange,
      //   timeInterval: this.timeInterval,
      //   powerCategory: this.powerCategory,
      //   selectedPhases: this.selectedPhases
      // })
      //
    },

    createEchartsData() {
      console.log('查询按钮点击')
      // 查询逻辑
    },
    exportData() {
      console.log('导出按钮点击')
      // 导出逻辑
    }

  },

  created() {

  },

  mounted() {
    // console.log('组件已挂载');
  }

}
</script>

<style scoped>

/* ##################################  通用布局  ##################################*/

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

/* 自定义 el-tabs 样式 ====================================== */

/* 表格题自适应，以便于适配图标*/
>>> .el-tabs__content {
  height: 100%;

}


/* 标签行设置边距和背景颜色 */
>>> .el-tabs--border-card > .el-tabs__header {
  background-color: #ffffff;
  //padding: 3px;
  border-bottom: 3px solid #01ada8
}


/* 激活状态的标签页样式 */
>>> .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: #fff !important; /* 激活字体颜色 */
  background-color: #01ada8 !important; /* 激活背景颜色 */
}

/* 设置行样式 */
>>> .el-table th {
  font-size: 14px; /* 表头字体大小 */
  padding: 0px;
}

/* 直接给单元格整列设置样式 */
>>> .highlight-cell-yellow {
  color: #ff9900; /* 字体颜色 */
  font-weight: bold; /* 字体加粗 */
}

>>> .highlight-cell-green {
  color: #64da3d; /* 字体颜色 */
  font-weight: bold; /* 字体加粗 */
}

>>> .highlight-cell-bold {
  font-weight: bold; /* 字体加粗 */
}


/* 自定义 el-form 样式 ====================================== */

/* 修改#form-1的form组件 */
#form-1 >>> .el-form-item {
  margin-bottom: 1px;
}


>>> .el-button {
  /* 用于为元素的 背景颜色 和 文本颜色 的变化添加平滑的过渡效果。 */
  transition: background-color 0.3s, color 0.3s;
}


</style>
