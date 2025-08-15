
"use client"
import React from "react"
import "./emailInput.css"

interface PasswordInputProps {
  onFormUpdate: (form: { password: string }) => void;
  onClick: () => void;
  errorText?: string;
  onChange?: () => void;
}

export default function PasswordInput({ onFormUpdate, onClick, errorText, onChange }: PasswordInputProps) {
  const [password, setPassword] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const [valid, setValid] = React.useState(true);

  React.useEffect(() => {
    if (password) {
      setValid(password.length >= 6); // Example: min 6 chars
    } else {
      setValid(true);
    }
  }, [password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    onFormUpdate({ password: e.target.value });
    if (onChange) onChange();
  };

  const handleSubmit = () => {
    if (password && valid) {
      setAnimating(true);
      setTimeout(() => {
        onClick();
      }, 600);
    }
  };

  return (
    <div className="email-container">
      <div className="email-card fixed-width-group">
        <div className="card-header">
          <div className="logo-container">
            <h2 className="custom-logo">{`{Your Logo Here}`}</h2>
          </div>
          <h1><b>Enter your password</b></h1>
        </div>

  <div className="input-group fixed-width-group">
          <div className={`custom-input ${focused ? "focused" : ""} ${!valid && password ? "invalid" : ""}`}>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder=" "
              required
              // No inline width, use CSS for consistency
            />
            <label>Password</label>
          </div>

          {errorText && <p className="error-message">{errorText}</p>}
          {!valid && password && <p className="validation-message">Password must be at least 6 characters</p>}
        </div>

        <button
          className={`sign-in-button ${animating ? "animating" : ""} ${!valid || !password ? "disabled" : ""}`}
          type="button"
          onClick={handleSubmit}
          disabled={!valid || !password || animating}
        >
          <span className="button-text">Continue</span>
          <span className="loading-spinner"></span>
        </button>

        <div className="help-links">
          <a href="#" className="help-link"><b>Get help signing in</b></a>
          <a href="#" className="help-link">Find out more about accounts</a>
        </div>
      </div>
    </div>
  );
}
