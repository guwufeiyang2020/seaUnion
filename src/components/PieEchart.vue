<template>
	<!-- 	<div id="chartPie" style="width:100%; height: 80%;" ref="echart">加载中</div> -->
	<div id="chartPie" style="width:280px; height:200px;" ref="echart">加载中</div>
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
        color: ['#1B85FF', '#64D5A9', '#647697', '#5B8FF9', '#F6C238', '#E97059'],
        // title: {
        //   text: '到港船舶最新评级',
        //   textStyle: {
        //     fontSize: 16,
        //     fontWeight: 'bolder',
        //     color: '#333'
        //   }
        // },
        grid: {
          top: '20%',
          left: '1%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          backgroundColor: 'rgba(50, 50, 50, 0.7)'
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
        if (param.data.star === 0) {
          return;
        }
        /* this.$router.push({
          path: `/rateList/${param.data.star}`
        }); */
        let routeUrl = this.$router.resolve({
          path: `/rateList/${param.data.star}`
        });
        window.open(routeUrl.href, '_blank');
      });
    }
  }
};
</script>
