import './LiveReports.css'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { useSelector } from 'react-redux'
import type { RootState } from '../../app/store'
import { useEffect, useState } from 'react'
import { getLivePrices } from '../../services/coinService'
import type { ChartData } from '../../types/coin'

function LiveReports() {
  const selectedCoins = useSelector(
    (state: RootState) => state.selectedCoins.coins
  )

  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChartData([])
  }, [selectedCoins])

  useEffect(() => {
    if (selectedCoins.length === 0) return

    const interval = setInterval(async () => {
      try {
        const symbols = selectedCoins
          .map(coin => coin.symbol.toUpperCase())
          .join(',')

        const data = await getLivePrices(symbols)

        const currentTime = new Date().toLocaleTimeString()

        const newEntry: ChartData = { time: currentTime }

        selectedCoins.forEach(coin => {
          newEntry[coin.symbol.toUpperCase()] =
            data[coin.symbol.toUpperCase()]?.USD || 0
        })

        setChartData(prev => {
          const updated = [...prev, newEntry]
          return updated.slice(-15)
        })
      } catch (error) {
        console.log(error)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [selectedCoins])

  if (selectedCoins.length === 0) {
    return (
      <div
        className='live-reports-page'
        style={{ padding: '40px', textAlign: 'center' }}
      >
        <h1 className='live-title'>Live Reports</h1>
        <p>Please select coins from the Home page first.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '80vh',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
        Live Reports
      </h1>

      <div className='chart-container'>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey='time' />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedCoins.map(coin => (
              <Line
                key={coin.symbol}
                type='monotone'
                dataKey={coin.symbol.toUpperCase()}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default LiveReports