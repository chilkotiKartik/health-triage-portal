import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { AIChatWidget } from "@/components/ui/ai-chat-widget"
import {
  ArrowRight,
  Shield,
  Brain,
  Activity,
  Users,
  Zap,
  Globe,
  Heart,
  Stethoscope,
  Database,
  Lock,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import FloatingParticles from "@/components/ui/floating-particles" // Import FloatingParticles

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      <style>{`
  html {
    font-family: 'GeistSans', 'GeistSans Fallback';
    --font-sans: __variable_font_sans;
  }
`}</style>
      <FloatingParticles />

      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center animate-pulse">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                HealthVerse AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Features
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                About
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Contact
              </Link>
              <Button
                variant="outline"
                asChild
                className="hover:scale-105 transition-transform duration-200 bg-transparent"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 hover:scale-105 transition-all duration-200"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 animate-in fade-in slide-in-from-top duration-500">
            <Sparkles className="w-4 h-4 mr-1 animate-spin" />
            AI-Powered Healthcare Universe
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent leading-tight animate-in fade-in slide-in-from-bottom duration-700">
            HealthVerse AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            Revolutionary AI-powered healthcare universe with predictive mood analysis, VR therapy rooms, blockchain
            security, and intelligent health tokens. Experience the future of personalized healthcare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-in fade-in slide-in-from-bottom duration-700 delay-400">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-lg px-8 py-3 hover:scale-105 transition-all duration-200 group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 bg-transparent hover:scale-105 transition-all duration-200"
            >
              Watch Demo
            </Button>
          </div>

          {/* Hero Stats with Animated Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-600">
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-blue-600">
                <AnimatedCounter end={50000} suffix="+" />
              </div>
              <div className="text-gray-600">AI Mood Predictions</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-green-500">
                <AnimatedCounter end={95} suffix="%" />
              </div>
              <div className="text-gray-600">Emotion Accuracy</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-purple-600">
                <AnimatedCounter end={1000} suffix="+" />
              </div>
              <div className="text-gray-600">ML Models Trained</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-blue-500">
                <a
                  href="https://vercelhealth.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Live Demo
                </a>
              </div>
              <div className="text-gray-600">Try Now</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 animate-in fade-in slide-in-from-top duration-500">
              Revolutionary AI Healthcare Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-in fade-in slide-in-from-top duration-500 delay-200">
              Experience predictive health AI, VR therapy rooms, blockchain security, and gamified wellness tokens
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Mood Radar",
                description: "Predictive mood analysis with real-time forecasting and escalation alerts",
                color: "blue",
                delay: 0,
              },
              {
                icon: Globe,
                title: "VR Therapy Rooms",
                description: "Immersive 3D therapy environments with WebRTC doctor collaboration",
                color: "purple",
                delay: 100,
              },
              {
                icon: Shield,
                title: "Blockchain Codes",
                description: "Time-locked appointment codes with zero-trust verification system",
                color: "green",
                delay: 200,
              },
              {
                icon: Zap,
                title: "Health Tokens",
                description: "Gamified wellness rewards with family gifting and premium unlocks",
                color: "blue",
                delay: 300,
              },
              {
                icon: Users,
                title: "Support Circle AI",
                description: "AI coaching for family members with empathetic conversation prompts",
                color: "green",
                delay: 400,
              },
              {
                icon: Activity,
                title: "Digital Twin",
                description: "Future health simulations showing multiple scenario outcomes",
                color: "purple",
                delay: 500,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`border-2 hover:border-${feature.color}-200 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in slide-in-from-bottom duration-500`}
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-green-50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 animate-in fade-in slide-in-from-top duration-500">
              Built for Everyone
            </h2>
            <p className="text-xl text-gray-600 animate-in fade-in slide-in-from-top duration-500 delay-200">
              Tailored experiences for all healthcare stakeholders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Patients",
                description:
                  "Track your health, connect with doctors, and access AI-powered insights for better wellness",
                buttonText: "Patient Portal",
                color: "blue",
                delay: 0,
              },
              {
                icon: Stethoscope,
                title: "Doctors",
                description:
                  "Manage patients, access comprehensive health data, and provide enhanced care with AI tools",
                buttonText: "Doctor Dashboard",
                color: "green",
                delay: 200,
              },
              {
                icon: Database,
                title: "Administrators",
                description: "Oversee platform operations, manage users, and access comprehensive analytics",
                buttonText: "Admin Panel",
                color: "purple",
                delay: 400,
              },
            ].map((role, index) => (
              <Card
                key={index}
                className={`text-center p-8 border-2 hover:border-${role.color}-300 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-in fade-in slide-in-from-bottom duration-500`}
                style={{ animationDelay: `${role.delay}ms` }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r from-${role.color}-500 to-${role.color}-600 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-200`}
                >
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{role.title}</h3>
                <p className="text-gray-600 mb-6">{role.description}</p>
                <Button
                  className={`bg-${role.color}-600 hover:bg-${role.color}-700 hover:scale-105 transition-all duration-200`}
                >
                  {role.buttonText}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Welcome to the HealthVerse</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                HealthVerse AI creates an intelligent healthcare universe where predictive AI meets immersive VR
                therapy, blockchain security ensures trust, and gamified wellness tokens motivate healthy behaviors. Our
                platform transforms reactive healthcare into proactive, personalized wellness journeys.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                From AI mood forecasting to emergency drone simulations, we're building the most advanced healthcare
                ecosystem that combines cutting-edge technology with human empathy.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-left duration-700 delay-200">
                  <Lock className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-left duration-700 delay-400">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">ISO 27001 Certified</span>
                </div>
              </div>
            </div>
            <div className="relative animate-in fade-in slide-in-from-right duration-700">
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-gray-600 font-medium">AI-Powered Healthcare Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-500 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white animate-in fade-in slide-in-from-top duration-500">
            Enter the HealthVerse Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed animate-in fade-in slide-in-from-top duration-500 delay-200">
            Join the AI-powered healthcare revolution with predictive mood analysis, VR therapy, and intelligent
            wellness tokens. Experience healthcare that anticipates your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom duration-500 delay-400">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 hover:scale-105 transition-all duration-200"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 bg-transparent hover:scale-105 transition-all duration-200"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center animate-pulse">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">HealthVerse AI</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Revolutionizing healthcare through AI prediction, VR therapy, blockchain security, and intelligent
                wellness. Your health universe, powered by AI.
              </p>
              <div className="text-gray-400">
                <p>Email: contact@healthverse.ai</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white transition-colors duration-200">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors duration-200">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors duration-200">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors duration-200">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white transition-colors duration-200">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-white transition-colors duration-200">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HealthVerse AI. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </div>
  )
}
