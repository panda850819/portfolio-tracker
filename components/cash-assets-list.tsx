import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Asset } from "@/types"

interface CashAssetsListProps {
  assets: Asset[]
}

export default function CashAssetsList({ assets }: CashAssetsListProps) {
  // 根據幣種分組資產
  const currencyGroups = assets.reduce((acc, asset) => {
    const currency = asset.notes || 'TWD'
    if (!acc[currency]) {
      acc[currency] = []
    }
    acc[currency].push(asset)
    return acc
  }, {} as Record<string, Asset[]>)

  return (
    <div className="space-y-6">
      {Object.entries(currencyGroups).map(([currency, assets]) => (
        <Card key={currency}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{currency} 現金</h3>
                <Badge variant="outline">{currency}</Badge>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名稱</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead className="text-right">匯率</TableHead>
                  <TableHead className="text-right">台幣市值</TableHead>
                  <TableHead className="text-right">損益</TableHead>
                  <TableHead className="text-right">報酬率</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell className="text-right">{asset.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{asset.current_price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">NT$ {asset.market_value.toLocaleString()}</TableCell>
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
      ))}
    </div>
  )
}
