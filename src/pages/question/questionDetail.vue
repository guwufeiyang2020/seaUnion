<template>
	<div class="rate-score-wrapper">
		<div class="page-top">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: `/questionList/${$route.params.wenjuanleixing}` }"
					>问卷检查</el-breadcrumb-item
				>
				<el-breadcrumb-item
					>{{ $route.params.mode === 'add' ? '新增' : '查看' }}问卷</el-breadcrumb-item
				>
			</el-breadcrumb>
			<div class="title-wrapper">
				<h2 class="title">{{ $route.params.mode === 'add' ? '新增' : '查看' }}问卷</h2>
				<div class="button-box" v-if="$route.params.mode === 'view'">
					<a class="btn-blue" :href="`/sdkseaunion/execlExportApi/inspectExport?weiyibiaoshi=${$route.params.id}`">导出问卷</a>
					<a class="btn-default" :href="`/sdkseaunion/execlExportApi/inspectDeductedExport?weiyibiaoshi=${$route.params.id}`">导出扣分清单</a>
				</div>
			</div>
		</div>
		<div class="page-body">
			<h1 class="question-title">{{ queryQuestionInfo.title }}</h1>
			<el-form ref="baseInfoForm" :model="baseInfoForm" label-width="240px">
				<el-form-item label="船舶名称">
					<el-input
						v-model="baseInfoForm.shipName"
						:disabled="theShipInfo.zhongwenchuanming !== ''"
					></el-input>
				</el-form-item>
				<el-form-item label="船舶识别号码">
					<el-input
						v-model="baseInfoForm.shipCode"
						:disabled="theShipInfo.chuanboshibiehaoma !== ''"
					></el-input>
				</el-form-item>

				<el-form-item label="船舶种类 (闪点)">
					<el-input
						v-model="baseInfoForm.shipType"
						:disabled="theShipInfo.chuanboleixing !== ''"
					></el-input>
				</el-form-item>

				<el-form-item label="总吨位/载重吨">
					<el-input
						v-model="baseInfoForm.totalWeight"
						:disabled="theShipInfo.zongdun !== ''"
					></el-input>
				</el-form-item>
				<el-form-item label="检查人员(签字)">
					<el-input v-model="baseInfoForm.checkPerson" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="船检机构">
					<el-input
						v-model="baseInfoForm.substituInstitution"
						:disabled="$route.params.mode === 'view'"
					></el-input>
				</el-form-item>
				<el-form-item label="安放龙骨时间">
					<el-date-picker
						v-model="baseInfoForm.setKeelTime"
						type="datetime"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
						format="yyyy-MM-dd HH:mm:ss"
						:disabled="$route.params.mode === 'view'"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="检查日期">
					<el-date-picker
						v-model="baseInfoForm.examDate"
						type="datetime"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
						format="yyyy-MM-dd HH:mm:ss"
						:disabled="$route.params.mode === 'view'"
					></el-date-picker>
				</el-form-item>

				<el-form-item label="本次检查共扣分(根据下方扣分项计算得出)">
					{{ totalMarks }}
				</el-form-item>

				<el-form-item label="本次检查评估等级（根据扣分项计算）">
					{{ assessLevel }}
				</el-form-item>
			</el-form>
			<div v-for="(item, index) in queryQuestionInfo.items" :key="index">
				<h3>{{ item.key }}</h3>
				<div class="table-wrapper">
					<li class="table-header">
						<div>序号</div>
						<div>内容及说明</div>
						<div>权重</div>
						<div>扣分</div>
						<div>附件</div>
					</li>
					<ul class="table-body">
						<li class="table-item" v-for="(subItem, subIndex) in item.subList" :key="subIndex">
							<div>{{ subItem.xuhao }}</div>
							<div>{{ subItem.neirongjishuoming }}</div>
							<div>{{ subItem.quanzhong }}</div>
							<div>
								<span v-if="$route.params.mode === 'view'">{{ subItem.koufen }}</span>
								<el-radio-group
									v-model="subItem.shifoushiyong"
									@change="handleDeductMarks(subItem)"
									v-if="$route.params.mode === 'add'"
								>
									<el-radio :label="1">
										<el-input-number
											:disabled="subItem.inputNumDisabled"
											v-model="subItem.koufen"
											controls-position="right"
											@change="handleMarksChange(subItem.koufen)"
											size="mini"
											:step="1"
											:min="0"
											:max="+subItem.quanzhong"
										></el-input-number>
									</el-radio>
									<el-radio :label="0">不适用</el-radio>
								</el-radio-group>
							</div>
							<div>
								<a class="a-accessory"
									v-if="$route.params.mode === 'view' && subItem.fujian && subItem.fujian.fileName"
									@click="viewPic(subItem)">
									{{ subItem.fujian.fileName }}
								</a>
								<el-upload
									v-if="$route.params.mode === 'add'"
									class="upload-demo"
									:limit="1"
									:on-exceed="handleExceed"
									:on-preview="handlePreview"
									:data="uploadParams(subItem)"
									:action="uploadUrl()"
									:on-remove="(file, fileList) => { return handleRemove(file, fileList, subItem); }"
									:on-success="(res, file, fileList) => {return handleSuccess(res, file, fileList, subItem); }"
								>
									<el-button size="small" type="text">点击上传</el-button>
								</el-upload>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="button-area" v-if="$route.params.mode === 'add'">
			<el-button type="primary" :loading="loading" @click="submitClick">提交</el-button>
			<el-button @click="cancleClick">取消</el-button>
		</div>
		<!-- 图片预览 -->
		<div class="mask" v-if="isPicView">
			<img :src="picUrl" />
			<span class="icon-close" @click="isPicView = false">
				<i></i>
			</span>
		</div>
	</div>
</template>

<script>
import { $http } from '@commonbox/utils';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      baseInfoForm: {
        shipName: '',
        shipCode: '',
        shipType: '',
        setKeelTime: '',
        totalWeight: '',
        substituInstitution: '',
        examDate: '',
        checkPerson: ''
      },
      theShipInfo: {},
      queryQuestionInfo: {},
      shipCode: '',

      isPicView: false,
      picUrl: '',
      loading: false
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    uploadParams() {
      return (subItem) => {
        let params = {
          weiyibianhao: this.shipCode,
          questionNo: subItem.questionNo
        };
        return params;
      };
    },
    totalMarks() {
      let total = 0;
      if (
        this.queryQuestionInfo
				&& this.queryQuestionInfo.items
				&& this.queryQuestionInfo.items.length > 0
      ) {
        this.queryQuestionInfo.items.forEach((item1) => {
          item1.subList.forEach((item2) => {
            if (item2.shifoushiyong === 1) {
              total += item2.koufen;
            }
          });
        });
      }
      return total;
    },
    assessLevel() {
      let total = 0;
      let level = '不合格';
      if (
        this.queryQuestionInfo
				&& this.queryQuestionInfo.items
				&& this.queryQuestionInfo.items.length > 0
      ) {
        this.queryQuestionInfo.items.forEach((item1) => {
          item1.subList.forEach((item2) => {
            if (item2.shifoushiyong === 1) {
              total += item2.koufen;
              if (total <= 5) {
                level = '优秀';
              } else if (total > 5 && total <= 20) {
                level = '合格';
              } else {
                level = '不合格';
              }
            }
          });
        });
      }
      return level;
    }
  },
  methods: {
    async queryShipInfo() {
      const queryParams = {
        searchName: this.$route.params.name
      };
      let { data } = await $http.get('/sdkseaunion/dataSourceApi/getShipList', {
        params: queryParams
      });
      let theShip = data.data.filter(item => item.zhongwenchuanming === this.$route.params.name);
      this.theShipInfo = theShip[0];
      this.baseInfoForm.shipName = this.theShipInfo.zhongwenchuanming;
      this.baseInfoForm.shipCode = this.theShipInfo.chuanboshibiehaoma;
      this.baseInfoForm.shipType = this.theShipInfo.chuanboleixing;
      this.baseInfoForm.totalWeight = `${this.theShipInfo.zongdun} / ${this.theShipInfo.zaizhongdun}`;
    },
    async queryQuestionDeatail() {
      let queryParams = {};
      let url = '';
      if (this.$route.params.mode === 'add') {
        queryParams.searchName = this.$route.params.name;
        queryParams.wenjuanleixing = this.$route.params.wenjuanleixing;
        url = '/sdkseaunion/inspectApi/getQuestionnaireItems';
      } else {
        queryParams.weiyibiaoshi = this.$route.params.id;
        url = '/sdkseaunion/inspectApi/getQuestionnaireByNo';
      }
      let { data } = await $http.get(url, {
        params: queryParams
      });
      // console.log('查询返回结果', data.data);

      if (this.$route.params.mode === 'view') {
        this.baseInfoForm = data.data.biaotiItems;
        this.queryQuestionInfo.title = data.data.title;
        this.queryQuestionInfo.items = data.data.items;
      } else {
        this.queryQuestionInfo = data.data;
        this.queryQuestionInfo.items.forEach((item1) => {
          item1.subList.forEach((item2) => {
            this.$set(item2, 'shifoushiyong', 1);
          });
        });
      }
      this.shipCode = this.queryQuestionInfo.weiyibianhao;
    },
    handleDeductMarks(subItem) {
      subItem.koufen = 0;
      if (subItem.shifoushiyong === 0) {
        this.$set(subItem, 'inputNumDisabled', true);
      } else if (subItem.shifoushiyong === 1) {
        this.$set(subItem, 'inputNumDisabled', false);
      }
    },
    //
    handleMarksChange(val) {
      // console.log('扣分值', val);
      /* this.queryQuestionInfo.items.forEach(item1 => {
				item1.subList.forEach(item2 => {
				 if (item2.num) {
						this.baseInfoForm.totalDeductMarks += item2.num;
					}
				});
			}); */
    },
    // 上传相关
    uploadUrl() {
      return '/sdkseaunion/inspectApi/uploadQuestionImage';
    },
    handleExceed(files, fileList) {
      this.$message.warning('只能上传一张图片');
    },
    handlePreview(file) {
      this.picUrl = file.response.data.fileUrl;
      this.isPicView = true;
    },
    viewPic(item) {
      this.picUrl = item.fujian.fileUrl;
      this.isPicView = true;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isJPG || !isPNG) {
        this.$message.error('上传头像图片只能是jpg格式或者png格式!');
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isJPG && isLt5M;
    },
    handleRemove(file, fileList, subItem) {
      $http
        .post('/sdkseaunion/inspectApi/delQuestionImage', {
          weiyibianhao: this.shipCode,
          questionNo: subItem.questionNo
        })
        .then((rspData) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
    },
    handleSuccess(res, file, fileList, subItem) {
      // console.log('上传成功');
    },
    backToList() {
      this.$router.push({
        path: `/questionList/${this.$route.params.wenjuanleixing}`
      });
    },
    // 提交
    submitClick() {
      this.loading = true;
      let deductMarks = [];
      let totalWeight = 0;
      this.queryQuestionInfo.items.forEach((item1) => {
        item1.subList.forEach((item2) => {
          if (item2.quanzhong) {
            totalWeight += parseInt(item2.quanzhong, 10);
          }
          if (item2.koufen > 0) {
            deductMarks.push(item2);
          }
        });
      });
      if (this.baseInfoForm.substituInstitution === '') {
        this.$message({
          message: '请输入船检机构',
          type: 'warning'
        });
        this.loading = false;
        return;
      }
      if (this.baseInfoForm.setKeelTime === '') {
        this.$message({
          message: '请选择安放龙骨日期',
          type: 'warning'
        });
        this.loading = false;
        return;
      }
      if (this.baseInfoForm.examDate === '') {
        this.$message({
          message: '请选择检查日期',
          type: 'warning'
        });
        this.loading = false;
        return;
      }
      this.baseInfoForm.totalDeductMarks = this.totalMarks;
      this.baseInfoForm.assessLevel = this.assessLevel;
      let resultObj = {
        jsonheaddata: JSON.stringify(this.baseInfoForm),
        title: this.queryQuestionInfo.title,
        weiyibiaoshi: this.queryQuestionInfo.weiyibianhao,
        jsondata: JSON.stringify(this.queryQuestionInfo.items),
        jsonkoufen: JSON.stringify(deductMarks),
        zongfen: totalWeight,
        wenjuanleixing: this.$route.params.wenjuanleixing
      };

      $http.post('/sdkseaunion/inspectApi/addQuestionnaireItems', resultObj).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.$router.push({
            path: `/questionList/${this.$route.params.wenjuanleixing}`
          });
        }
      });
    },
    cancleClick() {
      this.$router.push({
        path: `/questionList/${this.$route.params.wenjuanleixing}`
      });
    }
  },
  mounted() {
    this.baseInfoForm.checkPerson = this.userInfo.realName;
    if (this.$route.params.mode === 'add') {
      this.queryShipInfo();
    }

    this.queryQuestionDeatail();
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
.btn-blue , .btn-default{
	display: inline-block;
}
.a-accessory {
	cursor: pointer;
	padding: 4px 0;
	text-decoration: underline;
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
	padding: 20px 30px;
	.question-title {
		height: 40px;
		font-size: 30px;
		line-height: 40px;
		margin-bottom: 15px;
		font-size: 22px;
		text-align: center;
	}
	.el-form {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 10px;
		.el-form-item {
			width: 608px;
			height: 64px;
			border: 1px solid #e6e6e6;
			margin-left: -1px;
			margin-top: -1px;
			margin-bottom: 0;
			/deep/ .el-form-item__label {
				width: 240px;
				height: 62px;
				line-height: 62px;
				color: #333;
				background: #f6f8fa;
				padding-right: 5px;
				font-weight: bold;
				font-size: 12px;
				border-right: 1px solid #e6e6e6;
				text-align: right;
			}
			/deep/ .el-form-item__content {
				padding: 10px;
			}
			/deep/ .el-form-item__error {
				top: 54px;
				z-index: 100;
				left: 7px;
			}
			.el-input {
				width: 346px;
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
	.table-wrapper {
		width: 100%;
		font-size: 14px;
		text-align: left;
		line-height: 36px;
		border: 1px solid #e6e6e6;
	}
	.table-header {
		height: 42px;
		line-height: 40px;
		background: #f6f8fa;
		display: flex;
		border-bottom: 1px solid #e6e6e6;
		div {
			color: #333;
			font-weight: bold;
			padding-left: 10px;
			&:nth-child(1) {
				width: 60px;
				border-right: 1px solid #e6e6e6;
			}
			&:nth-child(2) {
				flex: 1;
				border-right: 1px solid #e6e6e6;
			}
			&:nth-child(3) {
				width: 80px;
				border-right: 1px solid #e6e6e6;
			}
			&:nth-child(4) {
				width: 230px;
				border-right: 1px solid #e6e6e6;
			}
			&:nth-child(5) {
				width: 280px;
			}
		}
	}
	.table-item {
		border-bottom: 1px solid #e6e6e6;
		display: flex;
		&:last-child {
			border-bottom: none;
		}
		& > div {
			color: #333;
			padding: 4px 10px;
			display: flex;
			align-items: center;
			line-height: 26px;
			&:nth-child(1) {
				width: 60px;
				border-right: 1px solid #e6e6e6;
			}
			&:nth-child(2) {
				flex: 1;
				border-right: 1px solid #e6e6e6;
			}
			&:nth-child(3) {
				width: 80px;
				font-weight: bold;
				border-right: 1px solid #e6e6e6;
			}
			&:nth-child(4) {
				width: 230px;
				border-right: 1px solid #e6e6e6;
				/deep/ .el-input-number {
					width: 88px;
				}
			}
			&:nth-child(5) {
				width: 280px;
			}
		}
	}
}
.button-area {
	height: 100px;
	text-align: center;
	padding-top: 20px;
}
/* 模态弹窗 */
.mask {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
	background: rgba(0,0,0 , 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		width: 100vw;
		height: 100vh;
		object-fit: contain;
	}
	.icon-close {
		display: block;
		position: absolute;
		right: 0px;
		top: 0px;
		width: 60px;
		height: 60px;
		background: rgba(0, 0, 0 , 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		&:before {
			content: " ";
		}
		i {
			display: inline-block;
			width: 20px;
			height: 20px;
			background:url('../../assets/images/close.png') no-repeat center center;
			background-size: 100%;
			transition: all 0.3s;
			cursor: pointer;
			&:hover {
				transform: rotate(90deg);
			}
		}
	}
}
</style>
