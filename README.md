# Simulador de ingresos

## Probarlo en tu ordenador (opcional pero recomendado)

1. Instala Node.js desde https://nodejs.org (elige la versión LTS).
2. Abre una terminal dentro de esta carpeta y ejecuta:
   ```
   npm install
   npm run dev
   ```
3. Abre http://localhost:3000 en tu navegador.

## Publicarlo en internet gratis (GitHub + Vercel)

1. Crea una cuenta en https://github.com (gratis).
2. Crea un repositorio nuevo, por ejemplo `simulador-ingresos`.
3. Sube esta carpeta al repositorio:
   ```
   git init
   git add .
   git commit -m "Primera versión del simulador"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/simulador-ingresos.git
   git push -u origin main
   ```
4. Crea una cuenta en https://vercel.com usando tu cuenta de GitHub (gratis).
5. En Vercel, pulsa "Add New Project", elige tu repositorio `simulador-ingresos` y dale a "Deploy".
6. En 1-2 minutos tendrás una URL pública tipo `simulador-ingresos.vercel.app`.

## Seguir mejorándolo

Cada vez que quieras añadir algo (nuevas opciones de trabajo, cambios de diseño, etc.):
1. Edita los archivos (o pídeme que te ayude, o usa Claude Code).
2. Ejecuta `git add .`, `git commit -m "descripción del cambio"`, `git push`.
3. Vercel actualiza la web sola en 1-2 minutos.
