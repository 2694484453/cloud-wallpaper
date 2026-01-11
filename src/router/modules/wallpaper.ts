import Layout from "@/layouts/index.vue";
import {ImageIcon} from "tdesign-icons-vue";

export default [
  {
    path: '/',
    name: 'wallpaper',
    component: () => import('@/pages/wallpaper/list/index.vue'),
  },
  {
    path: '/info',
    name: 'info',
    component: () => import('@/pages/wallpaper/info/index.vue'),
  },
  {
    path: '/ai',
    name: 'ai',
    component: () => import('@/pages/wallpaper/ai/index.vue'),
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
    meta: {title: 'Ai壁纸管理', icon: ImageIcon},
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
        meta: {title: '我的词条'},
      },
      {
        path: "use",
        name: 'UseBase',
        component: () => import("@/pages/wallpaper/use/index.vue"),
        meta: {title: '模型调用'},
      }
    ],
  },
]
