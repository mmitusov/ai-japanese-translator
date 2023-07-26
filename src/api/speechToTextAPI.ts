import axios from "axios"

export async function speechToTextAPI (formData: any): Promise<string> {
    const response = await axios.post("http://localhost:3005/whisper", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    const data = await response.data.results[0].transcript.trimStart();
    return data
}