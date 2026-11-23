import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://tynmtgjjapyxukbxxpoc.supabase.co',
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_J6r6CiO19PjO5sAHXMd6mA_AS1ZF9pj'
)

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw new Error('Error al hacer login: ' + error.message)
  return data // { user, session }
}


async function logout() {
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  if (error) throw new Error('Error al cerrar sesión: ' + error.message)
}

//Devuelve la sesión actual o null si no hay usuario autenticado
async function getSesion() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

async function obtenerProductos() {
  if (!await getSesion()) return []

  const { data, error } = await supabase
    .from('lista')
    .select('id, nombre, comprado, usuario')
    .order('id')

  if (error) throw new Error('Error al obtener productos: ' + error.message)
  return data
}

//Crea un producto y devuelve el objeto creado (con su id asignado por la BD)
async function crearProducto(nombre) {
  const session = await getSesion()
  if (!session) return

  const { data, error } = await supabase
    .from('lista')
    .insert({ nombre, comprado: false, usuario: session.user.id })
    .select('id, nombre, comprado, usuario')
    .single()

  if (error) throw new Error('Error al crear producto: ' + error.message)
  return data
}

async function borrarProducto(id) {
  if (!await getSesion()) return

  const { error } = await supabase
    .from('lista')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Error al borrar producto: ' + error.message)
}

async function setComprado(id, valor) {
  if (!await getSesion()) return

  const { error } = await supabase
    .from('lista')
    .update({ comprado: valor })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

async function setNombre(id, nombre) {
  if (!await getSesion()) return

  const { error } = await supabase
    .from('lista')
    .update({ nombre })
    .eq('id', id)

  if (error) throw new Error('Error al editar producto: ' + error.message)
}

async function getUsuario() {
  //esto es más rápido que getUser aunque podría ser que no estuviéramos autenticados correctamente en el servidor
  let result = await supabase.auth.getSession()
  if (result.data.session)
    return result.data.session.user
  else
    return null
}

export { login, logout, obtenerProductos, crearProducto, borrarProducto,
         setComprado, setNombre, getUsuario }
