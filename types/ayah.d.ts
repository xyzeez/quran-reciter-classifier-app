export interface Ayah {
  /** Arabic numeral representation */
  surah_number: string;
  /** English numeral representation */
  surah_number_en: number;
  /** Arabic surah name */
  surah_name: string;
  /** English surah name */
  surah_name_en: string;
  /** Arabic ayah number */
  ayah_number: string;
  /** English ayah number */
  ayah_number_en: number;
  /** Arabic text */
  ayah_text: string;
  /** Match confidence (0-1) */
  confidence_score: number;
  /** Unicode representation for surah name display */
  unicode: string;
}

export interface AyahPrediction {
  /** Match reliability status */
  reliable: boolean;
  /** Best matching ayah */
  matchedAyah: Ayah | null;
  /** Similar ayahs by confidence */
  similarAyahs: Ayah[];
}
