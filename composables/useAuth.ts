import type { LoginPayload, RegisterPayload, User } from '@/types'

const user = ref<User | null>(null);
export const useAuth = () => {
  async function getUser(): Promise<User | null> {
    if (user.value) return user.value
    try {
      const { data } = await useAPI<User>('/user')
      if (!data.value) return null
      return {
        ...data.value,
        created_at: new Date(data.value.created_at),
        updated_at: new Date(data.value.updated_at),
        email_verified_at: data.value.email_verified_at
          ? new Date(data.value.email_verified_at)
          : undefined,
        two_factor_confirmed_at: data.value.two_factor_confirmed_at
          ? new Date(data.value.two_factor_confirmed_at)
          : undefined,
      }
    } catch (err) {
      return null
    }
  }

  async function initUser() {
    user.value = await getUser();
  }

  async function login(payload: LoginPayload) {
    const res = await useAPI('/login', { method: 'POST', body: payload })
    useRouter().push('/me')
    return res
  }

  async function logout() {
    await useAPI('/logout', { method: 'POST' })
    useRouter().replace('/login')
  }

  async function register(payload: RegisterPayload) {
    const res = await useAPI('/register', { method: 'POST', body: payload })
    if (!res.error.value) {
      await login({
        email: payload.email,
        password: payload.password
      })
    }
    return res
  }

  return { login, logout, register, initUser, user }
}