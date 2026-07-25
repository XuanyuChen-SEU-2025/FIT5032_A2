<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RatingWidget from '../components/RatingWidget.vue'
import { createBooking } from '../services/bookingService'
import { getCurrentUser } from '../services/authService'
import { getEventById } from '../services/eventService'

const route = useRoute()
const router = useRouter()
const event = ref(getEventById(route.params.id))
const message = ref('')
const currentUser = computed(() => getCurrentUser())

function refreshEvent() {
  event.value = getEventById(route.params.id)
}

function bookEvent() {
  if (!currentUser.value) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  const result = createBooking(event.value.id)
  message.value = result.message || (result.ok ? 'Booking confirmed.' : 'Booking could not be completed.')
  refreshEvent()
}
</script>

<template>
  <section class="container py-5">
    <div v-if="!event" class="alert alert-warning">
      Event was not found.
      <RouterLink to="/events">Back to events</RouterLink>
    </div>

    <article v-else>
      <div class="mb-4">
        <RouterLink to="/events" class="btn btn-outline-secondary btn-sm">Back to Events</RouterLink>
      </div>
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge badge-health">{{ event.category }}</span>
                <span class="badge text-bg-light border">{{ event.language }}</span>
              </div>
              <h1 class="h2">{{ event.title }}</h1>
              <p class="lead text-secondary">{{ event.description }}</p>
              <dl class="row">
                <dt class="col-sm-4">Date</dt>
                <dd class="col-sm-8">{{ event.date }}</dd>
                <dt class="col-sm-4">Time</dt>
                <dd class="col-sm-8">{{ event.time }}</dd>
                <dt class="col-sm-4">Location</dt>
                <dd class="col-sm-8">{{ event.location }}</dd>
                <dt class="col-sm-4">Facilitator</dt>
                <dd class="col-sm-8">{{ event.facilitator }}</dd>
                <dt class="col-sm-4">Capacity</dt>
                <dd class="col-sm-8">{{ event.capacity }}</dd>
                <dt class="col-sm-4">Available places</dt>
                <dd class="col-sm-8">{{ event.availablePlaces }}</dd>
                <dt class="col-sm-4">Accessibility</dt>
                <dd class="col-sm-8">{{ event.accessibilityInfo }}</dd>
                <dt class="col-sm-4">Ratings</dt>
                <dd class="col-sm-8">{{ event.ratingLabel }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <aside class="col-lg-4">
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <h2 class="h5">Book this event</h2>
              <p class="text-secondary">{{ event.availablePlaces }} places currently available.</p>
              <button
                class="btn btn-primary w-100"
                type="button"
                :disabled="event.isPast || event.availablePlaces === 0"
                @click="bookEvent"
              >
                Book Event
              </button>
              <p v-if="event.isPast" class="text-secondary small mt-2 mb-0">This event has already ended.</p>
              <p v-else-if="event.availablePlaces === 0" class="text-secondary small mt-2 mb-0">This event is fully booked.</p>
              <p v-else-if="!currentUser" class="text-secondary small mt-2 mb-0">Login is required before booking.</p>
              <p
                v-if="message"
                class="alert mt-3 mb-0"
                role="status"
                aria-live="polite"
                :class="message.includes('confirmed') ? 'alert-success' : 'alert-info'"
              >
                {{ message }}
              </p>
            </div>
          </div>
          <div class="card shadow-sm">
            <div class="card-body">
              <h2 class="h5">Rate this event</h2>
              <RatingWidget :event-id="event.id" @updated="refreshEvent" />
              <p v-if="!currentUser" class="text-secondary small mt-2 mb-0">Login is required before rating.</p>
            </div>
          </div>
        </aside>
      </div>
    </article>
  </section>
</template>
