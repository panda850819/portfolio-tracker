'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Asset } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface AssetValueChartProps {
  asset: Asset;
  priceHistory: Array<{
    date: string;
    price: number;
    value: number;
  }>;
}

export function AssetValueChart({ asset, priceHistory }: AssetValueChartProps) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={priceHistory}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString('zh-TW')}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => new Date(label).toLocaleDateString('zh-TW')}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            name="價格"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="value"
            stroke="#82ca9d"
            name="市值"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 