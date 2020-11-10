<template>
  <div ref='myChart' class="my-charts">
  </div>
</template>
<script>
import echarts from 'echarts';
import { $http } from '@commonbox/utils';

import FireImage from '../img/chuanbo@2x.png';
import banImage from '../img/gangqu@2x.png';
import cicleImage from '../img/hutonglijiao@2x.png';
import cirledianImage from '../img/kuqu@2x.png';
import diggingImage from '../img/qingbaoban@2x.png';
import guixiaImage from '../img/shigong@2x.png';
import lightingImage from '../img/yanghu@2x.png';

export default {
  data() {
    return {
      classIndex: 0,
      tqcDeductionNames: [],
      tqcDeductionStatistics: []
    };
  },
  mounted() {
    this.queryTqcDeductionStatistics();
  },
  methods: {
    queryTqcDeductionStatistics() {
      $http.get('/sdkseaunion/portalApi/tqcDeductionStatistics').then((res) => {
        if (res.data.status === 200) {
          this.tqcDeductionStatistics = res.data.data.deductionItem;
          this.tqcDeductionNames = res.data.data.deduction;
          this.initEhart();
        }
      });
    },
    initEhart() {
      let myChart = echarts.init(this.$refs.myChart);
      // 绘制图表
      let that = this;
      let option = {
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          bottom: '30',
          top: '50',
          left: '10%',
          right: '12%',
        },
        xAxis: {
          // 设置x轴
          type: 'category',
          name: '扣分项',
          nameRotate: -90,
          boundaryGap: true,
          axisPointer: {
            type: 'none',
          },
          data: this.tqcDeductionNames,
          nameTextStyle: {
            fontStyle: 'normal',
            // fontSize: 14,
            fontWeight: 'bold',
            // align: 'right',
            // color: black,
            verticalAlign: 'bottom',
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false, // 是否显示坐标轴刻度。
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(134,175,229,1)',
            },
          },
          axisLabel: {
            // 刻度签--即轴线下的文字
            color: 'transparent',
            // rotate: -50,
            // eslint-disable-nxt-line space-before-function-paren
            formatter(value) {
              that.classIndex += 1;
              // eslint-disable-next-line prefer-template
              return `{${that.classIndex}| ${value}}`;
            },
            interval: 0, // 设置成 0 强制显示所有标签。
            rich: {
              // x轴刻度标签的自定义--图片+文字
              'value': {
                lineHeight: 20,
                width: 20,
                align: 'center',
              },
              '1': {
                height: 20,
                width: 20,
                align: 'center',

                backgroundColor: {
                  image: FireImage,
                },
                // background: 'rgba(245, 77, 77, 1)',
              },
              '2': {
                height: 20,
                width: 20,
                align: 'center',
                backgroundColor: {
                  image: banImage,
                },
              },
              '3': {
                height: 20,
                width: 20,
                align: 'center',
                backgroundColor: {
                  image: cicleImage,
                },
              },
              '4': {
                height: 20,
                width: 20,
                align: 'center',
                backgroundColor: {
                  image: cirledianImage,
                },
              },
              '5': {
                height: 20,
                width: 20,
                align: 'center',
                backgroundColor: {
                  image: diggingImage,
                },
              },
              '6': {
                height: 20,
                width: 20,
                align: 'center',
                backgroundColor: {
                  image: guixiaImage,
                },
              },
              '7': {
                height: 20,
                width: 20,
                align: 'center',
                backgroundColor: {
                  image: lightingImage,
                },
              },
            },
          },
        },
        yAxis: {
          type: 'value',
          name: '分数',
          // nameLocation: ,
          nameTextStyle: {
            fontStyle: 'normal',
            // fontSize: this.$store.state.titlefs,
            // fontWeight: 'bold',
            // color: 'rgba(255,255,255,1)',
            fontWeight: 'bold',
            // align: 'right',
            // color: black,
            verticalAlign: 'bottom',
          },
          splitLine: {
            show: false,
            interval: '2',
          },
          axisTick: {
            show: false, // 是否显示坐标轴刻度。
            interval: 0,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(134,175,229,1)',
            },
          },
          // max: 200,
        },
        series: [
          {
            data: this.tqcDeductionStatistics,
            type: 'bar',
            barWidth: '15',
            itemStyle: {
              normal: {
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: { // 数值样式
                    color: 'black',
                    fontSize: 14
                  }
                },
                color(params) {
                  const colorList = [
                    '#5B8FF9',
                    '#5AD8A6',
                    '#5D7092',
                    '#F6BD16',
                    '#E8684A',
                    '#6DC8EC',
                    '#FF9D4D',
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: 'white',
                fontWeight: 'bold',
              },
            },
          },
        ],
      };
      myChart.setOption(option);
      this.classIndex = 0;
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
