"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

import type { ComboboxOption, ComboboxProps } from "./combobox.types"

export const Combobox = <T = string,>({
  value,
  onChange,
  onSelect,
  options,
  loading = false,
  error,
  placeholder = "Buscar...",
  disabled = false,
  className = "",
  emptyMessage = "No se encontraron resultados",
  loadingMessage = "Buscando...",
  "aria-label": ariaLabel,
  selectedValue,
}: ComboboxProps<T>) => {
  const [open, setOpen] = useState(false)

  const selectedOption = options.find((option) => String(option.value) === String(selectedValue))
  const displayValue = selectedOption?.label || placeholder

  const filteredOptions = options.filter((option) => !option.disabled)

  const handleSelect = (option: ComboboxOption<T>) => {
    onSelect(option)
    setOpen(false)
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={ariaLabel}
            disabled={disabled || loading}
            className="w-full justify-between"
          >
            <span className="truncate text-left">{displayValue}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder}
              value={value}
              onValueChange={onChange}
              disabled={disabled}
            />
            <CommandList>
              {loading && (
                <div
                  className="flex items-center justify-center p-4 text-sm text-muted-foreground"
                  role="status"
                  aria-live="polite"
                >
                  {loadingMessage}
                </div>
              )}

              {error && !loading && (
                <div className="p-4 text-sm text-destructive" role="alert" aria-live="assertive">
                  {error}
                </div>
              )}

              {!loading && !error && filteredOptions.length === 0 && (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              )}

              {!loading && !error && filteredOptions.length > 0 && (
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={String(option.value)}
                      value={String(option.value)}
                      onSelect={() => handleSelect(option)}
                      className="flex items-start gap-2"
                    >
                      <Check
                        className={`h-4 w-4 ${
                          String(selectedValue) === String(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      <div className="flex flex-col gap-0.5">
                        <div className="text-sm font-medium">{option.label}</div>
                        {option.secondaryLabel && (
                          <div className="text-xs text-muted-foreground">
                            {option.secondaryLabel}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
