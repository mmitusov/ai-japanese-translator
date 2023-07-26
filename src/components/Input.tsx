import React, { useRef, useState } from 'react'
import useAutosizeTextArea from '@/hooks/useAutosizeTextArea';
import useIsHydrated from '@/hooks/useIsHydrated';
import InputStyles from '@/styles/input.module.scss'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { translateAPI } from '@/api/translateAPI';
import { speechToTextAPI } from '@/api/speechToTextAPI';

const Input = ({input, setInput, setTranslatedText}: any) => {
  const {
    // transcript,
    // listening,
    // resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const {isSsrHydrated} = useIsHydrated()
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, input)
  const [recording, setRecording] = useState<any>(false);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [isAudioUploaded, setIsAudioUploaded] = useState<Boolean>(true)

  ////'react-speech-recognition' library. For now for speech-recognition I'm using my own backend, thus I disabled it
  // useEffect(() => {
  //   onInputChange(transcript)
  // }, [transcript])

  //Start manual recording
  const startRecording = async () => {
    setRecording(true);
    // Access user's microphone and start recording audio
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder)
    const audioChunks: any = [];

    //Will be triggerd only after we stop 'mediaRecorder.stop();'
    mediaRecorder.ondataavailable = async (e: any) => {
      if (e.data.size > 0) {
        audioChunks.push(e.data);
      }
    };

    //Will be triggerd only after we stop 'mediaRecorder.stop();'
    mediaRecorder.onstop = async () => {
      try {
        if (audioChunks.length > 0) {
          const formData = new FormData();
          audioChunks.forEach((chunk: any) => {
            formData.append('file', chunk);
          });
          const data = await speechToTextAPI(formData)

          setInput((prev: string) => (prev + data))
          setIsAudioUploaded(true)
        }
      } catch (error) {
        console.error('Error sending audio chunks:', error);
      }
    };
    mediaRecorder.start();
  };

  //Stop manual recording
  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
    setIsAudioUploaded(false)
  }

  const clearInputField = () => {
    setInput('')
  }

  //Translate Input text
  async function translateInput (textToTranslate: string) {
    const data = await translateAPI(textToTranslate)
    setTranslatedText(data)
  }

  function onInputChange (text: string) {
    setInput(text)
  }

  if (!isSsrHydrated) {
    return <span>Loading...</span>;
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
        {!browserSupportsSpeechRecognition && <p>Your browser doesn't support speech recognition.</p>}

        <div className={`${InputStyles.buttonsSection}`}>
          <div>
            {
              ////'react-speech-recognition' library. For now for speech-recognition I'm using my own backend, thus I disabled it
              //'listening' instead of 'recording' 
              browserSupportsSpeechRecognition && isAudioUploaded && (
                <button
                  onClick={recording ? stopRecording : startRecording} //SpeechRecognition.stopListening || SpeechRecognition.startListening
                  className={`${recording ? InputStyles.buttonStop : InputStyles.buttonStart}`}
                >
                  {recording ? "Stop dictation" : "Start dictation"}
                </button>
              )
              ||
              browserSupportsSpeechRecognition && !isAudioUploaded && (
                <button className={`${InputStyles.loaderButton}`}>
                  <span className={`${InputStyles.loader}`}/>
                </button>
              )
            }
            <button onClick={clearInputField}>Clear</button>
          </div>

          <div>
            <button 
              className={`${InputStyles.buttonTranslate}`} 
              disabled={recording || input.length===0} //listening
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