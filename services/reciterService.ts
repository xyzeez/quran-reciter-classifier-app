import axios from "axios";
import { API_URL } from "@/configs";

interface ReciterPrediction {
  primary_prediction: string;
  confidence: number;
  secondary_predictions: { reciter: string; confidence: number }[];
  processing_time: number;
}

interface AyahPrediction {
  primary_prediction: string;
  confidence: number;
  secondary_predictions: { ayah: string; confidence: number }[];
  processing_time: number;
}

export const reciterService = {
  async predictReciter(audioFile: {
    uri: string;
    name: string;
    type: string;
  }): Promise<ReciterPrediction> {
    const formData = new FormData();
    formData.append("audio", audioFile as any);

    const response = await axios.post(`${API_URL}/getReciter`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    });

    return response.data;
  },

  async predictAyah(audioFile: {
    uri: string;
    name: string;
    type: string;
  }): Promise<AyahPrediction> {
    const formData = new FormData();
    formData.append("audio", audioFile as any);

    const response = await axios.post(`${API_URL}/getReciter`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    });

    return response.data;
  },
};
