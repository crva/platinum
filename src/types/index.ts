export type RelicTier = "Lith" | "Meso" | "Neo" | "Axi" | "Requiem";

export interface Reward {
  itemName: string;
  min: number | null;
  med: number | null;
  rarity?: string;
}

export interface Relic {
  tier: RelicTier;
  relicName: string;
  state: string;
  rewards: Reward[];
  bestUpgrade?: string | null;
}

export interface HistoryItem {
  relic: Relic;
  reward: Reward;
  relicKey: string;
}
