import type { User } from '@/types'

export const useAuth = () => {
  interface LoginPayload {
    email: string
    password: string
  }

  const user = ref<User | null>(null);
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
    await useAPI('/login', { method: 'POST', body: payload })
    useRouter().push('/me')
  }

  async function logout() {
    await useAPI('/logout', { method: 'POST' })
    useRouter().replace('/login')
  }

  interface RegisterPayload {
    name: string
    email: string
    password: string
    password_confirmation: string
  }

  async function register(payload: RegisterPayload) {
    await useAPI('/register', { method: 'POST', body: payload })
    await login({
      email: payload.email,
      password: payload.password
    })
  }

  return { login, logout, register, initUser, user }
}