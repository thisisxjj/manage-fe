<template>
  <h1>欢迎来到登录页面</h1>
  <el-button @click="goHome">回首页</el-button>
</template>

<script>
export default {
  name: 'Login',
  mounted() {
    this.$request({
      method: 'get',
      url: '/login',
      data: {
        name: 'Jack'
      }
    }).then(res => console.log(res))
    // this.$request.post('/login', { name: 'MaY' }, { loading: true, mock: true })
    //   .then(res => console.log(res))
  },
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style>
</style>
