<template>
	<Layout>
		<Sider style="background: #F1F3F4; z-index: 0;">
			<Menu active-name="1" width="auto">
				<MenuItem name="1" to="userInfo">
					<Icon type="md-stats"/>
                    用户信息
				</MenuItem>
				<MenuItem name="2" to="myPublish">
					<Icon type="md-stats"/>
                    我的申请
				</MenuItem>
				<MenuItem name="3">
					<Icon type="md-stats"/>
                    我的收养
				</MenuItem>
				<MenuItem name="4">
					<Icon type="md-stats"/>
                    系统消息&nbsp;
                    <Badge dot>
                    	<Icon type="md-notifications" size="18"/>
                    </Badge>
				</MenuItem>
			</Menu>
		</Sider>
		<Content>
			<router-view @updateUserInfo="updateUserInfo"></router-view>
		</Content>
	</Layout>
</template>

<script>
export default {
	data () {
		return {
			//
		}
	},
	methods: {
		updateUserInfo () {
			this.$emit('updateUserInfo')
		}
	}
}
</script>