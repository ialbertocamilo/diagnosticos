import { LocalStorage } from 'quasar';

const routes = [


  {
    path: '/',
    name: '',
    component: () => import('pages/paymentform.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/login.vue')
  },
  {
    path: '/diagnosticos',
    component: () => import('pages/listDiag.vue')
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/dashboard',
        component: () => import('pages/dashboard.vue')
      },
      { path: '/adjuntarResultados', component: () => import('pages/cargarRadios.vue') },
      { path: '/personas', component: () => import('pages/attachData.vue') },
      { path: '/configuration', component: () => import('pages/configuration.vue') },

      { path: '/change-password', component: () => import('pages/change_password.vue') },
      { path: '/users', component: () => import('pages/users.vue') }
    ],
    beforeEnter: (to, from, next) => {
      if (LocalStorage.getItem('token') == null) {
        next('/login');
      }
      next();
    }
  }

];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  });
}

export default routes;
