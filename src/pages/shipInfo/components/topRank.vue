<template>
  <div class="my-rank">
    <div class="my-rank-content" v-for="(item,index) in rankList" :key="index">
      <div class="shipName">{{item.name}}:</div>
      <div class="process-wrapper">
        <i :style="changeStyle(item)"></i>
        <span class="shipNum">{{item.num}}</span>
      </div>
      
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { $http } from '@commonbox/utils';

export default {
  data() {
    return {
      rankList:[],
      pageSize: 5,
      currentPage: 1,
      total: 0,

    };
  },
  computed: {
    changeStyle() {
      return function(item) {
        return `width:${item.num * 2.4}px`;
      };
    }
  },
  created() {
    this.queryShipRank();
  },
  methods: {
    queryShipRank() {
      const queryParams = {
        startPos: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      $http.get('/sdkseaunion/portalApi/shipRanking', {
        params: queryParams
      }).then((res) => {
        if (res.data.status === 200) {
          // console.log('res.data', res.data);
          this.rankList = res.data.data.data;
          this.total = res.data.data.totalCount;
        }
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryShipRank();
    }
  },
  mounted() {
   
  },
};
</script>
<style scoped lang="scss">
.my-rank{
  width: 100%;
  height: 100%;
  .my-rank-content{
    display: flex;
    align-items: center;
    margin-top: 15px;
  }
  .shipName{
    width: 100px;
    text-align: right;
    margin-right: 10px;
  }
  .process-wrapper {
    flex: 1;
  }
  .shipNum{
    width: 30px; 
    margin-left: 10px;
  }
  
  i{
    display: inline-block;
    height: 12px;
    border-radius: 10px;
    background: #5B8FF9;
  }
  .page-num{
    height: 22px;
    line-height: 22px;
    text-align: right;
    margin-right: 30px;
    margin-top: 15px;
    i{
      width: 22px;
      height: 22px;
      text-align: center;
      background: #409EFF;
      border-radius: 2px;
      margin-right: 5px;
      color: cornsilk;
      cursor: pointer;
    }
  }
}
</style>
