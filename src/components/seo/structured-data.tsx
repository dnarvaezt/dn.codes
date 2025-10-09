export const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Developer",
    alternateName: "dn.codes",
    description:
      "Modern portfolio showcasing web development projects and skills with React, Next.js, and TypeScript",
    url: "https://dn.codes",
    sameAs: ["https://github.com", "https://linkedin.com", "https://twitter.com"],
    jobTitle: "Full Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "dn.codes",
    },
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Web Development",
      "Frontend Development",
      "Backend Development",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Web Developer",
      description: "Building modern web applications with cutting-edge technologies",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
