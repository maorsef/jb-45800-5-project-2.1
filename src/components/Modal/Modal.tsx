import './Modal.css'

import type { Coin } from '../../types/coin'

type Props = {
  open: boolean
  coins: Coin[]
  onClose: () => void
  onRemove: (symbol: string) => void
}

function Modal({
  open,
  coins,
  onClose,
  onRemove
}: Props) {
  if (!open) {
    return null
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>
          You can select up to 5
          coins
        </h2>

        <p>
          Remove one coin to add a
          new one
        </p>

        <div className='modal-coins'>
          {coins.map(coin => (
            <div
              key={coin.symbol}
              className='modal-coin'
            >
              <span>
                {coin.symbol.toUpperCase()}
              </span>

              <button
                onClick={() =>
                  onRemove(
                    coin.symbol
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          className='close-btn'
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default Modal