import { ReciterPrediction } from "@/types/predictions";
import { Reciter } from "@/types/reciter";
import { API_URL } from "../configs";

const reciterService = {
  async getAllReciters(): Promise<Reciter[]> {
    try {
      const response = await fetch(`${API_URL}/getAllReciters`);
      if (!response.ok) {
        console.error(
          "Server error response (getAllReciters):",
          await response.text()
        );
        throw new Error(`Server responded with status ${response.status}`);
      }
      const result: Reciter[] = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching all reciters:", error);
      return [];
    }
  },

  async predictReciter(audioFile: {
    uri: string;
    name: string;
    type: string;
  }): Promise<ReciterPrediction> {
    const formData = new FormData();
    formData.append("audio", {
      uri: audioFile.uri,
      name: audioFile.name,
      type: audioFile.type,
    } as any);

    try {
      const response = await fetch(`${API_URL}/getReciter`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error(`Server responded with status ${response.status}`);

      const result: ReciterPrediction = await response.json();
      return result;
    } catch (error) {
      console.error("Error predicting reciter:", error);
      throw error;
    }
  },
};

export default reciterService;
