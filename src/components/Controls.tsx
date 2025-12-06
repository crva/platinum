import { Box, Button, MenuItem, Select, TextField } from "@mui/material";
import type { RelicTier } from "./RelicCard";

const relicTypes: RelicTier[] = ["Lith", "Meso", "Neo", "Axi", "Requiem"];

interface ControlsProps {
  type: string;
  relicNames: string;
  onTypeChange: (e: any) => void;
  onRelicNamesChange: (e: any) => void;
  onClear: () => void;
}

export default function Controls({
  type,
  relicNames,
  onTypeChange,
  onRelicNamesChange,
  onClear,
}: ControlsProps) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
      <Select
        value={type}
        onChange={onTypeChange}
        size="small"
        sx={{
          minWidth: 120,
          color: "#fff",
          "& .MuiSelect-icon": { color: "#fff" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
        }}
        inputProps={{ style: { color: "#fff" } }}
      >
        {relicTypes.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </Select>
      <TextField
        label="Relic names (ex: C3 A2 ...)"
        variant="outlined"
        size="small"
        value={relicNames}
        onChange={onRelicNamesChange}
        sx={{
          width: 220,
          color: "#fff",
          "& .MuiOutlinedInput-root": { color: "#fff" },
          "& .MuiInputLabel-root": { color: "#fff" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
        }}
        InputProps={{ style: { color: "#fff" } }}
        InputLabelProps={{ style: { color: "#fff" } }}
      />
      <Button
        variant="outlined"
        onClick={onClear}
        sx={{ color: "white", borderColor: "white" }}
      >
        Clear
      </Button>
    </Box>
  );
}
