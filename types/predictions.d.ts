import { Reciter } from "./reciter";

export interface ReciterPrediction {
  reliable: boolean;
  main_prediction?: Reciter;
  top_predictions?: Reciter[];
}
