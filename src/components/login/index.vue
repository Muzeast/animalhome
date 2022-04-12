<template>
  <div>
    <div :style="styles.mainarea" class="main-area" align="center">
      <div class="form-area">
        <p class="ptitle">欢迎登陆</p>
        <Divider/>
        <Row class="trow">
          <Col span="24">
            <Input v-model="loginInfo.user" class="input-area" size="large" prefix="md-person" placeholder="用户名"/>
          </Col>
        </Row>
        <Row class="trow">
          <Col>
            <Input v-model="loginInfo.password" class="input-area" size="large" prefix="md-lock" type="password" placeholder="密码"/>
          </Col>
        </Row>
        <Button id="my-button" size="large" type="primary" @click="login">登录</Button><br/>
        <router-link class="mylink" to="register">注册</router-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link class="mylink" to="/bar">忘记密码</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import axios from '@/libs/request'
import {setToken} from '@/libs/utils'
import md5 from 'js-md5'

export default {
  name: 'Login',
  data () {
    return {
      styles: {
        mainarea: {
          height: ''
        }
      },
      loginInfo: {
        user: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      if (!this.loginInfo.user || !this.loginInfo.password) {
        this.$Notice.warning({
          title: '提示',
          desc: '账号或密码不能为空!'
        })
        return
      }
      axios.request({
        url: '/user/login.json',
        method: 'post',
        data: {
          count: this.loginInfo.user,
          password: md5(this.loginInfo.password)
        }
      }).then(res => {
      	if(res.data) {
          if(res.data.code == 200) {
            let result = res.data.result
            var info = {
                nick_name: result.nick_name,
                photo: result.photo == null ? 'default.jpg' : result.photo
            }
            setToken(result.token)
            this.$router.push({
              name: 'home'
            })
          } else {
              this.$Notice.warning({
                title: '错误',
                desc: res.data.result.msg
              })
            }
          }
        })
    }
  },
  beforeMount () {
    $('html').css('height', '100%')
    $('body').css({'height': '100%'})
  },
  mounted () {
    this.styles.mainarea.height = $('body').css('height')
  }
}
</script>

<style scoped>
.ptitle {
  font-size: 16px;
  font-weight: 600;
  padding-top: 20px;
}
.main-area {
  width: 40%;
  position: relative;
  left: 30%;
}
.form-area {
  width: 100%;
  height: 60%;
  position: relative;
  top: 20%;
  background: #E9EBEC;
  opacity: 1;
}
.trow {
  width: 70%;
    margin: 20px 0 20px 0;
    text-align: left;
}
#my-button {
  width: 70%;
  margin: 10px 0 30px 0;
}
.mylink {
  text-decoration: underline;
}
</style>