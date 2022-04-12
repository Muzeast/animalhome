<template>
	<div>
		<div class="menu-nav">
			<Card>
				<Tree :data="menuTreeData" @on-select-change="changeTreeNode"></Tree>
			</Card>
		</div>
		<div class="menu-content">
			<Card>
				<Table :columns="menuColumn" :data="menuTableData" @on-selection-change="onSelectChange">
					<div slot="header">
						<div class="header-left">
							<span slot="header">当前菜单: {{selectedTreeMenu.title}}</span>
						</div>
						<div class="header-operate">
							<Button type="primary" @click="addMenu">新增</Button>
							<Button type="primary" @click="alterMenu">修改</Button>
							<Button type="primary" @click="confirmDelete">删除</Button>
						</div>
					</div>
				</Table>
			</Card>
		</div>
		<Modal v-model="modal_switch">
			<p slot="header">新增菜单</p>
			<Input class="my-input" v-model="menuInfo.menuName">
				<span slot="prepend">菜单名称<span style="color:red">*</span></span>
			</Input>
			<Input class="my-input" v-model="menuInfo.menuCode">
				<span slot="prepend">菜单编码<span style="color:red">*</span></span>
			</Input>
			<Input class="my-input" v-model="menuInfo.menuIcon">
				<span slot="prepend">菜单图标</span>
			</Input>
			<Row>
				<Col span="4">
					<div class="select-title">默认菜单</div>
				</Col>
				<Col span="20">
					<Select v-model="menuInfo.defaultMenu" style="width:200px">
				        <Option :value="1">是</Option>
				        <Option :value="0">否</Option>
				    </Select>
				</Col>
			</Row>
			<Row>
				<Col span="4">
					<div class="select-title">隐藏菜单</div>
				</Col>
				<Col span="20">
					<Select v-model="menuInfo.hidden" style="width:200px">
				        <Option :value="1">是</Option>
				        <Option :value="0">否</Option>
				    </Select>
				</Col>
			</Row>
			<Input class="my-input" v-model="menuInfo.order">
				<span slot="prepend">&nbsp;&nbsp;序号</span></span>
			</Input>
			<div slot="footer">
				<Button @click="cancle">取消</Button>
				<Button @click="submit" type="primary">确定</Button>
			</div>
		</Modal>
		<modal v-model="switch_delete" @on-ok="deleteMenu">
			<p slot="header">提示</p>
			<p>确认删除菜单?</p>
		</modal>
	</div>
</template>

<script>
import axios from '@/libs/request'
import {generateMenuTreeData} from '@/libs/utils'

export default {
	data () {
		return {
			apiURL: {
				menuURL: '/management/menu.json',
				addMenuURL: '/management/addMenu.json',
				updateMenuURL: '/management/updateMenu.json',
				deleteMenuURL: '/management/deleteMenu.json'
			},
			menuTreeData: [],
			menuColumn: [
				{
					type: 'selection',
					width: 60,
					align: 'center'
				},
				{
					title: '菜单名', key: 'menuName'
				},
				{
					title: '菜单编码', key: 'menuCode'
				},
				{
					title: '菜单图标', key: 'menuIcon'
				},
				{
					title: '菜单路径', key: 'routePath'
				},
				{
					title: '默认菜单', key: 'routePath', render: (h, params) => {
						let res = params.row.defaultMenu == 1 ? '是' : '否'
						return h('span', res)
					}
				},
				{
					title: '序号', key: 'order', sortType: 'asc'
				}
			],
			selectedTreeMenu: '', //Tree中选择的菜单阶段
			selectedTableMenu: '', //Table中选择的菜单节点
			menuTableData: [],
			modal_switch: false,
			switch_delete: false,
			operateFlag: 0,
			preMenuCode: '',
			menuInfos: [],
			menuInfo: {
				menuId: '',
				menuName: '',
				menuCode: '',
				menuIcon: '',
				parentId: '',
				routePath: '',
				defaultMenu: 0,
				hidden: 0,
				order: 0
			}
		}
	},
	methods: {
		getMenuList () {
			//this.menuTreeData = []
			this.menuTableData = []
			axios.request({
				url: this.apiURL.menuURL,
				method: 'get'
			}).then(res => {
				if (res.data && res.data.code == 200) {
					this.menuTreeData = generateMenuTreeData(res.data.result, null, null, null, null)
					this.clearMenuInfo()
				}
			})
		},
		changeTreeNode (nodeList, node) {
			this.selectedTreeMenu = node
			this.menuTableData = []
			/*console.log('nodeList---->', nodeList)
			console.log('node---->', node)*/
			node.children.forEach(item => {
				this.menuTableData.push({
					menuId: item.menuId,
					menuName: item.title,
					menuCode: item.menuCode,
					menuIcon: item.menuIcon,
					routePath: item.routePath,
					defaultMenu: item.defaultMenu,
					hidden: item.hidden,
					order: item.order
				})
			})
		},
		onSelectChange (selection) {
			this.selectedTableMenu = selection
		},
		//补充菜单信息
		replenish () {
			this.menuInfo.parentId = this.selectedTreeMenu.menuId
			this.menuInfo.routePath = this.selectedTreeMenu.routePath + '/' + this.menuInfo.menuCode
		},
		/**
		 * 上传菜单信息
		 */
		 submitMenuInfo(url) {
		 	axios.request({
		 		url: url,
		 		method: 'post',
		 		data: this.operateFlag == 1 ? this.menuInfo : this.menuInfos
		 	}).then(res => {
		 		if (res.data && res.data.code == 200) {
		 			this.getMenuList()
		 		}
		 	})
		 },
		/**
		 * 新增菜单
		 */
		addMenu () {
			this.clearMenuInfo()
			if (!this.selectedTreeMenu) {
				this.$Notice.warning({
					title: '提示',
					desc: '必须选择所属菜单!'
				})
				return
			}
			this.operateFlag = 1
			this.modal_switch = true
		},
		/**
		 * 修改菜单
		 */
		alterMenu () {
			this.clearMenuInfo()
			if (this.selectedTableMenu.length == 0) {
				this.notice('请选择需要修改的菜单!')
				return
			}
			if (this.selectedTableMenu.length > 1) {
				this.notice('只能对单个菜单进行操作!')
				return
			}

			let menu = this.selectedTableMenu[0]
			this.menuInfo.menuId = menu.menuId
			this.menuInfo.menuName = menu.menuName
			this.menuInfo.menuCode = menu.menuCode
			this.preMenuCode = menu.menuCode //记录初始MenuCode
			this.menuInfo.menuIcon = menu.menuIcon
			this.menuInfo.defaultMenu = menu.defaultMenu
			this.menuInfo.hidden = menu.hidden
			this.menuInfo.order = menu.order

			this.operateFlag = 2
			this.modal_switch = true
		},
		confirmDelete () {
			if (this.selectedTableMenu.length == 0) {
		 		this.notice('请选择需要删除的菜单!')
		 		return
		 	}
		 	this.switch_delete = true
		},
		/**
		 * 删除菜单
		 */
		 deleteMenu () {
		 	let deletedMenuIds = []
		 	this.selectedTableMenu.forEach(item => {
		 		deletedMenuIds.push(item.menuId)
		 		deletedMenuIds = deletedMenuIds.concat(this.traverseTreeAllDele(this.menuTreeData, item.menuCode))
		 	})
		 	new Promise((resolve, reject) => {
		 		axios.request({
			 		url: this.apiURL.deleteMenuURL,
			 		method: 'post',
			 		data: deletedMenuIds
			 	}).then(res => {
			 		if (res.data && res.data.code == 200) {
			 			resolve()
			 		}
			 	})
		 	}).then(res => {
		 		this.getMenuList()
		 	})
		 },
		 cancle () {
		 	this.modal_switch = false
		 },
		 submit () {
		 	if (!this.validate()) {
		 		return;
		 	}
		 	let requestURL = ''
		 	if (this.operateFlag == 1) {
		 		requestURL = this.apiURL.addMenuURL
		 	} else if (this.operateFlag == 2) {
		 		if (this.preMenuCode != this.menuInfo.menuCode) {
		 			this.menuInfos = this.allChangedNode(this.menuTreeData, this.menuInfo.menuId, this.preMenuCode, this.menuInfo.menuCode)
		 		}
		 		this.menuInfos.push(this.menuInfo)
		 		console.log('---->', this.menuInfo)
		 		requestURL = this.apiURL.updateMenuURL
		 	}
		 	this.replenish()
		 	this.submitMenuInfo(requestURL)
		 	this.modal_switch = false;
		 },
		 validate () {
		 	if (this.menuInfo.menuName == '') {
		 		this.notice('菜单名称不能为空')
		 		return false
		 	}
		 	if (this.menuInfo.menuCode == '') {
		 		this.notice('菜单编码不能为空!')
		 		return false
		 	}
		 	if (this.menuInfo.order && !/\d+/.test(this.menuInfo.order)) {
		 		this.notice('菜单序号必须为数字!')
		 		return false
		 	}
		 	return true
		 },
		 notice (desc) {
		 	this.$Notice.warning({
		 			title: '错误',
		 			desc: desc
		 		})
		 },
		 clearMenuInfo () {
		 	this.menuInfo.menuId = ''
		 	this.menuInfo.menuName = ''
		 	this.menuInfo.menuCode = ''
		 	this.menuInfo.menuIcon = ''
		 	this.menuInfo.parentId = ''
			this.menuInfo.routePath = ''
			this.menuInfo.defaultMenu = 0
			this.menuInfo.hidden = 0
		 	this.menuInfo.order = 0
		 },
		 //修改指定节点下所有子节点route_path
		 allChangedNode(tree_data, parent_id, old_menu_code, new_menu_code) {
		 	var res = []
		 	tree_data.forEach(node => {
		 		if (node.parentId == parent_id) {
		 			res.push({
		 				menuId: node.menuId,
		 				menuName: node.menuName,
		 				menuCode: node.menuCode,
		 				menuIcon: node.menuIcon,
		 				routePath: node.routePath.replace(old_menu_code, new_menu_code),
		 				order: node.order
		 			})
		 			res = res.concat(this.allChangedNode(node.children, node.menuId, old_menu_code, new_menu_code))
		 		} else {
		 			res = res.concat(this.allChangedNode(node.children, parent_id, old_menu_code, new_menu_code))
		 		}
		 	})
		 	return res
		 },
		 traverseTreeAllDele(data, delete_code) {
		 	var res = []
		 	data.forEach(node => {
		 		if (node.routePath.indexOf(delete_code) > -1) {
		 			res.push(node.menuId)
		 		}
		 		res = res.concat(this.traverseTreeAllDele(node.children, delete_code))
		 	})

		 	return res
		 }
	},
	mounted () {
		this.getMenuList()
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
	padding-left: 10px;
	float: left;
	clear: none;
}
.header-left {
	width: 30%;
	text-align: left;
	float: left;
}
.header-operate {
	width: 70%;
	text-align: right;
	float: left;
	clear: none;
}
.my-input {
	margin: 10px 0;
}
.select-title {
	height: 30px;
	padding: 0 0 0 10px;
	background: #F8F8F9;
	border: 1px solid #DCDEE2;
	border-radius: 5px;
}
</style>