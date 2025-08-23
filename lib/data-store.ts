export interface MoodEntry {
  id: string
  userId: string
  mood: "happy" | "neutral" | "sad" | "stressed" | "depressed"
  date: string
  timestamp: number
  notes?: string
}

export interface Appointment {
  id: string
  code: string
  patientId: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  type: "vr" | "in-person"
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  specialty: string
}

export interface HealthTokens {
  userId: string
  balance: number
  transactions: {
    id: string
    type: "earned" | "spent"
    amount: number
    reason: string
    timestamp: number
  }[]
}

export interface AIAlert {
  id: string
  userId: string
  type: "mood_decline" | "health_risk" | "medication_reminder"
  message: string
  severity: "low" | "medium" | "high"
  timestamp: number
  dismissed: boolean
  actionTaken?: string
}

// Utility functions for data management
export const generateUniqueId = (prefix = ""): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5).toUpperCase()
  return `${prefix}${timestamp}-${random}`
}

export const generateAppointmentCode = (): string => {
  return `APPT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
}

export const generateBlockchainId = (type: "patient" | "doctor" | "admin"): string => {
  const prefix = type === "patient" ? "P" : type === "doctor" ? "D" : "A"
  return `${prefix}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
}

// Data store functions
export const saveMoodEntry = (entry: MoodEntry): void => {
  const existing = getMoodEntries(entry.userId)
  const updated = [...existing, entry]
  localStorage.setItem(`mood_entries_${entry.userId}`, JSON.stringify(updated))
}

export const getMoodEntries = (userId: string): MoodEntry[] => {
  const stored = localStorage.getItem(`mood_entries_${userId}`)
  return stored ? JSON.parse(stored) : []
}

export const saveAppointment = (appointment: Appointment): void => {
  const existing = getAppointments(appointment.patientId)
  const updated = [...existing, appointment]
  localStorage.setItem(`appointments_${appointment.patientId}`, JSON.stringify(updated))
}

export const getAppointments = (userId: string): Appointment[] => {
  const stored = localStorage.getItem(`appointments_${userId}`)
  return stored ? JSON.parse(stored) : []
}

export const saveHealthTokens = (tokens: HealthTokens): void => {
  localStorage.setItem(`health_tokens_${tokens.userId}`, JSON.stringify(tokens))
}

export const getHealthTokens = (userId: string): HealthTokens => {
  const stored = localStorage.getItem(`health_tokens_${userId}`)
  return stored ? JSON.parse(stored) : { userId, balance: 0, transactions: [] }
}

export const addHealthTokens = (userId: string, amount: number, reason: string): void => {
  const tokens = getHealthTokens(userId)
  tokens.balance += amount
  tokens.transactions.push({
    id: generateUniqueId("TXN-"),
    type: "earned",
    amount,
    reason,
    timestamp: Date.now(),
  })
  saveHealthTokens(tokens)
}

export const saveAIAlert = (alert: AIAlert): void => {
  const existing = getAIAlerts(alert.userId)
  const updated = [...existing, alert]
  localStorage.setItem(`ai_alerts_${alert.userId}`, JSON.stringify(updated))
}

export const getAIAlerts = (userId: string): AIAlert[] => {
  const stored = localStorage.getItem(`ai_alerts_${userId}`)
  return stored ? JSON.parse(stored) : []
}

export const dismissAIAlert = (userId: string, alertId: string, actionTaken?: string): void => {
  const alerts = getAIAlerts(userId)
  const updated = alerts.map((alert) => (alert.id === alertId ? { ...alert, dismissed: true, actionTaken } : alert))
  localStorage.setItem(`ai_alerts_${userId}`, JSON.stringify(updated))
}

// Generic data store functions for family support dashboard
export const getStoredData = (key: string): any => {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : null
}

export const storeData = (key: string, data: any): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

// AI/ML simulation functions
export const analyzeMoodTrend = (
  entries: MoodEntry[],
): {
  trend: "improving" | "declining" | "stable"
  riskLevel: "low" | "medium" | "high"
  shouldAlert: boolean
} => {
  if (entries.length < 3) return { trend: "stable", riskLevel: "low", shouldAlert: false }

  const recent = entries.slice(-7) // Last 7 entries
  const moodValues = recent.map((entry) => {
    switch (entry.mood) {
      case "happy":
        return 5
      case "neutral":
        return 3
      case "sad":
        return 2
      case "stressed":
        return 2
      case "depressed":
        return 1
      default:
        return 3
    }
  })

  const average = moodValues.reduce((a, b) => a + b, 0) / moodValues.length
  const recentThree = moodValues.slice(-3)
  const badMoodsInRow = recentThree.filter((mood) => mood <= 2).length

  const trend = average > 3.5 ? "improving" : average < 2.5 ? "declining" : "stable"
  const riskLevel = badMoodsInRow >= 3 ? "high" : average < 2.5 ? "medium" : "low"
  const shouldAlert = badMoodsInRow >= 3 || (trend === "declining" && riskLevel === "high")

  return { trend, riskLevel, shouldAlert }
}

export const generateTherapySuggestions = (moodEntries: MoodEntry[]): string[] => {
  const analysis = analyzeMoodTrend(moodEntries)
  const suggestions = []

  if (analysis.riskLevel === "high") {
    suggestions.push("Consider scheduling a VR therapy session with a mental health professional")
    suggestions.push("Try our guided meditation program - 10 minutes daily can improve mood by 25%")
    suggestions.push("Join our peer support group for community connection")
  } else if (analysis.riskLevel === "medium") {
    suggestions.push("Practice deep breathing exercises for 5 minutes when feeling stressed")
    suggestions.push("Take a 15-minute walk outdoors to boost endorphins")
    suggestions.push("Try journaling your thoughts to process emotions")
  } else {
    suggestions.push("Keep up the great work! Your mood is stable and positive")
    suggestions.push("Consider sharing your wellness strategies with others in our community")
    suggestions.push("Explore our advanced wellness features for continued growth")
  }

  return suggestions
}

export const predictMoodForecast = (
  entries: MoodEntry[],
): {
  prediction: "positive" | "neutral" | "concerning"
  confidence: number
  recommendations: string[]
} => {
  const analysis = analyzeMoodTrend(entries)

  if (analysis.trend === "improving") {
    return {
      prediction: "positive",
      confidence: 0.85,
      recommendations: ["Continue current wellness routine", "Consider increasing physical activity"],
    }
  } else if (analysis.trend === "declining") {
    return {
      prediction: "concerning",
      confidence: 0.78,
      recommendations: ["Schedule check-in with healthcare provider", "Increase self-care activities"],
    }
  } else {
    return {
      prediction: "neutral",
      confidence: 0.65,
      recommendations: ["Maintain current habits", "Consider trying new wellness activities"],
    }
  }
}
