<template>
	<div class="rate-score-wrapper">
		<div class="page-top">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: `/questionList/${$route.params.wenjuanleixing}` }">问卷检查</el-breadcrumb-item>
				<el-breadcrumb-item>{{ $route.params.mode === 'add' ? '新增' : '查看' }}问卷</el-breadcrumb-item>
			</el-breadcrumb>
			<div class="title-wrapper">
				<h2 class="title">
					{{ $route.params.mode === 'add' ? '新增' : '查看'
					}}{{ $route.params.wenjuanleixing === 'hylmwj' ? '行业自律' : '港口企业' }}问卷
				</h2>
				<div class="button-box" v-if="$route.params.mode === 'view'">
					<a
						class="btn-blue"
						:href="`/sdkseaunion/execlExportApi/inspectExport?weiyibiaoshi=${$route.params.id}`"
					>导出问卷</a>
					<a
						class="btn-default"
						:href="
							`/sdkseaunion/execlExportApi/inspectDeductedExport?weiyibiaoshi=${$route.params.id}`
						"
					>导出扣分清单</a>
				</div>
			</div>
		</div>
		<div class="page-body">
			<h1 class="question-title">{{ queryQuestionInfo.title }}</h1>
			<el-form ref="baseInfoForm" :model="baseInfoForm" label-width="240px">
				<el-form-item label="船舶名称">
					<el-input v-model="baseInfoForm.shipName" :disabled="theShipInfo.zhongwenchuanming !== ''"></el-input>
				</el-form-item>
				<el-form-item label="IMO/MMSI/识别号" class="ship-code-item">
					<span class="icon-require" v-if="theShipInfo.chuanboshibiehaoma === ''">*</span>
					<el-input v-model="baseInfoForm.shipCode" :disabled="theShipInfo.chuanboshibiehaoma !== ''"></el-input>
				</el-form-item>
				<el-form-item label="船舶种类 (闪点)">
					<el-input v-model="baseInfoForm.shipType" :disabled="theShipInfo.chuanboleixing !== ''"></el-input>
				</el-form-item>
				<el-form-item label="总吨位/载重吨">
					<el-input v-model="baseInfoForm.totalWeight" :disabled="theShipInfo.zongdun !== ''"></el-input>
				</el-form-item>
				<el-form-item label="检查人员(签字)">
					<el-input v-model="baseInfoForm.checkPerson" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="船检机构">
					<el-input v-model="baseInfoForm.substituInstitution" :disabled="theShipInfo.chuanjian !== '' || $route.params.mode === 'view' "></el-input>
				</el-form-item>
				<el-form-item label="建造时间">
					<el-date-picker
						v-model="baseInfoForm.setKeelTime"
						type="date"
						placeholder="选择日期"
						value-format="yyyy-MM-dd"
						format="yyyy-MM-dd"
						:disabled="theShipInfo.jianzaoshijian!== '' || $route.params.mode === 'view'"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="检查日期" class="exam-date-item">
					<span class="icon-require" v-if="$route.params.mode === 'add'">*</span>
					<el-date-picker
						v-model="baseInfoForm.examDate"
						type="date"
						placeholder="选择日期"
						value-format="yyyy-MM-dd"
						format="yyyy-MM-dd"
						:disabled="$route.params.mode === 'view'"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="本次检查共扣分(根据下方扣分项计算得出)">
					{{
					$route.params.mode === 'add' ? totalMarks : baseInfoForm.totalDeductMarks
					}}
				</el-form-item>
				<el-form-item label="本次检查评估等级（根据扣分项计算）">
					{{
					$route.params.mode === 'add' ? assessLevel : baseInfoForm.assessLevel
					}}
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
						<div>备注</div>
					</li>
					<ul class="table-body">
						<li class="table-item" v-for="(subItem, subIndex) in item.subList" :key="subIndex">
							<div>{{ subItem.xuhao }}</div>
							<div>
								<span
									@click="viewLaws(subItem)"
									v-if="$route.params.mode === 'view' || !subItem.canEdit"
									class="sub-content"
								>{{ subItem.neirongjishuoming }}</span>
								<el-input
									v-else
									type="textarea"
									:rows="2"
									placeholder="请输入内容"
									v-model="subItem.neirongjishuoming"
								></el-input>
							</div>
							<div>
								<span v-if="$route.params.mode === 'view' || !subItem.canEdit">
									{{
									subItem.quanzhong
									}}
								</span>
								<el-input
									v-else
									placeholder="请输入"
									v-model.number="subItem.quanzhong"
									@blur="validWeight($event)"
								></el-input>
							</div>
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
								<a
									class="a-accessory txt-ellipsis"
									v-if="$route.params.mode === 'view' && subItem.fujian && subItem.fujian.fileName"
									@click="viewPic(subItem)"
								>{{ subItem.fujian.fileName }}</a>
								<el-upload
									v-if="$route.params.mode === 'add'"
									class="upload-demo"
									:limit="1"
									:on-exceed="handleExceed"
									:on-preview="handlePreview"
									:data="uploadParams(subItem)"
									:action="uploadUrl()"
									:on-remove="
										(file, fileList) => {
											return handleRemove(file, fileList, subItem);
										}
									"
									:on-success="
										(res, file, fileList) => {
											return handleSuccess(res, file, fileList, subItem);
										}
									"
								>
									<el-button size="small" type="text">点击上传</el-button>
								</el-upload>
							</div>
							<div>
								<span v-if="$route.params.mode === 'view'">{{ subItem.remark }}</span>
								<el-input
									v-if="$route.params.mode === 'add'"
									type="textarea"
									:rows="2"
									placeholder="请输入内容"
									v-model="subItem.remark"
									@blur="blurTextarea(subItem)"
								></el-input>
							</div>
							<i
								class="icon-del"
								v-if="$route.params.mode === 'add' && subItem.canEdit"
								@click="delItem(item, subIndex)"
							></i>
						</li>
					</ul>
				</div>
				<button v-if="$route.params.mode === 'add'" class="add-item" @click="addItem(item)">
					<i class="icon-add1"></i> 添加评分项
				</button>
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

		<!-- 法律法规弹窗 -->
		<div v-if="lawsDialogVisible">
			<el-dialog
				title="法律法规"
				width="800px"
				:close-on-click-modal="false"
				@close="closeDialogLaws"
				:visible.sync="lawsDialogVisible"
			>
				<p class="laws-content" v-html="lawContent"></p>
			</el-dialog>
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
        checkPerson: '',
        assessLevel: '',
        totalDeductMarks: ''
      },
      theShipInfo: {},
      queryQuestionInfo: {},
      shipCode: '',
      isPicView: false,
      picUrl: '',
      loading: false,

      lawsDialogVisible: false,
      lawContent: ''
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
              if (typeof (item2.koufen) === 'undefined') {
                item2.koufen = 0;
              }
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
              if (this.$route.params.wenjuanleixing === 'mtczwj') {
                if (total <= 5) {
                  level = '优秀';
                } else if (total > 5 && total <= 20) {
                  level = '合格';
                } else {
                  level = '不合格';
                }
              } else if (this.$route.params.wenjuanleixing === 'hylmwj') {
                if (total <= 15) {
                  level = '优秀';
                } else if (total > 15 && total <= 30) {
                  level = '合格';
                } else {
                  level = '不合格';
                }
              }
            }
          });
        });
      }
      return level;
    }
  },
  methods: {
    add0(m) {
      return m < 10 ? `0${m}` : m; 
    },
   	formatDate(needTime) {
  	 	// needTime是整数，否则要parseInt转换
      let time = new Date(needTime);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      let h = time.getHours();
      let mm = time.getMinutes();
 	  	let s = time.getSeconds();
  	  return `${y}-${this.add0(m)}-${this.add0(d)} ${this.add0(h)}:${this.add0(mm)}:${this.add0(s)}`;
   	},

    async viewLaws(item) {
      this.lawContent = '';
      const queryParams = {
        bianhao: item.bianhao
      };
      let { data } = await $http.get('/sdkseaunion/inspectApi/getLegalByQuestion', {
        params: queryParams
      });
      this.lawContent = data.data.msg;
      this.lawsDialogVisible = true;
    },
    closeDialogLaws() {
      this.lawsDialogVisible = false;
    },
    // 添加评分项
    addItem(item) {
      let xuhaoTemp = item.subList[item.subList.length - 1].xuhao;
      let xuhaoTemp1;
      let xuhaoTemp2;
      // 如果有.
      if (xuhaoTemp.indexOf('.') !== -1) {
        xuhaoTemp1 = +xuhaoTemp.split('.')[1] + 1;
        xuhaoTemp2 = `${xuhaoTemp.split('.')[0]}.${xuhaoTemp1}`;
      } else {
        xuhaoTemp2 = `${+xuhaoTemp + 1}`;
      }

      let questionNo1 = item.subList[item.subList.length - 1].questionNo;
      let questionNo2 = +questionNo1.split('-')[1] + 1;
      let questionNo3 = `${questionNo1.split('-')[0]}-${questionNo2}`;

      item.subList.push({
        xuhao: xuhaoTemp2,
        neirongjishuoming: '',
        canEdit: true,
        remark: '',
        quanzhong: '',
        questionNo: questionNo3,
        shifoushiyong: 1,
        koufen: 0
      });
    },
    delItem(item, index) {
      item.subList.splice(index, 1);
    },
    validWeight(event) {
      let val = parseInt(event.target.value, 10);
      let reg = /^[0-9]+$/;
      if (!reg.test(val)) {
        this.$message.warning('输入的权重必须正整数');
      } else if (val > 30) {
        this.$message.warning('输入的权重必须小于30');
      }
    },
    // 提交备注
    blurTextarea(subItem) {
      $http
        .post('/sdkseaunion/inspectApi/addRemarksByQuestionNo', {
          remark: subItem.remark,
          weiyibianhao: this.queryQuestionInfo.weiyibianhao,
          questionNo: subItem.questionNo
        })
        .then((res) => {
          if (res.status === 200) {
            
          }
        });
    },
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
      this.baseInfoForm.substituInstitution = this.theShipInfo.chuanjian;
      this.baseInfoForm.setKeelTime = this.formatDate(this.theShipInfo.jianzaoshijian);
      this.baseInfoForm.totalWeight = `${this.theShipInfo.zongdun} / ${this.theShipInfo.zaizhongdun}`;
    },
    async queryQuestionDeatail() {
      let queryParams = {};
      let url = '';
      if (this.$route.params.mode === 'add') {
        queryParams.shipName = this.$route.params.name;
        queryParams.wenjuanleixing = this.$route.params.wenjuanleixing;
        queryParams.weiyibiaoshi = this.$route.params.id;
        url = '/sdkseaunion/inspectApi/getQuestionnaireItems';
      } else {
        queryParams.weiyibiaoshi = this.$route.params.id;
        url = '/sdkseaunion/inspectApi/getQuestionnaireByNo';
      }
      let { data } = await $http.get(url, {
        params: queryParams
      });
      if (this.$route.params.mode === 'view') {
        this.baseInfoForm = data.data.biaotiItems;
        this.queryQuestionInfo.title = data.data.title;
        this.queryQuestionInfo.items = data.data.items;
      } else {
        // 如果是新增
        this.queryQuestionInfo = data.data;
        this.queryQuestionInfo.items.forEach((item1) => {
          item1.subList.forEach((item2) => {
            if (this.$route.params.mode === 'add') {
              this.$set(item2, 'canEdit', false);
            }
            if (item2.shifoushiyong === 0) {
              this.$set(item2, 'inputNumDisabled', true);
            }
          });
        });
      }
      this.shipCode = this.queryQuestionInfo.weiyibianhao;
    },
    handleDeductMarks(subItem) {
      // shifoushiyong 0 不适用， 1 适用
      if (subItem.shifoushiyong === 0) {
        this.$set(subItem, 'inputNumDisabled', true);
        subItem.koufen = 0;
      } else if (subItem.shifoushiyong === 1) {
        this.$set(subItem, 'inputNumDisabled', false);
      }
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
      if (this.baseInfoForm.shipCode === '') {
        this.$message({
          message: '请输入IMO/MMSI/识别号',
          type: 'warning'
        });
        this.loading = false;
        return;
      }
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
.laws-content {
	line-height: 22px;
}
.rate-score-wrapper {
	width: 1280px;
	min-height: calc(100vh - 100px);
	margin: 20px auto;
	background: #fff;
}
.btn-blue,
.btn-default {
	display: inline-block;
}
.a-accessory {
	width: 260px;
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
			&.ship-code-item,
			&.exam-date-item {
				.icon-require {
					position: absolute;
					left: 2px;
    			top: 12px;
					color: #f00;
				}
			}
			
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
	.add-item {
		height: 40px;
		display: flex;
		align-items: center;
		color: #2465f3;
		cursor: pointer;
		.icon-add1 {
			display: inline-block;
			width: 16px;
			height: 16px;
			margin-right: 5px;
			background: url('../../assets/images/icon-add.png') no-repeat left top;
			background-size: 100% 100%;
		}
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
				width: 120px;
				border-right: 1px solid #e6e6e6;
			}
			&:nth-child(4) {
				width: 230px;
				border-right: 1px solid #e6e6e6;
			}
			&:nth-child(5) {
				width: 180px;
				border-right: 1px solid #e6e6e6;
			}
			&:nth-child(6) {
				width: 200px;
			}
		}
	}

	.table-item {
		border-bottom: 1px solid #e6e6e6;
		display: flex;
		position: relative;
		&:last-child {
			border-bottom: none;
		}
		.icon-del {
			position: absolute;
			right: -22px;
			top: 50%;
			transform: translateY(-50%);
			width: 16px;
			height: 16px;
			background: url('../../assets/images/icon-del.png') no-repeat left top;
			background-size: 100% 100%;
			cursor: pointer;
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
				.sub-content {
					&:hover {
						cursor: pointer;
						color: #0378ff;
						text-decoration: underline;
					}
				}
			}
			&:nth-child(3) {
				width: 120px;
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
				width: 180px;
				border-right: 1px solid #e6e6e6;
			}
			&:nth-child(6) {
				width: 200px;
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
	background: rgba(0, 0, 0, 0.6);
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
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		&:before {
			content: ' ';
		}
		i {
			display: inline-block;
			width: 20px;
			height: 20px;
			background: url('../../assets/images/close.png') no-repeat center center;
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
