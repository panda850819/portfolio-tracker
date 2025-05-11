import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TransactionFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>篩選條件</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>日期範圍</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="date" className="pl-8" />
            </div>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="date" className="pl-8" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>交易類型</Label>
          <RadioGroup defaultValue="all">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">全部</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buy" id="buy" />
              <Label htmlFor="buy">買入</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sell" id="sell" />
              <Label htmlFor="sell">賣出</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="transfer" id="transfer" />
              <Label htmlFor="transfer">轉帳</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="swap" id="swap" />
              <Label htmlFor="swap">兌換</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stake" id="stake" />
              <Label htmlFor="stake">質押</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>資產類別</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="stocks" />
              <Label htmlFor="stocks">股票</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="crypto" />
              <Label htmlFor="crypto">加密貨幣</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="defi" />
              <Label htmlFor="defi">DeFi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="cash" />
              <Label htmlFor="cash">現金</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>平台</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="選擇平台" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="binance">Binance</SelectItem>
              <SelectItem value="okx">OKX</SelectItem>
              <SelectItem value="bybit">Bybit</SelectItem>
              <SelectItem value="flipser">Flipser</SelectItem>
              <SelectItem value="cathay">國泰證券</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>金額範圍</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" placeholder="最小值" />
            <Input type="number" placeholder="最大值" />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline">重置</Button>
          <Button>套用篩選</Button>
        </div>
      </CardContent>
    </Card>
  )
}
