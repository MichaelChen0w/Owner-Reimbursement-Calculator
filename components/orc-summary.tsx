"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Mail, Check, Download, FileText, AlertCircle, ChevronRight, Info } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export function ORCSummary({ results, formData, onRestart }: { results: any; formData: any; onRestart?: () => void }) {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showNextStepsEmailForm, setShowNextStepsEmailForm] = useState(false)
  const pdfContentRef = useRef<HTMLDivElement>(null)

  if (!formData) {
    return <p>No form data available. Please try again.</p>
  }

  const handlePrint = () => {
    window.print()
  }

  // Function to create PDF content with improved formatting for government reports
  const createPdfContent = () => {
    // Generate a reference number and date for the report
    const referenceNumber = `ORC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`
    const currentDate = new Date().toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    // Determine which crop type we're dealing with
    const isBanana = formData?.cropType === "perennial" && formData?.cropCategory === "banana"
    const isPerennial = formData?.cropType === "perennial"
    const isTreeVineNut = formData?.cropType === "tree-vine-nut"
    const isShortRotation = formData?.cropType === "annual-short-rotation"

    return {
      referenceNumber,
      currentDate,
      cropType:
        formData.cropType === "perennial"
          ? `Perennial - ${formData.cropCategory === "banana" ? "Banana" : "Sugar Cane"}`
          : formData.cropType === "tree-vine-nut"
            ? "Perennial Trees/Vine Crops/Nut Crops"
            : formData.cropType === "annual-short-rotation"
              ? "Annual Short Rotation Crops"
              : "Annual Broad Acre",
      isBanana,
      isPerennial,
      isTreeVineNut,
      isShortRotation,
    }
  }

  // Function to generate and download PDF
  const handleDownloadPDF = async () => {
    if (!pdfContentRef.current) return

    try {
      // Show loading state
      const loadingToast = document.createElement("div")
      loadingToast.className = "fixed top-4 right-4 bg-[#1a1e5a] text-white px-4 py-2 rounded shadow-lg z-50"
      loadingToast.textContent = "Generating PDF..."
      document.body.appendChild(loadingToast)

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Set up PDF document properties
      pdf.setProperties({
        title: "NT Government ORC Calculation Report",
        subject: "Owner Reimbursement Costs Calculation",
        author: "Northern Territory Government",
        keywords: "ORC, compensation, agriculture",
        creator: "NT ORC Calculator",
      })

      // Get content from the ref
      const content = pdfContentRef.current

      // Use html2canvas to capture the content as an image
      const canvas = await html2canvas(content, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      // Calculate the PDF dimensions to maintain aspect ratio
      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 210 // A4 width in mm (portrait)
      const pageHeight = 295 // A4 height in mm (portrait)
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Add the image to the PDF
      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Save the PDF
      pdf.save(`NT_ORC_Calculation_${new Date().toISOString().split("T")[0]}.pdf`)

      // Remove loading toast
      document.body.removeChild(loadingToast)

      // Show success toast
      const successToast = document.createElement("div")
      successToast.className = "fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50"
      successToast.textContent = "PDF downloaded successfully!"
      document.body.appendChild(successToast)

      // Remove success toast after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successToast)
      }, 3000)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  // Update the email sending function to send PDF instead of CSV
  const handleEmailSend = async (fromNextSteps = false) => {
    // 验证邮箱
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("请输入有效的电子邮件地址")
      return
    }

    // 重置错误状态
    setError("")
    setSending(true)

    try {
      // Generate PDF content
      if (!pdfContentRef.current) {
        throw new Error("PDF content not available")
      }

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Set up PDF document properties
      pdf.setProperties({
        title: "NT Government ORC Calculation Report",
        subject: "Owner Reimbursement Costs Calculation",
        author: "Northern Territory Government",
        keywords: "ORC, compensation, agriculture",
        creator: "NT ORC Calculator",
      })

      // Get content from the ref
      const content = pdfContentRef.current

      // Use html2canvas to capture the content as an image
      const canvas = await html2canvas(content, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      // Calculate the PDF dimensions to maintain aspect ratio
      const imgWidth = 210 // A4 width in mm (portrait)
      const pageHeight = 295 // A4 height in mm (portrait)
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Add the image to the PDF
      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Convert PDF to base64
      const pdfData = pdf.output("datauristring").split(",")[1]

      console.log("正在发送邮件到:", email)

      // 通过API发送邮件
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          subject: "Your ORC Calculation Results - NT Government",
          pdfData: pdfData,
        }),
      })

      // 检查HTTP状态码
      if (!response.ok) {
        const errorText = await response.text()
        console.error("邮件API错误响应:", errorText)
        throw new Error(`服务器错误: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "发送邮件失败")
      }

      // 邮件发送成功
      setEmailSent(true)
      if (fromNextSteps) {
        setShowNextStepsEmailForm(false)
      } else {
        setShowEmailForm(false)
      }

      // 5秒后重置成功消息
      setTimeout(() => {
        setEmailSent(false)
      }, 5000)
    } catch (err) {
      console.error("发送邮件时出错:", err)
      setError(
        err instanceof Error
          ? `发送邮件失败: ${err.message}`
          : "发送邮件失败。请检查邮箱地址是否正确，或尝试下载报告。",
      )
    } finally {
      setSending(false)
    }
  }

  // Update the ORCSummary component to correctly display the tree-vine-nut crop type
  const isBanana = formData?.cropType === "perennial" && formData?.cropCategory === "banana"
  const isPerennial = formData?.cropType === "perennial"
  const isTreeVineNut = formData?.cropType === "tree-vine-nut"
  const isShortRotation = formData?.cropType === "annual-short-rotation"

  // Format the current date in a government-style format
  const currentDate = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  // Generate a reference number based on timestamp and random digits
  const referenceNumber = `ORC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`

  return (
    <div className="space-y-6">
      {/* Main estimate box */}
      <div className="bg-[#1a1e5a]/10 p-6 rounded-md border border-[#1a1e5a]/20">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-[#1a1e5a]">Owner Reimbursement Costs estimate</h2>
          <p className="text-xl font-semibold">{formatCurrency(results.totalORC)} - compensation amount</p>
        </div>

        <div className="bg-white p-6 rounded-md border border-gray-200">
          <p className="mb-6">
            Based on the information you have provided in this tool, it is estimated that you will be eligible for an
            Owner Reimbursement Costs compensation of {formatCurrency(results.totalORC)}.
          </p>

          <h3 className="font-bold mb-3">Next steps</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <ChevronRight className="h-5 w-5 text-[#166534] mr-2" />
              <span>
                Contact the Department of Industry, Tourism and Trade at (08) 8999 5511 to proceed with your official
                compensation claim
              </span>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-5 w-5 text-[#166534] mr-2" />
              <Button
                variant="link"
                className="p-0 h-auto text-[#166534] hover:text-[#22863E] underline"
                onClick={handleDownloadPDF}
              >
                Download this calculation as a PDF file
              </Button>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-5 w-5 text-[#166534] mr-2" />
              <Button
                variant="link"
                className="p-0 h-auto text-[#166534] hover:text-[#22863E] underline"
                onClick={() => setShowNextStepsEmailForm(!showNextStepsEmailForm)}
              >
                Email Report
              </Button>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-5 w-5 text-[#166534] mr-2" />
              <Button
                variant="link"
                className="p-0 h-auto text-[#166534] hover:text-[#22863E] underline"
                onClick={handlePrint}
              >
                Print this calculation
              </Button>
            </li>
          </ul>

          {showNextStepsEmailForm && !emailSent && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
              <h4 className="font-medium mb-3 text-black">Send Report via Email</h4>
              {error && (
                <Alert variant="destructive" className="mb-4 py-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email-next-steps" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </Label>
                  <Input
                    id="email-next-steps"
                    type="email"
                    placeholder="Enter recipient email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="Please enter a valid email address"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The report will be sent as a PDF attachment to this email address.
                  </p>
                </div>

                <Alert className="bg-blue-50 border-blue-200 py-2">
                  <Info className="h-4 w-4 text-blue-500 mr-2" />
                  <AlertDescription className="text-blue-800 text-xs">
                    The email will be sent as a PDF attachment. Please check your spam folder if you don't receive it.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNextStepsEmailForm(false)} disabled={sending}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleEmailSend(true)}
                    disabled={sending}
                    className="bg-[#1a1e5a] hover:bg-[#2d3270] text-white"
                  >
                    {sending ? "Sending..." : "Send Report"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {emailSent && (
            <Alert className="mt-4 bg-[#E6F4EA] border-[#166534] py-3">
              <Check className="h-4 w-4 mr-2 text-[#166534]" />
              <AlertDescription className="text-[#166534]">
                Report has been successfully sent to <span className="font-medium">{email}</span>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Important information box */}
      <div className="bg-[#f9f2f2] p-6 rounded-md border border-[#e8d0d0]">
        <div className="flex items-start mb-2">
          <AlertCircle className="h-6 w-6 text-[#c53030] mr-3 flex-shrink-0 mt-0.5" />
          <h3 className="text-lg font-bold text-[#c53030]">Important information about this estimate</h3>
        </div>
        <p className="ml-9 text-gray-700">
          The amount calculated by this tool is an estimate only. The exact amount of your entitlement can only be
          calculated upon submission of your official claim to the Northern Territory Department of Industry, Tourism
          and Trade.
        </p>
      </div>

      {/* PDF Content Ref - This div will be captured for the PDF */}
      <div ref={pdfContentRef} className="bg-white p-8 space-y-6">
        {/* PDF Header with NT Government branding */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1e5a]">NORTHERN TERRITORY GOVERNMENT</h1>
            <h2 className="text-lg font-semibold">Department of Industry, Tourism and Trade</h2>
            <p className="text-sm">Agriculture and Fisheries Division</p>
          </div>
          <div className="text-right">
            <p className="font-bold">OFFICIAL DOCUMENT</p>
            <p>Reference: {referenceNumber}</p>
            <p>Date: {currentDate}</p>
          </div>
        </div>

        {/* Report Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a1e5a] uppercase">Owner Reimbursement Costs</h1>
          <h2 className="text-xl font-semibold">Calculation Report</h2>
        </div>

        {/* Summary of Results */}
        <div className="bg-[#1a1e5a]/10 p-6 rounded-md border border-[#1a1e5a]/20 mb-8">
          <h2 className="text-xl font-bold text-[#1a1e5a] mb-4">Compensation Summary</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg">Total ORC Payment:</p>
              <p className="text-lg">ORC Payment per Hectare:</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{formatCurrency(results.totalORC)}</p>
              <p className="text-lg">{formatCurrency(results.orcPerHectare)}</p>
            </div>
          </div>
        </div>

        {/* Crop Information */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#1a1e5a] mb-4">Crop Information</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-semibold">Crop Type:</td>
                <td className="py-2">
                  {formData.cropType === "perennial"
                    ? `Perennial - ${formData.cropCategory === "banana" ? "Banana" : "Sugar Cane"}`
                    : formData.cropType === "tree-vine-nut"
                      ? "Perennial Trees/Vine Crops/Nut Crops"
                      : formData.cropType === "annual-short-rotation"
                        ? "Annual Short Rotation Crops"
                        : "Annual Broad Acre"}
                </td>
              </tr>

              {isBanana && (
                <>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Variety:</td>
                    <td className="py-2">
                      {formData.cropVariety === "cavendish"
                        ? "Cavendish"
                        : formData.cropVariety === "lady-finger"
                          ? "Lady Finger"
                          : "Ducasse"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Region:</td>
                    <td className="py-2">
                      {formData.region === "wet-tropics"
                        ? "Wet Tropics"
                        : formData.region === "dry-tropics"
                          ? "Dry Tropics"
                          : "Sub-Tropics"}
                    </td>
                  </tr>
                </>
              )}

              {isTreeVineNut && (
                <tr className="border-b">
                  <td className="py-2 font-semibold">
                    {formData.treeType === "fruit-trees"
                      ? "Fruit Type:"
                      : formData.treeType === "vine-crops"
                        ? "Vine Type:"
                        : formData.treeType === "nut-crops"
                          ? "Nut Type:"
                          : "Stock Type:"}
                  </td>
                  <td className="py-2">
                    {formData.treeType === "fruit-trees"
                      ? formData.fruitType
                      : formData.treeType === "vine-crops"
                        ? formData.vineType
                        : formData.treeType === "nut-crops"
                          ? formData.nutType
                          : formData.bareRootType}
                  </td>
                </tr>
              )}

              <tr className="border-b">
                <td className="py-2 font-semibold">Area of Crop Destroyed:</td>
                <td className="py-2">{formData.cropArea} hectares</td>
              </tr>

              <tr className="border-b">
                <td className="py-2 font-semibold">Expected Yield:</td>
                <td className="py-2">
                  {formData.unitType === "count"
                    ? `${formData.unitCount} units/hectare`
                    : `${formData.yield} tonnes/hectare`}
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-2 font-semibold">Price:</td>
                <td className="py-2">
                  {formatCurrency(formData.hasForwardContract ? formData.forwardContractPrice : formData.price)}/
                  {formData.unitType === "count" ? "unit" : "tonne"}
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-2 font-semibold">Compulsory Fallow Period:</td>
                <td className="py-2">{formData.fallowPeriod} years</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Calculation Components */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#1a1e5a] mb-4">Calculation Components</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1a1e5a]/10 border-b border-t">
                <th className="py-3 px-4 text-left font-bold">Component</th>
                <th className="py-3 px-4 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {results.formula === "nursery-root-stock" ? (
                <>
                  <tr className="border-b">
                    <td className="py-3 px-4">A: Market Value of Plants</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.valueOfCrop)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">B: Direct Costs of Response Plan</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.additionalCosts)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">C: Capital Items Value</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.capitalItemsValue)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">D: Stored Produce Value</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.storedProduceValue)}</td>
                  </tr>
                </>
              ) : isBanana ? (
                <>
                  <tr className="border-b">
                    <td className="py-3 px-4">A: Value of Crop Destroyed</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.valueOfCrop)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">H: Harvesting & Production Costs</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.harvestingCosts)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">B: Crop Destruction Costs</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.destructionCosts)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">C: Additional Response Plan Costs</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.additionalCosts)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">D: Replanting Costs</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.replantingCosts)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">E: Loss from Compulsory Fallow</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.fallowLoss)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">F: Capital Items Value</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.capitalItemsValue)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">G: Stored Produce Value</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.storedProduceValue)}</td>
                  </tr>
                </>
              ) : isTreeVineNut ? (
                <>
                  <tr className="border-b">
                    <td className="py-3 px-4">A: Farm Gate Value</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.valueOfCrop)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">B: Harvesting & Production Costs</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.harvestingCosts)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">C: Response Plan Costs</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.additionalCosts)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">D: Capital Items Value</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.capitalItemsValue)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">E: Fallow Loss</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.fallowLoss)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">F: Tree Destruction Costs</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.destructionCosts)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">G: Replanting Costs</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.replantingCosts)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">H: Non-bearing Period Loss</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.immatureLossTotal)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">I: Stored Produce Value</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.storedProduceValue)}</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr className="border-b">
                    <td className="py-3 px-4">A: Farm Gate Value</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.valueOfCrop)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">B: Harvesting & Production Costs</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.harvestingCosts)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">C: Response Plan Costs</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.additionalCosts)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">D: Capital Items Value</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.capitalItemsValue)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">E: Fallow Loss</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.fallowLoss)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">F: Alternative Profit</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.alternativeProfit)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">G: Stored Produce Value</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(results.storedProduceValue)}</td>
                  </tr>
                </>
              )}

              <tr className="bg-[#1a1e5a]/10 border-b border-t">
                <td className="py-3 px-4 font-bold">Total ORC Compensation</td>
                <td className="py-3 px-4 text-right font-bold">{formatCurrency(results.totalORC)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Formula Used */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#1a1e5a] mb-4">Formula Used</h2>
          <div className="bg-[#1a1e5a]/10 p-4 rounded-lg">
            {results.formula === "nursery-root-stock" ? (
              <>
                <p className="font-semibold">ORC = A + B + C + D</p>
                <p className="mt-2">Where:</p>
                <ul className="mt-1 space-y-1 ml-5 list-disc">
                  <li>A: Market value or estimated market value of the plants at the time of their destruction</li>
                  <li>
                    B: Direct costs associated with the Response Plan incurred by the Owner but not normally incurred as
                    a production expense. This includes tree destruction costs.
                  </li>
                  <li>C: Replacement value of any capital items destroyed as part of the Response Plan</li>
                  <li>D: Any stocks on hand which are destroyed due to the Response Plan</li>
                </ul>
              </>
            ) : isBanana ? (
              <>
                <p className="font-semibold">ORC = (A - H) + B + C + D + E + F + G</p>
                <p className="mt-2">Where:</p>
                <ul className="mt-1 space-y-1 ml-5 list-disc">
                  <li>A: Value of the Crop destroyed</li>
                  <li>H: 'Best practice' harvesting costs plus other costs</li>
                  <li>B: Costs of Crop destruction (depreciated)</li>
                  <li>C: Other costs incurred due to Response Plan</li>
                  <li>D: 'Depreciated' Crop replanting costs</li>
                  <li>E: Loss of net profit from compulsory fallow</li>
                  <li>F: Replacement value of capital items destroyed</li>
                  <li>G: Value of stored produce destroyed</li>
                </ul>
              </>
            ) : isTreeVineNut ? (
              <>
                <p className="font-semibold">ORC = (A - B) + C + D + E + F + G + H + I</p>
                <p className="mt-2">Where:</p>
                <ul className="mt-1 space-y-1 ml-5 list-disc">
                  <li>A: Loss of profit from the current Crop destroyed</li>
                  <li>B: Harvesting costs based on 'best practice' plus other costs</li>
                  <li>C: Direct costs associated with the Response Plan</li>
                  <li>D: Replacement value of capital items destroyed</li>
                  <li>E: Loss of net profits for any fallow period</li>
                  <li>F: Tree destruction costs 'depreciated'</li>
                  <li>G: 'Depreciated' tree replanting costs</li>
                  <li>H: 'Depreciated' loss of profit during non-bearing period</li>
                  <li>I: Value of stored produce destroyed</li>
                </ul>
              </>
            ) : (
              <>
                <p className="font-semibold">ORC = (A - B) + C + D + E - F + G</p>
                <p className="mt-2">Where:</p>
                <ul className="mt-1 space-y-1 ml-5 list-disc">
                  <li>A: Estimated farm gate value of the Crop(s) destroyed</li>
                  <li>B: 'Best practice' harvesting costs plus other costs</li>
                  <li>C: Direct costs associated with the Response Plan</li>
                  <li>D: Replacement value of capital items destroyed</li>
                  <li>E: Loss of profits from fallow land in subsequent years</li>
                  <li>F: Profits from alternative enterprise</li>
                  <li>G: Value of stored produce destroyed</li>
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 border-t pt-4">
          <h2 className="text-lg font-bold mb-2">DISCLAIMER</h2>
          <p className="text-sm">
            This calculation is provided for information purposes only. The exact amount of your entitlement can only be
            calculated upon submission of your official claim to the Northern Territory Department of Industry, Tourism
            and Trade.
          </p>
          <p className="text-sm mt-2">
            For official claims, please contact the Department of Industry, Tourism and Trade at (08) 8999 5511 or email
            info.ditt@nt.gov.au.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t text-center">
          <p className="text-sm">Generated by the NT Government ORC Calculator</p>
          <p className="text-sm">Report Date: {currentDate}</p>
          <p className="text-sm">Reference Number: {referenceNumber}</p>
          <p className="text-sm mt-2">© Northern Territory Government {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Summary of responses - This is outside the PDF content */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Summary of responses</h2>
        <p className="text-gray-600 mb-4">
          {currentDate} (Reference: {referenceNumber})
        </p>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left py-3 px-4 font-semibold">Question</th>
                <th className="text-left py-3 px-4 font-semibold">Response</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 border-r">Crop Type</td>
                <td className="py-3 px-4">
                  {formData.cropType === "perennial"
                    ? `Perennial - ${formData.cropCategory === "banana" ? "Banana" : "Sugar Cane"}`
                    : formData.cropType === "tree-vine-nut"
                      ? "Perennial Trees/Vine Crops/Nut Crops"
                      : formData.cropType === "annual-short-rotation"
                        ? "Annual Short Rotation Crops"
                        : "Annual Broad Acre"}
                </td>
              </tr>

              {isBanana && (
                <>
                  <tr className="border-b">
                    <td className="py-3 px-4 border-r">Variety</td>
                    <td className="py-3 px-4">
                      {formData.cropVariety === "cavendish"
                        ? "Cavendish"
                        : formData.cropVariety === "lady-finger"
                          ? "Lady Finger"
                          : "Ducasse"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 border-r">Region</td>
                    <td className="py-3 px-4">
                      {formData.region === "wet-tropics"
                        ? "Wet Tropics"
                        : formData.region === "dry-tropics"
                          ? "Dry Tropics"
                          : "Sub-Tropics"}
                    </td>
                  </tr>
                </>
              )}

              {isTreeVineNut && (
                <tr className="border-b">
                  <td className="py-3 px-4 border-r">
                    {formData.treeType === "fruit-trees"
                      ? "Fruit Type"
                      : formData.treeType === "vine-crops"
                        ? "Vine Type"
                        : formData.treeType === "nut-crops"
                          ? "Nut Type"
                          : "Stock Type"}
                  </td>
                  <td className="py-3 px-4">
                    {formData.treeType === "fruit-trees"
                      ? formData.fruitType
                      : formData.treeType === "vine-crops"
                        ? formData.vineType
                        : formData.treeType === "nut-crops"
                          ? formData.nutType
                          : formData.bareRootType}
                  </td>
                </tr>
              )}

              {isShortRotation && (
                <tr className="border-b">
                  <td className="py-3 px-4 border-r">Short Rotation Type</td>
                  <td className="py-3 px-4">
                    {formData.shortRotationType === "vegetables"
                      ? `Vegetables - ${formData.vegetableType.charAt(0).toUpperCase() + formData.vegetableType.slice(1)}`
                      : formData.shortRotationType === "strawberries"
                        ? `Strawberries - ${formData.strawberryVariety.charAt(0).toUpperCase() + formData.strawberryVariety.slice(1)}`
                        : `Nursery - ${formData.nurseryType.charAt(0).toUpperCase() + formData.nurseryType.slice(1).replace(/-/g, " ")}`}
                  </td>
                </tr>
              )}

              <tr className="border-b">
                <td className="py-3 px-4 border-r">Area of Crop Destroyed</td>
                <td className="py-3 px-4">{formData.cropArea} hectares</td>
              </tr>

              <tr className="border-b">
                <td className="py-3 px-4 border-r">Expected Yield</td>
                <td className="py-3 px-4">
                  {formData.unitType === "count"
                    ? `${formData.unitCount} units/hectare`
                    : `${formData.yield} tonnes/hectare`}
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-3 px-4 border-r">Price</td>
                <td className="py-3 px-4">
                  {formatCurrency(formData.hasForwardContract ? formData.forwardContractPrice : formData.price)}/
                  {formData.unitType === "count" ? "unit" : "tonne"}
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-3 px-4 border-r">Compulsory Fallow Period</td>
                <td className="py-3 px-4">{formData.fallowPeriod} years</td>
              </tr>

              <tr className="border-b bg-gray-50">
                <td className="py-3 px-4 border-r font-semibold">Total ORC Compensation</td>
                <td className="py-3 px-4 font-semibold">{formatCurrency(results.totalORC)}</td>
              </tr>

              <tr className="border-b bg-gray-50">
                <td className="py-3 px-4 border-r">ORC Compensation per Hectare</td>
                <td className="py-3 px-4">{formatCurrency(results.orcPerHectare)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Our commitment section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Our commitment to you</h2>
        <p className="mb-3">
          We are committed to providing you with accurate, consistent and clear information to help you understand your
          rights and entitlements and meet your obligations.
        </p>
        <p className="mb-3">
          If you follow our information and it turns out to be incorrect, or it is misleading and you make a mistake as
          a result, we will take that into account when determining what action, if any, we should take.
        </p>
        <p className="mb-3">
          Some of the information on this website applies to a specific emergency plant pest response. This is clearly
          marked. Make sure you have the information for the right situation before making decisions based on that
          information.
        </p>
        <p className="mb-3">
          If you feel that our information does not fully cover your circumstances, or you are unsure how it applies to
          you, contact us or seek professional advice.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 print:hidden">
        <Button onClick={handlePrint} className="flex-1 bg-[#1a1e5a] hover:bg-[#2d3270]">
          <Printer className="mr-2 h-4 w-4" />
          Print Calculation
        </Button>
        <Button onClick={handleDownloadPDF} className="flex-1 bg-[#1a1e5a] hover:bg-[#2d3270]">
          <Download className="mr-2 h-4 w-4" />
          Download PDF Report
        </Button>
        <Button
          onClick={() => setShowEmailForm(!showEmailForm)}
          disabled={emailSent}
          className="flex-1 bg-[#1a1e5a] hover:bg-[#2d3270]"
        >
          <Mail className="mr-2 h-4 w-4" />
          Email Report
        </Button>
        <Button onClick={onRestart} className="flex-1 bg-[#1a1e5a] hover:bg-[#2d3270]">
          <FileText className="mr-2 h-4 w-4" />
          New Calculation
        </Button>
      </div>

      {showEmailForm && !emailSent && (
        <div className="w-full mt-2 p-4 border border-gray-200 rounded-lg bg-white">
          <h4 className="font-medium mb-3 text-black">Send Report via Email</h4>
          {error && (
            <Alert variant="destructive" className="mb-4 py-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter recipient email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                title="Please enter a valid email address"
              />
              <p className="text-xs text-gray-500 mt-1">
                The report will be sent as a PDF attachment to this email address.
              </p>
            </div>

            <Alert className="bg-blue-50 border-blue-200 py-2">
              <Info className="h-4 w-4 text-blue-500 mr-2" />
              <AlertDescription className="text-blue-800 text-xs">
                The email will be sent as a PDF attachment. Please check your spam folder if you don't receive it.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEmailForm(false)} disabled={sending}>
                Cancel
              </Button>
              <Button
                onClick={() => handleEmailSend(false)}
                disabled={sending}
                className="bg-[#1a1e5a] hover:bg-[#2d3270] text-white"
              >
                {sending ? "Sending..." : "Send Report"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {emailSent && (
        <Alert className="bg-[#E6F4EA] border-[#166534] py-3">
          <Check className="h-4 w-4 mr-2 text-[#166534]" />
          <AlertDescription className="text-[#166534]">
            Report has been successfully sent to <span className="font-medium">{email}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Copyright notice */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
        <p className="mb-2">© Northern Territory Government {new Date().getFullYear()}</p>
        <p>
          You are free to copy, adapt, modify, transmit and distribute this material as you wish (but not in any way
          that suggests the NT Government or the Commonwealth endorses you or any of your services or products).
        </p>
      </div>
    </div>
  )
}
