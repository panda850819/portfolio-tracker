import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CurrencySettings from "@/components/currency-settings"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">系統設定</h1>
        </div>

        <Tabs defaultValue="currency" className="space-y-4">
          <TabsList>
            <TabsTrigger value="currency">匯率設定</TabsTrigger>
            <TabsTrigger value="display">顯示設定</TabsTrigger>
            <TabsTrigger value="notifications">通知設定</TabsTrigger>
            <TabsTrigger value="account">帳戶設定</TabsTrigger>
          </TabsList>

          <TabsContent value="currency" className="space-y-4">
            <CurrencySettings />
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>顯示設定</CardTitle>
                <CardDescription>自訂應用程式的顯示方式</CardDescription>
              </CardHeader>
              <CardContent>
                <p>顯示設定內容將在此處顯示</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
                <CardDescription>設定系統通知的方式和頻率</CardDescription>
              </CardHeader>
              <CardContent>
                <p>通知設定內容將在此處顯示</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>帳戶設定</CardTitle>
                <CardDescription>管理您的帳戶資訊和偏好設定</CardDescription>
              </CardHeader>
              <CardContent>
                <p>帳戶設定內容將在此處顯示</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
