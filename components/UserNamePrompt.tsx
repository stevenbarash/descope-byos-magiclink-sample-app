"use client"

import { useState, useEffect } from "react"
import "./userNamePrompt.css"

interface UserNamePromptProps {
  onFormUpdate: (data: Record<string, string>) => void;
  onSubmit: () => void;
  onChange: () => void;
  errorText?: string;
}

export default function UserNamePrompt({ onFormUpdate, onSubmit, onChange, errorText }: UserNamePromptProps) {
  const [fullName, setFullName] = useState("")
  const [focused, setFocused] = useState(false)
  const [valid, setValid] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation
  useEffect(() => {
    if (fullName) {
      setValid(fullName.trim().length > 0)
    } else {
      setValid(true)
    }
  }, [fullName])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFullName(value)
    onFormUpdate({ fullName: value })
    onChange()
  }

  const handleSubmit = () => {
    if (fullName.trim() && valid) {
      setIsSubmitting(true)
      setTimeout(() => {
        onSubmit()
      }, 600)
    }
  }

  return (
    <div className="name-prompt-container">
      <div className="name-prompt-card">
        <div className="card-header">
          <div className="logo-container">
            <h2 className="custom-logo">{`{Your Logo Here}`}</h2>
          </div>
          <h1>Tell us about yourself</h1>
          <p>We'll use this information to personalise your experience</p>
        </div>

        <div className="input-group">
          <div className={`custom-input ${focused ? "focused" : ""} ${!valid && fullName ? "invalid" : ""}`}>
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={handleInputChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Full name"
              required
            />
          </div>

          {errorText && <p className="error-message">{errorText}</p>}
          {!valid && fullName && <p className="validation-message">Please enter your full name</p>}
        </div>

        <button
          className={`submit-button ${isSubmitting ? "submitting" : ""} ${!valid || !fullName ? "disabled" : ""}`}
          type="button"
          onClick={handleSubmit}
          disabled={!valid || !fullName || isSubmitting}
        >
          <span className="button-text">Continue</span>
          <span className="loading-spinner"></span>
        </button>
      </div>
    </div>
  )
}
