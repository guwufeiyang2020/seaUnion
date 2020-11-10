<template>
	<div>
		<div class="section-wrapper"></div>
		<div class="section-innner">
			<div class="notice-wrapper">
				<span class="img"></span>
				<div class="new-wrapper">
					<ul class="new-list" :class="{ 'marquee-top': isAnimate }">
						<li
							@mouseenter="mouseenterText"
							@mouseleave="mouseleaveText"
							class="new-item txt-ellipsis"
							:title="item.neirong"
							v-for="(item, index) in noticeMes"
							:key="index"
						>{{ item.neirong }}</li>
					</ul>
				</div>
			</div>
			<div class="content-box">
				<div class="box-left">
					<div class="echart-box">
						<div class="echart-wrapper">
							<div class="echart-name">船舶风险等级分布</div>
							<pie-echart :echartData="echartLists"></pie-echart>
							<template v-if="isNoEchart">
								<div class="ship-total">
									<p>船舶总数 (艘)</p>
									<p>{{ totalNum }}</p>
								</div>
								<ul class="echart-list">
									<li class="echart-item" v-for="(item, index) in echartLists" :key="index">
										<span class="label">
											<i class="dot" :style="{ backgroundColor: colors[index] }"></i>
											{{ item.name }}
										</span>
										{{ item.rate }}, {{ item.value }}
									</li>
								</ul>
							</template>
							<no-data v-if="!isNoEchart"></no-data>
						</div>
					</div>
					<div class="echart-box">
						<div class="echart-wrapper">
							<div class="echart-name">船舶综合评分榜</div>
							<top-rank></top-rank>
						</div>
					</div>
					<div class="echart-box">
						<div class="echart-wrapper">
							<div class="echart-name">船舶类型占比统计</div>
							<ship-type></ship-type>
						</div>
					</div>
				</div>
				<div class="box-center">
					<div class="dynamic">
						<div class="title-wrapper">
							<div class="left">
								<span class="title">船舶动态</span>
								<span class="time">{{ today }} {{ week }}</span>
							</div>
						</div>
						<div class="dynamic-list-wrapper">
							<div class="dynamic-list clearfix" v-if="isNoData">
								<div
									class="dynamic-item"
									v-for="item in shipList"
									:key="item.id"
									@click="jumpRateDetail(item)"
								>
									<div class="top">
										<div class="name">{{ item.chuanming }}</div>
										<div class="level-risk">
											<my-rate :score="+item.xingji" disabled />
											<span v-if="item.xingji === '1'" class="risk risk1">最高风险</span>
											<span v-if="item.xingji === '2'" class="risk risk2">高风险</span>
											<span v-if="item.xingji === '3'" class="risk risk3">中风险</span>
											<span v-if="item.xingji === '4'" class="risk risk4">低风险</span>
											<span v-if="item.xingji === '5'" class="risk risk5">最低风险</span>
										</div>
									</div>
									<div class="body">
										<div class="dynamic-info">
											<span class="label">
												{{
												userInfo.userOrgType === '航运企业' ? '最新评级时间' : '预计到港时间'
												}}
											</span>
											<span class="val">{{ item.daogangriqi }}</span>
										</div>
										<div class="dynamic-info">
											<span class="label">
												{{
												userInfo.userOrgType === '航运企业' ? '权重总分' : '作业货品'
												}}
											</span>
											<span class="val">{{ item.zuoyehuopin }}</span>
										</div>
										<div class="dynamic-info">
											<span class="label">所属企业</span>
											<span class="val">{{ item.chuanbojingyingren }}</span>
										</div>
									</div>
								</div>
							</div>
							<div class="no-data" v-if="!isNoData">
								<img src="../../assets/images/nodata1.png" />
								<p>暂无数据</p>
							</div>
							<el-pagination
								v-if="total > 0"
								background
								small
								:current-page="currentPage"
								@current-change="handleCurrentChange"
								layout="prev, pager, next"
								:page-size="pageSize"
								:total="total"
							></el-pagination>
						</div>
					</div>
					<div class="section-bottom">
						<div class="todo-wrapper">
							<div class="tab-wrapper">
								<ul class="tab-list">
									<li
										v-for="(item, index) in tabList"
										:key="index"
										:class="[{ active: currentStatus == item.status }, 'tab-item']"
										@click="selectTab(item)"
									>{{ item.label }}({{ item.num }})</li>
								</ul>
							</div>
							<div class="tab-content">
								<ul class="todo-list" v-if="todoList && todoList.length > 0">
									<li class="todo-item" v-for="item in todoList" :key="item.id" @click="jumpToForm(item)">
										<p class="top">
											<span class="todo-type">{{ item.workflow_title }}</span>
											<span class="todo-name">{{ item.label }}</span>
										</p>
										<div class="body">
											<div class="left">
												<div class="info">
													<p>{{ item.created_by }}</p>
													<p>发起于 {{ item.created_at }}</p>
												</div>
											</div>
										</div>
									</li>
								</ul>
								<no-data v-else></no-data>
								<el-pagination
									v-if="totalTodoNum && totalTodoNum > 3"
									background
									small
									:current-page="currentPage1"
									@current-change="handleCurrentChange1"
									layout="prev, pager, next"
									:page-size="3"
									:total="totalTodoNum"
								></el-pagination>
							</div>
						</div>
					</div>
				</div>
				<div class="box-right">
					<div class="echart-box">
						<div class="echart-wrapper">
							<div class="echart-name">TQC 问卷扣分项统计</div>
							<deduction-items></deduction-items>
						</div>
					</div>
					<div class="echart-box">
						<div class="echart-wrapper">
							<div class="echart-name">检查问卷填报统计</div>
							<question-naire></question-naire>
						</div>
					</div>
					<div class="echart-box">
						<div class="echart-wrapper">
							<div class="echart-name">海事监管评级赋分关键项统计</div>
							<rating-scoring></rating-scoring>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { $http } from '@commonbox/utils';
import util from '@/utils/util';
import MyRate from '@/components/Rate';
import PieEchart from '@/components/PieEchart';
import NoData from '@/components/NoData';
import { openFormDialog, createDialog, FormPage } from '@qycloud/lego';
import TodoFrom from '../appDetail/xingyezilvtqcjiancha';
import deductionItems from './components/deductionItems.vue';
import questionNaire from './components/questionNaire.vue';
import shipType from './components/shipType.vue';
import ratingScoring from './components/ratingScoring.vue';
import topRank from './components/topRank.vue';

export default {
  components: {
    MyRate,
    PieEchart,
    NoData,
    deductionItems,
    questionNaire,
    shipType,
    ratingScoring,
    topRank
  },
  data() {
    return {
      shipList: [],
      currentPage: 1,
      total: 0,
      pageSize: 4,
      tabList: [],
      todoList: [],
      currentStatus: 'current',
      colors: ['#1B85FF', '#64D5A9', '#647697', '#5B8FF9', '#F6C238', '#E97059'],
      echartLists: [],
      totalNum: 0,
      totalTodoNum: 0,
      currentPage1: 1,
      noticeMes: [],
      isAnimate: false,
      today: '',
      week: '',
      timer: null
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    isNoData() {
      return this.shipList && this.shipList.length > 0;
    },
    isNoEchart() {
      return this.echartLists && this.echartLists.length > 0;
    }
  },
  created() {
    this.today = util.formatDate(new Date(), 'YYYY-MM-DD');
    this.week = util.getWeek();

    this.$bus.on('refreshData', () => {
      this.queryTabList();
      this.queryTabContent();
    });
    this.timer = setInterval(this.showMarquee, 3000);
  },
  methods: {
    mouseenterText() {
      clearInterval(this.timer);
    },
    mouseleaveText() {
      this.timer = setInterval(this.showMarquee, 3000);
    },
    getNoticeMes() {
      $http.get('/sdkseaunion/portalApi/getNoticeMes').then((res) => {
        if (res.data.status === 200) {
          this.noticeMes = res.data.data;
        }
      });
    },
    showMarquee() {
      this.isAnimate = true;
      setTimeout(() => {
        this.noticeMes.push(this.noticeMes[0]);
        this.noticeMes.shift();
        this.isAnimate = false;
      }, 500);
    },
    getShipData() {
      const queryParams = {
        startPos: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      $http
        .get('/sdkseaunion/portalApi/shipDynamicList', {
          params: queryParams
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.shipList = res.data.data;
            this.total = res.data.totalCount;
          }
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getShipData();
    },
    jumpRateDetail(item) {
      if (item.weiyibiaoshi === '') {
        this.$message({
          message: '该船无评级赋分记录',
          type: 'warning'
        });
        return;
      }
      let routeUrl = this.$router.resolve({
			  path: `/rateDetail/view/${item.chuanbojingyingren}/${item.chuanming}/${item.weiyibiaoshi}`
      });
      window.open(routeUrl.href, '_blank');
    },
    queryTabList() {
      $http.get('/sdkseaunion/portalApi/pendingWorkTotalCount').then((res) => {
        if (res.data.status === 200) {
          this.tabList = res.data.data;
        }
      });
    },
    selectTab(item) {
      this.currentStatus = item.status;
      this.queryTabContent();
    },
    queryTabContent() {
      const queryParams = {
        pageStart: (this.currentPage1 - 1) * this.pageSize,
        pageSize: 3,
        pdType: this.currentStatus
      };
      $http
        .get('/sdkseaunion/portalApi/pendingWorkByAppId', {
          params: queryParams
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.todoList = res.data.data.list;
            this.totalTodoNum = Number(res.data.data.count);
          }
        });
    },
    jumpToForm(item) {
      const { chuanming } = item.data.xingyezilvtqcjiancha;
      localStorage.setItem('shipName', chuanming);
      localStorage.setItem('jumpType', '2');

      let { spaceId } = AY.getSpaceInfoOfCurrentPage();
      const that = this;
      openFormDialog(
        {
          module: 'workflow', // 所属模块
          app: item.workflow_id, // 应用 id
          form: item.id, // form id
          edit: '1',
          node: item.definition_node_key,
          spaceId,
          onFormAction: (ctx, { action, formData, validate, next }) => {
            if (
              ['CANCEL', 'DATAFLOW_CANCEL', 'WORKFLOW_CANCEL', 'SAVE_WORKFLOW'].indexOf(action) > -1
            ) {
              return next();
            }
            validate().then((result) => {
              if (result) {
                next();
              }
            });
          }
        },
        {
          title: item.workflow_title, // 弹窗标题
          formComponent: this.getFormComponent(item.workflow_id)
        },
        (type) => {
          if (type === 'CLOSE') {
            this.queryTabList();
          }
        }
      );
    },
    getFormComponent(appId) {
      if (appId === 'xingyezilvtqcjiancha') {
        return TodoFrom;
      }
      return FormPage;
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.queryTabContent();
    },
    getEchartData() {
      $http.get('/sdkseaunion/portalApi/latestRatingStatistics').then((res) => {
        if (res.data.status === 200) {
          this.echartLists = res.data.data.data;
          this.totalNum = res.data.data.total;
        }
      });
    }
  },
  beforeDestroy() {
    this.$bus.off('refreshData');
  },
  mounted() {
    this.getNoticeMes();
    this.getShipData();
    this.getEchartData();
    this.queryTabList();
    this.queryTabContent();
  }
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
	background: url('../../assets/images/index-bg2.png') no-repeat center top;
	background-size: cover;
	overflow: hidden;
}
.section-innner {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	padding: 10px 40px 0 40px;
	overflow-y: auto;
	overflow-x: hidden;
	flex-direction: column;
}
.content-box {
	display: flex;
	height: calc(100% - 76px);
	.box-left {
		width: 440px;
		height: 100%;
		display: flex;
		flex-direction: column;
		.echart-box {
			flex: 1;
			margin-right: 20px;
			margin-bottom: 20px;
		}
	}
	.box-center {
		flex: 2;
		margin-right: 20px;
		height: 100%;
	}
	.box-right {
		flex: 0 0 440px;
		height: 100%;
		display: flex;
		flex-direction: column;
		.echart-box {
			flex: 1;
			// margin-right: 20px;
			margin-bottom: 20px;
		}
	}
}
.notice-wrapper {
	// flex: 1;
	// width: 1280px;
	height: 46px;
	margin-bottom: 10px;
	// margin: 0 auto 10px;
	font-size: 14px;
	color: #333;
	padding: 20px 0;
	background: #fff;
	display: flex;
	align-items: center;
	.img {
		width: 89px;
		height: 18px;
		background: url('../../assets/images/notice-bg.png') no-repeat left top;
		background-size: 100%;
		margin: 0 10px;
	}
	.new-wrapper {
		flex: 1;
		position: relative;
		height: 30px;
		line-height: 30px;
		overflow: hidden;
	}
	.new-list {
		position: absolute;
		top: 0;
		left: 0;
		right: 10px;
		&.marquee-top {
			transition: all 0.5s;
			margin-top: -30px;
		}
		.new-item {
			// width: 1160px;
			cursor: pointer;
		}
	}
}
.dynamic {
	background: rgba(255, 255, 255, 0.9);
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
		.no-data {
			padding: 0;
			height: 300px;
		}
	}
	.dynamic-list {
		height: 336px;
		/* 	display: flex;
		flex-wrap: wrap; */
		padding-left: 20px;
	}
	.dynamic-item {
		float: left;
		width: 48%;
		height: 158px;
		background: #fff;
		margin-bottom: 20px;
		margin-right: 1%;
		border-radius: 2px;
		border: 1px solid #e9e7e6;
		cursor: pointer;
		&:nth-child(6n - 2),
		&:nth-child(6n - 1),
		&:nth-child(6n) {
			margin-bottom: 0;
		}
		&:nth-child(3n) {
			// margin-right: 0;
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
				&.risk1 {
					background: #ff1e00;
				}
				&.risk2 {
					background: #f6c238;
				}
				&.risk3 {
					background: #647697;
				}
				&.risk4 {
					background: #64d5a9;
				}
				&.risk5 {
					background: #1b85ff;
				}
				/* 	&.red {
					background: #ff1e00;
				} */
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
	height: 390px;
	padding: 10px 0 0;
}
.todo-wrapper {
	height: 100%;
	background: #fff;
	overflow: hidden;
	.tab-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px 0 0;
		height: 46px;
		border-bottom: 1px solid #e6e6e6;
	}
	.tab-content {
		// height: 284px;
		background: #fff;
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
		.no-data {
			height: 330px;
		}
	}
	.todo-list {
		height: 330px;
		padding: 0 20px;
		.todo-item {
			cursor: pointer;
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
	width: 100%;
	height: 100%;
	padding: 10px;
	background: rgba(255, 255, 255, 0.9);
	.echart-name {
		margin-bottom: 8px;
		font-size: 17px;
		font-weight: bold;
	}
	.ship-total {
		position: absolute;
		left: 105px;
    top: 133px;
		width: 94px;
		height: 66px;
		text-align: center;
		p {
			font-size: 12px;
			color: #909090;
			&:nth-child(2) {
				font-size: 26px;
				color: #333;
			}
		}
	}
	.echart-list {
		position: absolute;
		left: 280px;
		top: 54px;
		color: #666;
		.echart-item {
			height: 28px;
			font-size: 12px;
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
	.no-data {
		position: absolute;
		top: 0;
		// height: 340px;
	}
}
</style>
