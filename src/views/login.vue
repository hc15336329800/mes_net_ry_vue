<template>
  <div class="login">
    <!-- 切换系统管理员登录的图标按钮 -->
    <div class="admin-login-icon" @click="goToAdminLogin">
      <el-icon class="el-icon-s-custom"></el-icon>
    </div>
    <div class="loginFormDiv">
      <!-- 登录表单 -->
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <!--				<h3 class="title">莱西循环经济产业园</h3>-->
        <h3 class="title">
          <!--          <img src="@/assets/logo/中煤log2.png" class="title-icon" />-->
          <span style="padding-left: 10px ; height: 55px;"  >山东中煤电器有限公司</span>
        </h3>


        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                    @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>


        <el-form-item prop="code" v-if="captchaEnabled">
          <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
                    @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img" />
          </div>
        </el-form-item>


        <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>



        <el-form-item style="width:100%;">
          <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
                     @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <div style="float: right;" v-if="register">
            <router-link class="link-type" :to="'/register'">立即注册</router-link>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2025 JNZKTX All Rights Reserved.</span>
    </div>
  </div>
</template>
<script>


import {
  getCodeImg
} from "@/api/login";
import Cookies from "js-cookie";
import {
  encrypt,
  decrypt
} from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {

      userID: 0,
      //
      codeUrl: "",
      loginForm: {
        username: "张三",
        password: "admin123456",
        rememberMe: false,
        code: "",
        uuid: "",
        tenantId: 1,
      },
      loginRules: {
        username: [{
          required: true,
          trigger: "blur",
          message: "请输入您的账号"
        }],
        password: [{
          required: true,
          trigger: "blur",
          message: "请输入您的密码"
        }],
        code: [{
          required: true,
          trigger: "change",
          message: "请输入验证码"
        }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {

  },
  created() {
    this.getCode();
    this.getCookie();

    // 临时设置
    this.loginForm.tenantId = 0;
  },
  methods: {

    // 跳转到系统管理员的登录页面
    goToAdminLogin() {
      this.$router.push('/');
    },






    //、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {

      // console.log("登录this.loginForm:"+this.loginForm.tenantId)
      // return

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // 如果用户选择了 "记住密码"，则将登录信息保存到Cookies中
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, {
              expires: 30
            });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30
            });
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30
            });
          } else {
            // 否则移除保存的Cookies信息
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }

          // 调用Vuex中的Login action进行登录
          this.$store.dispatch("Login", this.loginForm).then(() => {

            console.log("登录成功后执行跳转逻辑")

            // 登录成功后执行跳转逻辑
            this.$router.push({
              path: this.redirect ||
                "/" //如果 this.redirect 为 undefined，则默认会跳转到 / 路径，也就是首页。
            }).catch(() => {});
          }).catch(() => {
            // 登录失败，重新获取验证码
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    }
  }
};
</script>


<style rel="stylesheet/scss" lang="scss">

////////////////////////////////美化logo////////////////////////////////////////////

.title {
  display: flex; /* 让图片和文字水平对齐 */
  align-items: center; /* 居中对齐 */
  font-size: 22px;
  font-weight: bold;
  justify-content: center;
}

////////////////////////////////////////////////////////////////////////////
.admin-login-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  font-size: 32px;
  /* 控制图标大小 */
  color: #ffffff;
}

////////////////////////////////////////////////////////////////////////////

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;

  font-weight: bolder;
  font-size: 28px;
  color: #fff;
  background: linear-gradient(to bottom, #ffffff, #649eb2);
  background-clip: border-box;
  background-clip: border-box;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

}

.login-form {

  width: 70%;
  height: 100%;
  margin: auto;
  position: relative;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}


.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {

  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}

.loginFormDiv {
  background-image: url('~@/img/bg/登录框背景.png');
  /* 替换路径 */
  background-size: 100% 100%;
  /* 拉伸图片铺满整个容器 */
  background-repeat: no-repeat;
  /* 防止图片重复 */
  background-position: center;
  /* 居中显示图片 */


  /* 居中显示 */
  margin-left: 30%;
  // width: 600px;
  height: 500px;
  position: relative;
  bottom: -58px;
  padding-top: 3%;

  min-width: 600px;
}
</style>
