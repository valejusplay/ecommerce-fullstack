import { DURACION_SESION, opcionesCookie } from '../config/cookies.js'

const NOMBRE_COOKIE = 'prueba_arquitectura'

/**
 * Emite una cookie httpOnly de prueba. Existe solo durante el Sprint 0, para
 * validar que la cookie sobrevive el viaje entre Vercel y Render antes de
 * construir la autenticacion real sobre ese mismo mecanismo.
 */
export const setearCookie = (req, res) => {
  res.cookie(NOMBRE_COOKIE, `ok-${Date.now()}`, {
    ...opcionesCookie,
    maxAge: DURACION_SESION,
  })

  res.json({
    ok: true,
    mensaje: 'Cookie emitida. Ahora probar la lectura.',
  })
}

/** Devuelve la cookie de prueba, o 401 si el navegador no la envio. */
export const leerCookie = (req, res) => {
  const valor = req.cookies[NOMBRE_COOKIE]

  if (!valor) {
    return res.status(401).json({
      ok: false,
      mensaje: 'El navegador no envio la cookie',
    })
  }

  res.json({ ok: true, valor })
}
