import React from 'react'
import TranslationStyles from '@/styles/translation.module.scss'


const Translation = ({translatedText, setTranslatedText}: any) => {
  return (
    <div className={`${TranslationStyles.translationContainer}`}>
        <h1>Translation</h1>
        <p>
            {translatedText}
        </p>
    </div>
  )
}

export default Translation