/***************************************
* clock.js
* Solo
*
* this script draws a clock and tells
* time
****************************************/

// global constants

let can; // canvas
let ctx; // context of 2d

// clock constants

const R1 = 135;
const R2 = .9 * R1;
const R3 = .965 * R2;
const R4 = .02 * R3;
const CX = 250;
const CY = 250;
const pi = Math.PI;

// ticker position

const pos = CY - .965 * R3;
let tick;

// hands

const SEC = R3 + .05 * R2;
const MIN = .54 * SEC;
const HOUR = .75 * MIN;
let factor2;

// fetches the canvas and context

function initialize() {
  can = document.getElementById("canvas");
  ctx = can.getContext("2d");

  // date

  let _hour = new Date().getHours();

  if (_hour > 12)
    _hour -= 12;

  factor2 = _hour * 3600 + (new Date().getMinutes() * 60);

  hour(factor2);
  min(new Date().getMinutes() * 60);
  sec();
  spin();
} // init

// ***************************************

//

function static() {
  // save context first
  // and reset transformations before
  // drawing

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // now draw

  ctx.strokeStyle = "rgb(150,150,150)"; // grey color
  ctx.fillStyle = "rgb(220,220,220)";
  ctx.lineWidth = 1; // for documentation purpose
                     // 1 is usually default

  // path

  ctx.beginPath();
  ctx.arc(CX, CY, R1, 0, 2 * pi);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "black";

  //

  ctx.beginPath();
  ctx.arc(CX, CY, R2, 0, 2 * pi);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.strokeStyle = "rgb(150,150,150)";

  //

  ctx.arc(CX, CY, R3, 0, 2 * pi);
  ctx.fill();
  ctx.stroke();

  // restore

  ctx.restore();
} // static

// ****************************************************

// draws inner face of clock
// with tickers and numbers

function inner() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  //

  let ticker = 12; // 12 tickers of a clock

  // roman numbering

  let roman = "i-ii-iii-iv-v-vi-vii-viii-ix-x-xi-xii".split("-");

  ctx.strokeStyle = "red";
  ctx.fillStyle = "magenta";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "18pt bold serif";
  ctx.lineWidth = 3;

  ctx.beginPath();

  while (ticker >= 0) {
    tick = .1 * R3;
    if (ticker == 0)
      break;

    ctx.moveTo(CX, pos);
    ctx.lineTo(CX, pos + tick);

    let text = ticker == 12 ? "xii" : roman.shift();

    ctx.fillText(text, CX, pos + (.18 * R3), 15);

    // rotate

    ctx.translate(CX, CY);
    ctx.rotate(pi / 6);
    ctx.translate(-CX, -CY);

    ticker--;
  } // 

  ctx.stroke();

  ctx.restore();
} // inner

// ********************************************************************

// sec hand

function sec() {
  //

  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.fillStyle = "white";

  ctx.beginPath();
  ctx.moveTo(CX, pos + .5 * tick);
  ctx.lineTo(CX, pos + SEC + .5 * tick);

  ctx.moveTo(CX, CY);
  ctx.arc(CX, CY, R4, 0, 2 * pi);
  ctx.stroke();
  ctx.fill();
} // sec

// ************************************************

// spin

function spin() {
  let rot = (angle) => {
    ctx.translate(CX, CY);
    ctx.rotate(angle);
    ctx.translate(-CX, -CY);
  };

  let factor = new Date().getMinutes() * 60;
  factor2 = new Date().getHours() * 3600;
  factor2 += factor;
  let temp = setInterval(() => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 500, 500);
    ctx.restore();

    hour(factor2);
    min(factor);
    rot(pi / 30);
    sec();
    
    if (factor > 3600)
      factor = 1;

    if (factor2 > 3600 * 24)
      factor2 = 1;

    factor++;
    factor2++;
  }, 1000);

  return temp;
} // spin

// ***********************************************

// min hand

function min(factor = 0) {
  //
  
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, 500, 500);

  ctx.strokeStyle = "magenta";
  ctx.fillStyle = "rgb(200,200,200)";
  ctx.lineWidth = 1;

  // rotate

  ctx.translate(CX, CY);
  ctx.rotate(factor * pi / 1800);
  ctx.translate(-CX, -CY);

  static();
  inner();
  hour(factor2);

  ctx.beginPath();
  ctx.moveTo(CX - R4, CY);
  ctx.lineTo(CX + R4, CY);
  ctx.lineTo(CX + R4, CY - MIN);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();

} // min

// **************************************************

// hour hand

function hour(factor = 1) {
  //

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, 500, 500);

  // hour commands

  ctx.strokeStyle = "magenta";
  ctx.fillStyle = "rgb(255,100, 100)";
  ctx.lineWidth = 2;

  // rotate

  ctx.translate(CX, CY);
  ctx.rotate(factor * pi / (30 * 720));
  ctx.translate(-CX, -CY);

  static();
  inner();

  // path

  ctx.beginPath();
  ctx.moveTo(CX - R4, CY);
  ctx.lineTo(CX + R4, CY);
  ctx.lineTo(CX, CY - HOUR);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
} // hour