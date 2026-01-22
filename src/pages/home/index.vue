<template>
  <div class="cloud-home">
    <!-- 顶部导航 -->
    <div class="box">
      <t-head-menu defaultValue="home" expandType="popup">
        <template #logo>
          <div class="logo">Cloud<span>Plus</span></div>
        </template>
        <t-menu-item value="home">首页</t-menu-item>
        <t-submenu value="project">
          <template #title>
            <span>产品</span>
          </template>
          <t-menu-item value="1-2">Prometheus监控&告警</t-menu-item>
          <t-menu-item value="1-3">Kubernetes&Helm应用托管</t-menu-item>
          <t-menu-item value="1-4">Devops流水线服务</t-menu-item>
          <t-menu-item value="nas">Nas应用托管</t-menu-item>
          <t-menu-item value="scheduling">Scheduling调度中心</t-menu-item>
          <t-menu-item value="ssl">免费域名证书</t-menu-item>
        </t-submenu>
        <t-menu-item value="solution">解决方案</t-menu-item>
        <t-submenu value="2" title="资源">
          <t-menu-item value="2-1">子菜单2-1</t-menu-item>
          <t-menu-item value="2-2">子菜单2-2</t-menu-item>
          <t-menu-item value="2-3">子菜单2-3</t-menu-item>
        </t-submenu>
        <t-menu-item value="about">关于</t-menu-item>
        <template #operations>
          <t-button variant="text" shape="square">
            <search-icon slot="icon" shape="square"/>
          </t-button>
          <t-button variant="text" shape="square">
            <mail-icon slot="icon"/>
          </t-button>
          <t-button v-show="username === null || username === ''" theme="primary" href="/login">
            <user-icon slot="icon"/>
            登录
          </t-button>
          <t-tooltip v-show="username !== null && username !== ''" placement="bottom" content="用户信息">
            <HeaderUser/>
          </t-tooltip>
          <t-button variant="text" shape="square">
            <ellipsis-icon slot="icon"/>
          </t-button>
        </template>
      </t-head-menu>
    </div>
    <!-- 轮播区域 -->
    <div>
      <t-swiper
        :autoplay="true"
        :duration="6000"
        :interval="4000"
        :navigation="{ type: 'dots',size: 'large' }"
        style="height: 420px; border-radius: 8px; overflow: hidden;margin-top: 20px"
      >
        <t-swiper-item v-for="(item, index) in banners" :key="index">
          <t-row :gutter="16">
            <t-col :span="2"></t-col>
            <t-col :span="4">
              <div class="banner-content" style="height:420px;width: 800px">
                <h2 style="margin-top: 20px">{{ item.title }}</h2>
                <p>{{ item.desc }}</p>
                <t-button theme="primary" size="large" style="margin-top: 20px;" :href="item.url">
                  立即体验
                </t-button>
              </div>
            </t-col>
            <t-col :span="4">
              <t-image :src="item.image" :shape="'square'" style="height:320px;width: 720px"></t-image>
            </t-col>
            <t-col :span="2"></t-col>
          </t-row>
        </t-swiper-item>
      </t-swiper>
    </div>
    <main class="main">
      <!--内容-->
      <t-row>
        <t-col :span="4" v-for="(item,index) in banners.slice(0,3)">
          <div>
            <t-card theme="poster2"
                    :bordered="true"
                    :hover-shadow="true"
                    :title="item.title"
                    :style="{ width: '420px' }">
              <t-image :src="item.icon" style="width: 52px;height: 52px;float: left"/>
              <p>
                {{ item.desc }}
              </p>
              <template #actions>
                <t-dropdown :options="options" :min-column-width="112" @click="clickHandler">
                  <t-button variant="text" shape="square">
                    <more-icon/>
                  </t-button>
                </t-dropdown>
              </template>
            </t-card>
          </div>
        </t-col>
      </t-row>
      <t-row>
        <t-col :span="4" v-for="(item,index) in banners.slice(3,6)">
          <div>
            <t-card theme="poster2"
                    :title="item.title"
                    :style="{ width: '420px' }">
              <t-image :src="item.icon" style="width: 52px;height: 52px"/>
              {{ item.desc }}
              <template #actions>
                <t-dropdown :options="options" :min-column-width="112" @click="clickHandler">
                  <t-button variant="text" shape="square">
                    <more-icon/>
                  </t-button>
                </t-dropdown>
              </template>
            </t-card>
          </div>
        </t-col>
      </t-row>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>CloudPlus</h4>
            <p>领先的云服务平台，提供安全、稳定、高效的云计算服务。</p>
          </div>
          <div class="footer-section">
            <h4>产品</h4>
            <ul>
              <li><a href="#">Prometheus监控&告警</a></li>
              <li><a href="#">Kubernetes&Helm应用托管</a></li>
              <li><a href="#">Devops流水线服务</a></li>
              <li><a href="#">Nas应用托管</a></li>
              <li><a href="#">Scheduling调度中心</a></li>
              <li><a href="#">免费域名证书</a></li>
              <!--              <li><a href="#">Nas应用托管</a></li>-->
            </ul>
          </div>
          <div class="footer-section">
            <h4>资源</h4>
            <ul>
              <li><a href="#">文档中心</a></li>
              <li><a href="#">API 参考</a></li>
              <li><a href="#">博客</a></li>
              <li><a href="#">社区</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>其他</h4>
            <ul>
              <li><a href="https://wallpaper.gpg123.vip">壁纸中心</a></li>
              <li><a href="https://hubproxy.gpg123.vip">镜像加速</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>联系我们</h4>
            <p>邮箱：2694484453@qq.com</p>
            <p>电话：400-123-4567</p>
          </div>
        </div>
        <div class="footer-bottom">
          <common-footer/>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Vue from "vue";
import {} from "tdesign-icons-vue";
import HeaderUser from "@/layouts/components/HeaderUser.vue";
import CommonFooter from "@/layouts/components/CommonFooter.vue";
import {getUserName} from "@/config/storage";
import prometheusLogo from "@/assets/banners/prometheus.png";
import kubernetesLogo from "@/assets/banners/kubernetes.png";
import devopsLogo from "@/assets/banners/devops.png";
import nasLogo from "@/assets/banners/nas.png";
import domainLogo from "@/assets/banners/domain.png";
import schedulingLogo from "@/assets/banners/scheduling.png";

export default Vue.extend({
  name: 'CloudHomePage',
  components: {
    CommonFooter,
    HeaderUser,
    prometheusLogo
  },
  mounted() {
    this.userName = getUserName() ?? '访客';
  },
  data() {
    return {
      banners: [
        {
          title: 'Prometheus监控&告警+Grafana可视化平台',
          desc: '分布式监控&告警平台，可通过web页面快速配置，满足企业级业务需求',
          image: 'https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/cloud-plus/1.png',
          url: 'https://gpg123.vip/prometheus/targets',
          icon: prometheusLogo,
        },
        {
          title: 'Kubernetes&Helm应用托管',
          desc: '托管您的边缘云集群，可页面化运维，通过公共市场/私有仓库快速部署helm-chart应用',
          image: 'https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/cloud-plus/2.png',
          url: 'https://gpg123.vip/app/market',
          icon: kubernetesLogo,
        },
        {
          title: '一站式 DevOps',
          desc: '从代码到上线，到制品/镜像构建，实现全流程自动化',
          image: 'https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/cloud-plus/3.png',
          url: 'https://gpg123.vip/devops/job',
          icon: devopsLogo,
        },
        {
          title: 'Nas应用托管',
          desc: '支持Nas常用工具，如：FRP内网穿透服务端等',
          image: 'https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/cloud-plus/4.png',
          url: 'https://gpg123.vip/nas/frpc',
          icon: nasLogo
        },
        {
          title: 'Scheduling调度中心',
          desc: '支持定时任务设置，',
          image: 'https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/cloud-plus/5.png',
          url: 'https://gpg123.vip/scheduling/list',
          icon: schedulingLogo,
        },
        {
          title: '免费域名证书',
          desc: '集成SSL证书模块，一站式管理证书发放、签约、续签等',
          image: 'https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/cloud-plus/6.png',
          url: 'https://gpg123.vip/domain/base',
          icon:  domainLogo,
        }
      ],
      username: ''
    };
  }
});
</script>

<style scoped>
.cloud-home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: 1200px;
  max-width: 95%;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #0052d9;
}

.logo span {
  color: #00a870;
}

/* Main Banner */
.main {
  flex: 1;
  height: 520px;
  padding: 40px 40px;
  text-align: center;
  align-self: center;
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
  padding: 0 20px;
}

.banner-content h2 {
  font-size: 36px;
  margin-bottom: 16px;
  font-weight: 700;
}

.banner-content p {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 0;
}

/* Footer */
.footer {
  background-color: #f5f5f5;
  padding: 60px 0 30px;
  color: #333;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h4 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #000;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section ul li a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-section ul li a:hover {
  color: #0052d9;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  color: #666;
  font-size: 14px;
}

/* 响应式 */
@media (max-width: 768px) {
  .header .container {
    flex-wrap: wrap;
    height: auto;
    padding: 16px 0;
  }

  .banner-content h2 {
    font-size: 28px;
  }

  .banner-content p {
    font-size: 16px;
  }
}

</style>
