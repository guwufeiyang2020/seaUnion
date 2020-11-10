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
      shipTypes: [],
      legendNames: []
    };
  },
  computed: {
    
  },
  mounted() {
    this.queryProportionOfShipTypes();
  },
  methods: {
    queryProportionOfShipTypes() {
      $http.get('/sdkseaunion/portalApi/proportionOfShipTypes').then((res) => {
        if (res.data.status === 200) {
          res.data.data.forEach((item) => {
            this.shipTypes.push({
              value: item.countShip,
              name: item.chuanxing
            });
          });
          res.data.data.map(item => this.legendNames.push(item.chuanxing));
          this.initEhart();
        }
      });
    },
    initEhart() {
      let myChart = echarts.init(this.$refs.myChart);
      // 绘制图表
      let option = {
        color:['#F4664A', '#FAAD14', '#30BF78'],
        tooltip: {
        },
        legend: {
          data: this.legendNames
        },
        series: [
          {
            type: 'pie',
            radius: [30, 80],
            center: ['55%', '60%'],
            roseType: 'area',
            data: this.shipTypes
          }
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
