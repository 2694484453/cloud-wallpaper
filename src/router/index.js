import VueRouter from 'vue-router';
import commonRouters from '@/router/modules/common';
// 壁纸
import wallpaperRouters from "@/router/modules/wallpaper";
// 基础路由
export const routerList = [
  ...wallpaperRouters,
  ...commonRouters
];
const env = import.meta.env.MODE || 'development';
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
