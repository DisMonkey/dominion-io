export interface WorldEventDefinition {
  id: string;
  title: string;
  description: string;
  trigger: string;
  effect?: string;
  choices?: readonly string[];
}

export const WorldEvents = [
  {
    id: "great_depression",
    title: "Economic Crash",
    description:
      "Global markets collapse. All players lose 20% of their Gold reserves. Industrial output reduced for 30 ticks.",
    trigger: "random_after_tick_200",
    effect: "all_players_gold_minus_20_percent",
  },
  {
    id: "arms_race",
    title: "Arms Race Declared",
    description:
      "Tensions rise globally. All unit production costs reduced 15% for the next 100 ticks. Choose: join the race or stay neutral.",
    trigger: "random_after_tick_150",
    choices: [
      "Join Arms Race (+15% unit speed, +20% cost)",
      "Stay Neutral (no change)",
    ],
  },
  {
    id: "rebel_uprising",
    title: "Rebel Uprising",
    description:
      "A random tile in your territory has rebelled and gone neutral. Recapture it within 50 ticks or lose it permanently.",
    trigger: "per_player_random",
    effect: "random_border_tile_flips_neutral",
  },
  {
    id: "golden_age",
    title: "Golden Age of Commerce",
    description:
      "Trade routes boom. All trade ship income doubled for 60 ticks.",
    trigger: "random_after_tick_100",
  },
  {
    id: "epidemic",
    title: "Epidemic Outbreak",
    description:
      "A plague sweeps through the most populated territories. Players with the most tiles lose 10% of their troop count.",
    trigger: "random_any_time",
  },
] as const satisfies readonly WorldEventDefinition[];
