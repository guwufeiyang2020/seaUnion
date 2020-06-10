<template>
	<div class="login-wrapper">
		<div class="login-header">
			<img src="../../assets/images/logo.png" class="logo" />
		</div>
		<div class="login-content">
			<div class="margin1200">
				<div class="login-box">
					<ul class="login-title-list">
						<li
							class="login-title-item"
							:class="{'active' : loginType == 'hs' }"
							@click="loginType = 'hs'"
						>主管部门</li>
						<li
							class="login-title-item"
							:class="{'active' : loginType == 'qy' }"
							@click="loginType = 'qy'"
						>码头业主</li>
						<li
							class="login-title-item"
							:class="{'active' : loginType == 'cz' }"
							@click="loginType = 'cz'"
						>航运企业</li>
					</ul>
					<div class="login-body">
						<el-form
							autocomplete="off"
							:model="loginForm"
							:rules="loginRules"
							ref="loginForm"
							label-position="left"
							label-width="0px"
							class="card-box login-form"
						>
							<el-form-item prop="username">
								<svg-icon icon-class="user" class="icon-svg" />
								<el-input placeholder="请输入邮箱" type="text" v-model="loginForm.username" />
							</el-form-item>
							<el-form-item prop="password">
								<svg-icon icon-class="password" class="icon-svg" />
								<el-input placeholder="请输入密码" type="password" v-model="loginForm.password" />
							</el-form-item>
							<el-form-item prop="verifycode" class="form-item-captcha">
								<el-input placeholder="请输入验证码" type="captcha" v-model="loginForm.verifycode" />
								<span @click="refreshCode" class="yzm">
									<s-identify :identifyCode="identifyCode"></s-identify>
								</span>
							</el-form-item>
							<el-button type="primary" :loading="loading" style="width:100%;" @click="handleLogin">登录</el-button>
						</el-form>
						<div class="login-footer">
							<el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
						</div>
						<a href="#" class="link">进入中化物流港系统>>></a>
					</div>
				</div>
			</div>
		</div>
		<div class="login-bottom">
			主办单位：舟山海事局 中化兴中石油转运（舟山）有限公司
			<br />技术支持：中化安元应急管理技术（舟山）有限公司
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import SIdentify from './identify.vue';
import { encryptDes } from '../../assets/js/utils/des';

export default {
	name: 'Login',
	components: {
		SIdentify
	},
	data() {
		// 验证码自定义验证规则
		const validateVerifycode = (rule, value, callback) => {
			let newVal = value.toLowerCase();
			let identifyStr = this.identifyCode.toLowerCase();
			if (newVal === '') {
				callback(new Error('请输入验证码'));
			} else if (newVal !== identifyStr) {
				callback(new Error('验证码不正确!'));
			} else {
				callback();
			}
		};
		return {
			loginForm: {
				username: '',
				password: '',
				verifycode: ''
			},
			loginType: 'hs',
			identifyCodes: '1234567890ABCDEFGHIGKLMNOPQRSTUVWXYZ',
			identifyCode: '',
			rememberPassword: true,
			loading: false,
			loginRules: {
				username: [{ required: true, trigger: 'blur', message: '账号不能为空' }],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 6, message: '密码长度最少为6位', trigger: 'blur' }
				],
				verifycode: [{ required: true, trigger: 'blur', validator: validateVerifycode }]
			}
		};
	},
	methods: {
		// 生成随机数
		randomNum(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		},
		// 切换验证码
		refreshCode() {
			this.identifyCode = '';
			this.makeCode(this.identifyCodes, 4);
		},
		// 生成四位随机验证码
		makeCode(o, l) {
			for (let i = 0; i < l; i++) {
				this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
			}
		},
		handleLogin() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true;
					const loginParams = {
						loginUserId: this.loginForm.username,
						password: encryptDes(this.loginForm.password),
						loginType: this.loginType
					};
					this.$store.dispatch('login', loginParams).then(res => {
						this.loading = false;
						if (res.status === 200) {
							this.$store.commit('SET_USER_INFO', res.data.onlineUserInfo);
							this.$router.push({ path: '/' });
						}
					});
				} else {
					return false;
				}
			});
		}
	},
	mounted() {
		// 验证码初始化
		this.identifyCode = '';
		this.makeCode(this.identifyCodes, 4);
	}
};
</script>

<style lang="scss" scoped>
.login-header {
	width: 1200px;
	height: 120px;
	display: flex;
	align-items: center;
	margin: 0 auto;
	.logo {
		width: 506px;
		height: 70px;
	}
}
.login-content {
	width: 100%;
	height: 618px;
	background: url('../../assets/images/logo-bg.jpg') no-repeat;
	.margin1200 {
		display: flex;
		height: 618px;
		flex-direction: row-reverse;
		align-items: center;
	}
}
.login-box {
	width: 380px;
	height: 440px;
	padding-top: 16px;
	background: rgba(255, 255, 255, 0.6);
	border: 1px solid #fff;
	border-radius: 3px;
}
.login-title-list {
	height: 52px;
	line-height: 52px;
	display: flex;
	padding: 0px 20px;
	.login-title-item {
		// flex: 1;
		margin: 0 13px;
		text-align: center;
		cursor: pointer;
		font-size: 20px;
		font-weight: 500;
		color: #202327;
		&.active {
			font-size: 24px;
			color: #004986;
			border-bottom: 3px solid #004986;
		}
	}
}
.login-body {
	padding: 22px 26px 0 26px;
}
.el-form-item {
	position: relative;
	.icon-svg {
		position: absolute;
		left: 9px;
		top: 12px;
		width: 25px;
		height: 25px;
		z-index: 10;
	}
	/deep/ .el-input__inner {
		padding-left: 42px;
		height: 50px;
		line-height: 50px;
	}
}
.form-item-captcha {
	/deep/ .el-form-item__content {
		height: 50px;
	}
	/deep/ .el-input {
		width: 192px;
		margin-right: 10px;
		float: left;
		/deep/ .el-input__inner {
			padding-left: 12px;
			height: 50px;
			line-height: 50px;
		}
	}
	.yzm {
		width: 94px;
		height: 50px;
	}
}
/deep/ .el-button--primary {
	background: #004986;
	font-size: 16px;
	outline: none;
	border: 0 none;
}
.login-footer {
	margin: 10px 0 20px 0;
	color: #333;
	cursor: pointer;
}
.link {
	width: 100%;
	display: block;
	margin-left: 70px;
	height: 20px;
	line-height: 20px;
	padding-left: 54px;
	color: #0d63ae;
	background: url('../../assets/images/lets-logo.png') no-repeat left top;
}
.login-bottom {
	padding-top: 12px;
	text-align: center;
	color: #626467;
	line-height: 26px;
}
</style>
