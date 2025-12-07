import { Box, TableCell, TableRow, Typography } from "@mui/material";
import type { HistoryItem } from "../types";
import RewardsTable from "./RewardsTable";

interface HistoryProps {
  history: HistoryItem[];
}

export default function History({ history }: HistoryProps) {
  if (history.length === 0) return null;

  const totalMin = history.reduce(
    (sum, item) => sum + (item.reward.min ?? 0),
    0
  );
  const totalMed = history.reduce(
    (sum, item) => sum + (item.reward.med ?? 0),
    0
  );

  const rows = history.map((item) => {
    let rarity = item.reward.rarity?.toLowerCase();
    if (!rarity || rarity === "uncommon") {
      const idxInRelic = item.relic.rewards.findIndex(
        (r) => r.itemName === item.reward.itemName
      );
      if (idxInRelic === 0) rarity = "rare";
      else if (idxInRelic === 1 || idxInRelic === 2) rarity = "uncommon";
      else rarity = "common";
    }
    return {
      reward: item.reward,
      rarity,
    };
  });

  const footer = (
    <TableRow sx={{ backgroundColor: "grey.800" }}>
      <TableCell size="small" sx={{ color: "#fff", fontWeight: "bold" }}>
        Total
      </TableCell>
      <TableCell
        size="small"
        sx={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
      >
        {totalMin}
      </TableCell>
      <TableCell
        size="small"
        sx={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
      >
        {totalMed}
      </TableCell>
    </TableRow>
  );

  return (
    <Box
      sx={{ mt: 4, bgcolor: "grey.900", p: 2, borderRadius: 1, width: "30vw" }}
    >
      <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
        History ({history.length} items)
      </Typography>
      <RewardsTable rows={rows} footer={footer} />
    </Box>
  );
}
