<template>
	<Layout style="margin: 5px 0px 5px 0px;">
		<div :id="'container'+id" v-if="message.mtype === 2" align="left">
			<div :style="stylePhoto">
				<img class="photo" src="@/assets/photos/puser.jpg">
			</div>
			<div style="display: inline;">
				<div :style="{'bottom': triangleBot}" class="triangle left"/>
				<div class="rectangle">
					<p>{{ message.text }}</p>
				</div>
				<div style="display:inline-block;width:20px">
					<img class="symbol_gantan" src="@/assets/symbol/gantanhao.jpg"/>
				</div>
			</div>
		</div>
		<div :id="'container'+id" v-else-if="message.mtype === 1" align="right">
			<div style="display: inline">
				<div style="display:inline-block">
					<img class="symbol_gantan" src="@/assets/symbol/gantanhao.jpg"/>
				</div>
				<div class="rectangle">
					<p>{{ message.text }}</p>
				</div>
				<div :style="{'bottom': triangleBot}" class="triangle right"/>
			</div>
			<div :style="stylePhoto">
				<img class="photo" src="@/assets/photos/puser.jpg">
			</div>
		</div>
		<div v-else-if="message.mtype === 0">
			<p class="systips">{{'系统消息: ' + message.text}}</p>
		</div>
	</Layout>
</template>

<script>
import $ from 'jquery'
	export default {
		name: 'MessageItem',
		props: {
			message: {
				type: Object,
				required: true
			},
			id: {
				type: Number,
				required: true
			}
		},
		data () {
			return {
				stylePhoto: {
					display: 'inline',
					position: 'relative',
					bottom: '0px'
				},
				triangleBot: '0px'
			}
		},
		methods: {
			scrollBottom () {
				//
			}
		},
		mounted () {
			let dth = $('#container'+this.id).height()
			this.stylePhoto.bottom = ((dth - 40) / 2) + 'px'
			this.triangleBot = ((dth - 25) / 2) + 'px'
		},
		computed: {
			//
		}
	}
</script>

<style type="text/css">
	.text_basic {
		background: #E9EBEC;
		margin: 20px 0px 20px 0px;
	}
	.text_left {
		text-align: left;
	}
	.text_right {
		text-align: right;
	}
	.photo {
		width: 40px;
		height: 40px;
		border-radius: 100%;
		overflow: hidden;
	}
	.symbol_gantan {
		width: 20px;
	}
	.triangle {
		width:0px;
		height:0px;
		display: inline-block;
		position: relative;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
	}
	.left {
		left: 4px;
		border-left: 10px solid transparent ;
		border-right: 10px solid gray;
	}
	.right {
		right: 4px;
		border-left: 10px solid gray ;
		border-right: 10px solid transparent;
	}
	.rectangle {
		line-height: 30px;
		min-width: 40px;
		max-width: 300px;
		text-align: left;
		border-radius: 10px;
		overflow: auto;
		display: inline-block;
		word-break: break-all;
		background: gray;
		padding: 5px;
	}
	.systips {
		text-align: center;
		color: gray;
	}
</style>