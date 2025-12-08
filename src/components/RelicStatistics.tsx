import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useMemo } from "react";
import type { Relic, Reward } from "../types";
import PlatinumText from "./PlatinumText";
import StatisticsCard from "./StatisticsCard";

type RelicStat = {
  relicName: string;
  tier: string;
  avgPlatinum: number;
  bestCommon: Reward | null;
  bestUncommon: Reward | null;
  bestRare: Reward | null;
};

type RelicStatisticsProps = {
  relics: Relic[];
};

// Helper to flatten rewards and calculate statistics
function getRelicStats(relics: Relic[]) {
  // Calculate average platinum per relic
  const relicStats = relics.map((relic) => {
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
      rareToAvgNonRareRatio: null,
      bestUpgrade: null,
    };
  });
  return relicStats;
}

const RelicStatistics: React.FC<RelicStatisticsProps> = ({ relics }) => {
  const relicStats: RelicStat[] = useMemo(
    () => getRelicStats(relics),
    [relics]
  );

  // Most profitable relics
  const mostProfitable = [...relicStats]
    .sort((a, b) => b.avgPlatinum - a.avgPlatinum)
    .slice(0, 10);
  // Best for each rarity
  const bestUncommon: RelicStat | undefined = relicStats
    .filter((r) => r.bestUncommon && r.bestUncommon.med !== null)
    .sort((a, b) => (b.bestUncommon?.med ?? 0) - (a.bestUncommon?.med ?? 0))[0];
  const bestRare: RelicStat | undefined = relicStats
    .filter((r) => r.bestRare && r.bestRare.med !== null)
    .sort((a, b) => (b.bestRare?.med ?? 0) - (a.bestRare?.med ?? 0))[0];
  // Best Common Reward: for each relic, the last 3 rewards in the rewards array are the 'common' rewards
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

  return (
    <Box>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <Card sx={{ mb: 3 }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                Top 10 Most Profitable Relics
              </Typography>
              <List>
                {mostProfitable.map((relic, idx) => (
                  <ListItem
                    sx={{ p: 0 }}
                    key={relic.tier + relic.relicName + idx}
                  >
                    <img
                      src={`${relic.tier?.toLowerCase()}.png`}
                      alt={relic.tier}
                      style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    <Typography variant="body1">
                      <strong>{idx + 1}</strong>. {relic.tier} {relic.relicName}
                    </Typography>
                    <Typography sx={{ mx: 1 }}>-</Typography>
                    <PlatinumText
                      text={relic.avgPlatinum.toFixed(2)}
                      variant="body1"
                      color="text.secondary"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <StatisticsCard
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Best Rare Reward</Typography>
                <img
                  src={"/rare.png"}
                  alt={bestCommonReward?.relic.tier || ""}
                  style={{ width: 28, height: 28, marginLeft: 8 }}
                />
              </Box>
            }
            relicTier={bestRare?.tier || ""}
            relicName={
              bestRare ? `${bestRare.tier} ${bestRare.relicName}` : "N/A"
            }
            value={
              bestRare && bestRare.bestRare ? (
                <PlatinumText
                  text={`${bestRare.bestRare.itemName} - ${bestRare.bestRare.med}`}
                />
              ) : (
                "N/A"
              )
            }
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <StatisticsCard
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Best Uncommon Reward</Typography>
                <img
                  src={"/uncommon.png"}
                  alt={bestCommonReward?.relic.tier || ""}
                  style={{ width: 28, height: 28, marginLeft: 8 }}
                />
              </Box>
            }
            relicTier={bestUncommon?.tier || ""}
            relicName={
              bestUncommon
                ? `${bestUncommon.tier} ${bestUncommon.relicName}`
                : "N/A"
            }
            value={
              bestUncommon && bestUncommon.bestUncommon ? (
                <PlatinumText
                  text={`${bestUncommon.bestUncommon.itemName} - ${bestUncommon.bestUncommon.med}`}
                />
              ) : (
                "N/A"
              )
            }
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <StatisticsCard
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Best Common Reward</Typography>
                <img
                  src={"/common.png"}
                  alt={bestCommonReward?.relic.tier || ""}
                  style={{ width: 28, height: 28, marginLeft: 8 }}
                />
              </Box>
            }
            relicTier={bestCommonReward?.relic.tier || ""}
            relicName={
              bestCommonReward
                ? `${bestCommonReward.relic.tier} ${bestCommonReward.relic.relicName}`
                : "N/A"
            }
            value={
              bestCommonReward ? (
                <PlatinumText
                  text={`${bestCommonReward.reward.itemName} - ${bestCommonReward.reward.med}`}
                />
              ) : (
                "N/A"
              )
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RelicStatistics;
