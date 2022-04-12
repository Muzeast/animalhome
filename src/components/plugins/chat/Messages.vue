<script>
import MessageItem from '@/components/chat/MessageItem.vue'
export default {
	name: 'Messages',
	components: { MessageItem },
	data () {
		return {
			//messageCounter: 0
		}
	},
	props: {
		messages: {
			type: Array,
			required: true
		}
	},
	render(h) {
		let mess = []
		let ind = 0
		this.messages.forEach(message => {
			mess.push(h('MessageItem', {
				props: {
					message: message,
					id: ind++
				}
			})
		)})
		return h('div', {
			'class': {
				message_box: true
			},
			attrs: {
				id: 'messContainer'
			}
		}, mess)
	}
}
</script>

<style type="text/css">
	.message_box {
		height: 100%;
		overflow-y: scroll;
	}
</style>