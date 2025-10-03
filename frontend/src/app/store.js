
import { configureStore } from '@reduxjs/toolkit'
import { api } from './services.js'

export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (gDM) => gDM().concat(api.middleware)
})
