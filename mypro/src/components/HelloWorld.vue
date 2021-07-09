<template>
  <div class="hello">

    <div class="login_box">
         <div>
           <input placeholder="请输入账号"  v-model="account">
         </div>
         <div>
           <input placeholder="请输入密码"  v-model="pwd">
         </div>
         <button @click="aa" class="loginBtn">登录</button>
    </div>
  </div>
</template>

<script>
import local from '../utils/storage'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      account: '',
      pwd: ''
    }
  },
  methods: {
    aa () {
      console.log('你的密码式' + this.account + '=========' + this.pwd)
      if (!this.account || !this.pwd) {
        alert('账号或者密码不能空')
        return
      }
      this.$post('jdserver2/api/v1/applet/passport/login-pc?account=' + encodeURI(this.account) + '&password=' + this.pwd, '111').then((res) => {
        alert(res['message'])
        if (res['result']) {
          local.set('user', res['result'])
          let user = local.get('user')
          console.dir(user)
          console.error(user)
          console.error(user['token'])
          this.$router.push({name: 'SendPost'})
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   input {
     height: 30px;
     margin-top: 15px;
   }
   .loginBtn {
     width: 100px;
     height: 45px;
     margin-top: 15px;
   }
</style>
