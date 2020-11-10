<template>
  <div ref='myChart' class="my-charts">
  </div>
</template>

<script>
import echarts from 'echarts';
import { $http } from '@commonbox/utils';

export default {
  data() {
    return {
      dates: [],
      hylmwjs: [],
      mtczwjs: []
    };
  },
  computed: {
  },
  mounted() {
    this.queryQuestionStatistics();
  },
  methods: {
    queryQuestionStatistics() {
      $http.get('/sdkseaunion/portalApi/questionStatistics').then((res) => {
        if (res.data.status === 200) {
          this.dates = Object.keys(res.data.data);
          let questionStatistics = Object.values(res.data.data);
          questionStatistics.forEach((item) => {
            this.hylmwjs.push(item.hylmwj);
            this.mtczwjs.push(item.mtczwj);
          });
          this.initEhart();
        }
      });
    },
    initEhart() {
      let myChart = echarts.init(this.$refs.myChart);
      // 绘制图表
      let option = {
        color:['#30BF78', '#F6BD16'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '0',
          top:'20%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['TQC检查问卷', '码头船长检查问卷'],
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.dates
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine:{
              show:false
            }
          }
        ],
        series: [
          {
            name: 'TQC检查问卷',
            type: 'line',
            areaStyle: {
              color:'none'
            },
            data: this.hylmwjs,
            smooth:true,
          },
          {
            name: '码头船长检查问卷',
            type: 'line',
            areaStyle: {
              color:'none'
            },
            data: this.mtczwjs,
            smooth:true,
          },
          

        ]
      };
      myChart.setOption(option);
    }
  },
};
</script>
<style scoped lang="scss">
.my-charts{
  width: 100%;
  height: 200px;
}
</style>
