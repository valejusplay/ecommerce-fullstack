import 'dotenv/config'

import app from './src/app.js'
import { conectarDB, desconectarDB } from './src/config/db.js'

const PORT = process.env.PORT ?? 5000

await conectarDB()

const servidor = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})

// Render manda SIGTERM antes de dormir el servicio o redeployar. Cerrar el
// servidor y la base a mano evita dejar conexiones colgadas en Atlas, que en el
// plan M0 son un recurso escaso.
const apagar = async (senial) => {
  console.log(`${senial} recibido: cerrando.`)
  servidor.close(async () => {
    await desconectarDB()
    process.exit(0)
  })
}

process.on('SIGTERM', () => apagar('SIGTERM'))
process.on('SIGINT', () => apagar('SIGINT'))
