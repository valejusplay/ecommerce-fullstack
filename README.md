# NexoGamer

Tienda online de perifericos gamer — teclados, mouses, auriculares, monitores y
sillas.

E-commerce con gestion de productos y categorias, autenticacion de usuarios con
verificacion por email, carrito de compras persistente y pago mediante la
pasarela de MercadoPago.

## Stack

**Frontend**
- React + TypeScript
- Vite como empaquetador, pnpm como gestor de dependencias
- Tailwind CSS (mobile first)
- React Router DOM
- axios

**Backend**
- Node.js + Express bajo patron MVC
- MongoDB + Mongoose
- JWT en cookies httpOnly + bcryptjs
- express-validator
- Nodemailer, Cloudinary, MercadoPago

## Estructura

```
.
├── client/     Aplicacion React (deploy en Vercel)
└── server/     API REST (deploy en Render)
```

## Puesta en marcha

Requiere Node.js 24+ y pnpm.

```bash
# Backend
cd server
cp .env.example .env    # completar los valores
pnpm install
pnpm dev                # http://localhost:5000

# Frontend (en otra terminal)
cd client
pnpm install
pnpm dev                # http://localhost:5173
```

El frontend consume la API bajo la ruta `/api`, que el proxy de Vite reenvia al
backend en desarrollo.

## Variables de entorno

Se documentan en `server/.env.example`. Se necesitan credenciales de MongoDB
Atlas, Cloudinary, MercadoPago (modo de prueba) y una contrasena de aplicacion
de Gmail para el envio de correos.

## Despliegue

| Capa | Plataforma | Directorio raiz |
|---|---|---|
| Frontend | Vercel | `client` |
| Backend | Render | `server` |

El frontend redirige `/api/*` hacia el backend mediante los rewrites definidos
en `client/vercel.json`, de modo que ambos comparten origen desde el punto de
vista del navegador.
