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
      deductionItem: [],
      deduction: [],
      totalItem: []
    };
  },
  mounted() {
    this.queryMaritimeSupervision();
  },
  methods: {
    queryMaritimeSupervision() {
      $http.get('/sdkseaunion/portalApi/maritimeSupervisionStatistics').then((res) => {
        if (res.data.status === 200) {
          this.deduction = res.data.data.deduction; // x轴文字 
          this.deductionItem = res.data.data.deductionItem;  
          this.totalItem = res.data.data.totalItem;
          this.initEhart();
        }
      });
    },
    initEhart() {
      let myChart = echarts.init(this.$refs.myChart);
      // 绘制图表
      let data = this.totalItem;// 参与评级船舶
      let data1 = this.deductionItem;// 扣分船舶
      let data2 = [];// 占比
      data.forEach((item, index) => {
        data2.push((data1[index] / item * 100).toFixed(2));
      });
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: '' // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: ['参与评级船舶', '扣 分 船 舶', '占比']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top:'14%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#808eb7',
              width: 2
            }
          },
          
          data: this.deduction,
        },
        yAxis: [{
          type:'value',
          axisLine: {
            lineStyle: {
              color: '#808eb7',
              width: 2
            }
          },
          splitLine:{
            show:false
          }
        }, {
          type:'value',
          name:'%',
          axisLine: {
            lineStyle: {
              color: '#808eb7',
              width: 2
            }
          },
          splitLine:{
            show: false
          }
        }],
        series: [{
          name: '参与评级船舶',
          type: 'bar',
          stack: '船舶',
          barMaxWidth: 15,
          yAxisIndex: 0,
          data: this.totalItem,
          itemStyle: {
            normal: {
              color: '#63DAAB'
            },
          },
        },
        {
          name: '扣 分 船 舶',
          type: 'bar',
          stack: '船舶',
          barMaxWidth: 15,
          yAxisIndex: 0,
          data: this.deductionItem,
          itemStyle: {
            normal: {
              color: '#6396FA'
            },
          },
        },
        {
          name: '占比',
          yAxisIndex: 1,
          data: data2,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#F7C122',
            },
          },
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
