<template>
    <div class="table-area">
        <div class="my-row">
            <Row>
                <Col span="4">
                    <div class="row-title">品种</div>
                </Col>
                <Col span="8">
                    <Select v-model="applyInfo.typeCode" :disabled="onlyShow">
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
                    <Input v-model="applyInfo.rescueAddress" :disabled="onlyShow" placeholder="请输入宠物救助地址"/>
                </Col>
            </Row>
        </div>
        <div class="my-row">
            <Row>
                <Col span="4">
                    <p class="row-title">健康状况</p>
                </Col>
                <Col span="8">
                    <Select v-model="applyInfo.healthCode" :disabled="onlyShow">
                        <Option v-for="item in healthGradeInfo"
                        :key="item.healthCode"
                        :value="item.healthCode">{{item.healthGrade}}</Option>
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
                    <Input v-model="applyInfo.contact" :disabled="onlyShow" placeholder="请输入手机号码"/>
                </Col>
            </Row>
        </div>
        <div class="my-row">
            <Row>
                <Col span="4">
                    <p class="row-title">描述</p>
                </Col>
                <Col span="20">
                    <Input v-model="applyInfo.description"
                    maxlength="200"
                    type="textarea"
                    :disabled="onlyShow"
                    show-word-limit
                    placeholder="请描述具体情况"/>
                </Col>
            </Row>
        </div>
        <div class="my-row">
            <Row>
                <Col span="4">
                    <p class="row-title">照片</p>
                </Col>
                <Col v-if="onlyShow">
                    <div v-for="(item, index) in defaultFileList" :key="index" class="my-item" @click="photoPreview(item)">
                        {{item.name}}
                    </div>
                </Col>
                <Col v-else style="text-align: left;">
                    <Upload action="/api/file/cacheUploadPhoto.json"
                    :headers="headerInfo"
                    :disabled="onlyShow"
                    :on-remove="removeCommit"
                    :on-preview="photoPreview"
                    :on-success="uploadSuccess"
                    :data="{type: 'rescue'}"
                    :default-file-list="defaultFileList">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                </Col>
            </Row>
        </div>
        <div v-if="!onlyShow" style="text-align: center">
            <Button type="primary" style="width: 100px;" @click="validate">提交</Button>
        </div>
        <Modal v-model="modal_switch" @on-cancel="img_switch = false">
            <div v-if="!img_switch" slot="footer">
                <Button type="primary" @click="submit">确认</Button>
                <Button @click="modal_switch = false">取消</Button>
            </div>
            <div v-else slot="footer"/>
            <div v-if="img_switch" style="text-align: center">
                <img :src="rescuePhoto" class="img-view"/>
            </div>
			<span v-else>我确认以上信息的真实性，并提交？</span>
		</Modal>
    </div>
</template>

<script>
import axios from '@/libs/request'
import {getToken} from '@/libs/utils'

export default {
    props: {
        applyInfo: {
            type: Object,
            required: true
        },
        submitUrl: {
            type: String,
            required: true
        },
        onlyShow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            apiUrl: {
                //rescueApplyURL: '/salvage/rescueApply.json',
                petTypeURL: '/salvage/petType.json',
                healthGradeURL: '/salvage/healthGrade.json',
                cacheDeletePhotoURL: '/file/cacheDeletePhoto.json',
                discardCachePhotoURL: '/file/discardCachePhoto.json',
                downloadPhotoURL: '/file/downloadPhoto.json'
            },
            headerInfo: {
				tokenauthorization: getToken() //设置请求Token
			},
            defaultFileList: [],
            petType: [],
			healthGradeInfo: [],
            applyFileList: [],
            rescuePhoto: '',
            modal_switch: false,
            img_switch: false,
            needSubmit: false
        }
    },
    methods: {
        submit () {
			axios.request({
				url: this.submitUrl,
				method: 'post',
				data: this.applyInfo
			}).then(res => {
				if (res.data && res.data.code == 200) {
                    this.needSubmit = false
                    this.modal_switch = false
                    this.$emit('submited')
					this.$Notice.info({
						title: '提示',
						desc: '提交成功'
					})
				}
			})
		},
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
		getHealthGradeInfo () {
			axios.request({
				url: this.apiUrl.healthGradeURL,
				method: 'get'
			}).then(res => {
				if (res.data && res.data.code == 200) {
					res.data.result.forEach(item => {
						this.healthGradeInfo.push({
							healthGrade: item.health_grade,
							healthCode: item.health_code
						})
						this.healthGradeInfo.sort((a, b) => {
							if (a.healthCode > b.healthCode) {
								return 1
							} else {
								return -1
							}
						})
					})
				}
			})
		},
        removeCommit(file, fileList) {
			axios.request({
				url: this.apiUrl.cacheDeletePhotoURL,
				method: 'get',
				params: {
					file: file.name,
                    type: 'rescue'
				}
			}).then(res => {
				if (res.data && res.data.code == 200) {
					this.applyFileList = fileList
                    console.log('---->', this.applyFileList)
                    this.needSubmit = true
					this.$Notice.info({
						title: '提示',
						desc: '删除成功!'
					})
				}
			})
		},
		photoPreview (file) {
            //console.log('---->', file)
            this.modal_switch = true
            this.img_switch = true
            axios.request({
	            url: this.apiUrl.downloadPhotoURL,
	            method: 'get',
	            responseType: 'blob',
                params: {
                    fileName: file.name,
                    type: 'rescue'
                }
	        }).then(res => {
	            let blob = new Blob([res.data], {type: res.headers['content-type']})
	            this.rescuePhoto = URL.createObjectURL(blob)
	        })
		},
		uploadSuccess(res, file, fileList) {
			if (res.code == 200) {
				this.applyFileList = fileList
                this.needSubmit = true
			}
		},
        validate () {
			if (this.applyInfo.typeCode == '') {
				this.warning('宠物种类不能为空!')
				return
			}
			if (this.applyInfo.rescueAddress == '') {
				this.warning('救助地址不能为空!')
				return
			}
			if (!this.applyInfo.healthCode) {
				this.warning('必须选择健康状况!')
				return
			}
			if (!/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(this.applyInfo.contact)) {
				this.warning('请输入正确的电话号码!')
				return
			}
			if (this.applyInfo.photos == '') {
				this.warning('至少需上传一张照片!')
				return
			}
			//this.$emit('validated')
            this.modal_switch = true
		},
		warning (msg) {
			this.$Notice.warning({
				title: '警告',
				desc: msg
			})
		},
        cancelSubmit () {
            if (this.needSubmit) {
                axios.request({
                    url: this.apiUrl.discardCachePhotoURL,
                    method: 'get',
                    params: {
                        type: 'rescue'
                    }
                }).then(res => {
                    //
                })
            }
        }
    },
    watch: {
        applyFileList: function() {
            this.applyInfo.photos = ''
            if (this.applyFileList.length > 0) {
			    let i = 0;
                this.applyFileList.forEach(file => {
				this.applyInfo.photos += file.name
				if (i < this.applyFileList.length - 1) {
					this.applyInfo.photos += ','
				}
				i++
			})
            }
        }
    },
    mounted () {
        this.getPetTypeInfo()
        this.getHealthGradeInfo()
        //console.log('---->', this.applyInfo)
        if (this.applyInfo) {
            let fileList = this.applyInfo.photos.split(",")
            fileList.forEach(file => {
                this.defaultFileList.push({
                    name: file
                })
            })
        }
    }
}
</script>

<style scoped>
.my-row {
	margin: 15px 0;
}
.img-view {
    width:250px;
    overflow: hidden;
	object-fit: cover;
    flex: 1;
}
.my-item {
    cursor: pointer;
    display: inline-block;
}
.my-item:hover {
    background: grey;
}
</style>