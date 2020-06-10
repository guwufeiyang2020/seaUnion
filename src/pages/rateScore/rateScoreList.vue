<template>
	<div class="rate-score-wrapper">
		<h2 class="title">评级赋分</h2>
		<div class="search-area">
			<div class="button-area">
				<button class="btn-blue" @click="addClick">添加</button>
				<button class="btn-default">导入</button>
			</div>
			<div class="search-box">
				<el-date-picker
					size="small"
					v-model="date"
					type="datetimerange"
					:picker-options="pickerOptions"
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
		<el-table
			ref="multipleTable"
			:data="tableData"
			style="width: 100%;"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="60"></el-table-column>
			<el-table-column label="船舶名称" width="160">
				<template slot-scope="scope">
					<el-button
						type="text"
						size="small"
						@click="goRateDetail(scope.row)"
					>{{ scope.row.chuanbomingcheng }}</el-button>
				</template>
			</el-table-column>
			<el-table-column label="风险等级" width="160">
				<template slot-scope="scope">
					<my-rate :score="Number(scope.row.xingji)" disabled />
				</template>
			</el-table-column>
			<el-table-column prop="quanzhongzongfen" label="综合评分" width="100"></el-table-column>
			<el-table-column prop="rateTime" label="评分时间" width="140"></el-table-column>
			<el-table-column prop="shipType" label="船型" width="160"></el-table-column>
			<el-table-column prop="affiliatedEnterprise" label="所属企业" width="220"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="exportQuestionnaire(scope.row)">导出问卷</el-button>
					<el-button type="text" size="small" @click="exportDeductList(scope.row)">导出扣分清单</el-button>
					<el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click="deleteClick(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			v-if="total>10"
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
			<select-ship ref="selectShip" @closeSelectShipDialog="closeSelectShipDialog"></select-ship>
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
      date: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      tableData: [],
      searchKey: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      selectShipDialogVisible: false
    };
  },
  watch: {
    searchKey() {
      utils.throttle(this.queryRateList());
    }
  },
  methods: {
    addClick() {
      this.selectShipDialogVisible = true;
    },
    dialogAddClose() {
      this.$refs.selectShip.resetFields();
    },
    closeSelectShipDialog() {
      this.selectShipDialogVisible = false;
      this.$refs.selectShip.resetFields();
    },
    async queryRateList() {
      const queryParams = {
        startPos: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        searchName: this.searchKey
      };
      if (this.date === '') {
        queryParams.startTime = '';
        queryParams.endTime = '';
      } else {
        queryParams.startTime = utils.myFormatDate(this.date[0]);
        queryParams.endTime = utils.myFormatDate(this.date[1]);
      }
      let { data } = await $http.get('/sdkseaunion/ratingApi/ratingList', {
        params: queryParams
      });
      this.tableData = data.data;
      this.total = Number(this.tableData.length);
      console.log(data);
    },
    exportQuestionnaire(item) {},
    exportDeductList(item) {},
    editClick(item) {
      this.$router.push({
        path: `/rateDetail/${item.weiyibiaoshi}/edit`
      });
    },
    goRateDetail(item) {
      this.$router.push({
        path: `/rateDetail/${item.weiyibiaoshi}/view`
      });
    },
    deleteClick(item) {},
    handleSelectionChange() {},
    handleSizeChange() {},
    handleCurrentChange() {}
  },
  mounted() {
    this.queryRateList();
  }
};
</script>

<style lang="scss" scoped>
.rate-score-wrapper {
	width: 1280px;
	height: 600px;
	margin: 12px auto;
	padding: 0 20px;
	background: #fff;
}
.title {
	height: 60px;
	line-height: 60px;
	color: #000;
	font-size: 18px;
}
.search-area {
	height: 48px;
	display: flex;
	justify-content: space-between;
	.el-input {
		width: 200px;
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
