import { ReciterPrediction } from "@/types/predictions";
import { Reciter } from "@/types/reciter";
import { API_URL } from "../configs";

// Mock data for reciter predictions
const reciters = [
  {
    id: "1",
    name: "Mishary Rashid Alafasy",
    confidence: 95,
    nationality: "Kuwait",
    country: "KW",
    flagUrl: "https://flagcdn.com/w320/kw.png",
    imageUrl: "https://i.imgur.com/JhzBTkP.png",
    serverUrl: "https://server.mp3quran.net/afs",
  },
  {
    id: "2",
    name: "Abdul Rahman Al-Sudais",
    confidence: 87,
    nationality: "Saudi Arabia",
    country: "SA",
    flagUrl: "https://flagcdn.com/w320/sa.png",
    imageUrl: "https://i.imgur.com/rh00Fju.png",
    serverUrl: "https://server.mp3quran.net/sudais",
  },
  {
    id: "3",
    name: "Saud Al-Shuraim",
    confidence: 78,
    nationality: "Saudi Arabia",
    country: "SA",
    flagUrl: "https://flagcdn.com/w320/sa.png",
    imageUrl: "https://i.imgur.com/PTdBhWt.png",
    serverUrl: "https://server.mp3quran.net/shr",
  },
  {
    id: "4",
    name: "Maher Al Muaiqly",
    confidence: 72,
    nationality: "Saudi Arabia",
    country: "SA",
    flagUrl: "https://flagcdn.com/w320/sa.png",
    imageUrl: "https://i.imgur.com/vPVfaQt.png",
    serverUrl: "https://server.mp3quran.net/maher",
  },
  {
    id: "5",
    name: "Muhammad Siddiq Al-Minshawi",
    confidence: 65,
    nationality: "Egypt",
    country: "EG",
    flagUrl: "https://flagcdn.com/w320/eg.png",
    imageUrl: "https://i.imgur.com/19MY9qZ.png",
    serverUrl: "https://server.mp3quran.net/minsh",
  },
  {
    id: "6",
    name: "Hani Ar-Rifai",
    confidence: 58,
    nationality: "Egypt",
    country: "EG",
    flagUrl: "https://flagcdn.com/w40/eg.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Abdul-Rahman_Al-Sudais_%28Cropped%2C_2011%29.jpg/449px-Abdul-Rahman_Al-Sudais_%28Cropped%2C_2011%29.jpg",
    serverUrl: "https://server.mp3quran.net/hani",
  },
  {
    id: "7",
    name: "Mahmoud Khalil Al-Hussary",
    confidence: 55,
    nationality: "Egypt",
    country: "EG",
    flagUrl: "https://flagcdn.com/w40/eg.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Abdul-Rahman_Al-Sudais_%28Cropped%2C_2011%29.jpg/449px-Abdul-Rahman_Al-Sudais_%28Cropped%2C_2011%29.jpg",
    serverUrl: "https://server.mp3quran.net/husary",
  },
];

const reciterService = {
  // Get all reciters for search functionality
  getAllReciters(): Reciter[] {
    // TODO: Consider fetching this from the server too if needed
    return reciters;
  },

  async predictReciter(audioFile: {
    uri: string;
    name: string;
    type: string;
  }): Promise<ReciterPrediction> {
    const formData = new FormData();
    // Append the file using the 'audio' key expected by the server
    // The type assertion is needed because TypeScript's FormData.append expects string | Blob
    formData.append("audio", {
      uri: audioFile.uri,
      name: audioFile.name,
      type: audioFile.type,
    } as any); // Use 'any' for type assertion, adjust if a stricter type is possible/needed

    // Optional: Add parameters if needed, e.g., show_unreliable_predictions
    // formData.append('show_unreliable_predictions', 'true');

    try {
      const response = await fetch(`${API_URL}/getReciter`, {
        method: "POST",
        body: formData,
        // Headers might be needed depending on server config, especially 'Content-Type': 'multipart/form-data'
        // However, fetch often sets this automatically for FormData. Add if issues occur.
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
      });

      if (!response.ok) {
        // Attempt to read error message from server response
        let errorBody = {};
        try {
          errorBody = await response.json();
        } catch (e) {
          // Ignore if response body is not JSON
        }
        console.error("Server error response:", errorBody);
        throw new Error(`Server responded with status ${response.status}`);
      }

      const result: ReciterPrediction = await response.json();
      return result;
    } catch (error) {
      console.error("Error predicting reciter:", error);
      // Re-throw the error to be handled by the caller (e.g., UI)
      // You might want to return a specific error structure or handle it differently
      throw error;
    }
  },
};

export default reciterService;
