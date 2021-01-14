export const STORAGE_KEYS = {
  startDay: () => "StartDay",
  daysEpisodes: (recordingDay: number) => `Day${recordingDay}Episodes`,
  episodeRecall: () => "EpisodeRecall",
  currentState: () => "CurrentState",
  participantId: () => "ParticipantId",
};
