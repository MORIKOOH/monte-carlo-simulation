'use strict';

// 初期化
const targetDiv = document.querySelector('#target-div');
const totalCountDisplay = document.querySelector('#total-count-display');
const innerCountDisplay = document.querySelector('#inner-count-display');
const outerCountDisplay = document.querySelector('#outer-count-display');
const approximatedPIDisplay = document.querySelector('#approximated-pi-display');
const precisionPIDisplay = document.querySelector('#precision-pi-display');

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const svgElement = document.createElementNS(SVG_NAMESPACE, 'svg');


// 4分の1円の path 要素
const pathElement = document.createElementNS(SVG_NAMESPACE, 'path');
pathElement.setAttribute('stroke', 'white');

const path = `
  M0,0,
  A300,300,0,0,1,300,300,
  L0,300Z`;
pathElement.setAttribute('d', path);

svgElement.appendChild(pathElement);
targetDiv.appendChild(svgElement);

// 4分の1円の y 座標を返す関数
const quarterCircle = (r, x) => {
  const y = Math.sqrt(r * r - x * x);
  return y;
}

// 指定の座標に点を描画する関数
const addCircle = (inputX, inputY, color) => {
  const circleElement = document.createElementNS(SVG_NAMESPACE, 'circle');
  circleElement.setAttribute('cx', `${inputX}`);
  circleElement.setAttribute('cy', `${inputY}`);
  circleElement.setAttribute('r', '3px');
  circleElement.setAttribute('fill', `${color}`);

  svgElement.appendChild(circleElement);
}

sessionStorage.clear();
const store = (key, value) => {
  sessionStorage.setItem(key, value);
}

// 更新、色分け
let innerCount = 0;
let outerCount = 0;
let totalCount = 0;
const PI = Math.PI;
let approximatedPI = 0;
let precisionPI = 0;
let index = 0;

const updateSVG = () => {
  let randomX = svgElement.clientWidth * Math.random();
  let randomY = svgElement.clientHeight * Math.random();

  let trueY = quarterCircle(300, randomX);
  if (randomY < trueY) {
    innerCount++;
    addCircle(randomX, svgElement.clientHeight - randomY, '#28a745');
  } else {
    outerCount++
    addCircle(randomX, svgElement.clientHeight - randomY, '#dc3545');
  }

  totalCount = innerCount + outerCount;
  approximatedPI = 4 * (innerCount / totalCount);
  precisionPI = Math.abs(PI - approximatedPI) / PI;


  totalCountDisplay.textContent = `${totalCount}`;
  innerCountDisplay.textContent = `${innerCount}`;
  outerCountDisplay.textContent = `${outerCount}`;
  approximatedPIDisplay.textContent = `${approximatedPI.toFixed(5)}`;
  precisionPIDisplay.textContent = `${precisionPI.toFixed(5)}`;

  store(index, `${totalCount},${approximatedPI.toFixed(5)},${precisionPI.toFixed(5)}`);
  index++;
}

const getFormattedTime = () => {
  let fullDate = new Date();
  let Y = fullDate.getFullYear();
  let M = fullDate.getMonth() + 1;
  if (M.length !== 2) {
    M = `0${M}`;
  }
  let D = fullDate.getDate();
  if (D.length !== 2) {
    D = `0${D}`;
  }
  let h = fullDate.getHours();
  let m = fullDate.getMinutes();
  let s = fullDate.getSeconds();

  let formattedDate = `${Y}${M}${D}_${h}${m}${s}`;
  return formattedDate;
}

const exportCSV = () => {
  let time = getFormattedTime();
  const filename = `montecarlo_${time}.csv`;

  let dataStr = "";
  for (let i = 0; i < sessionStorage.length; i++) {
    let key = `${i}`;
    let value = sessionStorage.getItem(key);
    dataStr += `${value}\n`;
  }
  let data = dataStr.slice(0, dataStr.length - 1);

  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob = new Blob([bom, data], { type: "text/csv" });

  const url = (window.URL || window.webkitURL).createObjectURL(blob);
  const download = document.createElement("a");
  download.href = url;
  download.download = filename;
  download.click();
  (window.URL || window.webkitURL).revokeObjectURL(url);
}

const exportCsvButton = document.getElementById("export-csv-button");
exportCsvButton.addEventListener('click', exportCSV, false);

let timer;
const start = () => {
  timer = setInterval(updateSVG, 10);
  console.log(timer);
}
const stop = () => {
  clearInterval(timer);
  console.log(timer);
}

const startButton = document.querySelector('#start-button');
const stopButton = document.querySelector('#stop-button');

startButton.addEventListener('click', () => {
  start();
  startButton.disabled = true;
  startButton.style.opacity = '0.5';
  stopButton.disabled = false;
  stopButton.style.opacity = '1.0';
}, false);

stopButton.addEventListener('click', () => {
  stop();
  startButton.disabled = false;
  startButton.style.opacity = '1.0';
  stopButton.disabled = true;
  stopButton.style.opacity = '0.5';
}, false);
