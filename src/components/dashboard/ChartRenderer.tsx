"use client";

// import { useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import { ViewMode } from "@/enum";
import Box from "@mui/material/Box";

// Utils
const valueFormatter = (date: Date, view: any) => {
  switch (view) {
    case ViewMode.DAILY:
      return date.toLocaleDateString("en-us", { weekday: "short" });
    case ViewMode.MONTHLY:
      return date.toLocaleDateString("en-US", { month: "short" });
    case ViewMode.YEARLY:
    default:
      return date.getFullYear().toString();
  }
};

const tickInterval = (date: Date, view: any) => {
  switch (view) {
    case ViewMode.MONTHLY:
      return date.getDate() === 15;
    case ViewMode.YEARLY:
      return date.getMonth() === 5;
    case ViewMode.DAILY:
    default:
      return true;
  }
};

export default function ChartRenderer({
  type = "line",
  view = ViewMode.MONTHLY,
  series = [],
  xData = [],
  yLabel = "Values",
}: {
  type?: "line";
  view?: any;
  series: {
    id: string;
    label: string;
    data: number[];
    color: string;
    visible?: boolean;
  }[];
  xData: Date[];
  yLabel?: string;
}) {
  //   const theme = useTheme();
  const visibleSeries = series.filter((s) => s.visible !== false);

  const dynamicSeriesStyles = visibleSeries.reduce(
    (acc: Record<string, any>, series) => {
      acc[`& .MuiAreaElement-series-${series.id}`] = {
        fill: `url(#${series.id})`,
        opacity: 0.15,
      };
      return acc;
    },
    {}
  );

  return (
    <Box sx={{ width: "100%" }}>
      {type === "line" && (
        <LineChart
          series={visibleSeries.map((s) => ({
            ...s,
            showMark: false,
            curve: "linear",
            area: true,
          }))}
          height={260}
          xAxis={[
            {
              data: xData,
              scaleType: "point",
              disableLine: true,
              disableTicks: true,
              valueFormatter: (v) => valueFormatter(v, view),
              tickInterval: (v) => tickInterval(v, view),
            },
          ]}
          yAxis={[
            {
              label: yLabel,
              disableLine: true,
              disableTicks: true,
            },
          ]}
          grid={{ horizontal: true }}
          margin={{ top: 25, right: 20, bottom: 20, left: 60 }}
          sx={{
            "& .MuiLineElement-root": { strokeDasharray: "0", strokeWidth: 2 },
            "& .MuiChartsAxis-left .MuiChartsAxis-label": {
              transform: "translate(-15px, 0)",
            },
            ...dynamicSeriesStyles,
          }}
        >
          <defs>
            {visibleSeries.map((series, index) => (
              <linearGradient
                id={series.id}
                key={index}
                gradientTransform="rotate(90)"
              >
                <stop offset="10%" stopColor={series.color} stopOpacity={1} />
                <stop offset="86%" stopColor={series.color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
        </LineChart>
      )}
    </Box>
  );
}
