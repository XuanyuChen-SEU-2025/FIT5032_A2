<script setup>
import { nextTick, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormError from '../components/FormError.vue'
import { register } from '../services/authService'

const router = useRouter()
const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const errors = ref({})
const errorSummary = ref(null)
const submitting = ref(false)

async function submit() {
  submitting.value = true
  const result = await register(form)
  submitting.value = false
  if (!result.ok) {
    errors.value = result.errors
    await nextTick()
    errorSummary.value?.focus()
    return
  }
  router.push({ name: 'login', query: { registered: '1' } })
}
</script>

<template>
  <section class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-7 col-xl-6">
        <h1 class="h2 mb-3">Register</h1>
        <div
          v-if="Object.keys(errors).length"
          ref="errorSummary"
          tabindex="-1"
          class="alert alert-danger"
        >
          Please correct the highlighted fields.
        </div>
        <form class="card shadow-sm" novalidate @submit.prevent="submit">
          <div class="card-body">
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input id="name" v-model="form.name" class="form-control" maxlength="80" autocomplete="name" />
              <FormError :message="errors.name" />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input id="email" v-model="form.email" class="form-control" maxlength="254" autocomplete="email" />
              <FormError :message="errors.email" />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input id="password" v-model="form.password" class="form-control" type="password" autocomplete="new-password" />
              <FormError :message="errors.password" />
            </div>
            <div class="mb-4">
              <label for="confirmPassword" class="form-label">Confirm password</label>
              <input id="confirmPassword" v-model="form.confirmPassword" class="form-control" type="password" autocomplete="new-password" />
              <FormError :message="errors.confirmPassword" />
            </div>
            <button class="btn btn-primary w-100" type="submit" :disabled="submitting">
              {{ submitting ? 'Creating account...' : 'Create account' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
