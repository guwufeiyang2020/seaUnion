<template>
  <div style="width: 100%;height: 100%;display:flex;" id="Document_management">
    <!-- <div class="fugaiBg" style="position: absolute;right: 50px;" v-if="showfugai===true">
      <el-button @click="goBack()" type="primary" size="small">返回上一级</el-button>
    </div> -->
    <iframe :src="src" frameborder="0" width="100%" style="height: 100%;"></iframe>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  props: ['link', 'spaceId'],
  components: {},
  data() {
    return {
      appArr: ['重大危险源评估', '港口重大危险源评估', 'HAZOP分析'],
      src: '',
      id: '',
      showdiv: false,
      showbutton: false,
      showfugai: false,
    };
  },
  computed: {
    ...mapState(['permission']),
  },
  created() {
    if (this.link) {
      if (this.appArr.indexOf(this.$route.params.name) > -1) {
        this.showfugai = false;
      } else {
        this.showfugai = true;
      }
      this.src = this.$route.query.link;
    } else {
      const dominUrl = window.globalConfig.server.www;
      this.src = `${dominUrl}space-${this.spaceId}/store/?nakedLayout=1#foldertree/store`;
    }
  },
  methods: {
    // 返回应用
    goBack() {
      window.history.go(-1);
    },
  },
};
</script>
<style scoped lang="scss">
#Document_management {
  .fugaiBg {
    width: 10%;
    background: #fff;
    right: 3%;
    top: 9%;
    display: flex;
  }

  .el-button {
    position: fixed;
    top: 9%;
  }
}
</style>
