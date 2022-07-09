'use strict';

// 初期化
const targetDiv = document.querySelector('#target-div');
const totalCountDisplay = document.querySelector('#total-count-display');
const innerCountDisplay = document.querySelector('#inner-count-display');
const outerCountDisplay = document.querySelector('#outer-count-display');
const approximatedPIDisplay = document.querySelector('#approximated-pi-display');
const presitionPIDisplay = document.querySelector('#precision-pi-display');


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

// 更新、色分け
let innerCount = 0;
let outerCount = 0;
let totalCount = 0;
const PI = Math.PI;
let approximatedPI = 0;
let presitionPI = 0;

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
  presitionPI = Math.abs(PI - approximatedPI) / PI;

  totalCountDisplay.textContent = `${totalCount}`;
  innerCountDisplay.textContent = `${innerCount}`;
  outerCountDisplay.textContent = `${outerCount}`;
  approximatedPIDisplay.textContent = `${approximatedPI.toFixed(5)}`;
  presitionPIDisplay.textContent = `${presitionPI.toFixed(5)}`;

}

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
  stopButton.disabled = false;
}, false);

stopButton.addEventListener('click', () => {
  stop();
  startButton.disabled = false;
  stopButton.disabled = true;
}, false);
