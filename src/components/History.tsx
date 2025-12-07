import CloseIcon from "@mui/icons-material/Close";
import {
  Card,
  CardContent,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
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
    <Card
      variant="outlined"
      sx={{ bgcolor: "grey.900", color: "#fff", width: "30vw", mt: 2 }}
    >
      <CardContent sx={{ p: 1 }}>
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
            <Tooltip title="Clear history">
              <IconButton onClick={onClearAll}>
                <CloseIcon sx={{ fontSize: 20, color: "#c72424" }} />
              </IconButton>
            </Tooltip>
          )}
        </Typography>
        <RewardsTable rows={rows} footer={footer} onDelete={onDelete} />
      </CardContent>
    </Card>
  );
}
