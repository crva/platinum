import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Controls from "./components/Controls";
import History from "./components/History";
import RelicCard from "./components/RelicCard";
import type { Relic, Reward } from "./types";

function App() {
  const [data, setData] = useState<Relic[]>([]);
  const [filteredRelics, setFilteredRelics] = useState<Relic[]>([]);
  const [selected, setSelected] = useState<{ [key: string]: string }>({});
  const [finalSelected, setFinalSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<
    Array<{ relic: Relic; reward: Reward; relicKey: string }>
  >(() => {
    const saved = localStorage.getItem("platinum-history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse history from localStorage", e);
        return [];
      }
    }
    return [];
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type") || "Lith";
  const relicNames = searchParams.get("search") || "";

  // Update URL params when user changes the search or type
  const handleTypeChange = (e: any) => {
    setSearchParams({
      type: e.target.value,
      search: "",
    });
  };
  const handleRelicNamesChange = (e: any) => {
    setSearchParams({
      type,
      search: e.target.value,
    });
  };

  const addToHistory = (relic: Relic, reward: Reward, relicKey: string) => {
    setHistory((prev) => [...prev, { relic, reward, relicKey }]);
  };

  const removeFromHistory = (index: number) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllHistory = () => {
    setHistory([]);
  };

  useEffect(() => {
    localStorage.setItem("platinum-history", JSON.stringify(history));
  }, [history]);

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

  useEffect(() => {
    if (type === "Multiple") {
      const parts = relicNames
        .split(" ")
        .map((n) => n.trim().toLowerCase())
        .filter((n) => n.length > 0);
      const filtered: Relic[] = [];

      for (let i = 0; i < parts.length; i += 2) {
        const tierInput = parts[i];
        const name = parts[i + 1];
        if (!name) break;
        const tier = tierInput.charAt(0).toUpperCase() + tierInput.slice(1);
        const relicKey = `${tier}${name}_${i / 2}`; // Unique key for each instance

        const relic = data.find(
          (r) =>
            r.tier === tier &&
            r.state === "Intact" &&
            r.relicName.toLowerCase() === name
        );

        if (relic) {
          filtered.push({ ...relic, instanceId: relicKey }); // Add unique instanceId
        }
      }

      setFilteredRelics(filtered);
    } else {
      const names = relicNames
        .split(" ")
        .map((n) => n.trim().toLowerCase())
        .filter((n) => n.length > 0);
      if (names.length === 0) {
        setFilteredRelics([]);
        return;
      }
      const filtered = names
        .map((name, index) => {
          const relic = data.find(
            (r) =>
              r.tier === type &&
              r.state === "Intact" &&
              r.relicName.toLowerCase() === name
          );
          if (relic) {
            return { ...relic, instanceId: `${type}${name}_${index}` }; // Add unique instanceId
          }
          return null;
        })
        .filter(Boolean) as Relic[];
      setFilteredRelics(filtered);
    }
  }, [data, type, relicNames]);

  useEffect(() => {
    const selectedCount = Object.keys(selected).length;
    if (selectedCount === filteredRelics.length && selectedCount > 0) {
      let bestRelicKey = "";
      let bestItem = "";
      let bestMed = -Infinity;
      let bestMin = -Infinity;

      // Create a Set to track unique relics
      const uniqueRelics = new Set<string>();

      for (const relicKey in selected) {
        const relic = filteredRelics.find((r) => {
          const relicIdentifier = `${r.tier}${r.relicName}`;
          if (!uniqueRelics.has(relicIdentifier)) {
            uniqueRelics.add(relicIdentifier);
            return relicKey.startsWith(`${r.tier}${r.relicName}_`);
          }
          return false;
        });

        if (relic) {
          const item = selected[relicKey];
          const reward = relic.rewards.find((r) => r.itemName === item);
          if (reward && reward.med !== null) {
            const med = reward.med;
            const min = reward.min ?? 0;
            if (med > bestMed || (med === bestMed && min > bestMin)) {
              bestMed = med;
              bestMin = min;
              bestRelicKey = relicKey;
              bestItem = item;
            }
          }
        }
      }

      if (bestRelicKey) {
        setSelected({ [bestRelicKey]: bestItem });
        setFinalSelected(true);
      }
    }
  }, [selected, filteredRelics]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      onClick={() => {
        setSelected({});
        setFinalSelected(false);
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Typography variant="h6" component="div" sx={{ color: "#fff" }}>
        Warframe Relic Price Viewer
      </Typography>
      <Typography
        variant="body1"
        component="div"
        sx={{ color: "grey", fontStyle: "italic" }}
      >
        Last data fetch date & patch : 2025-12-06 | 40.0
      </Typography>
      <Container sx={{ mt: 4 }} disableGutters maxWidth={false}>
        <Controls
          type={type}
          relicNames={relicNames}
          onTypeChange={handleTypeChange}
          onRelicNamesChange={handleRelicNamesChange}
        />
        <Grid container spacing={2}>
          {filteredRelics.map((relic, index) => (
            <Grid key={`${relic.tier}${relic.relicName}_${index}`} size={3}>
              <RelicCard
                relic={relic}
                index={index}
                filteredRelics={filteredRelics}
                selected={selected}
                finalSelected={finalSelected}
                onRowClick={(relicKey: string, itemName: string, e: any) => {
                  e.stopPropagation();
                  if (filteredRelics.length === 1) return;
                  if (finalSelected) {
                    if (selected[relicKey] === itemName) {
                      setSelected({});
                      setFinalSelected(false);
                    } else {
                      setSelected({ [relicKey]: itemName });
                      setFinalSelected(false);
                    }
                  } else {
                    setSelected((prev) => {
                      const newSelected = { ...prev };
                      if (prev[relicKey] === itemName) {
                        delete newSelected[relicKey];
                      } else {
                        newSelected[relicKey] = itemName;
                      }
                      return newSelected;
                    });
                    setFinalSelected(false);
                  }
                }}
                addToHistory={addToHistory}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      <History
        history={history}
        onDelete={removeFromHistory}
        onClearAll={clearAllHistory}
      />
    </Box>
  );
}

export default App;
