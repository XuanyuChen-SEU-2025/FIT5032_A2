<script setup>
defineProps({
  event: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="card event-card shadow-sm">
    <div class="card-body">
      <div class="d-flex flex-wrap gap-2 mb-3">
        <span class="badge badge-health">{{ event.category }}</span>
        <span class="badge text-bg-light border">{{ event.language }}</span>
        <span v-if="event.isPast" class="badge text-bg-secondary">Ended</span>
        <span v-else-if="event.availablePlaces === 0" class="badge text-bg-danger">Full</span>
      </div>
      <h2 class="h5 card-title">{{ event.title }}</h2>
      <p class="card-text text-secondary">{{ event.description }}</p>
      <dl class="row small mb-3">
        <dt class="col-4">Date</dt>
        <dd class="col-8">{{ event.date }}</dd>
        <dt class="col-4">Time</dt>
        <dd class="col-8">{{ event.time }}</dd>
        <dt class="col-4">Place</dt>
        <dd class="col-8">{{ event.location }}</dd>
        <dt class="col-4">Available</dt>
        <dd class="col-8">{{ event.availablePlaces }} of {{ event.capacity }}</dd>
        <dt class="col-4">Rating</dt>
        <dd class="col-8">{{ event.ratingLabel }}</dd>
      </dl>
      <RouterLink class="btn btn-primary mt-auto" :to="{ name: 'event-details', params: { id: event.id } }">
        View Details
      </RouterLink>
    </div>
  </article>
</template>
