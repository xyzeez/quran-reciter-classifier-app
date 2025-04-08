import { Audio } from "expo-av";

export interface AudioFile {
  uri: string;
  name: string;
  type: string;
}

export interface RecorderProps {
  onRecordingComplete?: (file: AudioFile) => Promise<void>;
  recordingOptions?: Partial<Audio.RecordingOptions>;
}

export interface UploaderProps {
  onFileUpload: (file: AudioFile) => Promise<void>;
  acceptedFileTypes?: string[];
}
