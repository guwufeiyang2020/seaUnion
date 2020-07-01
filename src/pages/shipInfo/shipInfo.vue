<template>
	<div>
		<div class="section-wrapper"></div>
		<div class="section-innner">
			<div class="notice-wrapper">
				<span class="img"></span>
				<div class="new-wrapper">
					<ul class="new-list" :class="{'marquee-top': isAnimate}">
						<li
							class="new-item txt-ellipsis"
							:title="item.neirong"
							v-for="(item, index) in noticeMes"
							:key="index">
							 {{item.neirong}}
						</li>
					</ul>
				</div>
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
									<span v-if="item.xingji === '3' || item.xingji === '4'" class="risk">一般风险</span>
									<span v-if="item.xingji === '1' || item.xingji === '2'" class="risk red">最高风险</span>
									<span v-if="item.xingji === '5'" class="risk green">最低风险</span>
								</div>
							</div>
							<div class="body">
								<div class="dynamic-info">
									<span class="label">预计到港时间</span>
									<span class="val">{{ item.daogangriqi }}</span>
								</div>
								<div class="dynamic-info">
									<span class="label">作业货品</span>
									<span class="val">{{ item.zuoyehuopin }}</span>
								</div>
								<div class="dynamic-info">
									<span class="label">所属企业</span>
									<span class="val">{{ item.chuanbojingyingren }}</span>
								</div>
							</div>
						</div>
					</div>
					<el-pagination
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
						<ul class="todo-list" v-if="todoList && todoList.length>0 ">
							<li class="todo-item" v-for="item in todoList" :key="item.id" @click="jumpToForm(item)">
								<p class="top">
									<span class="todo-type">{{ item.workflow_title }}</span>
									<span class="todo-name">{{ item.label }}</span>
								</p>
								<div class="body">
									<div class="left">
										<div class="info">
											<p>{{item.created_by}}</p>
											<p>发起于 {{item.created_at}}</p>
										</div>
									</div>
								</div>
							</li>
						</ul>
						<no-data v-else></no-data>
						<el-pagination
							v-if="totalTodoNum && totalTodoNum>3"
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
				<div class="echart-wrapper">
					<pie-echart :echartData="echartLists"></pie-echart>
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
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import { $http } from '@commonbox/utils';

import MyRate from '@/components/Rate';
import PieEchart from '@/components/PieEchart';
import NoData from '@/components/NoData';

import { openFormDialog, createDialog, FormPage } from '@qycloud/lego';
import TodoFrom from '../appDetail/xingyezilvtqcjiancha';

export default {
  components: { MyRate, PieEchart, NoData },
  data() {
    return {
      shipList: [],
      currentPage: 1,
      total: 0,
      pageSize: 6,
      tabList: [],
      todoList: [],
      currentStatus: 'current',
      colors: ['#64D5A9', '#5B8FF9', '#647697', '#F6C238', '#E97059'],
      echartLists: [],
      totalNum: 0,
      totalTodoNum: 0,
      currentPage1: 1,
      noticeMes: [],
      isAnimate: false
    };
  },
  created() {
    this.$bus.on('refreshData', () => {
      this.queryTabList();
      this.queryTabContent();
  	});
    setInterval(this.showMarquee, 3000);
  },
  methods: {
    getNoticeMes() {
      $http
        .get('/sdkseaunion/portalApi/getNoticeMes')
        .then((res) => {
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
      this.$router.push({
        path: `/rateDetail/view/${item.chuanbojingyingren}/${item.chuanming}/${item.weiyibiaoshi}`
      });
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
        pageStart: this.currentPage1 - 1,
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
            if (['CANCEL', 'DATAFLOW_CANCEL', 'WORKFLOW_CANCEL', 'SAVE_WORKFLOW'].indexOf(action) > -1) {
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
          console.log(type);
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
    },
  },
  beforeDestroy () {
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
		&.marquee-top {
			transition: all 0.5s;
			margin-top: -30px;
		}
		.new-item{
			width: 1160px;

		}

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
		height: 336px;
		display: flex;
		flex-wrap: wrap;
		padding-left: 20px;
	}
	.dynamic-item {
		width: 400px;
		height: 158px;
		background: #fff;
		margin: 0 20px 20px 0;
		border-radius: 2px;
		border: 1px solid #e9e7e6;
		cursor: pointer;
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
				&.green {
					background: #00da62;
				}
				&.red {
					background: #ff1e00;
				}
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
	padding: 10px 0 0;
	width: 1280px;
	margin: 0 auto;
}
.todo-wrapper {
	width: 630px;
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
	width: 630px;
	padding: 20px;
	background: #fff;
	.ship-total {
		position: absolute;
		left: 174px;
		top: 190px;
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
}
</style>
