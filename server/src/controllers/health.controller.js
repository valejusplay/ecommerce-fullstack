export const obtenerEstado = (req, res) => {
  res.json({
    ok: true,
    servicio: 'API E-commerce',
    entorno: process.env.NODE_ENV ?? 'development',
    fecha: new Date().toISOString(),
  })
}
