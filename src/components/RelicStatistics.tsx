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
import type { RelicStat } from "../tools/statistics";
import {
  getBestCommonReward,
  getBestRare,
  getBestUncommon,
  getMostProfitableRelics,
  getRelicStats,
} from "../tools/statistics";
import type { Relic } from "../types";
import PlatinumText from "./PlatinumText";
import StatisticsCard from "./StatisticsCard";

type RelicStatisticsProps = {
  relics: Relic[];
};

const RelicStatistics: React.FC<RelicStatisticsProps> = ({ relics }) => {
  const relicStats: RelicStat[] = useMemo(
    () => getRelicStats(relics),
    [relics]
  );
  const mostProfitable = getMostProfitableRelics(relicStats, 10);
  const bestUncommon = getBestUncommon(relicStats);
  const bestRare = getBestRare(relicStats);
  const bestCommonReward = getBestCommonReward(relicStats, relics);

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
