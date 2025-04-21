export interface Reciter {
  name: string;
  confidence: number;
  nationality: string;
  flagUrl: string;
  imageUrl: string;
  serverUrl: string;
}

export interface ReciterListItemProps extends Reciter {
  onPress?: () => void;
}
