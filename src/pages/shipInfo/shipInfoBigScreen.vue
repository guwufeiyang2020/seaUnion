<template>
	<div>
		<div class="section-wrapper"></div>
		<div class="section-innner">
			<div class="dynamic">
				<div class="title-wrapper">
					<div class="left">
						<span class="title">船舶动态大屏</span>
						<span class="time">{{ today }} {{ week }}</span>
					</div>
				</div>
				<div class="dynamic-list-wrapper" v-if="isNoData">
					<swiper class="dynamic-list" :options="swiperOption" ref="MySwiper">
						<swiper-slide class="dynamic-item" v-for="item in shipList" :key="item.id">
							<el-tooltip class="item" effect="dark" :content="item.chuanming" placement="top">
								<div class="name txt-ellipsis" :title="item.chuanming">{{ item.chuanming }}</div>
							</el-tooltip>
							<div class="time txt-ellipsis">{{ item.daogangriqi }}</div>
							<div class="level-risk">
								<span v-if="item.xingji === '1'" class="risk risk1">最高风险</span>
								<span v-if="item.xingji === '2'" class="risk risk2">高风险</span>
								<span v-if="item.xingji === '3'" class="risk risk3">中风险</span>
								<span v-if="item.xingji === '4'" class="risk risk4">低风险</span>
								<span v-if="item.xingji === '5'" class="risk risk5">最低风险</span>
								<my-rate :score="+item.xingji" disabled />
							</div>
							<div class="score" :style="{ color: colorComputed(item.xingji) }">
								{{ item.quanzhongzongfen }}
							</div>
							<div class="company txt-ellipsis">{{ item.chuanbojingyingren }}</div>
						</swiper-slide>
					</swiper>
					<!-- 如果需要导航按钮 -->
					<div class="swiper-button-prev"></div>
					<div class="swiper-button-next"></div>
				</div>
				<div class="no-data" v-if="!isNoData">
					<img src="../../assets/images/nodata2.png" />
					<p>暂无数据</p>
				</div>
			</div>

			<div class="echart-wrapper">
				<h3>近12个月星级船舶数量统计</h3>
				<div class="echart-box">
					<echart :chartData="shipEchartData" @openPopup="openPopup"></echart>
				</div>
			</div>
		</div>

		<div v-if="rateListDialogVisible">
			<el-dialog
				v-dialogDrag
				title="评级赋分"
				width="1000px"
				:close-on-click-modal="false"
				@close="closeDialogRateList"
				:visible.sync="rateListDialogVisible"
			>
				<el-table :data="tableData" style="width: 100%;">
					<el-table-column label="船舶名称" prop="chuanbomingcheng" width="200"></el-table-column>
					<el-table-column label="风险等级" width="100">
						<template slot-scope="scope">
							<my-rate :score="Number(scope.row.xingji)" disabled />
						</template>
					</el-table-column>
					<el-table-column prop="quanzhongzongfen" label="综合评分" width="100"></el-table-column>
					<el-table-column prop="last_modified" label="评分时间" width="160"></el-table-column>
					<el-table-column prop="chuanxing" label="船型" width="140"></el-table-column>
					<el-table-column prop="chuanbojingyingren" label="所属企业" width="260"></el-table-column>
				</el-table>
				<el-pagination
					v-if="total > 0"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					:page-size="pageSize"
					layout="prev, pager, next"
					:total="total"
				></el-pagination>
			</el-dialog>
		</div>
		
	</div>
</template>

<script>
import MyRate from '@/components/Rate';
import echarts from 'echarts';
import Echart from '@/components/EChart';
import { $http } from '@commonbox/utils';
import util from '@/utils/util';
import '../../utils/dialogDrag';
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

export default {
  components: { MyRate, Echart, Swiper, SwiperSlide },
  directives: {
    swiper: directive
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 5,
        grabCursor: true,
        freeMode: true,
        spaceBetween: 20,
        // 如果需要前进后退按钮
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      shipList: [],
      shipEchartData: {
        legend: {},
        xData: [],
        series: []
      },

      rateListDialogVisible: false,
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      today: '',
      week: '',
      searchData: null
    };
  },
  computed: {
    isNoData() {
      return this.shipList && this.shipList.length > 0;
    },
    swiper() {
      return this.$refs.MySwiper.$swiper;
    },
    colorComputed() {
      return (status) => {
        if (status === '1' || status === '2') {
          return '#FF1E00';
        }
        if (status === '3' || status === '4') {
          return '#F7B500';
        }
        if (status === '5') {
          return '#00DA62';
        }
      };
    }
  },
  created() {
    this.today = util.formatDate(new Date(), 'YYYY-MM-DD');
    this.week = util.getWeek();
  },
  methods: {
    openPopup(param) {
      this.rateListDialogVisible = true;
      this.currentPage = 1;
      this.queryRateList(param);
      this.searchData = param;
    },
    closeDialogRateList() {
      this.rateListDialogVisible = false;
    },
    async queryRateList(param) {
      // eslint-disable-next-line no-nested-ternary
      let starLevel =				param.seriesName === '三星及以下船舶' || param.seriesName === '四星船舶'
				  ? param.seriesName === '三星及以下船舶'
				    ? '3'
				    : '4'
				  : '5';
      const queryParams = {
        startPos: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        searchTime: param.name,
        starLevel
      };
      let { data } = await $http.get('/sdkseaunion/portalApi/clickFiveStarGroupMonth', {
        params: queryParams
      });
      this.tableData = data.data;
      this.total = data.totalCount;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryRateList(this.searchData);
    },
    selectTab(item, index) {
      this.nowIndex = index;
    },
    getShipData() {
      $http.get('/sdkseaunion/portalApi/shipDynamicList').then((res) => {
        if (res.data.status === 200) {
          this.shipList = res.data.data;
        }
      });
    },
    getEchartData() {
      $http.get('/sdkseaunion/portalApi/fiveStarStatisticsGroupMonth').then((res) => {
        if (res.data.status === 200) {
          let { date, value, name } = res.data.data;
          let colors = ['#5B8FF9', '#5AD8A6', '#F6BD16'];
          this.shipEchartData.xData = date;
          this.shipEchartData.legend = { data: name };
          value.forEach((item, index) => {
            this.shipEchartData.series.push({
              name: name[index],
              areaStyle: {
                normal: {
                  // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(91, 143, 249, 0.5)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(255, 255, 255, 0.2)'
                    }
                  ])
                }
              }, // 区域颜色渐变
              data: item,
              type: 'line',
              itemStyle: {
                color: colors[index]
                //  borderColor:'orange',
              },
              symbol: 'roundRect',
              smooth: true
            });
          });
        }
      });
    }
  },
  mounted() {
    this.getShipData();
    this.getEchartData();
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
	overflow-y: auto;
	overflow-x: hidden;
	user-select: none;
	background: rgba(4, 18, 58, 0.8);
	padding: 0 1.2rem;
}

.dynamic {
	.title-wrapper {
		height: 1rem;
		line-height: 0.7rem;
		padding-top: 0.3rem;
		display: flex;
		align-items: center;
		color: #fff;
		.title {
			font-size: 0.22rem;
			font-weight: bold;
		}
		.time {
			margin-left: 14px;
			font-size: 14px;
		}
	}
	.dynamic-list-wrapper {
		position: relative;
		height: 3rem;
		.swiper-button-prev {
			left: -50px;
			color: #fff;
			font-size: 0.2rem;
			outline: none;
		}
		.swiper-button-next {
			right: -50px;
			color: #fff;
			font-size: 0.2rem;
			outline: none;
		}
	}
	.dynamic-list {
		display: flex;
	}
	.dynamic-item {
		width: 3rem;
		height: 3rem;
		padding-top: 0.24rem;
		border-radius: 2px;
		color: #fff;
		background: rgba(255, 255, 255, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		&:nth-child(5) {
			margin-right: 0;
		}
		.name {
			width: 100%;
			text-align: center;
			padding: 0 0.2rem;
			line-height: 0.53rem;
			font-size: 0.2rem;
			font-weight: bold;
		}
		.time {
			width: 100%;
			text-align: center;
			padding: 0 0.192rem;
			height: 0.38rem;
			line-height: 0.38rem;
			font-size: 0.192rem;
		}
		.level-risk {
			display: flex;
			height: 0.36rem;
			align-items: center;
		}
		.risk {
			width: 60px;
			height: 22px;
			line-height: 22px;
			text-align: center;
			background: #fa8c15;
			font-size: 12px;
			color: #fff;
			margin-right: 0.09rem;
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
		}
		/deep/ .iconfont {
			font-size: 0.2rem;
		}
		.score {
			height: 0.9rem;
			line-height: 0.9rem;
			font-size: 0.5rem;
			font-weight: 600;
		}
		.company {
			width: 100%;
			text-align: center;
			padding: 0 0.192rem;
			height: 0.2rem;
			line-height: 0.2rem;
			font-size: 0.16rem;
		}
	}
}
.el-pagination {
	text-align: right;
}
// 下方内容
.echart-wrapper {
	width: 100%;
	color: #fff;
	h3 {
		height: 1rem;
		line-height: 0.7rem;
		padding-top: 0.3rem;
		font-size: 0.22rem;
	}
	.echart-box {
		width: 100%;
		height: 3.6rem;
		background: rgba(255, 255, 255, 0.1);
	}
}
// 弹窗样式-深色
/deep/ .el-dialog {
	background: #020d2b;
	.el-dialog__title {
		color: #fff;
	}
	.el-dialog__body {
		padding: 10px 20px 20px;
	}
	.el-dialog__headerbtn {
		font-size: 22px;
	}
	.el-table {
		background: #020d2b;
		color: #fff;
		&::before {
			height: 0px;
		}
		thead {
			color: #fff;
		}
		th {
			background: #1b2540;
			&.is-leaf {
				border-bottom: none;
			}
		}
		tr {
			background: #020d2b;
			&.hover-row {
				td {
					background: #020d2b;
				}
			}
			td {
				border-bottom: 1px solid #2f3850;
			}
		}
	}
	.el-pagination {
		background: #020d2b;
		button {
			&:disabled {
				background: #020d2b;
			}
		}
		.el-pager {
			li {
				background: #020d2b;
			}
		}
	}
}
.no-data {
	color: #fff;
}
</style>
