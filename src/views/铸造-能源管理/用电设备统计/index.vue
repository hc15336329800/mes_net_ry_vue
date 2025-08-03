<!--变压器状态监测-->

<template>

  <div class="container">

    <!--    第一行-->

    <el-row el-row :gutter="15" style="height: 33%;margin-top: 10px;">

      <!--一列-->
      <el-col :span="8" style="height: 100%; ">
        <!-- 卡片1 -->
        <el-card class="box-card" :style="{ '--card-header-bg': theme }" shadow="never">
          <!-- 卡片头 -->
          <!-- 卡片头 -->
          <div slot="header" class="card-header">
            <span>熔炉信息</span>
            <el-select v-model="selectedFurnace" placeholder="请选择熔炉" size="small" class="furnace-select">
              <el-option v-for="num in 9" :key="num" :label="`${num}号熔炉`" :value="num"></el-option>
            </el-select>
          </div>

          <div class="flexHorizontal">

            <!-- 卡片体 -->
            <div style="text-align: center;   width: 100px;  flex: 2 ;">
              <el-image class="image-icon" :src="require('@/assets/images/Boiler_with_flames.gif')" fit="contain"/>
            </div>


            <div style="flex: 3 ;height: 80%; width: 100%">

              <div class="flexVertical_betweenn">
                <p style="padding: 0; margin: 0;"><span> <span  STYLE="    color: #188339;    font-size: 16px;">1# 融炉  </span></span></p>
                <p style="padding: 0; margin: 0; color: #ff9800  ;  font-weight: bold;"><span>( 今日产量：<span style="color: #ff9800  ;  ">38</span> 炉 )</span></p>

                <p style="padding: 0; margin: 0;"><span>设备型号： <span>SG33CX-2P-CN</span></span></p>
                <p style="padding: 0; margin: 0;"><span>设备位置： <span>铸造车间东南角</span></span></p>

                <p style="padding: 0; margin: 0;"><span>当前溶料： <span>低压101铝</span> </span></p>
                <p style="padding: 0; margin: 0;"><span>熔炉状态：<span>保温</span></span></p>
              </div>


            </div>


          </div>


        </el-card>

      </el-col>

      <!--二列-->
      <el-col :span="8" style="height: 100%; ">
        <!-- 卡片2 -->
        <el-card class="" :style="{ '--card-header-bg': theme ,flex: 1}" shadow="never">
          <!-- 卡片头 -->
          <div slot="header" class="card-header clearfix">
            <span>今日溶料能耗</span>
          </div>
          <!-- 卡片体 -->
          <div class="flexHorizontal">


            <div class="flexVertical">
              <!-- 辐照度 -->
              <div style="text-align: center;   width: 100px; ">
                <el-image class="image-icon" :src="require('@/assets/images/辐照度.png')" fit="contain"/>
              </div>
              <span style="text-align: center;   width: 100px; "> 溶料时间 </span>
              <span style="text-align: center;   width: 100px; "> 5 h</span>
            </div>

            <div class="flexVertical">
              <!-- 环境温湿度 -->
              <div style="text-align: center;   width: 100px; ">
                <el-image class="image-icon" :src="require('@/assets/images/环境温湿度.png')" fit="contain"/>
              </div>
              <span style="text-align: center;   width: 100px; "> 燃气用量 </span>
              <span style="text-align: center;   width: 100px; ">133.2 m³</span>
            </div>
            <div class="flexVertical">
              <!-- 风速 -->
              <div style="text-align: center;   width: 100px; ">
                <el-image class="image-icon" :src="require('@/assets/images/风速.png')" fit="contain"/>
              </div>
              <span style="text-align: center;   width: 100px; "> 电能用量 </span>
              <span style="text-align: center;   width: 100px; ">233.2 kW</span>

            </div>


          </div>

        </el-card>

      </el-col>

      <!-- 三列-->
      <el-col :span="8" style="height: 100%; ">
        <!-- 卡片3 -->
        <el-card class="" :style="{ '--card-header-bg': theme ,flex: 1}" shadow="never">
          <!-- 卡片头 -->
          <div slot="header" class="card-header clearfix">
            <span>今日保温能耗</span>
          </div>
          <!-- 卡片体 -->
          <div class="flexHorizontal">


            <div class="flexVertical">
              <!-- 辐照度 -->
              <div style="text-align: center;   width: 100px; ">
                <el-image class="image-icon" :src="require('@/assets/images/辐照度.png')" fit="contain"/>
              </div>
              <span style="text-align: center;   width: 100px; "> 保温时长 </span>
              <span style="text-align: center;   width: 100px; "> 2 h</span>
            </div>

            <div class="flexVertical">
              <!-- 环境温湿度 -->
              <div style="text-align: center;   width: 100px; ">
                <el-image class="image-icon" :src="require('@/assets/images/环境温湿度.png')" fit="contain"/>
              </div>
              <span style="text-align: center;   width: 100px; "> 燃气用量 </span>
              <span style="text-align: center;   width: 100px; ">33.2 m³</span>
            </div>
            <div class="flexVertical">
              <!-- 风速 -->
              <div style="text-align: center;   width: 100px; ">
                <el-image class="image-icon" :src="require('@/assets/images/风速.png')" fit="contain"/>
              </div>
              <span style="text-align: center;   width: 100px; "> 电能用量</span>
              <span style="text-align: center;   width: 100px; ">33.2 kw</span>
            </div>


          </div>

        </el-card>

      </el-col>


    </el-row>

    <!--    第二行-->
    <el-row :span="24" style="height: 33%; margin-top: 10px; ">

      <div class="flexHorizontal">

        <!-- 内一列-->

        <el-card class="box-card" :style="{ '--card-header-bg': theme ,flex: 1 }" shadow="never">
          <!-- 卡片头 -->
          <div slot="header" class="card-header clearfix">
            <span>实时温度</span>
          </div>

          <div class="flexHorizontal"  >

            <!-- 卡片体 -->

            <EnergyDashboard发电量仪表盘
              :value="gaugeValue"
              :name="gaugeName"
            />

            <EnergyDashboard发电量仪表盘
              :value="gaugeValue1"
              :name="gaugeName1"
            />
          </div>


        </el-card>


        <!--内二列-->
        <el-card class="" :style="{ '--card-header-bg': theme ,flex: 2}" shadow="never">
          <!-- 卡片头 -->
          <div slot="header" class="card-header clearfix">
            <span>燃气消耗</span>
          </div>
          <!-- 卡片体 -->

          <div class=" " style="    display: flex;">
            <el-radio-group v-model="timeType" size="medium"
                            style=" width: 5%;  display: flex; flex-direction: column; gap: 0px; border-left: 0.5px solid #eaeaea;"
            >
              <el-radio-button label="minute">分</el-radio-button>
              <el-radio-button label="hour">时</el-radio-button>
              <el-radio-button label="day">日</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
              <el-radio-button label="year">年</el-radio-button>
            </el-radio-group>


            <!-- 传递 allData 数据 -->
            <EnergyEcherts chartId="energyChart" :allData="energyData" :timeType="timeType" style=" width: 95%; "/>

          </div>

        </el-card>


      </div>


    </el-row>


    <!--    第三行-->
    <el-row :span="24" style="height: 33%; margin-top: 10px;">
      <el-table
        :data="meltingRecords"
        border
        stripe
        style="width: 100%;"
        height="100%"
        :header-cell-style="tableHeaderStyle"
        class="custom-table"
      >
        <el-table-column prop="deviceName" label="设备名称" align="center" min-width="120"/>
        <el-table-column prop="deviceModel" label="设备型号" align="center" min-width="140"/>
        <el-table-column prop="materialType" label="融料类型" align="center" min-width="100"/>
        <!-- 任务类型列，设置字体颜色 -->
        <el-table-column prop="taskType" label="任务类型" align="center" min-width="100">
          <template #default="{ row }">
      <span :style="{ color: row.taskType === '溶料' ? '#ff9800' : '#4caf50' }">
        {{ row.taskType }}
      </span>
          </template>
        </el-table-column>        <el-table-column prop="startTime" label="开始时间" align="center" min-width="160"/>
        <el-table-column prop="endTime" label="结束时间" align="center" min-width="160"/>
        <el-table-column prop="duration" label="消耗时长(分钟)" align="center" min-width="140"/>
        <el-table-column prop="gasConsumption" label="燃气用量(立方)" align="center" min-width="140"/>
        <el-table-column prop="powerConsumption" label="电力消耗(kw)" align="center" min-width="140"/>
      </el-table>
    </el-row>



  </div>
</template>


<script>
import { mapState } from 'vuex'
import EnergyDashboard发电量仪表盘 from '@/views/echarts/EnergyDashboard发电量仪表盘.vue'
import EnergyEcherts from '@/views/echarts/EnergyEcherts分时日月年折线柱状动态图.vue'
import { energyData } from './data/分时日月年数据.js' // ✅ 引入数据文件

import meltingRecords from './data/熔炼记录数据.js';

export default {
  name: 'CardExample',
  components: {
    EnergyDashboard发电量仪表盘,
    EnergyEcherts
  },
  computed: {
    ...mapState({
      theme: (state) => state.settings.theme // 从 Vuex 状态获取 theme
    }),
    tableHeaderStyle() {
      return {
        backgroundColor: this.theme || '#fa0623', // 表头背景颜色
        color: this.theme.cardHeaderText || '#ffffff', // 表头文字颜色
        fontWeight: 'bold' ,// 加粗文字
        // textAlign: "center", // 表头水平居中
        // verticalAlign: "middle", // 表头垂直居中
        height: '32px'  // ✅  设置行高
      }
    },

  },

  data() {
    return {

      /////////////////////////////////熔炉数据//////////////////////////////////////

      selectedFurnace: 1, // 存储选中的熔炉

      meltingRecords,   //熔炼记录数据.js';

      /////////////////////////////////底部表格数据//////////////////////////////////////

      tableData: [
        { inputCircuit: 'PV1', voltage: 0, current: 0, power: '0.00' },
        { inputCircuit: 'PV3', voltage: 683.4, current: 0.6, power: '0.41' }
      ],

      tableData2: [
        { parameter: '电压(V)', A_phase: 232, B_phase: 229.6, C_phase: 231.2 },
        { parameter: '电流(A)', A_phase: 1.8, B_phase: 1.9, C_phase: 1.8 },
        { parameter: '总有功功率(kW)', A_phase: 0.76, B_phase: '', C_phase: '' },
        { parameter: '功率因数', A_phase: 0.83, B_phase: '', C_phase: '' }
      ],
      /////////////////////////////////逆变器//////////////////////////////////////

      inverterData: [
        {
          location: 'A楼5F',
          status: '离线',
          data: {
            '并网电价': { value: 0.67, unit: '元/kW·h' },
            '电站装机容量': { value: 121, unit: 'kW' },
            '逆变器数量': { value: 4, unit: '个' },
            '并网电压': { value: 380, unit: 'V' },
            '年利用小时数': { value: 49.17, unit: 'h' },
            '总发电量': { value: 328803.67, unit: 'kWh' }
          }
        },
        {
          location: 'B楼3F',
          status: '在线',
          data: {
            '并网电价': { value: 0.72, unit: '元/kW·h' },
            '电站装机容量': { value: 135, unit: 'kW' },
            '逆变器数量': { value: 5, unit: '个' },
            '并网电压': { value: 400, unit: 'V' },
            '年利用小时数': { value: 51.24, unit: 'h' },
            '总发电量': { value: 350900.12, unit: 'kWh' }
          }
        },
        {
          location: 'C楼2F',
          status: '在线',
          data: {
            '并网电价': { value: 0.65, unit: '元/kW·h' },
            '电站装机容量': { value: 110, unit: 'kW' },
            '逆变器数量': { value: 3, unit: '个' },
            '并网电压': { value: 370, unit: 'V' },
            '年利用小时数': { value: 47.82, unit: 'h' },
            '总发电量': { value: 290450.33, unit: 'kWh' }
          }
        },
        {
          location: 'D楼1F',
          status: '离线',
          data: {
            '并网电价': { value: 0.70, unit: '元/kW·h' },
            '电站装机容量': { value: 140, unit: 'kW' },
            '逆变器数量': { value: 6, unit: '个' },
            '并网电压': { value: 420, unit: 'V' },
            '年利用小时数': { value: 55.10, unit: 'h' },
            '总发电量': { value: 400123.89, unit: 'kWh' }
          }
        },
        {
          location: 'E楼6F',
          status: '在线',
          data: {
            '并网电价': { value: 0.75, unit: '元/kW·h' },
            '电站装机容量': { value: 160, unit: 'kW' },
            '逆变器数量': { value: 7, unit: '个' },
            '并网电压': { value: 440, unit: 'V' },
            '年利用小时数': { value: 58.20, unit: 'h' },
            '总发电量': { value: 450890.45, unit: 'kWh' }
          }
        }
      ],

      /////////////////////////////////仪表盘//////////////////////////////////////

      gaugeValue: 65, // 仪表盘数值
      gaugeName: '炉膛温度(°C)', // 仪表盘中心名称
      gaugeBottomTitle: '', // 可选的底部标题


      gaugeValue1: 60, // 仪表盘数值
      gaugeName1: '铝液温度(°C)',  // 仪表盘中心名称
      gaugeBottomTitle1: '', // 可选的底部标题

      /////////////////////////////////分时日月年图表//////////////////////////////////////

      timeType: 'minute', // minute默认按分钟显示数据month
      energyData: energyData.allData // 直接绑定数据

      // allData: {
      //   minute: [ ],
      //   hour: [ ],
      //   day:[ ],
      //   month: [ ],
      //   year: [ ],
      // },

    }
  },
  ///////////////////////////////// //////////////////////////////////////

  create() {
    // this.handleButtonClick();
  },
  //元素加载完毕
  mounted() {
    setTimeout(() => {
      //this.handleButtonClick();
    }, 500) // 延迟 2 秒
  },
  methods: {

    // 生成随机数并更新仪表盘
    updateValue() {

      this.gaugeValue = Math.floor(Math.random() * 101)
      this.$modal.msgSuccess('成功反馈:' + this.gaugeValue)

    },

    // 刷新，今日昨日的趋势图
    /////////////////////////////////动态生成测试数据//////////////////////////////////////


    /////////////////////////////////图表相关方法//////////////////////////////////////

    // 生成随机数据
    generateRandomData(length, minValue, maxValue) {
      return Array.from({ length }, () =>
        Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
      )
    }

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

  width: 100%; /* 定制*/
  height: 100%;
}

/* 垂直盒子容器 - 两端对齐*/
.flexVertical_betweenn {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  //padding: 20px;
  //gap: 10px;
  font-size: 14px;

  width: 100%; /* 定制*/
  height: 100%;
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

  width: 100%; /* 定制*/
  height: 100%;

}

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
  gap: 15px;
  font-size: 14px;
  flex-wrap: wrap;
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
  font-size: 14px;

  font-weight: 600;
  letter-spacing: 2px;
  min-height: 35px;
}

>>> .el-card__body {
  padding: 5px 0px 0px 15px;
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

/* ##################################  自定义表格样式  ##################################*/



/* 表格体中行高：  数据行生效了 */
.custom-table >>> .el-table__row td {
  height: 16px !important;
  line-height: 10px !important;
  //padding: 0 !important;
}



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


/* 熔炉相关 */

>>>.card-header {
  display: flex;
  justify-content: space-between; /* 左右对齐 */
  align-items: center; /* 垂直居中 */
}

</style>
