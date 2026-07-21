<script setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <p v-if="message" class="invalid-feedback d-block mb-0">{{ message }}</p>
</template>
