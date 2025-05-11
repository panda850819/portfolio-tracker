import { AssetList } from '@/components/AssetList';
import { AddAssetButton } from '@/components/AddAssetButton';
import { ApiTest } from '@/components/ApiTest';

export default function HomePage() {
  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-8">投資組合追蹤</h1>
        <AddAssetButton />
      </div>
      
      {/* 開發環境中顯示 API 測試組件 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">API 測試</h2>
          <ApiTest />
        </div>
      )}
      
      <AssetList />
    </main>
  );
}
