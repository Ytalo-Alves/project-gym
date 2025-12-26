"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const data = [
  { hour: "06h", checkins: 12 },
  { hour: "07h", checkins: 25 },
  { hour: "08h", checkins: 45 },
  { hour: "09h", checkins: 30 },
  { hour: "10h", checkins: 20 },
  { hour: "11h", checkins: 15 },
  { hour: "12h", checkins: 18 },
  { hour: "13h", checkins: 22 },
  { hour: "14h", checkins: 15 },
  { hour: "15h", checkins: 20 },
  { hour: "16h", checkins: 35 },
  { hour: "17h", checkins: 55 },
  { hour: "18h", checkins: 80 },
  { hour: "19h", checkins: 75 },
  { hour: "20h", checkins: 50 },
  { hour: "21h", checkins: 30 },
];

export function ActivityChart() {
  return (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white hover:border-white/10 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
          Check-ins por Horário
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="hour"
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
              />
              <Tooltip
                cursor={{ fill: "#27272a" }}
                contentStyle={{
                  backgroundColor: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar
                dataKey="checkins"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
