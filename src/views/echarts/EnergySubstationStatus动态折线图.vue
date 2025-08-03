<!--EnergySubstationStatus动态折线图.VUE-->
<template>
  <!-- 图表容器 -->
  <div :id="chartId" class="chart-container"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "EnergySubstationStatus",
  props: {
    chartId: {
      type: String,
      required: true,
    },
    dynamicSeries: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: "动态折线图", // 默认标题
    },
  },
  data() {
    return {
      chart: null,
      baseChartOptions: {
        title: {
          text: "", // 标题内容将由 props 动态传入
          left: "center", // 标题位置
          textStyle: {
            color: "#008acd",
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: [],
          icon: "circle",
          bottom: 0,
          textStyle: {
            color: "#008acd",
          },
        },
        grid: {
          left: "5%",
          right: "5%",
          top: "20%",
          bottom: "15%",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#008acd",
            },
          },
          axisLabel: {
            color: "#008acd",
          },
        },
        yAxis: {
          type: "value",
          name: "kW",
          nameTextStyle: {
            color: "#008acd",
          },
          axisLine: {
            lineStyle: {
              color: "#008acd",
            },
          },
          axisLabel: {
            color: "#008acd",
          },
          splitLine: {
            lineStyle: {
              color: "rgba(51, 51, 51, 0.2)",
            },
          },
        },
        series: [],
      },
    };
  },
  methods: {
    initChart() {
      // console.log("【调试信息】初始化图表...");
      const chartDom = document.getElementById(this.chartId);
      if (!chartDom) {
        console.error(`【错误信息】未找到图表容器 id="${this.chartId}"`);
        return;
      }
      this.chart = echarts.init(chartDom);
      // console.log("【调试信息】图表初始化完成，调用 updateChartData...");
      this.updateChartData();
      window.addEventListener("resize", this.resizeChart);
    },
    updateChartData() {
      // console.log("【调试信息】更新、图表数据...");
      // console.log("【调试信息】动态传入的数据 dynamicSeries:", this.dynamicSeries);

      if (!this.dynamicSeries || this.dynamicSeries.length === 0) {
        console.warn("【警告信息】dynamicSeries 为空，无法更新图表数据");
        return;
      }

      const seriesData = this.dynamicSeries.map((item) => ({
        name: item.name,
        type: "line",
        smooth: true,
        data: item.values,
        showSymbol: false,
      }));

      const legendData = this.dynamicSeries.map((item) => item.name);

      const xAxisData = this.dynamicSeries[0]?.time || [];
      // console.log("【调试信息】xAxisData (横轴数据):", xAxisData);
      // console.log("【调试信息】legendData (图例数据):", legendData);
      // console.log("【调试信息】seriesData (序列数据):", seriesData);

      const options = {
        ...this.baseChartOptions,
        title: {
          ...this.baseChartOptions.title,
          text: this.title, // 动态设置标题
        },
        xAxis: {
          ...this.baseChartOptions.xAxis,
          data: xAxisData,
        },
        legend: {
          ...this.baseChartOptions.legend,
          data: legendData,
        },
        series: seriesData,
      };

      if (this.chart) {
        this.chart.clear();
        this.chart.setOption(options, true);
        // console.log("【调试信息】图表数据已更新");
      }
    },
    resizeChart() {
      if (this.chart) {
        // console.log("【调试信息】调整图表尺寸...");
        this.chart.resize();
      }
    },
  },
  mounted() {
    // console.log("【调试信息】子组件接收到的 dynamicSeries 数据:", this.dynamicSeries);
    this.initChart();
  },
  beforeDestroy() {
    // console.log("【调试信息】组件 beforeDestroy，清理事件和图表实例...");
    window.removeEventListener("resize", this.resizeChart);
    if (this.chart) {
      this.chart.dispose();
    }
  },
  watch: {
    dynamicSeries: {
      deep: true,
      handler(newVal) {
        // console.log("【调试信息】dynamicSeries 发生变化，新数据:", newVal);
        this.updateChartData();
      },
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>
