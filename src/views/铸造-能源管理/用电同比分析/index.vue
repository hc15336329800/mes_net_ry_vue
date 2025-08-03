<!-- 用电同比分析  index.vue -->
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
              :default-checked-keys="[11]"
            ></el-tree>
          </div>

        </div>
      </el-col>

      <!-- 右侧 -->
      <el-col :span="20" class="flexVertical  containerItem" style=" padding-left: 20px;">


        <!--工具栏-->
        <div class="flexHorizontal">

          <div>
            <el-form :model="formTimeModel" label-width="80px" id="form-1">
              <el-form-item label="选择年份">
                <el-date-picker
                  v-model="selectedMonth"
                  type="year"
                  placeholder="请选择年份"
                  format="yyyy"
                  value-format="yyyy"
                  :clearable="true"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-form>
          </div>


          <!-- 操作按钮 -->
          <div class="flexHorizontal">
            <!-- 上一日按钮 -->
            <el-button type="primary" @click="prevDay">
              <i class="el-icon-arrow-left el-icon--left"></i> 上一年
            </el-button>

            <!-- 下一日按钮 -->
            <el-button type="primary" @click="nextDay">
              下一年 <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>

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


        <div style="height: 40% ; width: 100%">

          <!--  图表  -->
          <EnergySubstationStatus
            chartId="energyChart"
            :currentData="[120, 132, 101, 134, 90, 230, 210, 180, 200, 170, 190, 220]"
            :previousData="[80, 110, 95, 120, 85, 200, 190, 160, 180, 150, 175, 210]"
          />

        </div>

        <div  style="height: 60% ; width: 100%">

          <!--  表格  -->
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%;"
            height="100%"
            :header-cell-style="tableHeaderStyle"
          >
            <!-- 月份 -->
            <el-table-column prop="month" label="月份" />
            <!-- 本期 -->
            <el-table-column prop="current" label="本期" />
            <!-- 同期 -->
            <el-table-column prop="previous" label="同期" />
            <!-- 同比(%) -->
            <el-table-column prop="yoy" label="同比(%)" />
            <!-- 累计同比(%) -->
            <el-table-column prop="cumulativeYoy" label="累计同比(%)" />

          </el-table>
        </div>

      </el-col>

    </el-row>

  </div>
</template>


<script>
import EnergySubstationStatus from '@/views/echarts/EnergySubstationStatus本期同期柱状图.vue'

import { mapState } from 'vuex'

import treeData from './data/treedata.js';

// 引入生成的数据模块

export default {
  name: 'ElectricEnergyData',
  components: { EnergySubstationStatus },

  data() {
    const today = new Date()
    const formattedDate = today.toISOString().slice(0, 10) // 格式化为 "yyyy-MM-dd"

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

      ////////////////////////////////工具栏相关参数///////////////////////////////////////
      startDate: formattedDate, // 默认当天日期
      endDate: formattedDate,   // 默认当天日期
      startHour: 8,
      endHour: 9,
      selectedMonth: null, // 修复 selectedMonth 的引用
      formTimeModel: {
        month: null // 示例字段
      },

      ////////////////////////////////表格数据///////////////////////////////////////
      tableData: [],
      ////////////////////////////////弹窗相关///////////////////////////////////////
      dialogVisible: false // 控制弹窗显示

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
        fontWeight: 'bold',// 加粗文字
        whiteSpace: 'nowrap' //不换行
      }
    }

  },

  methods: {

    ////////////////////////////////弹窗相关///////////////////////////////////////

    handleConfirm() {
      this.dialogVisible = false
      this.$message.success('点击了确定按钮')
    },
    ////////////////////////////////////////////////////表格计算相关//////////////////////////////////////////////////////

    // 查询
    queryData() {
      // console.log(`查询数据: ${this.startDate} ${this.startHour} 时 ~ ${this.endDate} ${this.endHour} 时`);
      this.generateDynamicColumns() // 动态生成列
      this.loadData() // 加载表格数据

    },

    // 模拟后端数据
    loadData() {
      this. tableData=[
        { month: '1月', current: 200, previous: 180, yoy: '11.1%', cumulativeYoy: '11.1%' },
        { month: '2月', current: 250, previous: 220, yoy: '13.6%', cumulativeYoy: '12.3%' },
        { month: '3月', current: 300, previous: 280, yoy: '7.1%', cumulativeYoy: '10.5%' },
        { month: '4月', current: 320, previous: 310, yoy: '3.2%', cumulativeYoy: '9.0%' },
        { month: '5月', current: 280, previous: 260, yoy: '7.7%', cumulativeYoy: '8.9%' },
        { month: '6月', current: 350, previous: 340, yoy: '2.9%', cumulativeYoy: '7.6%' },
        { month: '7月', current: 400, previous: 380, yoy: '5.3%', cumulativeYoy: '7.4%' },
        { month: '8月', current: 420, previous: 400, yoy: '5.0%', cumulativeYoy: '7.3%' },
        { month: '9月', current: 390, previous: 360, yoy: '8.3%', cumulativeYoy: '7.5%' },
        { month: '10月', current: 450, previous: 430, yoy: '4.7%', cumulativeYoy: '7.3%' },
        { month: '11月', current: 470, previous: 450, yoy: '4.4%', cumulativeYoy: '7.1%' },
        { month: '12月', current: 500, previous: 480, yoy: '4.2%', cumulativeYoy: '6.9%' },
      ]
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 日期格式化方法
    formatMonth(row, column, cellValue) {
      if (!cellValue) return ''
      const date = new Date(cellValue)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份补零
      return `${year}年${month}月`
    },

    exportData() {
      console.log('导出按钮点击')
      // 导出逻辑
    },
    prevDay() {
      console.log('上一日功能尚未实现')
    },
    nextDay() {
      console.log('下一日功能尚未实现')
    },
    createEchartsData() {
      console.log('生成图表数据功能尚未实现')
    },
    handleClick() {
      console.log('按钮点击事件')
    }

  },

  created() {

    this.loadData() // 加载表格数据
  }

}
</script>

<style scoped>

/* ##################################  通用容器布局  ##################################*/

/* 主容器*/
.container {
  display: flex;
  flex-direction: column;
  margin: 10px;
  height: calc(100vh - 130px);
  gap: 5px;
}

/* 左右侧的容器背景*/
.containerItem {
  background-color: rgb(255, 255, 255);
  padding-left: 20px;
  padding-right: 10px;
  height: 100%;
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

/* ##################################通用三方组件样式#############################*/

/* ------------自定义弹窗样式------------*/
>>> .custom-dialog {
  border-radius: 10px; /* 四角圆弧 */
  overflow: hidden;
}

/* ------------修正表单中的时间组件上下跑偏问题------------*/
>>> .el-form-item {
  margin-bottom: 1px;
}

/* ##################################其他#############################*/

</style>
