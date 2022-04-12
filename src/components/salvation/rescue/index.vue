<template>
	<div>
		<Card style="width: 70%;position: relative; left: 15%;min-height: 400px;">
			<p class="head-title" slot="title">救助申请填写</p>
			<div class="table-area">
				<div class="my-row">
					<Row>
						<Col span="4">
							<div class="row-title">品种</div>
						</Col>
						<Col span="8">
							<Select>
								<Option v-for="item in petType" :key="item.typeCode" :value="item.typeCode">
									{{item.typeName}}
								</Option>
							</Select>
						</Col>
					</Row>
				</div>
				<div class="my-row">
					<Row>
						<Col span="4">
							<p class="row-title">地址</p>
						</Col>
						<Col span="20">
							<Input placeholder="请输入宠物救助地址"/>
						</Col>
					</Row>
				</div>
				<div class="my-row">
					<Row>
						<Col span="4">
							<p class="row-title">健康状况</p>
						</Col>
						<Col span="8">
							<Select>
								<Option value="1">健康</Option>
								<Option value="2">良好</Option>
								<Option value="3">轻微受伤</Option>
								<Option value="4">轻度受伤</Option>
								<Option value="5">严重受伤</Option>
							</Select>
						</Col>
					</Row>
				</div>
				<div class="my-row">
					<Row>
						<Col span="4">
							<p class="row-title">联系方式</p>
						</Col>
						<Col span="20">
							<Input placeholder="请输入手机号码"/>
						</Col>
					</Row>
				</div>
				<div class="my-row">
					<Row>
						<Col span="4">
							<p class="row-title">照片</p>
						</Col>
						<Col span="10" style="text-align: left;">
							<Upload action="/api/file/uploadRescuePhoto.json"
							:headers="headerInfo"
							:on-remove="removeCommit"
							:on-success="uploadSuccess">
								<Button icon="ios-cloud-upload-outline">上传</Button>
							</Upload>
						</Col>
					</Row>
				</div>
			</div>
			<Divider/>
			<Button type="primary" style="width: 100px;" @click="modal_switch = true">提交</Button>
		</Card>
		<Modal v-model="modal_switch" @on-ok="submit">
			<span>我确认以上信息的真实性，并提交？</span>
		</Modal>
	</div>
</template>

<script>
import axios from '@/libs/request'
import {getToken} from '@/libs/utils'

export default {
	data () {
		return {
			apiUrl: {
				petTypeURL: '/salvage/petType.json',
				deleteRescuePhotoURL: '/file/deleteRescuePhoto.json'
			},
			headerInfo: {
				tokenauthorization: getToken() //设置请求Token
			},
			petType: [],
			applyInfo: {
				typeCode: '',
				rescueAddress: '',
				healthCode: 0,
				contact: '',
				photos: ''
			},
			modal_switch: false,
		}
	},
	methods: {
		getPetTypeInfo () {
			axios.request({
				url: this.apiUrl.petTypeURL,
				method: 'get'
			}).then(res => {
				if (res.data && res.data.code == 200) {
					res.data.result.forEach(item => {
						this.petType.push({
							typeCode: item.type_code,
							typeName: item.type_name
						})
					})
				}
			})
		},
		submit () {
			if (!this.validate()) {
				return
			}
		},
		validate () {
			if (this.applyInfo.typeCode == '') {
				this.warning('宠物种类不能为空!')
				return false
			}
			if (this.applyInfo.rescueAddress == '') {
				this.warning('救助地址不能为空!')
				return false
			}
			if (!this.applyInfo.healthCode) {
				this.warning('必须选择健康状况!')
				return false
			}
			if (!/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(this.applyInfo.contact)) {
				this.warning('请输入正确的电话号码!')
				return false
			}
			if (this.applyInfo.photos == '') {
				this.warning('至少需上传一张照片!')
				return false
			}
			return true
		},
		warning (msg) {
			this.$Notice.warning({
				title: '警告',
				desc: msg
			})
		},
		removeCommit(file, fileList) {
			//console.log('---->', file)
			axios.request({
				url: this.apiUrl.deleteRescuePhotoURL,
				method: 'get',
				params: {
					file: file.name
				}
			}).then(res => {
				if (res.data && res.data.code == 200) {
					this.$Notice.info({
						title: '提示',
						desc: '删除成功!'
					})
				}
			})
		},
		uploadSuccess(res, file, fileList) {
			if (res.data && res.data.code == 200) {
				if (this.applyInfo.photos != '') {
					this.applyInfo.photos += ","
				}
				this.applyInfo.photos += file.name
			}
		}
	},
	mounted () {
		this.getPetTypeInfo()
	}
}
</script>

<style scoped>
.head-title {
	font-size: 16px;
	font-weight: 550;
}
.table-area {
	width: 80%;
	position: relative;
	left: 10%;
}
.my-row {
	margin: 15px 0;
}
</style>