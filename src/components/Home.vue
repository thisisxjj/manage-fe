<template>
  <div class="basic-page">
    <div class="nav-side"></div>
    <div class="content-right">
      <div class="nav-top">
        <div class="bread">面包屑</div>
        <div class="user-info">用户名</div>
      </div>
      <div class="main-wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="scss">
@import url("../assets/style/reset.css");
@import url("../assets/style/index.scss");
.basic-page {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background: rgb(25, 42, 94);
  }
  .content-right {
    margin-left: 200px;
    .nav-top {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
    }
    .main-wrapper {
      background-color: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background-color: #fff;
        height: 100%;
      }
    }
  }
}
</style>
