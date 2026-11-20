/**
 * BOOK LENDING SYSTEM - VUE ROUTER CONFIGURATION
 */

import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../pages/Cart.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../pages/Profile.vue')
  },
  {
    path: '/admin/books',
    name: 'BookManagement',
    component: () => import('../pages/BookManagement.vue')
  },
  {
    path: '/admin/borrows',
    name: 'BorrowManagement',
    component: () => import('../pages/BorrowManagement.vue')
  },
  {
    path: '/admin/readers',
    name: 'ReaderManagement',
    component: () => import('../pages/ReaderManagement.vue')
  },
  {
    path: '/admin/staff',
    name: 'StaffManagement',
    component: () => import('../pages/ReaderManagement.vue')
  },
  {
    path: '/admin/fine-ticket',
    name: 'FineTicket',
    component: () => import('../pages/FineTicket.vue')
  },
  {
    path: '/admin/fines',
    name: 'FineTicketList',
    component: () => import('../pages/FineTicket.vue')
  },
  {
    path: '/fine-ticket',
    redirect: '/admin/fine-ticket'
  },
  {
    path: '/phieuphat',
    redirect: '/admin/fine-ticket'
  },
  {
    path: '/book/:id',
    name: 'DetailCard',
    component: () => import('../pages/DetailCard.vue')
  },
  {
    path: '/detail_card',
    redirect: '/book/CS-0102'
  },
  {
    path: '/detail_card/:id',
    redirect: to => `/book/${to.params.id}`
  },
  {
    path: '/detail-card/:id',
    redirect: to => `/book/${to.params.id}`
  },
  {
    path: '/detail/:id',
    redirect: to => `/book/${to.params.id}`
  },
  {
    path: '/chitietsach/:id',
    redirect: to => `/book/${to.params.id}`
  },
  // English & Vietnamese friendly route aliases
  { path: '/trangchu', redirect: '/home' },
  { path: '/dangnhap', redirect: '/login' },
  { path: '/dangky', redirect: '/register' },
  { path: '/giohang', redirect: '/cart' },
  { path: '/trangcanhan', redirect: '/profile' },
  { path: '/quanlysach', redirect: '/admin/books' },
  { path: '/quanlymuontra', redirect: '/admin/borrows' },
  { path: '/quanlydocgia', redirect: '/admin/readers' },
  { path: '/quanlynhansu', redirect: '/admin/staff' },
  { path: '/staff-management', redirect: '/admin/staff' },
  { path: '/book-management', redirect: '/admin/books' },
  { path: '/borrow-management', redirect: '/admin/borrows' },
  { path: '/reader-management', redirect: '/admin/readers' },
  { path: '/admin', redirect: '/admin/books' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;
