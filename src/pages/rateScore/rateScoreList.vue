<template>
	<div class="rate-score-wrapper">
		<h2 class="title">评级赋分</h2>
		<ul class="tab-box">
			<li
				class="tab-item"
				:class="{'active': labelType === 'distinct'}"
				@click="changeLabelType('distinct')"
			>
				<span>最新记录</span>
			</li>
			<li class="tab-item" :class="{'active': labelType === 'all'}" @click="changeLabelType('all')">
				<span>历史数据</span>
			</li>
		</ul>
		<div class="search-area">
			<div class="button-area">
				<button
					class="btn-blue"
					@click="addClick"
					v-if="buttonPermissions && buttonPermissions.length > 0 && buttonPermissions.includes('add')"
				>添加</button>
				<a class="btn-white"
					v-if="buttonPermissions && buttonPermissions.length > 0 && buttonPermissions.includes('export')"
					:href="`/sdkseaunion/execlExportApi/exportRatingList?labelType=${this.labelType}&searchName=${this.searchKey}&star=${this.$route.params.star || ''}&xingjiSearch=${this.xingjiSearch}&startTime=${this.date ? this.date[0]: ''}&endTime=${this.date ? this.date[1]: ''}`"
				>导出</a>
				<el-upload
					v-if="buttonPermissions && buttonPermissions.length > 0 && buttonPermissions.includes('import')"
					class="upload-demo"
					:action="uploadUrl()"
					:show-file-list="false"
					:on-success="handleSuccess"
					accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
				>
					<el-button size="small" plain>导入</el-button>
					<div slot="tip" class="el-upload__tip">只能上传xlsx/xls文件</div>
				</el-upload>
			</div>
			<div class="search-box">
				<el-select v-model="xingjiSearch" placeholder="请选择作业情况" size="small" clearable>
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
				<el-date-picker
					size="small"
					v-model="date"
					type="daterange"
					:picker-options="pickerOptions"
					value-format="yyyy-MM-dd"
					format="yyyy-MM-dd"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					align="left"
				></el-date-picker>
				<el-input
					size="small"
					clearable
					placeholder="搜索船舶名称、所属企业"
					suffix-icon="el-icon-search"
					v-model="searchKey"
				></el-input>
			</div>
		</div>
		<el-table :data="tableData" style="width: 100%;">
			<el-table-column label="船舶名称" width="200">
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
			<el-table-column prop="quanzhongzongfen" label="综合评分" width="140"></el-table-column>
			<el-table-column prop="pingfenshijian" label="评分时间" width="160"></el-table-column>
			<el-table-column prop="chuanxing" label="船型" width="180"></el-table-column>
			<el-table-column prop="chuanbojingyingren" label="所属企业" width="260"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<a
						class="link"
						:href="
							`/sdkseaunion/execlExportApi/ratingExport?weiyibiaoshi=${scope.row.weiyibiaoshi}`
						"
					>导出</a>
					<el-button
						v-if="scope.row.buttonJurisdiction && scope.row.buttonJurisdiction.length > 0 && scope.row.buttonJurisdiction.includes('delete')"
						type="text"
						size="small"
						@click="deleteClick(scope.row)"
					>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[10, 20, 50, 100]"
			:page-size="pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
		></el-pagination>

		<el-dialog
			title="请选择船舶"
			width="520px"
			:close-on-click-modal="false"
			@close="dialogAddClose"
			:visible.sync="selectShipDialogVisible"
		>
			<select-ship
				ref="selectShip"
				:jumpFrom="'rateList'"
				@closeSelectShipDialog="closeSelectShipDialog"
				@saveSelectShipDialog="saveSelectShipDialog"
			></select-ship>
		</el-dialog>
	</div>
</template>

<script>
import MyRate from '@/components/Rate';
import utils from '@/utils/util';
import { $http } from '@commonbox/utils';
import SelectShip from './selectShip';

export default {
  components: { MyRate, SelectShip },
  data() {
    return {
      rateTable: [{}],
      options: [{
        value: '允许作业',
        label: '允许作业'
      }, {
        value: '不允许作业',
        label: '不允许作业'
      }],
      xingjiSearch: '',
      date: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
     
      tableData: [],
      searchKey: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      selectShipDialogVisible: false,
      labelType: 'distinct',
      buttonPermissions: []
    };
  },
  watch: {
    xingjiSearch() {
      this.currentPage = 1;
      utils.throttle(this.queryRateList());
    },
    searchKey() {
      this.currentPage = 1;
      utils.throttle(this.queryRateList());
    },
    date() {
      this.currentPage = 1;
      utils.throttle(this.queryRateList());
    }
  },
  methods: {
    // execl-上传相关
    uploadUrl() {
      return '/sdkseaunion/execlImportApi/importRating';
    },
    handleSuccess(response, file, fileList) {
      if (response.status === 500) {
        this.$message({
          type: 'warning',
          message: response.errormsg
        });
        return;
      }
      if (response.status === 200) {
        this.$message({
          type: 'success',
          message: '导入成功!'
        });
        this.queryRateList();
      }
    },
    addClick() {
      this.selectShipDialogVisible = true;
    },
    dialogAddClose() {
      this.selectShipDialogVisible = false;
    },
    closeSelectShipDialog() {
      this.selectShipDialogVisible = false;
    },
    saveSelectShipDialog(shipName, shipPerson) {
      this.selectShipDialogVisible = false;
      this.$router.push({
        path: `/rateDetail/add/${shipPerson}/${shipName}`
      }); 
    },
    changeLabelType(type) {
      this.currentPage = 1;
      this.labelType = type;
      this.queryRateList();
    },
    async queryRateList() {
      const queryParams = {
        startPos: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        searchName: this.searchKey,
        star: this.$route.params.star,
        labelType: this.labelType,
        xingjiSearch: this.xingjiSearch
      };
      if (this.date) {
        queryParams.startTime = this.date[0];
        queryParams.endTime = this.date[1];
      }
      let { data } = await $http.get('/sdkseaunion/ratingApi/ratingList', {
        params: queryParams
      });
      this.tableData = data.data;
      this.total = data.totalCount;
      this.buttonPermissions = data.headButton;
    },
    goRateDetail(item) {
      this.$router.push({
        path: `/rateDetail/view/${item.chuanbojingyingren}/${item.chuanbomingcheng}/${item.weiyibiaoshi}`
      }); 
    },
    deleteClick(item) {
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
              this.queryRateList();
            });
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryRateList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryRateList();
    }
  },
  mounted() {
    this.queryRateList();
  }
};
</script>

<style lang="scss" scoped>
.rate-score-wrapper {
	width: 1280px;
	margin: 12px auto;
	padding: 0 20px;
	overflow: hidden; // bfc
	background: #fff;
	min-height: calc(100vh - 84px);
}
.title {
	height: 60px;
	line-height: 60px;
	color: #000;
	font-size: 18px;
}
.el-pagination {
	margin: 10px 0;
}
.link {
	font-size: 12px;
	margin-right: 10px;
	color: #409eff;
}

.search-area {
	height: 48px;
	display: flex;
	justify-content: space-between;
	.el-select {
		width: 180px;
		margin-right: 10px;
	}
	.button-area {
		display: flex;
	}
	.upload-demo {
		display: flex;
		.el-upload__tip {
			margin-left: 5px;
		}
	}
	.el-input {
		width: 200px;
    margin-left: 10px;
	}
	.el-date-editor--datetimerange.el-input__inner {
		width: 350px;
		margin-right: 10px;
	}
	/deep/ .el-date-editor .el-range-separator {
		padding: 0;
	}
}
</style>
