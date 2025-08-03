<template>
	<div class="info-card" :style="{ backgroundImage: `url(${backgroundImage})` }">
		<div class="info-title">{{ title }}</div>
		<div class="info-content">
			<div v-for="(item, index) in items" :key="index" class="info-item">
				<div class="dot" :style="{ backgroundColor: item.dotColor }"></div>
				<span>{{ item.label }}</span>
				<span :style="{ color: item.valueColor }">
					{{ item.value }}
					<span v-if="item.unit" class="unit">{{ item.unit }}</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "EnergyInfoCard",
		props: {
			title: {
				type: String,
				required: true,
			},
			backgroundImage: {
				type: String,
				required: true,
			},
			items: {
				type: Array,
				required: true,
				default: () => [],
			},
		},
	};
</script>

<style scoped>
	.info-card {
		/*  background-size: cover;
  background-position: center;
  background-repeat: no-repeat; */
		padding: 15px;
		border-radius: 10px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		color: #333;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background-size: 100% 100%;

		height: 100%;
	}

	.info-title {
		font-size: 18px;
		font-weight: bold;
		/* padding-bottom: 25%; */
		/* 这个百分比，是父类的宽度！！ */
		height: 65%;

		/* 底部对齐 */
		display: grid;
		align-items: end;
		justify-items: center;

	}

	.info-content {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 3% 0% 3% 3%;
		margin-left: 5%;

		min-height: 23%;
		/* 兼容三行 */
	}

	.info-item {
		display: flex;
		align-items: center;

		/* font-size: 15px;*/
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		margin-right: 8px;
	}
	
	.unit {
			font-size: 14px;
			color: #19BFFD; /* 单位的颜色，可以根据需要调整 */
			margin-left: 4px; /* 和数值之间的间距 */
		}
</style>