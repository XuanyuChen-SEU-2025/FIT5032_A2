<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser } from '../services/authService'
import { getRatingSummary, getUserRating, saveRating } from '../services/ratingService'

const props = defineProps({
  eventId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['updated'])
const router = useRouter()
const selected = ref(getUserRating(props.eventId)?.score ?? 0)
const message = ref('')
const summary = ref(getRatingSummary(props.eventId))
const currentUser = computed(() => getCurrentUser())

watch(
  () => props.eventId,
  () => {
    selected.value = getUserRating(props.eventId)?.score ?? 0
    summary.value = getRatingSummary(props.eventId)
  },
)

function submitRating(score) {
  if (!currentUser.value) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }
  const result = saveRating(props.eventId, score)
  message.value = result.message
  if (result.ok) {
    selected.value = score
    summary.value = getRatingSummary(props.eventId)
    emit('updated')
  }
}
</script>

<template>
  <div>
    <p class="mb-2">
      <strong>Average rating:</strong>
      <span>{{ summary.label }}</span>
    </p>
    <div class="d-flex flex-wrap gap-2" role="group" aria-label="Choose rating from 1 to 5">
      <button
        v-for="score in 5"
        :key="score"
        type="button"
        class="btn rating-button"
        :class="selected === score ? 'btn-primary' : 'btn-outline-primary'"
        :aria-pressed="selected === score"
        @click="submitRating(score)"
      >
        {{ score }}
      </button>
    </div>
    <p v-if="message" class="alert alert-info mt-3 mb-0" role="status" aria-live="polite">{{ message }}</p>
  </div>
</template>
