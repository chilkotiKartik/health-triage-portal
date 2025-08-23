"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  Calendar,
  FileText,
  Bell,
  Settings,
  LogOut,
  Search,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Video,
  Stethoscope,
  Clock,
  MessageSquare,
  BarChart3,
  Zap,
  Shield,
  Plus,
  Eye,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  getAppointments,
  getMoodEntries,
  getAIAlerts,
  analyzeMoodTrend,
  type MoodEntry,
  type Appointment,
  type AIAlert,
} from "@/lib/data-store"

interface Patient {
  id: string
  blockchainId: string
  name: string
  age: number
  condition: string
  lastVisit: string
  status: "stable" | "monitoring" | "critical" | "improving"
  riskLevel: "low" | "medium" | "high"
  avatar: string
  moodEntries: MoodEntry[]
  appointments: Appointment[]
  alerts: AIAlert[]
}

interface DoctorStats {
  totalPatients: number
  todayAppointments: number
  criticalAlerts: number
  aiInsights: number
  recoveryRate: number
  patientSatisfaction: number
  treatmentAdherence: number
}

export function DoctorDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [patients, setPatients] = useState<Patient[]>([])
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [showTokenDialog, setShowTokenDialog] = useState(false)
  const [showTherapyDialog, setShowTherapyDialog] = useState(false)
  const [showBlockchainLog, setShowBlockchainLog] = useState(false)
  const [selectedPatientForAction, setSelectedPatientForAction] = useState<Patient | null>(null)
  const [sessionNotes, setSessionNotes] = useState("")
  const [encryptedNote, setEncryptedNote] = useState("")
  const [therapySuggestion, setTherapySuggestion] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [blockchainLogs, setBlockchainLogs] = useState<
    Array<{
      id: string
      patientId: string
      action: string
      timestamp: number
      doctorId: string
    }>
  >([])

  const [doctorStats, setDoctorStats] = useState<DoctorStats>({
    totalPatients: 0,
    todayAppointments: 0,
    criticalAlerts: 0,
    aiInsights: 0,
    recoveryRate: 94,
    patientSatisfaction: 4.8,
    treatmentAdherence: 87,
  })
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showPatientDialog, setShowPatientDialog] = useState(false)
  const [showVRDialog, setShowVRDialog] = useState(false)
  const [vrSessionCode, setVrSessionCode] = useState("")

  useEffect(() => {
    loadPatientData()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const loadPatientData = () => {
    const mockPatientIds = ["1", "4", "5", "6"] // Patient user IDs
    const loadedPatients: Patient[] = mockPatientIds.map((patientId, index) => {
      const moodEntries = getMoodEntries(patientId)
      const appointments = getAppointments(patientId)
      const alerts = getAIAlerts(patientId).filter((alert) => !alert.dismissed)
      const moodAnalysis = moodEntries.length > 0 ? analyzeMoodTrend(moodEntries) : null

      const patientNames = ["John Doe", "Sarah Johnson", "Michael Chen", "Emily Davis"]
      const conditions = ["Hypertension", "Diabetes Type 1", "Heart Disease", "Anxiety"]
      const ages = [34, 28, 45, 31]

      return {
        id: patientId,
        blockchainId: `P-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        name: patientNames[index],
        age: ages[index],
        condition: conditions[index],
        lastVisit:
          appointments.length > 0
            ? new Date(
                appointments[appointments.length - 1].timestamp || Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
              ).toLocaleDateString()
            : `${Math.floor(Math.random() * 7) + 1} days ago`,
        status:
          moodAnalysis?.riskLevel === "high"
            ? "critical"
            : moodAnalysis?.riskLevel === "medium"
              ? "monitoring"
              : moodAnalysis?.trend === "improving"
                ? "improving"
                : "stable",
        riskLevel: moodAnalysis?.riskLevel || "low",
        avatar: patientNames[index]
          .split(" ")
          .map((n) => n[0])
          .join(""),
        moodEntries,
        appointments,
        alerts,
      }
    })

    setPatients(loadedPatients)

    const totalAlerts = loadedPatients.reduce((sum, p) => sum + p.alerts.length, 0)
    const todayAppointments = loadedPatients.reduce(
      (sum, p) =>
        sum + p.appointments.filter((apt) => new Date(apt.date).toDateString() === new Date().toDateString()).length,
      0,
    )

    setDoctorStats((prev) => ({
      ...prev,
      totalPatients: loadedPatients.length,
      todayAppointments,
      criticalAlerts: totalAlerts,
      aiInsights: loadedPatients.filter((p) => p.moodEntries.length > 0).length,
    }))
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handlePatientView = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowPatientDialog(true)
  }

  const handleVRConsultation = (patient: Patient) => {
    const appointment = patient.appointments.find((apt) => apt.type === "vr" && apt.status === "scheduled")
    if (appointment) {
      setVrSessionCode(appointment.code)
      setSelectedPatient(patient)
      setShowVRDialog(true)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable":
        return "bg-green-100 text-green-700"
      case "monitoring":
        return "bg-yellow-100 text-yellow-700"
      case "critical":
        return "bg-red-100 text-red-700"
      case "improving":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.blockchainId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const criticalPatients = patients.filter((p) => p.status === "critical")

  const handleScheduleAppointment = () => {
    setShowScheduleDialog(true)
  }

  const handleStartVRSession = () => {
    const vrPatient = patients.find((p) =>
      p.appointments.some((apt) => apt.type === "vr" && apt.status === "scheduled"),
    )
    if (vrPatient) {
      setSelectedPatientForAction(vrPatient)
      setShowVRDialog(true)
    } else {
      alert("No VR sessions scheduled")
    }
  }

  const handleSendMessage = () => {
    setShowNotesDialog(true)
  }

  const handleCreateReport = () => {
    setShowReportDialog(true)
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    // Log blockchain access
    const logEntry = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: selectedPatient?.id || "system",
      action: "Started consultation recording",
      timestamp: Date.now(),
      doctorId: user?.id || "unknown",
    }
    setBlockchainLogs((prev) => [logEntry, ...prev])
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    // Log blockchain access
    const logEntry = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: selectedPatient?.id || "system",
      action: `Stopped consultation recording (${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, "0")})`,
      timestamp: Date.now(),
      doctorId: user?.id || "unknown",
    }
    setBlockchainLogs((prev) => [logEntry, ...prev])
  }

  const handleViewTokens = (patient: Patient) => {
    setSelectedPatientForAction(patient)
    setShowTokenDialog(true)
  }

  const handleAITherapySuggestion = (patient: Patient) => {
    setSelectedPatientForAction(patient)
    // Generate AI therapy suggestion based on patient data
    const moodAnalysis = patient.moodEntries.length > 0 ? analyzeMoodTrend(patient.moodEntries) : null
    let suggestion = ""

    if (moodAnalysis?.riskLevel === "high") {
      suggestion =
        "Recommend immediate cognitive behavioral therapy (CBT) sessions. Consider mindfulness-based stress reduction techniques. Schedule weekly check-ins."
    } else if (moodAnalysis?.riskLevel === "medium") {
      suggestion =
        "Suggest regular therapy sessions with focus on mood stabilization. Incorporate physical activity and sleep hygiene counseling."
    } else {
      suggestion =
        "Continue current treatment plan. Consider preventive wellness coaching and stress management techniques."
    }

    setTherapySuggestion(suggestion)
    setShowTherapyDialog(true)
  }

  const handleEncryptedNote = () => {
    if (encryptedNote.trim()) {
      const encrypted = btoa(encryptedNote) // Simple base64 encoding for demo
      alert(`Encrypted note created: ${encrypted.substring(0, 20)}...`)
      setEncryptedNote("")
      setShowNotesDialog(false)
    }
  }

  const handleAwardTokens = (patient: Patient, amount: number) => {
    // Award tokens to patient
    const currentTokens = Number.parseInt(localStorage.getItem(`tokens_${patient.id}`) || "0")
    localStorage.setItem(`tokens_${patient.id}`, (currentTokens + amount).toString())

    // Log blockchain transaction
    const logEntry = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: patient.id,
      action: `Awarded ${amount} Health Tokens`,
      timestamp: Date.now(),
      doctorId: user?.id || "unknown",
    }
    setBlockchainLogs((prev) => [logEntry, ...prev])

    alert(`Awarded ${amount} Health Tokens to ${patient.name}`)
    setShowTokenDialog(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Doctor Portal</h1>
                <p className="text-sm text-gray-600">
                  Welcome, {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-blue-600">ID: {user?.blockchainId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search patients..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
                {doctorStats.criticalAlerts > 0 && (
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
        {/* AI Alert */}
        {criticalPatients.length > 0 && (
          <div className="mb-8">
            <Card className="border-l-4 border-l-red-500 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-2">Critical Patient Alert</h3>
                    <p className="text-red-800 mb-3">
                      {criticalPatients[0].name}'s health indicators show concerning patterns. AI recommends immediate
                      consultation.
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleVRConsultation(criticalPatients[0])}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Start VR Consultation
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePatientView(criticalPatients[0])}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Patient
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{doctorStats.totalPatients}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Active patients
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{doctorStats.todayAppointments}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    Scheduled today
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{doctorStats.criticalAlerts}</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Requires attention
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Insights</p>
                  <p className="text-2xl font-bold text-gray-900">{doctorStats.aiInsights}</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Brain className="w-3 h-3 mr-1" />
                    Active analyses
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="consultations">VR Consultations</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Patient
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {patient.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{patient.name}</h3>
                          <p className="text-gray-600">
                            Age {patient.age} • {patient.condition}
                          </p>
                          <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
                          <p className="text-xs text-blue-600">ID: {patient.blockchainId}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                          <p className={`text-sm font-medium mt-1 ${getRiskColor(patient.riskLevel)}`}>
                            {patient.riskLevel} risk
                          </p>
                          {patient.moodEntries.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">{patient.moodEntries.length} mood entries</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handlePatientView(patient)}>
                            <FileText className="w-4 h-4 mr-2" />
                            Records
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleVRConsultation(patient)}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Consult
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Today's Schedule</span>
                    <div className="flex items-center space-x-2">
                      {isRecording ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
                          <Button size="sm" variant="outline" onClick={handleStopRecording}>
                            Stop Recording
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" onClick={handleStartRecording}>
                          <Video className="w-4 h-4 mr-2" />
                          Start Recording
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>Your appointments for {new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patients.flatMap((patient) =>
                    patient.appointments
                      .filter((apt) => new Date(apt.date).toDateString() === new Date().toDateString())
                      .map((apt) => (
                        <div key={apt.id} className="border-l-4 border-l-blue-500 pl-4 py-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">
                                {patient.name} - {apt.specialty}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {apt.type === "vr" ? "VR Consultation" : "In-Person"}
                              </p>
                              <p className="text-xs text-gray-500">{apt.time}</p>
                              <p className="text-xs text-blue-600">Code: {apt.code}</p>
                            </div>
                            <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
                          </div>
                        </div>
                      )),
                  )}

                  {patients.flatMap((p) =>
                    p.appointments.filter((apt) => new Date(apt.date).toDateString() === new Date().toDateString()),
                  ).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No appointments scheduled for today</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={handleScheduleAppointment}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button className="w-full justify-start" onClick={handleStartVRSession}>
                    <Video className="w-4 h-4 mr-2" />
                    Start VR Session
                  </Button>
                  <Button className="w-full justify-start" onClick={handleSendMessage}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Encrypted Message
                  </Button>
                  <Button className="w-full justify-start" onClick={handleCreateReport}>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Full Report
                  </Button>
                  <Button className="w-full justify-start" onClick={() => setShowBlockchainLog(true)}>
                    <Shield className="w-4 h-4 mr-2" />
                    View Blockchain Log
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <span>Patient Outcomes</span>
                  </CardTitle>
                  <CardDescription>Treatment success rates and patient progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Recovery Rate</span>
                      <span className="text-2xl font-bold text-green-600">{doctorStats.recoveryRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Patient Satisfaction</span>
                      <span className="text-2xl font-bold text-blue-600">{doctorStats.patientSatisfaction}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Treatment Adherence</span>
                      <span className="text-2xl font-bold text-purple-600">{doctorStats.treatmentAdherence}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Statistics</CardTitle>
                  <CardDescription>Your practice performance this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Consultations</span>
                      <span className="font-bold">{patients.reduce((sum, p) => sum + p.appointments.length, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">VR Sessions</span>
                      <span className="font-bold">
                        {patients.reduce((sum, p) => sum + p.appointments.filter((apt) => apt.type === "vr").length, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">AI Diagnoses</span>
                      <span className="font-bold">{patients.filter((p) => p.moodEntries.length > 0).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span>AI Diagnostic Assistance</span>
                  </CardTitle>
                  <CardDescription>AI-powered insights for better patient care</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patients
                    .filter((p) => p.status === "critical")
                    .map((patient) => (
                      <div key={patient.id} className="p-4 bg-red-50 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-red-900">High Priority Alert</h4>
                            <p className="text-sm text-red-800 mt-1">
                              Patient {patient.name} shows concerning health patterns. AI detected emotional distress
                              indicators.
                            </p>
                            <div className="flex space-x-2 mt-3">
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handlePatientView(patient)}
                              >
                                Review Patient
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleAITherapySuggestion(patient)}>
                                AI Therapy Suggestions
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleViewTokens(patient)}>
                                View Tokens
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {patients
                    .filter((p) => p.status === "monitoring")
                    .map((patient) => (
                      <div key={patient.id} className="p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-900">Treatment Optimization</h4>
                            <p className="text-sm text-yellow-800 mt-1">
                              {patient.name}'s health indicators suggest treatment adjustment may improve outcomes.
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 bg-transparent"
                              onClick={() => handlePatientView(patient)}
                            >
                              View Recommendations
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                  {patients
                    .filter((p) => p.status === "improving")
                    .map((patient) => (
                      <div key={patient.id} className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-900">Positive Trend</h4>
                            <p className="text-sm text-green-800 mt-1">
                              {patient.name}'s health indicators have stabilized. Current treatment plan is effective.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Predictive Analytics</CardTitle>
                  <CardDescription>AI predictions for patient health outcomes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patients
                    .filter((p) => p.moodEntries.length > 0)
                    .slice(0, 3)
                    .map((patient) => {
                      const analysis = analyzeMoodTrend(patient.moodEntries)
                      return (
                        <div key={patient.id} className="border-l-4 border-l-blue-500 pl-4">
                          <h4 className="font-medium">{patient.name} - Mood Prediction</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Trend: {analysis.trend}, Risk: {analysis.riskLevel}.
                            {analysis.trend === "improving"
                              ? " Positive recovery trajectory."
                              : analysis.trend === "declining"
                                ? " Requires increased monitoring."
                                : " Stable condition maintained."}
                          </p>
                        </div>
                      )
                    })}

                  <Button className="w-full mt-4" onClick={handleCreateReport}>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate AI-Powered Full Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="w-5 h-5 text-blue-500" />
                    <span>VR Consultation Center</span>
                  </CardTitle>
                  <CardDescription>Immersive virtual reality consultations with patients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patients.flatMap((patient) =>
                    patient.appointments
                      .filter((apt) => apt.type === "vr" && apt.status === "scheduled")
                      .slice(0, 1)
                      .map((apt) => (
                        <div key={apt.id} className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
                          <h3 className="font-semibold mb-2">Next VR Session</h3>
                          <p className="text-gray-700 mb-4">
                            {patient.name} - {apt.specialty}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {apt.date} {apt.time}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Shield className="w-4 h-4" />
                              <span>Code: {apt.code}</span>
                            </div>
                          </div>
                          <Button
                            className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
                            onClick={() => handleVRConsultation(patient)}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Join VR Session
                          </Button>
                        </div>
                      )),
                  )}

                  <div className="space-y-3">
                    <h4 className="font-medium">Recent VR Sessions</h4>
                    <div className="space-y-2">
                      {patients.flatMap((patient) =>
                        patient.appointments
                          .filter((apt) => apt.type === "vr" && apt.status === "completed")
                          .slice(0, 3)
                          .map((apt) => (
                            <div key={apt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-sm">{patient.name}</p>
                                <p className="text-xs text-gray-600">{apt.specialty}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-700">Completed</Badge>
                            </div>
                          )),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>VR Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={handleStartVRSession}>
                    <Video className="w-4 h-4 mr-2" />
                    Start New Session
                  </Button>
                  <Button className="w-full justify-start" onClick={() => alert("VR Settings opened")}>
                    <Settings className="w-4 h-4 mr-2" />
                    VR Settings
                  </Button>
                  <Button className="w-full justify-start" onClick={handleCreateReport}>
                    <FileText className="w-4 h-4 mr-2" />
                    Session Reports
                  </Button>
                  <Button className="w-full justify-start" onClick={() => handleAITherapySuggestion(patients[0])}>
                    <Brain className="w-4 h-4 mr-2" />
                    AI Assistance
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Schedule Appointment Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>Create a new appointment with blockchain verification</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient</Label>
              <select className="w-full p-2 border rounded">
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.blockchainId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Appointment Type</Label>
              <select className="w-full p-2 border rounded">
                <option value="consultation">Consultation</option>
                <option value="vr">VR Session</option>
                <option value="followup">Follow-up</option>
              </select>
            </div>
            <div>
              <Label>Date & Time</Label>
              <Input type="datetime-local" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert("Appointment scheduled with blockchain verification!")
                setShowScheduleDialog(false)
              }}
            >
              Schedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI-Powered Patient Report</DialogTitle>
            <DialogDescription>Comprehensive analysis with ML insights</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Report Summary</h3>
              <div className="space-y-2 text-sm">
                <p>• Total Patients Analyzed: {patients.length}</p>
                <p>• High-Risk Cases: {patients.filter((p) => p.riskLevel === "high").length}</p>
                <p>• AI Predictions Generated: {patients.filter((p) => p.moodEntries.length > 0).length}</p>
                <p>• Treatment Adherence Rate: {doctorStats.treatmentAdherence}%</p>
                <p>• Recovery Success Rate: {doctorStats.recoveryRate}%</p>
              </div>
            </div>
            <div>
              <Label>Report Type</Label>
              <select className="w-full p-2 border rounded">
                <option>Comprehensive Patient Analysis</option>
                <option>Risk Assessment Report</option>
                <option>Treatment Outcomes Report</option>
                <option>AI Insights Summary</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert("AI-powered report generated and encrypted!")
                setShowReportDialog(false)
              }}
            >
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Encrypted Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Encrypted Message</DialogTitle>
            <DialogDescription>Secure blockchain-verified communication</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Recipient Patient</Label>
              <select className="w-full p-2 border rounded">
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.blockchainId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Encrypted Message</Label>
              <Textarea
                placeholder="Enter your message (will be encrypted with patient's unique ID)"
                value={encryptedNote}
                onChange={(e) => setEncryptedNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <Shield className="w-4 h-4 inline mr-1" />
                Message will be encrypted with blockchain verification
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotesDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEncryptedNote}>
              <Shield className="w-4 h-4 mr-2" />
              Send Encrypted Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Token Wallet Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Token Wallet</DialogTitle>
            <DialogDescription>{selectedPatientForAction?.name}'s Health Token Balance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {localStorage.getItem(`tokens_${selectedPatientForAction?.id}`) || "0"} HT
              </div>
              <p className="text-sm text-gray-600">Health Tokens Earned</p>
            </div>
            <div className="space-y-2">
              <Label>Award Bonus Tokens</Label>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => selectedPatientForAction && handleAwardTokens(selectedPatientForAction, 10)}
                >
                  +10 HT
                </Button>
                <Button
                  size="sm"
                  onClick={() => selectedPatientForAction && handleAwardTokens(selectedPatientForAction, 25)}
                >
                  +25 HT
                </Button>
                <Button
                  size="sm"
                  onClick={() => selectedPatientForAction && handleAwardTokens(selectedPatientForAction, 50)}
                >
                  +50 HT
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTokenDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Therapy Suggestions Dialog */}
      <Dialog open={showTherapyDialog} onOpenChange={setShowTherapyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Therapy Recommendations</DialogTitle>
            <DialogDescription>
              Personalized treatment suggestions for {selectedPatientForAction?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-2 text-purple-600" />
                AI Analysis
              </h3>
              <p className="text-sm">{therapySuggestion}</p>
            </div>
            <div>
              <Label>Doctor's Notes</Label>
              <Textarea placeholder="Add your professional assessment..." className="min-h-[100px]" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="approve" />
              <Label htmlFor="approve">Approve and send to patient</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTherapyDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert("Therapy recommendations sent to patient!")
                setShowTherapyDialog(false)
              }}
            >
              Send Recommendations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blockchain Access Log Dialog */}
      <Dialog open={showBlockchainLog} onOpenChange={setShowBlockchainLog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Blockchain Access Log</DialogTitle>
            <DialogDescription>Secure audit trail of all patient data access</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {blockchainLogs.map((log) => (
              <div key={log.id} className="border-l-4 border-l-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-gray-600">Patient ID: {log.patientId}</p>
                    <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                  <Badge variant="outline">Verified</Badge>
                </div>
              </div>
            ))}
            {blockchainLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No access logs yet</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowBlockchainLog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VR Consultation Dialog */}
      <Dialog open={showVRDialog} onOpenChange={setShowVRDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-blue-500" />
              <span>VR Consultation Session</span>
            </DialogTitle>
            <DialogDescription>Starting VR consultation with {selectedPatient?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h3 className="font-semibold mb-2">VR Session Ready</h3>
              <p className="text-sm text-gray-600 mb-4">
                Session Code: <span className="font-mono font-bold">{vrSessionCode}</span>
              </p>
              <p className="text-xs text-gray-500">
                Both you and the patient will use this code to join the secure VR environment
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <h4 className="font-medium mb-2">Shared Whiteboard</h4>
                <p className="text-sm text-gray-600 mb-3">Collaborative notes and mood graphs</p>
                <Button size="sm" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Open Whiteboard
                </Button>
              </div>
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <h4 className="font-medium mb-2">Patient Health Data</h4>
                <p className="text-sm text-gray-600 mb-3">Real-time vital signs and mood</p>
                <Button size="sm" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Live Data
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Session Notes (Encrypted)</Label>
              <Textarea
                placeholder="Add consultation notes... (will be encrypted and logged on blockchain)"
                className="min-h-[100px]"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVRDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-green-500"
              onClick={() => {
                alert("VR Session launched with blockchain verification!")
                setShowVRDialog(false)
              }}
            >
              <Video className="w-4 h-4 mr-2" />
              Launch VR Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
