export interface Reciter {
  name: string;
  confidence: number;
  country: string;
  flagUrl: string;
  imageUrl: string;
}

export interface ReciterCardProps {
  name: string;
  nationality: string;
  flagUrl: string;
  recordings: number;
  imageUrl: string;
  onPress?: () => void;
}
