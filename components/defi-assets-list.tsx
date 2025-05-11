import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, ExternalLink, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Asset } from "@/types"

interface DeFiAssetsListProps {
  assets: Asset[]
}

export default function DeFiAssetsList({ assets }: DeFiAssetsListProps) {
  // 根據協議分組資產
  const protocolGroups = assets.reduce((acc, asset) => {
    const defiInfo = asset.notes ? JSON.parse(asset.notes) : { 
      protocol: 'Unknown',
      type: 'Unknown',
      blockchain: 'Unknown',
      apy: '0%',
      healthFactor: '-',
      riskLevel: '中'
    }
    const key = defiInfo.protocol
    if (!acc[key]) {
      acc[key] = {
        protocol: defiInfo.protocol,
        type: defiInfo.type,
        blockchain: defiInfo.blockchain,
        assets: []
      }
    }
    acc[key].assets.push({
      ...asset,
      apy: defiInfo.apy,
      healthFactor: defiInfo.healthFactor,
      riskLevel: defiInfo.riskLevel
    })
    return acc
  }, {} as Record<string, { 
    protocol: string
    type: string
    blockchain: string
    assets: (Asset & { 
      apy: string
      healthFactor: string
      riskLevel: string 
    })[]
  }>)

  return (
    <div className="space-y-6">
      {Object.entries(protocolGroups).map(([protocol, group]) => (
        <Card key={protocol}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{group.protocol}</h3>
                <Badge variant="outline">{group.type}</Badge>
                <Badge variant="outline">{group.blockchain}</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>代號</TableHead>
                  <TableHead>名稱</TableHead>
                  <TableHead className="text-right">數量</TableHead>
                  <TableHead className="text-right">現價 (USD)</TableHead>
                  <TableHead className="text-right">市值 (USD)</TableHead>
                  <TableHead className="text-right">台幣市值</TableHead>
                  <TableHead className="text-right">APY</TableHead>
                  <TableHead className="text-right">健康係數</TableHead>
                  <TableHead className="text-right">風險等級</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.symbol}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell className="text-right">{asset.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${asset.current_price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${asset.market_value.toLocaleString()}</TableCell>
                    <TableCell className="text-right">NT$ {(asset.market_value * 31.5).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-green-500">{asset.apy}</TableCell>
                    <TableCell className="text-right">
                      {asset.healthFactor !== "-" ? (
                        <div className="flex items-center justify-end">
                          {Number(asset.healthFactor) < 1.5 ? (
                            <AlertCircle className="mr-1 h-4 w-4 text-red-500" />
                          ) : null}
                          {asset.healthFactor}
                        </div>
                      ) : (
                        asset.healthFactor
                      )}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        asset.riskLevel === "低"
                          ? "text-green-500"
                          : asset.riskLevel === "中"
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                    >
                      {asset.riskLevel}
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
