import {
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit'

import type { Coin } from '../../types/coin'

interface SelectedCoinsState {
  coins: Coin[]
}

const initialState: SelectedCoinsState = {
  coins: JSON.parse(
    localStorage.getItem(
      'selectedCoins'
    ) || '[]'
  )
}

const selectedCoinsSlice =
  createSlice({
    name: 'selectedCoins',

    initialState,

    reducers: {
      addCoin: (
        state,
        action: PayloadAction<Coin>
      ) => {
        state.coins.push(action.payload)

        localStorage.setItem(
          'selectedCoins',
          JSON.stringify(state.coins)
        )
      },

      removeCoin: (
        state,
        action: PayloadAction<string>
      ) => {
        state.coins =
          state.coins.filter(
            coin =>
              coin.symbol !==
              action.payload
          )

        localStorage.setItem(
          'selectedCoins',
          JSON.stringify(state.coins)
        )
      },

      clearCoins: state => {
        state.coins = []

        localStorage.setItem(
          'selectedCoins',
          JSON.stringify([])
        )
      }
    }
  })

export const {
  addCoin,
  removeCoin,
  clearCoins
} = selectedCoinsSlice.actions

export default
  selectedCoinsSlice.reducer