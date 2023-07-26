import axios from "axios"

export async function textToSpeechParams (text: string): Promise<any> {
    const audioResponse = await axios.post(`http://127.0.0.1:50011/audio_query?text=${text}&speaker=1`);
    const audioData = await audioResponse.data;

    //Adjusting desired voice parametrs to our liking
    audioData.volumeScale = 2.0;
    audioData.intonationScale = 1.5;
    audioData.prePhonemeLength = 1.0;
    audioData.postPhonemeLength = 1.0;

    return audioData;
}

export async function textToSpeechAudio (audioData: any): Promise<any> {
    const synthesisResponse: any = await axios.post('http://127.0.0.1:50011/synthesis?speaker=1', audioData, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return synthesisResponse;
}
