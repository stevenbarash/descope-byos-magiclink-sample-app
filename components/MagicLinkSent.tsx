"use client"
import { useState, useEffect } from "react"
import "./magicLinkSent.css"

interface MagicLinkSentProps {
  email: string;
  onPolling: () => void;
  onResendClick: () => void;
  onChange: () => void;
  errorText?: string;
  state?: any;
}

export default function MagicLinkSent({ 
  email, 
  onPolling, 
  onResendClick, 
  onChange, 
  errorText, 
  state 
}: MagicLinkSentProps) {
  const [canResend, setCanResend] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)

  // Handle polling for magic link authentication
  useEffect(() => {
    const pollInterval = setInterval(() => {
      onPolling()
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(pollInterval)
  }, [onPolling])

  // Handle resend countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendCountdown])

  const handleResend = async () => {
    if (canResend) {
      setIsResending(true)
      setCanResend(false)
      setResendCountdown(60) // 60 second countdown
      await onResendClick()
      setIsResending(false)
    }
  }

  return (
    <div className="magic-link-container">
      <div className="magic-link-card">
        <div className="card-header">
          <div className="logo-container">
            <h2 className="custom-logo">{`{Your Logo Here}`}</h2>
          </div>
          <h1><b>Check your email</b></h1>
        </div>

        <div className="content-section">
          <div className="email-info">
            <p>We've sent a magic link to:</p>
            <p className="email-display">{email}</p>
          </div>

          <div className="instructions">
            <p>Click the link in your email to sign in. The link will expire in 10 minutes.</p>
          </div>

          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Checking for authentication...</p>
          </div>

          {errorText && <p className="error-message">{errorText}</p>}
        </div>

        <div className="resend-section">
          <p>Didn't receive the email?</p>
          <button
            className={`resend-button ${!canResend || isResending ? "disabled" : ""}`}
            type="button"
            onClick={handleResend}
            disabled={!canResend || isResending}
          >
            {isResending ? (
              "Sending..."
            ) : canResend ? (
              "Send again"
            ) : (
              `Send again in ${resendCountdown}s`
            )}
          </button>
        </div>

        <div className="help-links">
          <a href="#" className="help-link"><b>Get help signing in</b></a>
          <a href="#" className="help-link">Find out more about accounts</a>
        </div>
      </div>
    </div>
  )
} 