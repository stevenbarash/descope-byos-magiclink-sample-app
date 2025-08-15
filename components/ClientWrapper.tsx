"use client"

import { useEffect, useState } from "react"
import { useSession } from "@descope/nextjs-sdk/client"
import { useRouter } from "next/navigation"
import AuthFlow from "./AuthFlow"
import DashboardUI from "./DashboardUI"
import LoadingSpinner from "./LoadingSpinner"
import { useDescope } from "@descope/nextjs-sdk/client"

export default function ClientWrapper() {
  const router = useRouter()
  const { isAuthenticated, isSessionLoading } = useSession()
  const sdk = useDescope()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = async () => {
    try {
      await sdk.logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return <LoadingSpinner message="Loading..." />
  }

  // Show loading screen while session is loading
  if (isSessionLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />
  }

  // Render authenticated or unauthenticated content
  if (isAuthenticated) {
    return <DashboardUI onLogout={handleLogout} />
  } else {
    return <AuthFlow />
  }
} 