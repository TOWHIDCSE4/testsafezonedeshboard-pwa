import { RouteRecordRaw } from 'vue-router';
import auth from '@/middleware/auth';
import checkLoggedIn from '@/middleware/checkLoggedIn';

const routes: RouteRecordRaw[] = [
  {
    name: 'Đăng nhập',
    path: '/login',
    beforeEnter: checkLoggedIn,
    component: () => import('@/layouts/auth.vue'),
    children: [
      {
        path: '',
        name: 'Đăng nhập',
        component: () => import('@/pages/login/index.vue'),
      },
      {
        path: '/signup',
        name: 'Đăng ký tài khoản',
        component: () => import('@/pages/signup/index.vue'),
      },
      {
        path: '/forgot-password',
        name: 'Quên mật khẩu',
        component: () => import('@/pages/forgot-password/index.vue'),
      },
      {
        path: '/verify/phone',
        name: 'Xác minh SĐT',
        component: () => import('@/pages/verify-phone/index.vue'),
      },
    ],
  },
  {
    path: '/payment-process',
    name: 'Thanh toán',
    beforeEnter: auth,
    component: () => import('@/pages/payment/index.vue'),
  },
  {
    name: 'Trang chủ',
    path: '/',
    beforeEnter: auth,
    component: () => import('@/layouts/default.vue'),
    redirect: '/family',
    children: [
      {
        path: '/family',
        name: 'Gia đình của tôi',
        component: () => import('@/pages/index.vue'),
      },
      {
        path: '/devices',
        name: 'Thiết bị',
        component: () => import('@/pages/devices/index.vue'),
      },
      {
        path: '/devices/:id',
        name: 'Thông tin thiết bị',
        component: () => import('@/pages/devices/detail.vue'),
      },
      {
        path: '/account',
        name: 'Tài khoản',
        component: () => import('@/pages/account/index.vue'),
      },
      {
        path: '/plans',
        name: 'Đăng ký',
        component: () => import('@/pages/plans/index.vue'),
      },
      {
        name: 'Thành viên',
        path: '/family/:id',
        children: [
          {
            path: '',
            name: 'Tổng quan',
            component: () => import('@/pages/children/dashboard.vue'),
          },
          {
            path: 'timeline',
            name: 'Dòng thời gian',
            component: () => import('@/pages/children/timeline.vue'),
          },
          {
            path: 'daily-times',
            name: 'Giới hạn hàng ngày',
            component: () => import('@/pages/children/DailyTimes.vue'),
          },
          {
            path: 'restricted-times',
            name: 'Giới hạn thời gian',
            component: () => import('@/pages/children/RestrictedTimes.vue'),
          },
          {
            path: 'web-filters',
            name: 'Kiểm soát duyệt web',
            component: () => import('@/pages/children/WebFilters.vue'),
          },
          {
            path: 'safe-zone-Management',
            name: 'Quản lý vùng',
            component: () => import('@/pages/children/SafeZoneManagement.vue'),
          },
          {
            path: 'game-apps',
            name: 'Trò chơi và ứng dụng',
            component: () => import('@/pages/children/GameApps.vue'),
          },
          {
            path: 'youtube',
            name: 'Youtube',
            component: () => import('@/pages/children/YoutubeRules.vue'),
          },
          {
            path: 'emergency',
            name: 'Khẩn cấp',
            component: () => import('@/pages/children/EmergencyRules.vue'),
          },
          {
            path: 'education',
            name: 'Thông tin giáo dục',
            component: () => import('@/pages/children/EducationInfo.vue'),
          },
          {
            path: 'quiz-ai',
            name: 'Câu hỏi mỗi ngày',
            component: () => import('@/pages/children/QuizAI.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Not Found',
    component: () => import('@/layouts/error.vue'),
  },
  {
    name: 'Tự động Đăng nhập',
    path: '/auto-login',
    component: () => import('@/pages/auto-login/index.vue'),
  },
];

export default routes;
