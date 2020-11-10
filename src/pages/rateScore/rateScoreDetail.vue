<template>
	<div class="rate-score-wrapper">
		<div class="page-top">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/rateList' }">评级赋分</el-breadcrumb-item>
				<el-breadcrumb-item>{{$route.params.mode === 'add'? '新增': '查看'}}评级赋分</el-breadcrumb-item>
			</el-breadcrumb>
			<h2 class="title">{{$route.params.mode === 'add'? '新增': '查看'}}评级赋分
				<span class="ship-name"><i class="icon-ship"></i>{{$route.params.name}}</span>
			</h2>
			<button class="btn-blue" @click="showHistory">历史记录评级</button>
		</div>
		<div class="page-body">
			<div class="page-left" v-if="shipInfos && shipInfos.length> 0">
				<section class="section" v-for="(shipInfo, index) in shipInfos" :key="index">
					<h3 class="factor-name">{{ shipInfo.yinsufenlei }}({{ shipInfo.quanzhong }}%)</h3>
					<ul class="schedule-list">
						<li class="schedule-title">
							<div>影响因素</div>
							<div>实际得分</div>
							<div>赋分标准</div>
							<div>赋分值</div>
						</li>
						<li class="schedule-item" v-for="(item, index) in shipInfo.items" :key="index">
							<div class="influence-factor" :class="{'is-empty': item.isError}">{{item.yingxiangyinsu}}</div>
							<div class="actual-score">{{item.shijidefen}}</div>
							<div class="schedule-content-wrap">
								<div class="schedule-content" v-for="(subItem, subIndex) in item.subList" :key="subIndex">
									<div class="score-type" v-if="subItem.fufenleixing">{{subItem.fufenleixing}}</div>
									<div class="schedule-content-inner">
										<div
											v-for="(thirdItem, thirdIndex) in subItem.thirdList"
											class="schedule-inner"
											:class="{'hover': $route.params.mode === 'add'&& item.canAddScore && thirdItem.canHover}"
											:key="thirdIndex"
											@mouseenter="mouseenterItem(thirdItem)"
											@mouseleave="mouseleaveItem(thirdItem)"
										>
											<div class="journey">{{thirdItem.fufenbiaozhun}}</div>
											<div class="lecturer">
												{{thirdItem.fufenzhi}}
												<i
													v-if="$route.params.mode === 'add' && item.canAddScore"
													class="my-radio"
													:class="[thirdItem.isChecked ? 'is-checked' : '']"
													@click="selectScore(shipInfo, item, subItem, thirdItem)"
												></i>
											</div>
										</div>
									</div>
								</div>
							</div>
						</li>
						<li class="total-score">
							<div>本项得分小计</div>
							<div>{{ $route.params.mode === 'add'? totalScore(shipInfo) : shipInfo.totalScore }}</div>
						</li>
						<li class="total-weight">
							<div>权重得分(实际得分*{{ shipInfo.quanzhong }}%)</div>
							<div>{{ $route.params.mode === 'add'? totalWeight(shipInfo) : parseInt(shipInfo.weightTotalScore) }}</div>
						</li>
					</ul>
				</section>
			</div>
			<ul
				class="position-nav"
				:class="{ 'fixed-menu': fixedMenu }"
				v-if="shipInfos && shipInfos.length > 0"
			>
				<li
					class="nav-item"
					:class="menuClickIndex === index ? 'active' : ''"
					@click="clickMenu(index)"
					v-for="(shipInfo, index) in shipInfos"
					:key="index"
				>{{ shipInfo.yinsufenlei }}({{ shipInfo.quanzhong }}%)</li>
			</ul>
		</div>
		<div class="button-area">
			<button class="btn-blue" @click="calcScore" v-if="$route.params.mode === 'add'">提交并计算综合得分</button>
			<button class="btn-blue" @click="viewScore" v-if="$route.params.mode === 'view'">查看综合得分</button>
			<button class="btn-blue" @click="submitAddScore" v-if="$route.params.mode === 'add'">提交</button>
			<button class="btn-default" @click="backToList" v-if="$route.params.mode === 'add'" >取消</button>
		</div>
		<!-- 模态框 -->
		<div class="model-wrapper" v-if="showResultModel">
			<div class="model">
				<h3 class="name">{{$route.params.name}}</h3>
				<p class="result" :style="{ color: colorComputed}">{{resultDesc}}</p>
				<my-rate :score="rateLevel" disabled />
				<el-button @click="backToList">返回评级赋分列表</el-button>
			</div>
			<div class="mask"></div>
		</div>
		<el-dialog title="历史评级" :visible.sync="dialogVisible" width="700px">
			<div style="overflow: auto;">
				<el-table :data="gridData" v-if="gridData && gridData.length > 0">
					<el-table-column label="船舶名称">
						<template slot-scope="scope">
							<el-button
								type="text"
								size="small"
								@click="goRateDetail(scope.row)"
							>{{ scope.row.chuanbomingcheng }}</el-button>
						</template>
					</el-table-column>
					<el-table-column label="风险等级" width="180">
						<template slot-scope="scope">
							<my-rate :score="Number(scope.row.xingji)" disabled />
						</template>
					</el-table-column>
					<el-table-column prop="quanzhongzongfen" label="综合评分"></el-table-column>
					<el-table-column prop="pingfenshijian"  width="180" label="评分时间"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<a class="link"	:href="`/sdkseaunion/execlExportApi/ratingExport?weiyibiaoshi=${scope.row.weiyibiaoshi}`">导出</a>
							<a class="link"	v-if="scope.row.buttonJurisdiction && scope.row.buttonJurisdiction.length > 0 && scope.row.buttonJurisdiction.includes('delete')"
								@click="deleteClick(scope.row)">删除</a>
						</template>
					</el-table-column>
				</el-table>
				<div class="no-data" v-else>
					<img src="../../assets/images/no-work2.png" />
					<p>暂无数据</p>
				</div>
			</div>
			<el-pagination
				v-if="gridData.length"
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:page-sizes="[10,20,30]"
				:current-page="pageNum"
				:page-size="pageSize"
				layout="total, sizes, prev, pager, next"
				:total="total"
			></el-pagination>	
		</el-dialog>
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
      shipInfos: [],
      menuClickIndex: 0,
      scrollTop: 0,
      fixedMenu: false,
      showResultModel: false,
      hasEmpty: false,
      resultDesc: '',
      rateLevel: 0,
      dialogVisible: false,
      gridData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  computed: {
    totalScore() {
      return (shipInfo) => {
        let scoreNum = 0;
        shipInfo.items.forEach((item) => {
          if (item.shijidefen) {
            scoreNum += parseInt(item.shijidefen, 10);
          }
        });
        shipInfo.totalScore = scoreNum;
        return scoreNum;
      };
    },
    totalWeight() {
      return (shipInfo) => {
        let weight = 0;
        let scoreNum = 0;
        shipInfo.items.forEach((item) => {
          if (item.shijidefen) {
            scoreNum += parseInt(item.shijidefen, 10);
          }
        });
        weight = (scoreNum * parseInt(shipInfo.quanzhong, 10)) / 100;
        shipInfo.weightTotalScore = weight;
        return weight === 0 ? 0 : weight;
      };
    },
    // 总的权重
    weightSumScore() {
      let weightScore = 0;
      this.shipInfos.forEach((item) => {
        weightScore += (item.totalScore * parseInt(item.quanzhong, 10)) / 100;
      });
      return weightScore;
    },
    colorComputed() {
      if (this.rateLevel === 1 || this.rateLevel === 2) {
        return '#FF1E00';
      }
      if (this.rateLevel === 3 || this.rateLevel === 4) {
        return '#F7B500';
      }
      if (this.rateLevel === 5) {
        return '#00DA62';
      }
    }
  },
  methods: {
    goRateDetail(item) {
      this.$router.push({
        path: `/rateDetail/view/${item.chuanbojingyingren}/${item.chuanbomingcheng}/${item.weiyibiaoshi}`
      }); 
    },
    deleteClick(item) {
      if (this.$route.params.id === item.weiyibiaoshi) {
						 this.$message({
          type: 'error',
          message: '该记录不能删除!'
        });
        return;
      }
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          $http
            .post('/sdkseaunion/ratingApi/delRatingItems', { weiyibiaoshi: item.weiyibiaoshi })
            .then((rspData) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.searchHistoryData();
            });
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchHistoryData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.searchHistoryData();
    },
    // 查看历史评级
    showHistory() {
      this.dialogVisible = true;
      this.pageNum = 1;
      this.pageSize = 10;
      this.total = 0;
      this.searchHistoryData();
    },
    searchHistoryData() {
      let url = `/sdkseaunion/ratingApi/ratingList?startPos=${(this.pageNum - 1) * this.pageSize}&pageSize=${this.pageSize}&searchName=${this.$route.params.name}&labelType=all`;
      this.$http.get(url).then((res) => {
        if (res.status === 200) {
          this.gridData = res.data.data;
          this.total = res.data.totalCount;
        }
      });
    },
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
      let queryParams = {};
      let url = '';
      if (this.$route.params.mode === 'add') {
        queryParams.shipName = this.$route.params.name;
        url = '/sdkseaunion/ratingApi/getRatingItems';
      } else {
        queryParams.id = this.$route.params.id;
        url = '/sdkseaunion/ratingApi/getRatingItemsById';
      }

      let { data } = await $http.get(url, {
        params: queryParams
      });
      this.shipInfos = data.data;
      if (this.shipInfos && this.shipInfos.length > 0 && this.$route.params.mode === 'add') {
        this.shipInfos.forEach((item1) => {
          item1.items.forEach((item2) => {
            if (item2.shijidefen) {
              // 如果有值，就不可以赋分，否则能赋分
              this.$set(item2, 'canAddScore', false);
            } else {
              this.$set(item2, 'canAddScore', true);
              this.$set(item2, 'isError', false);
            }
            item2.subList.forEach((item3) => {
              item3.thirdList.forEach((item4) => {
                this.$set(item4, 'isChecked', false);
                this.$set(item4, 'canHover', false);
              });
            });
          });
        });
      }
    },
    mouseenterItem(thirdItem) {
      thirdItem.canHover = true;
    },
    mouseleaveItem(thirdItem) {
      if (!thirdItem.isChecked) {
        thirdItem.canHover = false;
        thirdItem.isChecked = false;
      }
    },
    selectScore(shipInfo, item, subItem, thirdItem) {
      thirdItem.isChecked = !thirdItem.isChecked;
      // 如果选中
      if (thirdItem.isChecked) {
        let newList = [];
        newList = subItem.thirdList.filter(
          item4 => item4.fufenbiaozhun !== thirdItem.fufenbiaozhun
        );
        newList.forEach((item4) => {
          item4.canHover = false;
          item4.isChecked = false;
        });
      }
      if (thirdItem.isChecked) {
        this.$set(thirdItem, 'selectFufenzhi', thirdItem.fufenzhi);
        item.shijidefen = thirdItem.fufenzhi;
        thirdItem.canHover = true;
      } else {
        this.$set(thirdItem, 'selectFufenzhi', '');
        item.shijidefen = '';
        thirdItem.canHover = false;
      }
    },
    checkScore() {
      // 检查实际得分是否为空
      let newArr = [];
      this.shipInfos.forEach((item1) => {
        item1.items.forEach((item2) => {
          newArr.push(item2);
          item2.isError = false;
          if (item2.shijidefen === '') {
            this.$message({
              message: '请输入实际得分',
              type: 'warning'
            });
            item2.isError = true;
          }
        });
      });
      this.hasEmpty = newArr.some(item => item.shijidefen === '');
    },
    calcScore() {
      this.checkScore();
      if (this.hasEmpty) {
        return;
      }
      this.showResultModel = true;
      $http
        .post('/sdkseaunion/ratingApi/addRatingItems', {
          data: JSON.stringify(this.shipInfos),
          weightSumScore: this.weightSumScore,
          shipName: this.$route.params.name,
          chuanbojingyingren: this.$route.params.shipPerson
        })
        .then((res) => {
          if (res.status === 200) {
            this.resultDesc = res.data.data.desc;
            this.rateLevel = parseInt(res.data.data.xingji, 10);
          }
        });
    },
    viewScore() {
      this.showResultModel = true;
      $http
        .get('/sdkseaunion/ratingApi/ratingMesView', {
          params: {
            weiyibiaoshi: this.$route.params.id
          }
        })
        .then((res) => {
          if (res.status === 200) {
            this.resultDesc = res.data.data.desc;
            this.rateLevel = parseInt(res.data.data.xingji, 10);
          }
        });
    },
    submitAddScore() {
      this.checkScore();
      if (this.hasEmpty) {
        return;
      }
      $http
        .post('/sdkseaunion/ratingApi/addRatingItems', {
          data: JSON.stringify(this.shipInfos),
          weightSumScore: this.weightSumScore,
          shipName: this.$route.params.name,
          chuanbojingyingren: this.$route.params.shipPerson
        })
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            this.$router.push({
              path: '/rateList'
            }); 
          }
        });
    },
    backToList() {
      this.$router.push({
        path: '/rateList'
      }); 
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
a {
	cursor: pointer;
}
.rate-score-wrapper {
	width: 1280px;
	min-height: calc(100vh - 100px);
	margin: 20px auto;
	background: #fff;
}
.page-top {
	position: relative;
	height: 80px;
	border-bottom: 1px solid #e6e6e6;
	padding: 0 24px;
	.btn-blue {
		position: absolute;
		top: 30px;
		right: 10px;
	}
	.title {
		height: 26px;
		line-height: 26px;
		color: #000;
		font-size: 18px;
		.ship-name {
			display: inline-block;
			height: 30px;
			margin-left: 10px;
			padding: 0 10px;
			color: #0050B3;
			font-size: 14px;
			background: #EAF7FF;
			font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
			.icon-ship {
				display: inline-block;
				width: 22px;
				height: 22px;
				background: url('../../assets/images/icon-ship.png') no-repeat left top;
				background-size: 100% 100%;
				vertical-align: middle;
				margin-right: 6px;
			}
		}
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
			font-size: 14px;
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
		&.is-empty {
			color: #f00;
		}
	}
	.actual-score {
		width: 160px;
		border-right: 1px solid #eee;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 8px;
		font-size: 18px;
		font-weight: bold;
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
						// display: none;
						width: 18px;
						height: 18px;
						background: url('../../assets/images/icon-checknot.png');
						&.is-checked {
							background: url('../../assets/images/icon-checked.png');
						}
					}

					&.hover {
						background: rgba(27, 133, 255, 0.1);
						.lecturer {
							color: #005bac;
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
.el-pagination {
	text-align: right;
	margin-top: 10px;
}
/* 模态弹窗 */
.model-wrapper {
	.model {
		position: fixed;
		left: 50%;
		top: 50%;
		z-index: 10;
		width: 550px;
		background: #fff;
		padding: 30px 0;
		margin: -192px 0 0 -192px;
		box-shadow: 0 12px 24px 0 rgba(28, 31, 33, 0.1);
		border-radius: 4px;
		transition: all 0.2s;
		-webkit-transition: all 0.2s;
		text-align: center;
	}
	.name {
		height: 60px;
		line-height: 60px;
		font-size: 22px;
		color: #333;
	}
	.result {
		height: 60px;
		line-height: 60px;
		font-size: 20px;
		color: #00ae65;
		font-weight: bold;
	}
	.rate {
		margin: 10px 0 32px 0;
		/deep/ .iconfont {
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
.link {
	margin-right: 5px;
	font-size: 12px;
}
</style>
