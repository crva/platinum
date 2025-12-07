import { Box, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Controls from "./components/Controls";
import type { RelicTier } from "./components/RelicCard";
import RelicCard from "./components/RelicCard";

interface Reward {
  itemName: string;
  min: number | null;
  med: number | null;
  rarity?: string;
}

interface Relic {
  tier: RelicTier;
  relicName: string;
  state: string;
  rewards: Reward[];
}

function App() {
  const [data, setData] = useState<Relic[]>([]);
  const [filteredRelics, setFilteredRelics] = useState<Relic[]>([]);
  const [selected, setSelected] = useState<{ [key: string]: string }>({});
  const [finalSelected, setFinalSelected] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type") || "Lith";
  const relicNames = searchParams.get("search") || "";

  // Update URL params when user changes the search or type
  const handleTypeChange = (e: any) => {
    setSearchParams({
      type: e.target.value,
      search: relicNames,
    });
  };
  const handleRelicNamesChange = (e: any) => {
    setSearchParams({
      type,
      search: e.target.value,
    });
  };

  useEffect(() => {
    fetch("/relic_prices.json")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  useEffect(() => {
    const names = relicNames
      .split(" ")
      .map((n) => n.trim().toLowerCase())
      .filter((n) => n.length > 0);
    if (names.length === 0) {
      setFilteredRelics([]);
      return;
    }
    const filtered = names
      .map((name) =>
        data.find(
          (r) =>
            r.tier === type &&
            r.state === "Intact" &&
            r.relicName.toLowerCase() === name
        )
      )
      .filter(Boolean) as Relic[];
    setFilteredRelics(filtered);
  }, [data, type, relicNames]);

  useEffect(() => {
    const selectedCount = Object.keys(selected).length;
    if (selectedCount === filteredRelics.length && selectedCount > 0) {
      let bestRelicKey = "";
      let bestItem = "";
      let bestMed = -Infinity;
      let bestMin = -Infinity;
      for (const relicKey in selected) {
        const relic = filteredRelics.find((r) =>
          relicKey.startsWith(`${r.tier}${r.relicName}_`)
        );
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

  return (
    <Box
      onClick={() => {
        setSelected({});
        setFinalSelected(false);
      }}
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
          onClear={() => setSearchParams({ type, search: "" })}
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
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
