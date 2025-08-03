<!--EnergyEcherts分时日月年折线柱状动态图.vue-->
<template>
  <!-- 图表容器 -->
  <div :id="chartId" class="chart-container"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'EnergyEcherts',
  props: {
    chartId: { type: String, required: true },
    allData: { type: Object, required: true }, // 包含 minute/hour/day/month/year 的所有数据
    timeType: { type: String, required: true } // 当前选择的时间类型（minute/hour/day/month/year）
  },
  data() {
    return {
      chart: null,
      baseChartOptions: {
        tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
        legend: { show: false }, // ✅ 隐藏图例
        // legend: { data: [], icon: 'circle', bottom: 0, textStyle: { color: '#008acd' } }, // ✅ 动态图例
        grid: { left: '5%', right: '5%', top: '8%', bottom: '15%' },
        xAxis: {
          type: 'category',
          boundaryGap: this.timeType !== 'minute',   //✅✅✅ 解决则线图正常  ，但是柱状图左右两侧撑开问题！！
           axisLabel: { color: '#008acd' },
          axisLine: { show: true, lineStyle: { color: '#008acd' } }
        },
        yAxis: [
          {
            type: 'value',
            name: 'kW',
            nameTextStyle: { color: '#008acd' },
            axisLine: { show: true, lineStyle: { color: '#008acd' } },
            axisLabel: { color: '#008acd' },
            splitLine: { lineStyle: { color: 'rgba(51, 51, 51, 0.2)' } }
          },
          {
            type: 'value',
            name: 'kWh',
            nameTextStyle: { color: '#008acd' },
            axisLine: { show: true, lineStyle: { color: '#008acd' } },
            axisLabel: { color: '#008acd' },
            splitLine: { show: false }
          }
        ],
        series: []
      }
    };
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById(this.chartId);
      if (!chartDom) return console.error(`Chart container with id "${this.chartId}" not found.`);
      this.chart = echarts.init(chartDom);
      this.updateChartData();
      window.addEventListener('resize', this.resizeChart);
    },


    // ✅ 😀更新, 动态渲染，强制更新
    updateChartData() {
      const selectedData = this.allData[this.timeType] || [];

      // **先彻底销毁 ECharts 实例，防止继承 boundaryGap 错误**
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }

      // **重新获取 DOM，并初始化图表**
      const chartDom = document.getElementById(this.chartId);
      if (!chartDom) {
        console.error(`Chart container with id "${this.chartId}" not found.`);
        return;
      }
      this.chart = echarts.init(chartDom);

      // **重新构造正确的 series**
      const series = [
        {
          name: '功率',
          type: this.timeType === 'minute' ? 'line' : 'bar',
          smooth: true,
          data: selectedData.map(item => item.power),
          barWidth: this.timeType === 'minute' ? undefined : '40%', // ✅ 仅 bar 类型时生效
          lineStyle: { color: '#f39c12' },
          showSymbol: false
        }
      ];

      // **修复 minute 模式下的单折线问题（添加辐照度）**
      if (this.timeType === 'minute') {
        series.push({
          name: '辐照度',
          type: 'line',
          smooth: true,
          data: selectedData.map(item => item.radiation),
          lineStyle: { color: '#3498db' },
          showSymbol: false
        });
      }

      // **重新构造正确的 options**
      const options = {
        ...this.baseChartOptions,
        xAxis: {
          ...this.baseChartOptions.xAxis,
          boundaryGap: this.timeType !== 'minute', // ✅ 关键：强制 boundaryGap 仅在 bar 图时生效
          data: selectedData.map(item => item.time)
        },
        series
      };

      // **重新渲染**
      this.chart.setOption(options, true);

      // **确保 Firefox / Edge 适配**
      this.$nextTick(() => {
        this.chart.resize();
      });
    },

    resizeChart() {
      if (this.chart) this.chart.resize();
    }
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart);
    if (this.chart) this.chart.dispose();
  },
  watch: {
    timeType: {
      immediate: true,
      handler(newType) {
        this.updateChartData(); // ✅ 每次切换时强制刷新 boundaryGap
      }
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>
