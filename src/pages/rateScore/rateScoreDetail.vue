<template>
	<div class="rate-score-wrapper">
		<div class="page-top">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/rateList' }">评级赋分</el-breadcrumb-item>
				<el-breadcrumb-item>{{$route.params.mode === 'edit'? '编辑': '查看'}}评级赋分</el-breadcrumb-item>
			</el-breadcrumb>
			<h2 class="title">{{$route.params.mode === 'edit'? '编辑': '查看'}}评级赋分</h2>
		</div>
		<div class="page-body">
			<div class="page-left" v-if="shipInfos && shipInfos.length> 0">
				<section class="section" v-for="(shipInfo, index) in shipInfos" :key="index">
					<h3 class="factor-name">{{ shipInfo.yinsufenlei }}({{ shipInfo.quanzhong }})</h3>
					<ul class="schedule-list">
						<li class="schedule-title">
							<div>影响因素</div>
							<div>实际得分</div>
							<div>赋分标准</div>
							<div>赋分值</div>
						</li>
						<li class="schedule-item" v-for="(item, index) in shipInfo.items" :key="index">
							<div class="influence-factor">{{item.yingxiangyinsu}}</div>
							<div class="actual-score">{{item.editValue}}</div>
							<div class="schedule-content-wrap">
								<div class="schedule-content" v-for="(subItem, subIndex) in item.subList" :key="subIndex">
									<div class="score-type" v-if="subItem.fufenleixing">{{subItem.fufenleixing}}</div>
									<div class="schedule-content-inner">
										<div
											class="schedule-inner"
											v-for="(thirdItem, thirdIndex) in subItem.thirdList"
											:key="thirdIndex"
											@mouseleave="mouseleaveItem(thirdItem)"
										>
											<div class="journey">{{thirdItem.fufenbiaozhun}}</div>
											<div class="lecturer">
												{{thirdItem.fufenzhi}}
												<i
													class="my-radio"
													:class="[thirdItem.isChecked ? 'is-checked' : '']"
													@click="selectScore(shipInfo,item, subItem, thirdItem)"
												></i>
											</div>
										</div>
									</div>
								</div>
							</div>
						</li>
						<li class="total-score">
							<div>本项得分小计</div>
							<div>{{ shipInfo.totalScore }}</div>
						</li>
						<li class="total-weight">
							<div>权重得分(实际得分*{{ shipInfo.quanzhong }}%)</div>
							<div>{{ shipInfo.weightTotalScore }}</div>
						</li>
					</ul>
				</section>
			</div>
			<ul class="position-nav" :class="{ 'fixed-menu': fixedMenu }" v-if="shipInfos.length>0">
				<li
					class="nav-item"
					:class="menuClickIndex === index ? 'active' : ''"
					@click="clickMenu(index)"
					v-for="(shipInfo, index) in shipInfos"
					:key="index"
				>{{ shipInfo.yinsufenlei }}({{ shipInfo.quanzhong }})</li>
			</ul>
		</div>
		<div class="button-area" v-if="$route.params.mode === 'edit'">
			<button class="btn-blue" @click="calcScore">提交并计算综合得分</button>
			<button class="btn-blue">提交</button>
			<button class="btn-default">取消</button>
		</div>
		<!-- 模态框 -->
		<div class="model-wrapper" v-if="showResult">
			<div class="model">
				<h3 class="name">泰坦尼克号</h3>
				<p class="result">综合得分：100分，无风险</p>
				<my-rate :score="5" disabled />
				<el-button @click="backToList">返回评级赋分列表</el-button>
			</div>
			<div class="mask"></div>
		</div>
	</div>
</template>

<script>
import { $http } from '@commonbox/utils';
import MyRate from '@/components/Rate';
import { isPositiveInteger } from '../../utils/validate';

export default {
  components: { MyRate },
  data() {
    return {
      shipInfos: {},
      menuClickIndex: 0,
      scrollTop: 0,
      fixedMenu: false,
      showResult: false
    };
  },

  methods: {
    clickMenu(index) {
      this.menuClickIndex = index;
      const jump = document.querySelectorAll('.section');
      const total = jump[index].offsetTop - 0;
      document.body.scrollTop = total;
      document.documentElement.scrollTop = total;
    },
    loadScroll() {
      const sections = document.querySelectorAll('.section');
      sections.forEach((item, index) => {
        if (this.scrollTop >= item.offsetTop - 50) {
          this.menuClickIndex = index;
        }
      });
    },
    dataScroll() {
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (this.scrollTop && this.scrollTop > 260) {
        this.fixedMenu = true;
      } else {
        this.fixedMenu = false;
      }
    },
    async queryShipDeatail() {
      let { data } = await $http.get('/sdkseaunion/ratingApi/getRatingItems', {
        params: { shipName: this.$route.params.id }
      });
      this.shipInfos = data.data;
      if (this.shipInfos && this.shipInfos.length > 0) {
        this.shipInfos.forEach((item1) => {
          item1.items.forEach((item2) => {
            item2.subList.forEach((item3) => {
              item3.thirdList.forEach((item4) => {
                this.$set(item4, 'isChecked', false);
              });
            });
          });
        });
      }
    },
    mouseleaveItem(thirdItem) {
      thirdItem.isChecked = false;
    },
    selectScore(shipInfo, item, subItem, thirdItem) {
      thirdItem.isChecked = !thirdItem.isChecked;
      this.$set(thirdItem, 'selectFufenzhi', thirdItem.fufenzhi);
      this.$set(item, 'editValue', thirdItem.fufenzhi);
    },
    backToList() {
      this.$router.push({
        path: '/rateList'
      });
    },
    calcScore() {
      this.showResult = true;
    }
  },
  watch: {
    scrollTop() {
      this.loadScroll();
    }
  },
  mounted() {
    this.queryShipDeatail();
    window.addEventListener('scroll', this.dataScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.dataScroll, false);
  }
};
</script>

<style lang="scss" scoped>
.rate-score-wrapper {
	width: 1280px;
	min-height: calc(100vh - 100px);
	margin: 20px auto;
	background: #fff;
}
.page-top {
	height: 80px;
	border-bottom: 1px solid #e6e6e6;
	padding: 0 24px;
	.title {
		height: 26px;
		line-height: 26px;
		color: #000;
		font-size: 18px;
	}
	.el-breadcrumb {
		height: 38px;
		line-height: 38px;
		font-size: 12px;
	}
	/deep/ .el-breadcrumb__inner.is-link {
		font-weight: normal;
	}
}
.page-body {
	display: flex;
	.page-left {
		flex: 1;
		padding: 4px 24px;
		.section {
			margin-bottom: 24px;
		}
		.factor-name {
			height: 60px;
			line-height: 60px;
			font-size: 16px;
		}
	}
	.position-nav {
		width: 230px;
		position: relative;
		top: 60px;
		&.fixed-menu {
			position: fixed;
			top: 50px;
			left: calc(50% + 640px - 230px);
		}
		&::before {
			content: ' ';
			position: absolute;
			left: -17px;
			top: 11px;
			width: 2px;
			height: 183px;
			background: #e6e6e6;
		}
		.nav-item {
			position: relative;
			height: 20px;
			line-height: 20px;
			margin-bottom: 40px;
			color: #666;
			cursor: pointer;
			&::before {
				content: ' ';
				position: absolute;
				left: -21px;
				top: 6px;
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background: #fff;
				border: 2px solid #bfbfbf;
			}
			&.active {
				color: #005bac;
				&::before {
					border: 2px solid #005bac;
				}
			}
		}
	}
}
// 模拟表格样式
.schedule-list {
	width: 960px;
	font-size: 13px;
	text-align: left;
	line-height: 24px;
	border: 1px solid #eee;
	.schedule-title {
		height: 42px;
		line-height: 40px;
		background: #f6f8fa;
		display: flex;
		border-bottom: 1px solid #eee;
		div {
			color: #333;
			font-weight: bold;
			&:nth-child(1) {
				width: 200px;
				border-right: 1px solid #eee;
				padding-left: 10px;
			}
			&:nth-child(2) {
				width: 160px;
				text-align: center;
				border-right: 1px solid #eee;
			}
			&:nth-child(3) {
				width: 500px;
				border-right: 1px solid #eee;
				padding-left: 10px;
			}
			&:nth-child(4) {
				width: 100px;
				padding-left: 10px;
			}
		}
	}
	.influence-factor {
		width: 200px;
		border-right: 1px solid #eee;
		display: flex;
		align-items: center;
		padding: 6px 0 6px 10px;
	}
	.actual-score {
		width: 160px;
		border-right: 1px solid #eee;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 8px;
		.contentedit-content {
			width: 100%;
			height: 100%;
			margin: 0 auto;
			&.can-edit {
				padding: 0px 10px;
				border: 1px solid #f00;
			}
		}
	}
	.schedule-content-wrap {
		width: 600px;
		.schedule-content {
			display: flex;
			border-bottom: 1px solid #eee;
			&:last-child {
				border-bottom: 0 none;
			}
			.score-type {
				width: 200px;
				border-right: 1px solid #eee;
				display: flex;
				align-items: center;
				padding-left: 10px;
				text-align: left;
			}
			.schedule-content-inner {
				flex: 1;
				.schedule-inner {
					width: 100%;
					display: flex;
					border-bottom: 1px solid #eee;
					cursor: pointer;
					.my-radio {
						display: none;
						width: 18px;
						height: 18px;
						background: url('../../assets/images/icon-checknot.png');
						&.is-checked {
							background: url('../../assets/images/icon-checked.png');
						}
					}

					&:hover {
						background: rgba(27, 133, 255, 0.1);
						.my-radio {
							display: block;
						}
					}
					&:last-child {
						border-bottom: none;
					}
					.journey {
						flex: 1;
						text-align: left;
						padding: 10px 8px;
					}
					.lecturer {
						flex: 0 0 100px;
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 0 10px;
					}
				}
			}
		}
		.journey {
			flex: 0 0 400px;
			border-right: 1px solid #e6e6e6;
		}
		.lecturer {
			flex: 1;
		}
	}
	.schedule-item {
		display: flex;
		border-bottom: 1px solid #eee;
		color: #222;
	}
	.total-score,
	.total-weight {
		display: flex;
		height: 50px;
		line-height: 50px;
		color: #222;
		border-bottom: 1px solid #eee;
		margin-top: -1px;
		div {
			padding-left: 10px;
			&:first-child {
				width: 200px;
				border-right: 1px solid #eee;
			}
			&:last-child {
				flex: 1;
				text-align: left;
				padding-left: 30px;
			}
		}
	}
	.total-weight {
		border-bottom: none;
	}
}
.button-area {
	height: 100px;
	text-align: center;
	padding-top: 20px;
}
/* 模态弹窗 */
.model-wrapper {
	.model {
		position: fixed;
		left: 50%;
		top: 50%;
		z-index: 10;
		width: 550px;
		height: 300px;
		background: #fff;
		padding-top: 10px;
		padding-bottom: 20px;
		margin: -192px 0 0 -192px;
		box-shadow: 0 12px 24px 0 rgba(28, 31, 33, 0.1);
		border-radius: 4px;
		transition: all 0.2s;
		-webkit-transition: all 0.2s;
		text-align: center;
	}
	.name {
		height: 70px;
		line-height: 70px;
		font-size: 18px;
		color: #333;
	}
	.result {
		height: 70px;
		line-height: 70px;
		font-size: 20px;
		color: #00ae65;
		font-weight: bold;
	}
	.rate {
		margin: 10px 0 32px 0;
		.icon-xingxing {
			font-size: 32px;
		}
	}
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0.5;
		z-index: 1;
		background: #000;
	}
}
</style>
