import CloseIcon from "@mui/icons-material/Close";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import type { HistoryItem } from "../types";
import RewardsTable from "./RewardsTable";

interface HistoryProps {
  history: HistoryItem[];
  onDelete?: (index: number) => void;
  onClearAll?: () => void;
}

export default function History({
  history,
  onDelete,
  onClearAll,
}: HistoryProps) {
  if (history.length === 0) return null;

  const totalMin = history.reduce(
    (sum, item) => sum + (item.reward.min ?? 0),
    0
  );
  const totalMed = history.reduce(
    (sum, item) => sum + (item.reward.med ?? 0),
    0
  );

  const rows = history.map((item, index) => {
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
      onDelete: onDelete ? () => onDelete(index) : undefined,
      index,
    };
  });

  const footer = (
    <TableRow sx={{ backgroundColor: "grey.800" }}>
      {onDelete && <TableCell size="small" sx={{ color: "#fff" }}></TableCell>}
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
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        History ({history.length} items)
        {onClearAll && (
          <button
            onClick={onClearAll}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              padding: 0,
            }}
            title="Clear all history"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        )}
      </Typography>
      <RewardsTable rows={rows} footer={footer} onDelete={onDelete} />
    </Box>
  );
}
