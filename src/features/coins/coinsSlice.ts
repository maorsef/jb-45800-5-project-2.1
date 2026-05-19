import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  coins: []
}

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setCoins: (state, action) => {
      state.coins = action.payload
    }
  }
})

export const { setCoins } = coinsSlice.actions

export default coinsSlice.reducer