export interface Reciter {
  id: string;
  name: string;
  confidence: number;
  nationality: string;
  flagUrl: string;
  imageUrl: string;
  recordings: number;
}

export interface ReciterCardProps extends Reciter {
  onPress?: () => void;
}
