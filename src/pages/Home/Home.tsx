import './Home.css'

import {
  useEffect,
  useState
} from 'react'

import { useDispatch } from 'react-redux'

import CoinCard from '../../components/CoinCard/CoinCard'

import Loader from '../../components/Loader/Loader'

import { getCoins } from '../../services/coinService'

import {
  clearCoins
} from '../../features/selectedCoins/selectedCoinsSlice'

import type { Coin } from '../../types/coin'

function Home() {
  const dispatch = useDispatch()

  const [coins, setCoins] =
    useState<Coin[]>([])

  const [loading, setLoading] =
    useState(true)

  const [search, setSearch] =
    useState('')

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getCoins()

        setCoins(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoins()
  }, [])

  const filteredCoins = coins.filter(
    coin =>
      coin.symbol
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      coin.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  )

  return (
    <div className='home-page'>
      <h1 className='home-title'>
        Crypto Tracker
      </h1>

      <input
        type='text'
        placeholder='Search coin...'
        className='search-input'
        value={search}
        onChange={e =>
          setSearch(e.target.value)
        }
      />

      <button
        onClick={() =>
          dispatch(clearCoins())
        }
        style={{
          display: 'block',
          margin: '20px auto',
          padding: '12px 20px',
          border: 'none',
          borderRadius: '10px',
          background: 'red',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Clear All Selected Coins
      </button>

      <div className='coins-grid'>
        {loading ? (
          <>
            <Loader />
            <Loader />
            <Loader />
            <Loader />
            <Loader />
            <Loader />
          </>
        ) : (
          filteredCoins.map(coin => (
            <CoinCard
              key={coin.id}
              coin={coin}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Home