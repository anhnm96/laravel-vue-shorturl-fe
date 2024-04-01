export const useAuth = () => {
  interface LoginPayload {
    email: string
    password: string
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

  return { login, logout, register }
}