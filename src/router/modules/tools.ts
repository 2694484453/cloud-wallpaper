import {ToolsIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/',
    redirect: '/common',
  },
  {
    path: '/common',
    component: Layout,
    name: 'tools',
    meta: {
      title: '常用推荐',
      icon: ToolsIcon,
    },
    children: [
      {
        path: 'pages/:cateName',
        name: 'pages',
        component: () => import('@/pages/tools/card/index.vue'),
        meta: {title: '工具列表'},
      },
      {
        path: 'access',
        name: 'access',
        component: () =>  import('@/pages/tools/card/index.vue'),
        meta: {title: '配置列表'},
      },
    ],
  },
  {
    path: '/sheji',
    component: Layout,
    name: 'sheji',
    meta: {
      title: '<UNK>',
      icon: ToolsIcon,
    },
    children: [
      {
        path: 'overView',
        name: 'overView',
        component: () => import('@/pages/git/index.vue'),
        meta: {title: '概览'},
      },
    ]
  },
  {
    path: '/ai',
    component: Layout,
    name: 'ai',
    meta: {
      title: '<UNK>',
      icon: ToolsIcon,
    }
  }
]
