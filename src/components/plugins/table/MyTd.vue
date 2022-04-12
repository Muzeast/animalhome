<script>
export default {
	name: 'MyTd',
	data () {
		return {
			//
		}
	},
	props: {
		params: {
			type: Object,
			required: true
		}
	},
	render (h) {
		var temp_node
		if (this.params) {
			if (this.params.render) {
				temp_node = this.params.render(h, this.params.row)
				return h('td', [temp_node])
			} else {
				return h('td', this.params.row)
			}
		}
	}
}
</script>