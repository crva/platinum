import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

interface StatisticsCardProps {
  title: string | React.ReactNode;
  relicTier?: string;
  relicName?: string;
  value?: string | number | React.ReactNode;
  list?: boolean;
  children?: React.ReactNode;
}

export default function StatisticsCard(props: StatisticsCardProps) {
  const { title, relicTier, relicName, value, list = false, children } = props;
  return (
    <Card sx={{}}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">{title}</Typography>
        {list ? (
          children
        ) : (
          <>
            <img
              src={`${relicTier?.toLowerCase()}.png`}
              alt={relicTier}
              style={{ width: 128, height: 128, marginBottom: 8 }}
            />
            <Typography variant="h6">{relicName}</Typography>
            <Typography variant="body1" color="text.secondary">
              {value}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
