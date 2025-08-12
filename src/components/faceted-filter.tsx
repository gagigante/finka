"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

export type FilterOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface FacetedFilterProps {
  title: string
  options: FilterOption[]
  value: string[]
  onChange: (value: string[]) => void
  triggerIcon?: React.ReactNode
  placeholder?: string
  emptyMessage?: string
  clearLabel?: string
  selectedLabel?: string
  multiple?: boolean
  showSearch?: boolean
  showClearButton?: boolean
}

export function FacetedFilter({
  title,
  options,
  value = [],
  onChange,
  triggerIcon,
  placeholder,
  emptyMessage = "Nenhum resultado encontrado",
  clearLabel = "Limpar filtros",
  selectedLabel = "Selecionados",
  multiple = true,
  showSearch = true,
  showClearButton = true,
}: FacetedFilterProps) {
  const selectedValues = new Set(value)

  const handleSelect = (optionValue: string) => {
    if (multiple) {      
      const newSelectedValues = new Set(selectedValues)
      
      if (newSelectedValues.has(optionValue)) {
        newSelectedValues.delete(optionValue)
      } else {
        newSelectedValues.add(optionValue)
      }
      
      onChange(Array.from(newSelectedValues))
    } else {
      if (selectedValues.has(optionValue)) {
        onChange([])
      } else {
        onChange([optionValue])
      }
    }
  }

  const handleClear = () => {
    onChange([])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          {triggerIcon}
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} {selectedLabel}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          {showSearch && <CommandInput placeholder={placeholder || title} />}
          <CommandList>
            <CommandEmpty className="p-2 text-center text-sm text-muted-foreground">{emptyMessage}</CommandEmpty>
            {options.length > 0 && (
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
            {selectedValues.size > 0 && showClearButton && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClear}
                    className="justify-center text-center"
                  >
                    {clearLabel}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}