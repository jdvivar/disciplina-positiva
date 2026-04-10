# Disciplina Positiva

Guia interactiva de disciplina positiva para padres y madres. Basada en el manual de la Dra. Joan E. Durrant, adaptado por ACHNU Chile.

Los padres navegan los capitulos, completan ejercicios de reflexion a su propio ritmo, y pueden imprimir un diario personal con sus respuestas.

## Stack

- [Astro](https://astro.build) — generador de sitios estaticos
- [Svelte 5](https://svelte.dev) — componentes interactivos (ejercicios, navegacion, progreso)
- [Tailwind CSS v4](https://tailwindcss.com) — estilos
- [TinaCMS](https://tina.io) — CMS basado en git con edicion visual
- [Vercel](https://vercel.com) — hosting

## Desarrollo

```bash
npm install
npm run dev
```

Esto inicia TinaCMS y Astro juntos. El sitio esta en `localhost:4321` y el panel del CMS en `localhost:4321/admin/index.html`.

## Estructura del contenido

El contenido esta en `src/content/es/` como archivos MDX. Cada capitulo tiene frontmatter (titulo, orden) y ejercicios inline.

Para agregar un nuevo idioma:

1. Crear una carpeta de contenido (ej. `src/content/en/`) con los archivos traducidos
2. Crear un archivo JSON de strings de UI (ej. `src/i18n/en.json`)
3. Agregar una coleccion en `tina/config.ts`

## Comandos

| Comando | Descripcion |
| :-- | :-- |
| `npm run dev` | Servidor de desarrollo (TinaCMS + Astro) |
| `npm run build` | Build de produccion |
| `npm run preview` | Preview del build local |

## Licencia

El contenido original es una traduccion y adaptacion de "Positive Discipline: What it is and how to do it" de Joan E. Durrant, elaborado por Save the Children.
