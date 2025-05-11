export type AssetType = 'stock_tw' | 'stock_us' | 'crypto' | 'cash' | 'defi' | 'wallet';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  symbol?: string;
  amount: number;
  cost: number;
  current_price: number;
  market_value: number;
  profit: number;
  profit_percentage: number;
  last_updated: string;
  notes?: string;
}

export type TransactionType = 'buy' | 'sell' | 'transfer';

export interface Transaction {
  id: string;
  asset_id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  date: string;
  notes?: string;
}

export interface Settings {
  currency: string;
  refresh_interval: number;
  display_options: {
    show_chart: boolean;
    default_view: string;
    theme: string;
  };
} 