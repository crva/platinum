import fs from "fs";
import path from "path";

/**
 * This script calculates the best upgrade for Void Relics in Warframe based on their reward platinum values.
 * It determines whether a relic is worth upgrading to Exceptional, Flawless, or Radiant quality by comparing
 * the platinum value of the rare reward to the average of the common and uncommon rewards.
 * Based on: https://warframe.fandom.com/wiki/Void_Relic
 */

interface Item {
  name: string;
  rarity: "Common" | "Uncommon" | "Rare";
  platinum: number;
}

interface RelicData {
  tier: string;
  relicName: string;
  rewards: {
    itemName: string;
    rarity: string;
    med: number;
  }[];
}

function convertRelicToItems(relic: RelicData): Item[] {
  return relic.rewards.map((r) => ({
    name: r.itemName,
    rarity: r.rarity as "Common" | "Uncommon" | "Rare",
    platinum: r.med,
  }));
}

function getBestUpgrade(items: Item[]): {
  upgrade: string | null;
  ratio: number;
} {
  const nonRare = items.filter((i) => i.rarity !== "Rare");
  const rare = items.find((i) => i.rarity === "Rare");

  if (!rare || nonRare.length === 0) return { upgrade: null, ratio: 0 };

  const avgNonRare =
    nonRare.reduce((sum, item) => sum + item.platinum, 0) / nonRare.length;

  const rareValue = rare.platinum;

  // Ratio of rare item's platinum value to average non-rare items' platinum value
  // Example: If rareToAvgNonRareRatio = 4.29, the rare reward is worth ~4.29x the average of common/uncommon rewards
  // (e.g., if avg non-rare = 7 platinum, rare = ~30 platinum). Ratio > 3 recommends Radiant upgrade.
  const rareToAvgNonRareRatio = rareValue / avgNonRare;

  // Automatic decision based on ratio thresholds:
  // If ratio < 1.5: no upgrade (rare too close to others)
  // If 1.5 <= ratio < 2: Exceptional (rare worth a bit more)
  // If 2 <= ratio < 3: Flawless (rare worth much more)
  // If ratio >= 3: Radiant (rare worth 3x more, jackpot)
  if (rareToAvgNonRareRatio < 1.5)
    return { upgrade: null, ratio: rareToAvgNonRareRatio };
  if (rareToAvgNonRareRatio < 2)
    return { upgrade: "Exceptional", ratio: rareToAvgNonRareRatio };
  if (rareToAvgNonRareRatio < 3)
    return { upgrade: "Flawless", ratio: rareToAvgNonRareRatio };
  return { upgrade: "Radiant", ratio: rareToAvgNonRareRatio };
}

const jsonPath = path.join(process.cwd(), "public", "relic_prices.json");
const relics: RelicData[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const results = relics.map((relic) => {
  const items = convertRelicToItems(relic);
  const { upgrade, ratio } = getBestUpgrade(items);

  return {
    tier: relic.tier,
    relicName: relic.relicName,
    bestUpgrade: upgrade,
    rareToAvgNonRareRatio: ratio,
  };
});

const outputPath = path.join(process.cwd(), "relic_profitability.json");
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

console.log("Generated file: relic_profitability.json");
