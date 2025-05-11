import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, RefreshCw, Wallet } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type TransactionType = "buy" | "sell" | "transfer" | "swap" | "stake" | undefined

interface TransactionListProps {
  type?: TransactionType
}

export default function TransactionList({ type }: TransactionListProps) {
  // 模擬交易數據
  const transactions = [
    {
      id: "tx1",
      date: "2023-05-10",
      time: "14:32:45",
      type: "buy",
      asset: "ETH",
      assetName: "Ethereum",
      amount: "2.5",
      price: "3000",
      value: "7500",
      fee: "15",
      platform: "Binance",
      status: "completed",
      hash: "0x1234...5678",
      currency: "USD",
      exchangeRate: 31.5, // 兌換台幣匯率
    },
    {
      id: "tx2",
      date: "2023-05-08",
      time: "09:15:22",
      type: "sell",
      asset: "BTC",
      assetName: "Bitcoin",
      amount: "0.25",
      price: "50000",
      value: "12500",
      fee: "25",
      platform: "OKX",
      status: "completed",
      hash: "0xabcd...efgh",
      currency: "USD",
      exchangeRate: 31.5,
    },
    {
      id: "tx3",
      date: "2023-05-05",
      time: "18:45:10",
      type: "transfer",
      asset: "USDT",
      assetName: "Tether",
      amount: "5000",
      price: "1",
      value: "5000",
      fee: "10",
      platform: "Binance to Wallet",
      status: "completed",
      hash: "0x9876...5432",
      currency: "USD",
      exchangeRate: 31.5,
    },
    {
      id: "tx4",
      date: "2023-05-03",
      time: "11:22:33",
      type: "swap",
      asset: "ETH/USDT",
      assetName: "Ethereum/Tether",
      amount: "1.5 ETH → 4500 USDT",
      price: "-",
      value: "4500",
      fee: "12",
      platform: "Uniswap",
      status: "completed",
      hash: "0xdef0...1234",
      currency: "USD",
      exchangeRate: 31.5,
    },
    {
      id: "tx5",
      date: "2023-05-01",
      time: "08:30:15",
      type: "stake",
      asset: "SOL",
      assetName: "Solana",
      amount: "50",
      price: "95",
      value: "4750",
      fee: "0.5",
      platform: "Marinade Finance",
      status: "completed",
      hash: "0x5678...9abc",
      currency: "USD",
      exchangeRate: 31.5,
    },
    {
      id: "tx6",
      date: "2023-04-28",
      time: "16:20:45",
      type: "buy",
      asset: "2330",
      assetName: "台積電",
      amount: "100",
      price: "580",
      value: "58000",
      fee: "87",
      platform: "國泰證券",
      status: "completed",
      hash: "-",
      currency: "TWD",
      exchangeRate: 1,
    },
    {
      id: "tx7",
      date: "2023-04-25",
      time: "10:05:30",
      type: "sell",
      asset: "AAPL",
      assetName: "Apple Inc.",
      amount: "10",
      price: "175",
      value: "1750",
      fee: "8.75",
      platform: "國泰證券",
      status: "completed",
      hash: "-",
      currency: "USD",
      exchangeRate: 31.5,
    },
  ]

  // 根據類型過濾交易
  const filteredTransactions = type ? transactions.filter((tx) => tx.type === type) : transactions

  // 交易類型圖標映射
  const typeIcons = {
    buy: <ArrowDownLeft className="h-4 w-4 text-green-500" />,
    sell: <ArrowUpRight className="h-4 w-4 text-red-500" />,
    transfer: <ArrowLeftRight className="h-4 w-4 text-blue-500" />,
    swap: <RefreshCw className="h-4 w-4 text-purple-500" />,
    stake: <Wallet className="h-4 w-4 text-yellow-500" />,
  }

  // 交易類型標籤映射
  const typeBadges = {
    buy: <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">買入</Badge>,
    sell: <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">賣出</Badge>,
    transfer: <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">轉帳</Badge>,
    swap: <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">兌換</Badge>,
    stake: <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">質押</Badge>,
  }

  // 資產圖標映射
  const assetIcons: Record<string, string> = {
    ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
    "ETH/USDT": "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    "2330": "/placeholder.svg?height=32&width=32",
    AAPL: "/placeholder.svg?height=32&width=32",
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日期</TableHead>
            <TableHead>類型</TableHead>
            <TableHead>資產</TableHead>
            <TableHead className="text-right">數量</TableHead>
            <TableHead className="text-right">價格</TableHead>
            <TableHead className="text-right">價值</TableHead>
            <TableHead className="text-right">手續費</TableHead>
            <TableHead className="text-right">台幣價值</TableHead>
            <TableHead>平台</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                <div className="font-medium">{tx.date}</div>
                <div className="text-xs text-muted-foreground">{tx.time}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {typeIcons[tx.type as keyof typeof typeIcons]}
                  {typeBadges[tx.type as keyof typeof typeBadges]}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={assetIcons[tx.asset] || "/placeholder.svg"} alt={tx.asset} />
                    <AvatarFallback>{tx.asset.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{tx.asset}</div>
                    <div className="text-xs text-muted-foreground">{tx.assetName}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">{tx.amount}</TableCell>
              <TableCell className="text-right">{tx.price !== "-" ? `${tx.price} ${tx.currency}` : tx.price}</TableCell>
              <TableCell className="text-right font-medium">
                {tx.type === "buy" ? (
                  <span className="text-green-500">
                    +{tx.value} {tx.currency}
                  </span>
                ) : tx.type === "sell" ? (
                  <span className="text-red-500">
                    -{tx.value} {tx.currency}
                  </span>
                ) : (
                  `${tx.value} ${tx.currency}`
                )}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {tx.fee} {tx.currency}
              </TableCell>
              <TableCell className="text-right">
                {tx.currency === "TWD"
                  ? `NT$ ${Number.parseInt(tx.value).toLocaleString()}`
                  : `NT$ ${(Number.parseInt(tx.value) * tx.exchangeRate).toLocaleString()}`}
              </TableCell>
              <TableCell>
                <div className="text-sm">{tx.platform}</div>
                {tx.hash !== "-" && (
                  <div className="text-xs text-muted-foreground truncate max-w-[100px]">{tx.hash}</div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">查看詳情</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
