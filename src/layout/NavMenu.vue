<template>
	<div class="nav-menu">
		<el-menu-item v-for="navMenu in noChildren" :index="navMenu.id" :key="navMenu.id">
			<span slot="title" @click="clickMenu(navMenu)">{{navMenu.name}}</span>
		</el-menu-item>
		<el-submenu v-for="navMenu in hasChildren" :key="navMenu.id" :index="navMenu.id">
			<template slot="title" @click="clickMenu(navMenu)">
				<span>{{navMenu.name}}</span>
			</template>
			<nav-menu :navMenus="navMenu.children"></nav-menu>
		</el-submenu>
	</div>
</template>

<script>
export default {
  name: 'NavMenu',
  props: {
    navMenus: Array
  },
  computed: {
    noChildren() {
      if (this.navMenus) {
        return this.navMenus.filter(item => item.children.length === 0);
      }
    },
    hasChildren() {
      if (this.navMenus) {
        return this.navMenus.filter(item => item.children.length > 0);
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    clickMenu(menu) {
      this.$store.commit('SET_MENU', menu);
      this.$router.push({
        path: menu.link
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.nav-menu {
	/deep/ .el-submenu {
		float: left;
		.el-submenu__title {
			padding: 0 35px 0 10px;
			display: flex;
			align-items: center;
			.el-submenu__icon-arrow {
				margin-top: -6px;
			}
		}
	}
}
</style>
