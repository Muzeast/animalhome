<template>
	<div class="dwrap">
		<div class="div_title">
			<span class="stitle">{{ title }}</span>
		</div>
		<div class="div_content">
			<Tooltip :content="tooltip">
				<transition :name="direction">
					<span v-if="show" class="scontent" @mouseover="actionMess(0)" @mouseout="actionMess(1)">
						{{ show_text }}
					</span>
				</transition>
			</Tooltip>
		</div>
	</div>
</template>

<script>
export default {
	name: 'TextScroll',
	props: {
		title: {
			type: String,
			default: ''
		},
		direction: {
			type: String,
			default: 'vertical'
		},
		stay: {
			type: Number,
			default: 3000
		},
		shift: {
			type: Number,
			default: 500
		},
		messages: {
			type: Array,
			required: true
		},
		span: {
			type: Number,
			default: 100
		}
	},
	data () {
		return {
			show_text: '',
			show: true,
			timer: '',
			delay: 0,
			mes_ind: 0,
			mes_len: 0,
			tooltip: ''
		}
	},
	methods: {
		setTimer () {
			this.delay = this.show ? this.shift : this.stay
			if (this.show) {
				this.mes_ind = this.mes_ind % this.mes_len
				this.show_text = this.messages[this.mes_ind].text
				this.tooltip = this.messages[this.mes_ind].time
				this.mes_ind++
			}
			this.timer = setTimeout(this.setTimer, this.delay)
			this.show = !this.show
		},
		actionMess (flag) {
			if (flag == 0) {
				clearTimeout(this.timer)
			} else if (flag == 1) {
				this.setTimer()
			}
		}
	},
	mounted () {
		//this.setTimer()
	},
	beforeDestroy () {
		clearTimeout(this.timer) //销毁页面前注销定时器
	},
	watch: {
		messages: function () {
			if (this.messages.length > 0) {
				this.mes_len = this.messages.length
				clearTimeout(this.timer)
				this.setTimer()
			} else {
				this.show_text = "暂无预警信息!"
			}
		}
	}
}
</script>

<style type="text/css">
	.dwrap {
		display: inline-block;
		background: #282923;
		width: 60%;
		overflow: hidden;
		color: white;
		font-weight: 550;
	}
	.div_title {
		float: left;
		width: 25%;
		text-align: center;
	}
	.div_content {
		float: right;
		width: 75%;
		text-align: left;
		clear: none;
	}
	.stitle {
		color: #FD7D22;
	}
	.scontent {
		display: inline-block;
		cursor: pointer;
	}
	.vertical-enter-active {
		animation: vertical-in 1s;
	}
	.vertical-leave-active {
		animation: vertical-out  1s;
	}
	.horizontal-enter-active {
		animation: horizontal-in 1s;
	}
	.horizontal-leave-active {
		animation: horizontal-out 1s;
	}
	@keyframes vertical-in {
		0% {
			transform: translateY(100%);
		}
		100% {
			transform: translateY(0);
		}
	}
	@keyframes vertical-out {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-100%);
		}
	}
	@keyframes horizontal-in {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(0);
		}
	}
	@keyframes horizontal-out {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-100%);
		}
	}
</style>