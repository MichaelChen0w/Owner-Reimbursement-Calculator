// This is a direct email sending service that works in both client and server environments
// It uses the EmailJS service which is compatible with Edge runtime

export async function sendEmail(to: string, subject: string, csvContent: string): Promise<boolean> {
  try {
    // Create the email payload
    const payload = {
      service_id: "gmail", // Replace with your EmailJS service ID
      template_id: "template_default", // Replace with your EmailJS template ID
      user_id: "user_id", // Replace with your EmailJS user ID
      template_params: {
        to_email: to,
        from_name: "ORC Calculator",
        subject: subject,
        message: "Please find attached your ORC calculation results from the Northern Territory Government.",
        reply_to: "lyuhan322@gmail.com",
      },
      accessToken: "your_access_token", // Optional: Replace with your EmailJS access token if you have one
    }

    // Send the email directly from the client
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("Failed to send email")
    }

    return true
  } catch (error) {
    console.error("Email sending error:", error)
    return false
  }
}
