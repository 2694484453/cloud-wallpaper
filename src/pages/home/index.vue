<template>
  <div class="cloud-home">
    <!-- 顶部导航 -->
    <div class="box">
      <t-head-menu defaultValue="home" expandType="popup">
        <template #logo>
          <div class="logo">Cloud<span style="color: #6ec3c3">Server</span><span>Plus</span></div>
        </template>
        <t-menu-item value="home">首页</t-menu-item>
        <t-submenu value="project">
          <template #title>
            <span>产品</span>
          </template>
          <span v-for="(item,index) in banners">
                <t-menu-item :value="index" :href="item.url" target="_blank">{{ item.title }}</t-menu-item>
          </span>
        </t-submenu>
        <t-menu-item value="solution">
          <t-submenu value="solution-sub">
            <template #title>
              <span>解决方案</span>
            </template>
            <span v-for="(item,index) in solutions">
                <t-menu-item :value="index" :href="item.url" target="_blank">{{ item.title }}</t-menu-item>
            </span>
            <!--          <t-anchor container="#anchor-container"  @click="handleClick">-->
            <!--            <t-anchor-item :href="'#product'+index" :title="item.title" style="width: 200px"></t-anchor-item>-->
            <!--          </t-anchor>-->
          </t-submenu>
        </t-menu-item>
        <t-menu-item value="resources">
          <t-submenu value="resources-sub">
            <template #title>
              <span>资源</span>
            </template>
            <span v-for="(item,index) in resources">
               <t-menu-item :value="index">{{ item.title }}</t-menu-item>
            </span>
          </t-submenu>
        </t-menu-item>
        <t-menu-item value="about">关于</t-menu-item>
        <template #operations>
          <div class="operations-container">
            <t-button variant="text" shape="square">
              <search-icon slot="icon" shape="square"/>
            </t-button>
            <t-tooltip content="系统通知">
              <t-button variant="text" shape="square">
                <mail-icon/>
              </t-button>
            </t-tooltip>
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
          </div>
        </template>
      </t-head-menu>
    </div>
    <!-- 轮播区域 -->
    <div>
      <t-swiper
        :autoplay="true"
        :duration="6000"
        :interval="4000"
        :loop="true"
        :stop-on-hover="true"
        :trigger="'click'"
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
      <h1>产品</h1>
      <!--内容-->
      <t-row style="margin-top: 10px">
        <t-col :span="4" v-for="(item,index) in banners.slice(0,3)" style="padding: 5px">
          <div :id="'product'+index">
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
        <t-col :span="4" v-for="(item,index) in banners.slice(3,6)" style="padding: 5px">
          <div>
            <t-card theme="poster2"
                    :bordered="true"
                    :hover-shadow="true"
                    :title="item.title"
                    :style="{ width: '420px' }">
              <t-image :src="item.icon" style="width: 52px;height: 52px;float: left"/>
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
    <main class="main">
      <h1>解决方案</h1>
      <t-row style="margin-top: 10px">
        <t-col :span="4" v-for="(item,index) in solutions.slice(0,3)" style="padding: 5px">
          <div :id="'product'+index">
            <t-card theme="poster2"
                    :bordered="true"
                    :hover-shadow="true"
                    :title="item.title"
                    :style="{ width: '420px' }">
              <!--              <t-image :src="item.icon" style="width: 52px;height: 52px;float: left"/>-->
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
      <t-row style="margin-top: 10px">
        <t-col :span="4" v-for="(item,index) in solutions.slice(3,6)" style="padding: 5px">
          <div :id="'product'+index">
            <t-card theme="poster2"
                    :bordered="true"
                    :hover-shadow="true"
                    :title="item.title"
                    :style="{ width: '420px' }">
              <!--              <t-image :src="item.icon" style="width: 52px;height: 52px;float: left"/>-->
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
    </main>
    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>CloudServerPlus</h4>
            <p>免费的云服务平台，提供安全、稳定、高效、共享的云计算服务。</p>
          </div>
          <div class="footer-section">
            <h4>产品</h4>
            <ul v-for="(item,index) in banners">
              <li><a :href="item.url">{{ item.title }}</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>资源</h4>
            <ul v-for="(item,index) in resources">
              <li><a :href="item.url">{{ item.title }}</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>其他</h4>
            <ul v-for="(item,index) in others">
              <li><a :href="item.url">{{ item.title }}</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>联系我们</h4>
            <p>邮箱：2694484453@qq.com</p>
            <p>电话：18439406854</p>
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
import {MailIcon} from "tdesign-icons-vue";
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
    MailIcon,
    prometheusLogo
  },
  mounted() {
    this.userName = getUserName() ?? '访客';
  },
  data() {
    return {
      banners: [
        {
          title: 'Prometheus监控&告警&可视化',
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
          desc: '支持Nas常用工具，如：FRP内网穿透服务、等',
          image: 'https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/cloud-plus/4.png',
          url: 'https://gpg123.vip/nas/frpc',
          icon: nasLogo
        },
        {
          title: 'Scheduling调度中心',
          desc: '支持定时任务设置、webHook调用、定时Http请求、远程定时Ssh服务等',
          image: 'https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/cloud-plus/5.png',
          url: 'https://gpg123.vip/scheduling/list',
          icon: schedulingLogo,
        },
        {
          title: '免费域名证书',
          desc: '集成SSL证书模块，一站式管理证书发放、签约、续签等',
          image: 'https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/cloud-plus/6.png',
          url: 'https://gpg123.vip/domain/base',
          icon: domainLogo,
        }
      ],
      solutions: [
        {
          title: 'prometheus-rule',
          desc: '分布式文件系统多端写入',
        },
        {
          title: 'helm-client+kubeconfig',
          desc: '实现chart应用分发、安装、卸载、管理等',
        },
        {
          title: 'kubernetes-job/cron-job',
          desc: '默认/自定义镜像完成CI、CD、devops流程',
        },
        {
          title: 'Nas开放式服务',
          desc: '稳定内网穿透服务/镜像加速',
        },
        {
          title: 'scheduling-job',
          desc: '分布式任务系统',
        },
        {
          title: '调用 Let\'s Encrypt 申请和管理 SSL/TLS 证书',
          desc: 'acme4j-client支持 ACME v2（Let\'s Encrypt 当前协议）',
        }
      ],
      resources: [
        {
          title: '文档中心',
          desc: '<UNK>',
          url: 'https://docs.gpg123.vip',
        },
        {
          title: 'Api中心',
          desc: '<UNK>',
          url: 'https://docs.gpg123.vip',
        },
        {
          title: '软件中心',
          desc: '<UNK>',
          url: 'https://docs.gpg123.vip',
        },
      ],
      others: [
        {
          title: '壁纸中心',
          desc: '<UNK>',
          url: 'https://wallpaper.gpg123.vip',
        },
        {
          title: '镜像加速',
          desc: '<UNK>',
          url: 'https://hubproxy.gpg123.vip',
        },
        {
          title: 'webhook-test',
          desc: '<UNK>',
          url: 'https://webhook.gpg123.vip',
        }
      ],
      username: ''
    };
  },
  methods: {
    handleClick({e, href, title}) {
      e.preventDefault();
      console.log('click', href, title);
    },
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
