import * as React from "react"
import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Option {
  label: string
  value: string
}

interface FormSelectProps {
  name: string
  label?: string
  options: Option[]
  placeholder?: string
  icon?: React.ReactNode
  loading?: boolean
  className?: string
}

export function FormSelect({ name, label, options, placeholder, icon, loading, className }: FormSelectProps) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
            <FormControl>
              <div className="relative">
                {icon && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-muted-foreground pointer-events-none">
                    {icon}
                  </div>
                )}
                <SelectTrigger className={cn(icon && "pl-10", className)}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </div>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
