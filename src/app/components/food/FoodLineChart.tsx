"use client";

import type { Log } from "../../types";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  logs: Log[];
};

export default function FoodLineChart({ logs }: Props) {
  const chartData = logs.map((log) => ({
    date: log.date.slice(5).replace("-", "/"),
    kcal: log.hours,
  }));

  if (chartData.length === 0) {
    return (
      <div
        style={{
          marginTop: 20,
          padding: 24,
          borderRadius: 16,
          background: "#f7faf8",
          border: "1px solid #e2ebe5",
          textAlign: "center",
          color: "#78817c",
        }}
      >
        まだ食事記録がありません
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 20,
        padding: 16,
        borderRadius: 16,
        background: "#f7faf8",
        border: "1px solid #e2ebe5",
      }}
    >
      <div
        style={{
          marginBottom: 12,
          fontSize: 16,
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        食事量の推移
      </div>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 16,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tick={{
                fontSize: 12,
              }}
            />

            <YAxis
              tick={{
                fontSize: 12,
              }}
              width={50}
            />

            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(0)} kcal`,
                "食事量",
              ]}
            />

            <Line
              type="monotone"
              dataKey="kcal"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}