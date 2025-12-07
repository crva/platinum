import { TableCell, TableRow } from "@mui/material";
import type { Reward } from "../types";

interface RewardRowProps {
  reward: Reward;
  rarity: string;
  onClick?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  sx?: any;
}

export default function RewardRow({
  reward,
  rarity,
  onClick,
  onContextMenu,
  sx,
}: RewardRowProps) {
  return (
    <TableRow sx={sx} onClick={onClick} onContextMenu={onContextMenu}>
      <TableCell
        size="small"
        sx={{
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {rarity === "rare" && (
          <img src="/rare.png" alt="Rare" style={{ width: 16, height: 16 }} />
        )}
        {rarity === "uncommon" && (
          <img
            src="/uncommon.png"
            alt="Uncommon"
            style={{ width: 16, height: 16 }}
          />
        )}
        {rarity === "common" && (
          <img
            src="/common.png"
            alt="Common"
            style={{ width: 16, height: 16 }}
          />
        )}
        {reward.itemName}
      </TableCell>
      <TableCell size="small" sx={{ color: "#fff", textAlign: "center" }}>
        {reward.min ?? "-"}
      </TableCell>
      <TableCell size="small" sx={{ color: "#fff", textAlign: "center" }}>
        {reward.med ?? "-"}
      </TableCell>
    </TableRow>
  );
}
