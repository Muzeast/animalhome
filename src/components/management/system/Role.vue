<template>
	<div>
		<div class="menu-nav">
			<Card>
				<div slot="title">
					<p>系统角色</p>
				</div>
				<Menu :width="menu_nav_width" :active-name="curRoleCode" style="z-index: 0;">
					<MenuItem v-for="(item, index) in roleList"
					:name="item.roleCode"
					:key="index"
					@click.native="changeMenu(item.roleId)">
						<p>{{item.roleName}}</p>
					</MenuItem>
				</Menu>
			</Card>
		</div>
		<div class="menu-content">
			<Card>
				<div slot="title" align="right">
					<Button type="primary" @click="modal_switch = true">提交</Button>
				</div>
				<Tabs v-model="curTabPane" @on-click="changeTab">
					<TabPane label="菜单权限" name="menu">
					</TabPane>
					<TabPane label="用户信息" name="user">
					</TabPane>
				</Tabs>
				<Content>
					<Tree ref="menuUserTree" :data="treeData" @on-check-change="treeCheckChange" show-checkbox></Tree>
				</Content>
			</Card>
		</div>
		<Modal v-model="modal_switch" @on-ok="submit">
			<p slot="header">提示</p>
			<p style="text-align: center;">确认提交?</p>
		</Modal>
	</div>
</template>

<script>
import axios from '@/libs/request'
import {generateMenuTreeData, generateUserTreeData} from '@/libs/utils'

export default {
	data () {
		return {
			apiURL: {
				roleListURL: '/management/role.json',
				menuListURL: '/management/menu.json',
				roleMenuListURL: '/management/roleMenuList.json',
				userListURL: '/management/userListByRole.json',
				allUserListURL: '/user/allUserList.json',
				updatedRoleMenuURL: '/management/updateRoleMenu.json',
				updatedRoleUserURL: '/management/updateRoleUser.json'
			},
			menu_nav_width: '',
			roleList: [],
			menuTreeData: [],
			allUserList: [],
			curRoleCode: '', //当前选择角色Code
			curRoleId: '', //当前选择角色ID
			curTabPane: 'menu', //
			submitTreeData: [],
			modal_switch: false,
			treeData: [],
		}
	},
	methods: {
		getRoleList () {
			axios.request({
				url: this.apiURL.roleListURL,
				method: 'get'
			}).then(res => {
				if (res.data && res.data.code == 200) {
					this.roleList = res.data.result
				}
			})
		},
		getAllUserList () {
			axios.request({
				url: this.apiURL.allUserListURL,
				method: 'get'
			}).then(res => {
				if (res.data && res.data.code == 200) {
					this.allUserList = res.data.result
				}
			})
		},
		getRoleUserList (roleId) {
			axios.request({
				url: this.apiURL.userListURL,
				method: 'get',
				params: {
					roleId: roleId
				}
			}).then(res => {
				if (res.data && res.data.code == 200) {
					let userInfo = []
					res.data.result.forEach(user => {
						userInfo.push(user.count)
					})
					this.treeData = generateUserTreeData(this.allUserList, userInfo)
				}
			})
		},
		changeMenu (roleId) {
			this.curTabPane = 'menu'
			this.getRoleMenuListById(roleId)
		},
		getMenuList () {
			axios.request({
				url: this.apiURL.menuListURL,
				method: 'get'
			}).then(res => {
				if (res.data && res.data.code == 200) {
					this.menuTreeData = generateMenuTreeData(res.data.result, null)
					this.treeData = this.menuTreeData
				}
			})
		},
		getRoleMenuListById (roleId) {
			this.curRoleId = roleId
			axios.request({
				url: this.apiURL.roleMenuListURL,
				method: 'get',
				params: {
					roleId: roleId
				}
			}).then(res => {
				if (res.data && res.data.code == 200) {
					//刷新菜单树信息
					this.treeData = this.refreshMenuTreeData(this.menuTreeData, res.data.result['1'], res.data.result['0'])
				}
			})
		},
		changeTab (name) {
			this.curTabPane = name
			switch (name) {
				case 'menu': 
					this.getRoleMenuListById(this.curRoleId)
					break
				case 'user':
					this.getRoleUserList(this.curRoleId)
			}
		},
		treeCheckChange (checkedList, checkedItem) {
			this.submitTreeData = []
			if (this.curTabPane == 'menu') {
				let arr = this.$refs.menuUserTree.getCheckedAndIndeterminateNodes()
				console.log('---->', arr)
				arr.forEach(item => {
					this.submitTreeData.push({
						roleId: this.curRoleId,
						menuId: item.menuId
					})
				})
			} else if (this.curTabPane == 'user') {
				checkedList.forEach(item => {
					if (item.isUser) {
						this.submitTreeData.push({
							roleId: this.curRoleId,
							userId: item.user_id
						})
					}
				})
			}
			//console.log('---->', this.submitTreeData)
		},
		submit () {
			let requestURL = ''
			if (this.curTabPane == 'menu') {
				requestURL = this.apiURL.updatedRoleMenuURL
			} else if (this.curTabPane == 'user') {
				requestURL = this.apiURL.updatedRoleUserURL
			}
			new Promise((resolve, reject) => {
				axios.request({
					url: requestURL,
					method: 'post',
					data: this.submitTreeData
				}).then(res => {
					if (res.data && res.data.code == 200) {
						this.$Notice.warning({
							title: '信息',
							desc: '请求成功!'
						})
						resolve()
					}
				})
			}).then(res => {
				if (this.curTabPane == 'menu') {
					this.getRoleMenuListById(this.curRoleId)
				} else if (this.curTabPane == 'user') {
					this.getRoleUserList(this.curRoleId)
				}
			})
		},
		refreshMenuTreeData (tree, defaultMenuIds, menuIds) {
			var res = []
			tree.forEach(item => {
				var node = {
					title: item.menuName,
					menuId: item.menuId,
					menuName: item.menuName,
					menuCode: item.menuCode,
					menuIcon: item.menuIcon,
					parentId: item.parentId,
					routePath: item.routePath,
					order: item.order,
					expand: true
				}
				if (item.children.length > 0) {
					node.children = this.refreshMenuTreeData(item.children, defaultMenuIds, menuIds)
				} else {
					if (menuIds && menuIds.indexOf(item.menuId) > -1) {
						node.checked = true
					}/* else {
						node.checked = false
					}*/
					if (defaultMenuIds && defaultMenuIds.indexOf(item.menuId) > -1) {
						node.checked = true
						node.disabled = true
					}
				}
				res.push(node)
			})
			return res
		}
	},
	mounted () {
		let nav_width = $('.menu-nav').css('width') - 10
		this.menu_nav_width = nav_width + 'px'
		new Promise((resolve, reject) => {
			axios.request({
				url: this.apiURL.roleListURL,
				method: 'get'
			}).then(res => {
				if (res.data && res.data.code == 200) {
					this.roleList = res.data.result
					resolve()
				}
			})
		}).then(res => {
			this.curRoleId = this.roleList[0].roleId
			this.curRoleCode = this.roleList[0].roleCode
		})
		this.getMenuList()
		this.getAllUserList()
	}
}
</script>

<style scoped>
.menu-nav {
	width: 20%;
	min-height: 300px;
	text-align: left;
	float: left;
}
.menu-content {
	width: 80%;
	text-align: left;
	padding-left: 10px;
	float: left;
	clear: none;
}
.active {
	height: 40px;
	color: #2D8CF0;
	background: #F0FAFF;
}
</style>