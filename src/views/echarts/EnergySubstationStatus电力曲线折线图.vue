<!--EnergySubstationStatus电力曲线折线图.vue-->
<template>


  <!-- 图表容器 -->
  <div :id="chartId" class="chart-container"></div>


</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'EnergySubstationStatus',
  props: {
    title: {
      type: String,
      default: '趋势图'
    },
    chartId: {
      type: String,
      required: true
    },
    pData: {
      type: [ Object], // 支持 Array 和 Object
      required: true
    },
    paData: {
      type: [ Object], // 支持 Array 和 Object
      required: true
    },
    pbData: {
      type: [ Object], // 支持 Array 和 Object
      required: true
    },
    pcData: {
      type: [ Object], // 支持 Array 和 Object
      required: true
    }
  },
  data() {
    return {
      chart: null,
      baseChartOptions: {

        title: {
          left: 'left',
          textStyle: {
            color: '#008acd',
            fontSize: 14
          }
        },
        // 使用 dataZoom 组件，实现数据缩放！
        dataZoom: [
          // X 轴的滚动条
          {
            // type: 'inside', // 内置滚动缩放模式
            type: 'slider', // 底部拖动条
            show: true,
            xAxisIndex: 0,
            start: 0, // 默认显示数据的起始位置（百分比，0 表示起点）
            end: 100, // 默认显示数据的结束位置（百分比，20 表示前 20% 的数据）
            throttle: 100 // 滚轮事件的触发节流时间，单位为毫秒
          },
          {
            // type: 'slider', // 滑动条模式
            type: 'inside', // 鼠标滚轮缩放
            xAxisIndex: 0,
            // show: false, // 显示滑动条
            start: 0, // 同上
            end: 20, // 同上
            // bottom: '10%' // 滑动条位置
          },
          // Y 轴的滚动条
          {
            type: 'slider',
            show: true,
            yAxisIndex: 0, // 控制 Y 轴
            start: 0,
            end: 100,
            throttle: 100
          },
          {
            // 鼠标滚轮缩放 Y 轴
            type: 'inside',
            yAxisIndex: 0, // 控制 Y 轴
            start: 0,
            end: 100
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['P', 'Pa', 'Pb', 'Pc'],
          icon: 'circle',

          bottom: 5, // 原来是 0，设置为 5，拉近图例和图表的距离
          top: 5,
          textStyle: {
            color: '#008acd'
          }
        },
        grid: {
          left: '5%',
          right: '4%',
          top: '10%', // 原来是 20%，减少顶部空白
          bottom: '13%' // 确保图表和图例之间留出足够的距离
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: true, // 确保显示 x 轴线
            lineStyle: {
              color: '#008acd'// 设置 x轴线的颜色
            }
          },
          axisLabel: {
            color: '#008acd',
            formatter: (value) => {
              // 格式化时间为 "MM-DD HH:mm"
              const date = new Date(value)
              const month = (date.getMonth() + 1).toString().padStart(2, '0')
              const day = date.getDate().toString().padStart(2, '0')
              const hours = date.getHours().toString().padStart(2, '0')
              const minutes = date.getMinutes().toString().padStart(2, '0')
              return `${month}-${day} ${hours}:${minutes}`
            },
          },
        },
        yAxis: {
          type: 'value',
          name: 'kW',
          nameTextStyle: {
            color: '#008acd'
          },
          axisLine: {
            show: true, // 确保显示 y 轴线
            lineStyle: {
              color: '#008acd'
            }
          },
          axisLabel: {
            color: '#008acd'
          },
          splitLine: { // 这里控制背景格子线
            lineStyle: {
              color: 'rgba(51, 51, 51, 0.2)'   // 灰色，透明度 0.1
            }
          }
        },
        series: [
          {
            name: 'P', // 系列名称
            type: 'line', // 系列类型：折线图
            smooth: true, // 折线是否平滑
            data: [], // 数据数组（动态更新）
            lineStyle: {
              color: '#3498db' // 折线颜色
            },
            showSymbol: false // 隐藏折线图上的圆点
          },
          {
            name: 'Pa', // 系列名称
            type: 'line',
            smooth: true,
            data: [],
            lineStyle: {
              color: '#2ecc71'
            },
            showSymbol: false // 隐藏圆点
          },
          {
            name: 'Pb', // 系列名称
            type: 'line',
            smooth: true,
            data: [],
            lineStyle: {
              color: '#e74c3c'
            },
            showSymbol: false // 隐藏圆点
          },
          {
            name: 'Pc', // 系列名称
            type: 'line',
            smooth: true,
            data: [],
            lineStyle: {
              color: '#9b59b6'
            },
            showSymbol: false // 隐藏圆点
          }
        ]
      }
    }
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById(this.chartId)
      if (!chartDom) {
        console.error(`Chart container with id "${this.chartId}" not found.`)
        return
      }
      this.chart = echarts.init(chartDom)
      this.updateChartData()
      window.addEventListener('resize', this.resizeChart)
    },
    updateChartData() {
      const options = {
        ...this.baseChartOptions,
        xAxis: {
          ...this.baseChartOptions.xAxis,
          data: this.pData.time // 从对象中提取时间数组
        },
        series: [
          { ...this.baseChartOptions.series[0], data: this.pData.values },
          { ...this.baseChartOptions.series[1], data: this.paData.values },
          { ...this.baseChartOptions.series[2], data: this.pbData.values },
          { ...this.baseChartOptions.series[3], data: this.pcData.values }
        ]
      }
      if (this.chart) {
        this.chart.clear()
        this.chart.setOption(options, true)
      }
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  },
  mounted() {

    // console.log("pData:", this.pData);
    // console.log("paData:", this.paData);
    // console.log("pbData:", this.pbData);
    // console.log("pcData:", this.pcData);
    this.initChart();

  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart)
    if (this.chart) {
      this.chart.dispose()
    }
  },
  watch: {
    pData: {
      deep: true,
      handler() {
        this.updateChartData()
      }
    },
    paData: {
      deep: true,
      handler() {
        this.updateChartData()
      }
    },
    pbData: {
      deep: true,
      handler() {
        this.updateChartData()
      }
    },
    pcData: {
      deep: true,
      handler() {
        this.updateChartData()
      }
    }
  }
}
</script>

<style scoped>
.energy-analysis-trend {
  width: 100%;
  height: 103%;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.chart-container {
  //flex-grow: 1;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}


</style>
