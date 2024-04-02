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
    onResponseError({ request, response }) {
      if (
        [401, 419].includes(response.status) &&
        !request.toString().endsWith("/api/user")
      ) {
        const { logout } = useAuth();
        logout();
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
