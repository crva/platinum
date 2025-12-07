import {
  Card,
  CardContent,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Relic, Reward } from "../types";
import RewardsTable from "./RewardsTable";

interface RelicCardProps {
  relic: Relic;
  index: number;
  filteredRelics: Relic[];
  selected: { [key: string]: string };
  finalSelected: boolean;
  onRowClick: (relicKey: string, itemName: string, e: any) => void;
  addToHistory: (relic: Relic, reward: Reward, relicKey: string) => void;
}

export default function RelicCard({
  relic,
  index,
  filteredRelics,
  selected,
  finalSelected,
  onRowClick,
  addToHistory,
}: RelicCardProps) {
  const relicKey = `${relic.tier}${relic.relicName}_${index}`;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);
  const [mousePosition, setMousePosition] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  // Compute highlights for max in each rarity across all relics
  let maxRareMed = -Infinity;
  let maxRareKey = "";
  let maxUncommonMed = -Infinity;
  let maxUncommonKey = "";
  let maxCommonMed = -Infinity;
  let maxCommonKey = "";
  filteredRelics.forEach((rel) => {
    rel.rewards.forEach((reward, idx) => {
      let rarity = reward.rarity?.toLowerCase();
      if (!rarity || rarity === "uncommon") {
        if (idx === 0) rarity = "rare";
        else if (idx === 1 || idx === 2) rarity = "uncommon";
        else rarity = "common";
      }
      const itemKey = rel.tier + rel.relicName + reward.itemName;
      if (reward.med !== null) {
        if (rarity === "rare" && reward.med > maxRareMed) {
          maxRareMed = reward.med;
          maxRareKey = itemKey;
        }
        if (rarity === "uncommon" && reward.med > maxUncommonMed) {
          maxUncommonMed = reward.med;
          maxUncommonKey = itemKey;
        }
        if (rarity === "common" && reward.med > maxCommonMed) {
          maxCommonMed = reward.med;
          maxCommonKey = itemKey;
        }
      }
    });
  });

  const rows = relic.rewards
    .sort((a, b) => (b.med ?? 0) - (a.med ?? 0))
    .map((reward) => {
      let rarity = reward.rarity?.toLowerCase();
      if (!rarity || rarity === "uncommon") {
        const idx = relic.rewards.findIndex(
          (r) => r.itemName === reward.itemName
        );
        if (idx === 0) rarity = "rare";
        else if (idx === 1 || idx === 2) rarity = "uncommon";
        else rarity = "common";
      }
      const itemKey = relic.tier + relic.relicName + reward.itemName;
      const isSelected = selected[relicKey] === reward.itemName;
      let rowStyle: any = {};
      if (itemKey === maxRareKey) rowStyle.background = "#63521f";
      else if (itemKey === maxUncommonKey) rowStyle.background = "#5a5a5a";
      else if (itemKey === maxCommonKey) rowStyle.background = "#4e2f21";
      let rowStyleUpdated: any = { ...rowStyle };
      if (finalSelected && isSelected) {
        rowStyleUpdated.background = "#81c784";
      } else if (isSelected) {
        rowStyleUpdated.background = "#4caf50";
      }
      return {
        reward,
        rarity,
        sx: rowStyleUpdated,
        onClick: (e: React.MouseEvent) =>
          onRowClick(relicKey, reward.itemName, e),
        onContextMenu: (e: React.MouseEvent) => {
          e.preventDefault();
          setAnchorEl(e.currentTarget as HTMLElement);
          setCurrentReward(reward);
          setMousePosition({
            mouseX: e.clientX,
            mouseY: e.clientY,
          });
        },
      };
    });

  return (
    <Card variant="outlined" sx={{ bgcolor: "grey.900", color: "#fff" }}>
      <CardContent sx={{ p: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {relic.tier} {relic.relicName}
        </Typography>
        <RewardsTable rows={rows} />
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
          setMousePosition(null);
        }}
        anchorReference="anchorPosition"
        anchorPosition={
          mousePosition
            ? { top: mousePosition.mouseY, left: mousePosition.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            if (currentReward) {
              addToHistory(relic, currentReward, relicKey);
            }
            setAnchorEl(null);
          }}
        >
          Add to history
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchorEl(null)}>Close</MenuItem>
      </Menu>
    </Card>
  );
}
