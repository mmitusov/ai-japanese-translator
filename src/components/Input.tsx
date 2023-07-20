import React, { useRef } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useIsHydrated from '@/hooks/useIsHydrated';
import { useEffect, useState } from 'react';
import InputStyles from '@/styles/input.module.scss'
import useAutosizeTextArea from '@/hooks/useAutosizeTextArea';
import axios from 'axios';

const Input = ({input, setInput, setTranslatedText}: any) => {
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    const {isSsrHydrated} = useIsHydrated()
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, input)
  
    useEffect(() => {
      onInputChange(transcript)
    }, [transcript])

    async function translateInput (textToTranslate: string) {
      const response = await axios.post(
        'https://translation.googleapis.com/language/translate/v2',
        {},
        {
          params: {
            key: 'AIzaSyDtj8Av-a4qeIYf5trEO_N4WCZgOsGLtII',
            q: textToTranslate,
            source: 'en',
            target: 'uk', //ja, ru
          }
        }
      )
      const data = await response.data.data.translations[0].translatedText
      setInput('')
      setTranslatedText(data)
    }

    function onInputChange (text) {
      setInput(text)
    }
  
    if (isSsrHydrated && !browserSupportsSpeechRecognition) {
      return <span>Your browser doesn't support speech recognition.</span>;
    }
    
  return (
    <div className={`${InputStyles.inputContainer}`}>
        <textarea 
            ref={textAreaRef}
            placeholder={`Let's translate...`}
            value={input}
            rows={1}
            onChange={(e) => onInputChange(e.target.value)}
        />
        <div className={`${InputStyles.buttonsSection}`}>
          <div >
              {
                  listening
                      ? <button onClick={SpeechRecognition.stopListening} className={`${InputStyles.buttonStop}`}>Stop dictation</button>
                      : <button onClick={SpeechRecognition.startListening} className={`${InputStyles.buttonStart}`}>Start dictation</button>
              }
              <button onClick={resetTranscript}>Reset</button>
          </div>
          <div>
            <button 
              className={`${InputStyles.buttonTranslate}`} 
              disabled={listening || input.length===0}
              onClick={() => translateInput(input)}
            >
              Translate
            </button>
          </div>
        </div>
    </div>
  )
}

export default Input