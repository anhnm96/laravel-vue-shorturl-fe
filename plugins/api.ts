export default defineNuxtPlugin(async () => {
  const $api = $fetch.create({
    baseURL: 'http://localhost',
    // @ts-expect-error
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-XSRF-TOKEN': useCookie('XSRF-TOKEN').value,
      Cookie: useRequestHeader('cookie'),
    },
    credentials: 'include',
    // @ts-expect-error
    onResponseError({ response }) {
      if (response.status === 401) {
        return navigateTo('/login')
      }
    },
  })

  await $api('/sanctum/csrf-cookie')
  // Expose to useNuxtApp().$api
  return {
    provide: {
      api: $api,
    },
  }
})
