import { Ionicons } from "@expo/vector-icons";
import { ViewStyle, ScrollView } from "react-native";
import React from "react";

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
  ayah_text: string;
  ayah_number: string;
  surah_name_en: string;
  surah_number: string;
  surah_number_en: number | string;
  encode: string;
  isSingleResult?: boolean;
  scrollViewRef?: React.RefObject<ScrollView>;
}

export interface SurahTitleDisplayProps {
  surah_number: string;
  surah_number_en: number | string;
  surah_name: string;
  surah_name_en?: string;
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
  surah_name: string;
  surah_name_en: string;
  surah_number: string; // Arabic Surah Number
  surah_number_en: string | number; // English Surah Number
  ayah_number: string; // Ayah number within the Surah
  ayah_text: string;
  onPress?: () => void; // Handler for when the item is pressed
}

export interface TabHeaderProps {
  title: string;
  subtitle: string;
}
