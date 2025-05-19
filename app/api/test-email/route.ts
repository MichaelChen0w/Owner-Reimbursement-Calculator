import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// 使用Node运行时以支持nodemailer
export const runtime = "nodejs"

// 直接硬编码SMTP凭据，确保所有部署环境都能使用
const SMTP_CONFIG = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "lyuhan322@gmail.com",
    pass: "cxhe eduz ddtt dpnz",
  },
  // 禁用安全检查以确保邮件发送
  tls: {
    rejectUnauthorized: false,
  },
}

// 发件人信息
const EMAIL_FROM = "ORC Calculator <lyuhan322@gmail.com>"

export async function GET(request: NextRequest) {
  try {
    console.log("测试SMTP连接到Gmail...")

    // 创建邮件传输器，使用硬编码的SMTP配置
    const transporter = nodemailer.createTransport(SMTP_CONFIG)

    // 测试SMTP连接
    await transporter.verify()
    console.log("✅ SMTP连接验证成功")

    // 尝试发送测试邮件
    const url = new URL(request.url)
    const testEmail = url.searchParams.get("email") || "lyuhan322@gmail.com"

    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: testEmail,
      subject: "SMTP Test Email",
      text: "This is a test email to verify SMTP configuration is working correctly.",
      html: "<p>This is a test email to verify SMTP configuration is working correctly.</p>",
    })

    console.log("✅ 测试邮件发送成功:", info.messageId)

    return NextResponse.json({
      success: true,
      message: `SMTP connection verified and test email sent successfully to ${testEmail}`,
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("❌ SMTP测试失败:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        suggestion: "Please check your SMTP configuration",
      },
      { status: 500 },
    )
  }
}
