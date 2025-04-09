declare module "rn-tajweed-verse" {
  interface TajweedConfig {
    style?: {
      fontSize?: number;
      lineHeight?: number;
      color?: string;
      direction?: "rtl" | "ltr";
      fontFamily?: string;
      textAlign?: "left" | "right" | "center";
      [key: string]: any;
    };
    tajweed?: {
      [key: string]: {
        style?: {
          color?: string;
          [key: string]: any;
        };
        onPress?: () => void;
      };
    };
  }

  interface TajweedVerseProps {
    verse: string;
    config?: TajweedConfig;
  }

  export default function TajweedVerse(props: TajweedVerseProps): JSX.Element;
}
