export interface Coin {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  current_price_eur?: number
  current_price_ils?: number
}

export interface ChartData {
  time: string
  [key: string]: string | number
}