# Galería de arte · Portfolio de Sera

HTML5 + CSS3 + JavaScript sin frameworks, para GitHub Pages. La publicación de obras es real: el panel `admin.html` habla con un backend ligero (Cloudflare Worker) que valida la sesión y confirma en GitHub la imagen (`assets/artworks/`) y el JSON (`data/artworks.json`) mediante la workflow `publish-artwork.yml`.

```
navegador (admin.html) ──login/sesión firmada──► Worker (secretos: GH_TOKEN, ADMIN_USER, ADMIN_PASSWORD, SESSION_SECRET)
                                                   ├─ PUT imagen  → GitHub Contents API (commit)
                                                   └─ dispatch    → GitHub Action → jq edita data/artworks.json → commit → Pages despliega
```
Ningún token ni contraseña está en el frontend.

## Puesta en marcha
1. **Repositorio**: sube todo el contenido de esta carpeta (rama `main`). En *Settings → Pages* elige *Deploy from a branch → main / (root)*.
2. **Actions**: *Settings → Actions → General → Workflow permissions → Read and write permissions*.
3. **Token**: *Settings (tu perfil) → Developer settings → Fine-grained tokens*: solo este repositorio; permisos *Contents: Read and write* y *Actions: Read and write*.
4. **Worker** (cuenta gratuita de Cloudflare, Node instalado):
   ```
   cd worker
   # edita wrangler.toml: REPO, BRANCH, ALLOWED_ORIGIN (https://TU-USUARIO.github.io)
   npx wrangler login
   npx wrangler secret put GH_TOKEN        # el token del paso 3
   npx wrangler secret put ADMIN_USER
   npx wrangler secret put ADMIN_PASSWORD  # contraseña larga
   npx wrangler secret put SESSION_SECRET  # cadena aleatoria larga (p. ej. openssl rand -hex 32)
   npx wrangler deploy
   ```
5. En `js/config.js` pon la URL del Worker en `api`, y tu correo, Instagram y nombre. Haz commit y push.
6. Entra en `https://TU-USUARIO.github.io/REPO/admin.html`, inicia sesión y sube una obra. Tarda 1–2 minutos en aparecer (Action + Pages); el panel lo detecta solo.

## Personalización
- Textos y traducciones: `js/translations.js`. Datos de contacto, fotos y URL del backend: `js/config.js`.
- Sustituye `assets/images/hero.svg` y `portrait.svg` por tus imágenes (actualiza las rutas en `config.js`).
- Borra las obras de demostración desde el panel cuando quieras.
- Si el despliegue de Pages no se lanza tras un commit del bot, usa *Pages → Source: GitHub Actions* o un token personal en lugar de `GITHUB_TOKEN`.

## Seguridad y límites
- Sesión firmada (HMAC) de 2 h; el Worker retrasa los intentos de login fallidos. Añade una regla de *Rate limiting* en Cloudflare para endurecerlo.
- Las imágenes se convierten a WebP (máx. 2000 px) en el navegador antes de subirse.
- El panel no aparece en el menú ni se indexa (`noindex`), pero su protección real es el login del Worker.
