"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DoctorDashboard } from "@/components/doctor/doctor-dashboard"

export default function DoctorPage() {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorDashboard />
    </ProtectedRoute>
  )
}
