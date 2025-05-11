import { ArrowDownLeft, ArrowUpRight, Calendar, Download, Filter, Search, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TransactionList from "@/components/transaction-list"
import TransactionFilters from "@/components/transaction-filters"
import { Badge } from "@/components/ui/badge"

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">交易記錄</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              日期範圍
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              匯出
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">總買入</CardTitle>
              <ArrowDownLeft className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NT$ 2,345,678</div>
              <div className="text-xs text-muted-foreground">過去 30 天</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">總賣出</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NT$ 1,234,567</div>
              <div className="text-xs text-muted-foreground">過去 30 天</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">交易次數</CardTitle>
              <Badge>87</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <div className="text-xs text-muted-foreground">過去 30 天</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">平均交易金額</CardTitle>
              <Badge variant="outline">NT$</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NT$ 41,154</div>
              <div className="text-xs text-muted-foreground">過去 30 天</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜尋交易..."
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              篩選
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              匯入
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="buy">買入</TabsTrigger>
            <TabsTrigger value="sell">賣出</TabsTrigger>
            <TabsTrigger value="transfer">轉帳</TabsTrigger>
            <TabsTrigger value="swap">兌換</TabsTrigger>
            <TabsTrigger value="stake">質押</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>所有交易</CardTitle>
                  <CardDescription>顯示所有資產類別的交易記錄</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList />
                </CardContent>
              </Card>
              <TransactionFilters />
            </div>
          </TabsContent>
          <TabsContent value="buy" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>買入交易</CardTitle>
                  <CardDescription>顯示所有買入類型的交易記錄</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList type="buy" />
                </CardContent>
              </Card>
              <TransactionFilters />
            </div>
          </TabsContent>
          <TabsContent value="sell" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>賣出交易</CardTitle>
                  <CardDescription>顯示所有賣出類型的交易記錄</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList type="sell" />
                </CardContent>
              </Card>
              <TransactionFilters />
            </div>
          </TabsContent>
          <TabsContent value="transfer" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>轉帳交易</CardTitle>
                  <CardDescription>顯示所有轉帳類型的交易記錄</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList type="transfer" />
                </CardContent>
              </Card>
              <TransactionFilters />
            </div>
          </TabsContent>
          <TabsContent value="swap" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>兌換交易</CardTitle>
                  <CardDescription>顯示所有兌換類型的交易記錄</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList type="swap" />
                </CardContent>
              </Card>
              <TransactionFilters />
            </div>
          </TabsContent>
          <TabsContent value="stake" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>質押交易</CardTitle>
                  <CardDescription>顯示所有質押類型的交易記錄</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList type="stake" />
                </CardContent>
              </Card>
              <TransactionFilters />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
