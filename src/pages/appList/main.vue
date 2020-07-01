<template>
	<component :is="componentName" v-bind="listProps" />
</template>

<script>
import { ComponentxPlugin } from '@qycloud/lego';
import Vue from 'vue';
import DefaultList from './base.vue';

Vue.use(ComponentxPlugin);

export default {
  name: 'main-app-list',
  props: ['module', 'appId', 'spaceId', 'isCustomShowCrumb', 'toggleLabelCallBack', 'crumbClick'],
  components: {
    DefaultList
  },
  computed: {
    listProps() {
      return {
        module: this.module,
        appId: this.appId,
        spaceId: this.spaceId,
        isCustomShowCrumb: this.isCustomShowCrumb,
        toggleLabelCallBack: this.toggleLabelCallBack,
        crumbClick: this.crumbClick
      };
    },
    componentName() {
      return this.$options.components[this.appId] ? this.appId : 'DefaultList';
    }
  }
};
</script>
