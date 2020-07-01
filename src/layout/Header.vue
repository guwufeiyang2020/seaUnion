<template>
	<!-- 头部 :class="{'header-big': showBigScreen}" -->
	<div class="header-wrapper">
		<div class="header-content">
			<img src="../assets/images/logo.png" class="logo" @click="jumpHome" />
			<div class="login-area">
				<!-- 递归菜单 -->
				<el-menu default-active="0" class="el-menu-demo" mode="horizontal" >
					<nav-menu :navMenus="asideMenu"></nav-menu>
				</el-menu>
				<!-- 递归菜单结束 -->
				<div class="line"></div>

				<el-dropdown v-if="userInfo && userInfo.realName">
					<div class="el-dropdown-link">
						<img :src="userImg" class="user-img" />
						{{ userInfo.realName }}
						<i class="ad" ref="guanliyuan"></i>
					</div>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="jumpUserInfo">个人中心</el-dropdown-item>
						<el-dropdown-item @click.native="layout">退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<button class="toggle-screen" @click="toggleScreen">{{showBigScreen ? "退出大屏模式": "开启大屏模式"}}</button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import NavMenu from '@/layout/NavMenu';

export default {
  name: 'VHeader',
  components: {
    NavMenu
  },
  data() {
    return {
      userImg: require('../assets/images/user.png'),
      operateMenus: [],
      showBigScreen: false
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      asideMenu: state => state.menu.menuList,
      isBigScreen: state => state.isBigScreen
    })
  },
  methods: {
    // 退出登录
    layout() {
      this.$store.dispatch('layout');
    },
    jumpUserInfo() {
 			const dominUrl = window.globalConfig.server.www;
      const linkUrl = `${dominUrl}space-${window.AY.getSpaceId()}/user/setting?nakedLayout=1`;
      let routeUrl = this.$router.resolve({
        path: '/iframContainer',
        query: { link: linkUrl }
      });
      window.open(routeUrl.href, '_blank');
    },
    jumpHome() {
      this.$router.push({
        path: '/index'
      });
    },
    toggleScreen() {
      this.showBigScreen = !this.showBigScreen;
      if (this.showBigScreen) {
        this.$store.commit('TOGGLE_SCREEN', 1); // 1表示true
      } else {
        this.$store.commit('TOGGLE_SCREEN', 0); // 0表示false
      }
      if (this.showBigScreen) {
        this.$router.push({
          path: '/bigScreen'
        });
      } else {
        this.$router.push({
          path: '/index'
        });
      }
    },
    initData() {
      this.$store.dispatch('queryMenuList').then((asideMenu) => {
        if (asideMenu) {
          asideMenu.forEach((item) => {
            item.children.forEach((subItem) => {
              this.operateMenus.push({
                id: subItem.id,
                appType: subItem.app_type,
                appId: subItem.app_id
              });
            });
          });
          let firstMenu = this.operateMenus[0];
          if (this.selectMenu && this.selectMenu.id) {
            this.activeIndex = this.selectMenu.id;
          } else {
            this.activeIndex = firstMenu.id;
          }
        }
      });
    }
  },
  mounted() {
    if (Number(this.isBigScreen) === 1) {
      this.showBigScreen = true;
    } else {
      this.showBigScreen = false;
    }
    this.initData();
  }
};
</script>

<style lang="scss" scoped>
.header-wrapper {
	width: 100%;
	height: 60px;
	background: #fff;
	border-bottom: 1px solid #2a86d8;
	box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.1);
}
.header-content {
	width: 1280px;
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
	&.header-big {
		width: 100%;
		padding: 0 120px;
	}
}
.logo {
	width: 250px;
	cursor: pointer;
}
.login-area {
	height: 60px;
	font-size: 18px;
	display: flex;
	align-items: center;
	.el-menu {
		outline: none;
		border-bottom: none;
		.nav-menu {
			outline: none;
		}
	}
	.line {
		width: 2px;
		height: 20px;
		margin-right: 20px;
		background: #dedede;
	}
	.el-dropdown {
		cursor: pointer;
		.el-dropdown-link {
			display: flex;
			align-items: center;
			.user-img {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				margin-right: 10px;
			}
		}
	}
	.toggle-screen {
		width: 100px;
		height: 32px;
		border: 1px solid #005bac;
		margin-left: 20px;
		font-size: 13px;
		color: #005bac;
		line-height: 32px;
	}
}
</style>
