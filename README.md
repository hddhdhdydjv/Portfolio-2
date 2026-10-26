# Portfolio 3

Portfolio de Alejandro Arab: **Nuxt 4 + Prismic + Lenis + anime.js**.
Replica la estética del portfolio en Framer, con animaciones nuevas.

## Stack

| Pieza | Para qué |
| --- | --- |
| [Nuxt 4](https://nuxt.com) | Sitio con SSR y transiciones de página con hooks JS |
| [Prismic](https://prismic.io) + Slice Machine | Contenido (casos, home, about, ajustes) en inglés y español |
| [Lenis](https://lenis.darkroom.engineering) | Scroll suave |
| [anime.js v4](https://animejs.com) | Transiciones, reveals, split text, scramble, tickers, parallax |

## Animaciones

- **Transición entre páginas:** la página saliente sube y se desvanece, el scroll se resetea sin que se note y la nueva entra subiendo. El título grande de la barra lateral cambia línea por línea.
- **Navegación:** una pastilla se desliza a la pestaña activa, y los textos hacen un *scramble* pixelado al pasar el mouse.
- **Gato ASCII:** se renderiza en un canvas a partir de la imagen de Settings. Se materializa al cargar, parpadea como el original y se "glitchea" donde pasa el cursor.
- **Reveals al hacer scroll** (`v-reveal`): `up`, `fade`, `image` (clip + zoom), `stagger`, `lines` y `chars`.
- **Tarjetas de proyecto:** parallax interno ligado al scroll, zoom suave y etiqueta al pasar el mouse.
- **Polaroids** (About) y **ticker** (Key Results): marquees infinitos que frenan al pasar el mouse, con rebote tipo resorte.
- **Footer:** el gato negro se asoma a medida que el footer entra en pantalla.
- Se respeta `prefers-reduced-motion`: sin Lenis ni animaciones.

## Desarrollo

```bash
npm install
npm run seed:mock   # convierte /content a documentos con forma de Prismic
npm run dev:mock    # sitio con el contenido local, sin Prismic
npm run dev         # sitio leyendo de Prismic
```

Inglés en `/`, español en `/es`. Si algo no está traducido, se muestra la versión en inglés.

## Prismic

Modelos (están en el repo):

- **Custom types** en `customtypes/`: `case_study` (repetible), `home`, `projects_page`, `about`, `settings`.
- **Slices** en `app/slices/`: `TextSection`, `ImageStack`, `ImageTicker`, `TableBlock`, `Quote`.

Configuración inicial (una sola vez):

1. Crear el repositorio en Prismic y poner su nombre en `slicemachine.config.json` (`repositoryName`).
2. En Prismic → *Settings → Translations & locales*: inglés `en-us` como principal y agregar español `es-es`.
3. Copiar `.env.example` a `.env` y completar `PRISMIC_WRITE_TOKEN` (*Settings → API & Security → Write APIs*).
4. `npm run push-models`: sube los custom types y los slices.
5. `npm run migrate`: sube las 64 imágenes y los 16 documentos (EN + ES) a una release de migración. Revisalos y publicalos desde Prismic. Con `--dry-run` se puede probar sin subir nada.

Editar modelos: `npm run slicemachine` abre Slice Machine en `localhost:9999`.

### MCP de Prismic

`.mcp.json` registra el MCP oficial (`@prismicio/mcp-server`). Claude Code lo carga en este repo para modelar y programar slices.

## Contenido semilla

`/content` tiene el contenido original:

- `cases/*.en.md` y `cases/*.es.md`: un caso por archivo, con frontmatter, `##` para secciones, tablas, citas, `::images` y `::ticker`.
- `site.en.json` y `site.es.json`: home, about y ajustes.
- `images/`: imágenes optimizadas (WebP).

Una vez migrado, **Prismic es la fuente de verdad**: los cambios se hacen ahí.

## Deploy

En Vercel funciona sin configuración. Las páginas se cachean con ISR de 60 s, así que lo que publicás en Prismic aparece en el sitio en un minuto, sin redeploy.
