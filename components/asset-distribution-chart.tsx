"use client"

import { useEffect, useRef } from "react"
import { Chart } from "chart.js/auto"
import { Asset } from "@/types"

interface AssetDistributionChartProps {
  assets: Asset[];
}

export default function AssetDistributionChart({ assets }: AssetDistributionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // 計算各資產類型的總值
    const assetsByType = assets.reduce((acc, asset) => {
      const type = asset.type;
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += asset.market_value;
      return acc;
    }, {} as Record<string, number>);

    // 計算總資產
    const totalValue = Object.values(assetsByType).reduce((sum, value) => sum + value, 0);

    // 計算百分比
    const percentages = Object.entries(assetsByType).map(([type, value]) => ({
      type,
      percentage: (value / totalValue) * 100
    }));

    // 資產類型對應的顯示名稱
    const typeLabels: Record<string, string> = {
      'stock_tw': '台股',
      'stock_us': '美股',
      'crypto': '加密貨幣',
      'cash': '現金',
      'defi': 'DeFi 資產'
    };

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: percentages.map(({ type }) => typeLabels[type] || type),
        datasets: [
          {
            data: percentages.map(({ percentage }) => percentage),
            backgroundColor: percentages.map(({ type }) => {
              switch (type) {
                case 'stock_tw':
                case 'stock_us':
                  return '#3b82f6'; // blue
                case 'crypto':
                  return '#a855f7'; // purple
                case 'defi':
                  return '#ec4899'; // pink
                case 'cash':
                  return '#eab308'; // yellow
                default:
                  return '#6b7280'; // gray
              }
            }),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 12,
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw as number
                return `${label}: ${value.toFixed(1)}%`
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [assets])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}
