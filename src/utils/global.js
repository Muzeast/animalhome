// global.js
export default {
	ws: {}, //WebSocket对象
	delay: 1500, //重连时延，单位毫秒
	//设置websocket对象
	setWs: function(newWs) {
		this.ws = newWs
	},
	//设置延迟
	setDelay: function(newDelay) {
		this.delay = newDelay
	},
	//发送websocket信息
	sendMessage: function(message) {
		this.ws.send(JSON.stringify(message))
	},
	//判断当前websocket对象是否存在
	ifExistWs: function() {
		return this.ws !== null
	}
}