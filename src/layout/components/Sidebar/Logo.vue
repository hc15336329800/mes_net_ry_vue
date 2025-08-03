<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}"
       :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
    <transition name="sidebarLogoFade">
      <router-link class="sidebar-logo-link" to="/">
        <div class="logo-block">
          <el-avatar :class="{ 'avatar-small': collapse }" class="sidebar-logo" shape="circle">
            <img :src="logo" alt="logo" />
          </el-avatar>
          <h1 v-if="!collapse" class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">
            {{ title }}
          </h1>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
import logoImg from '@/assets/logo/logo.png'
import variables from '@/assets/styles/variables.scss'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    variables() {
      return variables;
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme;
    }
  },
  data() {
    return {
      title: '山东中煤电器有限公司',
      logo: logoImg
    }
  }
}
</script>

<style scoped lang="scss">
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

/* 🌟 侧边栏 logo 区域，垂直居中布局 */
.sidebar-logo-container {
  margin-bottom: 10px;
  position: relative;
  width: 100%;
  padding: 30px  10px  20px 10px  ;
  border-bottom: 1px solid  rgba(191, 203, 217, 0.5) ;    /* 🌟灰白色边框 */
  background-color: transparent !important;   /* 🌟完全透明背景 */
  /* background: #2b2f3a; */
  /* background:  #ffffff;      #ffffff;白   #2b2f3a 灰   */
  text-align: center;
  overflow: hidden;



  .sidebar-logo-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    .logo-block {
      display: flex;
      flex-direction: column;
      align-items: center;

      .sidebar-logo {
        padding: 5px;
        width: 50px;
        height: 50px;
        transition: all 0.3s ease;
        margin-bottom: 6px;
      }

      .avatar-small {
        width: 32px !important;
        height: 32px !important;
        margin-bottom: 2px;
      }

      .sidebar-title {
        padding-top: 1px;
        margin-bottom: 10px;
        color: #fff;
        font-weight: 600;
        font-size: 16px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        line-height: 1.2;
      }
    }
  }
}

::v-deep .el-avatar {
  background-color: transparent !important;
  padding: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
}
</style>
