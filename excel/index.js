const ExcelJS = require('exceljs');

const workbook = new ExcelJS.Workbook();
(async () => {
  await workbook.xlsx.readFile('./excel/vedomost.xlsx');
  const worksheet = workbook.getWorksheet('Сервер');
  let lastRow = worksheet.lastRow;
  const cell = worksheet.getCell('C17');
  // console.log(cell, 'row', lastRow.number);
  const map1 = new Map();
  for (let i = 13; i <= lastRow.number; i++) {
    if (worksheet.getCell(`Q${i}`).value) {
      map1.set(
        worksheet.getCell(`C${i}`).value,
        worksheet.getCell(`Q${i}`).value
      );
    } else {
      map1.set(worksheet.getCell(`C${i}`).value, 0);
    }
  }
  // console.log(map1);

  const worksheet2 = workbook.getWorksheet('Стенд');
  lastRow = worksheet2.lastRow;
  const map2 = new Map();
  for (let i = 8; i < lastRow.number; i++) {
    if (worksheet2.getCell(`N${i}`).value) {
      map2.set(
        worksheet2.getCell(`A${i}`).value,
        worksheet2.getCell(`N${i}`).value
      );
    } else {
      map2.set(worksheet2.getCell(`A${i}`).value, 0);
    }
  }

  // const map3 = new Map();
  for (let key of map1.keys()) {
    let diff = map1.get(key) - map2.get(key);
    if (diff != 0) {
      console.log(key, diff);
    }
    map2.delete(key);

    // diff = map1[key] - map2[key];
    // map1.set(key, diff);
  }
  console.log(map2);
})();
