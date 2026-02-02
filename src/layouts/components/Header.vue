<template>
  <div :class="layoutCls">
    <t-head-menu :class="menuCls" :theme="theme" expandType="popup" :value="active">
      <template #logo>
        <span v-if="showLogo" class="header-logo-container" @click="handleNav('/dashboard/base')">
<!--          <logo-full class="t-logo" />-->
        </span>
        <div v-else class="header-operate-left">
          <t-button theme="default" shape="square" variant="text" @click="changeCollapsed">
            <view-list-icon class="collapsed-icon" />
          </t-button>
          <search :layout="layout" />
        </div>
      </template>
      <menu-content v-show="layout !== 'side'" class="header-menu" :navData="menu" />
      <template #operations>
        <div class="operations-container">
          <!-- 搜索框 -->
          <search v-if="layout !== 'side'" :layout="layout" />
          <!-- 全局通知 -->
          <t-tooltip placement="bottom" content="系统通知">
            <notice />
          </t-tooltip>
        </div>
        <div class="operations-container" v-show="appName() === 'wallpaper'">
          <t-menu-item>
            <t-submenu>
              <template #title style="font-size: 24px;color: #3399ff">
                <span style="color: red">Hot!</span>AI在线工具
              </template>
              <t-menu-item>
                <t-button theme="default" variant="text" tag="a" href="/stableDiffusion/use">
                  <span style="color: red">Hot!</span>&nbsp;文生图
                </t-button>
              </t-menu-item>
              <t-menu-item>
                <t-button theme="default" variant="text" tag="a" href="/">
                  <span style="color: red">Hot!</span>&nbsp;图生图(开发中)
                </t-button>
              </t-menu-item>
              <t-menu-item>
                <t-button theme="default" variant="text" tag="a" href="/">
                  <span style="color: red">Hot!</span>&nbsp;图生视频(开发中)
                </t-button>
              </t-menu-item>
            </t-submenu>
          </t-menu-item>
          <t-menu-item>
            <t-submenu>
              <template #title>
                资源下载
              </template>
              <t-menu-item href="https://pan.quark.cn/s/2c832199b09b" target="_blank">
                Stable Diffusion整合包
              </t-menu-item>
              <t-menu-item href="https://pan.quark.cn/s/b4081a86e842" target="_blank">
                离线模型包下载
              </t-menu-item>
              <t-menu-item href="http://hongkong.gpg123.vip:5000" target="_blank">
                HuggingFace加速
              </t-menu-item>
            </t-submenu>
          </t-menu-item>
          <t-menu-item>
            <t-submenu>
              <template #title>
                关于
              </template>
              <t-menu-item>
                <t-button theme="default" variant="text" tag="a" href="/share">
                  GPU合租与赞助
                </t-button>
              </t-menu-item>
              <t-menu-item>
                <t-button theme="default" variant="text" tag="a"
                          href="https://umami.gpg123.vip/share/vV0lArsoXUhPpAZK/wallpaper.gpg123.vip">
                  站点统计
                </t-button>
              </t-menu-item>
            </t-submenu>
          </t-menu-item>
        </div>
        <div class="operations-container" v-show="appName() !== 'wallpaper'">
          <t-tooltip placement="bottom" content="代码仓库">
            <t-button theme="default" shape="square" variant="text" @click="navToGitHub">
              <logo-github-icon />
            </t-button>
          </t-tooltip>
          <t-tooltip placement="bottom" content="帮助文档">
            <t-button theme="default" shape="square" variant="text" @click="navToHelper">
              <help-circle-icon />
            </t-button>
          </t-tooltip>
        </div>
        <div class="operations-container">
          <t-dropdown :min-column-width="125" trigger="click">
            <HeaderUser/>
          </t-dropdown>
          <t-tooltip placement="bottom" content="系统设置">
            <t-button theme="default" shape="square" variant="text" @click="toggleSettingPanel">
              <setting-icon />
            </t-button>
          </t-tooltip>
        </div>
      </template>
    </t-head-menu>
  </div>
</template>

<script>
import Vue from 'vue';
import {
  ViewListIcon,
  LogoGithubIcon,
  HelpCircleIcon,
  UserCircleIcon,
  PoweroffIcon,
  SettingIcon,
  ChevronDownIcon,
} from 'tdesign-icons-vue';
import {appCnName, appName, prefix} from '@/config/global';
import LogoFull from '@/assets/assets-logo-full.svg';

import Notice from './Notice.vue';
import Search from './Search.vue';
import MenuContent from './MenuContent.vue';
import HeaderUser from "@/layouts/components/HeaderUser.vue";

export default Vue.extend({
  name: 'CommonHeader',
  components: {
    HeaderUser,
    MenuContent,
    LogoFull,
    Notice,
    Search,
    ViewListIcon,
    LogoGithubIcon,
    HelpCircleIcon,
    UserCircleIcon,
    PoweroffIcon,
    SettingIcon,
    ChevronDownIcon,
    appCnName: appCnName,
  },
  props: {
    theme: String,
    layout: {
      type: String,
      default: 'top',
    },
    showLogo: {
      type: Boolean,
      default: true,
    },
    menu: {
      type: Array,
    },
    isFixed: {
      type: Boolean,
      default: false,
    },
    isCompact: {
      type: Boolean,
      default: false,
    },
    maxLevel: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      prefix,
      visibleNotice: false,
      isSearchFocus: false,
    };
  },
  computed: {
    active() {
      if (!this.$route.path) {
        return '';
      }
      return this.$route.path
        .split('/')
        .filter((item, index) => index <= this.maxLevel && index > 0)
        .map((item) => `/${item}`)
        .join('');
    },
    showMenu() {
      return !(this.layout === 'mix' && this.showLogo === 'side');
    },
    layoutCls() {
      return [`${this.prefix}-header-layout`];
    },
    menuCls() {
      return [
        {
          [`${this.prefix}-header-menu`]: !this.isFixed,
          [`${this.prefix}-header-menu-fixed`]: this.isFixed,
          [`${this.prefix}-header-menu-fixed-side`]: this.layout === 'side' && this.isFixed,
          [`${this.prefix}-header-menu-fixed-side-compact`]: this.layout === 'side' && this.isFixed && this.isCompact,
        },
      ];
    },
  },
  mounted() {
  },
  methods: {
    appName() {
      return appName
    },
    appCnName() {
      return appCnName
    },
    toggleSettingPanel() {
      this.$store.commit('setting/toggleSettingPanel', true);
    },
    changeCollapsed() {
      this.$store.commit('setting/toggleSidebarCompact');
    },
    handleNav(url) {
      this.$router.push(url);
    },
    navToGitHub() {
      window.open('https://github.com/2694484453');
    },
    // 帮助文档
    navToHelper() {
      window.open('https://docs.gpg123.vip');
    },
  },
});
</script>
<style lang="less">
@import '@/style/variables.less';

.header-menu {
  flex: 1 1 1;
  display: inline-flex;
}

.operations-container {
  display: flex;
  align-items: center;
  margin-right: 12px;

  .t-popup__reference {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .t-button {
    margin: 0 8px;

    &.header-user-btn {
      margin: 0;
    }
  }

  .t-icon {
    font-size: 20px;

    &.general {
      margin-right: 16px;
    }
  }
}

.header-operate-left {
  display: flex;
  margin-left: 20px;
  align-items: normal;
  line-height: 0;

  .collapsed-icon {
    font-size: 20px;
  }
}

.header-logo-container {
  width: 184px;
  height: 26px;
  display: flex;
  margin-left: 24px;
  color: var(--td-text-color-primary);

  .t-logo {
    width: 100%;
    height: 100%;

    &:hover {
      cursor: pointer;
    }
  }

  &:hover {
    cursor: pointer;
  }
}

.header-user-account {
  display: inline-flex;
  align-items: center;
  color: var(--td-text-color-primary);

  .t-icon {
    margin-left: 4px;
    font-size: 16px;
  }
}

.t-head-menu__inner {
  border-bottom: 1px solid var(--td-border-level-1-color);
}

.t-menu--light {
  .header-user-account {
    color: var(--td-text-color-primary);
  }
}

.t-menu--dark {
  .t-head-menu__inner {
    border-bottom: 1px solid var(--td-gray-color-10);
  }

  .header-user-account {
    color: rgba(255, 255, 255, 0.55);
  }

  .t-button {
    --ripple-color: var(--td-gray-color-10) !important;

    &:hover {
      background: var(--td-gray-color-12) !important;
    }
  }
}

.operations-dropdown-container-item {
  width: 100%;
  display: flex;
  align-items: center;

  .t-icon {
    margin-right: 8px;
  }

  .t-dropdown__item {
    .t-dropdown__item__content {
      display: flex;
      justify-content: center;
    }

    .t-dropdown__item__content__text {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
  }

  .t-dropdown__item {
    width: 100%;
    margin-bottom: 0px;
  }

  &:last-child {
    .t-dropdown__item {
      margin-bottom: 8px;
    }
  }
}
</style>
