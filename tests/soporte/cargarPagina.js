import { readFile } from 'node:fs/promises'
import { parse, compileScript } from '@vue/compiler-sfc'

let numeroPrueba = 0
const modulo = (codigo) => 'data:text/javascript;base64,' + Buffer.from(codigo).toString('base64')

// Solo para las pruebas: compila la página real y sustituye controles,
// navegación y hooks por dobles sin DOM ni red.
export async function cargarPagina({ apiModule, toastController } = {}) {
  const url = new URL('../../src/pages/ListaPage.vue', import.meta.url)
  const { descriptor, errors } = parse(await readFile(url, 'utf8'))
  if (errors.length) throw errors[0]
  const compilado = compileScript(descriptor, { id: 'prueba-lista' })
  let codigo = compilado.content
  const clave = '__adiPaginaPrueba' + ++numeroPrueba
  globalThis[clave] = { toastController }
  const fuentes = [...new Set(Object.values(compilado.imports).map((entrada) => entrada.source))]
  try {
    for (const fuente of fuentes) {
      let destino
      if (fuente === 'vue') {
        destino = modulo(
          'export * from ' + JSON.stringify(import.meta.resolve('vue')) +
          '; export const onMounted = () => {}; export const onUnmounted = () => {};'
        )
      } else if (fuente === '@ionic/vue') {
        const nombres = [...new Set(Object.values(compilado.imports)
          .filter((entrada) => entrada.source === fuente).map((entrada) => entrada.imported))]
        const router = '{ navigate() {}, push() {}, back() {}, canGoBack() { return false } }'
        const declaraciones = nombres.map((nombre) => {
          const valor = nombre === 'useIonRouter' ? '() => (' + router + ')'
            : nombre.startsWith('onIonView') ? '() => {}'
            : nombre === 'toastController' ? 'fixture.toastController'
            : nombre === 'alertController' ? '{ create() { throw new Error("Overlay no esperado en esta prueba") } }'
            : '{}'
          return 'export const ' + nombre + ' = ' + valor + ';'
        })
        destino = modulo('const fixture = globalThis[' + JSON.stringify(clave) + '];\n' + declaraciones.join('\n'))
      } else if (/servicios\/api(?:\.js)?$/.test(fuente)) {
        destino = apiModule
      } else if (fuente.endsWith('.vue')) {
        destino = modulo('export default {}')
      } else {
        throw new Error('Import no previsto por la prueba: ' + fuente)
      }
      codigo = codigo.replaceAll("'" + fuente + "'", JSON.stringify(destino))
        .replaceAll('"' + fuente + '"', JSON.stringify(destino))
    }
    const pagina = (await import(modulo(codigo))).default
    return pagina.setup({}, { expose() {} })
  } finally {
    delete globalThis[clave]
  }
}

