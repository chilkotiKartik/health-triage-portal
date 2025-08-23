"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { PatientDashboard } from "@/components/patient/patient-dashboard"

export default function PatientPage() {
  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <PatientDashboard />
    </ProtectedRoute>
  )
}
