import { useEffect, useState } from 'react'
import { api } from './api/client'

type Estado = 'idle' | 'cargando' | 'ok' | 'error'

interface Resultado {
  estado: Estado
  mensaje: string
}

const inicial: Resultado = { estado: 'idle', mensaje: 'Sin ejecutar' }

function App() {
  const [salud, setSalud] = useState<Resultado>(inicial)
  const [seteo, setSeteo] = useState<Resultado>(inicial)
  const [lectura, setLectura] = useState<Resultado>(inicial)

  useEffect(() => {
    const verificarSalud = async () => {
      setSalud({ estado: 'cargando', mensaje: 'Consultando...' })
      try {
        const { data } = await api.get('/health')
        setSalud({ estado: 'ok', mensaje: `${data.servicio} — ${data.entorno}` })
      } catch {
        setSalud({ estado: 'error', mensaje: 'El backend no responde' })
      }
    }
    verificarSalud()
  }, [])

  const setearCookie = async () => {
    setSeteo({ estado: 'cargando', mensaje: 'Enviando...' })
    try {
      const { data } = await api.post('/cookie-test/set')
      setSeteo({ estado: 'ok', mensaje: data.mensaje })
    } catch {
      setSeteo({ estado: 'error', mensaje: 'No se pudo setear la cookie' })
    }
  }

  const leerCookie = async () => {
    setLectura({ estado: 'cargando', mensaje: 'Leyendo...' })
    try {
      const { data } = await api.get('/cookie-test/read')
      setLectura({ estado: 'ok', mensaje: `Valor recibido: ${data.valor}` })
    } catch {
      setLectura({
        estado: 'error',
        mensaje: 'El navegador no envio la cookie',
      })
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
            Sprint 0 — Fundaciones
          </p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
            Verificacion de arquitectura
          </h1>
          <p className="mt-2 text-slate-600">
            Esta pagina comprueba que el backend responde y que la cookie
            httpOnly sobrevive el viaje entre Vercel y Render.
          </p>
        </header>

        <Tarjeta titulo="1. Conexion con el backend" resultado={salud} />

        <Tarjeta titulo="2. Escritura de la cookie" resultado={seteo}>
          <Boton onClick={setearCookie}>Setear cookie</Boton>
        </Tarjeta>

        <Tarjeta titulo="3. Lectura de la cookie" resultado={lectura}>
          <Boton onClick={leerCookie}>Leer cookie</Boton>
        </Tarjeta>

        <p className="mt-8 text-sm text-slate-500">
          Los tres pasos deben dar OK en Chrome, Firefox y Safari/iOS antes de
          avanzar al Sprint 1.
        </p>
      </div>
    </main>
  )
}

interface TarjetaProps {
  titulo: string
  resultado: Resultado
  children?: React.ReactNode
}

function Tarjeta({ titulo, resultado, children }: TarjetaProps) {
  const colores: Record<Estado, string> = {
    idle: 'bg-slate-100 text-slate-600',
    cargando: 'bg-amber-100 text-amber-800',
    ok: 'bg-emerald-100 text-emerald-800',
    error: 'bg-rose-100 text-rose-800',
  }

  return (
    <section className="mb-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">{titulo}</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${colores[resultado.estado]}`}
        >
          {resultado.estado.toUpperCase()}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{resultado.mensaje}</p>
      {children && <div className="mt-4">{children}</div>}
    </section>
  )
}

function Boton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
    >
      {children}
    </button>
  )
}

export default App
