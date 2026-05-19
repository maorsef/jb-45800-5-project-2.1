import axios from 'axios'

const SERVER_URL = 'http://localhost:5000'

export const getCoins = async () => {
  const response = await axios.get(
    `${SERVER_URL}/coins/markets`
  )
  return response.data
}

export const getCoinDetails = async (coinId: string) => {
  const response = await axios.get(
    `${SERVER_URL}/coins/${coinId}`
  )
  return response.data
}

export const getCoinDetailsWithMarket = async (coinId: string) => {
  const response = await axios.get(
    `${SERVER_URL}/coins/${coinId}?market_data=true`
  )
  return response.data
}

export const getLivePrices = async (symbols: string) => {
  const response = await axios.get(
    `${SERVER_URL}/pricemulti?fsyms=${symbols}`
  )
  return response.data
}