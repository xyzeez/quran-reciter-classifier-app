import { Ayah, AyahPrediction } from "@/types/ayah";

// Mock data for ayah predictions
const ayahs: Ayah[] = [
  {
    surah_number: "٢",
    surah_number_en: 2,
    surah_name: "البقرة",
    surah_name_en: "The Opening",
    ayah_number: "٢٨٢",
    ayah_number_en: 282,
    ayah_text:
      "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓاْ إِذَا تَدَايَنتُم بِدَيۡنٍ إِلَىٰٓ أَجَلٖ مُّسَمّٗى فَٱكۡتُبُوهُۚ وَلۡيَكۡتُب بَّيۡنَكُمۡ كَاتِبُۢ بِٱلۡعَدۡلِۚ وَلَا يَأۡبَ كَاتِبٌ أَن يَكۡتُبَ كَمَا عَلَّمَهُ ٱللَّهُۚ فَلۡيَكۡتُبۡ وَلۡيُمۡلِلِ ٱلَّذِي عَلَيۡهِ ٱلۡحَقُّ وَلۡيَتَّقِ ٱللَّهَ رَبَّهُۥ وَلَا يَبۡخَسۡ مِنۡهُ شَيۡـٔٗاۚ فَإِن كَانَ ٱلَّذِي عَلَيۡهِ ٱلۡحَقُّ سَفِيهًا أَوۡ ضَعِيفًا أَوۡ لَا يَسۡتَطِيعُ أَن يُمِلَّ هُوَ فَلۡيُمۡلِلۡ وَلِيُّهُۥ بِٱلۡعَدۡلِۚ وَٱسۡتَشۡهِدُواْ شَهِيدَيۡنِ مِن رِّجَالِكُمۡۖ فَإِن لَّمۡ يَكُونَا رَجُلَيۡنِ فَرَجُلٞ وَٱمۡرَأَتَانِ مِمَّن تَرۡضَوۡنَ مِنَ ٱلشُّهَدَآءِ أَن تَضِلَّ إِحۡدَىٰهُمَا فَتُذَكِّرَ إِحۡدَىٰهُمَا ٱلۡأُخۡرَىٰۚ وَلَا يَأۡبَ ٱلشُّهَدَآءُ إِذَا مَا دُعُواْۚ وَلَا تَسۡـَٔمُوٓاْ أَن تَكۡتُبُوهُ صَغِيرًا أَوۡ كَبِيرًا إِلَىٰٓ أَجَلِهِۦۚ ذَٰلِكُمۡ أَقۡسَطُ عِندَ ٱللَّهِ وَأَقۡوَمُ لِلشَّهَٰدَةِ وَأَدۡنَىٰٓ أَلَّا تَرۡتَابُوٓاْ إِلَّآ أَن تَكُونَ تِجَٰرَةً حَاضِرَةٗ تُدِيرُونَهَا بَيۡنَكُمۡ فَلَيۡسَ عَلَيۡكُمۡ جُنَاحٌ أَلَّا تَكۡتُبُوهَاۗ وَأَشۡهِدُوٓاْ إِذَا تَبَايَعۡتُمۡۚ وَلَا يُضَآرَّ كَاتِبٞ وَلَا شَهِيدٞۚ وَإِن تَفۡعَلُواْ فَإِنَّهُۥ فُسُوقُۢ بِكُمۡۗ وَٱتَّقُواْ ٱللَّهَۖ وَيُعَلِّمُكُمُ ٱللَّهُۗ وَٱللَّهُ بِكُلِّ شَيۡءٍ عَلِيمٞ",
    encode: "\uE901",
  },
  {
    surah_number: "٩٩",
    surah_number_en: 99,
    surah_name: "الزلزلة",
    surah_name_en: "The Earthquake",
    ayah_number: "١",
    ayah_number_en: 1,
    ayah_text:
      "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓاْ إِذَا تَدَايَنتُم بِدَيۡنٍ إِلَىٰٓ أَجَلٖ مُّسَمّٗى فَٱكۡتُبُوهُۚ وَلۡيَكۡتُب بَّيۡنَكُمۡ كَاتِبُۢ بِٱلۡعَدۡلِۚ وَلَا يَأۡبَ كَاتِبٌ أَن يَكۡتُبَ كَمَا عَلَّمَهُ ٱللَّهُۚ فَلۡيَكۡتُبۡ وَلۡيُمۡلِلِ ٱلَّذِي عَلَيۡهِ ٱلۡحَقُّ وَلۡيَتَّقِ ٱللَّهَ رَبَّهُۥ وَلَا يَبۡخَسۡ مِنۡهُ شَيۡـٔٗاۚ فَإِن كَانَ ٱلَّذِي عَلَيۡهِ ٱلۡحَقُّ سَفِيهًا أَوۡ ضَعِيفًا أَوۡ لَا يَسۡتَطِيعُ أَن يُمِلَّ هُوَ فَلۡيُمۡلِلۡ وَلِيُّهُۥ بِٱلۡعَدۡلِۚ وَٱسۡتَشۡهِدُواْ شَهِيدَيۡنِ مِن رِّجَالِكُمۡۖ فَإِن لَّمۡ يَكُونَا رَجُلَيۡنِ فَرَجُلٞ وَٱمۡرَأَتَانِ مِمَّن تَرۡضَوۡنَ مِنَ ٱلشُّهَدَآءِ أَن تَضِلَّ إِحۡدَىٰهُمَا فَتُذَكِّرَ إِحۡدَىٰهُمَا ٱلۡأُخۡرَىٰۚ وَلَا يَأۡبَ ٱلشُّهَدَآءُ إِذَا مَا دُعُواْۚ وَلَا تَسۡـَٔمُوٓاْ أَن تَكۡتُبُوهُ صَغِيرًا أَوۡ كَبِيرًا إِلَىٰٓ أَجَلِهِۦۚ ذَٰلِكُمۡ أَقۡسَطُ عِندَ ٱللَّهِ وَأَقۡوَمُ لِلشَّهَٰدَةِ وَأَدۡنَىٰٓ أَلَّا تَرۡتَابُوٓاْ إِلَّآ أَن تَكُونَ تِجَٰرَةً حَاضِرَةٗ تُدِيرُونَهَا بَيۡنَكُمۡ فَلَيۡسَ عَلَيۡكُمۡ جُنَاحٌ أَلَّا تَكۡتُبُوهَاۗ وَأَشۡهِدُوٓاْ إِذَا تَبَايَعۡتُمۡۚ وَلَا يُضَآرَّ كَاتِبٞ وَلَا شَهِيدٞۚ وَإِن تَفۡعَلُواْ فَإِنَّهُۥ فُسُوقُۢ بِكُمۡۗ وَٱتَّقُواْ ٱللَّهَۖ وَيُعَلِّمُكُمُ ٱللَّهُۗ وَٱللَّهُ بِكُلِّ شَيۡءٍ عَلِيمٞ",
    encode: "\uE902",
  },
  {
    surah_number: "١١٢",
    surah_number_en: 112,
    surah_name: "الإخلاص",
    surah_name_en: "The Sincerity",
    ayah_number: "١",
    ayah_number_en: 1,
    ayah_text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    encode: "\uE903",
  },
  {
    surah_number: "١",
    surah_number_en: 1,
    surah_name: "الفاتحة",
    surah_name_en: "The Opening",
    ayah_number: "١",
    ayah_number_en: 1,
    ayah_text: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    encode: "\uE904",
  },
  {
    surah_number: "١",
    surah_number_en: 1,
    surah_name: "الفاتحة",
    surah_name_en: "The Opening",
    ayah_number: "٥",
    ayah_number_en: 5,
    ayah_text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    encode: "\uE905",
  },
  {
    surah_number: "١٠٥",
    surah_number_en: 105,
    surah_name: "الفيل",
    surah_name_en: "Al-Fil",
    ayah_number: "٥",
    ayah_number_en: 5,
    ayah_text: "فَجَعَلَهُمۡ كَعَصۡفٖ مَّأۡكُولِۭ",
    encode: "\uE906",
  },
];

// Add example from user query
ayahs.push({
  surah_number: "٢٨٢",
  surah_number_en: 282,
  surah_name: "الفيل",
  surah_name_en: "Al-Fil",
  ayah_number: "٢٨٢",
  ayah_number_en: 532,
  ayah_text: "فَجَعَلَهُمۡ كَعَصۡفٖ مَّأۡكُولِۭ",
  encode: "\uE900",
});

// Helper function to ensure encode field exists
const ensureEncodeField = (ayah: Ayah): Ayah => {
  const updatedAyah = { ...ayah };

  // Ensure encode field exists
  if (!updatedAyah.encode) {
    updatedAyah.encode = "\uE900";
  }

  return updatedAyah;
};

const ayahService = {
  async predictAyah(audioFile: {
    uri: string;
    name: string;
    type: string;
  }): Promise<AyahPrediction> {
    // Simulate an API call with a delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const random = Math.random();

        // Process ayahs to ensure they all have encode field
        const processedAyahs = ayahs.map(ensureEncodeField);

        // 75% chance of reliable prediction
        if (random < 0.75) {
          resolve({
            reliable: true,
            matchedAyah: processedAyahs[0],
            similarAyahs: processedAyahs.slice(1),
          });
        }
        // 20% chance of unreliable prediction
        else if (random < 0.95) {
          resolve({
            reliable: false,
            similarAyahs: processedAyahs,
          });
        }
        // 5% chance of error
        else {
          reject(new Error("Failed to predict ayah"));
        }
      }, 2000); // 2 second delay to simulate loading
    });
  },
};

export default ayahService;
