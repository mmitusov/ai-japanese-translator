import React, { useEffect, useState } from 'react'
import TranslationStyles from '@/styles/translation.module.scss'
import axios from 'axios';

let audio: any;

const Translation = ({translatedText, setTranslatedText}: any) => {
  const [audioFile, setAudioFile] = useState<Blob | null>(null)
  const [isAudioDownloaded, setIsAudioDownloaded] = useState<Boolean>(false)

  useEffect(() => {
    if (!audio) audio = new Audio()
    if (translatedText) {
      setIsAudioDownloaded(false)
      speak(translatedText)
    }
  }, [translatedText])

  useEffect(() => {
    if (audioFile) {
      let fileReader = new FileReader();
      fileReader.onload = function() {
        audio.src = fileReader.result;
        audio.volume = 1;
      };
      fileReader.readAsDataURL(audioFile);
    }
  }, [audioFile])

  const playAudio = () => {
    audio.play();
  }

  async function speak(text: string) {
    try {
      // Generate initial voice paramets
      const audioResponse: any = await axios.post(`http://127.0.0.1:50011/audio_query?text=${text}&speaker=1`);
      const audioData = await audioResponse.data;
    
      //Adjusting desired voice parametrs to our liking
      audioData.volumeScale = 2.0;
      audioData.intonationScale = 1.5;
      audioData.prePhonemeLength = 1.0;
      audioData.postPhonemeLength = 1.0;
    
      // Synthesize voice as a 'wav' file
      const synthesisResponse: any = await axios.post('http://127.0.0.1:50011/synthesis?speaker=1', audioData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setAudioFile(synthesisResponse.data)
      setIsAudioDownloaded(true)
  
      // //Downloading recieved audio-blop
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
  
  return (
    <div className={`${TranslationStyles.translationContainer}`}>
        <h1>Translation</h1>
        <p>
            {translatedText}
        </p>

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