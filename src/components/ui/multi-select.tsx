import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
          render={<button type="button" />}
          className={cn(
            "flex w-full items-center justify-between rounded-md border border-input bg-background h-auto min-h-10 py-2 px-3 text-sm shadow-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selected.length > 0 ? (
              selected.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="mr-1 mb-1 bg-red-500 text-white hover:bg-red-600 border-none px-2 py-1 flex items-center gap-1 rounded-md"
                >
                  {options.find((o) => o.value === item)?.label}
                  <button
                    type="button"
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleUnselect(item); }}
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="max-h-64 overflow-auto p-1 space-y-1">
           <button
            type="button"
            className="flex w-full items-center px-2 py-2 text-sm font-bold rounded-md hover:bg-accent hover:text-accent-foreground border-b mb-1 bg-muted/30"
            onClick={() => {
              if (selected.length === options.length) {
                onChange([])
              } else {
                onChange(options.map(o => o.value))
              }
            }}
          >
            {selected.length === options.length ? "Deselect all" : "Select all"}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "flex w-full items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground",
                selected.includes(option.value) && "bg-accent/50"
              )}
              onClick={() => {
                if (selected.includes(option.value)) {
                  handleUnselect(option.value)
                } else {
                  onChange([...selected, option.value])
                }
              }}
            >
              <span>{option.label}</span>
              {selected.includes(option.value) && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
