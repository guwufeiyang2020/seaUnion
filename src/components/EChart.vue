<template>
	<div style="width: 100%; height: 100%" id="echart">加载中</div>
</template>

<script>
import echarts from 'echarts';

export default {
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          xData: [],
          series: []
        };
      }
    },
    isAxisChart: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    options() {
      return this.isAxisChart ? this.axisOption : this.normalOption;
    }
  },
  watch: {
    chartData: {
      handler() {
        this.initChart();
      },
      deep: true
    }
  },
  data() {
    return {
      echart: null,
      axisOption: {
        grid: {
          top: '16%', // 等价于 y: '16%'
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          axisLabel: {
            color: '#fff'
          }
        },
        yAxis: [
          {
            type: 'value',
            minInterval: 1,
            axisLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.2)'
              }
            },
            axisLabel: {
              color: '#fff'
            },
            splitLine: {
              //  改变轴线颜色
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          }
        ],
        color: ['#5b8df4'],
        series: []
      },
      normalOption: {
        tooltip: {
          trigger: 'item'
        },
        color: ['#0f78f4', '#dd536b', '#9462e5', '#a6a6a6', '#e1bb22', '#39c362', '#3ed1cf'],
        series: []
      }
    };
  },
  methods: {
    initChart() {
      this.initChartData();
      if (this.echart) {
        this.echart.setOption(this.options);
      } else {
        this.echart = echarts.init(document.getElementById('echart'));
        this.echart.setOption(this.options);
      }
      this.echart.on('click', (param) => {
        this.$emit('openPopup', param);
      });
    },
    initChartData() {
      if (this.isAxisChart) {
        this.axisOption.xAxis.data = this.chartData.xData;
        this.axisOption.series = this.chartData.series;
        this.axisOption.legend = this.chartData.legend;
      } else {
        this.normalOption.series = this.chartData.series;
      }
    },
    resizeChart() {
      this.echart ? this.echart.resize() : '';
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeChart);
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeChart);
  }
};
</script>

<style lang="scss" scoped></style>
