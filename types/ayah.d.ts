export interface Ayah {
  surah_number: string;
  surah_number_en: number;
  surah_name: string;
  surah_name_en: string;
  ayah_number: string;
  ayah_number_en: number;
  ayah_text: string;
  encode: string;
}

export interface AyahPrediction {
  reliable: boolean;
  matchedAyah?: Ayah;
  similarAyahs?: Ayah[];
}
