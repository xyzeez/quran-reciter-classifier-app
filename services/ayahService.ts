import { Ayah, AyahPrediction } from "../types/ayah";
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
      });

      if (!response.ok) {
        let errorBody = {};
        try {
          errorBody = await response.json();
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(`Server responded with status ${response.status}`);
      }

      const result = await response.json();

      const transformedResult: AyahPrediction = {
        reliable: result.matches_found,
        matchedAyah: result.best_match
          ? {
              surah_number: result.best_match.surah_number,
              surah_number_en: result.best_match.surah_number_en,
              surah_name: result.best_match.surah_name,
              surah_name_en: result.best_match.surah_name_en,
              ayah_number: result.best_match.ayah_number,
              ayah_number_en: result.best_match.ayah_number_en,
              ayah_text: result.best_match.ayah_text,
              confidence_score: result.best_match.confidence_score,
              unicode: result.best_match.unicode || "",
            }
          : null,
        similarAyahs: (result.matches || []).map((match: any) => ({
          surah_number: match.surah_number,
          surah_number_en: match.surah_number_en,
          surah_name: match.surah_name,
          surah_name_en: match.surah_name_en,
          ayah_number: match.ayah_number,
          ayah_number_en: match.ayah_number_en,
          ayah_text: match.ayah_text,
          confidence_score: match.confidence_score,
          unicode: match.unicode || "",
        })),
      };

      return transformedResult;
    } catch (error) {
      console.error("Error predicting ayah:", error);
      throw error;
    }
  },
};

export default ayahService;
