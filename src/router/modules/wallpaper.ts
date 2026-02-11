import Layout from "@/layouts/index.vue";
import {
  ImageIcon,
  MobileIcon,
  DesktopIcon,
  ServerIcon,
  FileWordIcon,
  CloudIcon,
  DashboardIcon, FileIconIcon, DownloadIcon, FileIcon,AiImageIcon,ModuleIcon,ArticleIcon,Desktop1Icon,MobileListIcon,AiImage1Icon,FileZipIcon,InfoCircleIcon
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
    meta: {title: '桌面壁纸', icon: Desktop1Icon},
    component: Layout,
    children: [
      {
        path: '2d',
        name: '2d',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '二次元', icon: ImageIcon},
        // 直接写死参数
        props: {cateName: '2d'}
      },
      {
        path: '3d',
        name: '3d',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '三次元', icon: ImageIcon},
        props: {cateName: '3d'}
      },
      {
        path: 'other',
        name: 'other',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '其他', icon: ImageIcon},
        props: {cateName: 'other'}
      },
      {
        path: 'widescreen',
        name: 'widescreen',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '超宽屏', icon: ImageIcon},
        props: {cateName: 'widescreen'}
      },
    ]
  },
  {
    path: '/phone',
    name: 'phone',
    meta: {title: '手机壁纸', icon: MobileListIcon},
    component: Layout,
    children: [
      {
        path: 'iphone',
        name: 'iphone',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '手机静态壁纸', icon: MobileIcon},
        props: {cateName: 'iphone'}
      },

    ]
  },
  {
    path: "/dynamic",
    name: "dynamic",
    meta: {title: '动态壁纸', icon: MobileListIcon},
    component: Layout,
    children: [
      {
        path: 'dynamic_pc',
        name: 'dynamic',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '桌面动态壁纸', icon: DesktopIcon},
        props: {cateName: 'dynamic'}
      },
      {
        path: 'dynamic_phone',
        name: 'dynamic_phone',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '手机动态壁纸', icon: MobileIcon},
        props: {cateName: 'dynamic_phone'}
      },
    ]
  },
  {
    path: '/ai',
    name: 'ai',
    meta: {title: 'Ai画廊', icon: AiImage1Icon},
    component: Layout,
    children: [
      {
        name: "all",
        path: 'all',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: "全部", icon: ImageIcon},
        props: {cateName: 'ai', name: ''},
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
    meta: {title: '在线生图', icon: AiImageIcon},
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
  {
    path: '/models',
    name: 'models',
    component: Layout,
    meta: {title: '离线sd模型', icon: ModuleIcon},
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import("@/pages/wallpaper/models/index.vue"),
        meta: {title: '模型列表', icon: ArticleIcon},
      },
    ]
  },
  {
    path: '/resources',
    name: 'resources',
    component: Layout,
    meta: {title: '跑图工具包下载', icon: FileZipIcon},
    children: [
      {
        path: 'https://pan.quark.cn/s/2c832199b09b',
        name: 'sd',
        meta: {title: '秋叶Stable-Diffusion整合包', icon: FileIcon},
      },
      {
        path: "https://pan.quark.cn/s/4e9459b17c94",
        name: 'sd-forge',
        meta: {title: '秋叶Stable-Diffusion-Forge整合包',icon: FileIcon}
      },
      {
        path: 'https://pan.quark.cn/s/64b808baa960',
        name: "ComfyUI",
        meta: {title: '秋叶ComfyUI整合包', icon: FileIcon},
      },
      {
        path: 'https://pan.quark.cn/s/b4081a86e842',
        name: 'sd-modules',
        meta: {title: '模型包下载', icon: FileIcon},
      },
      {
        path: 'https://hubproxy.gpg123.cn',
        name: 'hubproxy',
        meta: {title: 'HuggingFace加速', icon: FileIcon},
      },
    ]
  },
  {
    path: '/about',
    name: 'about',
    component: Layout,
    meta: {title: '关于', icon: InfoCircleIcon},
    children: [
      {
        path: 'gpu',
        name: 'gpu',
        component: () => import("@/pages/wallpaper/share/index.vue"),
        meta: {title: 'GPU合租与赞助', icon: FileIcon},
      },
      {
        path: 'https://umami.gpg123.vip/share/vV0lArsoXUhPpAZK/wallpaper.gpg123.vip',
        name: 'umami',
        component: () => import("@/pages/wallpaper/share/index.vue"),
        meta: {title: '站点统计', icon: FileIcon},
      },
    ]
  }
]
