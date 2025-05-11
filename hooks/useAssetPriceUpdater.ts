import { useEffect, useRef } from 'react';
import { Asset } from '@/types';

interface UseAssetPriceUpdaterProps {
  assets: Asset[];
  onUpdate: (assetId: string, newPrice: number) => Promise<void>;
  interval?: number; // 更新間隔（毫秒）
}

export function useAssetPriceUpdater({
  assets,
  onUpdate,
  interval = 300000, // 默認5分鐘更新一次
}: UseAssetPriceUpdaterProps) {
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function updatePrices() {
      try {
        for (const asset of assets) {
          if (asset.type === 'cash') continue; // 跳過現金資產

          // 根據資產類型獲取最新價格
          let newPrice: number | null = null;

          if ((asset.type === 'stock_tw' || asset.type === 'stock_us') && asset.symbol) {
            // 使用 Yahoo Finance API 獲取股票價格
            const symbol = asset.type === 'stock_tw' 
              ? `${asset.symbol}.TW`  // 台股加上 .TW 後綴
              : asset.symbol;         // 美股直接使用原始代碼
              
            try {
              const response = await fetch(
                `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
              );
              const data = await response.json();
              if (data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
                newPrice = data.chart.result[0].meta.regularMarketPrice;
              }
            } catch (error) {
              console.error(`更新${asset.name}價格時發生錯誤:`, error);
            }
          } else if (asset.type === 'crypto' && asset.symbol) {
            // 使用 CoinGecko API 獲取加密貨幣價格
            try {
              const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${asset.symbol.toLowerCase()}&vs_currencies=usd`
              );
              const data = await response.json();
              if (data?.[asset.symbol.toLowerCase()]?.usd) {
                newPrice = data[asset.symbol.toLowerCase()].usd;
              }
            } catch (error) {
              console.error(`更新${asset.name}價格時發生錯誤:`, error);
            }
          }

          // 如果獲取到新價格，更新資產
          if (newPrice !== null && newPrice !== asset.current_price) {
            try {
              await onUpdate(asset.id, newPrice);
            } catch (error) {
              console.error(`更新${asset.name}資產數據時發生錯誤:`, error);
            }
          }
        }
      } catch (error) {
        console.error('更新資產價格時發生錯誤:', error);
      }
    }

    // 立即執行一次更新
    updatePrices();

    // 設置定時更新
    updateTimerRef.current = setInterval(updatePrices, interval);

    // 清理函數
    return () => {
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
        updateTimerRef.current = null;
      }
    };
  }, [assets, onUpdate, interval]);
} 