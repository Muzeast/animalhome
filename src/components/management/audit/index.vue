<template>
	<Layout>
		<Sider style="background: #F1F3F4; z-index: 0;">
			<Menu :active-name="menuList[0].menuCode">
				<MenuItem v-for="menu in menuList"
				:key="menu.menuId"
				:name="menu.menuCode"
				:to="menu.routePath">{{menu.menuName}}</MenuItem>
			</Menu>
		</Sider>
		<Content>
			<router-view></router-view>
		</Content>
	</Layout>
</template>

<script>
export default {
	data () {
		return {
			menuList: [],
		}
	},
	methods: {
		//
	},
	mounted () {
		this.menuList = this.$route.params.menuList
	}
}
</script>