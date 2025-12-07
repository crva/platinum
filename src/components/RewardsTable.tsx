import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import type { Reward } from "../types";
import RewardRow from "./RewardRow";

interface TableRowData {
  reward: Reward;
  rarity: string;
  sx?: any;
  onClick?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

interface RewardsTableProps {
  rows: TableRowData[];
  footer?: React.ReactNode;
}

export default function RewardsTable({ rows, footer }: RewardsTableProps) {
  return (
    <Table size="small" sx={{ "& .MuiTableCell-root": { padding: "4px 8px" } }}>
      <TableHead>
        <TableRow>
          <TableCell size="small" sx={{ color: "#fff" }}>
            Item
          </TableCell>
          <TableCell size="small" sx={{ color: "#fff", textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <img
                src="/platinum.png"
                alt="platinum"
                style={{ width: 16, height: 16 }}
              />
              Min
            </div>
          </TableCell>
          <TableCell size="small" sx={{ color: "#fff", textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <img
                src="/platinum.png"
                alt="platinum"
                style={{ width: 16, height: 16 }}
              />
              Med
            </div>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, idx) => (
          <RewardRow
            key={idx}
            reward={row.reward}
            rarity={row.rarity}
            sx={row.sx}
            onClick={row.onClick}
            onContextMenu={row.onContextMenu}
          />
        ))}
        {footer}
      </TableBody>
    </Table>
  );
}
