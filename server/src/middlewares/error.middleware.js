/** Captura cualquier ruta no declarada y la convierte en un 404 uniforme. */
export const notFound = (req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: `La ruta ${req.originalUrl} no existe`,
  })
}

/**
 * Manejador de errores centralizado. Al vivir aca, los controladores no
 * necesitan repetir bloques try/catch con respuestas ad hoc.
 */
// eslint-disable-next-line no-unused-vars -- Express identifica el handler por su aridad
export const errorHandler = (error, req, res, next) => {
  const status = error.status ?? 500
  console.error(`[${status}] ${error.message}`)

  res.status(status).json({
    ok: false,
    mensaje:
      status === 500 ? 'Error interno del servidor' : error.message,
  })
}
