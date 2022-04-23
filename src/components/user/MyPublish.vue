<template>
    <Layout class="page-layout my-layout">
        <Header class="table-header">
            <Row :gutter="6">
                <Col span="4">
                    <DatePicker v-model="tableFilter.createDate"
                    type="date"
                    @on-change="tableFilter.createDate = $event"
                    format="yyyy-MM-dd"
                    placeholder="创建日期"/>
                </Col>
                <Col span="4">
                    <Select v-model="tableFilter.status" placeholder="审核状态">
                        <Option v-for="item in statusInfo" :key="item.statusCode" :value="item.statusCode">
                            {{item.statusName}}
                        </Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Button type="primary" @click="query">查询</Button>
                </Col>
            </Row>
        </Header>
        <Content>
            <Table height="500px" :columns="tableColumns" :data="tableData" :loading="loading"></Table>
        </Content>
        <Drawer v-model="drawer_switch" width="50" @on-close="closeDrawer">
            <RescueApplyTable ref="applyTable"
                v-if="drawer_switch"
                @submited="drawer_switch = false"
                :applyInfo="applyInfo"
                :submitUrl="apiUrl.submitURL"
                :onlyShow="isShow"/>
        </Drawer>
        <Modal v-model="modal_switch" @on-ok="deleteRescueApply">
            <span>确认删除该申请?</span>
        </Modal>
    </Layout>
</template>

<script>
import axios from '@/libs/request'
import RescueApplyTable from '@/components/salvation/rescue/RescueApplyTable'

export default {
    components: {RescueApplyTable},
    data () {
        return {
            apiUrl: {
                statusDictURL: '/salvage/statusDict.json',
                rescueApplySummaryURL: '/salvage/rescueApplySummary.json',
                rescueInfoURL: '/salvage/rescueApplyInfoById.json',
                deleteRescueApplyURL: '/salvage/deleteRescueApplyById.json',
                submitURL: '/salvage/updateRescueApply.json'
            },
            tableFilter: {
                createDate: '',
                status: ''
            },
            applyInfo: {
				typeCode: '',
				rescueAddress: '',
				healthCode: 0,
				contact: '',
				description: '',
				photos: ''
			},
            loading: false,
            drawer_switch: false,
            modal_switch: false,
            isShow: false,
            tableData: [],
            statusInfo: [],
            deletedApplyId: '',
            //rescueApplyInfo: {},
            tableColumns: [
                {title: '日期', key: 'createTime'},
                {title: '状态', key: 'status', render: (h, params) => {
                    let s = 'N/A'
                    this.statusInfo.forEach(item => {
                        if (item.statusCode == params.row.status) {
                            s = item.statusName
                        }
                    })
                    return h('span', s)
                }},
                {title: '地址', key: 'rescueAddress'},
                {title: '操作', render: (h, params) => {
                    let arr = ['详情', '修改', '删除']
                    let compArr = []
                    for (let i = 0; i < arr.length; i++) {
                        compArr.push(h('span', {
                            style: {
                                'text-decoration': 'underline',
                                margin: '0 5px',
                                cursor: 'pointer'
                            },
                            on: {
                                click: () => {
                                    this.getApplyInfo(params.row.rescueApplyId, i)
                                }
                            }
                        }, arr[i]))
                    }
                    return h('div', compArr)
                }}
            ]
        }
    },
    methods: {
        //查询申请信息
        query () {
            this.loading = true
            this.tableData = []
            axios.request({
                url: this.apiUrl.rescueApplySummaryURL,
                method: 'post',
                data: this.tableFilter
            }).then(res => {
                if (res.data && res.data.code == 200) {
                    this.tableData = res.data.result
                }
                this.loading = false
            })
        },
        //获取状态字典信息
        getStatusDictInfo () {
            axios.request({
                url: this.apiUrl.statusDictURL,
                method: 'get'
            }).then(res => {
                if (res.data && res.data.code == 200) {
                    res.data.result.forEach(item => {
                        this.statusInfo.push({
                            statusCode: item.status_code,
                            statusName: item.status_name
                        })
                    })
                }
            })
        },
        //获取申请信息详情
        getApplyInfo (applyId, operateFlag) {
            switch(operateFlag) {
                case 0:
                    this.getRescueApplyInfo(applyId)
                    this.drawer_switch = true
                    this.isShow = true
                    break
                case 1:
                    this.getRescueApplyInfo(applyId)
                    this.drawer_switch = true
                    this.isShow = false
                    break
                case 2:
                    this.modal_switch = true
                    this.deletedApplyId = applyId
            }
        },
        getRescueApplyInfo (applyId) {
            axios.request({
                url: this.apiUrl.rescueInfoURL,
                method: 'get',
                params: {
                    applyId: applyId
                }
            }).then(res => {
                if (res.data && res.data.code == 200) {
                    this.applyInfo = res.data.result
                }
            })
        },
        deleteRescueApply () {
            axios.request({
                url: this.apiUrl.deleteRescueApplyURL,
                method: 'get',
                params: {
                    applyId: this.deletedApplyId
                }
            }).then(res => {
                if (res.data && res.data.code == 200) {
                    this.modal_switch = false
                    this.deletedApplyId = ''
                    this.query()
                    this.$Notice.info({
                        title: '提示',
                        desc: '删除成功'
                    })
                }
            })
        },
        closeDrawer () {
            this.$refs.applyTable.cancelSubmit()
        }
    },
    mounted () {
        this.getStatusDictInfo()
        this.query()
    }
}
</script>

<style scoped>
.table-header {
  min-height: 45px !important;
  border-bottom: 1px solid #f2f2f2;
}
.my-layout {
    height: 100%;
    width: 95%;
    position: relative;
    left: 5%;
}
.my-row {
	margin: 15px 0;
}
</style>