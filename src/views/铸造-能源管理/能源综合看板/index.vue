<template>
	<div class="container">


		<!-- 第一行：2列布局 -->
		<div class="flexRow">
			<!-- 一列：企业信息卡片 -->
			<div class="flexBox">

				<el-card class="box-card" :style="{ '--card-header-bg': theme }">

					<div slot="header" class="clearfix">
						<span>企业信息</span>
						<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
					</div>
					<div class="cardbody" style="height: 100%;">
						<!-- 企业信息部分 -->
						<div class="left_top_coInfo">
							<ul>
								<li>
									<span>企业：</span>
                  <el-input v-model="selectedCompany" placeholder="请选择企业" style="width: 240px;" />
								</li>
								<li>
									<span>信用编码：455294915206579394 </span>
									<span></span>
								</li>
								<li>
									<span>地址：山东济南历下区</span>
									<span></span>
								</li>
							</ul>
						</div>
						<!-- 圆圈部分 -->
						<div class="left_top_info">
							<!-- 第一行 -->
							<div class="double_div" style=" padding-left: 23%;">
								<p style=" padding: 0px;">
									<span style="color: #19BFFD;" class="span24">2</span>
								</p>
								<span>厂房</span>
							</div>
							<div class="double_div" style=" padding-right: 23%;">
								<p>
									<span>3</span>
									<span style="color: #19BFFD;">(</span>
									<span style="color: #F9BA4B;">2</span>
									<span style="color: #19BFFD;">)</span>
								</p>
								<span>网关</span>
							</div>

							<!-- 第二行 -->
							<div class="single_div" style="  padding-left: 50px;">
								<p>
									<span>84</span>
									<span style="color: #19BFFD;">(</span>
									<span style="color: #F9BA4B;">45</span>
									<span style="color: #19BFFD;">)</span>
								</p>
								<span>监测点</span>
							</div>
							<div class="single_div">
								<p>
									<span>0</span>
									<span style="color: #19BFFD;">(</span>
									<span style="color: #F9BA4B;">0</span>
									<span style="color: #19BFFD;">)</span>
								</p>
								<span>逆变器</span>
							</div>
							<div class="single_div" style="  padding-right: 50px;">
								<p>
									<span>0</span>
									<span style="color: #19BFFD;">(</span>
									<span style="color: #F9BA4B;">0</span>
									<span style="color: #19BFFD;">)</span>
								</p>
								<span>摄像头</span>
							</div>
						</div>
					</div>
				</el-card>
			</div>

			<!-- 二列 -->
			<div class="flexBox2">
				<el-card class="box-card" :style="{ '--card-header-bg': theme }">
					<div slot="header" class="card-header clearfix">
						<span>企业用能信息</span>
						<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
					</div>

					<div class="flexRowCard">

            <div class="flexBox">
              <!-- 光伏 -->
              <EnergyInfoCard title="燃气" :backgroundImage="require('@/assets/images/ems-sycn.png')"
                              :items="[
							          { label: '当日用量：', value: '122', unit: 'm³', dotColor: '#19BFFD', valueColor: '#19BFFD' },
							          { label: '当月用量：', value: '1123',  unit: 'm³',dotColor: '#19BFFD', valueColor: '#19BFFD' },

							        ]" />
            </div>

						<div class="flexBox">
							<!-- 光伏 -->
							<EnergyInfoCard title="用电" :backgroundImage="require('@/assets/images/ems-sygf.png')"
								:items="[
							          { label: '当日用量：', value: '322', unit: 'kW·h',dotColor: '#19BFFD', valueColor: '#19BFFD' },
							          { label: '当月用量：', value: '3122', unit: 'kW·h',dotColor: '#19BFFD', valueColor: '#19BFFD' },
							        ]" />
						</div>

						<div class="flexBox">
							<!-- 光伏 -->
							<EnergyInfoCard title="用水" :backgroundImage="require('@/assets/images/ems-synh.png')"
								:items="[
							          { label: '当日用量：', value: '100', unit: 'm³',dotColor: '#19BFFD', valueColor: '#19BFFD' },
							          { label: ' 当月用量：', value: '2000', unit: 'm³',dotColor: '#19BFFD', valueColor: '#19BFFD' },
							        ]" />
						</div>
						<div class="flexBox">
							<!-- 光伏 -->
							<EnergyInfoCard title="社会效益" :backgroundImage="require('@/assets/images/ems-syshxy.png')"
								:items="[
							          { label: '标准煤：', value: '0.00',unit: 'kg', dotColor: '#19BFFD', valueColor: '#19BFFD' },
							          { label: '减排量：', value: '0', unit: 'kg',dotColor: '#19BFFD', valueColor: '#19BFFD' },
							        ]" />
						</div>
<!--						<div class="flexBox">-->
<!--							&lt;!&ndash; 光伏 &ndash;&gt;-->
<!--							<EnergyInfoCard title="经济收益" :backgroundImage="require('@/assets/images/ems-syjjxy.png')"-->
<!--								:items="[-->
<!--							          { label: '光伏收益：', value: '0.00',unit: '(元)', dotColor: '#19BFFD', valueColor: '#19BFFD' },-->
<!--							          { label: '储能收益：', value: '0', unit: '(元)', dotColor: '#19BFFD', valueColor: '#19BFFD' },-->
<!--							          { label: '充电桩收益：', value: '0', unit: '(元)',dotColor: '#19BFFD', valueColor: '#19BFFD' },-->
<!--							        ]" />-->
<!--						</div>-->

					</div>

				</el-card>
			</div>
		</div>


		<!-- 第二行：3列布局 -->
		<div class="flexRow">
			<!-- 第一列：用电趋势 -->
			<div class="flexBox">
				<el-card class="box-card" :style="{ '--card-header-bg': theme }">
					<div slot="header" class="card-header clearfix">
						<span>用电趋势图</span>
						<el-button style="float: right; padding: 3px 0" type="text" @click="updateDl">操作按钮</el-button>
					</div>
					<!-- 模拟更新数据 -->
					<EnergyAnalysisTrend :title="'趋势图'" :chart-id="'energy-trend-chart'" :today-data="todayData"
						:yesterday-data="yesterdayData"  style="padding: 0px"/>

				</el-card>
			</div>

			<!-- 第二列 储能放电趋势-->
			<div class="flexBox">
				<el-card class="box-card" :style="{ '--card-header-bg': theme }">
					<div slot="header" class="card-header clearfix">
						<span>用水趋势图</span>
						<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
					</div>

					<!-- 模拟更新数据 -->
					<EnergyAnalysisTrend :title="'趋势图'" :chart-id="'energy-trend-chart1'" :today-data="todayData"
						:yesterday-data="yesterdayData" />


				</el-card>
			</div>

			<!-- 第san列 -->
			<div class="flexBox">
				<el-card class="box-card" :style="{ '--card-header-bg': theme }">
					<div slot="header" class="card-header clearfix">
						<span>天然气趋势图</span>
						<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
					</div>
					<!-- <button @click="updateDl">更新发电量</button> -->

					<!-- 模拟更新数据 -->
					<EnergyAnalysisTrend :title="'趋势图'" :chart-id="'energy-trend-chart2'" :today-data="todayData"
						:yesterday-data="yesterdayData" />
				</el-card>
			</div>
		</div>



	</div>
</template>

<script>
	import EnergyInfoCard from "@/views/componentsEms/EnergyInfoCard.vue";
 	import EnergyAnalysisTrend from "@/views/echarts/EnergyAnalysisTrend.vue";
	import {
		mapState
	} from "vuex";

	export default {
		name: "CardExample",
		components: {
			EnergyInfoCard,
 			EnergyAnalysisTrend,
		},
		computed: {
			...mapState({
				theme: (state) => state.settings.theme, // 从 Vuex 状态获取 theme
			}),
		},
		data() {
			return {
				dl: '10.00', // 动态绑定的变量，初始值为 '0.00'

        selectedCompany: "山东中煤电器有限公司", // 这里填写默认值

				/////////////////////////////////图表变量2//////////////////////////////////////

				todayData: {
					// time: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00"],
					// values: [300, 320, 310, 305, 300, 295, 310],
				},
				yesterdayData: {
					// time: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00"],
					// values: [280, 290, 295, 300],
				},


			};
		},
		create() {
			 // this.handleButtonClick();

		},
		//元素加载完毕
		mounted() {
			setTimeout(() => {
				this.handleButtonClick();
			}, 500); // 延迟 2 秒
		},
		methods: {
			updateDl() {
				// 更新发电量数据
				this.dl = '50.00'; // 修改为新值
				this.handleButtonClick();
			},
			// 刷新，今日昨日的趋势图
			handleButtonClick() {

				let today = this.generateRandomData(100, 0,600);
				let yesterday = this.generateRandomData(144, 0,600);


				// 动态生成 `dayData`
				this.todayData = {
					time: [
						"00:00", "00:10", "00:20", "00:30", "00:40", "00:50",
						"01:00", "01:10", "01:20", "01:30", "01:40", "01:50",
						"02:00", "02:10", "02:20", "02:30", "02:40", "02:50",
						"03:00", "03:10", "03:20", "03:30", "03:40", "03:50",
						"04:00", "04:10", "04:20", "04:30", "04:40", "04:50",
						"05:00", "05:10", "05:20", "05:30", "05:40", "05:50",
						"06:00", "06:10", "06:20", "06:30", "06:40", "06:50",
						"07:00", "07:10", "07:20", "07:30", "07:40", "07:50",
						"08:00", "08:10", "08:20", "08:30", "08:40", "08:50",
						"09:00", "09:10", "09:20", "09:30", "09:40", "09:50",
						"10:00", "10:10", "10:20", "10:30", "10:40", "10:50",
						"11:00", "11:10", "11:20", "11:30", "11:40", "11:50",
						"12:00", "12:10", "12:20", "12:30", "12:40", "12:50",
						"13:00", "13:10", "13:20", "13:30", "13:40", "13:50",
						"14:00", "14:10", "14:20", "14:30", "14:40", "14:50",
						"15:00", "15:10", "15:20", "15:30", "15:40", "15:50",
						"16:00", "16:10", "16:20", "16:30", "16:40", "16:50",
						"17:00", "17:10", "17:20", "17:30", "17:40", "17:50",
						"18:00", "18:10", "18:20", "18:30", "18:40", "18:50",
						"19:00", "19:10", "19:20", "19:30", "19:40", "19:50",
						"20:00", "20:10", "20:20", "20:30", "20:40", "20:50",
						"21:00", "21:10", "21:20", "21:30", "21:40", "21:50",
						"22:00", "22:10", "22:20", "22:30", "22:40", "22:50",
						"23:00", "23:10", "23:20", "23:30", "23:40", "23:50"
					],


					values: today,
				};

				// 动态生成 `monthData`
				this.yesterdayData = {
					time: [
						"00:00", "00:10", "00:20", "00:30", "00:40", "00:50",
						"01:00", "01:10", "01:20", "01:30", "01:40", "01:50",
						"02:00", "02:10", "02:20", "02:30", "02:40", "02:50",
						"03:00", "03:10", "03:20", "03:30", "03:40", "03:50",
						"04:00", "04:10", "04:20", "04:30", "04:40", "04:50",
						"05:00", "05:10", "05:20", "05:30", "05:40", "05:50",
						"06:00", "06:10", "06:20", "06:30", "06:40", "06:50",
						"07:00", "07:10", "07:20", "07:30", "07:40", "07:50",
						"08:00", "08:10", "08:20", "08:30", "08:40", "08:50",
						"09:00", "09:10", "09:20", "09:30", "09:40", "09:50",
						"10:00", "10:10", "10:20", "10:30", "10:40", "10:50",
						"11:00", "11:10", "11:20", "11:30", "11:40", "11:50",
						"12:00", "12:10", "12:20", "12:30", "12:40", "12:50",
						"13:00", "13:10", "13:20", "13:30", "13:40", "13:50",
						"14:00", "14:10", "14:20", "14:30", "14:40", "14:50",
						"15:00", "15:10", "15:20", "15:30", "15:40", "15:50",
						"16:00", "16:10", "16:20", "16:30", "16:40", "16:50",
						"17:00", "17:10", "17:20", "17:30", "17:40", "17:50",
						"18:00", "18:10", "18:20", "18:30", "18:40", "18:50",
						"19:00", "19:10", "19:20", "19:30", "19:40", "19:50",
						"20:00", "20:10", "20:20", "20:30", "20:40", "20:50",
						"21:00", "21:10", "21:20", "21:30", "21:40", "21:50",
						"22:00", "22:10", "22:20", "22:30", "22:40", "22:50",
						"23:00", "23:10", "23:20", "23:30", "23:40", "23:50"
					],
					values: yesterday,
				};

			console.log("今日数据对象:", JSON.stringify(this.todayData, null, 2));
			console.log("昨日数据对象:", JSON.stringify(this.yesterdayData, null, 2));

			console.log("今日时间点:", this.todayData.time.length);
			console.log("今日数值点:", this.todayData.values.length);


			console.log("昨日时间点:", this.yesterdayData.time.length);
			console.log("昨日数值点:", this.yesterdayData.values.length);


			},



			/////////////////////////////////图表相关方法//////////////////////////////////////

      // 生成随机数据
      generateRandomData(length, minValue, maxValue) {
        return Array.from({ length }, () =>
          Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
        )
      },


		},
	};
</script>

<style scoped>
	.flexBox {
		background-size: 100% 100%;
	}

	.info-card {
		/* background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		padding: 15px;
		border-radius: 10px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		color: #333;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background-size: 100% 100%; */
		height: 100%;
	}

	/* *****************************************************************新增：盒子模型***************************************************************** */


	/* 设置页面布局 */
		.container {
		display: flex;
		flex-direction: column;

		padding: 10px;
		margin: 10px;
		/* height: 100%; */
		height: calc(100vh - 130px);
		overflow: hidden;

	}

	/* 盒子容器 */
	.flexRow {
		display: flex;
		/* 水平排列每一行的子元素 */
		gap: 10px;
		/* 每个子元素之间的间距 */
		flex: 1;
		/* 垂直的时候使用 */
		margin-bottom: 15px;
		/* height: 41.5vh; */
		height: 49%;
	}

	/* 企业用能信息 卡片盒子容器 */
	.flexRowCard {
		display: flex;
		/* 水平排列每一行的子元素 */
		gap: 50px;
		/* 每个子元素之间的间距 */
		flex: 1;
		/* 垂直的时候使用 */
		margin-bottom: 15px;
		/* height: 41.5vh; */
		height: 97%;

    padding-left: 20px;
    padding-right: 20px;
	}


	/* 盒子 */
	.flexBox {
		flex: 1;
		/* 定义弹性子元素在父容器中的 空间分配规则 ，让所有子元素等宽分布 */
		/* padding: 5px; */
		/* 去调不然均分有点差异 */
		/* border: 1px solid #ccc; */
		/* 边框 */
		text-align: center;
		/* 内容居中 */
		font-size: 14px;
	}

	/* 盒子 */
	.flexBox2 {
		flex: 2;
		/* 定义弹性子元素在父容器中的 空间分配规则 ，让所有子元素等宽分布 */
		/* padding: 5px; */
		/* border: 1px solid #ccc; */
		/* 边框 */
		text-align: center;
		/* 内容居中 */
		font-size: 14px;
	}





	/* ***************************************************************** 卡片 ***************************************************************** */

	/* 使用 CSS 变量动态设置背景颜色 */
	>>>.el-card {
		height: 100%;
		flex: 1;
		/* 卡片高度自动填充父容器 */
		overflow: hidden;
		/* 防止卡片内容撑开 */
		/* 圆角 */
	}

	>>>.el-card__header {
		/* 默认颜色为淡蓝色 */
		background-color: var(--card-header-bg, theme);


		/* 圆角 */
		border-radius: 4px 4px 0 0;

    color: #ffffff; /* 白色字体 */
    padding: 10px; /* 内边距 */
    //border-radius: 4px 4px 0 0;
    padding-left: 20px;
    font-size: 14px;

		padding-left: 20px;
    letter-spacing: 2px;
    min-height: 35px;
	}

	>>>.el-card__body {
		padding: 20px;
		/* height: 55%; */
		height: 90%;
	}

	.clearfix {
		/* 标题：文本左对齐 */
		text-align: left;

		/* 标题：字体大小 */
		font-size: 16px;

		/* 标题：字体加粗 */
		font-weight: bold;



	}

	/* *****************************************************************企业信息样式 ***************************************************************** */

	/* 企业信息样式 */
	.left_top_coInfo {

		background-image: url('~@/assets/images/bglistsy.png');
		/* 背景图片 */
		background-size: cover;
		/* 填充背景 */
		background-repeat: no-repeat;
		/* 不重复 */
		background-position: center;
		/* 设置背景图片长宽 */
		background-size: 100% 80%;
		/* 居中显示 */
		padding: 1px 10px 10px 30px;


	}


	.left_top_coInfo ul {

		list-style: none;
		/* 空心圆 */
		/* list-style-type: disc; */
		padding: 0;
    margin-top: -5px;

	}

	.left_top_coInfo li {
		margin-bottom: 10px;
		display: flex;
		align-items: center;
	}

	.left_top_coInfo span {
		font-size: 16px;
		margin-right: 10px;
	}


	/* 5个圈 */
	.left_top_info {
		display: flex;
		flex-wrap: wrap;
		/* 自动换行 */
		justify-content: space-between;
		/* 均匀分布 */

		background-image: url('~@/assets/images/bgyuan5.png');
		/* 背景图片 */
		background-size: cover;
		/* 填充背景 */
		background-repeat: no-repeat;
		/* 不重复 */
		background-position: center;
		/* 居中显示 */
		background-size: 80% 100%;

		padding: 20px 10px 20px 10px;

		//height: 55%;

	}

	/* 直接作用于 .left_top_info 内部所有的 <p> 标签。 */
	.left_top_info p {
		padding: 0px;
		margin: 5px 5px 5px 5px;
		font-size: 24px;
	}

	.span24 {
		font-size: 24px;
		color: rgb(25, 191, 253);
	}

	.double_div {
		flex: 0 0 48%;
		/* 占据父容器的48%宽度，确保两列布局 */
		text-align: center;
		margin-bottom: 10px;
	}

	.single_div {
		flex: 0 0 30%;
		/* 占据父容器的30%宽度，确保三列布局 */
		text-align: center;
		/* margin-bottom: 10px; */
		margin-top: 10px;
	}




	/* ***************************************************************** ***************************************************************** */
</style>
