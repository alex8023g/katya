// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const ExcelJS = require('exceljs');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('compare', compare);
  ipcMain.handle('dialog:openFile1', handleFileOpen1);
  ipcMain.handle('dialog:openFile2', handleFileOpen2);

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const workbook = new ExcelJS.Workbook();
const workbook2 = new ExcelJS.Workbook();

let filePath1;
let filePath2;

async function compare() {
  // const { canceled, filePaths } = await dialog.showOpenDialog();
  // if (canceled) {
  //   return;
  // } else {
  await workbook.xlsx.readFile(filePath1[0]);
  const worksheet = workbook.getWorksheet('TDSheet');
  let lastRow = worksheet.lastRow;
  const cell = worksheet.getCell('C17');
  const map1 = new Map();
  for (let i = 13; i <= lastRow.number; i++) {
    if (worksheet.getCell(`Q${i}`).value) {
      map1.set(
        worksheet.getCell(`C${i}`).value.trim(),
        worksheet.getCell(`Q${i}`).value
      );
    } else {
      map1.set(worksheet.getCell(`C${i}`).value, 0);
    }
  }
  // console.log(map1);
  await workbook2.xlsx.readFile(filePath2[0]);

  const worksheet2 = workbook2.getWorksheet('TDSheet');
  lastRow = worksheet2.lastRow;
  const map2 = new Map();
  for (let i = 8; i < lastRow.number; i++) {
    if (worksheet2.getCell(`N${i}`).value) {
      map2.set(
        worksheet2.getCell(`A${i}`).value.trim(),
        worksheet2.getCell(`N${i}`).value
      );
    } else {
      map2.set(worksheet2.getCell(`A${i}`).value, 0);
    }
  }

  let difference = {};
  let diff;
  for (let key of map1.keys()) {
    if (map2.get(key)) {
      diff = map1.get(key) - map2.get(key);
    } else {
      diff = map1.get(key);
    }
    console.log('map1.get(key), diff', key, map1.get(key), diff);
    if (diff != 0) {
      difference[key] = diff;
    }
    map2.delete(key);
  }
  console.log('map2', map2, 'difference', difference);
  return [difference, map2];
  // }
}

async function handleFileOpen1() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (canceled) {
    return;
  } else {
    filePath1 = filePaths;
    console.log(filePath1);
  }
}
async function handleFileOpen2() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (canceled) {
    return;
  } else {
    filePath2 = filePaths;
    console.log(filePath2);
  }
}
