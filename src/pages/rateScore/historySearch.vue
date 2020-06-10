<template>
	<div class="rate-score-wrapper">
		<h2 class="title">评级赋分历史记录搜索</h2>
		<el-input placeholder="请输入内容" v-model="searchKey">
			<i slot="prefix" class="el-input__icon el-icon-search"></i>
		</el-input>
		<div class="search-tip-list">
			<span v-for="(item, index) in tipList" :key="index">{{item}}</span>
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      searchKey: '',
      tipList: ['舟山号', '泰坦尼克号', '兴中号']
    };
  },

  methods: {}
};
</script>

<style lang="scss" scoped>
.rate-score-wrapper {
	width: 1280px;
	min-height: calc(100vh - 100px);
	margin: 20px auto;
	background: #fff;
}
.title {
	height: 180px;
	font-size: 20px;
	padding-top: 120px;
	text-align: center;
	color: #262626;
}
.el-input {
	width: 840px;
	height: 50px;
	line-height: 50px;
	margin-left: 220px;
}
.el-input__icon {
	width: 38px;
	font-size: 20px;
}
/deep/ .el-input--prefix {
	.el-input__inner {
		padding-left: 42px;
		height: 50px;
		line-height: 50px;
	}
}
.search-tip-list {
	margin: 20px 0 0 220px;
	span {
		margin-right: 20px;
		padding: 9px 22px;
		background: #eee;
		color: #666;
		cursor: pointer;
	}
}
</style>
