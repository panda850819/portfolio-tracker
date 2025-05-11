'use client';

import { Asset, Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { EditAssetDialog } from './EditAssetDialog';
import { AddTransactionForm } from './AddTransactionForm';
import { TransactionList } from './TransactionList';
import { AssetValueChart } from './AssetValueChart';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AssetCardProps {
  asset: Asset;
  transactions: Transaction[];
  priceHistory: Array<{ date: string; price: number; value: number }>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (asset: Asset) => Promise<void>;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
}

export function AssetCard({
  asset,
  transactions,
  priceHistory,
  onDelete,
  onUpdate,
  onAddTransaction,
  onDeleteTransaction,
}: AssetCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete(asset.id);
    } catch (error) {
      console.error('刪除資產失敗:', error);
    } finally {
      setIsLoading(false);
      setIsDeleteOpen(false);
    }
  };

  const profitColor = asset.profit >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{asset.name}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAddTransactionOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">類型</span>
                <span>{asset.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">數量</span>
                <span>{asset.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">成本</span>
                <span>{formatCurrency(asset.cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">當前價格</span>
                <span>{formatCurrency(asset.current_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">市值</span>
                <span>{formatCurrency(asset.market_value)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">損益</span>
                <span className={profitColor}>
                  {formatCurrency(asset.profit || 0)} ({(asset.profit_percentage || 0).toFixed(2)}%)
                </span>
              </div>
              {asset.notes && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">備註</span>
                  <span className="text-sm">{asset.notes}</span>
                </div>
              )}
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="chart">
                <AccordionTrigger>價格走勢</AccordionTrigger>
                <AccordionContent>
                  <AssetValueChart asset={asset} priceHistory={priceHistory} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="transactions">
                <AccordionTrigger>交易記錄</AccordionTrigger>
                <AccordionContent>
                  <TransactionList
                    transactions={transactions}
                    onDelete={onDeleteTransaction}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>

      <EditAssetDialog
        asset={asset}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdate={onUpdate}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除</AlertDialogTitle>
            <AlertDialogDescription>
              確定要刪除「{asset.name}」嗎？此操作無法復原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? '刪除中...' : '刪除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加交易記錄</DialogTitle>
          </DialogHeader>
          <AddTransactionForm
            asset={asset}
            onAdd={async (transaction) => {
              await onAddTransaction(transaction);
              setIsAddTransactionOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 