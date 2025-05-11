# Portfolio Tracker 技術設計文檔

## 1. 系統架構

### 1.1 整體架構
- 前後端分離架構
- RESTful API 設計
- 數據庫採用 PostgreSQL

### 1.2 技術棧
#### 前端
- Next.js 14 (React)
- TypeScript
- Tailwind CSS
- Chart.js (數據可視化)
- React Query (數據獲取和緩存)
- Lucide React (圖標庫)
- Shadcn/ui (UI 組件庫)

#### 後端
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma (ORM)

#### 開發工具
- ESLint
- Prettier
- Git

## 2. 數據庫設計

### 2.1 核心表結構

#### 資產表 (Assets)
```sql
CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  asset_type VARCHAR(50) NOT NULL, -- 'stock_tw', 'stock_us', 'crypto', 'cash'
  symbol VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  quantity DECIMAL(20,8) NOT NULL,
  average_price DECIMAL(20,8) NOT NULL,
  current_price DECIMAL(20,8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 交易記錄表 (Transactions)
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER REFERENCES assets(id),
  transaction_type VARCHAR(20) NOT NULL, -- 'buy', 'sell', 'transfer'
  quantity DECIMAL(20,8) NOT NULL,
  price DECIMAL(20,8) NOT NULL,
  transaction_date TIMESTAMP NOT NULL,
  platform VARCHAR(50), -- 交易平台
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 加密貨幣錢包表 (CryptoWallets)
```sql
CREATE TABLE crypto_wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  wallet_name VARCHAR(100) NOT NULL,
  blockchain VARCHAR(50) NOT NULL, -- 'BTC', 'ETH', 'SOL', 'SUI'
  address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 交易所賬戶表 (ExchangeAccounts)
```sql
CREATE TABLE exchange_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  exchange_name VARCHAR(50) NOT NULL, -- 'Binance', 'OKX', 'Gateio', etc.
  account_name VARCHAR(100) NOT NULL,
  api_key VARCHAR(255),
  api_secret VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. API 設計

### 3.1 資產管理 API

#### 獲取資產列表
```
GET /api/assets
Query Parameters:
- type: 資產類型
- page: 頁碼
- limit: 每頁數量
```

#### 添加資產
```
POST /api/assets
Body:
{
  "asset_type": string,
  "symbol": string,
  "name": string,
  "quantity": number,
  "average_price": number
}
```

#### 更新資產
```
PUT /api/assets/:id
Body:
{
  "quantity": number,
  "average_price": number
}
```

### 3.2 交易記錄 API

#### 獲取交易記錄
```
GET /api/transactions
Query Parameters:
- asset_id: 資產ID
- start_date: 開始日期
- end_date: 結束日期
```

#### 添加交易記錄
```
POST /api/transactions
Body:
{
  "asset_id": number,
  "transaction_type": string,
  "quantity": number,
  "price": number,
  "transaction_date": string,
  "platform": string,
  "notes": string
}
```

### 3.3 加密貨幣管理 API

#### 錢包管理
```
GET /api/crypto/wallets
POST /api/crypto/wallets
PUT /api/crypto/wallets/:id
DELETE /api/crypto/wallets/:id
```

#### 交易所賬戶管理
```
GET /api/crypto/exchanges
POST /api/crypto/exchanges
PUT /api/crypto/exchanges/:id
DELETE /api/crypto/exchanges/:id
```

## 4. 前端頁面設計

### 4.1 主要頁面
- 儀表板 (Dashboard)
  - 總資產概覽
  - 資產分配圖表
  - 收益趨勢圖

- 資產管理
  - 資產列表
  - 資產詳情
  - 添加/編輯資產

- 交易記錄
  - 交易歷史
  - 交易詳情
  - 添加交易

- 加密貨幣管理
  - 錢包管理
  - 交易所賬戶管理
  - 加密貨幣資產概覽

### 4.2 組件設計
- 資產卡片組件 (AssetCard)
  - 支持不同資產類型的顏色標示
  - 包含資產名稱、圖標、價值和變化率
  - 支持正負值的顏色區分

- 圖表組件
  - 資產分佈圖表 (AssetDistributionChart)
    - 展示各類資產的佔比
    - 互動式圖例
  - 資產成長圖表 (AssetGrowthChart)
    - 展示資產價值隨時間的變化
    - 支持時間區間選擇

- 資產列表組件
  - 股票資產列表 (StockAssetsList)
  - 加密貨幣資產列表 (CryptoAssetsList)
  - 錢包資產列表 (WalletAssetsList)
  - 現金資產列表 (CashAssetsList)
  - DeFi資產列表 (DefiAssetsList)

- 交易相關組件
  - 交易列表 (TransactionList)
  - 交易篩選器 (TransactionFilters)

- 導航組件
  - 主導航欄 (MainNav)
  - 移動端導航欄 (MobileNav)

- 設置組件
  - 貨幣設置 (CurrencySettings)
  - 主題切換 (ModeToggle)

- UI 基礎組件 (來自 shadcn/ui)
  - 按鈕 (Button)
  - 卡片 (Card)
  - 表單控件
  - 對話框
  - 下拉菜單

## 5. 安全性考慮

### 5.1 數據安全
- API 密鑰加密存儲
- 敏感數據加密
- 數據備份策略

### 5.2 訪問控制
- 用戶認證
- 權限管理
- API 訪問限制

## 6. 部署架構

### 6.1 開發環境
- 本地開發環境
- 開發服務器
- 測試數據庫

### 6.2 生產環境
- 前端部署 (Vercel)
- 後端部署 (AWS/DigitalOcean)
- 數據庫部署 (AWS RDS)

## 7. 監控和日誌

### 7.1 應用監控
- 性能監控
- 錯誤追蹤
- 用戶行為分析

### 7.2 日誌管理
- 訪問日誌
- 錯誤日誌
- 審計日誌

## 5. Google Apps Script 技術設計

### 5.1 數據庫設計
```typescript
// Assets 表結構
interface Asset {
  id: string;              // 唯一標識，自動生成
  name: string;            // 資產名稱
  type: AssetType;         // 資產類型（股票/加密貨幣/現金）
  amount: number;          // 持有數量
  cost: number;           // 總成本
  current_price: number;   // 當前價格
  last_updated: Date;      // 最後更新時間
  notes?: string;         // 備註（可選）
}

// Transactions 表結構
interface Transaction {
  id: string;              // 交易ID
  asset_id: string;        // 關聯資產ID
  type: TransactionType;   // 買入/賣出
  amount: number;          // 交易數量
  price: number;          // 交易價格
  date: Date;             // 交易日期
  notes?: string;         // 備註（可選）
}

// Settings 表結構
interface Settings {
  currency: string;        // 預設貨幣
  refresh_interval: number; // 價格更新間隔（分鐘）
  display_options: {       // 顯示選項
    show_chart: boolean;
    default_view: string;
    theme: string;
  };
}
```

### 5.2 API 端點設計
```typescript
// 資產相關 API
class AssetsAPI {
  // 獲取所有資產
  getAssets(): Asset[] {
    // 實現邏輯
  }
  
  // 添加新資產
  addAsset(data: Omit<Asset, 'id'>): Asset {
    // 實現邏輯
  }
  
  // 更新資產
  updateAsset(id: string, data: Partial<Asset>): Asset {
    // 實現邏輯
  }
  
  // 刪除資產
  deleteAsset(id: string): boolean {
    // 實現邏輯
  }
}

// 交易相關 API
class TransactionsAPI {
  // 獲取交易記錄
  getTransactions(filters?: {
    asset_id?: string;
    start_date?: Date;
    end_date?: Date;
  }): Transaction[] {
    // 實現邏輯
  }
  
  // 添加交易記錄
  addTransaction(data: Omit<Transaction, 'id'>): Transaction {
    // 實現邏輯
  }
}
```

### 5.3 數據同步機制
```typescript
class DataSyncService {
  // 更新資產價格
  async updatePrices() {
    // 實現邏輯
  }
  
  // 計算資產統計數據
  calculateStats() {
    // 實現邏輯
  }
  
  // 設置定時任務
  setupTriggers() {
    // 實現邏輯
  }
}
```

### 5.4 安全實現
```typescript
class SecurityService {
  // 驗證請求
  validateRequest(e: GoogleAppsScript.Events.DoGet | GoogleAppsScript.Events.DoPost) {
    // 實現邏輯
  }
  
  // 檢查權限
  checkPermissions(user: string, action: string) {
    // 實現邏輯
  }
  
  // 加密敏感數據
  encryptData(data: any) {
    // 實現邏輯
  }
}
```

### 5.5 錯誤處理
```typescript
class ErrorHandler {
  // 處理API錯誤
  handleApiError(error: Error) {
    // 實現邏輯
  }
  
  // 記錄錯誤日誌
  logError(error: Error) {
    // 實現邏輯
  }
}
```

### 5.6 工具函數
```typescript
class Utils {
  // 生成唯一ID
  generateId(): string {
    // 實現邏輯
  }
  
  // 格式化日期
  formatDate(date: Date): string {
    // 實現邏輯
  }
  
  // 數據驗證
  validateData(data: any, schema: any): boolean {
    // 實現邏輯
  }
}
```

### 5.7 部署流程
1. 創建新的 Google Spreadsheet
2. 設置工作表結構
3. 添加 Apps Script 代碼
4. 配置 OAuth 認證
5. 部署為 Web App
6. 設置觸發器
7. 測試 API 端點 