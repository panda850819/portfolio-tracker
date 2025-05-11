"use client"

import { useEffect, useRef } from "react"
import { Chart } from "chart.js/auto"
import { Asset, AssetType } from "@/types"

interface AssetDistributionChartProps {
  assets: Asset[];
}

export default function AssetDistributionChart({ assets }: AssetDistributionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // 銷毀現有圖表
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // 按資產類型分組並計算總市值
    const assetsByType = assets.reduce((acc, asset) => {
      let displayType: string
      
      // 根據資產類型進行分類
      switch (asset.type) {
        case 'stock_tw':
        case 'stock_us':
          displayType = '股票'
          break
        case 'crypto':
        case 'defi':
        case 'wallet':
          displayType = '加密貨幣'
          break
        case 'cash':
          displayType = '現金'
          break
        default:
          displayType = '其他'
      }
      
      if (!acc[displayType]) {
        acc[displayType] = 0
      }
      acc[displayType] += asset.market_value
      return acc
    }, {} as Record<string, number>)

    const totalValue = Object.values(assetsByType).reduce((sum, value) => sum + value, 0)
    
    const data = Object.entries(assetsByType).map(([type, value]) => ({
      name: type,
      value: value,
      percentage: ((value / totalValue) * 100).toFixed(1)
    }))

    // 創建新圖表
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.map(item => `${item.name} ${item.percentage}%`),
        datasets: [{
          data: data.map(item => item.value),
          backgroundColor: [
            '#3b82f6', // 藍色 - 股票
            '#10b981', // 綠色 - 加密貨幣
            '#f59e0b', // 黃色 - 現金
            '#6b7280', // 灰色 - 其他
          ],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 15,
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                return `NT$ ${value.toLocaleString()}`
              }
            }
          }
        }
      }
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
