<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import FormError from '../components/FormError.vue'
import { eventCategories, eventLanguages } from '../data/seedEvents'
import { getAllBookingsForAdmin } from '../services/bookingService'
import { createEvent, deleteEvent, getEvents, updateEvent } from '../services/eventService'

const emptyForm = {
  title: '',
  description: '',
  category: eventCategories[0],
  language: eventLanguages[0],
  date: '',
  time: '',
  location: '',
  facilitator: '',
  capacity: 20,
  accessibilityInfo: '',
}

const form = reactive({ ...emptyForm })
const editingId = ref(null)
const errors = ref({})
const message = ref('')
const errorSummary = ref(null)
const refreshKey = ref(0)
const expandedBookings = ref('')

const events = computed(() => {
  refreshKey.value
  return getEvents()
})

const bookings = computed(() => {
  refreshKey.value
  return getAllBookingsForAdmin()
})

function resetForm() {
  Object.assign(form, emptyForm)
  editingId.value = null
  errors.value = {}
}

function editEvent(event) {
  Object.assign(form, {
    title: event.title,
    description: event.description,
    category: event.category,
    language: event.language,
    date: event.date,
    time: event.time,
    location: event.location,
    facilitator: event.facilitator,
    capacity: event.capacity,
    accessibilityInfo: event.accessibilityInfo,
  })
  editingId.value = event.id
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function submit() {
  const result = editingId.value ? updateEvent(editingId.value, form) : createEvent(form)
  if (!result.ok) {
    errors.value = result.errors
    await nextTick()
    errorSummary.value?.focus()
    return
  }
  message.value = editingId.value ? 'Event updated.' : 'Event created.'
  refreshKey.value += 1
  resetForm()
}

function removeEvent(event) {
  const confirmed = window.confirm(`Delete "${event.title}"? This also removes its bookings and ratings.`)
  if (!confirmed) return
  const result = deleteEvent(event.id)
  message.value = result.ok ? 'Event deleted.' : result.message
  refreshKey.value += 1
}

function eventBookings(eventId) {
  return bookings.value.filter((booking) => booking.eventId === eventId)
}
</script>

<template>
  <section class="container py-5">
    <h1 class="h2">Manage Events</h1>
    <p class="text-secondary">Create, edit, delete and inspect workshop bookings.</p>
    <div v-if="message" class="alert alert-success" role="status" aria-live="polite">{{ message }}</div>

    <form class="card shadow-sm mb-5" novalidate @submit.prevent="submit">
      <div class="card-body">
        <h2 class="h5">{{ editingId ? 'Edit event' : 'Create event' }}</h2>
        <div v-if="Object.keys(errors).length" ref="errorSummary" tabindex="-1" class="alert alert-danger">
          {{ errors.permission || errors.form || 'Please correct the highlighted fields.' }}
        </div>
        <div class="row g-3">
          <div class="col-md-6">
            <label for="eventTitle" class="form-label">Title</label>
            <input id="eventTitle" v-model="form.title" class="form-control" maxlength="100" />
            <FormError :message="errors.title" />
          </div>
          <div class="col-md-3">
            <label for="eventCategory" class="form-label">Category</label>
            <select id="eventCategory" v-model="form.category" class="form-select">
              <option v-for="item in eventCategories" :key="item" :value="item">{{ item }}</option>
            </select>
            <FormError :message="errors.category" />
          </div>
          <div class="col-md-3">
            <label for="eventLanguage" class="form-label">Language</label>
            <select id="eventLanguage" v-model="form.language" class="form-select">
              <option v-for="item in eventLanguages" :key="item" :value="item">{{ item }}</option>
            </select>
            <FormError :message="errors.language" />
          </div>
          <div class="col-12">
            <label for="eventDescription" class="form-label">Description</label>
            <textarea id="eventDescription" v-model="form.description" class="form-control" maxlength="700" rows="3"></textarea>
            <FormError :message="errors.description" />
          </div>
          <div class="col-sm-6 col-lg-3">
            <label for="eventDate" class="form-label">Date</label>
            <input id="eventDate" v-model="form.date" class="form-control" type="date" />
            <FormError :message="errors.date" />
          </div>
          <div class="col-sm-6 col-lg-3">
            <label for="eventTime" class="form-label">Time</label>
            <input id="eventTime" v-model="form.time" class="form-control" type="time" />
            <FormError :message="errors.time" />
          </div>
          <div class="col-sm-6 col-lg-3">
            <label for="eventCapacity" class="form-label">Capacity</label>
            <input id="eventCapacity" v-model.number="form.capacity" class="form-control" type="number" min="1" max="999" />
            <FormError :message="errors.capacity" />
          </div>
          <div class="col-sm-6 col-lg-3">
            <label for="eventFacilitator" class="form-label">Facilitator</label>
            <input id="eventFacilitator" v-model="form.facilitator" class="form-control" maxlength="80" />
            <FormError :message="errors.facilitator" />
          </div>
          <div class="col-md-6">
            <label for="eventLocation" class="form-label">Location</label>
            <input id="eventLocation" v-model="form.location" class="form-control" maxlength="120" />
            <FormError :message="errors.location" />
          </div>
          <div class="col-md-6">
            <label for="eventAccessibility" class="form-label">Accessibility information</label>
            <input id="eventAccessibility" v-model="form.accessibilityInfo" class="form-control" maxlength="300" />
            <FormError :message="errors.accessibilityInfo" />
          </div>
        </div>
        <div class="d-flex flex-wrap gap-2 mt-4">
          <button class="btn btn-primary" type="submit">{{ editingId ? 'Save Changes' : 'Create Event' }}</button>
          <button class="btn btn-outline-secondary" type="button" @click="resetForm">Clear</button>
        </div>
      </div>
    </form>

    <div class="admin-table-wrap">
      <table class="table table-hover align-middle admin-table bg-white">
        <caption class="text-secondary">Current events and booking counts</caption>
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Date</th>
            <th scope="col">Language</th>
            <th scope="col">Places</th>
            <th scope="col">Rating</th>
            <th scope="col">Bookings</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="event in events" :key="event.id">
            <tr>
              <td>{{ event.title }}</td>
              <td>{{ event.date }} {{ event.time }}</td>
              <td>{{ event.language }}</td>
              <td>{{ event.availablePlaces }} / {{ event.capacity }}</td>
              <td>{{ event.ratingLabel }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary" type="button" @click="expandedBookings = expandedBookings === event.id ? '' : event.id">
                  {{ eventBookings(event.id).length }} booking{{ eventBookings(event.id).length === 1 ? '' : 's' }}
                </button>
              </td>
              <td>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-secondary" type="button" @click="editEvent(event)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" type="button" @click="removeEvent(event)">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="expandedBookings === event.id">
              <td colspan="7" class="bg-light">
                <div v-if="!eventBookings(event.id).length" class="text-secondary">No bookings for this event.</div>
                <ul v-else class="mb-0">
                  <li v-for="booking in eventBookings(event.id)" :key="booking.id">
                    {{ booking.userId }} - {{ booking.status }} - {{ new Date(booking.createdAt).toLocaleString() }}
                  </li>
                </ul>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </section>
</template>
