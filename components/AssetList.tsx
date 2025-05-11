'use client';

import { useEffect, useState } from 'react';
import { Asset, Transaction } from '@/types';
import {
  fetchAssets,
  deleteAsset,
  updateAsset,
  fetchTransactions,
  addTransaction,
  deleteTransaction,
  fetchPriceHistory,
} from '@/lib/api';
import { AssetCard } from './AssetCard';
import { AssetAllocationChart } from './AssetAllocationChart';
import { useAssetPriceUpdater } from '@/hooks/useAssetPriceUpdater';

interface PriceHistoryItem {
  date: string;
  price: number;
  value: number;
}

export function AssetList() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
  const [priceHistory, setPriceHistory] = useState<Record<string, PriceHistoryItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    if (assets.length > 0) {
      loadTransactionsAndPriceHistory();
    }
  }, [assets]);

  // 使用自動更新價格的 hook
  useAssetPriceUpdater({
    assets,
    onUpdate: async (assetId, newPrice) => {
      const asset = assets.find(a => a.id === assetId);
      if (asset) {
        const updatedAsset = {
          ...asset,
          current_price: newPrice,
          market_value: newPrice * asset.amount,
          profit: (newPrice * asset.amount) - asset.cost,
          profit_percentage: ((newPrice * asset.amount) - asset.cost) / asset.cost * 100,
          last_updated: new Date().toISOString(),
        };
        await handleUpdate(updatedAsset);
      }
    },
  });

  async function loadAssets() {
    try {
      setLoading(true);
      const data = await fetchAssets();
      setAssets(data);
      setError(null);
    } catch (err) {
      setError('載入資產時發生錯誤');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadTransactionsAndPriceHistory() {
    try {
      const transactionPromises = assets.map(async (asset) => {
        const data = await fetchTransactions(asset.id);
        return [asset.id, data] as const;
      });

      const priceHistoryPromises = assets.map(async (asset) => {
        const data = await fetchPriceHistory(asset.id);
        return [asset.id, data] as const;
      });

      const transactionResults = await Promise.all(transactionPromises);
      const priceHistoryResults = await Promise.all(priceHistoryPromises);

      const transactionMap: Record<string, Transaction[]> = {};
      const priceHistoryMap: Record<string, PriceHistoryItem[]> = {};

      transactionResults.forEach(([id, data]) => {
        transactionMap[id] = data;
      });

      priceHistoryResults.forEach(([id, data]) => {
        priceHistoryMap[id] = data;
      });

      setTransactions(transactionMap);
      setPriceHistory(priceHistoryMap);
    } catch (error) {
      console.error('載入交易記錄和價格歷史時發生錯誤:', error);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAsset(id);
      setAssets(assets.filter(asset => asset.id !== id));
    } catch (error) {
      console.error('刪除資產失敗:', error);
      throw error;
    }
  };

  const handleUpdate = async (updatedAsset: Asset) => {
    try {
      await updateAsset(updatedAsset);
      setAssets(assets.map(asset => 
        asset.id === updatedAsset.id ? updatedAsset : asset
      ));
    } catch (error) {
      console.error('更新資產失敗:', error);
      throw error;
    }
  };

  const handleAddTransaction = async (assetId: string, transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await addTransaction(transaction);
      setTransactions(prev => ({
        ...prev,
        [assetId]: [...(prev[assetId] || []), newTransaction],
      }));
      // 重新載入資產以更新數據
      await loadAssets();
    } catch (error) {
      console.error('添加交易記錄失敗:', error);
      throw error;
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
      setTransactions(prev => {
        const newTransactions = { ...prev };
        for (const assetId in newTransactions) {
          newTransactions[assetId] = newTransactions[assetId].filter(
            t => t.id !== transactionId
          );
        }
        return newTransactions;
      });
      // 重新載入資產以更新數據
      await loadAssets();
    } catch (error) {
      console.error('刪除交易記錄失敗:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="text-center">載入中...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
        <button
          onClick={loadAssets}
          className="ml-2 text-blue-500 hover:underline"
        >
          重試
        </button>
      </div>
    );
  }

  if (assets.length === 0) {
    return <div className="text-center text-gray-500">尚無資產</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border p-4 bg-card">
        <h2 className="text-lg font-semibold mb-4">資產分配</h2>
        <AssetAllocationChart assets={assets} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            transactions={transactions[asset.id] || []}
            priceHistory={priceHistory[asset.id] || []}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onAddTransaction={(transaction) => handleAddTransaction(asset.id, transaction)}
            onDeleteTransaction={handleDeleteTransaction}
          />
        ))}
      </div>
    </div>
  );
} 