<template>
	<div>
		<div class="section-wrapper"></div>
		<div class="section-innner">
			<div class="dynamic">
				<div class="title-wrapper">
					<div class="left">
						<span class="title">船舶动态大屏</span>
						<span class="time">2020年5月14日 星期一</span>
					</div>
				</div>
				<div class="dynamic-list-wrapper">
					<swiper class="dynamic-list" :options="swiperOption" ref="MySwiper">
						<swiper-slide class="dynamic-item" v-for="item in shipList" :key="item.id">
							<div class="name txt-ellipsis" :title="item.chuanming">{{ item.chuanming }}</div>
							<div class="time txt-ellipsis">{{ item.daogangriqi }}</div>
							<div class="level-risk">
								<span v-if="item.xingji === '3' || item.xingji === '4'" class="risk">一般风险</span>
								<span v-if="item.xingji === '1' || item.xingji === '2'" class="risk red">最高风险</span>
								<span v-if="item.xingji === '5'" class="risk green">最低风险</span>
								<my-rate :score="+item.xingji" disabled />
							</div>
							<div class="score" :style="{ color: colorComputed(item.xingji) }">{{ item.quanzhongzongfen }}</div>
							<div class="company txt-ellipsis">{{ item.chuanbojingyingren }}</div>
						</swiper-slide>
					</swiper>
					<!-- 如果需要导航按钮 -->
					<div class="swiper-button-prev"></div>
					<div class="swiper-button-next"></div>
				</div>
			</div>

			<div class="echart-wrapper">
				<h3>近12月五星船舶到港数量</h3>
				<div class="echart-box">
					<echart :chartData="shipEchartData"></echart>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import MyRate from '@/components/Rate';
import echarts from 'echarts';
import Echart from '@/components/EChart';
import { $http } from '@commonbox/utils';
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
        xData: [],
        series: []
      }
    };
  },
  computed: {
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
  methods: {
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
          let { date, value } = res.data.data;
          this.shipEchartData.xData = date;
          this.shipEchartData.series.push({
            name: '五星船舶数',
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
            data: value,
            type: 'line',
            smooth: true
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
	overflow-y: auto;
	overflow-x: hidden;
	user-select: none;
	background: rgba(4, 18, 58, 0.8);
	padding: 0 0.625rem;
}

.dynamic {
	.title-wrapper {
		height: 0.5rem;
		display: flex;
		align-items: center;
		color: #fff;
		.title {
			font-size: 0.125rem;
			font-weight: bold;
		}
		.time {
			margin-left: 14px;
			font-size: 14px;
		}
	}
	.dynamic-list-wrapper {
		position: relative;

		.swiper-button-prev {
			left: -50px;
			color: #fff;
			font-size: 0.3rem;
			outline: none;
		}
		.swiper-button-next {
			right: -50px;
			color: #fff;
			font-size: 0.3rem;
			outline: none;
		}
	}
	.dynamic-list {
		display: flex;
	}
	.dynamic-item {
		width: 1.5625rem;
		height: 1.5625rem;
		padding-top: 0.083333rem;
		border-radius: 2px;
		color: #fff;
		border: 1px solid #313f5f;
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
			padding: 0 0.1rem;
			line-height: 0.28125rem;
			font-size: 0.125rem;
			font-weight: bold;
		}
		.time {
			width: 100%;
			text-align: center;
			padding: 0 0.1rem;
			height: 0.244792rem;
			line-height: 0.182292rem;
			font-size: 0.1rem;
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
			margin-right: 0.052083rem;
			&.green {
				background: #00da62;
			}
			&.red {
				background: #ff1e00;
			}
		}
		/deep/ .iconfont {
			font-size: 0.104167rem;
		}
		.score {
			height: 0.520833rem;
			line-height: 0.520833rem;
			font-size: 0.26rem;
			font-weight: 600;
		}
		.company {
			width: 100%;
			text-align: center;
			padding: 0 0.1rem;
			height: 0.104167rem;
			line-height: 0.104167rem;
			font-size: 0.083333rem;
		}
	}
}
.el-pagination {
	text-align: right;
}
// 下方内容
.echart-wrapper {
	width: 100%;
	height: 1.5625rem;
	color: #fff;
	h3 {
		height: 0.520833rem;
		line-height: 0.520833rem;
		font-size: 0.125rem;
	}
	.echart-box {
		width: 100%;
		height: 1.875rem;
		background: rgba(255, 255, 255, 0.1);
	}
}
</style>
