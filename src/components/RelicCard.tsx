import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface Reward {
  itemName: string;
  min: number | null;
  med: number | null;
  rarity?: string;
}

export type RelicTier = "Lith" | "Meso" | "Neo" | "Axi" | "Requiem";

interface Relic {
  tier: RelicTier;
  relicName: string;
  rewards: Reward[];
}

interface RelicCardProps {
  relic: Relic;
  index: number;
  filteredRelics: Relic[];
  selected: { [key: string]: string };
  finalSelected: boolean;
  onRowClick: (relicKey: string, itemName: string, e: any) => void;
}

export default function RelicCard({
  relic,
  index,
  filteredRelics,
  selected,
  finalSelected,
  onRowClick,
}: RelicCardProps) {
  const relicKey = `${relic.tier}${relic.relicName}_${index}`;

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

  return (
    <Card variant="outlined" sx={{ bgcolor: "grey.900", color: "#fff" }}>
      <CardContent sx={{ p: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {relic.tier} {relic.relicName}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell size="small" sx={{ color: "#fff" }}>
                Item
              </TableCell>
              <TableCell size="small" sx={{ color: "#fff" }}>
                Min
              </TableCell>
              <TableCell size="small" sx={{ color: "#fff" }}>
                Med
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {relic.rewards
              .filter((r) => r.med !== null)
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
                else if (itemKey === maxUncommonKey)
                  rowStyle.background = "#5a5a5a";
                else if (itemKey === maxCommonKey)
                  rowStyle.background = "#4e2f21";
                let rowStyleUpdated: any = { ...rowStyle };
                if (finalSelected && isSelected) {
                  rowStyleUpdated.background = "#81c784";
                } else if (isSelected) {
                  rowStyleUpdated.background = "#4caf50";
                }
                return (
                  <TableRow
                    key={reward.itemName}
                    sx={rowStyleUpdated}
                    onClick={(e) => onRowClick(relicKey, reward.itemName, e)}
                  >
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
                        <img
                          src="/rare.png"
                          alt="Rare"
                          style={{ width: 16, height: 16 }}
                        />
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
                    <TableCell
                      size="small"
                      sx={{ color: "#fff", textAlign: "center" }}
                    >
                      {reward.min ?? "-"}
                    </TableCell>
                    <TableCell
                      size="small"
                      sx={{ color: "#fff", textAlign: "center" }}
                    >
                      {reward.med ?? "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
