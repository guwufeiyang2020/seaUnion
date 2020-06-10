<template>
	<div id="chartPie" style="width:400px; height:320px;" ref="echart">echart</div>
</template>

<script>
import echarts from 'echarts';

export default {
  data() {
    return {
      chartPie: null,
      opinionData: [
        { value: 123, name: '最低风险' },
        { value: 299, name: '四星风险' },
        { value: 427, name: '三星风险' },
        { value: 108, name: '二星风险' },
        { value: 12, name: '最高风险' }
      ]
    };
  },
  methods: {
    initChart() {
      if (this.chartPie) {
        this.chartPie.setOption(this.options);
      } else {
        this.chartPie = echarts.init(this.$refs.echart);
        this.chartPie.setOption(this.options);
      }
    },
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
            data: this.opinionData
          }
        ]
      });
    }
  },
  mounted() {
    this.drawPieChart();
  }
};
</script>
