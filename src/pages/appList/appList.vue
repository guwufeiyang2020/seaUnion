<template>
	<div class="AppList_Main">
		<my-app-list
			:module="module"
			:appId="appId"
			:spaceId="spaceId"
			:isCustomShowCrumb="isCustomShowCrumb"
			:showCrumbs="showCrumbs"
			:crumbClick="crumbClick"
			:toggleLabelCallBack="toggleLabelCallBack"
		></my-app-list>
	</div>
</template>
<script>
import Vue from 'vue';
import MyAppList from './main.vue';

export default {
  name: 'AppList',
  data() {
    return {
      module: this.$route.params.module,
      appId: this.$route.params.appId,
      spaceId: this.$route.params.spaceId,
      isShow: false,
      showSideBar: false,
      showCrumbs: false,
      // cacheKey: 0,
      isCustomShowCrumb: 0, // 判断是否夸容器
      crumbClick: (params) => {
        // console.log(params);
      },
      toggleLabelCallBack(id) {
        // console.log(id);
      }
    };
  },
  components: { MyAppList }
  /* activated() {
		this.cacheKey = new Date().getTime();
		this.isShow = true;
	},
	computed: {
		currentToken() {
			return `${this.spaceId}@${this.appId}`;
		}
	}, */
  /* 	mounted() {
		this.cacheKey = new Date().getTime();
		this.isShow = true;
	},
	methods: {
		clearCache() {
			this.cacheKey = new Date().getTime();
			this.isShow = true;
		}
  }, */
};
</script>

<style lang="scss" scoped>
.AppList_Main {
	width: 100%;
	height: 100%;
	.backToMenu {
		width: 4vw;
		position: fixed;
		right: 50px;
		font-size: 1rem;
		top: 8.5vh;
	}
}
</style>
<style lang="scss">
// 面包屑样式
.AppList_Main {
	.view-crumbs .icon {
		margin: 0 0px 0 5px !important;
		color: #596b89;
		font-size: 15px !important;
	}
	.view-crumbs {
		:nth-child(3) {
			line-height: 22px !important;
		}
	}
}
</style>
