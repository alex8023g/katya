/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const table1 = document.getElementById('table-1');
const table2 = document.getElementById('table-2');

btn3.addEventListener('click', async () => {
  table1.innerHTML = '';
  table2.innerHTML = '';
  const [diff, rest] = await window.electronAPI.compare();
  for (let key in diff) {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td1.innerText = key;
    td2.innerText = diff[key];
    tr.append(td1);
    tr.append(td2);
    table1.append(tr);
  }
  for (let key of rest.keys()) {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td1.innerText = key;
    td2.innerText = rest.get(key);
    tr.append(td1);
    tr.append(td2);
    table2.append(tr);
  }
});

btn1.addEventListener('click', () => {
  window.electronAPI.openFile1();
});
btn2.addEventListener('click', () => {
  window.electronAPI.openFile2();
});
