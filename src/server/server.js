import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({
  path: new URL('./.env', import.meta.url).pathname
})

const app = express()

app.use(cors())
app.use(express.json())

const cache = new Map()
const CACHE_TTL = 60 * 1000

const getFromCache = (key) => {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.data
}

const setInCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() })
}

let requestQueue = []
let isProcessing = false

const enqueue = (fn) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ fn, resolve, reject })
    processQueue()
  })
}

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return
  isProcessing = true
  const { fn, resolve, reject } = requestQueue.shift()
  try {
    const result = await fn()
    resolve(result)
  } catch (err) {
    reject(err)
  } finally {
    await new Promise(r => setTimeout(r, 600))
    isProcessing = false
    processQueue()
  }
}

const fetchCoinGecko = async (url) => {
  const cached = getFromCache(url)
  if (cached) return cached
  return enqueue(async () => {
    const response = await fetch(url)
    if (response.status === 429) throw new Error('Rate limited')
    const data = await response.json()
    setInCache(url, data)
    return data
  })
}

let exchangeRates = { usd_to_eur: 0.92, usd_to_ils: 3.7 }
let ratesLastFetched = 0

const getExchangeRates = async () => {
  if (Date.now() - ratesLastFetched < 24 * 60 * 60 * 1000) {
    return exchangeRates
  }
  try {
    const response = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=EUR,ILS'
    )
    const data = await response.json()
    exchangeRates = {
      usd_to_eur: data.rates.EUR,
      usd_to_ils: data.rates.ILS
    }
    ratesLastFetched = Date.now()
    console.log('Exchange rates updated:', exchangeRates)
  } catch (err) {
    console.log('Could not fetch exchange rates, using defaults')
  }
  return exchangeRates
}

app.get('/coins/markets', async (req, res) => {
  try {
    const [usdCoins, rates] = await Promise.all([
      fetchCoinGecko(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1'
      ),
      getExchangeRates()
    ])

    const merged = usdCoins.map(coin => ({
      ...coin,
      current_price_eur: coin.current_price
        ? parseFloat((coin.current_price * rates.usd_to_eur).toFixed(4))
        : null,
      current_price_ils: coin.current_price
        ? parseFloat((coin.current_price * rates.usd_to_ils).toFixed(4))
        : null
    }))

    res.json(merged)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: 'Failed to fetch coins' })
  }
})

app.get('/coins/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params
    const { market_data } = req.query
    const url = market_data
      ? `https://api.coingecko.com/api/v3/coins/${coinId}?market_data=true`
      : `https://api.coingecko.com/api/v3/coins/${coinId}`
    const data = await fetchCoinGecko(url)
    res.json(data)
  } catch (error) {
    console.log(error.message)
    res.status(429).json({ error: 'Too many requests, please wait a moment' })
  }
})

app.get('/pricemulti', async (req, res) => {
  try {
    const { fsyms } = req.query
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fsyms}&tsyms=USD`
    )
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch live prices' })
  }
})

const parseNumber = value => {
  if (!value) return null
  const normalized = value
    .toString()
    .replace(/,/g, '')
    .replace(/\$/g, '')
  const parsed = parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

const generateLocalRecommendation = prompt => {
  const usdMatch = prompt.match(/current_price_usd:\s*([0-9.,-]+)/i)
  const marketCapMatch = prompt.match(/market_cap_usd:\s*([0-9.,-]+)/i)
  const volumeMatch = prompt.match(/volume_24h_usd:\s*([0-9.,-]+)/i)
  const change30dMatch = prompt.match(/price_change_percentage_30d_in_currency:\s*([0-9.,-]+)/i)
  const change60dMatch = prompt.match(/price_change_percentage_60d_in_currency:\s*([0-9.,-]+)/i)
  const change200dMatch = prompt.match(/price_change_percentage_200d_in_currency:\s*([0-9.,-]+)/i)

  const price = parseNumber(usdMatch?.[1])
  const marketCap = parseNumber(marketCapMatch?.[1])
  const volume = parseNumber(volumeMatch?.[1])
  const change30d = parseNumber(change30dMatch?.[1])
  const change60d = parseNumber(change60dMatch?.[1])
  const change200d = parseNumber(change200dMatch?.[1])

  let decision = 'DO NOT BUY'
  let reason = 'The coin shows unclear momentum and higher risk at the moment.'

  if (marketCap != null && marketCap > 10_000_000_000 && change30d != null && change30d > 3) {
    decision = 'BUY'
    reason = 'The cryptocurrency has meaningful market size and recent positive momentum, so it looks more attractive now.'
  } else if (change30d != null && change30d > 10) {
    decision = 'BUY'
    reason = 'The asset has strong upward momentum in the last 30 days, making it a better buying candidate.'
  } else if (change200d != null && change200d > 20 && change30d != null && change30d > 0) {
    decision = 'BUY'
    reason = 'Long-term performance is positive and the recent trend is upward, supporting a buy recommendation.'
  } else if (change30d != null && change30d < -10) {
    decision = 'DO NOT BUY'
    reason = 'The asset has fallen significantly lately, which increases downside risk right now.'
  } else if (marketCap != null && marketCap < 500_000_000 && change30d != null && change30d < 0) {
    decision = 'DO NOT BUY'
    reason = 'Small market cap combined with recent negative momentum makes this coin riskier.'
  } else if (price != null) {
    decision = 'DO NOT BUY'
    reason = 'The data is mixed, so it is safer to avoid buying until the trend is clearer.'
  }

  return {
    choices: [
      {
        message: {
          content: `${decision}\n${reason}`
        }
      }
    ]
  }
}

const createAIResponse = async prompt => {
  const openAiKey = process.env.OPENAI_API_KEY

  if (!openAiKey) {
    throw new Error('OPENAI_API_KEY is required to call ChatGPT')
  }

  const url = 'https://api.openai.com/v1/chat/completions'
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 300
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  return response
}

app.post('/ai', async (req, res) => {
  const { prompt } = req.body

  try {
    const response = await createAIResponse(prompt)

    if (!response.ok) {
      const text = await response.text()
      console.log('AI service error:', response.status, text)
      return res.json(generateLocalRecommendation(prompt))
    }

    const data = await response.json()
    return res.json(data)
  } catch (error) {
    console.log('AI request failed:', error)
    return res.json(generateLocalRecommendation(prompt))
  }
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})