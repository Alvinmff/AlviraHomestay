"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  date: string;
  revenue?: number;
  occupancy?: number;
}

interface DashboardChartsProps {
  data: ChartData[];
}

const formatRupiah = (number: number) => {
  if (number >= 1000000) {
    return `Rp ${(number / 1000000).toFixed(1)}M`;
  }
  if (number >= 1000) {
    return `Rp ${(number / 1000).toFixed(0)}K`;
  }
  return `Rp ${number}`;
};

export function RevenueChart({ data }: DashboardChartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground text-sm">
        No revenue data available for this period.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#19A794" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#19A794" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/50" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-muted-foreground"
            minTickGap={30}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatRupiah(value)}
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-muted-foreground"
            width={80}
          />
          <Tooltip 
            formatter={(value: any) => [
              new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(value) || 0), 
              "Revenue"
            ]}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#1f2937', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            labelStyle={{ color: '#6b7280', fontWeight: 500, marginBottom: 4 }}
            itemStyle={{ color: '#1f2937' }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#19A794"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OccupancyChart({ data }: DashboardChartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground text-sm">
        No occupancy data available for this period.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/50" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-muted-foreground"
            minTickGap={30}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-muted-foreground"
            width={40}
            domain={[0, 100]}
          />
          <Tooltip 
            formatter={(value: any) => [`${value}%`, "Occupancy"]}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#1f2937', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            labelStyle={{ color: '#6b7280', fontWeight: 500, marginBottom: 4 }}
            itemStyle={{ color: '#1f2937' }}
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
          />
          <Bar 
            dataKey="occupancy" 
            fill="#6B8FE3" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
