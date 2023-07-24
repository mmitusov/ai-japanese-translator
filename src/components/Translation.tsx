import React from 'react'
import TranslationStyles from '@/styles/translation.module.scss'
import axios from 'axios';

const Translation = ({translatedText, setTranslatedText}: any) => {

  async function speak(text: string) {
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
  
    //Downloading recieved audio-blop
    const href = window.URL.createObjectURL(synthesisResponse.data);
    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = 'AiAudio';
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);
  }
  // speak('平素より弊社アプリをご利用いただき誠にありがとうございます！')
  
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