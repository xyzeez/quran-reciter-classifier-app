export interface Reciter {
  name: string;
  confidence: number;
  nationality: string;
  flagUrl: string;
  imageUrl: string;
  serverUrl: string;
}

export interface ReciterCardProps extends Reciter {
  onPress?: () => void;
}
