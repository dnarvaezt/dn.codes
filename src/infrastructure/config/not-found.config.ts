export const notFoundConfig = {
  title: "404",
  heading: "Página no encontrada",
  description: "La página que buscas no existe o ha sido movida.",
  buttonText: "Volver al inicio",
  buttonHref: "/",
  containerClassName:
    "container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center",
  titleClassName: "mb-4 text-6xl font-bold",
  headingClassName: "mb-4 text-2xl font-semibold",
  descriptionClassName: "mb-8 text-muted-foreground",
  buttonClassName: "hover:bg-primary/90 rounded-md bg-primary px-6 py-3 text-primary-foreground",
} as const
