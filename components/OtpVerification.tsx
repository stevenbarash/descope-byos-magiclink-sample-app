"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import "./otpVerification.css"

interface OtpVerificationProps {
  email: string
  onSubmit: (data: { form: { code: string }, sentTo: { maskedEmail: string } }) => void
  onResendClick: () => void
  onBackClick: () => void
  errorText?: string
  onFormUpdate?: (data: Record<string, string>) => void
  onChange?: () => void
  state?: { error?: { text?: string, code?: string }, screenName?: string, next?: (stepId: string, data?: any) => Promise<void> }
}

export default function OtpVerification({
  email,
  onSubmit,
  onResendClick,
  onBackClick,
  errorText,
  onFormUpdate,
  onChange,
  state,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Reset OTP input when error is E061102
  useEffect(() => {
    if (state?.error?.code === "E061102") {
      setOtp(Array(6).fill(""))
      setIsSubmitting(false)
    }
  }, [state?.error?.code])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1)
    setOtp(newOtp)

    // Update form state
    if (onFormUpdate) {
      onFormUpdate({ code: newOtp.join('') })
    }
    if (onChange) {
      onChange()
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle key press for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on empty input
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste functionality
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a valid OTP (numbers only)
    if (!/^\d+$/.test(pastedData)) return

    // Fill the OTP fields with pasted data
    const newOtp = [...otp]
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)

    // Focus the next empty field or the last field
    const nextEmptyIndex = newOtp.findIndex((val) => !val)
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      setIsSubmitting(true)
      onSubmit({
        form: {
          code: otpValue
        },
        sentTo: {
          maskedEmail: email
        }
      })

      // Reset submitting state after a delay (in case of error)
      setTimeout(() => {
        setIsSubmitting(false)
      }, 2000)
    }
  }

  // Handle resend click
  const handleResend = () => {
    if (canResend) {
      setIsResending(true)
      onResendClick()

      // Reset the countdown
      setTimeout(() => {
        setIsResending(false)
        setCanResend(false)
        setCountdown(60)
      }, 1000)
    }
  }

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="card-header">
          <div className="logo-container">
            <h2 className="custom-logo">{`{Your Logo Here}`}</h2>
          </div>
          <h1>Enter the 6-digit code sent to {email}</h1>
        </div>

        <div className="otp-input-group">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              ref={(el) => { inputRefs.current[index] = el }}
              className="otp-input"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {errorText && <p className="error-message">{errorText}</p>}

        <button
          className={`submit-button ${isSubmitting ? "submitting" : ""} ${otp.join("").length !== 6 ? "disabled" : ""}`}
          onClick={handleSubmit}
          disabled={otp.join("").length !== 6 || isSubmitting}
        >
          <span className="button-text">Continue</span>
          <span className="loading-spinner"></span>
        </button>

        <div className="action-links">
          <button
            className={`resend-link ${canResend ? "active" : "disabled"} ${isResending ? "resending" : ""}`}
            onClick={handleResend}
            disabled={!canResend || isResending}
          >
            {isResending ? "Resending..." : canResend ? "Resend code" : `Resend code in ${countdown}s`}
          </button>

          <button className="back-link" onClick={onBackClick}>
            Use a different email address
          </button>
        </div>
      </div>
    </div>
  )
}
