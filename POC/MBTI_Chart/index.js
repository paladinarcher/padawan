const ctx = document.getElementById("canvas").getContext("2d");

// -----------------creating chart-----------------
const graphData = {
  Innovative: 30,
  Improvising: 30,
  Collaborating: 30,
  Teaching: 30,
  Supporting: 30,
  Organizing: 30,
  Disciplined: 30,
  Detailed: 30,
  Systematic: 30,
  Investigative: 30,
  Conceptual: 30,
  Theoretical: 30
};

function drawText(ctx, color, text, font, x, y) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function drawRotatedText(ctx, color, text, font, x, y, rotate) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function drawLine(ctx, startX, startY, endX, endY, color) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.lineWidth = 4;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawArc(
  ctx,
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  color,
  color2,
  fill
) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.fillStyle = color;
  ctx.strokeStyle = color2;
  if (fill) {
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.stroke();
  }
}

function drawPieSlice(
  ctx,
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  color,
  color2,
  fill
) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  if (fill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
  ctx.closePath();
}

const Piechart = function(options) {
  this.options = options;
  this.canvas = options.canvas;
  this.ctx = this.canvas.getContext("2d");

  this.draw = function() {
    let total_value = 0;

    for (let categ in this.options.data) {
      let val = this.options.data[categ];
      total_value += val;
    }

    let start_angle = Math.PI / 12;

    for (categ in this.options.data) {
      val = this.options.data[categ];
      const slice_angle = (2 * Math.PI * val) / total_value;

      drawPieSlice(
        this.ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        Math.min(this.canvas.width / 4, this.canvas.height / 4),
        start_angle,
        start_angle + slice_angle,
        "#ffffff",
        "red"
      );

      start_angle += slice_angle;
    }

    if (this.options.doughnutHoleSize) {
      drawArc(
        this.ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        this.options.doughnutHoleSize *
          Math.min(this.canvas.width / 2, this.canvas.height / 2),
        0,
        2 * Math.PI,
        "#ffffff",
        "red",
        true
      );
    }
  };
};

const myPiechart = new Piechart({
  canvas: canvas,
  data: graphData,
  doughnutHoleSize: 0.1
});
myPiechart.draw();

// top
drawText(ctx, "red", "CREATOR", "30px Arial", 328, 175);
drawText(ctx, "black", "Focus on", "30px Arial", 338, 65);
drawText(ctx, "black", "POSSIBILITIES", "35px Arial", 276, 110);
// right
drawRotatedText(ctx, "red", "ADVANCER", "30px Arial", 625, 318, 0.5 * Math.PI);
drawRotatedText(ctx, "black", "Focus on", "30px Arial", 735, 338, 0.5 * Math.PI);
drawRotatedText(ctx, "black", "INTERACTION", "35px Arial", 690, 285, 0.5 * Math.PI);
// bottom
drawText(ctx, "red", "EXECUTOR", "30px Arial", 318, 650);
drawText(ctx, "black", "Focus on", "30px Arial", 338, 710);
drawText(ctx, "black", "REALITIES", "35px Arial", 309, 755);
// left
drawRotatedText(ctx, "red", "REFINER", "30px Arial", 175, 465, -0.5 * Math.PI);
drawRotatedText(ctx, "black", "Focus on", "30px Arial", 65, 462, -0.5 * Math.PI);
drawRotatedText(ctx, "black", "ANALYSIS", "35px Arial", 110, 485, -0.5 * Math.PI);
// center
drawText(ctx, "red", "Flexer", "16px Arial", 378, 406);


// ---------uncomment to see colored axes---------
// drawLine(ctx, 480, 100, 320, 700, "green");
// drawLine(ctx, 670, 245, 130, 555, "blue");
// drawLine(ctx, 100, 320, 700, 480, "red");
// drawLine(ctx, 250, 130, 550, 670, "orange");

// drawText(ctx, "orange", "N", "20px Arial", 230, 120);
// drawText(ctx, "orange", "S", "20px Arial", 550, 700);
// drawText(ctx, "green", "P", "20px Arial", 480, 90);
// drawText(ctx, "green", "J", "20px Arial", 308, 730);
// drawText(ctx, "blue", "E", "20px Arial", 675, 240);
// drawText(ctx, "blue", "I", "20px Arial", 115, 580);
// drawText(ctx, "red", "T", "20px Arial", 80, 320);
// drawText(ctx, "red", "F", "20px Arial", 710, 500);

// -------------------charting/drawing points below-------------------

// enter values here
let personality = {
  IE: { Value: 3.566666666666667 },
  NS: { Value: 11.419354838709678 },
  TF: { Value: 18.933333333333334 },
  JP: { Value: -20.966666666666665 }
};

// converting values to work with px chart
// charting IE
let valueIE = personality.IE.Value * 1.32;
let IEX = 2.52 * valueIE;
let IEY = -1.45 * valueIE;

// charting NS
let valueNS = personality.NS.Value * 1.9;
let NSX = 1 * valueNS;
let NSY = 1.8 * valueNS;

// charting TF
let valueTF = personality.TF.Value;
let TFX = 3.75 * valueTF;
let TFY = 1 * valueTF;

// charting JP
let valueJP = personality.JP.Value / 1.0416666666666667;
let JPX = 1.05 * valueJP;
let JPY = -3.95 * valueJP;

// setting initial starting point in center of chart
let initX = { value: 400 };
let initY = { value: 400 };

ctx.beginPath();
// ctx.arc(initX.value, initY.value, 8, 0, 2 * Math.PI, true); // drawing initial center point

let x2 = initX.value + IEX;
initX.value = x2;
let y2 = initY.value + IEY;
initY.value = y2;
ctx.moveTo(initX.value, initY.value);
// ctx.arc(initX.value, initY.value, 8, 0, 2 * Math.PI, true); // drawing IE

let x3 = initX.value + NSX;
initX.value = x3;
let y3 = initY.value + NSY;
initY.value = y3;
ctx.moveTo(initX.value, initY.value);
// ctx.arc(initX.value, initY.value, 8, 0, 2 * Math.PI, true); // drawing NS

let x4 = initX.value + TFX;
initX.value = x4;
let y4 = initY.value + TFY;
initY.value = y4;
ctx.moveTo(initX.value, initY.value);
// ctx.arc(initX.value, initY.value, 8, 0, 2 * Math.PI, true); // drawing TF

let x5 = initX.value + JPX;
initX.value = x5;
let y5 = initY.value + JPY;
initY.value = y5;
ctx.moveTo(initX.value, initY.value);
ctx.arc(initX.value, initY.value, 8, 0, 2 * Math.PI, true); // drawing JP, this is the only point the user will see

ctx.fillStyle = "#000000";
ctx.fill();
ctx.closePath();
