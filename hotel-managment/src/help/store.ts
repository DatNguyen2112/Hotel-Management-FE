import { configureStore } from '@reduxjs/toolkit'
import FullName from '../redux/signin'
export const store = configureStore({
  reducer: {FullName},
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch