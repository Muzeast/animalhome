import Main from '@/components/Main'

export const routes = [
      {
        path: '/login',
        name: 'login',
        meta: {title: '登录'},
        component: () => import('@/components/login')
      },
      {
        path: '/register',
        name: 'register',
        meta: {title: '注册'},
        component: () => import('@/components/register')
      },
      {
        path: '/',
        name: '_home',
        redirect: 'home',
        meta: {title: '首页'},
        component: Main,
        children: [
          {
              path: 'home',
              name: 'home',
              meta: {title: '首页'},
              component: () => import('@/components/home')
          }
        ]
      },
      {
        path: '/',
        redirect: 'user',
        meta: {title: '用户'},
        component: Main,
        children: [
          {
            path: 'user',
            name: 'user',
            meta: {title: '用户'},
            component: () => import('@/components/user'),
            children: [
              {
                path: 'userInfo',
                name: 'userInfo',
                meta: {title: '用户信息'},
                component: () => import('@/components/user/UserInfo')
              },
              {
                path: 'myPublish',
                name: 'myPublish',
                meta: {title: '我的发布'},
                component: () => import('@/components/plugins/table')
              },
              {
                path: 'myAdoption',
                name: 'myAdoption',
                meta: {title: '我的领养'},
                component: () => import('@/components/plugins/table')
              }
            ]
          }
        ]
      },
      {
        path: '/salvation',
        name: 'salvation',
        meta: {title: '领养救助'},
        component: Main,
        children: [
          {
            path: 'rescue',
            name: 'rescue',
            meta: {title: '申请救助'},
            component: () => import('@/components/salvation/rescue')
          },
          {
            path: 'adoption',
            name: 'adoption',
            meta: {title: '我要领养'},
            component: () => import('@/components/plugins/table')
          },
          {
            path: 'volunteer',
            name: 'volunteer',
            meta: {title: '志愿专区'},
            component: () => import('@/components/salvation/volunteer')
          },
          {
            path: 'eventsInfo',
            name: 'eventsInfo',
            meta: {title: '我要领养'},
            component: () => import('@/components/salvation/volunteer/eventsInfo')
          },
        ]
      },
      {
        path: '/management',
        name: 'management',
        meta: {title: '管理'},
        component: Main,
        children: [
          {
            path: 'system',
            name: 'system',
            meta: {title: '系统管理'},
            component: () => import('@/components/management/system'),
            children: [
              {
                path: 'menu',
                name: 'menu',
                meta: {title: '菜单管理'},
                component: () => import('@/components/management/system/Menu')
              },
              {
                path: 'role',
                name: 'role',
                meta: {title: '角色管理'},
                component: () => import('@/components/management/system/Role')
              }
            ]
          },
          {
            path: 'audit',
            name: 'audit',
            meta: {title: '审核认证'},
            component: () => import('@/components/management/audit'),
            children: []
          }
        ]
      },
      {
        path: '/about',
        name: 'about',
        meta: {title: '关于我们'},
        component: Main,
        children: [
          {
              path: 'introduce',
              name: 'introduce',
              meta: {title: '平台简介'},
              component: () => import('@/components/plugins/table')
          },
          {
            path: 'teamMember',
            name: 'teamMember',
            meta: {title: '团队成员'},
            component: () => import('@/components/plugins/table')
          },
          {
            path: 'contactWay',
            name: 'contactWay',
            meta: {title: '联系方式'},
            component: () => import('@/components/plugins/table')
          }
      ]
      }
]