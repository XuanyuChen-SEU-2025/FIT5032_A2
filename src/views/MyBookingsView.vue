<script setup>
import { computed, ref } from 'vue'
import { cancelBooking, getBookingsForCurrentUser } from '../services/bookingService'

const refreshKey = ref(0)
const message = ref('')
const bookings = computed(() => {
  refreshKey.value
  return getBookingsForCurrentUser()
})

function cancel(id) {
  const result = cancelBooking(id)
  message.value = result.ok ? 'Booking cancelled.' : result.message
  refreshKey.value += 1
}
</script>

<template>
  <section class="container py-5">
    <h1 class="h2">My Bookings</h1>
    <p class="text-secondary">Your current and cancelled health workshop bookings.</p>
    <div v-if="message" class="alert alert-info">{{ message }}</div>

    <div v-if="!bookings.length" class="alert alert-info">
      You do not have any bookings yet.
    </div>
    <div v-else class="row g-4">
      <div v-for="booking in bookings" :key="booking.id" class="col-lg-6">
        <article class="card shadow-sm h-100">
          <div class="card-body">
            <h2 class="h5">{{ booking.event?.title || 'Deleted event' }}</h2>
            <dl class="row small mb-3">
              <dt class="col-4">Date</dt>
              <dd class="col-8">{{ booking.event?.date || 'Unavailable' }}</dd>
              <dt class="col-4">Time</dt>
              <dd class="col-8">{{ booking.event?.time || 'Unavailable' }}</dd>
              <dt class="col-4">Location</dt>
              <dd class="col-8">{{ booking.event?.location || 'Unavailable' }}</dd>
              <dt class="col-4">Booked</dt>
              <dd class="col-8">{{ new Date(booking.createdAt).toLocaleString() }}</dd>
              <dt class="col-4">Status</dt>
              <dd class="col-8 text-capitalize">{{ booking.status }}</dd>
            </dl>
            <button
              class="btn btn-outline-danger"
              type="button"
              :disabled="booking.status !== 'active'"
              @click="cancel(booking.id)"
            >
              Cancel Booking
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
