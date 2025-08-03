<!--index666.vue-->
<template>
  <div class="container">
    <el-row :gutter="20" style="height: 100%;">

      <!-- 左侧 -->
      <el-col :span="4" style="height: 100%;">
        <div class="flexVertical" style="background-color: #FFFFFF; height: 100%;">

          <!-- 下拉框 -->
          <div class="form" style="padding: 0px; width: 100%;  ">
<!--            <span style="    margin-bottom: 10px;">厂房名称</span>-->
            <el-select v-model="selectedValue" placeholder="请选择厂房" style="width: 100%;  margin-top: 10px;">
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
        <el-tabs v-model="activeTab" type="border-card" style="height: 100%;"  class="animated-tabs">

          <!-- TAB 标签一 -->
          <el-tab-pane label="日报" name="user" style="height: 100%;">

            <!--工具栏-->
            <div class="flexHorizontal">

              <!-- 日期选择 -->
              <el-date-picker
                v-model="startDate"
                type="date"
                placeholder="开始日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                clearable
                style="width: 150px;"
              />
              <el-select
                v-model="startHour"
                placeholder="0"
                style="width: 80px;"
              >
                <el-option
                  v-for="hour in 24"
                  :key="hour"
                  :label="hour + ' 时'"
                  :value="hour"
                />
              </el-select>

<!--              <span>时 - </span>-->

              <el-date-picker
                v-model="endDate"
                type="date"
                placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                clearable
                style="width: 150px;"
              />
              <el-select
                v-model="endHour"
                placeholder="0"
                style="width: 80px;"
              >
                <el-option
                  v-for="hour in 24"
                  :key="hour"
                  :label="hour + ' 时'"
                  :value="hour"
                />
              </el-select>
<!--              <span>时 </span>-->

              <!-- 查询按钮组 -->
              <div class="button-group">
                <el-button type="primary" icon="el-icon-search" @click="queryData">
                  查询
                </el-button>
                <el-button type="primary" icon="el-icon-data-analysis" @click="openChartDialog">
                  图表
                </el-button>
                <el-button type="primary" icon="el-icon-pie-chart" @click="showPieChart">
                  饼图
                </el-button>
                <el-button type="primary" icon="el-icon-download" @click="exportData">
                  导出
                </el-button>
              </div>

              <!-- 辅助文字 -->
              <span class="toolbar-tip">(*为进线回路)</span>


            </div>


            <!-- 图表和表格显示    -->
            <!-- 注意这个内容不能是100%  因为还有表头高度呢    -->
            <div class="flexHorizontal" style="height: 88%;  margin-top: 20px;">

              <!--  表格   底部统计行： show-summary -->

              <el-table
              :data="tableData"
                border
                stripe
                style="width: 100%;"
                height="100%"
                :header-cell-style="tableHeaderStyle"
                :footer-method="footerMethod"
                show-summary
              :key="tableKey"
              @selection-change="handleSelectionChange"

              >

                <!-- 新增多选列 -->
                <el-table-column type="selection" width="50"></el-table-column>

                <!-- 冻结第一列 -->
                <el-table-column
                  prop="circuit"
                  label="回路名称 / kW·h"
                  fixed="left"
                  align="center"
                  width="150"
                ></el-table-column>

                <!-- 动态列 -->
                <el-table-column
                  v-for="column in dynamicColumns"
                  :key="column.prop"
                  :prop="column.prop"
                  :label="column.label"
                  align="center"
                  :header-cell-style="{ whiteSpace: 'nowrap' }"
                  :min-width="150"
                ></el-table-column>

                <!-- 合计列     冻结：fixed="right" -->
                <el-table-column
                  prop="total"
                  label="合计"
                  align="center"
                  width="100"
                ></el-table-column>
              </el-table>



            </div>


          </el-tab-pane>

          <!-- TAB 标签二 -->
          <el-tab-pane label="月报" name="config" style="height: 100%;">

            <!--工具栏-->
            <div class="flexHorizontal">

              <!-- 日期选择 -->
              <el-date-picker
                v-model="startDate"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="开始日期"
                clearable
                style="width: 150px;"
              />
              <el-select
                v-model="startHour"
                placeholder="0"
                style="width: 80px;"
              >
                <el-option
                  v-for="hour in 31"
                  :key="hour"
                  :label="hour + ' 日'"
                  :value="hour"
                />
              </el-select>

<!--              <span>时 - </span>-->

              <el-date-picker
                v-model="endDate"
                type="month"
                placeholder="结束日期"
                format="yyyy-MM"
                value-format="yyyy-MM"
                clearable
                style="width: 150px;"
              />
              <el-select
                v-model="endHour"
                placeholder="0"
                style="width: 80px;"
              >
                <el-option
                  v-for="hour in 31"
                  :key="hour"
                  :label="hour + ' 日'"
                  :value="hour"
                />
              </el-select>
<!--              <span>时 </span>-->

              <!-- 查询按钮组 -->
              <div class="button-group">
                <el-button type="primary" icon="el-icon-search" @click="queryData">
                  查询
                </el-button>
                <el-button type="primary" icon="el-icon-data-analysis" @click="openChartDialog">
                  图表
                </el-button>
                <el-button type="primary" icon="el-icon-pie-chart" @click="showPieChart">
                  饼图
                </el-button>
                <el-button type="primary" icon="el-icon-download" @click="exportData">
                  导出
                </el-button>
              </div>

              <!-- 辅助文字 -->
              <span class="toolbar-tip">(*为进线回路)</span>


            </div>


            <!-- 图表和表格显示    -->
            <!-- 注意这个内容不能是100%  因为还有表头高度呢    -->
            <div class="flexHorizontal" style="height: 88%;  margin-top: 20px;">

              <!--  表格   底部统计行： show-summary -->

              <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%;"
                height="100%"
                :header-cell-style="tableHeaderStyle"
                :footer-method="footerMethod"
                show-summary
                :key="tableKey"
                @selection-change="handleSelectionChange"

              >

                <!-- 新增多选列 -->
                <el-table-column type="selection" width="50"></el-table-column>

                <!-- 冻结第一列 -->
                <el-table-column
                  prop="circuit"
                  label="回路名称 / kW·h"
                  fixed="left"
                  align="center"
                  width="150"
                ></el-table-column>

                <!-- 动态列 -->
                <el-table-column
                  v-for="column in dynamicColumns"
                  :key="column.prop"
                  :prop="column.prop"
                  :label="column.label"
                  align="center"
                  :header-cell-style="{ whiteSpace: 'nowrap' }"
                  :min-width="150"
                >


                </el-table-column>

                <!-- 合计列     冻结：fixed="right" -->
                <el-table-column
                  prop="total"
                  label="合计"
                  align="center"
                  width="100"
                ></el-table-column>
              </el-table>



            </div>


          </el-tab-pane>


        </el-tabs>


      </el-col>

    </el-row>


    <!-- 弹窗 -->
    <div   >
    <el-dialog
      :visible.sync="dialogVisible"
      title="动态图表"
      width="60%"
      :close-on-click-modal="false"
      :show-close="true"
      custom-class="custom-dialog"
    >
      <template #title>
        <!-- 自定义标题部分 -->
        <span>用电统计折线图</span>
      </template>

      <!-- 弹窗内容 -->
      <div style="text-align: center;">

        <div  style="height: 500px">
          <EnergySubstationStatus   :chartId="'energy-trend-chart'"    :dynamicSeries="dialogData"   title="用电统计折线图"          />
        </div>
      </div>

      <!-- 弹窗底部 -->
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
    </div>


  </div>
</template>


<script>
import EnergySubstationStatus from '@/views/echarts/EnergySubstationStatus动态折线图.vue'
import { mapState } from 'vuex'
import treeData from './data/treedata.js';


// 引入生成的数据模块

export default {
  name: 'ElectricEnergyData',
  components: { EnergySubstationStatus },

  data() {
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10); // 格式化为 "yyyy-MM-dd"

    return {
      // ======================================================

      // 绑定的下拉框值
      selectedValue: '66',
      // 当前选中的标签页，初始值为 "用户管理"
      activeTab: 'user',

      // 树形数据js
      treeData,

      // 属性配置，自定义指定树形结构的数据字段
      defaultProps: {
        children: 'children', // 子节点字段
        label: 'label' // 显示的文本字段
      },

      // 右侧数据
      powerCategory: null, // 电力类别
      selectedPhases: [], // 选中的相

      ////////////////////////////////工具栏相关参数///////////////////////////////////////
      startDate: formattedDate, // 默认当天日期
      endDate: formattedDate,   // 默认当天日期
      startHour: 8,
      endHour: 9,
      selectedMonth: null, // 修复 selectedMonth 的引用
      formTimeModel: {
        month: null, // 示例字段
      },

      ////////////////////////////////表格数据///////////////////////////////////////

      tableKey: 0, // 用于强制重新渲染表格的 key
      dynamicColumns: [
        { prop: '2025-01-23_00', label: '2025-01-23 0时' },
        { prop: '2025-01-23_01', label: '2025-01-23 1时' },
        { prop: '2025-01-23_02', label: '2025-01-23 2时' },
        { prop: '2025-01-23_03', label: '2025-01-23 3时' },
        { prop: '2025-01-23_04', label: '2025-01-23 4时' },
        { prop: '2025-01-23_05', label: '2025-01-23 5时' },
        { prop: '2025-01-23_06', label: '2025-01-23 6时' },
        { prop: '2025-01-23_07', label: '2025-01-23 7时' },
        { prop: '2025-01-23_08', label: '2025-01-23 8时' },
      ],
      selectedRows: [], // 存储选中的行数据
      dialogData: [], // 存储传递到弹窗的动态数据
      tableData: [      ],


      ////////////////////////////////弹窗相关///////////////////////////////////////
      dialogVisible: false, // 控制弹窗显示


      /////////////////////////////////实时负荷_图表变量4//////////////////////////////////////

      pData: {
        time: ['00:00', '01:00', '02:00', '03:00', '04:00'],
        values: [10, 20, 15, 25, 30]
      },
      paData: {
        time: ['00:00', '01:00', '02:00', '03:00', '04:00'],
        values: [12, 22, 18, 28, 35]
      },
      pbData: {
        time: ['00:00', '01:00', '02:00', '03:00', '04:00'],
        values: [14, 24, 20, 30, 40]
      },
      pcData: {
        time: ['00:00', '01:00', '02:00', '03:00', '04:00'],
        values: [16, 26, 25, 35, 45]
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
        color: '#ffffff', // 表头文字颜色
        textAlign: 'center', // 文本居中
        fontWeight: 'bold' ,// 加粗文字
        whiteSpace: 'nowrap' //不换行
      }
    }

  },

  methods: {

    ////////////////////////////////弹窗相关///////////////////////////////////////

    handleConfirm() {
      this.dialogVisible = false;
      this.$message.success('点击了确定按钮');
    },
    ////////////////////////////////////////////////////表格计算相关//////////////////////////////////////////////////////

    // 保存选中的数据
    handleSelectionChange(selectedRows) {
      this.selectedRows = selectedRows; // 保存选中的数据
    },

    // 打开图表22223
    openChartDialog() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请先选择数据！");
        return;
      }

      // console.log("【调试信息】已选择的行数据:", this.selectedRows);

      // 生成 dialogData 格式
      this.dialogData = this.selectedRows.map((row) => ({
        name: row.circuit, // 回路名称
        time: this.dynamicColumns.map((col) => col.label), // 横轴时间数据
        values: this.dynamicColumns.map((col) => row[col.prop]), // 对应列的数值
      }));

      // console.log("【调试信息】生成的 dialogData 数据:", this.dialogData);

      this.dialogVisible = true; // 打开弹窗
    },


    // 用于计算底部合计行的数据：
    footerMethod({ columns, data }) {
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            return !isNaN(value) ? prev + value : prev;
          }, 0);
        } else {
          sums[index] = '-';
        }
      });
      return sums;
    },

    // 动态生成列 的逻辑，基于开始和结束时间计算列数量！。
    generateDynamicColumns() {
      const startHour = this.startHour;
      const endHour = this.endHour;
      const date = this.startDate; // 确保 startDate 已选中

      const columns = [];
      for (let hour = startHour; hour <= endHour; hour++) {
        const hourStr = hour.toString().padStart(2, '0');
        columns.push({
          prop: `${date}_${hourStr}`,
          label: `${date} ${hour}时`,
        });
      }
      this.dynamicColumns = columns;
    },

    // 查询
    queryData() {
      // console.log(`查询数据: ${this.startDate} ${this.startHour} 时 ~ ${this.endDate} ${this.endHour} 时`);
      this.generateDynamicColumns(); // 动态生成列
      this.loadData(); // 加载表格数据
      // 更新 tableKey 强制重新渲染表格
      this.tableKey++;
    },

    // 模拟后端数据
    loadData() {
      this.tableData = [
        {
          circuit: '保温炉1',
          total: 500, // 总计
          '2025-01-23_00': 50,
          '2025-01-23_01': 60,
          '2025-01-23_02': 70,
          '2025-01-23_03': 40,
          '2025-01-23_04': 30,
          '2025-01-23_05': 50,
          '2025-01-23_06': 80,
          '2025-01-23_07': 60,
          '2025-01-23_08': 60,
        },
      ];
    },



    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 日期格式化方法
    formatMonth(row, column, cellValue) {
      if (!cellValue) return '';
      const date = new Date(cellValue);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份补零
      return `${year}年${month}月`;
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

    showPieChart() {
      console.log("切换到饼图显示");
      // 饼图显示逻辑
    },
    exportData() {
      console.log('导出按钮点击')
      // 导出逻辑
    },
    prevDay() {
      console.log("上一日功能尚未实现");
    },
    nextDay() {
      console.log("下一日功能尚未实现");
    },
    createEchartsData() {
      console.log("生成图表数据功能尚未实现");
    },
    handleClick() {
      console.log("按钮点击事件");
    },

  },

  created() {

    this.loadData(); // 加载表格数据
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

/* 垂直盒子容器*/
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
.flexHorizontal {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
  font-size: 14px;
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

/* 【底部冻结行】统计行样式背景( 主要第一列) */
>>>.el-table__fixed-footer-wrapper tbody td.el-table__cell {
  background-color: #ffffff !important; /* 设置背景为白色 */
}

/* 【底部冻结行】修改统计行样式背景(除第一列外) */
>>>.el-table__footer-wrapper td {
  background: #ffffff !important; /* 设置背景颜色为白色 */
  //color: #000 !important;        /* 设置字体颜色为黑色 */
  //font-weight: bold;             /* 加粗字体 */
  //text-align: center;            /* 居中对齐 */
}

/* 深度作用表头单元格的样式, 强制不换行    , 失败*/
>>> .el-table th {
  white-space: nowrap !important; /* 强制不换行 */
  overflow: hidden !important;    /* 隐藏超出内容 */
  text-overflow: ellipsis !important; /* 超出显示省略号 */
}



/* ##################################自定义弹窗样式#############################*/
>>>.custom-dialog {
  border-radius: 10px; /* 四角圆弧 */
  overflow: hidden;
}




</style>
