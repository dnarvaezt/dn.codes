"use client"

import dynamic from "next/dynamic"

const UserContextDemo = dynamic(
  () =>
    import("@/infrastructure/modules/user-context").then((mod) => ({
      default: mod.UserContextDemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="text-center text-muted-foreground">Cargando contexto de usuario...</div>
    ),
  }
)

export const DemoSection = () => {
  return (
    <section className="mb-20" aria-labelledby="demo-heading">
      <h2 id="demo-heading" className="mb-8 text-center text-3xl font-bold">
        User Context Demo
      </h2>
      <div className="mx-auto max-w-2xl">
        <UserContextDemo />
      </div>
    </section>
  )
}
