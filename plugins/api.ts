export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const $api = $fetch.create({
    baseURL: `${config.public.appURL}/api`,
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

  await $api('/sanctum/csrf-cookie', { baseURL: config.public.appURL })
  // Expose to useNuxtApp().$api
  return {
    provide: {
      api: $api,
    },
  }
})
