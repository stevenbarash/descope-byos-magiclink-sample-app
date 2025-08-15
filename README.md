![Descope Bring Your Own Screen](readme-banner.png)

# Descope's Bring Your Own Screen Sample App

Welcome to Descope's Bring Your Own Screen Sample App, a demonstration of how to integrate Descope flows with custom screens within a Next.JS application.

## What is BYOS?

Read more here: https://docs.descope.com/flows/screens/byos

**Bring Your Own Screen (BYOS)** allows you to use your own UI components for authentication flows, instead of the default screens provided by Descope. You maintain full control over the look, feel, and behavior of every screen, while Descope handles the underlying authentication logic, security, and orchestration.

- **You own the UI:** Every input, button, and error message is designed and rendered by your team.
- **Descope powers the backend:** All authentication steps, risk checks, and flow logic are managed by Descope.

## Why Use BYOS?

Read more here: https://www.descope.com/blog/post/ui-integration

While Descope Flows let you build authentication journeys visually (with minimal code), BYOS is ideal when you need:

- **Full branding control:** Match your company's design system and UX standards exactly.
- **Accessibility or compliance:** Meet strict regulatory or accessibility requirements.
- **Deep integration:** Embed authentication seamlessly into complex or highly interactive apps.

**Key tradeoffs to keep in mind compared to using Descope's default flow screens:**
- BYOS requires more frontend development effort than using Descope's default flows.
- You must keep your UI in sync with any changes to your authentication logic.

## What This Project Demonstrates

This project demonstrates Descope's "Bring Your Own Screen" feature, which allows developers to:
- Customize the entire authentication UI while leveraging Descope flows and session management
- Maintain full control over the user experience and design
- Integrate authentication flows seamlessly into existing applications
- Use pre-built components or create custom ones
- Handle authentication states and transitions with ease

The implementation includes:
- An "Email Input" screen that prompts users for their email address
- - A "Password Input" screen that prompts users for their password when required
- A "Magic Link Sent" screen that confirms the magic link was sent and handles polling for verification
- A "User Information" screen that prompts new users to enter their full name

## Understanding Flow State and `.next` Handling

Descope's BYOS integration relies on a state-driven approach to orchestrate authentication flows. The core concepts are:

- **State Object:** Contains the current screen name, any error information, and a special `.next` function for advancing the flow.
- **onScreenUpdate:** This callback is triggered by Descope whenever the flow transitions to a new screen. It provides the latest state, the screen name, and the `.next` function.
- **.next Function:** This function is called to move the flow forward. You must provide the correct interaction ID (matching the button or action in your Descope flow) and any required form data.

### Example: State and .next in Action

```tsx
// In components/AuthFlow.tsx
<Descope
  flowId="sign-up-or-in-magic-link-risk-signal"
  onScreenUpdate={(screenName, state, next) => {
    // Update local state with latest info from Descope
    setState((prevState) => ({ ...prevState, ...state, next, screenName }))
    // Return true to use a custom screen for this step
    return screenName === "Email Input"
  }}
  onSuccess={() => { /* handle success */ }}
>
  {state?.screenName === "Email Input" &&
    <EmailInput
      onFormUpdate={setForm}
      onClick={async () => {
        if (state.next) {
          // Advance the flow: pass the interaction ID and form data
          await state.next('emailSubmitButton', { email: form.email })
        }
      }}
      errorText={state?.error?.text}
      onChange={() => setState(prevState => ({ ...prevState }))}
    />}
</Descope>
```

**How it works:**
- When the flow reaches a new screen, `onScreenUpdate` is called with the latest state and `.next`.
- The app updates its local state, so the correct custom component is rendered.
- When the user clicks "Continue", the custom component calls `state.next` with the correct interaction ID and form data. This tells Descope to advance the flow to the next step.
- If there are errors (e.g., invalid input, backend issues), they are included in the state and passed to the component for display.

**Why this matters:**
- This pattern ensures your UI and Descope's backend logic stay in sync.
- You have full control over when and how the flow advances, and can display errors or validation messages as needed.

**Tip:** Always check the Descope flow builder for the correct interaction IDs and required outputs for each screen.

## How BYOS is Implemented in This App

Your app uses BYOS to deliver a fully branded, custom authentication experience. Here's how it works:

### 1. Custom React Components

Each authentication step is implemented as a custom React component. For example, the email input screen:

```tsx
// components/EmailInput.tsx
import { useState, useEffect } from "react"

export default function EmailInput({ onFormUpdate, onClick, onChange, errorText }) {
  const [email, setEmail] = useState("")
  const [valid, setValid] = useState(true)

  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      setValid(emailRegex.test(email))
    } else {
      setValid(true)
    }
  }, [email])

  const handleInputChange = (e) => {
    setEmail(e.target.value)
    onFormUpdate({ [e.target.name]: e.target.value })
    onChange()
  }

  return (
    <div>
      <input
        type="email"
        name="email"
        value={email}
        onChange={handleInputChange}
        required
      />
      {errorText && <p>{errorText}</p>}
      {!valid && email && <p>Please enter a valid email address</p>}
      <button onClick={onClick} disabled={!valid || !email}>Continue</button>
    </div>
  )
}
```

### 2. State Management & Flow Integration

The main authentication flow component (`components/AuthFlow.tsx`) manages the current screen, form state, and transitions between steps using Descope's flow engine:

```tsx
// components/AuthFlow.tsx
import { useState } from "react"
import { Descope } from "@descope/nextjs-sdk"
import EmailInput from "./EmailInput"

export default function AuthFlow() {
  const [state, setState] = useState({ error: {}, screenName: undefined, next: undefined })
  const [form, setForm] = useState({})

  return (
    <Descope
      flowId="sign-up-or-in-magic-link-risk-signal"
      onScreenUpdate={(screenName, state, next) => {
        setState((prevState) => ({ ...prevState, ...state, next, screenName }))
        return screenName === "Email Input"
      }}
      onSuccess={() => { /* handle success */ }}
    >
      {state?.screenName === "Email Input" &&
        <EmailInput
          onFormUpdate={setForm}
          onClick={async () => {
            if (state.next) {
              await state.next('emailSubmitButton', { email: form.email })
            }
          }}
          errorText={state?.error?.text}
          onChange={() => setState(prevState => ({ ...prevState }))}
        />}
    </Descope>
  )
}
```

### 3. Error Handling

Errors from Descope (e.g., invalid credentials, expired OTP) are passed into your components and displayed to users in a branded way:

```tsx
// In EmailInput.tsx
{errorText && <p className="error-message">{errorText}</p>}
{!valid && email && <p className="validation-message">Please enter a valid email address</p>}
```

### 4. Security & Best Practices

- Sensitive data is never exposed in the UI.
- All user input is validated before being sent to Descope.
- Interaction IDs and screen names are managed carefully to ensure the flow works as expected.

## Best Practices & Security

- Keep your custom components focused and reusable.
- Handle errors gracefully and inform users clearly.
- Always validate user input before sending it to Descope.
- Use unique, descriptive names for screens and interaction IDs to avoid flow conflicts.
- Test thoroughly to ensure smooth progression through the authentication flow.