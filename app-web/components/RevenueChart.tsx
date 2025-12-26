"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const data = [
  { name: "Jan", total: 45000 },
  { name: "Fev", total: 52000 },
  { name: "Mar", total: 48000 },
  { name: "Abr", total: 61000 },
  { name: "Mai", total: 55000 },
  { name: "Jun", total: 67000 },
  { name: "Jul", total: 72000 },
  { name: "Ago", total: 85000 },
  { name: "Set", total: 98320 },
];

export function RevenueChart() {
  return (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white hover:border-white/10 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
          Receita Mensal
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#52525b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#52525b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => `R$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
