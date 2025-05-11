"use client"

import { DollarSign, TrendingUp, Wallet, BarChart2, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AssetDistributionChart from "@/components/asset-distribution-chart"
import AssetCard from "@/components/asset-card"
import AssetGrowthChart from "@/components/asset-growth-chart"
import { useAssets } from "@/hooks/useAssets"
import { Asset } from "@/types"

export default function DashboardPage() {
  const { assets, loading, error, refresh } = useAssets()

  // 計算資產統計
  const totalAssets = assets.reduce((sum, asset) => sum + asset.market_value, 0)
  const stockAssets = assets.filter(a => a.type.startsWith('stock_'))
  const cryptoAssets = assets.filter(a => a.type === 'crypto')
  const cashAssets = assets.filter(a => a.type === 'cash')

  const stockTotal = stockAssets.reduce((sum, asset) => sum + asset.market_value, 0)
  const cryptoTotal = cryptoAssets.reduce((sum, asset) => sum + asset.market_value, 0)
  const cashTotal = cashAssets.reduce((sum, asset) => sum + asset.market_value, 0)

  // 計算月度漲跌幅
  const calculateMonthlyChange = (assets: Asset[]) => {
    const totalProfit = assets.reduce((sum, asset) => sum + asset.profit, 0)
    const totalValue = assets.reduce((sum, asset) => sum + asset.market_value, 0)
    const profitPercentage = (totalProfit / (totalValue - totalProfit)) * 100
    return {
      profit: totalProfit,
      percentage: profitPercentage
    }
  }

  const stockChange = calculateMonthlyChange(stockAssets)
  const cryptoChange = calculateMonthlyChange(cryptoAssets)
  const cashChange = calculateMonthlyChange(cashAssets)
  const totalChange = calculateMonthlyChange(assets)

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
        <div className="text-lg">載入中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
        <div className="text-lg text-red-500">錯誤：{error}</div>
        <Button onClick={refresh} className="mt-4">重試</Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">總資產</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NT$ {totalAssets.toLocaleString()}</div>
              <div className={`flex items-center pt-1 text-xs ${totalChange.percentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                {totalChange.percentage >= 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                <span>{totalChange.percentage >= 0 ? "+" : ""}{totalChange.percentage.toFixed(1)}% 本月</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">股票資產</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NT$ {stockTotal.toLocaleString()}</div>
              <div className={`flex items-center pt-1 text-xs ${stockChange.percentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                {stockChange.percentage >= 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                <span>{stockChange.percentage >= 0 ? "+" : ""}{stockChange.percentage.toFixed(1)}% 本月</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">加密貨幣</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NT$ {cryptoTotal.toLocaleString()}</div>
              <div className={`flex items-center pt-1 text-xs ${cryptoChange.percentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                {cryptoChange.percentage >= 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                <span>{cryptoChange.percentage >= 0 ? "+" : ""}{cryptoChange.percentage.toFixed(1)}% 本月</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">現金資產</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NT$ {cashTotal.toLocaleString()}</div>
              <div className={`flex items-center pt-1 text-xs ${cashChange.percentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                {cashChange.percentage >= 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                <span>{cashChange.percentage >= 0 ? "+" : ""}{cashChange.percentage.toFixed(1)}% 本月</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <AssetGrowthChart className="w-full" assets={assets} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>資產分佈</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <AssetDistributionChart assets={assets} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>資產表現</CardTitle>
              <CardDescription>過去30天資產表現</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.map(asset => (
                  <AssetCard
                    key={asset.id}
                    name={asset.name}
                    icon={getAssetIcon(asset.type)}
                    value={`NT$ ${asset.market_value.toLocaleString()}`}
                    change={`${asset.profit_percentage > 0 ? '+' : ''}${asset.profit_percentage.toFixed(1)}%`}
                    positive={asset.profit_percentage > 0}
                    color={getAssetColor(asset.type)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">資產概覽</h2>
          <Button variant="outline" onClick={() => window.location.href = '/assets'}>查看所有資產</Button>
        </div>
      </main>
    </div>
  )
}

function getAssetIcon(type: string) {
  switch (type) {
    case 'stock_tw':
    case 'stock_us':
      return <TrendingUp className="h-4 w-4" />
    case 'crypto':
      return <Activity className="h-4 w-4" />
    case 'wallet':
      return <Wallet className="h-4 w-4" />
    case 'defi':
      return <Activity className="h-4 w-4" />
    case 'cash':
      return <DollarSign className="h-4 w-4" />
    default:
      return <BarChart2 className="h-4 w-4" />
  }
}

function getAssetColor(type: string) {
  switch (type) {
    case 'stock_tw':
    case 'stock_us':
      return 'blue'
    case 'crypto':
      return 'purple'
    case 'wallet':
      return 'indigo'
    case 'defi':
      return 'pink'
    case 'cash':
      return 'yellow'
    default:
      return 'gray'
  }
}
