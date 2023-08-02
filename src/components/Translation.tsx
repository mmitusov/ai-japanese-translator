import React, { useEffect, useState } from 'react'
import TranslationStyles from '@/styles/translation.module.scss'
import { textToSpeechAudio, textToSpeechParams } from '@/api/textToSpeechAPI';
import { kanjiAnnotation } from '@/utils/kanjiAnnotation';
import KanjiDropdown from './KanjiDropdown';

let audio: any;

const Translation = ({translatedText, setTranslatedText, romaji, setRomaji, furigana, setFurigana}: any) => {
  const [audioFile, setAudioFile] = useState<Blob | null>(null)
  const [isAudioDownloaded, setIsAudioDownloaded] = useState<Boolean>(false)
  const [dropdownValue, setDropdownValue] = useState<string>('Kanji')

  //If there's new translation, annotate kanji and fetch audio transcript for this tranlation
  useEffect(() => {
    (async() => {
      if (translatedText) {
        const {cleanRomaji, cleanFurigana} = await kanjiAnnotation(translatedText);
        setRomaji(cleanRomaji)
        setFurigana(cleanFurigana)
        setIsAudioDownloaded(false)
        speak(translatedText)
      }
    })()
  }, [translatedText])

  //If we recieved audio transcript - make this file our current source of audio
  useEffect(() => {
    if (!audio) audio = new Audio()
    if (audioFile) {
      let fileReader = new FileReader();
      fileReader.onload = function() {
        audio.src = fileReader.result;
        audio.volume = 1;
      };
      fileReader.readAsDataURL(audioFile);
    }
  }, [audioFile])

  async function speak(text: string) {
    try {
      // Generate initial voice paramets
      const audioData = await textToSpeechParams(text);
    
      // Synthesize voice as a 'wav' file
      const synthesisResponse = await textToSpeechAudio(audioData);

      setAudioFile(synthesisResponse?.data)
      setIsAudioDownloaded(true)
    } catch (error) {
      console.error(error)
    }
  }

  const playAudio = () => {
    audio.play();
  }
  
  return (
    <div className={`${TranslationStyles.translationContainer}`}>
        <h1>Translation</h1>
        {
          dropdownValue === 'Kanji' && <p>{translatedText}</p>
          || dropdownValue === 'Romaji' && <p>{romaji}</p>
          || dropdownValue === 'Furigana' &&  <p dangerouslySetInnerHTML={{ __html: furigana }} />
        }
        <div className={`${TranslationStyles.buttonsSection}`}>
          <div>
            <button onClick={() => {navigator.clipboard.writeText(translatedText)}} className={`${TranslationStyles.buttonCopy}`}>Copy text</button>
            <button onClick={() => setTranslatedText('')}>Clear</button>
          </div>

          <KanjiDropdown setDropdownValue={setDropdownValue}/>

          {
            isAudioDownloaded
              ? 
                <button 
                  onClick={() => playAudio()}
                  className={`${TranslationStyles.buttonVoice}`}
                >
                  Play voice
                </button>
              : 
                <span className={`${TranslationStyles.loader}`}/>
          }
        </div>
    </div>
  )
}

export default Translation