import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import cookieTestRoutes from './routes/cookieTest.routes.js'
import healthRoutes from './routes/health.routes.js'
import { errorHandler, notFound } from './middlewares/error.middleware.js'

const app = express()

// En produccion el trafico llega a traves del proxy de Vercel. Sin esto,
// Express no reconoce la conexion como segura y se niega a enviar cookies
// marcadas como `secure`.
app.set('trust proxy', 1)

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/health', healthRoutes)
app.use('/api/cookie-test', cookieTestRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
