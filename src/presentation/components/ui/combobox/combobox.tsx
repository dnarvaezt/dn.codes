"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { Button } from "../button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import "./combobox.scss"

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
    <div className={`combobox ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={ariaLabel}
            disabled={disabled || loading}
            className={`combobox__trigger ${error ? "combobox__trigger--error" : ""}`}
          >
            <span className="combobox__value">{displayValue}</span>
            <ChevronsUpDown className="combobox__icon" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="combobox__content" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder}
              value={value}
              onValueChange={onChange}
              disabled={disabled}
            />
            <CommandList>
              {loading && (
                <div className="combobox__loading" role="status" aria-live="polite">
                  {loadingMessage}
                </div>
              )}

              {error && !loading && (
                <div className="combobox__error" role="alert" aria-live="assertive">
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
                      className="combobox__item"
                    >
                      <Check
                        className={`combobox__check ${
                          String(selectedValue) === String(option.value)
                            ? "combobox__check--visible"
                            : ""
                        }`}
                      />
                      <div className="combobox__item-content">
                        <div className="combobox__item-main">{option.label}</div>
                        {option.secondaryLabel && (
                          <div className="combobox__item-secondary">{option.secondaryLabel}</div>
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
