import { createStore } from 'vuex'
import getter from './getter'
const modulesFiles = import.meta.globEager('./modules/*.js')

let modules = {}
for (const path in modulesFiles) {
  const moduleName = path.replace(/(.*\/)*([^.]+).*/gi, '$2')
  modules[moduleName] = modulesFiles[path].default
}

const store = createStore({
  modules,
  getter
})

export default store