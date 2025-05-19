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

export async function POST(request: NextRequest) {
  try {
    const { email, subject, csvContent, pdfData } = await request.json()

    if (!email || (!csvContent && !pdfData)) {
      console.error("缺少必要字段:", { email: !!email, csvContent: !!csvContent, pdfData: !!pdfData })
      return NextResponse.json({ error: "Email and report content are required" }, { status: 400 })
    }

    console.log(`正在尝试发送邮件到: ${email}`)

    // 创建邮件传输器，使用硬编码的SMTP配置
    const transporter = nodemailer.createTransport(SMTP_CONFIG)

    // 生成文件名
    const fileName = `NT_ORC_Calculation_${new Date().toISOString().split("T")[0]}`
    const fileExtension = pdfData ? "pdf" : "csv"

    // 准备邮件选项
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: subject || "Your ORC Calculation Results - NT Government",
      text: `
Dear User,

Thank you for using the NT Government ORC Calculator.

Please find attached your ORC calculation results. This report contains the detailed breakdown of your Owner Reimbursement Costs calculation.

If you have any questions about this report, please contact the Department of Industry, Tourism and Trade at (08) 8999 5511.

Best regards,
NT Government ORC Calculator Team
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #1a1e5a; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0;">ORC Calculator Report</h1>
    <p style="margin: 5px 0 0;">Northern Territory Government</p>
  </div>
  
  <div style="padding: 20px; border: 1px solid #e0e0e0; background-color: #f9f9f9;">
    <p>Dear User,</p>
    
    <p>Thank you for using the NT Government ORC Calculator.</p>
    
    <p>Please find attached your ORC calculation results. This report contains the detailed breakdown of your Owner Reimbursement Costs calculation.</p>
    
    <p>If you have any questions about this report, please contact the Department of Industry, Tourism and Trade at (08) 8999 5511.</p>
    
    <p>Best regards,<br>NT Government ORC Calculator Team</p>
  </div>
  
  <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #666;">
    <p>&copy; ${new Date().getFullYear()} Northern Territory Government. All rights reserved.</p>
  </div>
</div>
      `,
      attachments: [
        {
          filename: `${fileName}.${fileExtension}`,
          content: pdfData ? Buffer.from(pdfData, "base64") : csvContent,
          contentType: pdfData ? "application/pdf" : "text/csv",
        },
      ],
    }

    console.log(`📧 正在发送邮件，收件人: ${email}, 附件类型: ${fileExtension}`)

    // 发送邮件
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ 邮件发送成功:", info.messageId)

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${email}`,
      messageId: info?.messageId,
    })
  } catch (error) {
    console.error("❌ 邮件发送失败:", error)

    // 详细的错误处理
    let errorMessage = "Failed to send email"

    if (error instanceof Error) {
      errorMessage = error.message

      // 提供更具体的错误信息
      if (error.message.includes("authentication") || error.message.includes("auth")) {
        errorMessage = "Gmail authentication failed. Please check the email and password."
      } else if (error.message.includes("connect") || error.message.includes("connection")) {
        errorMessage = "Failed to connect to Gmail SMTP server. Please check your network connection."
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        suggestion: "Please try downloading the report instead or contact support.",
      },
      { status: 500 },
    )
  }
}
