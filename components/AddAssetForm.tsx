'use client';

import { useState } from 'react';
import { Asset, AssetType } from '@/types';
import { addAsset } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateId } from '@/lib/utils';

interface AddAssetFormProps {
  onSuccess: () => void;
}

export function AddAssetForm({ onSuccess }: AddAssetFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      setLoading(true);
      setError(null);

      const newAsset: Omit<Asset, 'id'> = {
        name: formData.get('name') as string,
        type: formData.get('type') as AssetType,
        amount: Number(formData.get('amount')),
        cost: Number(formData.get('cost')),
        current_price: Number(formData.get('current_price')),
        market_value: Number(formData.get('amount')) * Number(formData.get('current_price')),
        profit: (Number(formData.get('current_price')) * Number(formData.get('amount'))) - Number(formData.get('cost')),
        profit_percentage: ((Number(formData.get('current_price')) * Number(formData.get('amount'))) - Number(formData.get('cost'))) / Number(formData.get('cost')) * 100,
        last_updated: new Date().toISOString(),
        notes: formData.get('notes') as string || undefined
      };

      await addAsset(newAsset);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : '新增資產時發生錯誤');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          資產名稱
        </label>
        <Input
          id="name"
          name="name"
          required
          placeholder="請輸入資產名稱"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          資產類型
        </label>
        <Select name="type" required>
          <SelectTrigger>
            <SelectValue placeholder="選擇資產類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="股票">股票</SelectItem>
            <SelectItem value="加密貨幣">加密貨幣</SelectItem>
            <SelectItem value="現金">現金</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          數量
        </label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="any"
          required
          placeholder="請輸入數量"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="cost" className="text-sm font-medium">
          成本
        </label>
        <Input
          id="cost"
          name="cost"
          type="number"
          step="any"
          required
          placeholder="請輸入成本"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="current_price" className="text-sm font-medium">
          當前價格
        </label>
        <Input
          id="current_price"
          name="current_price"
          type="number"
          step="any"
          required
          placeholder="請輸入當前價格"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          備註
        </label>
        <Input
          id="notes"
          name="notes"
          placeholder="選填"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? '處理中...' : '新增'}
        </Button>
      </div>
    </form>
  );
} 