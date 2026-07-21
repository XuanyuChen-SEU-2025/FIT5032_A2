import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from '../services/authService'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/events', name: 'events', component: () => import('../views/EventsView.vue') },
  { path: '/events/:id', name: 'event-details', component: () => import('../views/EventDetailsView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
  {
    path: '/my-bookings',
    name: 'my-bookings',
    component: () => import('../views/MyBookingsView.vue'),
    meta: { requiresAuth: true, roles: ['user', 'admin'] },
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('../views/AdminDashboardView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/events',
    name: 'admin-events',
    component: () => import('../views/AdminEventsView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  { path: '/access-denied', name: 'access-denied', component: () => import('../views/AccessDeniedView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const user = getCurrentUser()
  if (to.meta.requiresAuth && !user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.roles && user && !to.meta.roles.includes(user.role)) {
    return { name: 'access-denied' }
  }
  if ((to.name === 'login' || to.name === 'register') && user) {
    return user.role === 'admin' ? { name: 'admin-dashboard' } : { name: 'events' }
  }
  return true
})

export default router
