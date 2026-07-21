<script setup>
import { nextTick, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormError from '../components/FormError.vue'
import { login } from '../services/authService'

const route = useRoute()
const router = useRouter()
const form = reactive({ email: '', password: '' })
const errors = ref({})
const errorSummary = ref(null)
const successMessage = route.query.registered ? 'Registration complete. You can now log in.' : ''
const submitting = ref(false)

async function submit() {
  submitting.value = true
  const result = await login(form)
  submitting.value = false
  if (!result.ok) {
    errors.value = result.errors
    await nextTick()
    errorSummary.value?.focus()
    return
  }
  const redirect = route.query.redirect
  if (redirect) {
    router.push(String(redirect))
  } else {
    router.push(result.user.role === 'admin' ? { name: 'admin-dashboard' } : { name: 'events' })
  }
}
</script>

<template>
  <section class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-6 col-xl-5">
        <h1 class="h2 mb-3">Login</h1>
        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
        <div
          v-if="Object.keys(errors).length"
          ref="errorSummary"
          tabindex="-1"
          class="alert alert-danger"
        >
          {{ errors.credentials || 'Please correct the highlighted fields.' }}
        </div>
        <form class="card shadow-sm" novalidate @submit.prevent="submit">
          <div class="card-body">
            <div class="mb-3">
              <label for="loginEmail" class="form-label">Email</label>
              <input id="loginEmail" v-model="form.email" class="form-control" maxlength="254" autocomplete="email" />
              <FormError :message="errors.email" />
            </div>
            <div class="mb-4">
              <label for="loginPassword" class="form-label">Password</label>
              <input id="loginPassword" v-model="form.password" class="form-control" type="password" autocomplete="current-password" />
              <FormError :message="errors.password" />
            </div>
            <button class="btn btn-primary w-100" type="submit" :disabled="submitting">
              {{ submitting ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
