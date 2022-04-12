<template>
	<div>
		<p><span>
			<Icon type="md-arrow-round-back" @click="back"/>
		</span></p>
		<p>{{eventKey}}</p>
	</div>
</template>

<script>
export default {
	props: {
		//
	},
	data () {
		return {
			eventKey: this.$route.params.eventKey
		}
	},
	methods: {
		back () {
			this.$router.back()
		}
	},
	mounted () {
		//console.log('<----', this.$route.params)
	}
}
</script>