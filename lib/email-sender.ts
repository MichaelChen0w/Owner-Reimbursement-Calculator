// This file provides email sending capability by calling the API route

/**
 * Sends an email with a CSV attachment
 * @param to Recipient email address
 * @param subject Email subject
 * @param csvContent CSV content as string
 * @returns Promise resolving to success status
 */
export async function sendEmail(to: string, subject: string, csvContent: string): Promise<boolean> {
  try {
    // Validate email format
    if (!isValidEmail(to)) {
      throw new Error("Invalid email address format")
    }

    // Call the API route with improved error handling
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: to,
        subject,
        csvContent,
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      console.error("Email API error response:", data)
      throw new Error(data.error || "Failed to send email")
    }

    return true
  } catch (error) {
    console.error("Email sending error:", error)
    return false
  }
}

/**
 * Validates an email address format
 * @param email Email address to validate
 * @returns Boolean indicating if email is valid
 */
function isValidEmail(email: string): boolean {
  // More comprehensive email validation regex
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return emailRegex.test(email)
}
