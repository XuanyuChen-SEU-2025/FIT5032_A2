<script setup>
import { computed } from 'vue'
import { getActiveBookingTotal } from '../services/bookingService'
import { getEvents } from '../services/eventService'
import { getOverallAverageRating } from '../services/ratingService'
import { readUsers } from '../services/storageService'

const stats = computed(() => {
  const overall = getOverallAverageRating()
  return [
    { label: 'Total users', value: readUsers().length },
    { label: 'Total events', value: getEvents().length },
    { label: 'Active bookings', value: getActiveBookingTotal() },
    { label: 'Average rating', value: overall === null ? 'No ratings yet' : overall.toFixed(1) },
  ]
})
</script>

<template>
  <section class="container py-5">
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <div>
        <h1 class="h2 mb-1">Admin Dashboard</h1>
        <p class="text-secondary mb-0">Simple overview calculated from local application data.</p>
      </div>
      <RouterLink class="btn btn-primary" to="/admin/events">Manage Events</RouterLink>
    </div>
    <div class="row g-4">
      <div v-for="stat in stats" :key="stat.label" class="col-sm-6 col-xl-3">
        <div class="stat-tile h-100">
          <p class="text-secondary mb-2">{{ stat.label }}</p>
          <p class="h3 mb-0">{{ stat.value }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
