<template>
	<div class="rate-score-wrapper">
		<h2 class="title">检查问卷</h2>
		<div class="search-area">
			<div class="button-area">
				<button class="btn-blue">添加</button>
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
			<el-table-column label="船舶名称" width="220">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="goRateDetail(scope.row)">{{ scope.row.shipName }}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="checkScore" label="检查评分" width="140"></el-table-column>
			<el-table-column prop="rateTime" label="检查时间" width="140"></el-table-column>
			<el-table-column prop="shipType" label="船型" width="160"></el-table-column>
			<el-table-column prop="affiliatedEnterprise" label="所属企业" width="240"></el-table-column>
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
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[100, 200, 300, 400]"
			:page-size="100"
			layout="total, sizes, prev, pager, next, jumper"
			:total="40"
		></el-pagination>
	</div>
</template>

<script>
import utils from '@/utils/util';

export default {
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
      tableData: [
        {
          id: '01',
          shipName: '舟山号',
          checkScore: '优秀-100',
          rateTime: '2020-08-25 12:00',
          shipType: '10000总吨以上',
          affiliatedEnterprise: '江苏南通货运有限公司 '
        },
        {
          id: '02',
          shipName: '南通号',
          checkScore: '良好-70',
          rateTime: '2020-08-25 12:00',
          shipType: '10000总吨以上',
          affiliatedEnterprise: '江苏南通货运有限公司'
        },
        {
          id: '03',
          shipName: '泰坦尼克号',
          checkScore: '不合格-40',
          rateTime: '2020-08-25 12:00',
          shipType: '10000总吨以上',
          affiliatedEnterprise: '江苏南通货运有限公司 '
        }
      ],
      searchKey: '',
      currentPage: 1
    };
  },
  watch: {
    searchKey() {
      utils.throttle(this.queryRateList());
    }
  },
  methods: {
    queryRateList() {},
    exportQuestionnaire(item) {},
    exportDeductList(item) {},
    editClick(item) {
      this.$router.push({
        path: `/questionDetail/${item.id}/edit`
      });
    },
    goRateDetail(item) {
      this.$router.push({
        path: `/questionDetail/${item.id}/view`
      });
    },
    deleteClick(item) {},
    handleSelectionChange() {},
    handleSizeChange() {},
    handleCurrentChange() {}
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
