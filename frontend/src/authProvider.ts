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

    return Promise.resolve({
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    })
  },
  register: async ({ username, email, password }) => {
    if ((username || email) && password) {
      users.push({
        username: (username ?? email) as string,
        password: password as string,
      })

      return Promise.resolve({
        success: true,
        redirectTo: "/login",
      })
    }

    return Promise.resolve({
      success: false,
      error: {
        name: "RegisterError",
        message: "Invalid username or password",
      },
    })
  },
  logout: async () => {
    localStorage.removeItem(STORAGE_KEY)
    return Promise.resolve({
      success: true,
      redirectTo: "/login",
    })
  },
  check: async () => {
    const token = localStorage.getItem(STORAGE_KEY)
    if (token) {
      return Promise.resolve({
        authenticated: true,
      })
    }

    return Promise.resolve({
      authenticated: false,
      redirectTo: "/login",
    })
  },
  getPermissions: async () => Promise.resolve(null),
  getIdentity: async () => {
    const token = localStorage.getItem(STORAGE_KEY)
    if (token) {
      return Promise.resolve({
        id: 1,
        name: "John Doe",
        avatar: "https://i.pravatar.cc/300",
      })
    }
    return Promise.resolve(null)
  },
  onError: async (error) => {
    return Promise.resolve({
      logout: true,
      redirectTo: "/login",
      error: new Error(error as string),
    })
  },
}
