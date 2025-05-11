// 全局常量
const SHEET_NAMES = {
  ASSETS: 'Assets',
  TRANSACTIONS: 'Transactions',
  SETTINGS: 'Settings',
  PRICE_HISTORY: 'PriceHistory'
};

// API 路由處理
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    switch (action) {
      case 'getAssets':
        return handleResponse(getAssets());
      case 'getTransactions':
        return handleResponse(getTransactions());
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    return handleError(error);
  }
}

function doPost(e) {
  try {
    const action = e.parameter.action;
    const data = JSON.parse(e.postData.contents);
    
    switch (action) {
      case 'addAsset':
        return handleResponse(addAsset(data));
      case 'updateAsset':
        return handleResponse(updateAsset(data));
      case 'deleteAsset':
        return handleResponse(deleteAsset(data.id));
      case 'addTransaction':
        return handleResponse(addTransaction(data));
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    return handleError(error);
  }
}

// 資產相關功能
function getAssets() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.ASSETS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1).map(row => {
    const asset = {};
    headers.forEach((header, index) => {
      asset[header] = row[index];
    });
    return asset;
  });
}

function addAsset(data) {
  validateAssetData(data);
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.ASSETS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const newRow = headers.map(header => data[header] || '');
  sheet.appendRow(newRow);
  
  return { success: true, message: 'Asset added successfully' };
}

function updateAsset(data) {
  if (!data.id) throw new Error('Asset ID is required');
  validateAssetData(data);
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.ASSETS);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] === data.id) {
      const range = sheet.getRange(i + 1, 1, 1, headers.length);
      const newRow = headers.map(header => data[header] || values[i][headers.indexOf(header)]);
      range.setValues([newRow]);
      return { success: true, message: 'Asset updated successfully' };
    }
  }
  
  throw new Error('Asset not found');
}

function deleteAsset(id) {
  if (!id) throw new Error('Asset ID is required');
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.ASSETS);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] === id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Asset deleted successfully' };
    }
  }
  
  throw new Error('Asset not found');
}

// 交易相關功能
function getTransactions() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.TRANSACTIONS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1).map(row => {
    const transaction = {};
    headers.forEach((header, index) => {
      transaction[header] = row[index];
    });
    return transaction;
  });
}

function addTransaction(data) {
  validateTransactionData(data);
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.TRANSACTIONS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const newRow = headers.map(header => data[header] || '');
  sheet.appendRow(newRow);
  
  // 更新資產數量和成本
  updateAssetAfterTransaction(data);
  
  return { success: true, message: 'Transaction added successfully' };
}

// 輔助函數
function validateAssetData(data) {
  const requiredFields = ['name', 'type', 'amount', 'cost'];
  requiredFields.forEach(field => {
    if (!data[field]) throw new Error(`${field} is required`);
  });
}

function validateTransactionData(data) {
  const requiredFields = ['asset_id', 'type', 'amount', 'price', 'date'];
  requiredFields.forEach(field => {
    if (!data[field]) throw new Error(`${field} is required`);
  });
}

function updateAssetAfterTransaction(transaction) {
  // 根據交易更新資產數量和成本
  const asset = getAssetById(transaction.asset_id);
  if (!asset) throw new Error('Asset not found');
  
  const newAmount = transaction.type === 'buy' 
    ? asset.amount + transaction.amount 
    : asset.amount - transaction.amount;
    
  const newCost = transaction.type === 'buy'
    ? asset.cost + (transaction.amount * transaction.price)
    : asset.cost - (transaction.amount * transaction.price);
    
  updateAsset({
    id: transaction.asset_id,
    amount: newAmount,
    cost: newCost
  });
}

function getAssetById(id) {
  const assets = getAssets();
  return assets.find(asset => asset.id === id);
}

// 響應處理
function handleResponse(data) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: data
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleError(error) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: error.message
  })).setMimeType(ContentService.MimeType.JSON);
} 