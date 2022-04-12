<template>
	<div align="center">
		<div class="main_area">
			<div class="message_area">
				<Messages :messages="messages"/>
			</div>
			<Divider/>
			<div class="input_area">
				<Input v-model="text_message" size="large" clearable placeholder="说点什么吧..."/>
				<div align="right" style="position: relative; top: 10px;">
					<Button type="warning" size="small" @click="clearMessage">清空记录</Button>
					<Button type="primary" @click="sendMessage">发送</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import request from '@/utils/request'
import Messages from '@/components/chat/Messages.vue'
export default {
	name: 'MyChat',
	components: { Messages },
	data () {
		return {
			ws: {},
			ws_data: '',
			text_message: '',
			messages: []
		}
	},
	mounted() {
		this.initWebSocket()
		this.messages.push({
			text: '进入聊天室...',
			mtype: 0
		})
	},
	methods: {
		initWebSocket () {
			if ("WebSocket" in window) {
				this.ws = new WebSocket("ws://127.0.0.1:18088/display/14018")
				this.$global.setWs(this.ws)
				this.ws.onopen = function() {
					console.log('正在服务器连接...')
				}
				this.ws.onclose = function(message) {
					console.log('服务器连接断开!')
				}
				this.ws.onerror = function(error) {
					console.log('服务器发送错误!')
				}
				this.ws.onmessage = function(res) {
					if (res && res.data) {
						ws2Vue(res.data)
					}
				}
				let ws2Vue = function(data) {
					//this.ws_data = data
					this.messages.push(JSON.parse(data))
				}.bind(this)
			}
		},
		sendMessage() {
			if (this.text_message == '') {
				this.$Notice.warning({
					title: '提示',
					desc: '发送消息不能为空!'
				})
				return
			}
			this.$global.sendMessage(this.text_message)
			this.messages.push({
				text: this.text_message,
				mtype: 1
			})
			this.text_message = ''
		},
		clearMessage() {
			this.messages = []
		}
	}
}
</script>

<style type="text/css">
	.main_area {
		width: 60%;
		height: 550px;
		background: white;
		border: 1px solid #00D0EC;
	}
	.message_area {
		height: 70%;
		background: #F5F7F9;
	}
	.input_area {
		height: 20%;
		margin: 0px 20px 0px 20px;
	}
</style>