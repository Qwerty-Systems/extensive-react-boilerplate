import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import WidgetRenderer from "./WidgetRenderer";
import WidgetPicker from "./WidgetPicker";
import useConfig from "@/hooks/useConfig";

export default function Dashboard() {
  const { layout, widgets, loading, saveDashboard } = useConfig();
  const [editing, setEditing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [currentLayout, setCurrentLayout] = useState(layout);
  console.log("currentLayout", currentLayout, widgets);
  const handleLayoutChange = (layout: GridLayout.Layout[]) => {
    const updatedWidgets = widgets.map((widget: { id: any }) => {
      const item = layout.find((l) => l.i === widget.id);
      return item
        ? { ...widget, x: item.x, y: item.y, w: item.w, h: item.h }
        : widget;
    });

    setCurrentLayout({ ...currentLayout, widgets: updatedWidgets });
  };

  const handleSave = () => {
    saveDashboard(currentLayout);
    setEditing(false);
  };

  const addWidget = (widgetType: string) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: `New ${widgetType}`,
      config: {},
      x: 0,
      y: Infinity, // adds to bottom
      w: 4,
      h: 2,
    };

    setCurrentLayout({
      ...currentLayout,
      widgets: [...widgets, newWidget],
    });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
        <Button variant="contained" onClick={() => setEditing(!editing)}>
          {editing ? "Stop Editing" : "Customize Dashboard"}
        </Button>

        {editing && (
          <>
            <Button variant="outlined" onClick={() => setPickerOpen(true)}>
              Add Widget
            </Button>
            <Button variant="contained" color="success" onClick={handleSave}>
              Save Layout
            </Button>
          </>
        )}
      </Box>

      {widgets && widgets.length > 0 && (
        <GridLayout
          className="layout"
          layout={widgets.map(
            (w: { id: any; x: any; y: any; w: any; h: any }) => ({
              i: w.id,
              x: w.x,
              y: w.y,
              w: w.w,
              h: w.h,
            })
          )}
          cols={12}
          rowHeight={100}
          width={1200}
          isDraggable={editing}
          isResizable={editing}
          onLayoutChange={handleLayoutChange}
        >
          {widgets.map((widget: { id: React.Key | null | undefined }) => (
            <div key={widget.id}>
              <WidgetRenderer
                widget={widget}
                editable={editing}
                onRemove={() => {
                  setCurrentLayout({
                    ...currentLayout,
                    widgets: widgets.filter(
                      (w: { id: React.Key | null | undefined }) =>
                        w.id !== widget.id
                    ),
                  });
                }}
              />
            </div>
          ))}
        </GridLayout>
      )}

      <WidgetPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={addWidget}
      />
    </Box>
  );
}
