<template>
    <div>
        <div :style="pageHeight" class="page">
            <div class="page_header">
                <div class="header-logo">
                    <Icon type="logo-octocat" :size="40" />
                </div>
                <div class="header-nav">
                    <Menu mode="horizontal" theme="dark" active-name="home">
                        <span v-for="item in menuTreeData" :key="item.menuId">
                            <MenuItem v-if="item.hidden != 1 && item.children.length == 0" :to="item.routePath" :name="item.menuCode">
                                <Icon :type="item.menuIcon"/>{{item.menuName}}
                            </MenuItem>
                            <Submenu v-else-if="item.hidden != 1" :name="item.menuCode">
                                <template slot="title">
                                    <Icon :type="item.menuIcon"/>{{item.menuName}}
                                </template>
                                <MenuItem v-for="menu in item.children"
                                :key="menu.menuId"
                                :name="menu.menuCode"
                                @click.native="jump(menu.menuCode, menu.children)">
                                    {{menu.menuName}}
                                </MenuItem>
                            </Submenu>
                        </span>
                    </Menu>
                </div>
                <div class="header-user">
                    <Dropdown @on-click="handleClick">
                        <img :src="avatarImg" class="myphoto"/>
                         <DropdownMenu slot="list">
                             <DropdownItem name="userInfo">{{nick_name}}</DropdownItem>
                             <DropdownItem name="changePw" divided>修改密码</DropdownItem>
                             <DropdownItem name="logout" divided>退出</DropdownItem>
                         </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <div class="page_content">
                <Breadcrumb class="layout-breadc">
                    <BreadcrumbItem v-for="(item, index) in breadList.breadList" :key="index">{{item}}</BreadcrumbItem>
                </Breadcrumb>
                <div style="min-height: 600px; clear:both">
                    <router-view @updateUserInfo="getBriefUserInfo"/>
                </div>
            </div>
            <Modal v-model="status_exit" title="注销登陆" @on-ok="exit">
                <span>确认退出登陆?</span>
            </Modal>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import axios from '@/libs/request'
import {setToken, setUserInfo, generateMenuTreeData} from '@/libs/utils'

export default {
  name: 'Main',
  data () {
    return {
      //msg: 'Welcome to Your Vue.js App'
      pageHeight: {
        height: ''
      },
      apiURL: {
        userInfoURL: '/user/userInformation.json',
        logoutURL: '/user/logout.json',
        menuURL: '/management/homeMenuList.json',
        avatarURL: '/file/downloadAvatar.json'
      },
      menuList: [],
      menuTreeData: [],
      avatarImg: '',
      nick_name: '',
      status_exit: false
    }
  },
  methods: {
    getBriefUserInfo () {
        axios.request({
            url: this.apiURL.userInfoURL,
            method: 'get'
        }).then(res => {
            if (res.data && res.data.code == 200) {
                let result = res.data.result
                this.nick_name = result.nickName
                setUserInfo(JSON.stringify(result))
            }
            this.getUserAvatar()
            this.getUserRoleMenu()
        })
    },
    handleClick (name) {
        switch(name) {
            case 'userInfo':
                this.userInfo()
                break
            case 'changePw':
                this.changePw()
                break
            case 'logout':
                this.status_exit = true
        }
    },
    userInfo () {
        this.$router.push({
            name: 'userInfo'
        })
    },
    changePw () {
        //
    },
    //获取用户角色下的菜单信息
    getUserRoleMenu () {
        axios.request({
            url: this.apiURL.menuURL,
            method: 'get'
        }).then(res => {
            if (res.data && res.data.code == 200) {
                //console.log('menuList---->', res.data.result)
                let tree = generateMenuTreeData(res.data.result, null)
                if (tree && tree.length > 0) {
                    this.menuTreeData = tree[0].children
                }
            }
        })
    },
    //获取用户头像
    getUserAvatar () {
        axios.request({
            url: this.apiURL.avatarURL,
            method: 'get',
            responseType: 'blob'
        }).then(res => {
            let blob = new Blob([res.data], {type: res.headers['content-type']})
            this.avatarImg = URL.createObjectURL(blob)
        })
    },
    jump (menuCode, children) {
        if (children.length > 0) {
            //console.log('---->', children)
            this.$router.push({
                name: menuCode,
                params: {menuList: children}
            })
        } else {
            this.$router.push({
                name: menuCode
            })
        }
    },
    exit() {
        axios.request({
            url: this.apiURL.logoutURL,
            method: 'get'
        }).then(res => {
            if (res.data && res.data.code == 200) {
                setToken('')
                this.$router.push({
                    name: 'login'
                })
            }
        })
    }
  },
  computed: {
      breadList () {
        return this.$store.state.breadList
      }
  },
  beforeMount () {
    //$('html').css('height', '100%')
    //$('body').css({'height': '100%'})
  },
  mounted () {
      //this.pageHeight.height = $('body').css('height')
      this.getBriefUserInfo()
  }
}
</script>

<style scoped>
.page {
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
}
.page_header {
    min-height: 60px !important;
    background: #515A6E;
    padding: 0 10px;
}
.page_content {
    /*height: 85%;*/
    padding: 0 20px;
    overflow: scroll;
}
.header-logo{
    width: 10%;
    height: 40px;
    background: #fff;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 10px;
}
.header-nav{
    width: 80%;
    float: left;
    margin: 0 auto;
}
.header-user {
    width: 10%;
    height: 40px;
    float: right;
    position: relative;
    top: 10px;
}
.layout-breadc {
    margin: 10px 0;
    float: left;
}
.myphoto {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    overflow: hidden;
    object-fit: cover;
    flex: 1;
}
</style>