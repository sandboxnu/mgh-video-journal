export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type MainStackParamList = {
  MainTab: undefined;
  Camera: undefined;
  PrepareFace: undefined;
  PredictEpisodes: undefined;
  EpisodeInput: undefined;
  EpisodeDisplay: undefined;
  CameraFlow: undefined;
};

export type Episode = {
  name: string;
  date: string; // ISO String
  startTime: number;
  endTime: number;
  initials: string;
  recordingDay: number;
};
