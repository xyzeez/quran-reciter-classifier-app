import { ReciterPrediction } from "@/types/predictions";
import { Reciter } from "@/types/reciter";

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
    return reciters;
  },

  async predictReciter(audioFile: {
    uri: string;
    name: string;
    type: string;
  }): Promise<ReciterPrediction> {
    // Simulate an API call with a delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Force error for testing
        const random = 0.6; // Value > 0.95 will trigger error case

        // 80% chance of reliable prediction
        if (random < 0.8) {
          resolve({
            reliable: true,
            main_prediction: reciters[0],
            top_predictions: reciters,
          });
        }
        // 15% chance of unreliable prediction
        else if (random < 0.95) {
          resolve({
            reliable: false,
            top_predictions: reciters,
          });
        }
        // 5% chance of error
        else {
          reject(new Error("Failed to predict reciter"));
        }
      }, 2000); // 2 second delay to simulate loading
    });
  },
};

export default reciterService;
