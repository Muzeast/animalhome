<template>
	<div>
		<List>
			<ListItem v-for="i in 5" :key="i">
				<p>活动 {{i}}</p>
				<template slot="action">
					<li>
						<a @click="actionDetails(i)">查看详情</a>
					</li>
				</template>
			</ListItem>
		</List>
	</div>
</template>

<script>
export default {
	data () {
		return {
			//
		}
	},
	methods: {
		actionDetails(key) {
			this.$router.push({
				name: 'eventsInfo',
				params: {eventKey: key}
			})
		}
	}
}
</script>