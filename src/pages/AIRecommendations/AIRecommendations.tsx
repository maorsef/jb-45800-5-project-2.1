import './AIRecommendations.css'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import type { RootState } from '../../app/store'
import { getAIRecommendation } from '../../services/aiService'
import { getCoinDetailsWithMarket } from '../../services/coinService'

function AIRecommendations() {
  const selectedCoins = useSelector(
    (state: RootState) => state.selectedCoins.coins
  )

  const [recommendations, setRecommendations] =
    useState<Record<string, string>>({})

  const [loading, setLoading] = useState<string | null>(null)

  const getRecommendation = async (coinId: string, coinName: string) => {
    try {
      setLoading(coinId)

      const coinData = await getCoinDetailsWithMarket(coinId)
      const marketData = coinData.market_data

      const prompt = `
You are ChatGPT, a professional cryptocurrency analyst.
Provide two things in your answer:
1. A clear BUY or DO NOT BUY recommendation for this cryptocurrency.
2. A short explanation paragraph (3-5 sentences) describing why.

Use only the following data:
{
  name: "${coinName}",
  current_price_usd: ${marketData.current_price.usd},
  market_cap_usd: ${marketData.market_cap.usd},
  volume_24h_usd: ${marketData.total_volume.usd},
  price_change_percentage_30d_in_currency: ${marketData.price_change_percentage_30d_in_currency?.usd ?? marketData.price_change_percentage_30d ?? 'null'},
  price_change_percentage_60d_in_currency: ${marketData.price_change_percentage_60d_in_currency?.usd ?? 'null'},
  price_change_percentage_200d_in_currency: ${marketData.price_change_percentage_200d_in_currency?.usd ?? 'null'}
}

Start your answer with "BUY" or "DO NOT BUY" on the first line.
`

      const aiResponse = await getAIRecommendation(prompt)

      setRecommendations(prev => ({
        ...prev,
        [coinId]: aiResponse
      }))
    } catch (error) {
      console.log(error)
      alert('Failed to generate recommendation. Make sure the server is running.')
    } finally {
      setLoading(null)
    }
  }

  if (selectedCoins.length === 0) {
    return (
      <div className='ai-page'>
        <h1 className='ai-title'>AI Recommendations</h1>
        <p style={{ textAlign: 'center' }}>
          Please select coins from the Home page first.
        </p>
      </div>
    )
  }

  return (
    <div className='ai-page'>
      <h1 className='ai-title'>AI Recommendations</h1>

      <div className='ai-grid'>
        {selectedCoins.map(coin => (
          <div className='ai-card' key={coin.id}>
            <img src={coin.image} alt={coin.name} />
            <h2>{coin.name}</h2>

            <button
              onClick={() => getRecommendation(coin.id, coin.name)}
              disabled={loading === coin.id}
            >
              {loading === coin.id
                ? 'Generating...'
                : 'Get AI Recommendation'}
            </button>

            {recommendations[coin.id] && (
              <div className='recommendation-box'>
                {recommendations[coin.id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AIRecommendations