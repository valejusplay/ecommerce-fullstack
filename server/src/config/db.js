import mongoose from 'mongoose'

/**
 * Traduce los fallos de conexion mas frecuentes a una explicacion accionable.
 *
 * Mongoose informa con precision *que* fallo, pero no *por que* suele fallar.
 * Los tres casos de abajo son los que aparecen al configurar Atlas por primera
 * vez, y el mensaje crudo no alcanza para distinguirlos.
 */
const explicarFallo = (error) => {
  const mensaje = error.message ?? ''

  if (error.name === 'MongoServerSelectionError') {
    return (
      'No se pudo alcanzar el cluster. Causas habituales:\n' +
      '  - La IP no esta habilitada en Atlas (Network Access -> 0.0.0.0/0).\n' +
      '  - El cluster M0 esta pausado por inactividad: abrir el panel lo despierta.\n' +
      '  - La URI apunta a un cluster que ya no existe.'
    )
  }

  if (mensaje.includes('bad auth') || mensaje.includes('Authentication failed')) {
    return (
      'Usuario o contrasena incorrectos. Ojo con dos cosas:\n' +
      '  - El marcador <db_password> quedo sin reemplazar, o quedaron los signos < >.\n' +
      '  - La contrasena tiene caracteres que hay que escapar: @ : / # ? & terminan\n' +
      '    partiendo la URI. Conviene regenerarla solo con letras y numeros.'
    )
  }

  if (error.name === 'MongoParseError') {
    return 'La cadena de conexion esta mal formada. Tiene que empezar con mongodb+srv://'
  }

  return mensaje
}

/**
 * Abre la conexion con MongoDB Atlas.
 *
 * Se llama **antes** de `app.listen`: un servidor que acepta requests sin base
 * de datos responde 500 en cada uno y el error aparece lejos de su causa. Si la
 * conexion falla, el proceso termina con codigo 1 y Render marca el deploy como
 * fallido, que es el comportamiento deseado — es preferible un deploy que no
 * arranca a uno que arranca roto.
 */
export const conectarDB = async () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error(
      'Falta MONGODB_URI.\n' +
        '  En local: copiar server/.env.example como server/.env y completarla.\n' +
        '  En Render: cargarla en Environment.',
    )
    process.exit(1)
  }

  // Sin nombre de base, Mongoose se conecta a una llamada `test` y despues los
  // datos no aparecen donde se los busca. El fallo es silencioso, asi que se
  // avisa aca en lugar de dejar que se descubra mas tarde.
  if (/\.net\/?\?/.test(uri) || /\.net\/?$/.test(uri)) {
    console.warn(
      'La URI no especifica nombre de base: se va a usar "test".\n' +
        '  Agregarlo despues del .net/ y antes del ?  ->  .net/nexogamer?retryWrites=...',
    )
  }

  try {
    const { connection } = await mongoose.connect(uri)
    console.log(`MongoDB conectado: ${connection.host}/${connection.name}`)
  } catch (error) {
    console.error('No se pudo conectar a MongoDB.')
    console.error(explicarFallo(error))
    process.exit(1)
  }

  // La conexion puede caerse despues del arranque: el free tier de Render
  // duerme el servicio y Atlas corta las conexiones ociosas. Mongoose
  // reconecta solo, pero sin estos listeners el reinicio pasa inadvertido.
  mongoose.connection.on('error', (error) => {
    console.error(`Error de MongoDB: ${error.message}`)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB se desconecto. Mongoose va a reintentar solo.')
  })

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconectado.')
  })
}

/**
 * Cierra la conexion de forma ordenada.
 *
 * Render manda SIGTERM antes de dormir o redeployar. Sin este cierre, Atlas
 * mantiene la conexion abierta hasta que expira por su cuenta, y el M0 tiene un
 * limite bajo de conexiones simultaneas.
 */
export const desconectarDB = async () => {
  await mongoose.connection.close()
  console.log('Conexion con MongoDB cerrada.')
}
