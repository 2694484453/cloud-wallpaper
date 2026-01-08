import {ServerIcon, ImageIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';
export default [
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
  {
    path: '/frp',
    name: 'frp',
    component: Layout,
    meta: {title: 'frp服务管理', icon: ServerIcon},
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: () => import('@/pages/nas/index.vue'),
        meta: {title: '概览'},
      },
      {
        path: "frpc",
        name: 'frpcListBase',
        component: () => import("@/pages/nas/frp/list/index.vue"),
        meta: {title: 'Frpc管理'},
      },
      // {
      //   path: "use",
      //   name: 'UseBase',
      //   component: () => import("@/pages/ai/use/index.vue"),
      //   meta: {title: '模型调用'},
      // }
    ],
  }
]
