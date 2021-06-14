<template>
  <div class="basic-page">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统LOGO -->
      <div class="logo">
        <img src="./../assets/logo.png" />
        <span :style="isCollapse ? 'display:none' : ''">Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        background-color="rgb(25, 42, 94)"
        text-color="#fff"
        router
        :collapse="isCollapse"
        class="nav-menu"
      >
        <tree-menu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <i class="el-icon-s-fold"></i>
          </div>
          <div class="bread">
            <BreadCrumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge
            :is-dot="noticeCount > 0 ? true : false"
            class="notice"
            type="danger"
          >
            <i class="el-icon-bell"></i>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.username }}
              <i class="el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">
                  邮箱：{{ userInfo.email }}
                </el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="main-wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from "./TreeMenu/index.vue"
import BreadCrumb from "./BreadCrumb/index.vue"
export default {
  name: 'Home',
  components: {
    TreeMenu,
    BreadCrumb
  },
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.user.userInfo,
      noticeCount: 0,
      userMenu: null,
      activeMenu: location.hash.slice(1),
    }
  },
  mounted() {
    this.getMenuList()
    this.getNoticeCount()
  },
  watch: {
    $route(to) {
      this.activeMenu = to.fullPath
    }
  },
  methods: {
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    async getMenuList() {
      try {
        const userMenu = await this.$api.getMenuList()
        this.userMenu = userMenu
      } catch (error) {
        console.error(error)
      }
    },
    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount()
        this.noticeCount = count
      } catch (error) {
        console.error(error)
      }
    },
    async handleLogout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss">
@import "../assets/style/reset.css";
@import "../assets/style/index.scss";
.basic-page {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background: rgb(25, 42, 94);
    color: #fff;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    // 合并
    &.fold {
      width: 64px;
    }
    // 展开
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    // 合并
    &.fold {
      margin-left: 64px;
    }
    // 展开
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .main-wrapper {
      background-color: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
    }
  }
}
</style>
