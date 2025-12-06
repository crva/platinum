import axios from "axios";
import fs from "fs/promises";

// Fetches relics and their contents from the community API
async function getAllRelics(): Promise<any[]> {
  const res = await axios.get("https://drops.warframestat.us/data/relics.json");
  return res.data.relics || res.data; // depending on the format
}

// Fetches sell orders for an item (by name)
async function getSellOrders(slug: string): Promise<number[]> {
  const res = await axios.get(
    `https://api.warframe.market/v2/orders/item/${slug}`
  );
  const sellOrders = (res.data.data as any[]).filter(
    (order) => order.type === "sell" && order.visible
  );
  return sellOrders.map((order) => order.platinum).sort((a, b) => a - b);
}

// Calculates the median of an array of numbers
function median(values: number[]): number | null {
  if (!values.length) return null;
  const mid = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return (values[mid - 1] + values[mid]) / 2;
  } else {
    return values[mid];
  }
}

// Finds the warframe.market slug from the item name
async function getSlugMap(): Promise<Record<string, string>> {
  const res = await axios.get("https://api.warframe.market/v2/items");
  const items = res.data.data;
  const map: Record<string, string> = {};
  for (const item of items) {
    const name = item.i18n?.en?.name || item.item_name || item.slug;
    map[name.toLowerCase()] = item.slug;
  }
  return map;
}

async function main() {
  const relics = await getAllRelics();
  const slugMap = await getSlugMap();
  const results: any[] = [];

  // Only keep the Intact version of each relic (the lowest level)
  const seen = new Set();
  const filteredRelics = relics.filter((relic) => {
    const key = relic.tier + ":" + relic.relicName;
    if (relic.state === "Intact" && !seen.has(key)) {
      seen.add(key);
      return true;
    }
    return false;
  });

  const total = filteredRelics.length;
  let done = 0;
  for (const relic of filteredRelics) {
    done++;
    const { tier, relicName, state, rewards } = relic;
    console.log(
      `[${done}/${total}] ${tier} ${relicName} ${state}... (${
        total - done
      } remaining)`
    );
    const relicResult: any = {
      tier,
      relicName,
      state,
      rewards: [],
    };
    for (const reward of rewards) {
      const itemName = reward.itemName;
      const rarity = reward.rarity;
      const slug = slugMap[itemName.toLowerCase()];
      let min = null,
        med = null;
      if (slug) {
        try {
          const prices = await getSellOrders(slug);
          min = prices[0] || null;
          med = median(prices);
        } catch {}
        await new Promise((r) => setTimeout(r, 250));
      }
      relicResult.rewards.push({ itemName, rarity, min, med });
    }
    results.push(relicResult);
    // Write after each relic
    await fs.writeFile("relic_prices.json", JSON.stringify(results, null, 2));
  }
  console.log("Done. Result in relic_prices.json");
}

main();
