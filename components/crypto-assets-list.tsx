import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Asset } from "@/types"

interface CryptoAssetsListProps {
  assets: Asset[]
}

export default function CryptoAssetsList({ assets }: CryptoAssetsListProps) {
  const exchanges = [
    { id: "binance", name: "Binance" },
    { id: "okx", name: "OKX" },
    { id: "bybit", name: "Bybit" },
    { id: "flipser", name: "Flipser" },
  ]

  // 根據交易所分組資產
  const assetsByExchange = assets.reduce((acc, asset) => {
    const exchange = asset.notes || 'other'
    if (!acc[exchange]) {
      acc[exchange] = []
    }
    acc[exchange].push(asset)
    return acc
  }, {} as Record<string, Asset[]>)

  return (
    <Tabs defaultValue={exchanges[0].id} className="space-y-4">
      <TabsList>
        {exchanges.map((exchange) => (
          <TabsTrigger key={exchange.id} value={exchange.id}>
            {exchange.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {exchanges.map((exchange) => (
        <TabsContent key={exchange.id} value={exchange.id}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{exchange.name}</h3>
                <Badge variant="outline">交易所</Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>代號</TableHead>
                    <TableHead>名稱</TableHead>
                    <TableHead className="text-right">數量</TableHead>
                    <TableHead className="text-right">均價 (USD)</TableHead>
                    <TableHead className="text-right">現價 (USD)</TableHead>
                    <TableHead className="text-right">市值 (USD)</TableHead>
                    <TableHead className="text-right">台幣市值</TableHead>
                    <TableHead className="text-right">損益 (USD)</TableHead>
                    <TableHead className="text-right">報酬率</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(assetsByExchange[exchange.id] || []).map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.symbol}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell className="text-right">{asset.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{asset.cost.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{asset.current_price.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${asset.market_value.toLocaleString()}</TableCell>
                      <TableCell className="text-right">NT$ {(asset.market_value * 31.5).toLocaleString()}</TableCell>
                      <TableCell className={`text-right ${asset.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {asset.profit >= 0 ? "+" : ""}
                        {asset.profit.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={`text-right ${asset.profit_percentage >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        <div className="flex items-center justify-end">
                          {asset.profit_percentage >= 0 ? (
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="mr-1 h-4 w-4" />
                          )}
                          {asset.profit_percentage.toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
