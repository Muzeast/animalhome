<template>
	<Layout>
		<Sider style="background: #F1F3F4; z-index: 0;">
			<Menu :active-name="menuList[0].menuCode" width="auto">
				<MenuItem v-for="menu in menuList"
				:key="menu.menuId"
				:name="menu.menuCode"
				:to="menu.routePath">
					<Icon :type="menu.menuIcon"/>{{menu.menuName}}
				</MenuItem>
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
			menuList: this.$route.params.menuList
		}
	},
	methods: {
		//
	},
	mounted () {
		//console.log('menuList---->', this.$route.params.menuList)
	}
}
</script>

<style scoped>
.main-area {
	height: auto;
}
.sider-area {
	width: 20%;
	float: left;
	z-index: -10;
}
.content-area {
	width: 80%;
	padding-left: 10px;
	float: left;
	clear: none;
}
</style>