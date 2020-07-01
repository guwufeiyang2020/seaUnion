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
.wrapper {
	/* position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow: hidden; */
}
.main-box {
	// position: relative;
	// padding: 20px;
	position: absolute;
	top: 60px;
	width: 100%;
	min-width: 1300px;
	bottom: 0;
	left: 0;
	// overflow: auto;
}
</style>
