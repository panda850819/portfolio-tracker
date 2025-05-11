"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Edit, Save, X } from "lucide-react"

export default function CurrencySettings() {
  const [editingCurrency, setEditingCurrency] = useState<string | null>(null)
  const [newRate, setNewRate] = useState("")

  // 模擬匯率數據
  const exchangeRates = [
    { currency: "USD", name: "美元", rate: 31.5, lastUpdated: "2023-05-10 14:30" },
    { currency: "JPY", name: "日元", rate: 0.21, lastUpdated: "2023-05-10 14:30" },
    { currency: "EUR", name: "歐元", rate: 34.2, lastUpdated: "2023-05-10 14:30" },
    { currency: "GBP", name: "英鎊", rate: 39.8, lastUpdated: "2023-05-10 14:30" },
    { currency: "CNY", name: "人民幣", rate: 4.35, lastUpdated: "2023-05-10 14:30" },
    { currency: "HKD", name: "港幣", rate: 4.03, lastUpdated: "2023-05-10 14:30" },
  ]

  const handleEditRate = (currency: string, currentRate: number) => {
    setEditingCurrency(currency)
    setNewRate(currentRate.toString())
  }

  const handleSaveRate = () => {
    // 在實際應用中，這裡會保存到數據庫或狀態管理
    console.log(`Saving new rate for ${editingCurrency}: ${newRate}`)
    setEditingCurrency(null)
    setNewRate("")
  }

  const handleCancelEdit = () => {
    setEditingCurrency(null)
    setNewRate("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>匯率設定</CardTitle>
        <CardDescription>設定不同貨幣兌換台幣的匯率，用於資產和交易換算</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rates">匯率列表</TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
          </TabsList>
          <TabsContent value="rates">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>貨幣代碼</TableHead>
                    <TableHead>貨幣名稱</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end">
                        匯率 (兌台幣)
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>最後更新</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exchangeRates.map((rate) => (
                    <TableRow key={rate.currency}>
                      <TableCell className="font-medium">{rate.currency}</TableCell>
                      <TableCell>{rate.name}</TableCell>
                      <TableCell className="text-right">
                        {editingCurrency === rate.currency ? (
                          <Input
                            type="number"
                            value={newRate}
                            onChange={(e) => setNewRate(e.target.value)}
                            className="w-24 ml-auto"
                            step="0.01"
                          />
                        ) : (
                          rate.rate
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{rate.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        {editingCurrency === rate.currency ? (
                          <div className="flex items-center justify-end space-x-1">
                            <Button variant="ghost" size="icon" onClick={handleSaveRate}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => handleEditRate(rate.currency, rate.rate)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-currency">基準貨幣</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">目前基準貨幣</Label>
                    <div className="font-medium mt-1">新台幣 (TWD)</div>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full">
                      變更基準貨幣
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-frequency">更新頻率</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">自動更新頻率</Label>
                    <div className="font-medium mt-1">每日</div>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full">
                      立即更新匯率
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-source">資料來源</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">匯率資料來源</Label>
                    <div className="font-medium mt-1">台灣銀行</div>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full">
                      變更資料來源
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
