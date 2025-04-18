import axios from "axios";
import { API_URL } from "@/configs";
import { Reciter } from "@/types/reciter";

interface ReciterPrediction {
  reliable: boolean;
  main_prediction?: {
    name: string;
    confidence: number;
    nationality: string;
    flagUrl: string;
    imageUrl: string;
    serverUrl: string;
  };
  top_predictions?: {
    name: string;
    confidence: number;
    nationality: string;
    flagUrl: string;
    imageUrl: string;
    serverUrl: string;
  }[];
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
};
