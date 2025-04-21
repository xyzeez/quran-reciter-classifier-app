export interface Ayah {
  surahNumber: number;
  surahName: {
    arabic: string;
    english: string;
  };
  ayahNumber: {
    arabic: string;
    english: string;
  };
  text: string;
}

export interface AyahPrediction {
  reliable: boolean;
  matchedAyah?: Ayah;
  similarAyahs?: Ayah[];
}
