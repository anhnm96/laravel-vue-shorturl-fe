<script setup lang="ts">
definePageMeta({
  layout: "centered",
});

interface LoginPayload {
  email: string
  password: string
}

const form = ref({
  email: '',
  password: ''
})

async function login(payload: LoginPayload) {
  await useAPI('/login', { method: 'POST', body: payload })
  useRouter().push('/me')
}
</script>
<template>
  <div class="login" @submit.prevent="login(form)">
    <h1>Login</h1>
    <form>
      <label>
        <div>Email</div>
        <input type="text" v-model="form.email" />
      </label>

      <label>
        <div>Password</div>
        <input type="password" v-model="form.password" />
      </label>
      <button class="btn">Login</button>
    </form>

    <p>
      Don't have an account?
      <NuxtLink class="underline text-lime-600" to="/register">Register now!</NuxtLink>
    </p>
  </div>
</template>
