'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  fetchAssets,
  addAsset,
  updateAsset,
  deleteAsset,
  fetchTransactions,
  addTransaction,
  deleteTransaction,
  fetchPriceHistory,
} from '@/lib/api';
import { Asset, Transaction } from '@/types';

export function ApiTest() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const runTests = async () => {
    try {
      setLoading(true);
      addLog('開始測試...');

      // 測試 fetchAssets
      addLog('測試 fetchAssets');
      const assets = await fetchAssets();
      addLog(`獲取資產列表: ${assets.length} 個資產`);

      // 測試 addAsset
      addLog('測試 addAsset');
      const newAsset: Omit<Asset, 'id'> = {
        name: '測試資產',
        type: '股票',
        symbol: 'TEST',
        amount: 100,
        cost: 1000,
        current_price: 15,
        market_value: 1500,
        profit: 500,
        profit_percentage: 50,
        last_updated: new Date().toISOString(),
        notes: '測試用'
      };
      const addedAsset = await addAsset(newAsset);
      addLog(`添加資產成功: ${addedAsset.id}`);

      // 測試 updateAsset
      addLog('測試 updateAsset');
      const updatedAsset = await updateAsset({
        ...addedAsset,
        amount: 150,
      });
      addLog(`更新資產成功: ${updatedAsset.id}`);

      // 測試 fetchTransactions
      addLog('測試 fetchTransactions');
      const transactions = await fetchTransactions(addedAsset.id);
      addLog(`獲取交易記錄: ${transactions.length} 條記錄`);

      // 測試 addTransaction
      addLog('測試 addTransaction');
      const newTransaction: Omit<Transaction, 'id'> = {
        asset_id: addedAsset.id,
        type: '買入',
        amount: 50,
        price: 10,
        total: 500,
        date: new Date().toISOString(),
        notes: '測試交易'
      };
      const addedTransaction = await addTransaction(newTransaction);
      addLog(`添加交易記錄成功: ${addedTransaction.id}`);

      // 測試 fetchPriceHistory
      addLog('測試 fetchPriceHistory');
      const priceHistory = await fetchPriceHistory(addedAsset.id);
      addLog(`獲取價格歷史: ${priceHistory.length} 條記錄`);

      // 清理測試數據
      addLog('清理測試數據');
      await deleteTransaction(addedTransaction.id);
      addLog('刪除交易記錄成功');
      await deleteAsset(addedAsset.id);
      addLog('刪除資產成功');

      addLog('測試完成！');
    } catch (error) {
      addLog(`錯誤: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-4">
        <Button onClick={runTests} disabled={loading}>
          {loading ? '測試中...' : '運行測試'}
        </Button>
        <Button onClick={clearLogs} variant="outline">
          清除日誌
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-black text-white font-mono text-sm">
        <div className="space-y-1">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
} 