<template>
	<div class="energy-analysis-trend">
		<!-- 标题栏 -->
		<div class="title-container">
			<div class="title">{{ title }}</div>
			<!-- 图表操作按钮 -->
			<div class="action-buttons">
				<el-button type="text" icon="el-icon-refresh" @click="refreshChart"></el-button>
				<el-button type="text" icon="el-icon-download" @click="downloadChart"></el-button>
			</div>
		</div>
		<!-- 横线 -->
		<div class="title-underline">
			<div class="left-line"></div>
			<div class="right-line"></div>
		</div>
		<!-- 图表容器 -->
		<div :id="chartId" class="chart-container"></div>
	</div>
</template>

<script>
	import * as echarts from "echarts";

	export default {
		name: "EnergyAnalysisTrend",
		props: {
			title: {
				type: String,
				default: "用电趋势",
			},
			chartId: {
				type: String,
				required: true,
			},
			todayData: {
				type: Object,
				required: true,
			},
			yesterdayData: {
				type: Object,
				required: true,
			},
		},
		data() {
			return {
				// 图表实例对象，用于管理 ECharts 图表
				chart: null,

				// 图表的基础配置
				baseChartOptions: {

					// 使用 dataZoom 组件，实现数据缩放！
					dataZoom: [
					    {
					        type: "inside", // 内置滚动缩放模式
					        start: 0, // 默认显示数据的起始位置（百分比，0 表示起点）
					        end: 100, // 默认显示数据的结束位置（百分比，20 表示前 20% 的数据）
					        throttle: 100, // 滚轮事件的触发节流时间，单位为毫秒
					    },
					    {
					        type: "slider", // 滑动条模式
					        show: false, // 显示滑动条
					        start: 0, // 同上
					        end: 20, // 同上
					        bottom: "10%", // 滑动条位置
					    },
					],

					// 标题配置
					title: {
						left: "left", // 标题居中对齐
						textStyle: {
							color: "#333333" ,// 标题字体颜色为深灰色
							fontSize: 14, // 标题字体大小设置为14
							 
						}
					},

					// 提示框配置
					tooltip: {
						trigger: "axis", // 鼠标悬浮触发方式：沿轴触发（即 X 或 Y 轴）
						axisPointer: {
							type: "cross", // 指针样式：十字指针
						},
					},

					// 图例配置
					legend: {
						data: ["今日", "昨日"], // 图例显示的系列名称
						icon: "circle", // 将图例图标设置为圆形
						bottom: 0, // 图例定位于图表底部
						top: 5, // 增加图例与图表的上边距
						textStyle: {
							color: "#333333" // 图例文字颜色为深灰色

						},
					},

					// 网格配置，控制图表绘制区域的边距
					grid: {
						left: "5%", // 网格左边距占图表宽度的 5%
						right: "5%", // 网格右边距占图表宽度的 5%
						top: "20%", // 网格顶部边距占图表高度的 20%
						bottom: "15%", // 网格底部边距占图表高度的 15%
					},

					// X 轴配置
					xAxis: {
						type: "category", // 坐标轴类型：类目轴
						boundaryGap: false, // 数据点是否在坐标轴起点和终点之间（折线图常设为 false）
						axisLine: {
							lineStyle: {
								color: "#cccccc" // X 轴线条颜色为浅灰色
							}
						},
						axisLabel: {
							// interval: 0,// 显示每一个点的标签
							interval: 12, // 默认显示每隔 6 个时间点（即 1 小时）
							color: "#333333" // X 轴刻度标签文字颜色为深灰色
					 
						},
					},

					// Y 轴配置
					yAxis: {
						type: "value", // 坐标轴类型：数值轴
						name: "kW", // Y 轴名称
						nameTextStyle: {
							color: "#333333" // Y 轴名称文字颜色为深灰色
						},
						axisLine: {
							lineStyle: {
								color: "#cccccc" // Y 轴线条颜色为浅灰色
							}
						},
						axisLabel: {
							color: "#333333" // Y 轴刻度标签文字颜色为深灰色
						},
						splitLine: {
							lineStyle: {
								color: "rgba(51, 51, 51, 0.1)" // 网格线颜色为透明浅灰色
							},
						},
					},

					// 数据系列配置
					series: [
						// "今日" 数据系列
						{
							name: "今日", // 系列名称
							type: "line", // 系列类型：折线图
							smooth: true, // 折线是否平滑
							data: [], // 数据数组（动态更新）
							lineStyle: {
								color: "#01ADA8", // 折线颜色为绿色
							},
							areaStyle: {
								color: "rgba(0, 255, 255, 0.2)", // 折线下方区域填充颜色为半透明蓝色
							},
							symbol: "circle", // 圆点形状

							itemStyle: {
								color: "#01ADA8", // 鼠标悬浮时圆点颜色为绿色
							},
							showSymbol: true, // 鼠标悬浮时显示圆点

							symbolSize: 1, // 数据点的圆点大小（1 表示极小的圆点，几乎看不到）


							// emplasis : { //高亮不生效
							//     focus : 'series'
							// },
						},

						// "昨日" 数据系列
						{
							name: "昨日", // 系列名称
							type: "line", // 系列类型：折线图
							smooth: true, // 折线是否平滑
							data: [], // 数据数组（动态更新）
							lineStyle: {
								color: "#9b59b6" // 折线颜色为紫色
							},
							areaStyle: {
								color: "rgba(169, 169, 169, 0.2)", // 折线下方区域填充颜色为半透明灰色
							},
							symbol: "circle", // 圆点形状

							// 鼠标悬浮效果配置
							itemStyle: {
								color: "#9b59b6", // 鼠标悬浮时圆点颜色为紫色
							},
							showSymbol: true, // 鼠标悬浮时显示圆点

							symbolSize: 1, // 数据点的圆点大小（1 表示极小的圆点，几乎看不到）
						},
					],
				},

			};
		},

		methods: {
			initChart() {
				const chartDom = document.getElementById(this.chartId);
				if (!chartDom) {
					console.error(`Chart container with id "${this.chartId}" not found.`);
					return;
				}
				this.chart = echarts.init(chartDom);
				this.updateChartData();
				window.addEventListener("resize", this.resizeChart);
			},
			updateChartData() {
				const options = {
					...this.baseChartOptions,
					xAxis: {
						...this.baseChartOptions.xAxis,
						data: this.todayData.time,

					},
					series: [{
							...this.baseChartOptions.series[0],
							data: this.todayData.values,
						},
						{
							...this.baseChartOptions.series[1],
							data: this.yesterdayData.values,
						},
					],
				};

				// 添加调试日志
				//    console.log("Legend Data:", this.baseChartOptions.legend.data);
				//    console.log("Series Names:", this.baseChartOptions.series.map((s) => s.name));
				//    console.log("今日数据:", this.todayData.values);
				//    console.log("昨日数据:", this.yesterdayData.values);

				if (this.chart) {
					this.chart.clear();
					this.chart.setOption(options, true);
				}
			},
			refreshChart() {
				this.updateChartData();
			},
			downloadChart() {
				if (this.chart) {
					const img = this.chart.getDataURL({
						type: "png"
					});
					const link = document.createElement("a");
					link.href = img;
					link.download = `${this.title}.png`;
					link.click();
				}
			},
			resizeChart() {
				if (this.chart) {
					this.chart.resize();
				}
			},
		},
		mounted() {
			this.initChart();
		},
		beforeDestroy() {
			window.removeEventListener("resize", this.resizeChart);
			if (this.chart) {
				this.chart.dispose();
			}
		},
		watch: {
			todayData: {
				deep: true,
				handler() {
					this.updateChartData();
				},
			},
			yesterdayData: {
				deep: true,
				handler() {
					this.updateChartData();
				},
			},
		},
	};
</script>

<style scoped>
	.energy-analysis-trend {
		width: 100%;
		height: 103%;
		/* background-color: #f7f9fc; */
		border-radius: 10px;
		padding: 10px;
		display: flex;
		flex-direction: column;
	}

	.title-container {
		display: flex;
		justify-content: space-between;
		align-items: left;
		height: 30px;
		margin-bottom: 5px;
	}

	.title {
		font-size: 14px;
		color: #333333;
		font-weight: bold;
	}

	.action-buttons {
		display: flex;
		gap: 10px;
	}

	.title-underline {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.left-line {
		height: 2px;
		width: 60px;
		background: #3498db;
		margin-right: 5px;
	}

	.right-line {
		flex: 1;
		height: 2px;
		background: #e0e0e0;
	}

	.chart-container {
		flex-grow: 1;
		width: 100%;
		height: calc(100% - 60px);
		margin: 0 auto;
	}
</style>