<template>
	<div class="wrapper">
		<v-header></v-header>
		<div class="main-box">
			<transition name="fade" mode="out-in">
				<router-view :key="new Date().getTime()"></router-view>
			</transition>
		</div>
	</div>
</template>

<script>
import VHeader from '@/layout/Header.vue';

export default {
  name: 'VLayout',
  data() {
    return {};
  },
  components: {
    VHeader
  }
};
</script>

<style lang="scss" scoped>
.main-box {
	position: absolute;
	top: 60px;
	width: 100%;
	min-width: 1300px;
	bottom: 0;
	left: 0;
}
</style>
