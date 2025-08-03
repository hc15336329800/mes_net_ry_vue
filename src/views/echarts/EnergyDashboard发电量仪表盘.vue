<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center;">
    <!-- 图表容器 -->
    <div ref="gaugeChart" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "GaugeChart",
  props: {
    value: {
      type: Number,
      default: 50, // 默认值
    },
    name: {
      type: String,
      default: "SCORE", // 仪表盘中心的名称
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.gaugeChart;
      this.chart = echarts.init(chartDom);

      const option = {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
          {
            name: "仪表盘",
            type: "gauge",
            progress: {
              show: true,
              color: "#01ADA8", // 绿色进度条
            },
            title: {
              show: true,
              offsetCenter: [0, "100%"], // 确保标题在底部
              fontSize: 14,
              color: "#666666",
            },
            detail: {
              valueAnimation: true,
              formatter: "{value}",
              fontSize: 20,
              offsetCenter: [0, "73%"], // 数值放置位置
              color: "#666666",
            },
            axisLine: {
              lineStyle: {
                width: 10,
                color: [
                  [1, "#01ADA8"], // 统一绿色
                ],
              },
            },
            axisTick: {
              show: true,
              length: 6,
              lineStyle: {
                color: "#666666",
              },
            },
            axisLabel: { // 调整刻度位置
              distance: 15, // 让刻度更靠内
              color: "#666666",
              fontSize: 12,
              // formatter: function (value) {
              //   if (value === 0) return "0";
              //   if (value === 20.2) return "20.6";
              //   if (value === 40.4) return "40.4";
              //   if (value === 60) return "60";
              //   if (value === 80) return "80";
              //   if (value === 100) return "100";
              //   return ""; // 其他刻度隐藏
              // },
            },
            min: 0, // 仪表盘最小值
            max: 100, // 仪表盘最大值
            splitNumber: 5, // 控制刻度数量
            data: [
              {
                value: this.value,
                name: this.name,
              },
            ],
          },
        ],
      };

      this.chart.setOption(option);
      window.addEventListener("resize", this.chart.resize);
    },
    destroyChart() {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    },
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    this.destroyChart();
    window.removeEventListener("resize", this.chart.resize);
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        if (this.chart) {
          this.chart.setOption({
            series: [
              {
                data: [
                  {
                    value: newValue,
                    name: this.name,
                  },
                ],
              },
            ],
          });
        }
      },
    },
  },
};
</script>

<style scoped>
/* 样式可根据需求调整 */
</style>
