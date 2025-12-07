import { Clear } from "@mui/icons-material";
import { Box, IconButton, MenuItem, Select, TextField } from "@mui/material";
import type { RelicTier } from "../types";
import DraggableSquares from "./DraggableSquares";

const relicTypes: RelicTier[] = ["Lith", "Meso", "Neo", "Axi", "Requiem"];

interface ControlsProps {
  type: string;
  relicNames: string;
  onTypeChange: (e: any) => void;
  onRelicNamesChange: (e: any) => void;
}

export default function Controls({
  type,
  relicNames,
  onTypeChange,
  onRelicNamesChange,
}: ControlsProps) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 1, alignItems: "center" }}>
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
        InputProps={{
          style: { color: "#fff" },
          endAdornment: relicNames ? (
            <IconButton
              onClick={() =>
                onRelicNamesChange({ target: { value: "" } } as any)
              }
              sx={{
                color: "#fff",
                "&:hover": { backgroundColor: "transparent" },
                paddingRight: 0,
              }}
            >
              <Clear />
            </IconButton>
          ) : null,
        }}
        InputLabelProps={{ style: { color: "#fff" } }}
      />
      <DraggableSquares />
    </Box>
  );
}
