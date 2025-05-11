'use client';

import { useState } from 'react';
import { Asset, AssetType } from '@/types';
import { updateAsset } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditAssetDialogProps {
  asset: Asset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (asset: Asset) => Promise<void>;
}

export function EditAssetDialog({
  asset,
  open,
  onOpenChange,
  onUpdate,
}: EditAssetDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      setLoading(true);
      setError(null);

      const updatedAsset: Asset = {
        ...asset,
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

      await onUpdate(updatedAsset);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新資產時發生錯誤');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>編輯資產</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              資產名稱
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={asset.name}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              資產類型
            </label>
            <Select name="type" defaultValue={asset.type} required>
              <SelectTrigger>
                <SelectValue />
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
              defaultValue={asset.amount}
              required
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
              defaultValue={asset.cost}
              required
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
              defaultValue={asset.current_price}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              備註
            </label>
            <Input
              id="notes"
              name="notes"
              defaultValue={asset.notes}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? '更新中...' : '更新'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 