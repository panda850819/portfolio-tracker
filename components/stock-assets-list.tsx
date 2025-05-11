import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Asset } from "@/types"

interface StockAssetsListProps {
  assets: Asset[]
}

export default function StockAssetsList({ assets }: StockAssetsListProps) {
  // 分離台股和美股
  const taiwanStocks = assets.filter(asset => asset.type === 'stock_tw')
  const usStocks = assets.filter(asset => asset.type === 'stock_us')

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">台股</h3>
            <Badge variant="outline">國泰證券</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>代號</TableHead>
                <TableHead>名稱</TableHead>
                <TableHead className="text-right">股數</TableHead>
                <TableHead className="text-right">均價</TableHead>
                <TableHead className="text-right">現價</TableHead>
                <TableHead className="text-right">市值</TableHead>
                <TableHead className="text-right">損益</TableHead>
                <TableHead className="text-right">報酬率</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taiwanStocks.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell className="font-medium">{stock.symbol}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell className="text-right">{stock.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{stock.cost.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{stock.current_price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{stock.market_value.toLocaleString()}</TableCell>
                  <TableCell className={`text-right ${stock.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {stock.profit >= 0 ? "+" : ""}
                    {stock.profit.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className={`text-right ${stock.profit_percentage >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    <div className="flex items-center justify-end">
                      {stock.profit_percentage >= 0 ? (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      )}
                      {stock.profit_percentage.toFixed(2)}%
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

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">美股</h3>
            <Badge variant="outline">國泰證券</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>代號</TableHead>
                <TableHead>名稱</TableHead>
                <TableHead className="text-right">股數</TableHead>
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
              {usStocks.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell className="font-medium">{stock.symbol}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell className="text-right">{stock.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{stock.cost.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{stock.current_price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${stock.market_value.toLocaleString()}</TableCell>
                  <TableCell className="text-right">NT$ {(stock.market_value * 31.5).toLocaleString()}</TableCell>
                  <TableCell className={`text-right ${stock.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {stock.profit >= 0 ? "+" : ""}
                    {stock.profit.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className={`text-right ${stock.profit_percentage >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    <div className="flex items-center justify-end">
                      {stock.profit_percentage >= 0 ? (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      )}
                      {stock.profit_percentage.toFixed(2)}%
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
    </div>
  )
}
