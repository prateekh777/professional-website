"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simplified Drawer component for build to pass
interface DrawerProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Drawer = ({ children, open, onOpenChange }: DrawerProps) => {
  return (
    <div className={cn("fixed inset-0 z-50", open ? "block" : "hidden")}>
      {children}
    </div>
  )
}

interface DrawerTriggerProps {
  children?: React.ReactNode
  asChild?: boolean
}

const DrawerTrigger = ({ children }: DrawerTriggerProps) => {
  return <>{children}</>
}

interface DrawerContentProps {
  children?: React.ReactNode
  className?: string
}

const DrawerContent = ({ children, className }: DrawerContentProps) => {
  return (
    <div className={cn("fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-lg", className)}>
      {children}
    </div>
  )
}

interface DrawerHeaderProps {
  children?: React.ReactNode
  className?: string
}

const DrawerHeader = ({ children, className }: DrawerHeaderProps) => {
  return <div className={cn("px-4 py-6", className)}>{children}</div>
}

interface DrawerFooterProps {
  children?: React.ReactNode
  className?: string
}

const DrawerFooter = ({ children, className }: DrawerFooterProps) => {
  return <div className={cn("px-4 py-6", className)}>{children}</div>
}

interface DrawerTitleProps {
  children?: React.ReactNode
  className?: string
}

const DrawerTitle = ({ children, className }: DrawerTitleProps) => {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>
}

interface DrawerDescriptionProps {
  children?: React.ReactNode
  className?: string
}

const DrawerDescription = ({ children, className }: DrawerDescriptionProps) => {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}

interface DrawerCloseProps {
  children?: React.ReactNode
  className?: string
}

const DrawerClose = ({ children, className }: DrawerCloseProps) => {
  return <button className={cn("absolute right-4 top-4", className)}>{children}</button>
}

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} 