import axios from 'axios'

export const getAIRecommendation = async (
  prompt: string
) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/ai',
      {
        prompt
      }
    )

    return (
      response.data?.choices?.[0]?.message
        ?.content || 'No response'
    )
  } catch (error) {
    console.log(error)

    throw error
  }
}