import React, { useEffect, useState } from 'react'
import TranslationStyles from '@/styles/translation.module.scss'
import { textToSpeechAudio, textToSpeechParams } from '@/api/textToSpeechAPI';
import * as DOMPurify from 'dompurify';
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

let audio: any;

const Translation = ({translatedText, setTranslatedText}: any) => {
  const [audioFile, setAudioFile] = useState<Blob | null>(null)
  const [isAudioDownloaded, setIsAudioDownloaded] = useState<Boolean>(false)
  const [kuroshirooo, setKuroshirooo] = useState<string>('')

  //If there's new translation, fetch audio transcript for this tranlation
  useEffect(() => {
    (async() => {
      if (translatedText) {
        const kuroshiro = new Kuroshiro();
        const analyzer = new KuromojiAnalyzer({
          dictPath: '/dict/',
        });
        await kuroshiro.init(analyzer);
        const romaji = await kuroshiro.convert(translatedText, {
          to: 'romaji',
          mode: 'spaced',
          romajiSystem: 'passport',
        });
        const furigana = await kuroshiro.convert(translatedText, {
          mode:"furigana", 
          to:"hiragana"
        });
        const clean = DOMPurify.sanitize(furigana);
        console.log(clean)
        setKuroshirooo(clean)
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
        <p>
            {translatedText}
        </p>
        <p dangerouslySetInnerHTML={{ __html: kuroshirooo }} />

        <div className={`${TranslationStyles.buttonsSection}`}>
          <div>
            <button onClick={() => {navigator.clipboard.writeText(translatedText)}} className={`${TranslationStyles.buttonCopy}`}>Copy text</button>
            <button onClick={() => setTranslatedText('')}>Clear</button>
          </div>
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