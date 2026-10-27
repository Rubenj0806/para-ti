# Tengo algo que decirte

Página web de una sola pantalla, con estilo sobrio y oscuro. Al principio hay una invitación con un botón. Al pulsarlo, se dibuja un corazón que late una vez y suelta unas chispas, y aparece el mensaje «Daniel, me gustas.».

Es HTML, CSS y JavaScript puro. No hay nada que instalar ni compilar.

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Estructura y **todos los textos** |
| `styles.css` | Colores, tipografía y animaciones |
| `script.js` | El botón y las chispas |

## Cambiar los textos

Abre `index.html` y busca los comentarios con ✏️:

- `Tengo algo que decirte.`: frase de la primera pantalla
- `Presiona aquí`: texto del botón
- `Me ha costado un poco enviarte esto.`: frase pequeña bajo el botón
- `Daniel,`: el nombre, encima del mensaje
- `me gustas.`: mensaje principal
- `Y quería que lo supieras.`: frase secundaria

Si quieres un toque más dulce, puedes añadir un emoji al mensaje (por ejemplo `Me gustas ❤️`). La página lo ajusta de tamaño sola.

## Verla en tu ordenador

Haz doble clic en `index.html` y se abrirá en el navegador.

## Publicarla gratis (la forma más rápida)

**Netlify Drop**, sin GitHub ni comandos:

1. Entra en <https://app.netlify.com/drop>.
2. Arrastra la carpeta del proyecto a la página.
3. En unos segundos te da un enlace tipo `https://nombre-raro.netlify.app`.
4. Crea la cuenta gratuita cuando te lo pida para que el enlace no caduque. Si quieres, cámbiale el nombre en *Site configuration → Change site name*.
5. Copia el enlace y envíalo.

**Alternativas:**

- **GitHub Pages:** sube los archivos a un repositorio, ve a *Settings → Pages*, elige la rama `main` y la carpeta `/ (root)`.
- **Vercel:** importa el repositorio en <https://vercel.com/new>; no hace falta configurar nada.

## Detalles

- Funciona sin sonido y no pide ningún dato.
- Respeta la opción «reducir movimiento» del sistema: en ese caso todo aparece con un fundido suave.
- Las fuentes vienen de Google Fonts. Si no cargan, se usan las fuentes del sistema y la página se sigue viendo bien.
