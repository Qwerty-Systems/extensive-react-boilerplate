import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import React from "react";

const widgetTypes = [
  { type: "metric", name: "Metric Card", description: "Display key metrics" },
  { type: "chart", name: "Chart", description: "Visualize data trends" },
  { type: "table", name: "Data Table", description: "Tabular data display" },
  {
    type: "waste-map",
    name: "Waste Map",
    description: "Geographical waste data",
  },
  {
    type: "transactions",
    name: "Recent Transactions",
    description: "Latest activities",
  },
  {
    type: "disputes",
    name: "Open Disputes",
    description: "Pending resolutions",
  },
  {
    type: "sustainability",
    name: "Sustainability Stats",
    description: "Environmental impact",
  },
];

export default function WidgetPicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Add Widget to Dashboard</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ p: 2 }}>
          {widgetTypes.map((widget) => (
            <Grid sx={{ xs: 4 }} key={widget.type}>
              <Button
                variant="outlined"
                sx={{
                  height: 100,
                  width: "100%",
                  flexDirection: "column",
                  textAlign: "center",
                }}
                onClick={() => {
                  onSelect(widget.type);
                  onClose();
                }}
              >
                <div>
                  <strong>{widget.name}</strong>
                </div>
                <div style={{ fontSize: 12 }}>{widget.description}</div>
              </Button>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
