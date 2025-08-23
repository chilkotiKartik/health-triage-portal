import { generateBlockchainId, addHealthTokens } from "./data-store"

export type UserRole = "patient" | "doctor" | "admin"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
  blockchainId: string
  createdAt: string
  lastLogin: string
  verified: boolean
}

// Mock user data with blockchain IDs
const mockUsers: Record<string, { password: string; user: User }> = {
  "patient@demo.com": {
    password: "demo123",
    user: {
      id: "1",
      email: "patient@demo.com",
      firstName: "John",
      lastName: "Doe",
      role: "patient",
      blockchainId: "P-AX93F1",
      createdAt: "2024-01-15T10:30:00Z",
      lastLogin: new Date().toISOString(),
      verified: true,
    },
  },
  "doctor@demo.com": {
    password: "demo123",
    user: {
      id: "2",
      email: "doctor@demo.com",
      firstName: "Dr. Sarah",
      lastName: "Smith",
      role: "doctor",
      blockchainId: "D-BK47X2",
      createdAt: "2023-11-20T14:15:00Z",
      lastLogin: new Date().toISOString(),
      verified: true,
    },
  },
  "admin@demo.com": {
    password: "demo123",
    user: {
      id: "3",
      email: "admin@demo.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      blockchainId: "A-ZY89M3",
      createdAt: "2023-10-01T09:00:00Z",
      lastLogin: new Date().toISOString(),
      verified: true,
    },
  },
}

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = mockUsers[email.toLowerCase()]
    if (userData && userData.password === password) {
      userData.user.lastLogin = new Date().toISOString()

      const token = btoa(
        JSON.stringify({
          userId: userData.user.id,
          blockchainId: userData.user.blockchainId,
          exp: Date.now() + 24 * 60 * 60 * 1000,
        }),
      )

      if (userData.user.role === "patient") {
        addHealthTokens(userData.user.id, 5, "Daily login bonus")
      }

      return { user: userData.user, token }
    }
    return null
  },

  async register(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: UserRole
  }): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      blockchainId: generateBlockchainId(userData.role),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      verified: false,
    }

    const token = btoa(
      JSON.stringify({
        userId: newUser.id,
        blockchainId: newUser.blockchainId,
        exp: Date.now() + 24 * 60 * 60 * 1000,
      }),
    )

    if (userData.role === "patient") {
      addHealthTokens(newUser.id, 100, "Welcome bonus - new account created")
    }

    return { user: newUser, token }
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_user")
    }
  },

  getCurrentUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("auth_user")
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  },

  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false

    try {
      const payload = JSON.parse(atob(token))
      return payload.exp > Date.now()
    } catch {
      return false
    }
  },
}
