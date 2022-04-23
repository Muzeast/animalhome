<template>
	<div>
		<Card style="width: 70%;position: relative; left: 15%;min-height: 400px;">
			<p class="head-title" slot="title">救助申请填写</p>
			<RescueApplyTable ref="applyTable" :applyInfo="applyInfo" @submited="submited" :submitUrl="apiUrl.submitURL"/>
			<Divider/>
		</Card>
	</div>
</template>

<script>
import RescueApplyTable from './RescueApplyTable.vue'

export default {
	components: {RescueApplyTable},
	data () {
		return {
			apiUrl: {
				submitURL: '/salvage/rescueApply.json'
			},
			applyInfo: {
				typeCode: '',
				rescueAddress: '',
				healthCode: 0,
				contact: '',
				description: '',
				photos: ''
			}
		}
	},
	methods: {
		submited () {
			this.$router.push({
				name: 'home'
			})
		}
	},
	mounted () {
		//
	},
	beforeDestroy () {
		this.$refs.applyTable.cancelSubmit()
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