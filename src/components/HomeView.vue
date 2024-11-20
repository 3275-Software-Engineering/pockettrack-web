<template>
  <div>
    <el-container >
      <!--aside-->
      <el-aside :width="asideWidth" style="min-height: 100vh; background-color: #001529;position: fixed; top: 0; left: 0;">
        <div style="height:60px; color: white; display:flex; align-items: center; justify-content:center">
          <img src="@/assets/logo1.png" alt="" style="width:40px; height:40px">
          <span class="logo-title" v-if="!isCollapse">PocketTrack</span>
        </div>

        <el-menu
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            background-color="#001529"
            text-color="rgba(255,255,255,0.65)"
            active-text-color="#fff"
            style="border:none"
            :default-active="$route.path"
        >
          <el-menu-item index="/home/dashboard" >
            <template #default>
              <i class="el-icon-house"></i>
              <span>Dashboard</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/home/transaction" >
            <template #default>
              <i class="el-icon-money"></i>
              <span>Transactions</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/home/savingGoals" >
            <template #default>
              <i class="el-icon-s-marketing"></i>
              <span>Saving Goals</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/home/budget" >
            <template #default >
              <i class="el-icon-bank-card"></i>
              <span>Budgets</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container :style="{marginLeft: isCollapse ? '64px' : '200px', paddingTop: '0', position: 'fixed', top: '0px',
                      width: isCollapse ? 'calc(100% - 64px)' : 'calc(100% - 200px)'}">
        <!--header-->
        <el-header>
          <i :class="collapseIcon" style="font-size: 26px" @click="handleCollapse"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 20px">
            <el-breadcrumb-item :to="{ path: 'dashboard' }">Dashboard</el-breadcrumb-item>
          </el-breadcrumb>
          <div style="flex:1; width:0;display: flex; align-items: center; justify-content: flex-end">
            <i class="el-icon-quanping" style="font-size: 26px" @click="handleFull"></i>
            <el-dropdown placement="bottom">
              <template #default>
                <div style="display: flex; align-items: center; outline: none; cursor:default">
                  <img src="@/assets/logo1.png" alt=""
                       style="width: 40px; height: 40px; margin: 0 5px; pointer-events: none">
                  <el-button class="logout-button" @click="logout">Logout</el-button>
                </div>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <!--body-->
        <el-main>
          <div >
            <router-view></router-view> <!-- 使用 router-view 动态渲染组件 -->
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'HomeView',
  data() {
    return {
      isCollapse: false,
      asideWidth: '200px',
      collapseIcon: 'el-icon-s-fold',
      currentComponent: 'DashboardCharts', // 初始加载 DashboardCharts 组件
    };
  },
  methods: {
    handleFull() {
      document.documentElement.requestFullscreen();
    },
    setCurrentComponent(componentName) {
      this.currentComponent = componentName;
    },
    logout() {
      event.preventDefault();
      localStorage.removeItem('userId');
      this.$router.push('/');
    },
    handleCollapse() {
      this.isCollapse = !this.isCollapse;
      this.asideWidth = this.isCollapse ? '64px' : '200px';
      this.collapseIcon = this.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold';
    },
  },
};
</script>


<style scoped>

.el-menu--inline {
  background-color: #000c17 !important;
}

.el-menu--inline .el-menu-item {
  background-color: #000c17 !important;
  padding-left: 49px !important;
  color: #d3d3d3 !important; /* 设置暗白色字体 */
}

.el-menu-item:hover, .el-submenu__title:hover {
  background-color: #1890ff !important; /* 背景变为蓝色 */
  color: #ffffff !important; /* 悬停时字体变为亮白色 */
}

.el-submenu__title:hover i {
  color: #ffffff !important;
}

.el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
  color: #d3d3d3 !important; /* 默认暗白色 */
}

.el-submenu__title {
  height: 40px !important;
  line-height: 40px !important;
}

.el-submenu .el-menu-item {
  min-width: 0 !important;
}

.el-menu--inline .el-menu-item.is-active {
  padding-left: 49px !important;
}

.el-aside {
  transition: width .3s;
  box-shadow: 2px 0 6px rgba(0, 21, 41, .35) !important;
}

.logo-title {
  margin-left: 5px;
  font-size: 20px;
  transition: all .3s;
}

.el-header {
  box-shadow: 2px 0 6px rgba(0, 21, 41, .35) !important;
  display: flex;
  align-items: center;
}

/* 修复全局样式不生效的情况 */
::v-deep .el-menu--inline {
  background-color: #000c17 !important;
}

::v-deep .el-menu-item {
  background-color: #000c17 !important;
  color: #d3d3d3 !important; /* 默认暗白色 */
  height: 40px !important;
  line-height: 40px !important;
}

.el-menu--inline .el-menu-item {
  background-color: transparent !important; /* 默认透明背景 */
  padding-left: 24px !important;
  color: #d3d3d3 !important; /* 默认暗白色字体 */
  border-radius: 12px !important; /* 圆角 */
  transition: background-color 0.3s, color 0.3s; /* 添加过渡效果 */
}

::v-deep .el-menu-item:hover {
  background-color: #1890ff !important;
  color: #ffffff !important; /* 悬停时字体变为亮白色 */
}

::v-deep .el-submenu__title:hover {
  color: #ffffff !important;
}


::v-deep .el-menu-item.is-active i,
::v-deep .el-menu-item.is-active .el-tooltip {
  margin-left: -4px;
}

::v-deep .el-submenu__title {
  height: 40px !important;
  line-height: 40px !important;
}

::v-deep .el-submenu .el-menu-item {
  min-width: 0 !important;
}

::v-deep .el-menu--inline .el-menu-item.is-active {
  padding-left: 24px !important;
}


.logout-button {
  border: none !important; /* 去除边框 */
  font-size: 16px !important; /* 增大字体 */
  font-weight: bold !important; /* 字体加粗 */
  height: 30px; /* 高度设置为 40px（可根据需要调整） */
  line-height: 40px; /* 让文本垂直居中 */
  display: flex; /* 使用 flexbox 实现水平垂直居中 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  border-radius: 5px; /* 设置圆角 */
  transition: background-color 0.3s; /* 添加过渡效果 */
}

.el-main {
  overflow-y: auto;  /* 启用垂直滚动条 */
  height: calc(100vh - 60px);
}

</style>


