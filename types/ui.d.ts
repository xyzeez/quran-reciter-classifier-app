import { Ionicons } from "@expo/vector-icons";
import { ViewStyle } from "react-native";

export interface ReciterSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export interface InputMethodToggleProps {
  fileInputType: "record" | "upload";
  setFileInputType: (type: "record" | "upload") => void;
}

export interface NavigationTabProps {
  title: string;
}

export interface ModalHeaderProps {
  title: string;
  onBackPress: () => void;
}

export interface ActionButtonProps {
  label: string;
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  backgroundColor?: string;
}

export interface EmptyStateScreenProps {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  buttonText?: string;
  onButtonPress: () => void;
}

export interface ErrorScreenProps {
  title: string;
  subtitle?: string;
  description?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  buttonText?: string;
  onButtonPress: () => void;
}

export interface LoadingScreenProps {
  message: string;
}

export interface SectionListHeaderProps {
  title: string;
  count?: number;
}

export interface ListTitleProps {
  title: string;
  count?: number;
}

export interface QuranVerseDisplayProps {
  text: string;
  ayahNumber: string;
}

export interface SurahTitleDisplayProps {
  surahNumberArabic: string;
  surahNumberEnglish: string;
  surahNameArabic: string;
  surahNameEnglish?: string;
}

export interface CircularConfidenceLoaderProps {
  confidence: number;
  size?: number;
  strokeWidth?: number;
  textSize?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export interface SurahListItemProps {
  active?: boolean;
  surahNameArabic: string;
  surahNameEnglish: string;
  ayahNumberArabic: string;
  ayahNumberEnglish: string;
  text: string;
}
