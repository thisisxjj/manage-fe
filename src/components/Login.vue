<template>
  <h1>欢迎来到登录页面</h1>
  <el-button @click="goHome">回首页</el-button>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style>
</style>
