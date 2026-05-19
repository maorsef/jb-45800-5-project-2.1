type Props = {
  usd: number | null
  eur: number | null
  ils: number | null
}

const DEFAULT_USD_TO_EUR = 0.92
const DEFAULT_USD_TO_ILS = 3.7

function MoreInfo({ usd, eur, ils }: Props) {
  const eurValue =
    eur != null
      ? eur
      : usd != null
      ? parseFloat((usd * DEFAULT_USD_TO_EUR).toFixed(4))
      : null

  const ilsValue =
    ils != null
      ? ils
      : usd != null
      ? parseFloat((usd * DEFAULT_USD_TO_ILS).toFixed(4))
      : null

  return (
    <div style={{ marginTop: '12px', lineHeight: '1.8' }}>
      <p>$ {usd != null ? usd.toLocaleString() : 'N/A'}</p>
      <p>€ {eurValue != null ? eurValue.toLocaleString() : 'N/A'}</p>
      <p>₪ {ilsValue != null ? ilsValue.toLocaleString() : 'N/A'}</p>
    </div>
  )
}

export default MoreInfo