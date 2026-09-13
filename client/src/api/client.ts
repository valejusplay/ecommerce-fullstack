import axios from 'axios'

/**
 * Instancia unica de axios para toda la aplicacion.
 *
 * `withCredentials` es obligatorio: sin el, el navegador no envia ni acepta
 * la cookie httpOnly donde viaja el JWT.
 *
 * La baseURL es relativa a proposito. En desarrollo la resuelve el proxy de
 * Vite y en produccion los rewrites de Vercel, de modo que el frontend y la
 * API comparten origen en ambos entornos.
 */
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})
