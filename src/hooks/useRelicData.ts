import { useEffect, useState } from "react";
import type { Relic } from "../types";

export function useRelicData() {
  const [data, setData] = useState<Relic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/relic_prices.json");
        const json = await res.json();
        // Fetch profitability data
        const profitabilityRes = await fetch("/relic_profitability.json");
        const profitabilityJson = await profitabilityRes.json();
        const map = new Map<string, string | null>();
        profitabilityJson.forEach((item: any) => {
          const key = `${item.tier}${item.relicName}`;
          map.set(key, item.bestUpgrade);
        });
        // Merge into data
        json.forEach((relic: any) => {
          relic.bestUpgrade = map.get(`${relic.tier}${relic.relicName}`);
        });
        setData(json);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return { data, loading };
}
