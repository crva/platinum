import { Box, Typography } from "@mui/material";

interface PlatinumTextProps {
  text: string | number | null;
  variant?: "body1" | "h6" | "h5" | "h4" | "h3" | "h2" | "h1";
  color?: string;
}

export default function PlatinumText({
  text,
  variant,
  color,
}: PlatinumTextProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
      <Typography variant={variant} color={color}>
        {text}
      </Typography>
      <img
        src="/platinum.png"
        alt="platinum"
        style={{ width: 16, height: 16 }}
      />
    </Box>
  );
}
