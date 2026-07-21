<script setup>
import { computed } from 'vue'
import EventCard from '../components/EventCard.vue'
import { getEvents } from '../services/eventService'

const featuredEvents = computed(() => getEvents().slice(0, 3))
const services = [
  'Mental health information',
  'Nutrition workshops',
  'Women health seminars',
  'Vaccination information',
  'Caregiver support',
  'Community screening appointments',
]
</script>

<template>
  <section class="hero-band">
    <div class="container py-5">
      <div class="row align-items-center gy-4">
        <div class="col-lg-7">
          <p class="text-uppercase fw-semibold text-secondary mb-2">Riverside Migrant Health Charity</p>
          <h1 class="display-5 fw-bold">NeighbourHub</h1>
          <p class="lead">
            A community health workshop and support platform for migrant communities seeking practical,
            low-cost and culturally aware health education.
          </p>
          <RouterLink class="btn btn-primary btn-lg" to="/events">Browse Events</RouterLink>
        </div>
        <div class="col-lg-5">
          <div class="p-4 bg-white border rounded-3">
            <h2 class="h5">Support Focus</h2>
            <p class="mb-0 text-secondary">
              Workshops are designed around language access, safe venues, prevention, wellbeing and practical
              navigation of Australian health services.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="container py-5">
    <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
      <div>
        <h2 class="h3 mb-1">Featured Health Workshops</h2>
        <p class="text-secondary mb-0">Upcoming support sessions loaded from dynamic event data.</p>
      </div>
      <RouterLink class="btn btn-outline-primary" to="/events">All Events</RouterLink>
    </div>
    <div class="row g-4">
      <div v-for="event in featuredEvents" :key="event.id" class="col-md-6 col-xl-4">
        <EventCard :event="event" />
      </div>
    </div>
  </section>

  <section class="container pb-5">
    <h2 class="h3 mb-4">Main Health Service Categories</h2>
    <div class="row g-3">
      <div v-for="service in services" :key="service" class="col-sm-6 col-lg-4">
        <div class="stat-tile h-100">{{ service }}</div>
      </div>
    </div>
  </section>
</template>
