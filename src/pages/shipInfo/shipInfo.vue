<template>
	<div>
		<div class="section-wrapper"></div>
		<div class="section-innner">
			<div class="notice-wrapper">
				<span class="img"></span>国家税务总局：一季度发放“银税互动”贷款75万笔，超2019年的一半，越来越多的小微企业从中受益。
			</div>
			<div class="dynamic">
				<div class="title-wrapper">
					<div class="left">
						<span class="title">船舶动态</span>
						<span class="time">2020年5月14日 星期一</span>
					</div>
				</div>
				<div class="dynamic-list-wrapper">
					<div class="dynamic-list">
						<div class="dynamic-item">
							<div class="top">
								<div class="name">泰坦尼克10001号</div>
								<div class="level-risk">
									<my-rate :score="3" disabled />
									<span class="risk">一般风险</span>
								</div>
							</div>
							<div class="body">
								<div class="dynamic-info">
									<span class="label">预计到港时间</span>
									<span class="val">05-20 12:00</span>
								</div>
								<div class="dynamic-info">
									<span class="label">作业货品</span>
									<span class="val">92#汽油</span>
								</div>
								<div class="dynamic-info">
									<span class="label">所属企业</span>
									<span class="val">江苏南通如皋货运有限公司</span>
								</div>
							</div>
						</div>
						<div class="dynamic-item">
							<div class="top">
								<div class="name">泰坦尼克10001号</div>
								<div class="level-risk">
									<my-rate :score="3" disabled />
									<span class="risk">一般风险</span>
								</div>
							</div>
							<div class="body">
								<div class="dynamic-info">
									<span class="label">预计到港时间</span>
									<span class="val">05-20 12:00</span>
								</div>
								<div class="dynamic-info">
									<span class="label">作业货品</span>
									<span class="val">92#汽油</span>
								</div>
								<div class="dynamic-info">
									<span class="label">所属企业</span>
									<span class="val">江苏南通如皋货运有限公司</span>
								</div>
							</div>
						</div>
						<div class="dynamic-item">
							<div class="top">
								<div class="name">泰坦尼克10001号</div>
								<div class="level-risk">
									<my-rate :score="4" disabled />
									<span class="risk">一般风险</span>
								</div>
							</div>
							<div class="body">
								<div class="dynamic-info">
									<span class="label">预计到港时间</span>
									<span class="val">05-20 12:00</span>
								</div>
								<div class="dynamic-info">
									<span class="label">作业货品</span>
									<span class="val">92#汽油</span>
								</div>
								<div class="dynamic-info">
									<span class="label">所属企业</span>
									<span class="val">江苏南通如皋货运有限公司</span>
								</div>
							</div>
						</div>
						<div class="dynamic-item">
							<div class="top">
								<div class="name">泰坦尼克10001号</div>
								<div class="level-risk">
									<my-rate :score="5" disabled />
									<span class="risk">一般风险</span>
								</div>
							</div>
							<div class="body">
								<div class="dynamic-info">
									<span class="label">预计到港时间</span>
									<span class="val">05-20 12:00</span>
								</div>
								<div class="dynamic-info">
									<span class="label">作业货品</span>
									<span class="val">92#汽油</span>
								</div>
								<div class="dynamic-info">
									<span class="label">所属企业</span>
									<span class="val">江苏南通如皋货运有限公司</span>
								</div>
							</div>
						</div>
						<div class="dynamic-item">
							<div class="top">
								<div class="name">泰坦尼克10001号</div>
								<div class="level-risk">
									<my-rate :score="3" disabled />
									<span class="risk">一般风险</span>
								</div>
							</div>
							<div class="body">
								<div class="dynamic-info">
									<span class="label">预计到港时间</span>
									<span class="val">05-20 12:00</span>
								</div>
								<div class="dynamic-info">
									<span class="label">作业货品</span>
									<span class="val">92#汽油</span>
								</div>
								<div class="dynamic-info">
									<span class="label">所属企业</span>
									<span class="val">江苏南通如皋货运有限公司</span>
								</div>
							</div>
						</div>
						<div class="dynamic-item">
							<div class="top">
								<div class="name">泰坦尼克10001号</div>
								<div class="level-risk">
									<my-rate :score="3" disabled />
									<span class="risk">一般风险</span>
								</div>
							</div>
							<div class="body">
								<div class="dynamic-info">
									<span class="label">预计到港时间</span>
									<span class="val">05-20 12:00</span>
								</div>
								<div class="dynamic-info">
									<span class="label">作业货品</span>
									<span class="val">92#汽油</span>
								</div>
								<div class="dynamic-info">
									<span class="label">所属企业</span>
									<span class="val">江苏南通如皋货运有限公司</span>
								</div>
							</div>
						</div>
					</div>
					<el-pagination background small layout="prev, pager, next" :page-size="6" :total="10"></el-pagination>
				</div>
			</div>
			<div class="section-bottom">
				<div class="todo-wrapper">
					<div class="tab-wrapper">
						<ul class="tab-list">
							<li
								v-for="(item, index) in tabList"
								:key="index"
								:class="[{ active: nowIndex === index }, 'tab-item']"
								@click="selectTab(item, index)"
							>{{ item.label }}({{ item.num }})</li>
						</ul>
					</div>
					<div class="tab-content">
						<ul class="todo-list">
							<li class="todo-item">
								<p class="top">
									<span class="todo-type">会议安排</span>
									<span class="todo-name">业仓储业务系统培训：业务系统功能介绍</span>
								</p>
								<div class="body">
									<div class="left">
										<img src="../../assets/images/user.png" />
										<div class="info">
											<p>张小咪</p>
											<p>发起于 04-21 12:00</p>
										</div>
									</div>
									<div class="right">
										<p>告知</p>
										<p>更新于 04-21 12:00</p>
									</div>
								</div>
							</li>
							<li class="todo-item">
								<p class="top">
									<span class="todo-type">会议安排</span>
									<span class="todo-name">业仓储业务系统培训：业务系统功能介绍</span>
								</p>
								<div class="body">
									<div class="left">
										<img src="../../assets/images/user.png" />
										<div class="info">
											<p>张小咪</p>
											<p>发起于 04-21 12:00</p>
										</div>
									</div>
									<div class="right">
										<p>告知</p>
										<p>更新于 04-21 12:00</p>
									</div>
								</div>
							</li>
							<li class="todo-item">
								<p class="top">
									<span class="todo-type">会议安排</span>
									<span class="todo-name">业仓储业务系统培训：业务系统功能介绍</span>
								</p>
								<div class="body">
									<div class="left">
										<img src="../../assets/images/user.png" />
										<div class="info">
											<p>张小咪</p>
											<p>发起于 04-21 12:00</p>
										</div>
									</div>
									<div class="right">
										<p>告知</p>
										<p>更新于 04-21 12:00</p>
									</div>
								</div>
							</li>
						</ul>
						<el-pagination background small layout="prev, pager, next" :page-size="3" :total="10"></el-pagination>
					</div>
				</div>
				<div class="echart-wrapper">
					<pie-echart></pie-echart>
					<div class="ship-total">
						<p>船舶总数 (艘)</p>
						<p>1,430</p>
					</div>
					<ul class="echart-list">
						<li class="echart-item" v-for="(item, index) in echartLists" :key="index">
							<span class="label">
								<i class="dot" :style="{ backgroundColor: colors[index] }"></i>
								{{ item.label }}
							</span>
							{{ item.rate }}, {{ item.value }}
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import MyRate from '@/components/Rate';
import PieEchart from '@/components/PieEchart';

export default {
  components: { MyRate, PieEchart },
  data() {
    return {
      tabList: [
        {
          label: '待办工作',
          num: 31
        },
        {
          label: '最近处理',
          num: 41
        },
        {
          label: '我发起的',
          num: 162
        }
      ],
      colors: ['#64D5A9', '#5B8FF9', '#647697', '#F6C238', '#E97059'],
      echartLists: [
        {
          label: '最低风险',
          rate: '20%',
          value: 123
        },
        {
          label: '四星风险',
          rate: '35%',
          value: 299
        },
        {
          label: '三星风险',
          rate: '42%',
          value: 427
        },
        {
          label: '二星风险',
          rate: '21%',
          value: 108
        },
        { label: '最高风险', rate: '5%', value: 12 }
      ],
      nowIndex: 0
    };
  },
  methods: {
    selectTab(item, index) {
      this.nowIndex = index;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
$colorBlue: #1b85ff;
.section-wrapper {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: url('../../assets/images/index-bg.png') no-repeat center top;
	background-size: cover;
	overflow: hidden;
}
.section-innner {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	padding: 10px;
	overflow-y: auto;
	overflow-x: hidden;
}
.notice-wrapper {
	width: 1280px;
	height: 46px;
	line-height: 46px;
	margin: 0 auto 10px;
	font-size: 14px;
	color: #333;
	padding-left: 10px;
	background: #fff;
	display: flex;
	align-items: center;
	.img {
		width: 80px;
		height: 18px;
		background: url('../../assets/images/notice-bg.png') no-repeat left top;
		background-size: 100%;
		margin-right: 10px;
	}
}
.dynamic {
	width: 1280px;
	margin: 0 auto;
	background: rgba(255, 255, 255, 0.5);
	.title-wrapper {
		height: 50px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		color: #333;
		.title {
			font-size: 17px;
			font-weight: bold;
		}
		.time {
			margin-left: 16px;
		}
	}
	.dynamic-list-wrapper {
		overflow: hidden;
	}
	.dynamic-list {
		display: flex;
		flex-wrap: wrap;
		padding-left: 20px;
	}
	.dynamic-item {
		width: 400px;
		background: #fff;
		margin: 0 20px 20px 0;
		border-radius: 2px;
		border: 1px solid #e9e7e6;
		&:nth-child(6n - 2),
		&:nth-child(6n - 1),
		&:nth-child(6n) {
			margin-bottom: 0;
		}
		&:nth-child(3n) {
			margin-right: 0;
		}
		.top {
			height: 44px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #e9e9e9;
			padding: 0 10px;
			.name {
				font-size: 15px;
				font-weight: bold;
				color: #333;
			}
			.level-risk {
				display: flex;
				align-items: center;
			}
			.risk {
				width: 60px;
				height: 18px;
				line-height: 18px;
				text-align: center;
				background: #fa8c15;
				font-size: 12px;
				color: #fff;
				margin-left: 10px;
			}
		}
		.body {
			padding: 5px 16px;
		}
		.dynamic-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 34px;
			.label {
				font-size: 14px;
				color: #666;
			}
			.val {
				font-size: 15px;
				font-weight: bold;
				color: #333;
			}
		}
	}
}
.el-pagination {
	display: flex;
	flex-direction: row-reverse;
	margin: 8px 0;
	padding-right: 15px;
}
// 下方内容
.section-bottom {
	display: flex;
	justify-content: space-between;
	padding: 10px 10px 0;
	width: 1280px;
	margin: 0 auto;
}
.todo-wrapper {
	width: 610px;
	// height: 416px;
	background: #fff;
	.tab-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px 0 0;
		height: 46px;
		border-bottom: 1px solid #e6e6e6;
	}
	.tab-list {
		display: flex;
		line-height: 44px;
		font-size: 14px;
		font-weight: bold;
		color: #999;
		.tab-item {
			margin: 0 16px;
			cursor: pointer;
			&.active {
				color: $colorBlue;
				border-bottom: 2px solid $colorBlue;
			}
		}
	}
	.todo-list {
		padding: 0 20px;
		.todo-item {
			// height: 100px;
			border-bottom: 1px solid #e6e6e6;
			.top {
				height: 40px;
				display: flex;
				align-items: center;
				.todo-type {
					padding: 5px 8px;
					background: #fef3e7;
					color: #fa8c15;
					border-radius: 2px;
					font-size: 12px;
					margin-right: 10px;
				}
				.todo-name {
					color: #333;
					font-weight: bold;
					font-size: 14px;
				}
			}
			.body {
				height: 46px;
				display: flex;
				justify-content: space-between;
				margin: 2px 0;
				p {
					line-height: 20px;
				}
				.left {
					height: 46px;
					display: flex;
					align-items: center;
					.info {
						margin-left: 10px;
						font-size: 12px;
						color: #666;
					}
				}
				.right {
					height: 46px;
					display: flex;
					flex-direction: column;
					text-align: right;
					font-size: 12px;
					color: #666;
				}
			}
		}
	}
}
.echart-wrapper {
	position: relative;
	width: 610px;
	// height: 416px;
	padding: 20px;
	background: #fff;
	.ship-total {
		position: absolute;
		left: 176px;
		top: 192px;
		width: 94px;
		height: 66px;
		text-align: center;
		p {
			font-size: 14px;
			color: #909090;
			&:nth-child(2) {
				font-size: 32px;
				color: #333;
			}
		}
	}
	.echart-list {
		position: absolute;
		left: 445px;
		top: 84px;
		width: 136px;
		color: #666;
		.echart-item {
			height: 40px;
		}
		.dot {
			display: inline-block;
			width: 8px;
			height: 8px;
			margin-right: 10px;
			background: #1b85ff;
			border-radius: 50%;
		}
	}
}
</style>
