<template>
	<div style="width: 50%;position: relative; left: 25%;">
		<List border split>
			<div slot="header">
				<img class="avatar" :src="avatarImg"/><br>
				<span class="link" @click="alterAvatar">修改头像</span>
			</div>
			<ListItem>
				<div class="list-item">
					<span class="item-title">账号: </span>
					<span style="margin-left: 20px">{{userInfo.count}}</span>
				</div>
			</ListItem>
			<ListItem>
				<div class="list-item">
					<span class="item-title">昵称: </span>
					<span style="margin-left: 20px">{{userInfo.nickName}}</span>
				</div>
			</ListItem>
			<ListItem>
				<div class="list-item">
					<span class="item-title">性别: </span>
					<span style="margin-left: 20px">
						{{userInfo.gender == 'm' ? '男' : userInfo.gender == 'f' ? '女' : '不明'}}
					</span>
				</div>
			</ListItem>
			<ListItem>
				<div class="list-item">
					<span class="item-title">生日: </span>
					<span style="margin-left: 20px">{{userInfo.birthDay}}</span>
				</div>
			</ListItem>
			<ListItem>
				<div class="list-item">
					<span class="item-title">电话号码: </span>
					<span style="margin-left: 20px">{{userInfo.telephone == null ? '未填写' : userInfo.telephone}}</span>
				</div>
			</ListItem>
			<ListItem>
				<div class="list-item">
					<span class="item-title">实名认证: </span>
					<span style="margin-left: 20px">{{userInfo.ifAuthentic == 1 ? '已认证' : '未认证'}}</span>
					<span v-if="userInfo.ifAuthentic == 1" class="link" style="margin-left: 20px">查看实名信息</span>
					<span v-else class="link" style="margin-left: 20px" @click="authentic">去认证</span>
				</div>
			</ListItem>
			<div slot="footer">
				<Button type="info" @click="alterUserInfo">修改信息</Button>
			</div>
		</List>
		<Modal v-model="modal_switch">
			<div v-if="modal_content_type == 1" align="center">
				<Upload action="/api/file/uploadAvatar.json"
					:headers="headerInfo"
					:format="['jpg','jpeg','png']"
					:on-format-error="errorFormat"
					:on-success="uploadSuccess">
					<Button icon="ios-cloud-upload-outline">上传文件</Button>
				</Upload>
			</div>
			<div v-else-if="modal_content_type == 2">
				<Input placeholder="真实姓名"/>
			</div>
			<div v-else-if="modal_content_type == 3">
				<Input v-model="userInfo.count" type="text">
					<span class="item-title2" slot="prepend">账号</span>
				</Input>
				<br/>
				<Input v-model="userInfo.nickName" type="text">
					<span class="item-title2" slot="prepend">昵称</span>
				</Input>
				<br/>
				<Input v-model="userInfo.telephone" type="text">
					<span class="item-title2" slot="prepend">电话号码</span>
				</Input>
			</div>
		</Modal>
	</div>
</template>

<script>
import axios from '@/libs/request'
import {getToken} from '@/libs/utils'

export default {
	name: 'UserInfo',
	data () {
		return {
			apiURL: {
				userInfoURL: '/user/userInformation.json',
				avatarURL: '/file/downloadAvatar.json'
			},
			userInfo: '',
			avatarImg: '',
			modal_switch: false,
			modal_content_type: 0,
			headerInfo: {
				tokenauthorization: getToken() //设置请求Token
			}
		}
	},
	methods: {
		getUserInfo() {
			axios.request({
				url: this.apiURL.userInfoURL,
				method: 'get'
			}).then(res => {
				if (res.data && res.data.code == 200) {
					this.userInfo = res.data.result
				}
			})
		},
		getUserAvatar () {
	        axios.request({
	            url: this.apiURL.avatarURL,
	            method: 'get',
	            responseType: 'blob'
	        }).then(res => {
	            let blob = new Blob([res.data], {type: res.headers['content-type']})
	            this.avatarImg = URL.createObjectURL(blob)
	        })
	    },
		alterAvatar () {
			this.modal_switch = true
			this.modal_content_type = 1
		},
		authentic () {
			this.modal_switch = true
			this.modal_content_type = 2
		},
		errorFormat (file) {
			this.$Notice.warning({
	          title: '提示',
	          desc: '只能上传jpg/jpeg/png格式图片!'
	        })
		},
		uploadSuccess (res, file, fileList) {
			this.getUserAvatar()
			this.$emit('updateUserInfo')
		},
		alterUserInfo () {
			this.modal_content_type = 3
			this.modal_switch = true
		}
	},
	computed: {
		//
	},
	mounted () {
		this.getUserInfo()
		this.getUserAvatar()
	}
}
</script>

<style scoped>
.list-item {
	position: relative;
	left: 10%;
	text-align: left;
}
.item-title {
	font-size: 15px;
	font-weight: 600;
}
.avatar {
	width: 60px;
	height: 60px;
	border-radius: 100%;
	overflow: hidden;
	object-fit: cover;
    flex: 1;
}
.link {
	text-decoration: underline;
	color: blue;
	cursor: pointer;
}
.item-title2 {
	font-size: 14px;
}
</style>