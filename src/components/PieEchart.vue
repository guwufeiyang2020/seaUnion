<template>
	<div id="chartPie" style="width:400px; height:320px;" ref="echart">echart</div>
</template>

<script>
import echarts from 'echarts';

export default {
  props: {
    echartData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartPie: null
    };
  },
  watch: {
    echartData: {
      handler() {
        this.drawPieChart();
      },
      deep: true
    }
  },
  methods: {
    drawPieChart() {
      this.chartPie = echarts.init(document.getElementById('chartPie'));
      this.chartPie.setOption({
        color: ['#64D5A9', '#5B8FF9', '#647697', '#F6C238', '#E97059'],
        title: {
          text: '到港船舶最新评级',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bolder',
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          backgroundColor: 'rgba(50, 50, 50, 0.7)',
          triggerOn: 'click'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '60%'],
            data: this.echartData
          }
        ]
      });
      // 设置表格的点击事件进行路由的切换
      this.chartPie.on('click', (param) => {
        // console.log(param);
        this.$router.push({
          path: `/rateList/${param.data.star}`
        });
      });
    }
  }
};
</script>
