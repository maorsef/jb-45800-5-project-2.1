import './CoinCard.css'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../app/store'
import { addCoin, removeCoin } from '../../features/selectedCoins/selectedCoinsSlice'
import MoreInfo from '../MoreInfo/MoreInfo'
import Modal from '../Modal/Modal'
import type { Coin } from '../../types/coin'

type Props = {
  coin: Coin
}

function CoinCard({ coin }: Props) {
  const dispatch = useDispatch()

  const selectedCoins = useSelector(
    (state: RootState) => state.selectedCoins.coins
  )

  const [showInfo, setShowInfo] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const isSelected = selectedCoins.some(
    selected => selected.symbol === coin.symbol
  )

  const handleToggle = () => {
    if (!isSelected) {
      if (selectedCoins.length >= 5) {
        setShowModal(true)
        return
      }
      dispatch(addCoin(coin))
    } else {
      dispatch(removeCoin(coin.symbol))
    }
  }

  return (
    <>
      <div className='coin-card'>
        <img src={coin.image} alt={coin.name} />

        <h2>{coin.symbol.toUpperCase()}</h2>

        <p>{coin.name}</p>

        <div className='coin-actions'>
          <button onClick={() => setShowInfo(!showInfo)}>
            {showInfo ? 'Close Info' : 'More Info'}
          </button>

          <input
            type='checkbox'
            checked={isSelected}
            onChange={handleToggle}
          />
        </div>

        {showInfo && (
          <MoreInfo
            usd={coin.current_price ?? null}
            eur={coin.current_price_eur ?? null}
            ils={coin.current_price_ils ?? null}
          />
        )}
      </div>

      <Modal
        open={showModal}
        coins={selectedCoins}
        onClose={() => setShowModal(false)}
        onRemove={coinToRemove => {
          dispatch(removeCoin(coinToRemove))
          setShowModal(false)
          dispatch(addCoin(coin))
        }}
      />
    </>
  )
}

export default CoinCard