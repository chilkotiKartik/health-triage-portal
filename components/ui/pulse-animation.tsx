"use client"

import type React from "react"

interface PulseAnimationProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function PulseAnimation({ children, className = "", delay = 0 }: PulseAnimationProps) {
  return (
    <div className={`animate-pulse ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
