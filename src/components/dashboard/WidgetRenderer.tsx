"use client";

import React from "react";
import MainCard from "@/components/cards/MainCard";
import { ViewMode } from "@/enum";
import ChartRenderer from "./ChartRenderer";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import CloseIcon from "@mui/icons-material/Close";
import { DashboardWidget } from "@/types/dashboard";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableCell from "@mui/material/TableCell";
import { metricConfigs } from "@/config";

// Define widget components
const widgetComponents = {
  metric: MetricWidget,
  chart: ChartWidget,
  table: TableWidget,
  text: TextWidget,
  media: MediaWidget,
  map: MapWidget,
  list: ListWidget,
};

export default function WidgetRenderer({
  widget,
  editable,
  onRemove,
}: {
  widget: DashboardWidget | any;
  editable: boolean;
  onRemove: () => void;
}) {
  const WidgetComponent =
    widgetComponents[widget.type as keyof typeof widgetComponents] ||
    UnsupportedWidget;

  return (
    <MainCard sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title={widget.title}
        action={
          editable && (
            <IconButton onClick={onRemove}>
              <CloseIcon />
            </IconButton>
          )
        }
      />
      <CardContent sx={{ flexGrow: 1, overflow: "auto" }}>
        <WidgetComponent widget={widget} />
      </CardContent>
    </MainCard>
  );
}

// Widget Components
function MetricWidget({ widget }: { widget: DashboardWidget }) {
  const data = metricConfigs[widget.id] || {
    value: "N/A",
    label: "Metric",
    change: "0%",
    positive: true,
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4">{data.value}</Typography>
      <Typography variant="subtitle1">{data.label}</Typography>
      <Typography
        variant="body2"
        color={data.positive ? "success.main" : "error.main"}
      >
        {data.positive ? "↑" : "↓"} {data.change}
      </Typography>
    </Box>
  );
}

function ChartWidget({ widget }: { widget: DashboardWidget }) {
  // Get chart data based on widget ID
  const getChartData = () => {
    switch (widget.id) {
      case "transactions":
        return {
          series: [
            {
              id: "scheduled_pickups",
              label: "Scheduled Pickups",
              data: [10, 20, 30, 40],
              color: "#4caf50",
              visible: true,
            },
            {
              id: "completed_transactions",
              label: "Completed Transactions",
              data: [15, 25, 35, 45],
              color: "#2196f3",
              visible: true,
            },
          ],
          xData: [
            new Date(2023, 0, 1),
            new Date(2023, 1, 1),
            new Date(2023, 2, 1),
            new Date(2023, 3, 1),
          ],
          yLabel: "Activity",
        };
      case "user-growth":
        return {
          series: [
            {
              id: "new_users",
              label: "New Users",
              data: [50, 75, 100, 150],
              color: "#ff9800",
              visible: true,
            },
          ],
          xData: [
            new Date(2023, 0, 1),
            new Date(2023, 1, 1),
            new Date(2023, 2, 1),
            new Date(2023, 3, 1),
          ],
          yLabel: "Users",
        };
      case "impact":
        return {
          series: [
            {
              id: "co2_reduction",
              label: "CO2 Reduction",
              data: [120, 145, 170, 200],
              color: "#8bc34a",
              visible: true,
            },
          ],
          xData: [
            new Date(2023, 0, 1),
            new Date(2023, 1, 1),
            new Date(2023, 2, 1),
            new Date(2023, 3, 1),
          ],
          yLabel: "Tons",
        };
      default:
        return {
          series: [],
          xData: [],
          yLabel: "Values",
        };
    }
  };

  const chartData = getChartData();

  return (
    <ChartRenderer
      type="line"
      view={ViewMode.MONTHLY}
      series={chartData.series}
      xData={chartData.xData}
      yLabel={chartData.yLabel}
    />
  );
}

function TableWidget({ widget }: { widget: DashboardWidget }) {
  // Get table data based on widget ID
  const getTableData = () => {
    switch (widget.id) {
      case "pending-issues":
        return {
          headers: ["ID", "Description", "Status", "Assigned To"],
          rows: [
            ["IS-001", "Payment failed", "Open", "Admin"],
            ["IS-002", "Pickup missed", "In Progress", "Agent"],
            ["IS-003", "Wrong quantity", "Resolved", "Manager"],
          ],
        };
      case "history":
        return {
          headers: ["Date", "Type", "Amount", "Status"],
          rows: [
            ["2023-06-01", "Pickup", "$15.00", "Completed"],
            ["2023-06-02", "Recycling", "$8.50", "Completed"],
            ["2023-06-03", "Disposal", "$12.00", "Pending"],
          ],
        };
      case "schedule":
        return {
          headers: ["Time", "Location", "Customer", "Status"],
          rows: [
            ["09:00 AM", "123 Main St", "John Doe", "Pending"],
            ["11:30 AM", "456 Oak Ave", "Jane Smith", "Confirmed"],
            ["02:00 PM", "789 Pine Rd", "Bob Johnson", "Completed"],
          ],
        };
      default:
        return {
          headers: ["Column 1", "Column 2", "Column 3"],
          rows: [
            ["Data 1", "Data 2", "Data 3"],
            ["Data 4", "Data 5", "Data 6"],
          ],
        };
    }
  };

  const tableData = getTableData();

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {tableData.headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.rows.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TextWidget({ widget }: { widget: DashboardWidget }) {
  return (
    <Typography variant="body1">
      {widget.config?.content || "No content provided"}
    </Typography>
  );
}

function MediaWidget({ widget }: { widget: DashboardWidget }) {
  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <video controls src={widget.config?.url} style={{ maxWidth: "100%" }}>
        Your browser does not support the video tag.
      </video>
    </Box>
  );
}

function MapWidget({ widget }: { widget: DashboardWidget }) {
  return (
    <Box
      sx={{
        height: 300,
        bgcolor: "#e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6">Map View: {widget.title}</Typography>
    </Box>
  );
}

function ListWidget({ widget }: { widget: DashboardWidget }) {
  const items = widget.config?.items || ["Item 1", "Item 2", "Item 3"];

  return (
    // eslint-disable-next-line no-restricted-syntax
    <ul style={{ paddingLeft: 20 }}>
      {items.map(
        (
          item:
            | string
            | number
            | bigint
            | boolean
            | React.ReactElement<
                unknown,
                string | React.JSXElementConstructor<any>
              >
            | Iterable<React.ReactNode>
            | React.ReactPortal
            | Promise<
                | string
                | number
                | bigint
                | boolean
                | React.ReactPortal
                | React.ReactElement<
                    unknown,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | null
                | undefined
              >
            | Iterable<React.ReactNode>
            | null
            | undefined,
          index: React.Key | null | undefined
        ) => (
          <li key={index}>{item}</li>
        )
      )}
    </ul>
  );
}

function UnsupportedWidget({ widget }: { widget: DashboardWidget }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 3,
        color: "text.secondary",
      }}
    >
      <Typography variant="h6">
        Unsupported widget type: {widget.type}
      </Typography>
    </Box>
  );
}
