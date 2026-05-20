export type AskSourceLabel = "this_month" | "last_90_days" | "all_saved";

export type AskResponse = {
  text: string;
  receiptsUsed: number;
  sourceLabel: AskSourceLabel;
};
