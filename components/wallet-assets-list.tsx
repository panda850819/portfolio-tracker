import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Asset } from "@/types"

interface WalletAssetsListProps {
  assets: Asset[]
}

export default function WalletAssetsList({ assets }: WalletAssetsListProps) {
  // 根據錢包地址分組資產
  const walletGroups = assets.reduce((acc, asset) => {
    const walletInfo = asset.notes ? JSON.parse(asset.notes) : { address: 'unknown', blockchain: 'Unknown' }
    const key = walletInfo.address
    if (!acc[key]) {
      acc[key] = {
        address: walletInfo.address,
        blockchain: walletInfo.blockchain,
        assets: []
      }
    }
    acc[key].assets.push(asset)
    return acc
  }, {} as Record<string, { address: string; blockchain: string; assets: Asset[] }>)

  return (
    <div className="space-y-6">
      {Object.entries(walletGroups).map(([address, wallet]) => (
        <Card key={address}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">錢包資產</h3>
                <Badge variant="outline">{wallet.blockchain}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{wallet.address}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
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
                  <TableHead className="text-right">區塊鏈</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wallet.assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.symbol}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell className="text-right">{asset.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${asset.current_price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${asset.market_value.toLocaleString()}</TableCell>
                    <TableCell className="text-right">NT$ {(asset.market_value * 31.5).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{wallet.blockchain}</TableCell>
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
