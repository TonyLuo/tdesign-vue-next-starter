import Layout from '@/layouts/index.vue';
import LogoutIcon from '@/assets/assets-slide-logout.svg';

export default [
  {
    path: '/user-list',
    name: 'userList',
    component: Layout,
    redirect: '/user-list/index',
    meta: { title: '用户管理', icon: 'user-circle' },
    children: [
      {
        path: 'index',
        name: 'UserListIndex',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户列表' },
      },
    ],
  },
  {
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/index',
    meta: { title: '个人页', icon: 'user-circle' },
    children: [
      {
        path: 'index',
        name: 'UserIndex',
        component: () => import('@/pages/user/index.vue'),
        meta: { title: '个人中心' },
      },
    ],
  },
  {
    path: '/loginRedirect',
    name: 'loginRedirect',
    redirect: '/login',
    meta: { title: '登录页', icon: LogoutIcon },
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'index',
        redirect: '/login',
        component: () => import('@/layouts/blank.vue'),
        meta: { title: '登录中心' },
      },
    ],
  },
];
