<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, logout } from '../services/authService'

const router = useRouter()
const currentUser = ref(getCurrentUser())

function refreshUser() {
  currentUser.value = getCurrentUser()
}

function handleLogout() {
  logout()
  currentUser.value = null
  router.push({ name: 'home' })
}

onMounted(() => {
  window.addEventListener('auth-changed', refreshUser)
  window.addEventListener('storage', refreshUser)
})

onUnmounted(() => {
  window.removeEventListener('auth-changed', refreshUser)
  window.removeEventListener('storage', refreshUser)
})
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top" aria-label="Main navigation">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">NeighbourHub</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavigation"
        aria-controls="mainNavigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="mainNavigation" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li class="nav-item"><RouterLink class="nav-link" to="/">Home</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/events">Events</RouterLink></li>
          <template v-if="!currentUser">
            <li class="nav-item"><RouterLink class="nav-link" to="/login">Login</RouterLink></li>
            <li class="nav-item"><RouterLink class="btn btn-outline-primary ms-lg-2" to="/register">Register</RouterLink></li>
          </template>
          <template v-else-if="currentUser.role === 'admin'">
            <li class="nav-item"><RouterLink class="nav-link" to="/admin">Admin Dashboard</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/admin/events">Manage Events</RouterLink></li>
            <li class="nav-item">
              <button class="btn btn-outline-secondary ms-lg-2" type="button" @click="handleLogout">Logout</button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item"><RouterLink class="nav-link" to="/my-bookings">My Bookings</RouterLink></li>
            <li class="nav-item">
              <button class="btn btn-outline-secondary ms-lg-2" type="button" @click="handleLogout">Logout</button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>
