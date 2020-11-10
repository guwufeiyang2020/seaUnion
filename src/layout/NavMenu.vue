<template>
	<div class="nav-menu">
		<el-menu-item v-for="navMenu in noChildren" :index="navMenu.id" :key="navMenu.id">
			<p slot="title" @click.stop="clickMenu(navMenu)">{{navMenu.name}}</p>
		</el-menu-item>
		<el-submenu v-for="navMenu in hasChildren" :key="navMenu.id" :index="navMenu.id">
			<template slot="title" @click.stop="clickMenu(navMenu)">
				<p>{{navMenu.name}}</p>
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
    return {

    };
  },
  methods: {
    clickMenu(menu) {
      localStorage.setItem('jumpType', '1');
      this.$store.commit('TOGGLE_SCREEN', 0); // 点菜单就是小屏
      if (menu.app_type === 'link' && menu.link.indexOf('paaslink') === -1) {
        let routeUrl = this.$router.resolve({
          path: menu.link
        });
        window.open(routeUrl.href, '_blank');
      } else if (menu.app_type === 'link' && menu.link.indexOf('paaslink') > -1) {
        let url = window.globalConfig.server.www + menu.link.replace('/paaslink/', '');
        let routeUrl = this.$router.resolve({
          path: '/iframContainer',
          query: { link: url }
        });
        window.open(routeUrl.href, '_blank');
      } else if (menu.app_type === 'information' || menu.app_type === 'workflow') {
        // 走平台配置
        let { spaceId } = AY.getSpaceInfoOfCurrentPage();
        let routeUrl = this.$router.resolve({
          path: `/appList/${menu.app_type}/${menu.app_id}/${spaceId}`
        });
        window.open(routeUrl.href, '_blank');
      }
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
