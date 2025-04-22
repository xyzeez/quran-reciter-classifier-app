import { Ayah, AyahPrediction } from "@/types/ayah";
import { API_URL } from "../configs"; // Import API_URL

// Removed mock ayahs array and ensureEncodeField helper

const ayahService = {
  async predictAyah(audioFile: {
    uri: string;
    name: string;
    type: string;
  }): Promise<AyahPrediction> {
    const formData = new FormData();
    formData.append("audio", {
      uri: audioFile.uri,
      name: audioFile.name,
      type: audioFile.type,
    } as any);

    // Optional: Add parameters if needed, e.g., max_matches, min_confidence
    // formData.append('max_matches', '10');
    // formData.append('min_confidence', '0.65');

    try {
      const response = await fetch(`${API_URL}/getAyah`, {
        method: "POST",
        body: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }, // Usually not needed with fetch + FormData
      });

      if (!response.ok) {
        let errorBody = {};
        try {
          errorBody = await response.json();
        } catch (e) {}
        console.error("Server error response (getAyah):", errorBody);
        throw new Error(`Server responded with status ${response.status}`);
      }

      const result: AyahPrediction = await response.json();

      console.log("Result:", result);

      // Optional: Add validation here to ensure the structure matches AyahPrediction
      // if (typeof result.reliable !== 'boolean' || !Array.isArray(result.similarAyahs)) {
      //    console.error('Invalid response structure from /getAyah:', result);
      //    throw new Error('Invalid response structure from server');
      // }

      return result;
    } catch (error) {
      console.error("Error predicting ayah:", error);
      throw error;
    }
  },
};

export default ayahService;
