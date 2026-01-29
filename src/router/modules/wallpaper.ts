import Layout from "@/layouts/index.vue";
import {
  ImageIcon,
  VideoIcon,
  MobileIcon,
  DesktopIcon,
  ServerIcon,
  FileWordIcon,
  CloudIcon,
  DashboardIcon
} from "tdesign-icons-vue";

export default [
  {
    path: "/",
    redirect: "/static/2d",
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/base',
    name: 'dashboard',
    meta: {
      title: '仪表盘',
      icon: DashboardIcon,
    },
    children: [
      {
        path: 'base',
        name: 'DashboardBase',
        component: () => import('@/pages/wallpaper/index.vue'),
        meta: { title: '概览仪表盘' },
      },
      // {
      //   path: 'detail',
      //   name: 'DashboardDetail',
      //   component: () => import('@/pages/dashboard/detail/index.vue'),
      //   meta: { title: '统计报表' },
      // },
    ],
  },
  {
    path: '/static',
    name: 'static',
    meta: {title: '静态壁纸', icon: ImageIcon},
    component: Layout,
    children: [
      {
        path: '2d',
        name: '2d',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '二次元', icon: ImageIcon},
      },
      {
        path: '3d',
        name: '3d',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '三次元', icon: ImageIcon},
      },
      {
        path: 'iphone',
        name: 'iphone',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '手机壁纸', icon: MobileIcon},
      },
      {
        path: 'ai',
        name: 'ai',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: 'Ai画廊', icon: ImageIcon},
      },
      {
        path: 'other',
        name: 'other',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '其他', icon: ImageIcon},
      }
    ]
  },
  {
    path: '/dynamicW',
    name: 'dynamicW',
    meta: {title: '动态壁纸', icon: VideoIcon},
    component: Layout,
    children: [
      {
        path: 'dynamic_phone',
        name: 'dynamic_phone',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '手机动态壁纸', icon: MobileIcon},
      },
      {
        path: 'dynamic',
        name: 'dynamic',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: 'Pc动态壁纸', icon: DesktopIcon},
      }
    ]
  },
  {
    path: '/info',
    name: 'info',
    component: () => import('@/pages/wallpaper/info/index.vue'),
  },
  {
    path: '/share',
    name: 'share',
    component: () => import('@/pages/wallpaper/share/index.vue'),
  },
  {
    path: '/download',
    name: 'download',
  },
  {
    path: '/stableDiffusion',
    name: 'stableDiffusion',
    component: Layout,
    meta: {title: '壁纸生成', icon: ServerIcon},
    children: [
      // {
      //   path: 'overview',
      //   name: 'overview',
      //   component: () => import('@/pages/nas/index.vue'),
      //   meta: {title: '概览'},
      // },
      {
        path: "minePrompt",
        name: 'minePrompt',
        component: () => import("@/pages/wallpaper/prompt/index.vue"),
        meta: {title: '我的词条',  icon: FileWordIcon},
      },
      {
        path: "use",
        name: 'UseBase',
        component: () => import("@/pages/wallpaper/ai/index.vue"),
        meta: {title: '模型调用', icon: CloudIcon},
      }
    ],
  },
  // {
  //   path: '/models',
  //   name: 'models',
  //   component: Layout,
  //   meta: {title: '模型管理', icon: FileIconIcon},
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'list',
  //       component: () => import("@/pages/wallpaper/models/index.vue"),
  //       meta: {title: '模型列表', icon: FileIcon},
  //     },
  //     {
  //       path: 'http://hongkong.gpg123.vip:5000',
  //       name: 'proxy',
  //       meta: {title: '代理加速', icon: DownloadIcon},
  //     }
  //   ]
  // }
]
