<template>
    <div>
        <div class="my-row">
            <Row>
                <Col span="6">
                    <span>真实姓名</span>
                </Col>
                <Col span="14">
                    <Input v-model="applyInfo.realName" :disabled="onlyShow"></Input>
                </Col>
            </Row>
        </div>
        <div class="my-row">
            <Row>
                <Col span="6">
                    <span>身份证号</span>
                </Col>
                <Col span="14">
                    <Input v-model="applyInfo.idNumber" :disabled="onlyShow"></Input>
                </Col>
            </Row>
        </div>
        <div class="my-row">
            <Row>
                <Col span="6">
                    <span>居住地址</span>
                </Col>
                <Col span="14">
                    <Input v-model="applyInfo.address" :disabled="onlyShow"></Input>
                </Col>
            </Row>
        </div>
        <div class="my-row">
            <Row>
                <Col span="6">
                    <span>联系方式</span>
                </Col>
                <Col span="14">
                    <Input v-model="applyInfo.contact" :disabled="onlyShow"></Input>
                </Col>
            </Row>
        </div>
        <div v-for="item in photoTypeList" :key="item.key" class="my-row">
            <Row>
                <Col span="6">
                    <span>{{item.title}}</span>
                </Col>
                <Col v-if="onlyShow">
                    <div class="my-item" @click="previewPhoto(item.key)">{{applyInfo[item.key]}}</div>
                </Col>
                <Col v-else>
                    <Upload
                        action="/api/file/cacheUploadPhoto.json"
                        :headers="headerInfo"
                        :disabled="onlyShow"
                        :data="{type: 'authentic'}"
                        :before-upload="(file) => beforeUpload(file, item.key)"
                        :on-success="(res, file, fileList) => uploadPhoto(res, file, item.key)"
                        :on-remove="() => removePhoto(item.key)"
                        :on-preview="() => previewPhoto(item.key)">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                </Col>
            </Row>
        </div>
        <div v-if="!onlyShow" style="text-align: center">
            <Button type="primary" style="width: 100px;" @click="validate">提交</Button>
        </div>
        <Modal v-model="modal_switch" @on-cancel="img_switch = false">
            <div v-if="img_switch" slot="footer"/>
            <div v-else slot="footer">
                <Button type="primary" @click="submit">确认</Button>
                <Button @click="modal_switch = false">取消</Button>
            </div>
            <div v-if="img_switch" style="text-align: center">
                <img :src="authenticPhoto" class="img-view"/>
            </div>
            <span v-else>确认提交？</span>
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
        submitURL: {
            type: String,
            default: '/user/submitAuthenticApply.json'
        },
        onlyShow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            apiUrl: {
                cacheDeletePhotoURL: '/file/cacheDeletePhoto.json',
                discardCachePhotoURL: '/file/discardCachePhoto.json',
                downloadPhotoURL: '/file/downloadPhoto.json'
            },
            headerInfo: {
				tokenauthorization: getToken() //设置请求Token
			},
            photoTypeList:[
                {title: '身份证正面照', key: 'idPhotoFront'},
                {title: '身份证背面照', key: 'idPhotoRear'},
                {title: '本人照', key: 'personalPhoto'}
            ],
            authenticPhoto: '',
            modal_switch: false,
            img_switch: false,
            needSubmit: false
        }
    },
    methods: {
        submit () {
            axios.request({
                url: this.submitURL,
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
        beforeUpload(file, key) {
            if (this.applyInfo[key] != null && this.applyInfo[key] != '') {
                let str
                this.photoTypeList.forEach(item => {
                    if (item.key == key) {
                        str = item.title
                    }
                })
                this.warning('只能上传一张' + str)
                return false
            }
            return true
        },
        uploadPhoto(res, file, key) {
            if (res.code == 200) {
                this.applyInfo[key] = file.name
                this.needSubmit = true
            }
        },
        removePhoto(key) {
            axios.request({
                url: this.apiUrl.cacheDeletePhotoURL,
                method: 'get',
                params: {
					file: this.applyInfo[key],
                    type: 'authentic'
				}
            }).then(res => {
                if (res.data && res.data.code == 200) {
                    this.applyInfo[key] = ''
                    this.needSubmit = true
                    this.$Notice.info({
                        title: '提示',
                        desc: '删除成功!'
                    })
                }
            })
        },
        previewPhoto(key) {
            axios.request({
                url: this.apiUrl.downloadPhotoURL,
                method: 'get',
                responseType: 'blob',
                params: {
                    fileName: this.applyInfo[key],
                    type: 'authentic'
                }
            }).then(res => {
                if (res.status == 200) {
                    this.modal_switch = true
                    this.img_switch = true
                    let blob = new Blob([res.data], {type: res.headers['content-type']})
	                this.authenticPhoto = URL.createObjectURL(blob)
                }
            })
        },
        validate () {
            if (this.applyInfo.realName == '') {
                this.warning('真实姓名不能为空')
                return
            }
            if (this.applyInfo.idNumber == '') {
                this.warning('身份证号不能为空')
                return
            }
            if (this.applyInfo.address == '') {
                this.warning('居住地址不能为空')
                return
            }
            if (!/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(this.applyInfo.contact)) {
                this.warning('输入正确的联系方式')
                return
            }
            if (this.applyInfo.idPhotoFront == '') {
                this.warning('请上传身份证正面照')
                return
            }
            if (this.applyInfo.idPhotoRear == '') {
                this.warning('请上传身份证背面照')
                return
            }
            if (this.applyInfo.personalPhoto == '') {
                this.warning('请上传本人照')
                return
            }
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
                        type: 'authentic'
                    }
                }).then(res => {
                    //
                })
            }
        },
    },
    mounted() {
        if (this.applyInfo) {
            //console.log('---->', this.applyInfo)
        }
    },
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