import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("debe renderizar correctamente con texto", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("debe aplicar la variante por defecto", () => {
    render(<Button>Default Button</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-primary")
  })

  it("debe aplicar la variante destructive", () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-destructive")
  })

  it("debe aplicar el tamaño small", () => {
    render(<Button size="sm">Small Button</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("h-8")
  })

  it("debe aplicar el tamaño large", () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("h-10")
  })

  it("debe llamar onClick cuando se hace click", async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    const button = screen.getByRole("button")

    await user.click(button)

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it("debe estar deshabilitado cuando se pasa la prop disabled", () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
  })

  it("debe aplicar clases personalizadas adicionales", () => {
    render(<Button className="custom-class">Custom Button</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("custom-class")
  })

  it("debe renderizar como un elemento hijo cuando asChild es true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByRole("link")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test")
  })
})
