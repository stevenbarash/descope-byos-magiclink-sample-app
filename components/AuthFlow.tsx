"use client"

import { useState } from "react"
import { Descope } from "@descope/nextjs-sdk"
import { useRouter } from "next/navigation"
import EmailInput from "./EmailInput"
import MagicLinkSent from "./MagicLinkSent"
import UserNamePrompt from "./UserNamePrompt"
import PasswordInput from "./PasswordInput"

const emailScreenName = "Email Input"
const magicLinkSentScreenName = "Magic Link Sent"
const nameScreenName = "User Information"
const passwordInputScreenName = "Password Input"

interface FormState {
  email?: string;
  fullName?: string;
  password?: string;    
}

export default function AuthFlow() {
  const router = useRouter()
  const [state, setState] = useState<{ error: { text?: string }, screenName?: string, next?: (stepId: string, data?: any) => Promise<void> }>({ error: {} })
  const [form, setForm] = useState<FormState>({})

  return (
    <div style={{
      backgroundColor: '#11100A',
      color: '#ffffff',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Descope
        flowId="sign-up-or-in-magic-link-risk-signal"
        onScreenUpdate={(screenName: string, state: { error: {} }, next: any) => {
          console.log("STATE", screenName, state)
          setState((prevState) => ({ ...prevState, ...state, next, screenName }))

          return (
            screenName === emailScreenName ||
            screenName === magicLinkSentScreenName ||
            screenName === nameScreenName ||
            screenName === passwordInputScreenName
          )
        }}
        onSuccess={() => {
          console.log("success")
          setState((prevState) => ({ ...prevState }))
          router.push("/dashboard")
        }}
      >
        {state?.screenName === emailScreenName &&
          <EmailInput
            onFormUpdate={setForm}
            onClick={async () => {
              if (state.next) {
                await state.next('emailSubmitButton', { email: form.email })
              }
            }}
            errorText={state?.error?.text}
            onChange={() => {
              setState(prevState => ({ ...prevState }))
            }}
          />}

        {state?.screenName === magicLinkSentScreenName &&
          <MagicLinkSent
            email={form.email || ''}
            onPolling={async () => {
              if (state.next) {
                await state.next('polling', {})
              }
            }}
            onResendClick={async () => {
              if (state.next) {
                await state.next('resend', {})
              }
            }}
            errorText={state?.error?.text}
            onChange={() => {
              setState(prevState => ({ ...prevState }))
            }}
            state={state}
          />}

        {state?.screenName === nameScreenName &&
          <UserNamePrompt
            onFormUpdate={setForm}
            onSubmit={async () => {
              if (state.next) {
                await state.next('submitNameFormButton', { fullName: form.fullName })
              }
            }}
            errorText={state?.error?.text}
            onChange={() => {
              setState(prevState => ({ ...prevState }))
            }}
          />}

        {state?.screenName === passwordInputScreenName &&
          <PasswordInput
            onFormUpdate={setForm}
            onClick={async () => {
              if (state.next) {
                await state.next('passwordSubmitButton', { email: form.email, password: form.password })
              }
            }}
            errorText={state?.error?.text}
            onChange={() => {
              setState(prevState => ({ ...prevState }))
            }}
          />}

      </Descope>
    </div>
  )
}
