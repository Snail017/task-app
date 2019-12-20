<template>
	<div>
		<div class="bg"></div>
		<div class="content">
			<h3>会员登录</h3>
			<form action="" id="form">
				<p class="note"> 欢迎! &nbsp;&nbsp; 请登录. </p>
				<ul>
					<li>
						<input id="userInput" name="username" class="" autocomplete="off" placeholder="请输入会员名" type="text" maxlength="50">
					</li>
					<li>
						<input id="passInput" name="password" class="loginPw" autocomplete="off" placeholder="请输入密码" type="password">
					</li>
				</ul>
			</form>
			<!--<div class="prompt">-->
			<!--<a href="#" class="">免费注册</a> | <a href="#" class="">忘记密码</a>-->
			<!--</div>-->
			<input type="button" id="login_submit" class="loginButton" value="登录" @click="login">
		</div>
		<div class="bg1 bg" v-if="msgOk" @click="msgOk=false"></div>
		<div v-if="msgOk" class="msg">{{msg}}</div>
	</div>
</template>

<script>
	export default {
		name: "login",
		data() {
			return {
				msgOk: false,
				msg:''
			}
		},
		mounted() {
			this.axios.defaults.headers = {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		},
		methods: {
			login() {
				let _this = this;
				this.$http.post('/login', new FormData(document.getElementById('form'))).then(function(res) {
					if(res.data.code == '200') {
						_this.$store.commit('changeLogin', '100');
						_this.$store.commit('token', res.data.data.token);
						localStorage.setItem("changeLogin", '100');
						localStorage.setItem('token', res.data.data.token);
						localStorage.setItem("uid", res.data.data.uid);
						localStorage.setItem('dept', res.data.data.dept);
						window.location.href = '/#/';
					} else {
						_this.$store.commit('changeLogin', '400');
						localStorage.setItem("changeLogin", '400');
						_this.msgOk = true;
						_this.msg = res.data.msg;
					}
				}).then(function(res) {

				});
			}
		}
	}
</script>

<style scoped>
	.content {
		width: 600px;
		padding: 0 28px 27px;
		border-radius: 3px;
		position: absolute;
		top: 80px;
		left: 50%;
		margin-left: -300px;
		background: 0 0
	}
	
	ul {
		padding-left: 0;
		list-style: none
	}
	
	.content h3 {
		font-size: 33px;
		font-weight: 400;
		color: #fff;
		margin: 80px 0
	}
	
	.content .note {
		font-size: 19px;
		color: #fff;
		text-align: left
	}
	
	.content li {
		width: 100%;
		height: 50px;
		border: 1px solid #eee;
		border-radius: 2px;
		margin-top: 20px
	}
	
	.content li input {
		display: block;
		float: left;
		border: none;
		width: 100%;
		height: 50px;
		padding-left: 2%;
		line-height: 50px;
		background: 0 0;
		color: #fff
	}
	
	.loginButton:hover {
		background: #eee;
		color: #333
	}
	
	.loginButton {
		height: 50px;
		border-radius: 2px;
		color: #fff;
		font-size: 18px;
		font-weight: 700;
		margin-top: 20px;
		border: 1px solid #eee!important;
		width: 100%;
		background: 0 0
	}
	
	.prompt {
		font-size: 14px;
		line-height: 16px;
		padding: 17px 0;
		float: right
	}
	
	.prompt a {
		color: #666;
		text-decoration: none
	}
	
	.bg {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: url(../assets/img/login2bg.jpg) #565DAD left top no-repeat;
		background-size: 100% 200%
	}
	
	input::-moz-placeholder {
		color: #fff;
		opacity: 1
	}
	
	input:-ms-input-placeholder {
		color: #fff
	}
	
	input::-webkit-input-placeholder {
		color: #fff
	}
</style>