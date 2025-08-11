"use client"

import * as React from "react"
import { useState } from "react"

import { cn } from "@/lib/utils"

interface EditableCellProps {
  value: string
  onSave?: (value: string) => Promise<void> | void
}

export function EditableCell({
  value: initialValue,
  onSave,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = React.useState(initialValue)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true)
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 0)
    }
  }

  const handleSave = async () => {
    setIsEditing(false)
    if (onSave && value !== initialValue) {
      await onSave(value)
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

  return (
    <div className="relative w-full">
      {!isEditing && (
        <div
          className="absolute inset-0 z-10 px-2 py-2 cursor-pointer hover:bg-primary/5 rounded-md"
          onClick={handleClick}
        >
          {value || <span className="text-muted-foreground italic">N/A</span>}
        </div>
      )}

      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        disabled={!isEditing}
        className={cn(
          "w-full bg-transparent outline-none border-none py-2 px-2 rounded-md border",
          isEditing ? "z-20 focus:bg-primary/5 focus:shadow-[inset_0_0_0_1px] focus:shadow-primary/30" : "text-transparent caret-transparent",
        )}
      />
    </div>
  )
}