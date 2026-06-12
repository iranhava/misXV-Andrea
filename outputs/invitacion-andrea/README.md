# Invitación digital · XV años de Andrea Jazmín

Sitio estático listo para publicar en Netlify, Vercel, GitHub Pages o cualquier hosting convencional.

## Archivos principales

- `index.html`: abre por defecto la invitación familiar.
- `familiares.html`: RSVP familiar para 1 a 4 asistentes.
- `amigos.html`: RSVP individual con confirmación Sí/No.
- `config.js`: fechas, lugares, enlaces de Google Maps y credenciales públicas de EmailJS.
- `styles.css`: diseño responsive.
- `app.js`: cuenta regresiva, galería, formulario y cierre de confirmaciones.

## Vista local

Ejecutar desde esta carpeta:

```bash
python3 -m http.server 4173
```

Después abrir `http://localhost:4173`.

También es posible abrir directamente `familiares.html` o `amigos.html` desde Finder.
El envío de confirmaciones mediante EmailJS requiere conexión a internet.

## EmailJS

La plantilla `template_gjjtwze` debe aceptar estas variables:

- `nombre`
- `telefono`
- `tipo_invitacion`
- `asistencia`
- `numero_asistentes`
- `asistentes`
- `guests`
- `numero_de_asistentes`
- `mensaje`
- `message`
- `fecha_confirmacion`
- `fecha_registro`
- `registration_date`
- `fecha_registro_iso`
- `destination_email`
- `to_email`

La versión para amigos envía los asistentes como `1` cuando la respuesta es Sí y `0` cuando es No.
Los campos `numero_asistentes`, `asistentes` y `guests` contienen el mismo dato para facilitar la configuración de la plantilla.

## Ajustes futuros

Los datos generales se modifican en `config.js`. La fecha límite deshabilita automáticamente los formularios al finalizar el 17 de julio de 2026, hora del centro de México.
