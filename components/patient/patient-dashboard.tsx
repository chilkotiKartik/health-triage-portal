"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Heart,
  Activity,
  Brain,
  Calendar,
  FileText,
  Bell,
  Settings,
  LogOut,
  Zap,
  TrendingUp,
  Shield,
  Video,
  Pill,
  Clock,
  AlertTriangle,
  CheckCircle,
  Smile,
  Meh,
  Frown,
  Phone,
  Coins,
  Users,
  TrendingDown,
  Camera,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Target,
  Award,
  Headphones,
  Eye,
  Gamepad2,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  type MoodEntry,
  type Appointment,
  type AIAlert,
  saveMoodEntry,
  getMoodEntries,
  saveAppointment,
  getAppointments,
  addHealthTokens,
  getHealthTokens,
  saveAIAlert,
  getAIAlerts,
  dismissAIAlert,
  generateUniqueId,
  generateAppointmentCode,
  analyzeMoodTrend,
  generateTherapySuggestions,
  predictMoodForecast,
} from "@/lib/data-store"

export function PatientDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const [currentMood, setCurrentMood] = useState<"happy" | "neutral" | "sad" | "stressed" | "depressed" | null>(null)
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [healthTokens, setHealthTokens] = useState({ balance: 0, transactions: [] })
  const [aiAlerts, setAiAlerts] = useState<AIAlert[]>([])
  const [showAIAlert, setShowAIAlert] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<AIAlert | null>(null)
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)
  const [moodNotes, setMoodNotes] = useState("")
  const [appointmentForm, setAppointmentForm] = useState({
    doctorName: "",
    specialty: "",
    date: "",
    time: "",
    type: "vr" as "vr" | "in-person",
  })

  const [isVRActive, setIsVRActive] = useState(false)
  const [isEmotionDetecting, setIsEmotionDetecting] = useState(false)
  const [showVRDialog, setShowVRDialog] = useState(false)
  const [showEmotionDialog, setShowEmotionDialog] = useState(false)
  const [vrSessionTime, setVrSessionTime] = useState(0)
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null)
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: 72,
    steps: 8432,
    sleepScore: 85,
    healthScore: 92,
    bloodPressure: "120/80",
    bloodOxygen: 98,
  })
  const [isLiveDemo, setIsLiveDemo] = useState(false)

  useEffect(() => {
    if (user?.id) {
      const entries = getMoodEntries(user.id)
      const userAppointments = getAppointments(user.id)
      const tokens = getHealthTokens(user.id)
      const alerts = getAIAlerts(user.id).filter((alert) => !alert.dismissed)

      setMoodEntries(entries)
      setAppointments(userAppointments)
      setHealthTokens(tokens)
      setAiAlerts(alerts)

      // Check for AI alerts
      if (alerts.length > 0) {
        setCurrentAlert(alerts[0])
        setShowAIAlert(true)
      }
    }
  }, [user?.id])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isVRActive) {
      interval = setInterval(() => {
        setVrSessionTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isVRActive])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLiveDemo) {
      interval = setInterval(() => {
        setHealthMetrics((prev) => ({
          ...prev,
          heartRate: Math.floor(Math.random() * 20) + 65, // 65-85 BPM
          steps: prev.steps + Math.floor(Math.random() * 50),
          bloodOxygen: Math.floor(Math.random() * 3) + 97, // 97-99%
        }))
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isLiveDemo])

  const handleMoodSubmit = () => {
    if (!currentMood || !user?.id) return

    const entry: MoodEntry = {
      id: generateUniqueId("MOOD-"),
      userId: user.id,
      mood: currentMood,
      date: new Date().toISOString().split("T")[0],
      timestamp: Date.now(),
      notes: moodNotes,
    }

    saveMoodEntry(entry)
    const updatedEntries = [...moodEntries, entry]
    setMoodEntries(updatedEntries)

    // Award tokens for mood tracking
    addHealthTokens(user.id, 10, "Daily mood check-in")
    setHealthTokens(getHealthTokens(user.id))

    // Check for AI alerts based on mood trend
    const analysis = analyzeMoodTrend(updatedEntries)
    if (analysis.shouldAlert) {
      const alert: AIAlert = {
        id: generateUniqueId("ALERT-"),
        userId: user.id,
        type: "mood_decline",
        message:
          "Our AI has detected a concerning pattern in your mood. We recommend speaking with a healthcare professional.",
        severity: analysis.riskLevel,
        timestamp: Date.now(),
        dismissed: false,
      }

      saveAIAlert(alert)
      setCurrentAlert(alert)
      setShowAIAlert(true)
    }

    setCurrentMood(null)
    setMoodNotes("")
  }

  const handleAppointmentBooking = () => {
    if (!user?.id || !appointmentForm.doctorName || !appointmentForm.date || !appointmentForm.time) return

    const appointment: Appointment = {
      id: generateUniqueId("APPT-"),
      code: generateAppointmentCode(),
      patientId: user.id,
      doctorId: generateUniqueId("DOC-"),
      doctorName: appointmentForm.doctorName,
      date: appointmentForm.date,
      time: appointmentForm.time,
      type: appointmentForm.type,
      status: "scheduled",
      specialty: appointmentForm.specialty,
    }

    saveAppointment(appointment)
    setAppointments([...appointments, appointment])

    // Award tokens for booking appointment
    addHealthTokens(user.id, 25, "Appointment booking")
    setHealthTokens(getHealthTokens(user.id))

    setShowAppointmentDialog(false)
    setAppointmentForm({
      doctorName: "",
      specialty: "",
      date: "",
      time: "",
      type: "vr",
    })
  }

  const handleScheduleAppointment = () => {
    setShowAppointmentDialog(true)
  }

  const handleStartVR = () => {
    setShowVRDialog(true)
  }

  const handleJoinVRSession = () => {
    setIsVRActive(true)
    setVrSessionTime(0)
    setShowVRDialog(false)
    if (user?.id) {
      addHealthTokens(user.id, 15, "VR session participation")
      setHealthTokens(getHealthTokens(user.id))
    }
  }

  const handleEndVRSession = () => {
    setIsVRActive(false)
    setVrSessionTime(0)
  }

  const handleSetReminder = () => {
    if (user?.id) {
      const reminder = {
        id: generateUniqueId("REMINDER-"),
        message: "Take your medication",
        time: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
      }
      // Save reminder logic would go here
      addHealthTokens(user.id, 5, "Setting health reminder")
      setHealthTokens(getHealthTokens(user.id))
      alert("Reminder set successfully! You'll be notified in 1 hour.")
    }
  }

  const handleEmotionDetection = () => {
    setIsEmotionDetecting(true)
    setShowEmotionDialog(true)

    // Simulate ML emotion detection
    setTimeout(() => {
      const emotions = ["happy", "calm", "focused", "energetic", "relaxed"]
      const detected = emotions[Math.floor(Math.random() * emotions.length)]
      setDetectedEmotion(detected)
      setIsEmotionDetecting(false)

      if (user?.id) {
        addHealthTokens(user.id, 20, "AI emotion analysis")
        setHealthTokens(getHealthTokens(user.id))
      }
    }, 3000)
  }

  const handleAIAlertAction = (action: "safe" | "help") => {
    if (!currentAlert || !user?.id) return

    if (action === "help") {
      // Auto-generate emergency appointment
      const emergencyAppointment: Appointment = {
        id: generateUniqueId("EMERGENCY-"),
        code: generateAppointmentCode(),
        patientId: user.id,
        doctorId: "DOC-EMERGENCY",
        doctorName: "Dr. Emergency Response",
        date: new Date().toISOString().split("T")[0],
        time: new Date(Date.now() + 60 * 60 * 1000).toTimeString().slice(0, 5), // 1 hour from now
        type: "vr",
        status: "confirmed",
        specialty: "Mental Health",
      }

      saveAppointment(emergencyAppointment)
      setAppointments([...appointments, emergencyAppointment])
    }

    dismissAIAlert(user.id, currentAlert.id, action)
    setShowAIAlert(false)
    setCurrentAlert(null)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const moodOptions = [
    { value: "happy", icon: Smile, label: "Great", color: "text-green-500" },
    { value: "neutral", icon: Meh, label: "Okay", color: "text-yellow-500" },
    { value: "sad", icon: Frown, label: "Sad", color: "text-orange-500" },
    { value: "stressed", icon: AlertTriangle, label: "Stressed", color: "text-red-500" },
    { value: "depressed", icon: TrendingDown, label: "Depressed", color: "text-red-700" },
  ]

  const moodStats = moodEntries.length > 0 ? analyzeMoodTrend(moodEntries) : null
  const therapySuggestions = moodEntries.length > 0 ? generateTherapySuggestions(moodEntries) : []
  const moodForecast = moodEntries.length > 0 ? predictMoodForecast(moodEntries) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Patient Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.firstName}!</p>
                <p className="text-xs text-blue-600">
                  ID: {user?.blockchainId || "P-" + user?.id?.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={isLiveDemo ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLiveDemo(!isLiveDemo)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isLiveDemo ? "Live Demo ON" : "Live Demo"}
              </Button>
              <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                <Coins className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">{healthTokens.balance}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
                {aiAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isVRActive && (
          <div className="mb-8">
            <Card className="border-l-4 border-l-purple-500 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900">VR Session Active</h3>
                      <p className="text-sm text-purple-800">
                        Session time: {Math.floor(vrSessionTime / 60)}:
                        {(vrSessionTime % 60).toString().padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleEndVRSession} variant="outline" className="border-purple-300 bg-transparent">
                    <Pause className="w-4 h-4 mr-2" />
                    End Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {moodStats && (
          <div className="mb-8">
            <Card
              className={`border-l-4 ${
                moodStats.riskLevel === "high"
                  ? "border-l-red-500 bg-red-50"
                  : moodStats.riskLevel === "medium"
                    ? "border-l-yellow-500 bg-yellow-50"
                    : "border-l-blue-500 bg-blue-50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      moodStats.riskLevel === "high"
                        ? "bg-red-100"
                        : moodStats.riskLevel === "medium"
                          ? "bg-yellow-100"
                          : "bg-blue-100"
                    }`}
                  >
                    <Brain
                      className={`w-5 h-5 ${
                        moodStats.riskLevel === "high"
                          ? "text-red-600"
                          : moodStats.riskLevel === "medium"
                            ? "text-yellow-600"
                            : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold mb-2 ${
                        moodStats.riskLevel === "high"
                          ? "text-red-900"
                          : moodStats.riskLevel === "medium"
                            ? "text-yellow-900"
                            : "text-blue-900"
                      }`}
                    >
                      AI Mood Analysis
                    </h3>
                    <p
                      className={`mb-3 ${
                        moodStats.riskLevel === "high"
                          ? "text-red-800"
                          : moodStats.riskLevel === "medium"
                            ? "text-yellow-800"
                            : "text-blue-800"
                      }`}
                    >
                      Your mood trend is {moodStats.trend}. Risk level: {moodStats.riskLevel}.
                      {moodForecast &&
                        ` AI predicts ${moodForecast.prediction} outlook with ${Math.round(moodForecast.confidence * 100)}% confidence.`}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className={
                          moodStats.riskLevel === "high"
                            ? "bg-red-600 hover:bg-red-700"
                            : moodStats.riskLevel === "medium"
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-blue-600 hover:bg-blue-700"
                        }
                      >
                        View Recommendations
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleEmotionDetection}>
                        <Camera className="w-4 h-4 mr-2" />
                        AI Emotion Scan
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={isLiveDemo ? "animate-pulse border-red-200" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Heart Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{healthMetrics.heartRate} BPM</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {isLiveDemo ? "Live" : "Normal"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={isLiveDemo ? "animate-pulse border-blue-200" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Steps Today</p>
                  <p className="text-2xl font-bold text-gray-900">{healthMetrics.steps.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {Math.round((healthMetrics.steps / 10000) * 100)}% of goal
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sleep Score</p>
                  <p className="text-2xl font-bold text-gray-900">{healthMetrics.sleepScore}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Excellent
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Health Score</p>
                  <p className="text-2xl font-bold text-gray-900">{healthMetrics.healthScore}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Zap className="w-3 h-3 mr-1" />
                    Optimal
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health Tracking</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>How are you feeling today?</span>
                  </CardTitle>
                  <CardDescription>Track your daily mood to help our AI provide better insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-6">
                    {moodOptions.map((mood) => {
                      const Icon = mood.icon
                      return (
                        <Button
                          key={mood.value}
                          variant={currentMood === mood.value ? "default" : "outline"}
                          className="flex-1 h-16 flex-col space-y-2"
                          onClick={() => setCurrentMood(mood.value as any)}
                        >
                          <Icon className={`w-6 h-6 ${mood.color}`} />
                          <span className="text-xs">{mood.label}</span>
                        </Button>
                      )
                    })}
                  </div>

                  <div className="mb-4">
                    <Button
                      onClick={handleEmotionDetection}
                      variant="outline"
                      className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      AI Emotion Detection (+20 Tokens)
                    </Button>
                  </div>

                  {currentMood && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="mood-notes">Optional notes</Label>
                        <Textarea
                          id="mood-notes"
                          placeholder="How are you feeling? Any specific thoughts or events?"
                          value={moodNotes}
                          onChange={(e) => setMoodNotes(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <Button onClick={handleMoodSubmit} className="w-full">
                        Submit Mood (+10 Health Tokens)
                      </Button>
                    </div>
                  )}

                  {moodEntries.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Recent Mood History</h4>
                      <div className="flex space-x-2">
                        {moodEntries.slice(-7).map((entry, index) => {
                          const moodOption = moodOptions.find((m) => m.value === entry.mood)
                          const Icon = moodOption?.icon || Meh
                          return (
                            <div key={entry.id} className="text-center">
                              <Icon className={`w-6 h-6 mx-auto ${moodOption?.color || "text-gray-500"}`} />
                              <p className="text-xs text-gray-600 mt-1">
                                {new Date(entry.timestamp).toLocaleDateString().slice(-5)}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span>Upcoming</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointments
                    .filter((apt) => apt.status !== "completed")
                    .slice(0, 3)
                    .map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{appointment.doctorName}</p>
                          <p className="text-xs text-gray-600">
                            {appointment.date}, {appointment.time}
                          </p>
                          <p className="text-xs text-blue-600">Code: {appointment.code}</p>
                        </div>
                        <Badge variant={appointment.type === "vr" ? "secondary" : "outline"} className="text-xs">
                          {appointment.type.toUpperCase()}
                        </Badge>
                      </div>
                    ))}

                  <Button className="w-full bg-transparent" variant="outline" onClick={handleScheduleAppointment}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule New (+25 Tokens)
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity & AI Insights</CardTitle>
                <CardDescription>Your latest health activities and AI-powered recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Completed morning workout</p>
                      <p className="text-sm text-gray-600">2 hours ago • Burned 320 calories</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Award className="w-4 h-4 mr-2" />
                      +15 Tokens
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Pill className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">AI Medication Reminder</p>
                      <p className="text-sm text-gray-600">Smart dosage optimization suggested</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Brain className="w-4 h-4 mr-2" />
                      View AI Tips
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">VR Therapy Session Available</p>
                      <p className="text-sm text-gray-600">Personalized stress relief program ready</p>
                    </div>
                    <Button size="sm" onClick={handleStartVR} className="bg-purple-600 hover:bg-purple-700">
                      <Video className="w-4 h-4 mr-2" />
                      Start VR
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Metrics</CardTitle>
                  <CardDescription>Track your vital signs and health indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Daily Steps Goal</span>
                      <span className="text-sm text-gray-600">{healthMetrics.steps.toLocaleString()} / 10,000</span>
                    </div>
                    <Progress value={Math.min((healthMetrics.steps / 10000) * 100, 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Water Intake</span>
                      <span className="text-sm text-gray-600">6 / 8 glasses</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Sleep Quality</span>
                      <span className="text-sm text-gray-600">8.5 hours</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vital Signs {isLiveDemo && <Badge className="ml-2 bg-red-500">LIVE</Badge>}</CardTitle>
                  <CardDescription>Latest readings from your connected devices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="font-medium">Heart Rate</span>
                    </div>
                    <span className="font-bold">{healthMetrics.heartRate} BPM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">Blood Pressure</span>
                    </div>
                    <span className="font-bold">{healthMetrics.bloodPressure}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Blood Oxygen</span>
                    </div>
                    <span className="font-bold">{healthMetrics.bloodOxygen}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Manage your scheduled consultations and checkups</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointments
                    .filter((apt) => apt.status !== "completed")
                    .map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">
                              {appointment.doctorName} - {appointment.specialty}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.type === "vr" ? "Virtual Reality Consultation" : "In-Person Visit"}
                            </p>
                          </div>
                          <Badge className={appointment.status === "confirmed" ? "bg-green-100 text-green-700" : ""}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-blue-600">Code: {appointment.code}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {appointment.type === "vr" && (
                            <Button size="sm" onClick={handleJoinVRSession} className="bg-blue-600 hover:bg-blue-700">
                              <Video className="w-4 h-4 mr-2" />
                              Join VR Session
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={handleScheduleAppointment}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleStartVR}>
                    <Video className="w-4 h-4 mr-2" />
                    Start VR Consultation
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={handleJoinVRSession}
                    disabled={isVRActive}
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    {isVRActive ? "VR Session Active" : "Join VR Session"}
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => {
                      const nextAppointment = appointments.find((apt) => apt.status !== "completed")
                      if (nextAppointment) {
                        alert(`Rescheduling ${nextAppointment.doctorName} appointment...`)
                      } else {
                        alert("No appointments to reschedule")
                      }
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reschedule Consultation
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleSetReminder}>
                    <Bell className="w-4 h-4 mr-2" />
                    Set Reminder
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Records</CardTitle>
                <CardDescription>Access your secure health records and documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Lab Results</h3>
                        <p className="text-sm text-gray-600">March 10, 2025</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Blood work and cholesterol screening</p>
                    <Badge className="bg-green-100 text-green-700">Normal</Badge>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Cardiology Report</h3>
                        <p className="text-sm text-gray-600">February 28, 2025</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">ECG and stress test results</p>
                    <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Pill className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Prescriptions</h3>
                        <p className="text-sm text-gray-600">Active</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Current medications and dosages</p>
                    <Badge variant="outline">3 Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span>AI Health Analysis</span>
                  </CardTitle>
                  <CardDescription>Personalized insights based on your health data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Sleep Improvement</h4>
                        <p className="text-sm text-green-800 mt-1">
                          Your sleep quality has improved by 15% this week. The consistent bedtime routine is working
                          well.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Activity Trend</h4>
                        <p className="text-sm text-blue-800 mt-1">
                          Your daily step count is trending upward. Consider adding 500 more steps to reach optimal
                          levels.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Hydration Alert</h4>
                        <p className="text-sm text-yellow-800 mt-1">
                          Your water intake is below recommended levels. Try setting hourly reminders.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                  <CardDescription>AI-powered suggestions for better health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-l-blue-500 pl-4">
                    <h4 className="font-medium">Exercise Recommendation</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Based on your heart rate data, try 20 minutes of moderate cardio 3x per week.
                    </p>
                  </div>

                  <div className="border-l-4 border-l-green-500 pl-4">
                    <h4 className="font-medium">Nutrition Tip</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Your vitamin D levels could benefit from 15 minutes of morning sunlight daily.
                    </p>
                  </div>

                  <div className="border-l-4 border-l-purple-500 pl-4">
                    <h4 className="font-medium">Stress Management</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Consider trying our VR meditation sessions to help manage stress levels.
                    </p>
                  </div>

                  <Button className="w-full mt-4">
                    <Brain className="w-4 h-4 mr-2" />
                    Get More Insights
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showAIAlert} onOpenChange={setShowAIAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>AI Health Alert</span>
            </DialogTitle>
            <DialogDescription>{currentAlert?.message}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Our AI is analyzing your recent mood patterns and recommends immediate attention. Would you like us to:
            </p>
            <div className="space-y-2">
              <p className="text-sm">• Connect you with a mental health professional</p>
              <p className="text-sm">• Schedule an emergency VR consultation</p>
              <p className="text-sm">• Notify your support circle</p>
            </div>
          </div>
          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => handleAIAlertAction("safe")}>
              <CheckCircle className="w-4 h-4 mr-2" />
              I'm Safe
            </Button>
            <Button onClick={() => handleAIAlertAction("help")} className="bg-red-600 hover:bg-red-700">
              <Phone className="w-4 h-4 mr-2" />I Need Help
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showVRDialog} onOpenChange={setShowVRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-purple-500" />
              <span>VR Therapy Session</span>
            </DialogTitle>
            <DialogDescription>Choose your personalized VR experience</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Headphones className="w-6 h-6" />
                <span className="text-sm">Meditation</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Target className="w-6 h-6" />
                <span className="text-sm">Focus Training</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Heart className="w-6 h-6" />
                <span className="text-sm">Stress Relief</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Brain className="w-6 h-6" />
                <span className="text-sm">Cognitive Therapy</span>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVRDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoinVRSession} className="bg-purple-600 hover:bg-purple-700">
              <Play className="w-4 h-4 mr-2" />
              Start Session (+15 Tokens)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEmotionDialog} onOpenChange={setShowEmotionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <span>AI Emotion Detection</span>
            </DialogTitle>
            <DialogDescription>Analyzing your facial expressions and micro-emotions</DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center">
            {isEmotionDetecting ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                  <Camera className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Scanning facial expressions...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                </div>
              </div>
            ) : detectedEmotion ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-lg">Emotion Detected: {detectedEmotion}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Based on your current emotional state, we recommend personalized wellness activities.
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700">+20 Health Tokens Earned</Badge>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEmotionDialog(false)
                setDetectedEmotion(null)
                setIsEmotionDetecting(false)
              }}
            >
              Close
            </Button>
            {detectedEmotion && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Recommendations
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>Book a consultation with a healthcare professional</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="doctor-name">Doctor Name</Label>
              <Input
                id="doctor-name"
                value={appointmentForm.doctorName}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, doctorName: e.target.value })}
                placeholder="Dr. Sarah Smith"
              />
            </div>
            <div>
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                value={appointmentForm.specialty}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, specialty: e.target.value })}
                placeholder="Cardiology, Mental Health, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Consultation Type</Label>
              <div className="flex space-x-4 mt-2">
                <Button
                  variant={appointmentForm.type === "vr" ? "default" : "outline"}
                  onClick={() => setAppointmentForm({ ...appointmentForm, type: "vr" })}
                  className="flex-1"
                >
                  <Video className="w-4 h-4 mr-2" />
                  VR Session
                </Button>
                <Button
                  variant={appointmentForm.type === "in-person" ? "default" : "outline"}
                  onClick={() => setAppointmentForm({ ...appointmentForm, type: "in-person" })}
                  className="flex-1"
                >
                  <Users className="w-4 h-4 mr-2" />
                  In-Person
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAppointmentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAppointmentBooking}>Book Appointment (+25 Tokens)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
