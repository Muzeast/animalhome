<template>
	<div>
		<div :style="styles.mainarea" class="main-area" align="center">
			<div class="form-area">
				<p class="ptitle">欢迎注册新用户</p>
				<Row class="trow">
					<Col span="6" class="col-title">
						<span>账号</span>
					</Col>
					<Col span="18">
						<Input v-model="userInfo.count"/>
					</Col>
				</Row>
				<Row class="trow">
					<Col span="6" class="col-title">
						<span>用户名</span>
					</Col>
					<Col span="18">
						<Input v-model="userInfo.nickName"/>
					</Col>
				</Row>
				<Row class="trow">
					<Col span="6" class="col-title">
						<span>性别</span>
					</Col>
					<Col span="18">
						<RadioGroup v-model="userInfo.gender" style="float: left; clear: none;">
							<Radio label="m" value="m">男</Radio>&nbsp;&nbsp;&nbsp;&nbsp;
							<Radio label="f" value="f">女</Radio>
						</RadioGroup>
					</Col>
				</Row>
				<Row class="trow">
					<Col span="6" class="col-title">
						<span>出生日期</span>
					</Col>
					<Col span="18">
						<DatePicker type="date" :value="userInfo.birthDay" @on-change="dataChange"></DatePicker>
					</Col>
				</Row>
				<Row class="trow">
					<Col span="6" class="col-title">
						<span>邮箱</span>
					</Col>
					<Col span="18">
						<Input v-model="userInfo.email"/>
					</Col>
				</Row>
				<Row class="trow">
					<Col span="6" class="col-title">
						<span>密码</span>
					</Col>
					<Col span="18">
						<Input v-model="userInfo.password" type="password"/>
					</Col>
				</Row>
				<Row class="trow">
					<Col span="6" class="col-title">
						<span>确认密码</span>
					</Col>
					<Col span="18">
						<Input v-model="repassword" type="password"/>
					</Col>
				</Row>
				<Button id="my-button" type="primary" size="large" @click="register">提交</Button>
			</div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
import md5 from 'js-md5'
import axios from '@/libs/request'

export default {
	name: 'register',
	data () {
		return {
			registerURL: '/user/register.json',
			styles: {
				mainarea: {
					height: ''
				}
			},
			userInfo: {
				count: '',
				nickName: '',
				gender: 'M',
				birthDay: '',
				email: '',
				password: '',
			},
			repassword: ''
		}
	},
	methods: {
		dataChange (date, type) {
			this.userInfo.birthDay = date
		},
		register () {
			if(!this.validUserInfo()) {
				return
			}
			//console.log('user---->', this.userInfo)
			let password = this.userInfo.password;
			this.userInfo.password = md5(this.userInfo.password)
			axios.request({
				url: this.registerURL,
				method: 'post',
				data: this.userInfo
			}).then(res => {
				if (res.data && res.data.code == 200) {
					this.$Notice.info({
						title: '提示',
						desc: '注册成功, 3S后跳转至登录页',
						duration: 3
					})
					setTimeout(() => {
						this.$router.push({
							name: 'login'
						})
					}, 3000)
				}
			})
		},
		validUserInfo () {
			if (this.userInfo.count == null || this.userInfo.count == '') {
				this.notice("账号不能为空!")
				return false
			}
			if (this.userInfo.nickName == null || this.userInfo.nickName == '') {
				this.notice('用户名不能为空!')
				return false
			}
			if (this.userInfo.password != this.repassword) {
				this.notice('密码不一致!')
				return false
			}

			return true
		},
		notice (info) {
			this.$Notice.warning({
				title: '提示',
				desc: info
			})
		}
	},
	beforeMount () {
		$('html').css('height', '100%')
		$('body').css('height', "100%")
	},
	mounted () {
		this.styles.mainarea.height = $('body').css('height')
	}
}
</script>

<style scoped>
.main-area {
	width: 40%;
	position: relative;
	left: 30%;
}
.ptitle {
	font-size: 16px;
	font-weight: 600;
	padding-top: 20px;
}
.form-area {
	width: 100%;
	height: 80%;
	position: relative;
	top: 15%;
	background: #E9EBEC;
}
.trow {
	width: 70%;
		margin: 20px 0 20px 0;
		text-align: left;
}
.col-title {
	font-size: 15px;
	text-align: center;
	padding-top: 5px;
}
#my-button {
  width: 70%;
  margin: 10px 0 30px 0;
}
</style>