"use client"

import type React from "react"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-query"

interface MobileTooltipProps {
  title?: string
  content: React.ReactNode
  className?: string
}

export function MobileTooltip({ title, content, className }: MobileTooltipProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // On desktop, use regular tooltip
  if (isDesktop) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-5 w-5 p-0 ${className}`}
              type="button"
              onClick={(e) => e.preventDefault()}
              aria-label="Show help information"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            align="center"
            className="max-w-xs p-4 text-sm bg-white border border-gray-200 shadow-lg"
            sideOffset={5}
          >
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // On mobile, use dialog
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`h-5 w-5 p-0 ${className}`}
        onClick={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
        type="button"
        aria-label="Show help information"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#166534]">{title || "Help Information"}</DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            <div className="text-sm text-left text-gray-700 space-y-2">{content}</div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}
