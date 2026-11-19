/**
 * BOOK LENDING SYSTEM - APPLICATION ENTRY POINT (main.js)
 * Mounts Vue 3 App with Vite and Vue Router
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './js/router.js';
import { 
  ClientHeader, ClientFooter, AdminSidebar, AdminHeader, AdminFooter,
  getHeader, getFooter, getAuthHeader, getAdminSidebar, getAdminHeader, getAdminFooter 
} from './js/components.js';
import './js/common.js';

// Create Root Vue Application
const app = createApp(App);

// Expose layout generator functions globally
app.config.globalProperties.$getHeader = getHeader;
app.config.globalProperties.$getFooter = getFooter;
app.config.globalProperties.$getAuthHeader = getAuthHeader;
app.config.globalProperties.$getAdminSidebar = getAdminSidebar;
app.config.globalProperties.$getAdminHeader = getAdminHeader;
app.config.globalProperties.$getAdminFooter = getAdminFooter;

// Register Global Shared Components
app.component('client-header', ClientHeader);
app.component('client-footer', ClientFooter);
app.component('admin-sidebar', AdminSidebar);
app.component('admin-header', AdminHeader);
app.component('admin-footer', AdminFooter);

// Mount router and app
app.use(router);
app.mount('#app');

// Global SPA Router Link Delegate: ensures clicking any a[href^="#/"] (like Avatar, menu, buttons)
// instantly triggers Vue Router programmatic navigation smoothly without page refresh
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#/"]');
    if (link) {
      const href = link.getAttribute('href');
      const targetPath = href.replace(/^#/, '');
      if (targetPath) {
        if (router.currentRoute.value.path !== targetPath) {
          e.preventDefault();
          router.push(targetPath).catch(() => {
            window.location.hash = '#' + targetPath;
          });
        }
      }
    }
  });

  // Global listener for realtime header cart notification count (+1, -1, clear)
  window.addEventListener('cart-updated', (e) => {
    const count = e.detail && e.detail.count !== undefined ? e.detail.count : 0;
    const badge = document.getElementById('header-cart-badge');
    if (badge) {
      badge.textContent = String(count).padStart(2, '0');
    }
  });
}
