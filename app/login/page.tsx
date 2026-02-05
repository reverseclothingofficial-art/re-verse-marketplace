"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Phone, User, Shield } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp" | "signup">("phone")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isNewUser, setIsNewUser] = useState(false)
const api=process.env.NEXT_PUBLIC_API_URL
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit mobile number")
      setLoading(false)
      return
    }

    try {
      // Simulate API call to check if user exists
      const response = await fetch(`${api}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      if (response.status === 404) {
        // User doesn't exist, show signup form
        setIsNewUser(true)
        setStep("signup")
      } else if (response.status===200) {
        // User exists, send OTP
        setStep("otp")
      } else {
        setError("Something went wrong. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!name.trim()) {
      setError("Please enter your name")
      setLoading(false)
      return
    }

    try {
      // Simulate API call for signup
      const response = await fetch(`${api}/api/user/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      })

      if (response.status===200) {
        setStep("otp")
      } else {
        const data = await response.json()
        setError(data.message || "Signup failed. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      setLoading(false)
      return
    }

    try {
      // Simulate OTP verification
      const response = await fetch(`${api}/api/user/verifyOtp/${phone}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({otp }),
      })

      if (response.status===200) {
        // Redirect to homepage or dashboard
        const data =await response.json()
        const resp1 = await fetch(`/api/set-cookie?token=${data.token}`);
      const newdata = await resp1.json();
      if(resp1.ok){
        window.location.href = "/"
      }
        
      } else {
        setError("Invalid OTP. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const resendOtp = async () => {
    setLoading(true)
    try {
      // Simulate OTP verification
      const response = await fetch(`${api}/api/user/verifyOtp/${phone}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({otp }),
      })

      if (response.status===200) {
        // Redirect to homepage or dashboard
        const data =await response.json()
        const resp1 = await fetch(`/api/set-cookie?token=${data.token}`);
      const newdata = await resp1.json();
      if(resp1.ok){
        window.location.href = "/"
      }
        
      } else {
        setError("Invalid OTP. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#4FC3F7]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-[#455A64] hover:text-[#4FC3F7] mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#33BF69] to-[#4FC3F7] rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <h1 className="text-2xl font-bold text-[#455A64] mb-2">Welcome to RE-VERSE</h1>
          <p className="text-gray-600">Sustainable fashion marketplace</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              {step === "phone" && <Phone className="h-8 w-8 text-[#4FC3F7]" />}
              {step === "signup" && <User className="h-8 w-8 text-[#33BF69]" />}
              {step === "otp" && <Shield className="h-8 w-8 text-[#FF6F61]" />}
            </div>
            <CardTitle className="text-xl text-[#455A64]">
              {step === "phone" && "Enter Mobile Number"}
              {step === "signup" && "Create Account"}
              {step === "otp" && "Verify OTP"}
            </CardTitle>
            <CardDescription>
              {step === "phone" && "We'll send you a verification code"}
              {step === "signup" && "Just one more step to get started"}
              {step === "otp" && `Code sent to +91 ${phone}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            {step === "phone" && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#455A64]">
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">+91</span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-12 border-[#455A64]/20 focus:border-[#4FC3F7] rounded-lg"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#4FC3F7] to-[#33BF69] hover:from-[#33BF69] hover:to-[#4FC3F7] text-white rounded-lg py-3 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Checking..." : "Continue"}
                </Button>
              </form>
            )}

            {step === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#455A64]">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-[#455A64]/20 focus:border-[#33BF69] rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#455A64]">Mobile Number</Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-600">+91 {phone}</div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#33BF69] to-[#4FC3F7] hover:from-[#4FC3F7] hover:to-[#33BF69] text-white rounded-lg py-3 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-[#455A64]">
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-2xl tracking-widest border-[#455A64]/20 focus:border-[#FF6F61] rounded-lg"
                    maxLength={6}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF6F61] to-[#4FC3F7] hover:from-[#4FC3F7] hover:to-[#FF6F61] text-white rounded-lg py-3 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="text-[#4FC3F7] hover:text-[#33BF69] text-sm font-medium transition-colors"
                    disabled={loading}
                  >
                    Didn't receive OTP? Resend
                  </button>
                </div>
              </form>
            )}

            <div className="text-center text-xs text-gray-500 mt-6">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-[#4FC3F7] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#4FC3F7] hover:underline">
                Privacy Policy
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3">
            <div className="w-8 h-8 bg-[#33BF69]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="h-4 w-4 text-[#33BF69]" />
            </div>
            <p className="text-xs text-gray-600">Secure</p>
          </div>
          <div className="p-3">
            <div className="w-8 h-8 bg-[#4FC3F7]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Phone className="h-4 w-4 text-[#4FC3F7]" />
            </div>
            <p className="text-xs text-gray-600">Quick Login</p>
          </div>
          <div className="p-3">
            <div className="w-8 h-8 bg-[#FF6F61]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="h-4 w-4 text-[#FF6F61]" />
            </div>
            <p className="text-xs text-gray-600">Personalized</p>
          </div>
        </div>
      </div>
    </div>
  )
}
