import React, { useEffect, useState } from 'react'
import TranslationStyles from '@/styles/translation.module.scss'
import { textToSpeechAudio, textToSpeechParams } from '@/api/textToSpeechAPI';
import { kanjiAnnotation } from '@/utils/kanjiAnnotation';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const options = [
  'Kanji', 'Furigana', 'Romaji'
];
const defaultOption = options[0];


let audio: any;

const Translation = ({translatedText, setTranslatedText}: any) => {
  const [audioFile, setAudioFile] = useState<Blob | null>(null)
  const [isAudioDownloaded, setIsAudioDownloaded] = useState<Boolean>(false)
  const [romaji, setRomaji] = useState<string>('')
  const [furigana, setFurigana] = useState<string>('')
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
  
      // //Downloading recieved audio-blop file
      // const href = window.URL.createObjectURL(synthesisResponse.data);
      // const anchorElement = document.createElement('a');
      // anchorElement.href = href;
      // anchorElement.download = 'AiAudio';
      // document.body.appendChild(anchorElement);
      // anchorElement.click();
      // document.body.removeChild(anchorElement);
      // window.URL.revokeObjectURL(href);
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

          <Dropdown options={options} onChange={(e) => setDropdownValue(e.value)} value={defaultOption} placeholder="Select an option" />
          
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