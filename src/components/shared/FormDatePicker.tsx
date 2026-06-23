"use client"

import { useFormContext } from "react-hook-form"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface FormDatePickerProps {
  name: string
  label?: string
  placeholder?: string
  className?: string
}

export function FormDatePicker({ name, label, placeholder = "Pick a date", className }: FormDatePickerProps) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-1.5 flex flex-col w-full", className)}>
          {label && (
            <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {label}
            </FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  type="button"
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal h-10 bg-background border-border flex items-center justify-start",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </span>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date ? date.toISOString() : null)}
              />
            </PopoverContent>
          </Popover>
          <FormMessage className="text-xs font-medium" />
        </FormItem>
      )}
    />
  )
}
