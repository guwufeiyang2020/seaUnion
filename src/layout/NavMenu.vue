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
      refresh: false
    };
  },

  methods: {
    clickMenu(menu) {
      localStorage.setItem('jumpType', '1');
      if (menu.app_type === 'link') {
        this.$router.push({
          path: menu.link
        });
      } else if (menu.app_type === 'information' || menu.app_type === 'workflow') {
        // ◊ﬂ∆ΩÃ®≈‰÷√
        let { spaceId } = AY.getSpaceInfoOfCurrentPage();
        this.$router.push({
          path: `/appList/${menu.app_type}/${menu.app_id}/${spaceId}`
        });
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
