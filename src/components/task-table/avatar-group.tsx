"use client"

import * as React from "react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Person {
  id?: string
  name: string
  avatar?: string
}

interface AvatarGroupProps {
  items?: Person[]
  max?: number
  emptyText?: string
  tooltipTitle?: string
}

export function AvatarGroup({ 
  items = [], 
  max = 3, 
  emptyText = "N/A",
  tooltipTitle = "Outros"
}: AvatarGroupProps) {
  if (!items || items.length === 0) {
    return <span className="text-muted-foreground text-sm">{emptyText}</span>
  }

  const visibleItems = items.slice(0, max)
  const remainingCount = Math.max(0, items.length - max)

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {visibleItems.map((item, index) => (
        <Tooltip key={item.id || index}>
          <TooltipTrigger asChild>
            <Avatar className="h-6 w-6 border-2 border-background">
              {item.avatar && <AvatarImage src={item.avatar} alt={item.name} />}
              <AvatarFallback className="bg-muted text-xs">
                {item.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
      
      {remainingCount > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="h-6 w-6 border-2 border-background">
              <AvatarFallback className="bg-primary/20 text-xs">
                +{remainingCount}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side="top">
            <div className="space-y-1">
              <p className="font-medium">{tooltipTitle}:</p>
              <ul className="text-sm">
                {items.slice(max).map((item, index) => (
                  <li key={item.id || index + max}>{item.name}</li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
