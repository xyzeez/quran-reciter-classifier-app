export interface Reciter {
  name: string;
  nationality: string;
  flagUrl: string;
  imageUrl: string;
  serverUrl: string;
  confidence: number;
}

export interface ReciterListItemProps extends Reciter {
  onPress?: () => void;
}
