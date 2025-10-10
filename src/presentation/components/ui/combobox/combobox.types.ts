export interface ComboboxOption<T = string> {
  value: T
  label: string
  secondaryLabel?: string
  disabled?: boolean
  data?: any
}

export interface ComboboxProps<T = string> {
  value: string
  onChange: (value: string) => void
  onSelect: (option: ComboboxOption<T>) => void
  options: ComboboxOption<T>[]
  selectedValue?: T
  loading?: boolean
  error?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  emptyMessage?: string
  loadingMessage?: string
  "aria-label"?: string
}
