import { Asset, Transaction } from '@/types';
import { mockAssets } from './mock';

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// 添加調試日誌
console.log('Environment:', {
  SCRIPT_URL,
  USE_MOCK_DATA,
  NODE_ENV: process.env.NODE_ENV
});

// Mock 數據
const mockTransactions: Transaction[] = [];
const mockPriceHistory: Array<{ date: string; price: number; value: number }> = [];

export async function fetchAssets(): Promise<Asset[]> {
  if (USE_MOCK_DATA) {
    // 使用模擬數據
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAssets);
      }, 500); // 模擬網絡延遲
    });
  }

  const response = await fetch(`${SCRIPT_URL}?action=getAssets`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
}

export async function addAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAsset = {
          ...asset,
          id: Math.random().toString(36).substr(2, 9),
          last_updated: new Date().toISOString()
        };
        mockAssets.push(newAsset);
        resolve(newAsset);
      }, 500);
    });
  }

  const response = await fetch(SCRIPT_URL!, {
    method: 'POST',
    body: JSON.stringify({
      action: 'addAsset',
      ...asset,
    }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
}

export async function updateAsset(asset: Asset): Promise<Asset> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockAssets.findIndex(a => a.id === asset.id);
        if (index === -1) {
          throw new Error('Asset not found');
        }
        const updatedAsset = {
          ...mockAssets[index],
          ...asset,
          last_updated: new Date().toISOString()
        };
        mockAssets[index] = updatedAsset;
        resolve(updatedAsset);
      }, 500);
    });
  }

  const response = await fetch(SCRIPT_URL!, {
    method: 'POST',
    body: JSON.stringify({
      action: 'updateAsset',
      ...asset,
    }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
}

export async function deleteAsset(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockAssets.findIndex(a => a.id === id);
        if (index === -1) {
          throw new Error('Asset not found');
        }
        mockAssets.splice(index, 1);
        resolve();
      }, 500);
    });
  }

  const response = await fetch(SCRIPT_URL!, {
    method: 'POST',
    body: JSON.stringify({
      action: 'deleteAsset',
      id,
    }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
}

export async function fetchTransactions(assetId: string): Promise<Transaction[]> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTransactions.filter(t => t.asset_id === assetId));
      }, 500);
    });
  }

  const response = await fetch(`${SCRIPT_URL}?action=getTransactions&assetId=${assetId}`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransaction = {
          ...transaction,
          id: Math.random().toString(36).substr(2, 9),
          date: transaction.date || new Date().toISOString(),
        };
        mockTransactions.push(newTransaction);
        resolve(newTransaction);
      }, 500);
    });
  }

  const response = await fetch(SCRIPT_URL!, {
    method: 'POST',
    body: JSON.stringify({
      action: 'addTransaction',
      ...transaction,
    }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockTransactions.findIndex(t => t.id === id);
        if (index === -1) {
          throw new Error('Transaction not found');
        }
        mockTransactions.splice(index, 1);
        resolve();
      }, 500);
    });
  }

  const response = await fetch(SCRIPT_URL!, {
    method: 'POST',
    body: JSON.stringify({
      action: 'deleteTransaction',
      id,
    }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
}

export async function fetchPriceHistory(
  assetId: string
): Promise<Array<{ date: string; price: number; value: number }>> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPriceHistory);
      }, 500);
    });
  }

  const response = await fetch(`${SCRIPT_URL}?action=getPriceHistory&assetId=${assetId}`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
} 