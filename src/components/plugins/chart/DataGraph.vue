<template>
	<div id="contain" style="width: 80%;position: relative;left: 10%;">
		<div ref="container" :style="chartStyle"></div>
	</div>
</template>

<script>
import $ from 'jquery'
import * as echarts from 'echarts'

export default {
	name: 'DataGraph',
	props: {
		chartOption: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			chart: '',
			chartStyle: {
				width: '800px',
				height: '500px'
			}
		}
	},
	methods: {
		//
	},
	beforeMount () {
		this.chartStyle.width = $("#contain").width() + 'px'
		console.log('-->', this.chartStyle)
	},
	mounted () {
		this.chart = echarts.init(this.$refs.container)
		this.chart.setOption(this.chartOption)
	}
}
</script>