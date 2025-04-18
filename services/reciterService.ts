import axios from "axios";
import { API_URL } from "@/configs";
import { ReciterPrediction } from "@/types/predictions";

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
