<script setup>
import { computed, ref } from 'vue'
import EventCard from '../components/EventCard.vue'
import { eventCategories, eventLanguages } from '../data/seedEvents'
import { getEvents } from '../services/eventService'

const keyword = ref('')
const category = ref('')
const language = ref('')
const availability = ref('')
const events = computed(() => getEvents())

const filteredEvents = computed(() => {
  const term = keyword.value.trim().toLowerCase()
  return events.value.filter((event) => {
    const matchesKeyword =
      !term ||
      [event.title, event.description, event.location, event.facilitator].some((field) =>
        field.toLowerCase().includes(term),
      )
    const matchesCategory = !category.value || event.category === category.value
    const matchesLanguage = !language.value || event.language === language.value
    const matchesAvailability =
      !availability.value ||
      (availability.value === 'available' && event.availablePlaces > 0) ||
      (availability.value === 'full' && event.availablePlaces === 0)
    return matchesKeyword && matchesCategory && matchesLanguage && matchesAvailability
  })
})
</script>

<template>
  <section class="container py-5">
    <div class="mb-4">
      <h1 class="h2">Browse Events</h1>
      <p class="text-secondary mb-0">Search and filter migrant community health workshops.</p>
    </div>

    <form class="row g-3 mb-4" @submit.prevent>
      <div class="col-md-6 col-xl-4">
        <label for="keyword" class="form-label">Keyword search</label>
        <input id="keyword" v-model="keyword" class="form-control" type="search" maxlength="80" />
      </div>
      <div class="col-md-6 col-xl-3">
        <label for="category" class="form-label">Category</label>
        <select id="category" v-model="category" class="form-select">
          <option value="">All categories</option>
          <option v-for="item in eventCategories" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>
      <div class="col-md-6 col-xl-3">
        <label for="language" class="form-label">Language</label>
        <select id="language" v-model="language" class="form-select">
          <option value="">All languages</option>
          <option v-for="item in eventLanguages" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>
      <div class="col-md-6 col-xl-2">
        <label for="availability" class="form-label">Availability</label>
        <select id="availability" v-model="availability" class="form-select">
          <option value="">Any</option>
          <option value="available">Available</option>
          <option value="full">Full</option>
        </select>
      </div>
    </form>

    <p class="text-secondary">{{ filteredEvents.length }} event{{ filteredEvents.length === 1 ? '' : 's' }} found.</p>
    <div class="row g-4">
      <div v-for="event in filteredEvents" :key="event.id" class="col-md-6 col-xl-4">
        <EventCard :event="event" />
      </div>
    </div>
    <div v-if="!filteredEvents.length" class="alert alert-info mt-4">
      No events match the selected filters.
    </div>
  </section>
</template>
