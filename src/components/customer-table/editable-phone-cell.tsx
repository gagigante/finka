"use client"

import * as React from "react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { formatPhoneNumber } from "@/utils/formatters"

interface EditablePhoneCellProps {
  value: string
  onSave?: (value: string) => Promise<void> | void
}

export function EditablePhoneCell({
  value: initialValue,
  onSave,
}: EditablePhoneCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = React.useState(initialValue)
  const [inputValue, setInputValue] = React.useState("")
  
  // Format the phone number for display
  const displayValue = initialValue ? formatPhoneNumber(initialValue) : ""

  // Update local state when prop changes
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleStartEditing = () => {
    if (!isEditing) {
      // Format the value when entering edit mode
      setInputValue(value ? formatPhoneNumber(value) : "")
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    setIsEditing(false)
    
    // Strip non-digit characters before saving
    const rawValue = value.replace(/\D/g, '')
    
    if (onSave && rawValue !== initialValue) {
      await onSave(rawValue)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setValue(initialValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value
    
    // Handle empty input case
    if (!currentValue.trim()) {
      setInputValue('')
      setValue('')
      return
    }
    
    // Extract digits for storage
    const digits = currentValue.replace(/\D/g, '')
    setValue(digits)
    
    // Format for display in the input
    setInputValue(formatPhoneNumber(digits))
  }

  return (
    <div className="relative w-full">
      {!isEditing && (
        <div
          className="absolute inset-0 z-10 px-2 py-2 cursor-pointer hover:bg-primary/5 rounded-md"
          onClick={handleStartEditing}
        >
          {displayValue || <span className="text-muted-foreground italic">N/A</span>}
        </div>
      )}

      <input
        value={isEditing ? inputValue : ""}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        disabled={!isEditing}
        autoFocus={isEditing}
        className={cn(
          "w-full bg-transparent outline-none border-none py-2 px-2 rounded-md border",
          isEditing ? "z-20 focus:bg-primary/5 focus:shadow-[inset_0_0_0_1px] focus:shadow-primary/30" : "text-transparent caret-transparent",
        )}
      />
    </div>
  )
}