"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  Users,
  MessageCircle,
  Settings,
  LogOut,
  Search,
  AlertTriangle,
  Brain,
  Video,
  Gift,
  Bell,
  Send,
  Shield,
  Star,
  Award,
  Mic,
  MicOff,
  VideoOff,
  Smile,
  ThumbsUp,
  Calendar,
  Clock,
  Zap,
  Lock,
  Eye,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { getStoredData, storeData } from "@/lib/data-store"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [encouragementMessage, setEncouragementMessage] = useState("")
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [supportCirclePatients, setSupportCirclePatients] = useState<any[]>([])
  const [recentAlerts, setRecentAlerts] = useState<any[]>([])
  const [encouragementWall, setEncouragementWall] = useState<any[]>([])
  const [tokenTransferAmount, setTokenTransferAmount] = useState("")

  useEffect(() => {
    // Load support circle patients
    const patients = getStoredData("supportCirclePatients") || [
      {
        id: "P-AX93F1",
        name: "Sarah Johnson",
        relationship: "Daughter",
        moodTrend: "declining",
        lastCheckIn: "2 hours ago",
        tokenBalance: 245,
        permissions: ["mood", "appointments"],
        riskLevel: "medium",
        weeklyProgress: 65,
        consentStatus: "active",
      },
      {
        id: "P-BK47G2",
        name: "Michael Chen",
        relationship: "Son",
        moodTrend: "improving",
        lastCheckIn: "30 minutes ago",
        tokenBalance: 189,
        permissions: ["mood", "appointments", "history"],
        riskLevel: "low",
        weeklyProgress: 82,
        consentStatus: "active",
      },
      {
        id: "P-CL58H3",
        name: "Emma Davis",
        relationship: "Spouse",
        moodTrend: "stable",
        lastCheckIn: "1 hour ago",
        tokenBalance: 312,
        permissions: ["mood"],
        riskLevel: "low",
        weeklyProgress: 78,
        consentStatus: "active",
      },
    ]
    setSupportCirclePatients(patients)

    // Load recent alerts
    const alerts = getStoredData("familyAlerts") || [
      {
        id: 1,
        patientId: "P-AX93F1",
        patientName: "Sarah Johnson",
        type: "mood_decline",
        message: "Patient mood has declined significantly over the past 3 days",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        severity: "high",
        actionTaken: false,
      },
      {
        id: 2,
        patientId: "P-BK47G2",
        patientName: "Michael Chen",
        type: "milestone",
        message: "Patient completed 7-day wellness streak!",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        severity: "positive",
        actionTaken: true,
      },
    ]
    setRecentAlerts(alerts)

    // Load encouragement wall
    const wall = getStoredData("encouragementWall") || [
      {
        id: 1,
        patientId: "P-AX93F1",
        message: "You are doing amazing! Keep up the great work with your daily walks.",
        author: "Mom",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        likes: 3,
      },
      {
        id: 2,
        patientId: "P-BK47G2",
        message: "So proud of your progress this week! 🌟",
        author: "Dad",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        likes: 5,
      },
    ]
    setEncouragementWall(wall)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const sendEncouragement = () => {
    if (!encouragementMessage.trim() || !selectedPatient) return

    const newMessage = {
      id: Date.now(),
      patientId: selectedPatient.id,
      message: encouragementMessage,
      author: user?.firstName || "Family Member",
      timestamp: new Date().toISOString(),
      likes: 0,
    }

    const updatedWall = [...encouragementWall, newMessage]
    setEncouragementWall(updatedWall)
    storeData("encouragementWall", updatedWall)
    setEncouragementMessage("")

    // Award tokens to patient
    const updatedPatients = supportCirclePatients.map((p) =>
      p.id === selectedPatient.id ? { ...p, tokenBalance: p.tokenBalance + 10 } : p,
    )
    setSupportCirclePatients(updatedPatients)
    storeData("supportCirclePatients", updatedPatients)
  }

  const transferTokens = () => {
    if (!tokenTransferAmount || !selectedPatient) return

    const amount = Number.parseInt(tokenTransferAmount)
    const updatedPatients = supportCirclePatients.map((p) =>
      p.id === selectedPatient.id ? { ...p, tokenBalance: p.tokenBalance + amount } : p,
    )
    setSupportCirclePatients(updatedPatients)
    storeData("supportCirclePatients", updatedPatients)
    setTokenTransferAmount("")

    // Log blockchain transaction
    const transaction = {
      id: `TX-${Date.now()}`,
      type: "token_transfer",
      from: user?.blockchainId,
      to: selectedPatient.id,
      amount: amount,
      timestamp: new Date().toISOString(),
      verified: true,
    }

    const existingTransactions = getStoredData("blockchainTransactions") || []
    storeData("blockchainTransactions", [...existingTransactions, transaction])
  }

  const startVideoCall = (patient: any) => {
    setSelectedPatient(patient)
    setIsVideoCallActive(true)

    // Log call start
    const callLog = {
      id: `CALL-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      startTime: new Date().toISOString(),
      type: "support_call",
      status: "active",
    }

    const existingCalls = getStoredData("supportCalls") || []
    storeData("supportCalls", [...existingCalls, callLog])
  }

  const getMoodTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600"
      case "declining":
        return "text-red-600"
      case "stable":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">👨‍👩‍👧 Family Support Dashboard</h1>
                <p className="text-sm text-gray-600">Supporting Your Loved Ones • {user?.firstName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search patients, messages..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
                {recentAlerts.filter((a) => !a.actionTaken).length > 0 && (
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
        {/* Support Circle Overview */}
        <div className="mb-8">
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900 mb-2">Your Support Circle</h3>
                  <p className="text-purple-800 mb-3">
                    You're supporting {supportCirclePatients.length} family members on their wellness journey.
                    {recentAlerts.filter((a) => !a.actionTaken).length > 0 &&
                      ` ${recentAlerts.filter((a) => !a.actionTaken).length} alerts need your attention.`}
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Circle
                    </Button>
                    <Button size="sm" variant="outline">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Patients in Circle</p>
                  <p className="text-2xl font-bold text-gray-900">{supportCirclePatients.length}</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Heart className="w-3 h-3 mr-1" />
                    Active support
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {recentAlerts.filter((a) => !a.actionTaken).length}
                  </p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Need attention
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
                  <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                  <p className="text-2xl font-bold text-gray-900">{encouragementWall.length}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    This week
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tokens Shared</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Gift className="w-3 h-3 mr-1" />
                    Total given
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="monitoring">Patient Monitoring</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="encouragement">Encouragement Wall</TabsTrigger>
            <TabsTrigger value="tokens">Token Support</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Access</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold text-gray-900">Patient Monitoring Dashboard</h2>

              {supportCirclePatients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {patient.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{patient.name}</h3>
                          <p className="text-sm text-gray-600">
                            ID: {patient.id} • {patient.relationship}
                          </p>
                          <p className="text-xs text-gray-500">Last check-in: {patient.lastCheckIn}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRiskLevelColor(patient.riskLevel)}>{patient.riskLevel} risk</Badge>
                        <Badge className="bg-blue-100 text-blue-700">{patient.consentStatus}</Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Mood Trend</p>
                        <p className={`text-lg font-bold ${getMoodTrendColor(patient.moodTrend)}`}>
                          {patient.moodTrend}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Weekly Progress</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={patient.weeklyProgress} className="flex-1" />
                          <span className="text-sm font-medium">{patient.weeklyProgress}%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Token Balance</p>
                        <p className="text-lg font-bold text-yellow-600">{patient.tokenBalance}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => startVideoCall(patient)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Start Support Call
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedPatient(patient)}>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Encouragement to {patient.name}</DialogTitle>
                            <DialogDescription>
                              Send a supportive message to help boost their wellness journey.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Write an encouraging message..."
                              value={encouragementMessage}
                              onChange={(e) => setEncouragementMessage(e.target.value)}
                            />
                            <Button onClick={sendEncouragement} className="w-full">
                              <Send className="w-4 h-4 mr-2" />
                              Send Encouragement (+10 tokens)
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline">
                        <Gift className="w-4 h-4 mr-2" />
                        Send Tokens
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                    <span>Secure Messaging</span>
                  </CardTitle>
                  <CardDescription>Send encrypted messages to your family members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportCirclePatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {patient.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-600">Last message: 2 hours ago</p>
                        </div>
                      </div>
                      <Button size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="w-5 h-5 text-green-500" />
                    <span>Video Support Calls</span>
                  </CardTitle>
                  <CardDescription>Start face-to-face support sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  {isVideoCallActive ? (
                    <div className="space-y-4">
                      <div className="bg-gray-900 rounded-lg p-8 text-center text-white">
                        <Video className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg font-medium">Support Call Active</p>
                        <p className="text-sm text-gray-300">Connected with {selectedPatient?.name}</p>
                        <div className="flex justify-center space-x-4 mt-6">
                          <Button
                            size="sm"
                            variant={isMuted ? "destructive" : "secondary"}
                            onClick={() => setIsMuted(!isMuted)}
                          >
                            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant={isVideoOff ? "destructive" : "secondary"}
                            onClick={() => setIsVideoOff(!isVideoOff)}
                          >
                            {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setIsVideoCallActive(false)}>
                            End Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {supportCirclePatients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {patient.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-gray-600">Available for support call</p>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => startVideoCall(patient)}>
                            <Video className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="encouragement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span>Encouragement Wall</span>
                </CardTitle>
                <CardDescription>Share motivational messages with your family members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {encouragementWall.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border-l-4 border-l-pink-500"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{message.message}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>To: {supportCirclePatients.find((p) => p.id === message.patientId)?.name}</span>
                          <span>From: {message.author}</span>
                          <span>{new Date(message.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {message.likes}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <h4 className="font-medium mb-3">Send New Encouragement</h4>
                  <div className="space-y-3">
                    <select
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => {
                        const patient = supportCirclePatients.find((p) => p.id === e.target.value)
                        setSelectedPatient(patient)
                      }}
                    >
                      <option value="">Select family member...</option>
                      {supportCirclePatients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
                    <Textarea
                      placeholder="Write an encouraging message..."
                      value={encouragementMessage}
                      onChange={(e) => setEncouragementMessage(e.target.value)}
                    />
                    <Button onClick={sendEncouragement} disabled={!selectedPatient || !encouragementMessage.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Encouragement (+10 tokens)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-yellow-500" />
                    <span>Token Rewards</span>
                  </CardTitle>
                  <CardDescription>Send bonus tokens to encourage wellness milestones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportCirclePatients.map((patient) => (
                    <div key={patient.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {patient.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-gray-600">Current balance: {patient.tokenBalance} tokens</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Token amount"
                          value={selectedPatient?.id === patient.id ? tokenTransferAmount : ""}
                          onChange={(e) => {
                            setSelectedPatient(patient)
                            setTokenTransferAmount(e.target.value)
                          }}
                          className="flex-1"
                        />
                        <Button onClick={transferTokens} disabled={!tokenTransferAmount}>
                          <Zap className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Milestone Celebrations</CardTitle>
                  <CardDescription>Recent achievements and celebrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">7-Day Streak!</p>
                        <p className="text-sm text-green-800">Michael Chen completed daily check-ins</p>
                        <p className="text-xs text-green-700">Earned 50 bonus tokens</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Mood Improvement</p>
                        <p className="text-sm text-blue-800">Sarah Johnson's mood trending up</p>
                        <p className="text-xs text-blue-700">Family support making a difference!</p>
                      </div>
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
                    <span>AI Support Suggestions</span>
                  </CardTitle>
                  <CardDescription>AI-powered conversation prompts and support recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportCirclePatients.map((patient) => (
                    <div key={patient.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Suggestions for {patient.name}</h4>
                      <div className="space-y-2">
                        <div className="p-2 bg-blue-50 rounded text-sm">
                          💬 "How did you sleep last night? I noticed you've been working on your sleep schedule."
                        </div>
                        <div className="p-2 bg-green-50 rounded text-sm">
                          🚶 "Would you like to take a walk together this weekend? Fresh air might help."
                        </div>
                        <div className="p-2 bg-purple-50 rounded text-sm">
                          🎯 "I'm proud of your progress this week. What's one thing you're looking forward to?"
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Predictive Alerts</CardTitle>
                  <CardDescription>AI predictions and early warning system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.severity === "high"
                          ? "bg-red-50 border-l-red-500"
                          : alert.severity === "positive"
                            ? "bg-green-50 border-l-green-500"
                            : "bg-yellow-50 border-l-yellow-500"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{alert.patientName}</p>
                          <p className="text-sm mt-1">{alert.message}</p>
                          <p className="text-xs text-gray-600 mt-2">{new Date(alert.timestamp).toLocaleString()}</p>
                        </div>
                        {!alert.actionTaken && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Reach Out
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>Blockchain Access Control</span>
                  </CardTitle>
                  <CardDescription>Secure, verifiable access to patient data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportCirclePatients.map((patient) => (
                    <div key={patient.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-600">Consent Status: {patient.consentStatus}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          <Lock className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Permissions Granted:</p>
                        <div className="flex flex-wrap gap-2">
                          {patient.permissions.map((permission: string) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission === "mood" && <Smile className="w-3 h-3 mr-1" />}
                              {permission === "appointments" && <Calendar className="w-3 h-3 mr-1" />}
                              {permission === "history" && <Clock className="w-3 h-3 mr-1" />}
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Controls</CardTitle>
                  <CardDescription>Manage what information you can access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Granular Permissions</h4>
                        <p className="text-sm text-blue-800 mt-1">
                          Patients control exactly what you can see. All access is logged on blockchain for
                          transparency.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Secure Communication</h4>
                        <p className="text-sm text-green-800 mt-1">
                          All messages and calls are encrypted end-to-end for maximum privacy protection.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Lock className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-900">Revocable Access</h4>
                        <p className="text-sm text-purple-800 mt-1">
                          Patients can revoke your access at any time. You'll be notified immediately of any changes.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
