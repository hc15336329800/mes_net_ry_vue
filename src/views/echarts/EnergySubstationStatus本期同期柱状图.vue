<template>
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
    currentData: {
      type: Array,
      required: true,
    },
    previousData: {
      type: Array,
      required: true,
    },
    // title: {
    //   type: String,
    //   default: "能源变电站柱状图",
    // },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById(this.chartId);

      if (!chartDom || chartDom.offsetWidth === 0 || chartDom.offsetHeight === 0) {
        console.error("图表容器未正确初始化，请检查容器宽高！");
        return;
      }

      this.chart = echarts.init(chartDom);

      const options = {
        title: {
          text: this.title,
          left: "center",
          textStyle: {
            color: "#01ADA8",
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["本期", "同期"],
          bottom: 0,
          textStyle: {
            color: "#01ADA8",
          },
          icon: "circle", // 统一图例图标为圆形

        },
        grid: {
          left: "5%",
          right: "5%",
          top: "20%",
          bottom: "15%",
        },
        xAxis: {
          type: "category",
          data: ["01月", "02月", "03月", "04月", "05月", "06月", "07月", "08月", "09月", "10月", "11月", "12月"],
          axisLine: {
            lineStyle: {
              color: "#01ADA8",
            },
          },
          axisLabel: {
            color: "#01ADA8",
          },
        },
        yAxis: {
          type: "value",
          name: "kW",
          nameTextStyle: {
            color: "#01ADA8",
          },
          axisLine: {
            lineStyle: {
              color: "#01ADA8",
            },
          },
          axisLabel: {
            color: "#01ADA8",
          },
          splitLine: {
            lineStyle: {
              color: "rgba(51, 51, 51, 0.2)",
            },
          },
        },
        series: [
          {
            name: "本期",
            type: "bar",
            data: this.currentData,
            barWidth: "30%",
            itemStyle: {
              color: "#01ADA8",
            },
          },
          {
            name: "同期",
            type: "bar",
            data: this.previousData,
            barWidth: "30%",
            itemStyle: {
              color: "#b6a2de",
            },
          },
        ],
      };

      this.chart.setOption(options);
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
