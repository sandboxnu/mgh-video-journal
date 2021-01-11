import { createContext } from "react";
import { Episode } from "../types";

// All screens that exist that do not need props passed to them, if props need to be passed, add it to NavigationState
export enum NavigationScreens {
  intro,
  createEpisode,
  predictions,
  episodeListingOverview,
  episodeRecallOverview,
  onboarding,
  episodeRecallFinished,
}

// The state for when the episodes have been added, but need to be recorded
interface NeedToRecordEpisodes {
  type: "recordEpisodes";
  episodes: Episode[];
}

// The state for when the episodes have been added, but need to be recorded
interface EpisodeRecall {
  type: "episodeRecall";
  episodes: Episode[];
}

// The state for when the predictions have been given
interface GivenPredictions {
  type: "givenPredictions";
  predictions: String[];
}

// A basic state that only has a screen
interface BasicNavigationState {
  type: NavigationScreens;
}

// All possible states that we can be in. Add your navigation state here for new screens
export type NavigationState =
  | BasicNavigationState
  | NeedToRecordEpisodes
  | GivenPredictions
  | EpisodeRecall;

// The context to pass down the navigation updater function through
export const MainNavigationContext = createContext((_: NavigationState) => {});
