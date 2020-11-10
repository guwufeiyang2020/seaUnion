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
      if (this.id === 'zhuanjiaxuanze' && this.editViewStatus) {
        return <el-button type="primary" on-click={this.handleClick}>随机选取专家</el-button>;
      }
    },
    handleClick() {
      // 调随机选取专家接口
      $http.get('/sdkseaunion/portalApi/randomExpert').then((res) => {
        if (res.data.status === 200) {
          if (res.data && res.data.data) {
            this.setCurrentValue(res.data.data);
          }
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
</style>
