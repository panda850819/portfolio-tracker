"use client"

import { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Asset } from "@/types"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

Chart.register(...registerables)

interface AssetGrowthChartProps {
  className?: string
  assets: Asset[]
}

export default function AssetGrowthChart({ className, assets }: AssetGrowthChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [timeRange, setTimeRange] = useState<"24h" | "1W" | "1M" | "3M" | "1Y" | "ALL">("1M")

  // 計算總資產和月度漲跌幅
  const totalAssets = assets.reduce((sum, asset) => sum + asset.market_value, 0)
  const totalProfit = assets.reduce((sum, asset) => sum + asset.profit, 0)
  const totalProfitPercentage = (totalProfit / (totalAssets - totalProfit)) * 100

  // 根據選擇的時間範圍生成不同的數據
  const generateChartData = (range: string) => {
    const now = new Date()
    const labels: string[] = []
    const data: number[] = []

    let days = 0
    let dataPoints = 0
    let baseValue = totalAssets - totalProfit
    let volatility = 0
    let interval = "daily"

    switch (range) {
      case "24h":
        days = 1
        dataPoints = 24
        volatility = 0.001
        interval = "hourly"
        break
      case "1W":
        days = 7
        dataPoints = 7
        volatility = 0.003
        break
      case "1M":
        days = 30
        dataPoints = 30
        volatility = 0.005
        break
      case "3M":
        days = 90
        dataPoints = 45
        volatility = 0.008
        break
      case "1Y":
        days = 365
        dataPoints = 52
        volatility = 0.01
        interval = "weekly"
        break
      case "ALL":
        days = 730
        dataPoints = 104
        volatility = 0.015
        interval = "weekly"
        break
    }

    // 生成時間標籤和數據點
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date(now)
      
      if (interval === "hourly") {
        date.setHours(now.getHours() - 24 + i)
        labels.push(`${date.getHours().toString().padStart(2, '0')}:00`)
      } else if (interval === "weekly") {
        date.setDate(now.getDate() - days + (days / dataPoints) * i)
        const month = date.toLocaleString('default', { month: 'short' })
        const day = date.getDate()
        labels.push(`${month} ${day}`)
      } else {
        date.setDate(now.getDate() - days + (days / dataPoints) * i)
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        labels.push(`${month}/${day}`)
      }

      // 生成更自然的價格波動
      const progress = i / dataPoints
      const trend = Math.sin(progress * Math.PI) * 0.2 + 1 // 添加週期性波動
      const trendValue = baseValue + totalProfit * progress * trend
      const noise = (Math.random() - 0.5) * 2 * volatility * trendValue
      const smoothing = 0.8 // 平滑因子
      
      // 應用平滑處理
      const previousValue = i > 0 ? data[i - 1] : trendValue
      const rawValue = trendValue + noise
      const smoothedValue = previousValue * smoothing + rawValue * (1 - smoothing)
      
      data.push(Math.round(smoothedValue))
    }

    return { labels, data }
  }

  useEffect(() => {
    if (!chartRef.current) return

    // 銷毀現有圖表
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    const { labels, data } = generateChartData(timeRange)

    // 創建漸變填充
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, "rgba(52, 211, 153, 0.2)") // 更淡的綠色
    gradient.addColorStop(1, "rgba(52, 211, 153, 0.0)") // 透明

    // 創建新圖表
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "資產價值",
            data,
            borderColor: "rgb(52, 211, 153)",
            borderWidth: 2,
            backgroundColor: gradient,
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: "rgb(52, 211, 153)",
            pointHoverBackgroundColor: "rgb(52, 211, 153)",
            pointHoverBorderColor: "rgb(255, 255, 255)",
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                return `NT$ ${value.toLocaleString()}`
              },
            },
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "rgb(255, 255, 255)",
            bodyColor: "rgb(255, 255, 255)",
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8,
              color: "rgb(156, 163, 175)",
              font: {
                size: 11,
              },
            },
            border: {
              display: false,
            },
          },
          y: {
            display: false,
            beginAtZero: false,
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
        elements: {
          line: {
            tension: 0.3,
          },
        },
        animation: {
          duration: 750,
          easing: 'easeOutQuart',
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [timeRange, assets])

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">NT$ {totalAssets.toLocaleString()}</CardTitle>
          <div 
            className={cn(
              "text-sm flex items-center gap-1",
              totalProfitPercentage >= 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {totalProfitPercentage >= 0 ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            <span>
              {totalProfitPercentage >= 0 ? "+" : ""}
              {totalProfitPercentage.toFixed(2)}% (NT$ {totalProfit.toLocaleString()})
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {(["24h", "1W", "1M", "3M", "1Y", "ALL"] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-7 text-xs font-medium",
                timeRange === range && "bg-green-100 text-green-700 hover:bg-green-200"
              )}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full px-2 pb-4">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  )
}
