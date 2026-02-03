import Layout from "@/layouts/index.vue";
import {
  ImageIcon,
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
    redirect: "/pc/2d",
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
        meta: {title: '概览仪表盘'},
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
    path: '/pc',
    name: 'pc',
    meta: {title: '桌面壁纸', icon: ImageIcon},
    component: Layout,
    children: [
      {
        path: '2d',
        name: '2d',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '二次元', icon: ImageIcon},
        // 直接写死参数
        props: {cateName: '2d', type: String}
      },
      {
        path: '3d',
        name: '3d',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '三次元', icon: ImageIcon},
        props: {cateName: '3d', type: String}
      },
      {
        path: 'other',
        name: 'other',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '其他', icon: ImageIcon},
        props: {cateName: 'other', type: String}
      },
      {
        path: 'widescreen',
        name: 'widescreen',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '超宽屏', icon: ImageIcon},
        props: {cateName: 'widescreen', type: String}
      },
      {
        path: 'dynamic',
        name: 'dynamic',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '动态壁纸', icon: DesktopIcon},
        props: {cateName: 'dynamic', type: String}
      }
    ]
  },
  {
    path: '/phone',
    name: 'phone',
    meta: {title: '手机壁纸', icon: ImageIcon},
    component: Layout,
    children: [
      {
        path: 'iphone',
        name: 'iphone',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '手机静态壁纸', icon: MobileIcon},
        props: {cateName: 'iphone', type: String}
      },
      {
        path: 'dynamic_phone',
        name: 'dynamic_phone',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '手机动态壁纸', icon: MobileIcon},
        props: {cateName: 'dynamic_phone', type: String}
      },
    ]
  },
  {
    path: '/ai',
    name: 'ai',
    meta: {title: 'Ai画廊', icon: ImageIcon},
    component: Layout,
    children: [
      {
        name: "all",
        path: 'all',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: "全部", icon: ImageIcon},
        props: [{cateName: 'ai', type: String}, {name: "", type: String}],
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
        meta: {title: '我的词条', icon: FileWordIcon},
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
