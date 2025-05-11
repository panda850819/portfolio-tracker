// 獲取環境變量
const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
const ASSETS_SHEET_NAME = 'Assets';
const TRANSACTIONS_SHEET_NAME = 'Transactions';
const PRICE_HISTORY_SHEET_NAME = 'PriceHistory';

// 定義表頭
const ASSET_HEADERS = [
  'id',
  'name',
  'type',
  'symbol',
  'amount',
  'cost',
  'current_price',
  'market_value',
  'profit',
  'profit_percentage',
  'last_updated',
  'notes'
];

const TRANSACTION_HEADERS = [
  'id',
  'asset_id',
  'type',
  'amount',
  'price',
  'total',
  'date',
  'notes'
];

const PRICE_HISTORY_HEADERS = [
  'asset_id',
  'date',
  'price',
  'value'
];

// 設置跨域訪問
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const response = {
    success: false,
    data: null,
    error: null
  };

  try {
    const action = e.parameter.action || (e.postData && JSON.parse(e.postData.contents).action);
    let result;

    switch (action) {
      case 'getAssets':
        result = getAssets();
        break;
      case 'addAsset':
        result = addAsset(JSON.parse(e.postData.contents));
        break;
      case 'updateAsset':
        result = updateAsset(JSON.parse(e.postData.contents));
        break;
      case 'deleteAsset':
        result = deleteAsset(JSON.parse(e.postData.contents).id);
        break;
      case 'getTransactions':
        const assetId = e.parameter.assetId;
        result = getTransactions(assetId);
        break;
      case 'addTransaction':
        result = addTransaction(JSON.parse(e.postData.contents));
        break;
      case 'deleteTransaction':
        result = deleteTransaction(JSON.parse(e.postData.contents).id);
        break;
      case 'getPriceHistory':
        result = getPriceHistory(e.parameter.assetId);
        break;
      default:
        throw new Error('Invalid action');
    }

    response.success = true;
    response.data = result;
  } catch (error) {
    response.error = error.message;
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// 資產相關函數
function getAssets() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ASSETS_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // 驗證表頭
  const missingHeaders = ASSET_HEADERS.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
  }
  
  return data.slice(1).map(row => {
    const asset = {};
    headers.forEach((header, index) => {
      // 數值字段的類型轉換
      if (['amount', 'cost', 'current_price', 'market_value', 'profit', 'profit_percentage'].includes(header)) {
        asset[header] = Number(row[index]) || 0;
      } else {
        asset[header] = row[index] || '';
      }
    });
    
    // 確保所有必需字段都有值
    if (!asset.id) {
      asset.id = Utilities.getUuid();
    }
    if (!asset.last_updated) {
      asset.last_updated = new Date().toISOString();
    }
    
    // 重新計算衍生字段
    asset.market_value = (asset.amount || 0) * (asset.current_price || 0);
    asset.profit = asset.market_value - (asset.cost || 0);
    asset.profit_percentage = asset.cost > 0 ? (asset.profit / asset.cost * 100) : 0;
    
    return asset;
  });
}

function addAsset(asset) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ASSETS_SHEET_NAME);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // 生成新的 ID
  const newId = Utilities.getUuid();
  
  // 創建完整的資產對象
  const newAsset = {
    ...asset,
    id: newId,
    last_updated: new Date().toISOString()
  };
  
  // 確保數值字段為數字類型
  ['amount', 'cost', 'current_price', 'market_value', 'profit', 'profit_percentage'].forEach(field => {
    if (newAsset[field] !== undefined) {
      newAsset[field] = Number(newAsset[field]) || 0;
    } else {
      newAsset[field] = 0;
    }
  });
  
  // 計算衍生字段
  newAsset.market_value = (newAsset.amount || 0) * (newAsset.current_price || 0);
  newAsset.profit = newAsset.market_value - (newAsset.cost || 0);
  newAsset.profit_percentage = newAsset.cost > 0 ? (newAsset.profit / newAsset.cost * 100) : 0;
  
  // 確保所有必需的字段都存在
  const row = headers.map(header => {
    const value = newAsset[header];
    // 對於數值字段，如果是 undefined 或 null，返回 0
    if (['amount', 'cost', 'current_price', 'market_value', 'profit', 'profit_percentage'].includes(header)) {
      return value || 0;
    }
    // 對於其他字段，如果是 undefined 或 null，返回空字符串
    return value || '';
  });
  
  // 添加新行
  sheet.appendRow(row);
  
  // 返回完整的資產對象
  return newAsset;
}

function updateAsset(asset) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ASSETS_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rowIndex = data.findIndex(row => row[headers.indexOf('id')] === asset.id);
  
  if (rowIndex === -1) {
    throw new Error('Asset not found');
  }
  
  // 確保數值字段為數字類型
  ['amount', 'cost', 'current_price', 'market_value', 'profit', 'profit_percentage'].forEach(field => {
    if (asset[field] !== undefined) {
      asset[field] = Number(asset[field]) || 0;
    }
  });
  
  // 計算衍生字段
  asset.market_value = (asset.amount || 0) * (asset.current_price || 0);
  asset.profit = asset.market_value - (asset.cost || 0);
  asset.profit_percentage = asset.cost > 0 ? (asset.profit / asset.cost * 100) : 0;
  
  asset.last_updated = new Date().toISOString();
  const row = headers.map(header => asset[header] || '');
  sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([row]);
  return asset;
}

function deleteAsset(id) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ASSETS_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rowIndex = data.findIndex(row => row[headers.indexOf('id')] === id);
  
  if (rowIndex === -1) {
    throw new Error('Asset not found');
  }
  
  sheet.deleteRow(rowIndex + 1);
}

// 交易記錄相關函數
function getTransactions(assetId) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TRANSACTIONS_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // 驗證表頭
  const missingHeaders = TRANSACTION_HEADERS.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
  }
  
  return data.slice(1)
    .filter(row => !assetId || row[headers.indexOf('asset_id')] === assetId)
    .map(row => {
      const transaction = {};
      headers.forEach((header, index) => {
        // 數值字段的類型轉換
        if (['amount', 'price', 'total'].includes(header)) {
          transaction[header] = Number(row[index]) || 0;
        } else {
          transaction[header] = row[index] || '';
        }
      });
      return transaction;
    });
}

function addTransaction(transaction) {
  Logger.log('開始添加交易記錄:', JSON.stringify(transaction));
  
  // 先檢查資產是否存在
  const assetsSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ASSETS_SHEET_NAME);
  const assetsData = assetsSheet.getDataRange().getValues();
  const assetsHeaders = assetsData[0];
  const assetIdIndex = assetsHeaders.indexOf('id');
  
  Logger.log('查找資產 ID:', transaction.asset_id);
  Logger.log('資產表頭:', assetsHeaders);
  
  // 檢查所有資產的 ID
  const allAssetIds = assetsData.slice(1).map(row => row[assetIdIndex]);
  Logger.log('所有資產 ID:', allAssetIds);
  
  const assetRowIndex = assetsData.findIndex(row => row[assetIdIndex] === transaction.asset_id);
  
  if (assetRowIndex === -1) {
    const error = `Asset not found with ID: ${transaction.asset_id}`;
    Logger.log('錯誤:', error);
    throw new Error(error);
  }
  
  Logger.log('找到資產，行索引:', assetRowIndex);
  
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TRANSACTIONS_SHEET_NAME);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // 驗證表頭
  const missingHeaders = TRANSACTION_HEADERS.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
  }
  
  // 生成新的交易 ID
  const newId = Utilities.getUuid();
  
  // 創建完整的交易對象
  const newTransaction = {
    ...transaction,
    id: newId,
    date: transaction.date || new Date().toISOString()
  };
  
  // 確保數值字段為數字類型
  ['amount', 'price', 'total'].forEach(field => {
    if (newTransaction[field] !== undefined) {
      newTransaction[field] = Number(newTransaction[field]) || 0;
    } else {
      newTransaction[field] = 0;
    }
  });
  
  // 驗證交易類型
  if (!['買入', '賣出'].includes(newTransaction.type)) {
    throw new Error('Invalid transaction type. Must be either "買入" or "賣出"');
  }
  
  Logger.log('準備添加的交易記錄:', JSON.stringify(newTransaction));
  
  // 確保所有必需的字段都存在
  const row = headers.map(header => {
    const value = newTransaction[header];
    // 對於數值字段，如果是 undefined 或 null，返回 0
    if (['amount', 'price', 'total'].includes(header)) {
      return value || 0;
    }
    // 對於其他字段，如果是 undefined 或 null，返回空字符串
    return value || '';
  });
  
  // 添加新行
  sheet.appendRow(row);
  
  Logger.log('交易記錄已添加，開始更新資產數據');
  
  // 更新資產的相關數據
  try {
    updateAssetAfterTransaction(newTransaction);
    Logger.log('資產數據已更新');
  } catch (error) {
    Logger.log('更新資產數據時出錯:', error);
    // 刪除剛才添加的交易記錄
    const lastRow = sheet.getLastRow();
    sheet.deleteRow(lastRow);
    throw error;
  }
  
  // 返回完整的交易對象
  return newTransaction;
}

function deleteTransaction(id) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TRANSACTIONS_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rowIndex = data.findIndex(row => row[headers.indexOf('id')] === id);
  
  if (rowIndex === -1) {
    throw new Error('Transaction not found');
  }
  
  const transaction = {};
  headers.forEach((header, index) => {
    transaction[header] = data[rowIndex][index];
  });
  
  sheet.deleteRow(rowIndex + 1);
  
  // 更新資產的相關數據
  updateAssetAfterTransactionDeletion(transaction);
}

// 價格歷史相關函數
function getPriceHistory(assetId) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(PRICE_HISTORY_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1)
    .filter(row => row[headers.indexOf('asset_id')] === assetId)
    .map(row => ({
      date: row[headers.indexOf('date')],
      price: row[headers.indexOf('price')],
      value: row[headers.indexOf('value')]
    }));
}

// 輔助函數
function updateAssetAfterTransaction(transaction) {
  Logger.log('開始更新資產數據:', JSON.stringify(transaction));
  
  const assetsSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ASSETS_SHEET_NAME);
  const data = assetsSheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('id');
  
  Logger.log('查找資產 ID:', transaction.asset_id);
  const rowIndex = data.findIndex(row => row[idIndex] === transaction.asset_id);
  
  if (rowIndex === -1) {
    const error = `Asset not found with ID: ${transaction.asset_id}`;
    Logger.log('錯誤:', error);
    throw new Error(error);
  }
  
  Logger.log('找到資產，行索引:', rowIndex);
  
  // 創建資產對象
  const asset = {};
  headers.forEach((header, index) => {
    // 數值字段的類型轉換
    if (['amount', 'cost', 'current_price', 'market_value', 'profit', 'profit_percentage'].includes(header)) {
      asset[header] = Number(data[rowIndex][index]) || 0;
    } else {
      asset[header] = data[rowIndex][index] || '';
    }
  });
  
  Logger.log('當前資產數據:', JSON.stringify(asset));
  Logger.log('交易類型:', transaction.type);
  Logger.log('交易數量:', transaction.amount);
  Logger.log('交易總額:', transaction.total);
  
  // 更新資產數據
  if (transaction.type === '買入') {
    asset.amount = Number(asset.amount) + Number(transaction.amount);
    asset.cost = Number(asset.cost) + Number(transaction.total);
  } else if (transaction.type === '賣出') {
    if (Number(asset.amount) < Number(transaction.amount)) {
      const error = '賣出數量不能大於持有數量';
      Logger.log('錯誤:', error);
      throw new Error(error);
    }
    asset.amount = Number(asset.amount) - Number(transaction.amount);
    // 按比例減少成本
    const sellRatio = Number(transaction.amount) / (Number(asset.amount) + Number(transaction.amount));
    asset.cost = Number(asset.cost) * (1 - sellRatio);
  }
  
  // 更新衍生數據
  asset.market_value = Number(asset.amount) * Number(asset.current_price);
  asset.profit = asset.market_value - asset.cost;
  asset.profit_percentage = asset.cost > 0 ? (asset.profit / asset.cost * 100) : 0;
  asset.last_updated = new Date().toISOString();
  
  Logger.log('更新後的資產數據:', JSON.stringify(asset));
  
  // 更新工作表
  const row = headers.map(header => {
    const value = asset[header];
    // 對於數值字段，如果是 undefined 或 null，返回 0
    if (['amount', 'cost', 'current_price', 'market_value', 'profit', 'profit_percentage'].includes(header)) {
      return value || 0;
    }
    // 對於其他字段，如果是 undefined 或 null，返回空字符串
    return value || '';
  });
  
  assetsSheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([row]);
  Logger.log('資產數據已更新完成');
}

function updateAssetAfterTransactionDeletion(transaction) {
  const assetsSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ASSETS_SHEET_NAME);
  const data = assetsSheet.getDataRange().getValues();
  const headers = data[0];
  const rowIndex = data.findIndex(row => row[headers.indexOf('id')] === transaction.asset_id);
  
  if (rowIndex === -1) {
    throw new Error('Asset not found');
  }
  
  const asset = {};
  headers.forEach((header, index) => {
    asset[header] = data[rowIndex][index];
  });
  
  // 更新資產數據（反向操作）
  if (transaction.type === '買入') {
    asset.amount = Number(asset.amount) - Number(transaction.amount);
    asset.cost = Number(asset.cost) - Number(transaction.total);
  } else if (transaction.type === '賣出') {
    asset.amount = Number(asset.amount) + Number(transaction.amount);
    // 注意：這裡的成本計算可能不夠準確，因為我們沒有保存原始的每筆交易的成本基礎
    asset.cost = Number(asset.cost) * (1 + Number(transaction.amount) / Number(asset.amount));
  }
  
  asset.market_value = Number(asset.amount) * Number(asset.current_price);
  asset.profit = asset.market_value - asset.cost;
  asset.profit_percentage = (asset.profit / asset.cost) * 100;
  asset.last_updated = new Date().toISOString();
  
  // 更新工作表
  const row = headers.map(header => asset[header] || '');
  assetsSheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([row]);
}

// 測試函數
function testEndpoints() {
  Logger.log('開始測試...');
  
  // 測試 getAssets
  Logger.log('測試 fetchAssets');
  const assets = getAssets();
  Logger.log('獲取資產列表: ' + assets.length + ' 個資產');
  
  // 測試 addAsset
  Logger.log('測試 addAsset');
  const testAsset = {
    name: '測試資產',
    type: 'stock_tw',
    symbol: 'TEST',
    amount: 100,
    cost: 1000,
    current_price: 15,
    notes: '測試用'
  };
  
  try {
    const addedAsset = addAsset(testAsset);
    Logger.log('添加資產成功: ' + addedAsset.id);
    
    // 測試 getTransactions
    Logger.log('測試 fetchTransactions');
    const transactions = getTransactions(addedAsset.id);
    Logger.log('獲取交易記錄: ' + transactions.length + ' 條記錄');
    
    // 測試 addTransaction
    Logger.log('測試 addTransaction');
    const testTransaction = {
      asset_id: addedAsset.id,
      type: '買入',
      amount: 50,
      price: 10,
      total: 500,
      notes: '測試交易'
    };
    
    try {
      const addedTransaction = addTransaction(testTransaction);
      Logger.log('添加交易成功: ' + addedTransaction.id);
      
      // 清理測試數據
      Logger.log('清理測試數據');
      deleteTransaction(addedTransaction.id);
      deleteAsset(addedAsset.id);
      
    } catch (error) {
      Logger.log('添加交易失敗: ' + error.message);
    }
  } catch (error) {
    Logger.log('添加資產失敗: ' + error.message);
  }
  
  Logger.log('測試完成');
}

// 初始化表格表頭
function initializeSheetHeaders() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // 初始化資產表格
  let sheet = ss.getSheetByName(ASSETS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(ASSETS_SHEET_NAME);
  }
  sheet.getRange(1, 1, 1, ASSET_HEADERS.length).setValues([ASSET_HEADERS]);
  
  // 初始化交易表格
  sheet = ss.getSheetByName(TRANSACTIONS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(TRANSACTIONS_SHEET_NAME);
  }
  sheet.getRange(1, 1, 1, TRANSACTION_HEADERS.length).setValues([TRANSACTION_HEADERS]);
  
  // 初始化價格歷史表格
  sheet = ss.getSheetByName(PRICE_HISTORY_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(PRICE_HISTORY_SHEET_NAME);
  }
  sheet.getRange(1, 1, 1, PRICE_HISTORY_HEADERS.length).setValues([PRICE_HISTORY_HEADERS]);
} 