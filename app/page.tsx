"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, CheckCircle, XCircle, Users } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const OCRUploader = dynamic(
  () => import("@/components/ui/OCRUploader"),
  { ssr: false }
);

type SpamResult = {
  label: "Spam" | "Not Spam"
  probability: number
}

export default function SpamDetectorLanding() {
  const [message, setMessage] = useState("")
  const [result, setResult] = useState<SpamResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const detectSpam = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/predict";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) throw new Error(response.statusText)
      const data: SpamResult = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error detecting spam:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <Shield className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">SpamGuard</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">How it Works</Link>
          <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">Contact</Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
                  Detect Spam Messages<span className="text-primary"> Instantly</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Protect yourself from unwanted messages with our AI-powered spam detector.
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>99% Accuracy</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span>Privacy First</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detection Interface */}
        <section className="w-full py-12 flex justify-center">
        <div className="container px-4 md:px-6 max-w-3xl">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Test Your Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload gambar */}
              <OCRUploader onTextExtracted={setMessage} />
              {/* Textarea manual atau hasil OCR */}
              <Textarea
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] resize-none"
              />

              <Button
                onClick={detectSpam}
                disabled={!message.trim() || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Analyzing..." : "Detect Spam"}
              </Button>

              {result && (
                <Card
                  className={`mt-6 ${
                    result.label === "Spam" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {result.label === "Spam" ? (
                          <XCircle className="h-6 w-6 text-red-500" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        )}
                        <span className="text-lg font-semibold">
                          {result.label === "Spam" ? "SPAM DETECTED" : "LEGITIMATE"}
                        </span>
                      </div>
                      <Badge variant={result.label === "Spam" ? "destructive" : "default"}>
                        {Math.round(result.probability * 100)}% confidence
                      </Badge>
                    </div>
                    <pre className="text-xs text-muted-foreground overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose SpamGuard?</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Advanced features to keep you protected from spam messages
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Lightning Fast</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get instant results with our optimized detection algorithms. No waiting, no delays.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>High Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our AI model achieves 99% accuracy in distinguishing between spam and legitimate messages.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Privacy First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your messages are processed securely and never stored. Complete privacy guaranteed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Simple, fast, and effective spam detection in three steps
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Input Message</h3>
                <p className="text-muted-foreground">
                  Paste or type the message you want to analyze into our secure text box.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our advanced AI analyzes the message for spam indicators and patterns.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Results</h3>
                <p className="text-muted-foreground">
                  Receive instant results with confidence scores and detailed explanations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">1M+</div>
                <p className="text-muted-foreground">Messages Analyzed</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">99%</div>
                <p className="text-muted-foreground">Accuracy Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50K+</div>
                <p className="text-muted-foreground">Happy Users</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <p className="text-muted-foreground">Available</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between py-6 px-4 lg:px-6 border-t text-xs text-muted-foreground">
        <span>© 2025 SpamGuard. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="#">Terms</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
