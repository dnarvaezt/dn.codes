import { notFoundConfig } from "@/infrastructure/config"
import Link from "next/link"

const NotFound = () => {
  const {
    title,
    heading,
    description,
    buttonText,
    buttonHref,
    containerClassName,
    titleClassName,
    headingClassName,
    descriptionClassName,
    buttonClassName,
  } = notFoundConfig

  return (
    <div className={containerClassName}>
      <h1 className={titleClassName}>{title}</h1>
      <h2 className={headingClassName}>{heading}</h2>
      <p className={descriptionClassName}>{description}</p>
      <Link href={buttonHref} className={buttonClassName}>
        {buttonText}
      </Link>
    </div>
  )
}

export default NotFound
