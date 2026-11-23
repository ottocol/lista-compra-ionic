import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { cargarPagina } from './soporte/cargarPagina.js'

// Prueba el servicio y el estado de ListaPage, con HTTP y controles simulados:
// no necesita cuentas ni escribe en el proyecto Supabase del aula.

test('sesión, CRUD y errores del servicio y de la lista', async () => {
  const originalFetch = globalThis.fetch
  const usuario = { id: '00000000-0000-4000-8000-000000000001', email: 'prueba@example.test' }
  let filas = []
  let siguienteId = 1
  let fallarAlta = false
  const peticiones = []

  const json = (datos, status = 200) => new Response(JSON.stringify(datos), {
    status, headers: { 'Content-Type': 'application/json' },
  })

  globalThis.fetch = async (input, opciones = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url)
    assert.equal(url.hostname, 'supabase.test', 'La prueba no debe salir a la red')
    const metodo = opciones.method || 'GET'
    const body = opciones.body ? JSON.parse(opciones.body) : null
    peticiones.push({ url, metodo, body })

    if (url.pathname === '/auth/v1/token') {
      return json({
        access_token: 'fixture-access-token',
        refresh_token: 'fixture-refresh-token',
        token_type: 'bearer',
        expires_in: 3600,
        user: usuario,
      })
    }
    if (url.pathname === '/auth/v1/logout') return json({})
    assert.equal(url.pathname, '/rest/v1/lista')

    const filtro = url.searchParams.get('id')
    const id = filtro ? Number(filtro.replace('eq.', '')) : null
    if (metodo === 'POST') {
      if (fallarAlta) return json({ message: 'Alta rechazada' }, 400)
      assert.equal(body.usuario, usuario.id)
      const nueva = { id: siguienteId++, ...body }
      filas.push(nueva)
      return json(nueva, 201)
    }
    if (metodo === 'PATCH') {
      filas = filas.map((fila) => fila.id === id ? { ...fila, ...body } : fila)
      return new Response(null, { status: 204 })
    }
    if (metodo === 'DELETE') {
      filas = filas.filter((fila) => fila.id !== id)
      return new Response(null, { status: 204 })
    }
    const seleccion = filas.filter((fila) => id === null || fila.id === id)
    const singular = new Headers(opciones.headers).get('accept')?.includes('application/vnd.pgrst.object+json')
    return json(singular ? seleccion[0] : seleccion)
  }

  let api
  try {
    const entorno = JSON.stringify({
      VITE_SUPABASE_URL: 'https://supabase.test',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'fixture-public-key',
    })
    const apiUrl = new URL('../src/servicios/api.js', import.meta.url)
    let fuente = await readFile(apiUrl, 'utf8')
    fuente = fuente.replace("'@supabase/supabase-js'", JSON.stringify(import.meta.resolve('@supabase/supabase-js')))
      .replaceAll('import.meta.env', entorno)
    const moduloApi = 'data:text/javascript;base64,' + Buffer.from(fuente).toString('base64')
    api = await import(moduloApi)

    assert.equal(await api.getUsuario(), null)
    await assert.rejects(api.crearProducto('Sin sesión'), /sesión/)
    await api.login(usuario.email, 'clave-de-prueba')
    assert.equal((await api.getUsuario()).id, usuario.id)

    const lista = await cargarPagina({ apiModule: moduloApi })
    await lista.cargarProductos()
    assert.equal(lista.cargando.value, false)
    assert.equal(lista.productos.value.length, 0)

    lista.nuevoNombre.value = '  Café  '
    await lista.doNuevo(lista.nuevoNombre.value)
    assert.equal(lista.nuevoNombre.value, '')
    assert.equal(lista.productos.value[0].nombre, 'Café')
    await lista.doToggle(1)
    assert.equal(lista.productos.value[0].comprado, true)
    assert.equal(filas[0].comprado, true)

    assert.equal((await api.obtenerProducto(1)).nombre, 'Café')
    await api.setNombre(1, 'Café descafeinado')
    await lista.cargarProductos()
    assert.equal(lista.productos.value[0].nombre, 'Café descafeinado')

    fallarAlta = true
    lista.nuevoNombre.value = 'Leche'
    await lista.doNuevo('Leche')
    assert.equal(lista.nuevoNombre.value, 'Leche', 'Un error no debe vaciar el formulario')
    assert.match(lista.error.value, /Alta rechazada/)
    assert.equal(lista.ocupado.value, false)

    await api.borrarProducto(1)
    await lista.cargarProductos()
    assert.deepEqual(lista.productos.value, [])
    await api.logout()
    assert.equal(await api.getUsuario(), null)
    await assert.rejects(api.setNombre(1, 'Cambio sin sesión'), /sesión/)
    assert.ok(peticiones.some((p) => p.metodo === 'DELETE' && p.url.searchParams.get('id') === 'eq.1'))
  } finally {
    if (api) await api.logout()
    globalThis.fetch = originalFetch
  }
})
