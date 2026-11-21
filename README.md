# Sitio del consultorio dental

Next.js + Supabase. Pagina publica (inicio, la doctora, procedimientos, testimonios,
contacto con formulario de cita) y un panel privado en `/admin` para que la doctora
revise solicitudes de cita, apruebe testimonios y edite direccion/telefono/horario,
sin tocar codigo.

## 1. Crear el proyecto en Supabase (cuenta de tu hermana)

1. En https://supabase.com, crear un proyecto nuevo.
2. Ir a **SQL Editor** y correr el contenido de `supabase/schema.sql`.
3. Ir a **Authentication > Users > Add user** y crear el usuario de la doctora
   (correo + contrasena). Ese es el unico login del panel; no hay registro publico.
4. En **Project Settings > API** copiar:
   - `Project URL`
   - `anon public` key

## 2. Variables de entorno

Copiar `.env.local.example` a `.env.local` y pegar los dos valores del paso anterior.

## 3. Correr en local

```bash
npm install
npm run dev
```

Abrir http://localhost:3000 (sitio) y http://localhost:3000/admin (panel, pide login).

## 4. Publicar (GitHub + Vercel, cuentas de tu hermana)

1. Tu hermana crea un repositorio vacio en su GitHub.
2. Te agrega como colaborador: en el repo, **Settings > Collaborators > Add people**,
   con tu usuario de GitHub.
3. Subir este codigo a ese repositorio:
   ```bash
   git init
   git add .
   git commit -m "Sitio inicial del consultorio"
   git remote add origin <URL-del-repo-de-tu-hermana>
   git branch -M main
   git push -u origin main
   ```
4. En https://vercel.com (cuenta de tu hermana), **Add New Project**, importar ese
   repositorio de GitHub.
5. En la configuracion del proyecto de Vercel, agregar las mismas dos variables de
   entorno del paso 2 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
6. Deploy. Cada vez que se haga `git push` a `main`, Vercel vuelve a publicar solo.

## Lo que falta definir / siguientes pasos

- Reemplazar los textos entre `[corchetes]` (nombre de la doctora, consultorio,
  foto, formacion) en `app/page.tsx`.
- Subir fotos reales: por ahora los espacios de foto son solo placeholders.
- Si despues quieren que la doctora tambien pueda editar el texto de cada
  procedimiento desde el panel (no solo horario/contacto), se puede mover
  `PROCEDIMIENTOS` de `app/page.tsx` a una tabla de Supabase con una pantalla de
  edicion en `/admin`, igual que se hizo con citas y testimonios.
