<template>
	<div class="rate-score-wrapper">
		<div class="page-top">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/questionList' }">问卷检查</el-breadcrumb-item>
				<el-breadcrumb-item>{{$route.params.mode === 'edit'? '编辑': '查看'}}问卷</el-breadcrumb-item>
			</el-breadcrumb>
			<div class="title-wrapper">
				<h2 class="title">{{$route.params.mode === 'edit'? '编辑': '查看'}}问卷</h2>
				<div class="button-box">
					<button class="btn-blue">导出问卷</button>
					<button class="btn-default">导出扣分清单</button>
				</div>
			</div>
		</div>
		<div class="page-body">
			<ul class="base-info">
				<li class="info-item">
					<div class="info-label">船舶名称</div>
					<div class="info-value">泰坦尼克号</div>
				</li>
				<li class="info-item">
					<div class="info-label">船舶识别号码</div>
					<div class="info-value">XXXXXX</div>
				</li>
				<li class="info-item">
					<div class="info-label">船舶种类 (闪点)</div>
					<div class="info-value">XXXXXX</div>
				</li>
				<li class="info-item">
					<div class="info-label">安放龙骨时间</div>
					<div class="info-value">2020-05-20</div>
				</li>
				<li class="info-item">
					<div class="info-label">总吨位/载重吨</div>
					<div class="info-value">1000000</div>
				</li>
				<li class="info-item">
					<div class="info-label">船检机构</div>
					<div class="info-value">XXXXXX</div>
				</li>
				<li class="info-item">
					<div class="info-label">检查日期</div>
					<div class="info-value">2020-05-20</div>
				</li>
				<li class="info-item">
					<div class="info-label">本次检查共扣分</div>
					<div class="info-value">12</div>
				</li>
				<li class="info-item">
					<div class="info-label">本次检查评估等级</div>
					<div class="info-value">优秀</div>
				</li>
				<li class="info-item">
					<div class="info-label">检查人员(签字)</div>
					<div class="info-value">调取平台组织架构，选择一人</div>
				</li>
			</ul>
			<h3>一：船舶总体印象</h3>
			<el-table :data="tableData1" style="width: 100%;" border>
				<el-table-column prop="index" label="序号" width="100"></el-table-column>
				<el-table-column prop="content" label="内容及说明" width="700"></el-table-column>
				<el-table-column prop="weight" label="权重" width="160">
					<template slot-scope="scope">
						<span class="bold">{{scope.row.weight}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="deductMarks" label="扣分" width="160">
					<template slot-scope="scope">
						<span class="bold">{{scope.row.deductMarks}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="viewPic(scope.row)">查看图片</el-button>
					</template>
				</el-table-column>
			</el-table>
			<h3>二：船舶靠离泊安全</h3>
			<el-table :data="tableData2" style="width: 100%;" border>
				<el-table-column prop="index" label="序号" width="100"></el-table-column>
				<el-table-column prop="content" label="内容及说明" width="700"></el-table-column>
				<el-table-column prop="weight" label="权重" width="80">
					<template slot-scope="scope">
						<span class="bold">{{scope.row.weight}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="deductMarks" label="扣分" width="240">
					<template slot-scope="scope">
						<span class="bold">{{scope.row.deductMarks}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="viewPic(scope.row)">查看图片</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="button-area" v-if="$route.params.mode === 'edit'">
			<button class="btn-blue">提交</button>
			<button class="btn-default">取消</button>
		</div>
	</div>
</template>

<script>
import { $http } from '@commonbox/utils';

export default {
  data() {
    return {
      editValue: '',
      showResult: false,
      tableData1: [
        {
          index: '1.1',
          content: '露天甲板的整体状况，外观和清洁情况是否令人满意？',
          weight: '2',
          deductMarks: '2'
        },
        {
          index: '1.2',
          content:
						'作业前是否根据需要与码头方按照规定的内容召开作业安全会议并留有记录，联合开展安全检查，确认各项安全、防污染措施落实到位？',
          weight: '4',
          deductMarks: '不适用'
        }
      ],
      tableData2: [
        {
          index: '1.1',
          content: '露天甲板的整体状况，外观和清洁情况是否令人满意？',
          weight: '2',
          deductMarks: '2'
        },
        {
          index: '1.2',
          content:
						'作业前是否根据需要与码头方按照规定的内容召开作业安全会议并留有记录，联合开展安全检查，确认各项安全、防污染措施落实到位？',
          weight: '4',
          deductMarks: '不适用'
        }
      ]
    };
  },

  methods: {
    viewPic(item) {},
    async queryShipDeatail() {
      let { data } = await $http.get('/sdkseaunion/ratingApi/getRatingItems');
      this.shipInfos = data.data;
      this.shipInfos.forEach((item1) => {
        item1.items.forEach((item2) => {
          Vue.set(item2, 'isVerify', false);
        });
      });
    },
    changeVal(e) {
      this.editValue = e.target.innerHTML;
    },
    verifyScore(item) {
      let { subList } = item;
      let allScores = [];
      subList.forEach((subItem) => {
        subItem.thirdList.forEach((thirdItem) => {
          allScores.push(thirdItem.fufenzhi);
        });
      });
      if (!isPositiveInteger(this.editValue)) {
        this.$message({
          type: 'warning',
          message: '请输入正整数'
        });
        return;
      }
      if (allScores.includes(this.editValue)) {
        Vue.set(item, 'isVerify', true);
      } else {
        this.$message({
          type: 'warning',
          message: '实际得分包含于赋分值'
        });
        Vue.set(item, 'isVerify', false);
      }
    },
    backToList() {
      this.$router.push({
        path: '/questionList'
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
	.title-wrapper {
		display: flex;
		justify-content: space-between;
		height: 26px;
	}
	.title {
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
	padding: 30px;
	.base-info {
		width: 1220px;
		height: 216px;
		border: 1px solid #e6e6e6;
		font-size: 13px;
		.info-item {
			float: left;
			width: 609px;
			height: 43px;
			line-height: 42px;
			display: flex;
			color: #333;
			border-bottom: 1px solid #e6e6e6;
			border-right: 1px solid #e6e6e6;
			&:nth-child(2n) {
				border-right: none;
			}
			.info-label {
				width: 200px;
				background: #f6f8fa;
				font-weight: bold;
				border-right: 1px solid #e6e6e6;
				text-align: right;
				padding-right: 20px;
			}
			.info-value {
				flex: 1;
				padding-left: 20px;
			}
		}
	}
	h3 {
		height: 70px;
		padding-top: 10px;
		line-height: 60px;
		font-size: 16px;
		font-weight: bold;
	}
	.bold {
		font-weight: bold;
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
