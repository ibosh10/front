"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { Loader2, Mail, RefreshCw } from "lucide-react"

export default function VerifyPage() {
    const [formData, setFormData] = useState({
        email: "",
        verificationCode: "",
    })
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const { toast } = useToast()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Get email from URL params if available
        const emailFromUrl = searchParams.get("email")
        if (emailFromUrl) {
            setFormData((prev) => ({ ...prev, email: emailFromUrl }))
        }
    }, [searchParams])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.email.trim()) {
            toast({
                title: "Email required",
                description: "Please enter your email address",
                variant: "destructive",
            })
            return
        }

        if (!formData.verificationCode.trim()) {
            toast({
                title: "Verification code required",
                description: "Please enter the verification code",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        try {
            await apiClient.post("/api/auth/verify", {
                email: formData.email.trim(),
                verificationCode: formData.verificationCode.trim(),
            })

            toast({
                title: "Email verified successfully! ✅",
                description: "You can now login to your account",
            })

            router.push("/auth/login")
        } catch (error: any) {
            toast({
                title: "Verification failed",
                description: error.response?.data?.message || "Invalid verification code. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleResendCode = async () => {
        if (!formData.email.trim()) {
            toast({
                title: "Email required",
                description: "Please enter your email address first",
                variant: "destructive",
            })
            return
        }

        setResending(true)
        try {
            await apiClient.post(`/api/auth/resend-verification?email=${encodeURIComponent(formData.email.trim())}`)
            toast({
                title: "Verification code sent! 📧",
                description: "Please check your email for the new verification code",
            })
        } catch (error: any) {
            toast({
                title: "Failed to resend code",
                description: error.response?.data?.message || "Something went wrong. Please try again.",
                variant: "destructive",
            })
        } finally {
            setResending(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
            <Card className="w-full max-w-md shadow-xl border-0">
                <CardHeader className="text-center pb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Mail className="text-white h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-purple-800 bg-clip-text text-transparent">
                        Verify Your Email
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Enter the verification code sent to your email address
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address *
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                                className="mt-1 h-11 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                            />
                        </div>

                        <div>
                            <Label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
                                Verification Code *
                            </Label>
                            <Input
                                id="verificationCode"
                                name="verificationCode"
                                type="text"
                                value={formData.verificationCode}
                                onChange={handleChange}
                                required
                                placeholder="Enter 6-digit verification code"
                                maxLength={6}
                                className="mt-1 h-11 border-2 border-gray-200 focus:border-blue-500 rounded-lg text-center text-lg font-mono tracking-widest"
                            />
                            <p className="text-xs text-gray-500 mt-1">Check your email for the 6-digit code</p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify Email
                        </Button>
                    </form>

                    <div className="mt-8 space-y-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
                            <Button
                                variant="outline"
                                onClick={handleResendCode}
                                disabled={resending}
                                className="w-full bg-transparent border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                            >
                                {resending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Resend Verification Code
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Already verified?{" "}
                                <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
