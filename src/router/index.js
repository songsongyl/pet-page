import { createWebHistory, createRouter } from 'vue-router'
/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  // 领养申请模块
  {
    path: '/adoption',
    component: Layout,
    meta: { title: '爱心送养记', icon: 'peoples' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/adoption/list/index.vue'),
        name: 'AdoptionList',
        meta: { title: '申请列表', roles: ['admin'] }
      },
      {
        path: 'application',
        component: () => import('@/views/adoption/application/index.vue'),
        name: 'AdoptionApplication',
        meta: { title: '提交申请' }
      },
      {
        path: 'admin/approval',
        component: () => import('@/views/adoption/admin/approval.vue'),
        name: 'AdoptionApproval',
        meta: { title: '申请审批', roles: ['admin'] }
      },
      {
        path: 'detail/:applicationId',
        component: () => import('@/views/adoption/detail/index.vue'),
        name: 'AdoptionDetail',
        hidden: true,
        meta: { title: '申请详情', activeMenu: '/adoption/list' }
      }
    ]
  },
  // 物资捐赠模块
  {
    path: '/donation',
    component: Layout,
    meta: { title: '点滴捐爱', icon: 'shopping' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/donation/list/index.vue'),
        name: 'DonationList',
        meta: { title: '捐赠列表', roles: ['admin'] }
      },
      {
        path: 'application',
        component: () => import('@/views/donation/application/index.vue'),
        name: 'DonationApplication',
        meta: { title: '物品捐赠' }
      },
      {
        path: 'fund',
        component: () => import('@/views/donation/fund/index.vue'),
        name: 'FundDonation',
        meta: { title: '资金捐助' }
      },
      {
        path: 'volunteer',
        component: () => import('@/views/donation/volunteer/index.vue'),
        name: 'VolunteerService',
        meta: { title: '志愿服务' }
      },
      {
        path: 'admin/approval',
        component: () => import('@/views/donation/admin/approval.vue'),
        name: 'DonationApproval',
        meta: { title: '捐赠审批', roles: ['admin'] }
      },
      {
        path: 'detail/:donationId',
        component: () => import('@/views/donation/detail/index.vue'),
        name: 'DonationDetail',
        hidden: true,
        meta: { title: '捐赠详情', activeMenu: '/donation/list' }
      }
    ]
  },
  // 故事会模块
  {
    path: '/story',
    component: Layout,
    meta: { title: '暖心救助故事汇', icon: 'documentation' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/story/list/index.vue'),
        name: 'StoryList',
        meta: { title: '故事列表' }
      },
      {
        path: 'publish',
        component: () => import('@/views/story/publish/index.vue'),
        name: 'StoryPublish',
        meta: { title: '发布故事' }
      },
      {
        path: 'detail/:storyId',
        component: () => import('@/views/story/detail/index.vue'),
        name: 'StoryDetail',
        hidden: true,
        meta: { title: '故事详情', activeMenu: '/story/list' }
      }
    ]
  },
  // 爱心交流社区模块
  {
    path: '/community',
    component: Layout,
    meta: { title: '爱心交流社区', icon: 'message' },
    children: [
      {
        path: 'post/list',
        component: () => import('@/views/community/post/list/index.vue'),
        name: 'PostList',
        meta: { title: '帖子列表' }
      },
      {
        path: 'post/publish',
        component: () => import('@/views/community/post/publish/index.vue'),
        name: 'PostPublish',
        meta: { title: '发布帖子' }
      },
      {
        path: 'post/detail/:postId',
        component: () => import('@/views/community/post/detail/index.vue'),
        name: 'PostDetail',
        hidden: true,
        meta: { title: '帖子详情', activeMenu: '/community/post/list' }
      }
    ]
  },

  // 知识课堂
  {
    path: '/course',
    component: Layout,
    meta: { title: '知识课堂', icon: 'education' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/course/course/index.vue'),
        name: 'Course',
        meta: { title: '知识课堂' }
      },
      {
        path: 'detail/:courseId',
        component: () => import('@/views/course/detail/index.vue'),
        name: 'CourseDetail',
        hidden: true,
        meta: { title: '课程详情', activeMenu: '/course/index' }
      }
    ]
  },
  // AI 智能问答模块
  {
    path: '/ai',
    component: Layout,
    hidden: true,
    meta: { title: 'AI 智能问答', icon: 'question' },
    children: [
      {
        path: 'chat',
        component: () => import('@/views/ai/chat/index.vue'),
        name: 'AIChat',
        meta: { title: '智能问答' }
      }
    ]
  },
  // 志愿者管理模块
  {
    path: '/admin/volunteer',
    component: Layout,
    meta: { title: '志愿者管理', icon: 'user', roles: ['admin'] },
    children: [
      {
        path: '',
        component: () => import('@/views/admin/volunteer/index.vue'),
        name: 'Volunteer',
        meta: { title: '志愿者管理' }
      },
      {
        path: 'add',
        component: () => import('@/views/admin/volunteer/add.vue'),
        name: 'VolunteerAdd',
        hidden: true,
        meta: { title: '添加志愿者', activeMenu: '/admin/volunteer' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/admin/volunteer/edit.vue'),
        name: 'VolunteerEdit',
        hidden: true,
        meta: { title: '编辑志愿者', activeMenu: '/admin/volunteer' }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/admin/volunteer/detail.vue'),
        name: 'VolunteerDetail',
        hidden: true,
        meta: { title: '志愿者详情', activeMenu: '/admin/volunteer' }
      }
    ]
  },
  // 合作机构管理模块
  {
    path: '/admin/organization',
    component: Layout,
    meta: { title: '合作机构管理', icon: 'tree', roles: ['admin'] },
    children: [
      {
        path: '',
        component: () => import('@/views/admin/organization/index.vue'),
        name: 'Organization',
        meta: { title: '合作机构管理' }
      },
      {
        path: 'add',
        component: () => import('@/views/admin/organization/add.vue'),
        name: 'OrganizationAdd',
        hidden: true,
        meta: { title: '添加合作机构', activeMenu: '/admin/organization' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/admin/organization/edit.vue'),
        name: 'OrganizationEdit',
        hidden: true,
        meta: { title: '编辑合作机构', activeMenu: '/admin/organization' }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/admin/organization/detail.vue'),
        name: 'OrganizationDetail',
        hidden: true,
        meta: { title: '合作机构详情', activeMenu: '/admin/organization' }
      }
    ]
  },
  // 宠物信息管理模块
  {
    path: '/pet/info',
    component: Layout,
    meta: { title: '宠物信息档案', icon: 'people' },
    children: [
      {
        path: '',
        component: () => import('@/views/pet/info/index.vue'),
        name: 'PetInfo',
        meta: { title: '宠物信息管理' }
      },
      {
        path: 'add',
        component: () => import('@/views/pet/info/add.vue'),
        name: 'PetInfoAdd',
        hidden: true,
        meta: { title: '添加宠物信息', activeMenu: '/pet/info' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/pet/info/edit.vue'),
        name: 'PetInfoEdit',
        hidden: true,
        meta: { title: '编辑宠物信息', activeMenu: '/pet/info' }
      }
    ]
  },
  // 救助信息管理模块
  {
    path: '/give/give',
    component: Layout,
    meta: { title: '流浪宝贝救助站', icon: 'star' },
    children: [
      {
        path: '',
        component: () => import('@/views/give/give/index.vue'),
        name: 'RescueInfo',
        meta: { title: '流浪宝贝救助站' }
      },
      {
        path: 'add',
        component: () => import('@/views/give/give/add.vue'),
        name: 'RescueInfoAdd',
        hidden: true,
        meta: { title: '添加救助信息', activeMenu: '/give/give' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/give/give/edit.vue'),
        name: 'RescueInfoEdit',
        hidden: true,
        meta: { title: '编辑救助信息', activeMenu: '/give/give' }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/give/give/detail.vue'),
        name: 'RescueInfoDetail',
        hidden: true,
        meta: { title: '救助信息详情', activeMenu: '/give/give' }
      }
    ]
  },
  // 投诉举报管理模块
  {
    path: '/complaint/report',
    component: Layout,
    meta: { title: '投诉举报管理', icon: 'bug' },
    children: [
      {
        path: '',
        component: () => import('@/views/complaintreport/ComplaintReport/index.vue'),
        name: 'ComplaintReport',
        meta: { title: '投诉举报管理' }
      },
      {
        path: 'add',
        component: () => import('@/views/complaintreport/ComplaintReport/index.vue'),
        name: 'ComplaintReportAdd',
        hidden: true,
        meta: { title: '添加投诉举报', activeMenu: '/complaint/report' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/complaintreport/ComplaintReport/index.vue'),
        name: 'ComplaintReportEdit',
        hidden: true,
        meta: { title: '编辑投诉举报', activeMenu: '/complaint/report' }
      },

      {
        path: 'blacklist',
        component: () => import('@/views/complaintreport/blacklist/index.vue'),
        name: 'Blacklist',
        meta: { title: '黑名单管理', roles: ['admin'] }
      }
    ]
  },
  // 独立公告模块
  {
    path: '/notice/info',
    component: Layout,
    meta: { title: '公告信息管理', icon: 'documentation' },
    children: [
      {
        path: '',
        component: () => import('@/views/noticeinfo/noticeinfo/index.vue'),
        name: 'NoticeInfo',
        meta: { title: '公告信息管理' }
      },
      {
        path: 'add',
        component: () => import('@/views/noticeinfo/noticeinfo/index.vue'),
        name: 'NoticeInfoAdd',
        hidden: true,
        meta: { title: '添加公告信息', activeMenu: '/notice/info' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/noticeinfo/noticeinfo/index.vue'),
        name: 'NoticeInfoEdit',
        hidden: true,
        meta: { title: '编辑公告信息', activeMenu: '/notice/info' }
      }
    ]
  },
  //   component: Layout,
  //   meta: { title: '系统管理', icon: 'system' },
  //   children: [
  //     {
  //       path: 'user',
  //       component: () => import('@/views/system/user/index.vue'),
  //       name: 'User',
  //       meta: { title: '用户管理' }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/system/role/index.vue'),
  //       name: 'Role',
  //       meta: { title: '角色管理' }
  //     },
  //     {
  //       path: 'menu',
  //       component: () => import('@/views/system/menu/index.vue'),
  //       name: 'Menu',
  //       meta: { title: '菜单管理' }
  //     },
  //     {
  //       path: 'dept',
  //       component: () => import('@/views/system/dept/index.vue'),
  //       name: 'Dept',
  //       meta: { title: '部门管理' }
  //     },
  //     {
  //       path: 'post',
  //       component: () => import('@/views/system/post/index.vue'),
  //       name: 'Post',
  //       meta: { title: '岗位管理' }
  //     },
  //     {
  //       path: 'dict',
  //       component: () => import('@/views/system/dict/index.vue'),
  //       name: 'Dict',
  //       meta: { title: '字典管理' }
  //     },
  //     {
  //       path: 'config',
  //       component: () => import('@/views/system/config/index.vue'),
  //       name: 'Config',
  //       meta: { title: '参数设置' }
  //     }

  //   ]
  // },
  // 监控中心模块
  // {
  //   path: '/monitor',
  //   component: Layout,
  //   meta: { title: '监控中心', icon: 'monitor' },
  //   children: [
  //     {
  //       path: 'online',
  //       component: () => import('@/views/monitor/online/index.vue'),
  //       name: 'Online',
  //       meta: { title: '在线用户' }
  //     },
  //     {
  //       path: 'logininfor',
  //       component: () => import('@/views/monitor/logininfor/index.vue'),
  //       name: 'Logininfor',
  //       meta: { title: '登录日志' }
  //     },
  //     {
  //       path: 'operlog',
  //       component: () => import('@/views/monitor/operlog/index.vue'),
  //       name: 'Operlog',
  //       meta: { title: '操作日志' }
  //     },
  //     {
  //       path: 'job',
  //       component: () => import('@/views/monitor/job/index.vue'),
  //       name: 'Job',
  //       meta: { title: '定时任务' }
  //     },
  //     {
  //       path: 'server',
  //       component: () => import('@/views/monitor/server/index.vue'),
  //       name: 'Server',
  //       meta: { title: '服务监控' }
  //     },
  //     {
  //       path: 'cache',
  //       component: () => import('@/views/monitor/cache/index.vue'),
  //       name: 'Cache',
  //       meta: { title: '缓存监控' }
  //     }
  //   ]
  // }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

export default router;
