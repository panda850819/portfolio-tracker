'use client';

import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => Promise<void>;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日期</TableHead>
            <TableHead>類型</TableHead>
            <TableHead>數量</TableHead>
            <TableHead>價格</TableHead>
            <TableHead>總額</TableHead>
            <TableHead>備註</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.date).toLocaleDateString('zh-TW')}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{formatCurrency(transaction.price)}</TableCell>
              <TableCell>{formatCurrency(transaction.total)}</TableCell>
              <TableCell>{transaction.notes}</TableCell>
              <TableCell>
                {onDelete && (
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    刪除
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 