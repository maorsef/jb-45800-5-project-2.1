import { configureStore } from '@reduxjs/toolkit'
import selectedCoinsReducer from '../features/selectedCoins/selectedCoinsSlice'
import aiReducer from '../features/ai/aiSlice'

export const store = configureStore({
  reducer: {
    selectedCoins: selectedCoinsReducer,
    ai: aiReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch