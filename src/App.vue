<script setup>
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <div class="app-shell">
    <AppNavbar />
    <main class="main-content">
      <RouterView />
    </main>
    <footer class="site-footer border-top">
      <div class="container py-4">
        <div class="row gy-3 align-items-center">
          <div class="col-md-5">
            <strong>Riverside Migrant Health Charity</strong>
            <p class="mb-0 text-secondary">Low-cost health education and support for migrant communities.</p>
          </div>
          <div class="col-md-4 text-md-center">
            <a href="mailto:hello@neighbourhub.org.au">hello@neighbourhub.org.au</a>
            <span class="mx-2 text-secondary">|</span>
            <a href="tel:+61390001234">03 9000 1234</a>
          </div>
          <div class="col-md-3 text-md-end text-secondary">
            Accessible venues and multilingual support.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
