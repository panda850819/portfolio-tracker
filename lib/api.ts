import { Asset, Transaction } from '@/types';
import { mockAssets } from './mock';

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export async function fetchAssets(): Promise<Asset[]> {
  if (IS_DEVELOPMENT) {
    // 在開發環境中返回模擬數據
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAssets);
      }, 500); // 模擬網絡延遲
    });
  }

  const response = await fetch(`${SCRIPT_URL}?method=getAssets`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
}

export async function addAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
  if (IS_DEVELOPMENT) {
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

  const response = await fetch(`${SCRIPT_URL}?method=addAsset`, {
    method: 'POST',
    body: JSON.stringify(asset),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
}

export async function updateAsset(id: string, asset: Partial<Asset>): Promise<Asset> {
  if (IS_DEVELOPMENT) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockAssets.findIndex(a => a.id === id);
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

  const response = await fetch(`${SCRIPT_URL}?method=updateAsset&id=${id}`, {
    method: 'POST',
    body: JSON.stringify(asset),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
}

export async function deleteAsset(id: string): Promise<void> {
  if (IS_DEVELOPMENT) {
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

  const response = await fetch(`${SCRIPT_URL}?method=deleteAsset&id=${id}`, {
    method: 'POST',
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
}

export async function fetchTransactions(): Promise<Transaction[]> {
  if (IS_DEVELOPMENT) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]); // 暫時返回空數組
      }, 500);
    });
  }

  const response = await fetch(`${SCRIPT_URL}?method=getTransactions`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  const response = await fetch(`${SCRIPT_URL}?method=addTransaction`, {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
} 