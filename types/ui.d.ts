export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export interface ToggleProps {
  fileInputType: "record" | "upload";
  setFileInputType: (type: "record" | "upload") => void;
}
