"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password strength validation
  const validatePassword = (password: string): { valid: boolean; message: string } => {
    if (password.length < 8) {
      return { valid: false, message: "Password must be at least 8 characters long" }
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: "Password must contain at least one uppercase letter" }
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: "Password must contain at least one lowercase letter" }
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: "Password must contain at least one number" }
    }
    return { valid: true, message: "" }
  }

  // Check if user already exists
  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.admin?.getUserByEmail(email)
      // If admin API is not available, we'll handle it in the signup error
      if (error) return false
      return !!data?.user
    } catch {
      // If admin API is not accessible, we'll rely on signup error handling
      return false
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    // Trim email
    const trimmedEmail = email.trim().toLowerCase()

    // Validate email format
    if (!trimmedEmail) {
      setError("Email is required")
      setLoading(false)
      return
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    // Validate password
    if (!password) {
      setError("Password is required")
      setLoading(false)
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.message)
      setLoading(false)
      return
    }

    // Check password match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      // Attempt signup - Supabase will return an error if user already exists
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        // Handle specific Supabase errors
        if (signUpError.message.includes("already registered") || signUpError.message.includes("already exists")) {
          setError("An account with this email already exists. Please try logging in instead.")
        } else if (signUpError.message.includes("Invalid email")) {
          setError("Please enter a valid email address")
        } else if (signUpError.message.includes("Password")) {
          setError("Password does not meet requirements. Please ensure it's at least 8 characters with uppercase, lowercase, and numbers.")
        } else {
          setError(signUpError.message || "An error occurred during signup. Please try again.")
        }
        setLoading(false)
        return
      }

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        // Email confirmation required
        setSuccess(true)
        setTimeout(() => {
          router.push("/auth/signup-success")
        }, 1500)
      } else if (data?.session) {
        // User is immediately signed in (if email confirmation is disabled)
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Join ATOMi to access exclusive content and updates</CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
              <AlertDescription className="text-green-800 dark:text-green-200">
                Account created successfully! Redirecting to confirmation page...
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                disabled={loading}
                className={error ? "border-red-500" : ""}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                disabled={loading}
                className={error ? "border-red-500" : ""}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError(null)
                }}
                disabled={loading}
                className={error ? "border-red-500" : ""}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading || success}>
              {loading ? "Creating account..." : success ? "Account created!" : "Create Account"}
            </Button>
          </form>
          <p className="text-center text-sm mt-4 text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
          <p className="text-center text-xs mt-2 text-muted-foreground">
            By signing up, you agree to our terms of service and privacy policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
