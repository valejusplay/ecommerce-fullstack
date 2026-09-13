const EN_PRODUCCION = process.env.NODE_ENV === 'production'

/**
 * Opciones compartidas por toda cookie que emita la aplicacion.
 *
 * `sameSite: 'lax'` es viable porque en produccion el frontend alcanza la API
 * a traves de los rewrites de Vercel: para el navegador ambos comparten
 * origen, de modo que la cookie es first-party. Si algun dia se llamara a
 * Render de forma directa, haria falta `sameSite: 'none'` y Safari y Brave la
 * bloquearian por defecto.
 *
 * No se declara `domain` a proposito: sin ese atributo la cookie queda ligada
 * al host que la emitio, que es justamente lo que se busca.
 */
export const opcionesCookie = {
  httpOnly: true,
  secure: EN_PRODUCCION,
  sameSite: 'lax',
  path: '/',
}

/** Una semana, expresada en milisegundos. */
export const DURACION_SESION = 7 * 24 * 60 * 60 * 1000
