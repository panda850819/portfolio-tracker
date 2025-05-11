import type { ReactNode } from "react"

interface AssetCardProps {
  name: string
  icon: ReactNode
  value: string
  change: string
  positive: boolean
  color: string
}

export default function AssetCard({ name, icon, value, change, positive, color }: AssetCardProps) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    indigo: "bg-indigo-100 text-indigo-700",
    yellow: "bg-yellow-100 text-yellow-700",
  }

  const bgColor = colorMap[color] || "bg-gray-100 text-gray-700"

  return (
    <div className="flex items-center space-x-4">
      <div className={`rounded-full p-2 ${bgColor}`}>{icon}</div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{name}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
      <div className={`text-sm ${positive ? "text-green-500" : "text-red-500"}`}>{change}</div>
    </div>
  )
}
