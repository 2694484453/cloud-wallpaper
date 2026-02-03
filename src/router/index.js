import VueRouter from 'vue-router';
import commonRouters from '@/router/modules/common';
// dashboard
import dashboardRouters from '@/router/modules/dashboard';
// 其他
import othersRouters from '@/router/modules/others';
// 域名
import domainRouters from '@/router/modules/domain';
// 监控
import prometheusRouters from "@/router/modules/prometheus";
// 应用
import appRouters from "@/router/modules/app";
// 仓库
import dockerRouters from "@/router/modules/docker";
// traefik
import traefikRouters from "@/router/modules/traefik";
// 集群
import clusterRouters from "@/router/modules/cluster";
// coredns
import corednsRouters from "@/router/modules/coredns";
// caddy
import caddyRouters from "@/router/modules/caddy";
// backup
import backupRouters from "@/router/modules/backup";
// tracing
import tracingRouters from "@/router/modules/tracing";
// git
import gitRouters from "@/router/modules/git";
// devops
import devopsRouters from "@/router/modules/devops";
// ai
import AiRouters from "@/router/modules/ai";
// discovery
import discoveryRouters from "@/router/modules/discovery";
// nas
import nasRouters from "@/router/modules/nas";
// 消息
import noticeRouters from "@/router/modules/notice";
// 调度
import scheduleRouters from "@/router/modules/scheduling";
// 工具
import toolsRouters from "@/router/modules/tools";
// 壁纸
import wallpaperRouters from "@/router/modules/wallpaper";
import proxy from '@/config/host';
import Common from "@/router/modules/common";
// 基础路由
export const routerList = [];
const env = import.meta.env.MODE || 'development';
const envName = proxy[env].NAME
// 存放动态路由
switch (envName) {
  case "web":
    routerList.push(
      {
        path: '*',
        redirect: '/home',
      },
      {
        path: "/home",
        name: "home",
        component: () => import('@/pages/home/index.vue'),
      })
    routerList.push(...dashboardRouters)
    routerList.push(...domainRouters)
    routerList.push( ...gitRouters)
    routerList.push(...devopsRouters)
    routerList.push(...prometheusRouters)
    routerList.push( ...tracingRouters)
    routerList.push(...appRouters)
    routerList.push(...traefikRouters)
    routerList.push(...clusterRouters)
    routerList.push(...caddyRouters)
    routerList.push(...corednsRouters)
    routerList.push(...nasRouters)
    routerList.push(...AiRouters)
    routerList.push(...scheduleRouters)
    routerList.push(...noticeRouters)
    routerList.push(...commonRouters)
    break;
  case "wallpaper":
    routerList.push(...wallpaperRouters)
    //routerList.push(...noticeRouters)
    //routerList.push(...nasRouters)
    routerList.push(...commonRouters)
    break;
  case "tools":
    routerList.push(...dashboardRouters)
    routerList.push(...toolsRouters)
    routerList.push(...commonRouters)
    break;
}

// 存放固定的路由
const defaultRouterList = [
  ...routerList,
];

const createRouter = () =>
  new VueRouter({
    mode: 'history',
    base: env === 'site' ? '/starter/vue/' : null,
    routes: defaultRouterList,
    scrollBehavior() {
      return {x: 0, y: 0};
    },
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
