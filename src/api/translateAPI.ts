import axios from "axios"

export async function translateAPI (textToTranslate: string): Promise<string> {
  const response = await axios.post(
    'https://translation.googleapis.com/language/translate/v2',
    {},
    {
      params: {
        key: process.env.NEXT_PUBLIC_GOOGLE_TRANLATE_API,
        q: textToTranslate,
        // source: 'en', //Если убрать параметр 'source', то язык будет определяться автоматически
        target: 'ja', //ja (япон), uk (укр), ru (рус)
      }
    }
  )
  const data = await response.data.data.translations[0].translatedText
  return data
}