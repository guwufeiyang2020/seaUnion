<script>
import Vue from 'vue';
import { FieldBox, createDialog } from '@qycloud/lego';
import { $http } from '@commonbox/utils';
import store from '@/store/';

export default {
  name: 'MyFieldBox',
  extends: FieldBox,
  data() {
    return { };
  },
  created() {

  },
  methods: {
    renderRightSlot() {
      if (this.id === 'zhuanjiaxuanze') {
        return <el-button type="primary" on-click={this.handleClick}>随机选取专家</el-button>;
      }
    },
    handleClick() {
      // 调随机选取专家接口
      $http.get('/sdkseaunion/portalApi/randomExpert').then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem('sendMsgInfo', JSON.stringify(res.data.data));
          this.setCurrentValue(`${res.data.data.xingming}`);
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
</style>
