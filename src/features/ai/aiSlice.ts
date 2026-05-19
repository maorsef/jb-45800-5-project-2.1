import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  recommendation: ''
}

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setRecommendation: (state, action) => {
      state.recommendation = action.payload
    }
  }
})

export const { setRecommendation } = aiSlice.actions

export default aiSlice.reducer