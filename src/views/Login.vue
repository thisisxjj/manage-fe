<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form
        label-position="right"
        label-width="40px"
        ref="userForm"
        :model="user"
        :rules="rules"
        hide-required-asterisk
      >
        <div class="title">火星</div>
        <el-form-item prop="username" label="账号">
          <el-input
            type="text"
            v-model="user.username"
            suffix-icon="el-icon-user"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            :type="passwordType"
            v-model="user.password"
            @keyup.enter="handleLogin"
          >
            <template #suffix>
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      passwordType: 'password',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('user/login', this.user).then(() => {
            this.$router.push('/')
          })
        }
      })
    },
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
    }
  }
}
</script>

<style lang="scss">
.login-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fcff;
  .modal {
    width: 500px;
    padding: 50px;
    background: white;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 2px #c7c9cb4d;
    .title {
      font-size: 50px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login {
      width: 100%;
    }
    .show-pwd {
      position: absolute;
      right: 4px;
      top: 2px;
      font-size: 16px;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
