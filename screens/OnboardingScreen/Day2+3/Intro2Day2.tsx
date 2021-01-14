import React from "react";
import AIntroScreen, { styles as abstractStyles } from "../AIntroScreen";
import { Text } from "../../../components/Themed";

export default function Intro2Day2() {
  return (
    <AIntroScreen headerText="Overview">
      <Text style={abstractStyles.bodyText}>
        {
          "Today we will begin by asking you some questions about previous episodes. We'll walk you through this step by step.\n\nAfterwards, you will list and record Episodes for events that happened today. This will be the same as you have done previously. Again, we'll remind of what to do each step, when you get there."
        }
      </Text>
    </AIntroScreen>
  );
}
