# dn.codes

Portfolio personal de Diego Narváez - Desarrollador Full Stack

## 🚀 Tecnologías

- **Framework**: Next.js 15
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + SCSS
- **UI**: Radix UI + shadcn/ui
- **Estado**: Zustand
- **Testing**: Vitest
- **Deployment**: Vercel

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Inicio en producción
npm run start

# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format
npm run format:check

# Testing
npm run test
npm run test:coverage

# Verificación de tipos
npm run type-check
```

## 🏗️ Arquitectura

El proyecto sigue Clean Architecture con separación de capas:

- **Application**: Lógica de negocio y servicios de dominio
- **Infrastructure**: Componentes UI, hooks y adaptadores
- **Domain**: Modelos y reglas de negocio

## 🌐 Deployment

El proyecto está configurado para deployment automático en Vercel con:

- Build automático en push a `main`
- Optimizaciones de performance
- Headers de seguridad
- Optimización de imágenes

## 📱 Features

- 🌙 Sistema de temas (Light/Dark)
- 🌤️ Integración con API de clima
- 📍 Geolocalización
- 🌍 Detección de idioma y zona horaria
- 📱 Diseño responsive
- ⚡ Optimizado para performance

## 🔧 Configuración de Desarrollo

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Ejecutar en desarrollo: `npm run dev`
4. Abrir [http://localhost:3000](http://localhost:3000)

## 📄 Licencia

Proyecto personal - Todos los derechos reservados
