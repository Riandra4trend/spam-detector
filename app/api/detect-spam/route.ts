import { type NextRequest, NextResponse } from "next/server"

interface SpamDetectionResult {
  isSpam: boolean
  confidence: number
  reasons: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const result = detectSpam(message)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in spam detection:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function detectSpam(message: string): SpamDetectionResult {
  const reasons: string[] = []
  let spamScore = 0

  // Convert to lowercase for analysis
  const lowerMessage = message.toLowerCase()

  // Check for excessive capitalization
  const capsCount = (message.match(/[A-Z]/g) || []).length
  const capsRatio = capsCount / message.length
  if (capsRatio > 0.3 && message.length > 10) {
    spamScore += 25
    reasons.push("Excessive use of capital letters")
  }

  // Check for spam keywords
  const spamKeywords = [
    "congratulations",
    "winner",
    "won",
    "prize",
    "free",
    "urgent",
    "act now",
    "limited time",
    "click here",
    "call now",
    "guaranteed",
    "no risk",
    "money back",
    "earn money",
    "make money",
    "work from home",
    "viagra",
    "casino",
    "lottery",
    "inheritance",
    "nigerian prince",
    "tax refund",
    "credit card",
    "loan approved",
    "debt relief",
    "weight loss",
  ]

  const foundKeywords = spamKeywords.filter((keyword) => lowerMessage.includes(keyword))

  if (foundKeywords.length > 0) {
    spamScore += foundKeywords.length * 15
    reasons.push(`Contains spam keywords: ${foundKeywords.join(", ")}`)
  }

  // Check for excessive exclamation marks
  const exclamationCount = (message.match(/!/g) || []).length
  if (exclamationCount > 2) {
    spamScore += 10
    reasons.push("Excessive use of exclamation marks")
  }

  // Check for suspicious URLs or links
  const urlPattern = /(http|https|www\.|\.com|\.net|\.org|click here|link)/gi
  if (urlPattern.test(message)) {
    spamScore += 20
    reasons.push("Contains suspicious links or URLs")
  }

  // Check for phone numbers
  const phonePattern = /(\d{3}[-.]?\d{3}[-.]?\d{4}|$$\d{3}$$\s?\d{3}[-.]?\d{4})/
  if (phonePattern.test(message)) {
    spamScore += 15
    reasons.push("Contains phone number")
  }

  // Check for money-related content
  const moneyPattern = /(\$\d+|money|cash|dollars|payment|pay|cost)/gi
  if (moneyPattern.test(message)) {
    spamScore += 10
    reasons.push("Contains money-related content")
  }

  // Check for urgency words
  const urgencyWords = ["urgent", "immediate", "asap", "hurry", "expires", "deadline"]
  const foundUrgencyWords = urgencyWords.filter((word) => lowerMessage.includes(word))

  if (foundUrgencyWords.length > 0) {
    spamScore += 15
    reasons.push("Contains urgency indicators")
  }

  // Check message length (very short messages are often spam)
  if (message.length < 20 && spamScore > 0) {
    spamScore += 10
    reasons.push("Suspiciously short message")
  }

  // Check for repeated characters
  const repeatedPattern = /(.)\1{3,}/g
  if (repeatedPattern.test(message)) {
    spamScore += 10
    reasons.push("Contains repeated characters")
  }

  // Determine if spam based on score
  const isSpam = spamScore >= 30
  const confidence = Math.min(95, Math.max(55, spamScore + 20))

  // If not spam, provide positive reasons
  if (!isSpam && reasons.length === 0) {
    reasons.push("Message appears to be legitimate communication")
  }

  return {
    isSpam,
    confidence,
    reasons,
  }
}
