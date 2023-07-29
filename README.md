npm i sass
npm i react-speech-recognition
npm i --save regenerator-runtime //To fix Error [ReferenceError]: regeneratorRuntime is not defined - import 'regenerator-runtime/runtime'
npm i kuroshiro
npm i kuroshiro-analyzer-kuromoji

AI Audio Conversations Using OpenAI Whisper - https://medium.com/@david.richards.tech/ai-audio-conversations-with-openai-whisper-3c730a9c7123


POST /audio_query - берем от сюда параметры и передаем в /synthesis
POST /synthesis

NotAllowedError: The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.
https://arrangeactassert.com/posts/how-to-fix-the-request-is-not-allowed-by-the-user-agent-or-the-platform-in-the-current-context-possibly-because-the-user-denied-permission/

const data = await response.data.results[0].transcript.trimStart();


If we want we can convert one Blob data type into another (e.g. video to audio)
const audioBlob = new Blob(audioChunks, {type: audio/mpeg});

kuromoji - dict