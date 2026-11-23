import test from 'node:test'
import assert from 'node:assert/strict'
import { cargarPagina } from './soporte/cargarPagina.js'

test('el borrado diferido permite deshacer, confirmar y recuperar fallos', async () => {
  const avisos = []
  const borrados = []
  let fallar = false
  const controller = {
    async create() {
      let resolver
      const cerrado = new Promise((resolve) => { resolver = resolve })
      const aviso = {
        async present() {},
        onDidDismiss() { return cerrado },
        async dismiss(data, role) { resolver({ role }); return true },
      }
      avisos.push(aviso)
      return aviso
    },
  }
  globalThis.__adiBorrarPrueba = async (id) => {
    if (fallar) throw new Error('DELETE rechazado')
    borrados.push(id)
  }
  try {
    const inline = (code) => 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
    const apiModule = inline(
      'export const borrarProducto = globalThis.__adiBorrarPrueba;' +
      'export const getUsuario = async () => null;' +
      'export const logout = async () => {};' +
      'export const obtenerProductos = async () => [];' +
      'export const crearProducto = async () => {};' +
      'export const setComprado = async () => {};' +
      'export const setNombre = async () => {};'
    )
    const estado = await cargarPagina({ apiModule, toastController: controller })
    const { productos, error } = estado
    productos.value = [{ id: 1, nombre: 'Café' }, { id: 2, nombre: 'Leche' }]

    await estado.borrarConDeshacer(productos.value[0])
    assert.deepEqual(productos.value.map((p) => p.id), [2])
    assert.deepEqual(borrados, [], 'Ocultar todavía no debe enviar DELETE')
    await avisos[0].dismiss(undefined, 'deshacer')
    await estado.finalizarPendiente()
    assert.deepEqual(productos.value.map((p) => p.id), [1, 2])
    assert.deepEqual(borrados, [])

    await estado.borrarConDeshacer(productos.value[0])
    assert.equal(await estado.finalizarPendiente(), true)
    assert.deepEqual(borrados, [1])
    assert.deepEqual(productos.value.map((p) => p.id), [2])

    fallar = true
    await estado.borrarConDeshacer(productos.value[0])
    assert.equal(await estado.finalizarPendiente(), false)
    assert.deepEqual(productos.value.map((p) => p.id), [2])
    assert.match(error.value, /DELETE rechazado/)
    assert.equal(estado.eliminando.value, false)
  } finally {
    delete globalThis.__adiBorrarPrueba
  }
})
