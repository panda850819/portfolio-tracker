# Portfolio Tracker

一個使用 Next.js + Google Apps Script 打造的投資組合追蹤系統，前端部署於 Zeabur，後端使用 Google Sheets 作為資料庫。

當前版本：v1.1.0 ([查看更新日志](CHANGELOG.md))

## 技術架構

- 前端：Next.js 14 + TypeScript + Tailwind CSS + Shadcn/ui
- 後端：Google Apps Script
- 資料庫：Google Sheets
- 部署：Zeabur

## 本地開發

### 前端開發
1. 安裝依賴
```bash
npm install --legacy-peer-deps
```

2. 啟動開發服務器
```bash
npm run dev
```

3. 訪問 http://localhost:3000 查看應用

### Google Sheets 設置

1. 創建新的 Google Spreadsheet，命名為 "Portfolio Tracker Database"
2. 建立以下工作表：
   - Assets（資產表）
   - Transactions（交易記錄）
   - Settings（設置）
   - PriceHistory（價格歷史）

### Google Apps Script 設置

1. 在 Google Spreadsheet 中打開 Apps Script
   - 工具 > Script 編輯器

2. 創建以下 API 端點：
   - getAssets：獲取所有資產
   - addAsset：添加新資產
   - updateAsset：更新資產
   - deleteAsset：刪除資產
   - getTransactions：獲取交易記錄
   - addTransaction：添加交易記錄

3. 部署 Web App
   - 點擊「部署」>「新增部署」
   - 選擇「網頁應用程式」
   - 設置訪問權限
   - 保存生成的 API URL

## Zeabur 部署

1. 在 Zeabur 擴展中：
   - 點擊 "Deploy to Zeabur"
   - 選擇專案倉庫
   - 選擇部署分支

2. 環境變量設置：
   - NEXT_PUBLIC_GOOGLE_SCRIPT_URL：Google Apps Script Web App URL
   - NEXT_PUBLIC_SHEET_ID：Google Spreadsheet ID

## 資料庫結構

### Assets 表
- id: 資產唯一標識
- name: 資產名稱
- type: 資產類型（股票/加密貨幣/現金）
- amount: 數量
- cost: 成本
- current_price: 當前價格
- last_updated: 最後更新時間

### Transactions 表
- id: 交易唯一標識
- asset_id: 關聯資產ID
- type: 交易類型（買入/賣出）
- amount: 數量
- price: 價格
- date: 交易日期
- notes: 備註

### Settings 表
- currency: 預設貨幣
- refresh_interval: 價格更新間隔
- display_options: 顯示選項

## API 文檔

### 前端 API 路由
- GET /api/assets：獲取所有資產
- POST /api/assets：創建新資產
- PUT /api/assets/{id}：更新資產
- DELETE /api/assets/{id}：刪除資產
- GET /api/transactions：獲取交易記錄
- POST /api/transactions：添加交易記錄

### Google Apps Script API
- doGet(e)：處理 GET 請求
- doPost(e)：處理 POST 請求
- getAssets()：獲取資產列表
- addAsset(data)：添加資產
- updateAsset(id, data)：更新資產
- deleteAsset(id)：刪除資產
- getTransactions()：獲取交易記錄
- addTransaction(data)：添加交易記錄
