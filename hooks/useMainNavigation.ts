import { useContext } from "react";
import {
  MainNavigationContext,
  NavigationState,
} from "../navigation/MainNavigationContext";

// When you want to navigate to other screens, you use this hook, and call the navigate function.
// Pass in the state needed for the next screen, and then update the MainNavigator to handle the next screen (if it is not already handled)
export function useMainNavigation(): {
  navigate: (screen: NavigationState) => void;
} {
  let context = useContext(MainNavigationContext);
  return {
    navigate: context,
  };
}
