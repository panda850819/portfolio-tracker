'use client';

import { useState } from 'react';
import { Asset, Transaction, TransactionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface AddTransactionFormProps {
  asset: Asset;
  onAdd: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
}

export function AddTransactionForm({ asset, onAdd }: AddTransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      setLoading(true);
      const type = formData.get('type') as TransactionType;
      const amount = Number(formData.get('amount'));
      const price = Number(formData.get('price'));
      const total = amount * price;
      const notes = formData.get('notes') as string;

      await onAdd({
        asset_id: asset.id,
        type,
        amount,
        price,
        total,
        date: new Date().toISOString(),
        notes: notes || undefined,
      });

      event.currentTarget.reset();
      toast({
        title: '成功',
        description: '交易記錄已添加',
      });
    } catch (error) {
      console.error('添加交易記錄失敗:', error);
      toast({
        title: '錯誤',
        description: '添加交易記錄失敗',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          交易類型
        </label>
        <Select name="type" required>
          <SelectTrigger>
            <SelectValue placeholder="選擇交易類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="買入">買入</SelectItem>
            <SelectItem value="賣出">賣出</SelectItem>
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
          min="0"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="price" className="text-sm font-medium">
          價格
        </label>
        <Input
          id="price"
          name="price"
          type="number"
          step="any"
          required
          min="0"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          備註
        </label>
        <Input
          id="notes"
          name="notes"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? '添加中...' : '添加交易記錄'}
      </Button>
    </form>
  );
} 