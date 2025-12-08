import type { Relic, Reward } from "../types";

export type RelicStat = {
  relicName: string;
  tier: string;
  avgPlatinum: number;
  bestCommon: Reward | null;
  bestUncommon: Reward | null;
  bestRare: Reward | null;
};

export function getRelicStats(relics: Relic[]): RelicStat[] {
  return relics.map((relic) => {
    let total = 0;
    let count = 0;
    let bestCommon: Reward | null = null,
      bestUncommon: Reward | null = null,
      bestRare: Reward | null = null;
    relic.rewards.forEach((reward) => {
      if (typeof reward.med === "number") {
        total += reward.med;
        count++;
        if (
          reward.rarity === "Common" &&
          reward.med !== null &&
          (!bestCommon ||
            (bestCommon.med !== null && reward.med > bestCommon.med))
        )
          bestCommon = reward;
        if (
          reward.rarity === "Uncommon" &&
          reward.med !== null &&
          (!bestUncommon ||
            (bestUncommon.med !== null && reward.med > bestUncommon.med))
        )
          bestUncommon = reward;
        if (
          reward.rarity === "Rare" &&
          reward.med !== null &&
          (!bestRare || (bestRare.med !== null && reward.med > bestRare.med))
        )
          bestRare = reward;
      }
    });
    const avg = count ? total / count : 0;
    return {
      relicName: relic.relicName,
      tier: relic.tier,
      avgPlatinum: avg,
      bestCommon,
      bestUncommon,
      bestRare,
    };
  });
}

export function getMostProfitableRelics(relicStats: RelicStat[], count = 10) {
  return [...relicStats]
    .sort((a, b) => b.avgPlatinum - a.avgPlatinum)
    .slice(0, count);
}

export function getBestUncommon(relicStats: RelicStat[]) {
  return relicStats
    .filter((r) => r.bestUncommon && r.bestUncommon.med !== null)
    .sort((a, b) => (b.bestUncommon?.med ?? 0) - (a.bestUncommon?.med ?? 0))[0];
}

export function getBestRare(relicStats: RelicStat[]) {
  return relicStats
    .filter((r) => r.bestRare && r.bestRare.med !== null)
    .sort((a, b) => (b.bestRare?.med ?? 0) - (a.bestRare?.med ?? 0))[0];
}

export function getBestCommonReward(relicStats: RelicStat[], relics: Relic[]) {
  let bestCommonReward = undefined as
    | { relic: RelicStat; reward: Reward }
    | undefined;
  relicStats.forEach((relic) => {
    const relicData = relics.find(
      (r) => r.relicName === relic.relicName && r.tier === relic.tier
    );
    if (relicData && relicData.rewards.length >= 3) {
      const last3 = relicData.rewards.slice(-3);
      last3.forEach((reward) => {
        if (typeof reward.med === "number") {
          if (
            !bestCommonReward ||
            (reward.med ?? 0) > (bestCommonReward.reward.med ?? 0)
          ) {
            bestCommonReward = { relic, reward };
          }
        }
      });
    }
  });
  return bestCommonReward;
}
