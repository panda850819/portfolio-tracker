'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Asset } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface AssetAllocationChartProps {
  assets: Asset[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AssetAllocationChart({ assets }: AssetAllocationChartProps) {
  // 按資產類型分組並計算總市值
  const assetsByType = assets.reduce((acc, asset) => {
    const type = asset.type;
    if (!acc[type]) {
      acc[type] = {
        name: type,
        value: 0,
      };
    }
    acc[type].value += asset.market_value;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);

  const data = Object.values(assetsByType);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              value,
              name,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              const percent = ((value / total) * 100).toFixed(1);

              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                >
                  {`${name} ${percent}%`}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 