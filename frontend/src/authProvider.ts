import { type AuthBindings } from "@refinedev/core"

interface User {
  username: string
  password: string
}

const STORAGE_KEY = "assisthub-dev"
const users: User[] = []

export const authProvider: AuthBindings = {
  login: async ({ username, email, password }) => {
    if (users.find((user) => user.username === (username ?? email) && user.password === password)) {
      localStorage.setItem(STORAGE_KEY, (username ?? email) as string)
      return {
        success: true,
        redirectTo: "/",
      }
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    }
  },
  register: async ({ username, email, password }) => {
    if ((username || email) && password) {
      users.push({
        username: (username ?? email) as string,
        password: password as string,
      })

      return {
        success: true,
        redirectTo: "/login",
      }
    }

    return {
      success: false,
      error: {
        name: "RegisterError",
        message: "Invalid username or password",
      },
    }
  },
  logout: async () => {
    localStorage.removeItem(STORAGE_KEY)
    return {
      success: true,
      redirectTo: "/login",
    }
  },
  check: async () => {
    const token = localStorage.getItem(STORAGE_KEY)
    if (token) {
      return {
        authenticated: true,
      }
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    }
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(STORAGE_KEY)
    if (token) {
      return {
        id: 1,
        name: "John Doe",
        avatar: "https://i.pravatar.cc/300",
      }
    }
    return null
  },
  onError: async (error) => {
    console.error(error)
    return { error }
  },
}
