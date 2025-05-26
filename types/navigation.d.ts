import { RouteProp } from "@react-navigation/native";

export type AyahPredictionRouteParams = {
  file: string;
};

export type ReciterPredictionRouteParams = {
  file: string;
};

export type AyahPredictionRouteProp = RouteProp<
  { "ayah-prediction": AyahPredictionRouteParams },
  "ayah-prediction"
>;

export type ReciterPredictionRouteProp = RouteProp<
  { Prediction: ReciterPredictionRouteParams },
  "Prediction"
>;

export interface NavigationProps {
  navigation: any;
  route: any;
}
