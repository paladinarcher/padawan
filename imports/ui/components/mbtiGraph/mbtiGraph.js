export const mbtiGraph = (canvasID, IE, NS, TF, JP) => {

  const ctx = document.getElementById(canvasID.id).getContext("2d");
  ctx.canvas.height = ctx.canvas.width;

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

  // only needed if you want to see the color axes
  function drawLine(ctx, startX, startY, endX, endY, color) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  // draw dots of different colors
  function drawDot(xVal, yVal, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(xVal, yVal, 8, 0, 2 * Math.PI, true); // drawing IE
    ctx.closePath();
    ctx.fill();
  }

  // top
  drawText(ctx, "black", "Eyes", "35px Arial", 362, 155);
  drawText(ctx, "black", "Vision", "35px Arial", 354, 100);
  // right
  drawRotatedText(ctx, "black", "Heart", "35px Arial", 645, 355, 0.5 * Math.PI);
  drawRotatedText(ctx, "black", "Human Interaction", "35px Arial", 700, 260, 0.5 * Math.PI);
  // bottom
  drawText(ctx, "black", "Hands", "35px Arial", 347, 670);
  drawText(ctx, "black", "Execution", "35px Arial", 322, 725);
  // left
  drawRotatedText(ctx, "black", "Brain", "35px Arial", 155, 440, -0.5 * Math.PI);
  drawRotatedText(ctx, "black", "Analysis & Design", "35px Arial", 100, 545, -0.5 * Math.PI);
  // center
  drawText(ctx, "red", "Balanced", "15px Arial", 370, 406);


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
    IE: { Value: IE },
    NS: { Value: NS },
    TF: { Value: TF },
    JP: { Value: JP }
  };

  // converting values to work with px chart
  // charting IE
  // let valueIE = personality.IE.Value * 1.32; // full circle
  let valueIE = personality.IE.Value * 0.66;
  let IEX = 2.52 * valueIE;
  let IEY = -1.45 * valueIE;

  // charting NS
  // let valueNS = personality.NS.Value * 1.9; // full circle
  let valueNS = personality.NS.Value * 0.95;
  let NSX = 1 * valueNS;
  let NSY = 1.8 * valueNS;

  // charting TF
  // let valueTF = personality.TF.Value; // full circle
  let valueTF = personality.TF.Value * 0.5;
  let TFX = 3.75 * valueTF;
  let TFY = 1 * valueTF;

  // charting JP
  // let valueJP = personality.JP.Value / 1.0416666666666667; // full circle
  let valueJP = personality.JP.Value / 2.0833333333333333;
  let JPX = 1.05 * valueJP;
  let JPY = -3.95 * valueJP;

  // setting initial starting point in center of chart
  let initX = { value: 400 };
  let initY = { value: 400 };

  // drawDot(initX.value, initY.value, "#FFFF00"); // drawing initial center point

  let x2 = initX.value + IEX;
  let y2 = initY.value + IEY;
  // drawDot(x2, y2, "#0000FF"); // drawing IE

  let x3 = initX.value + NSX;
  let y3 = initY.value + NSY;
  // drawDot(x3, y3, "#00FFFF"); // drawing NS

  let x4 = initX.value + TFX;
  let y4 = initY.value + TFY;
  // drawDot(x4, y4, "#FF8800"); // drawing TF

  let x5 = initX.value + JPX;
  let y5 = initY.value + JPY;
  // drawDot(x5, y5, "#AA4400"); // drawing JP

  // update init values to final sum of all vectors times 2 (scales better)
  initX.value = initX.value + ((IEX + NSX + TFX + JPX) * 2);
  initY.value = initY.value + ((IEY + NSY + TFY + JPY) * 2);

  // checking if last point is outside the circle (then moving back inside if true)
  let distanceSqr = ((initX.value - 400)*(initX.value - 400)) + ((initY.value - 400)*(initY.value - 400));
  let radius = 200;
  let distance = Math.sqrt(distanceSqr);

  if(distance > radius){
    let oldX = initX.value - 400;
    let oldY = initY.value - 400;
    let slope = oldX/oldY;

    let newY = ((200 / Math.sqrt((slope*slope)+1)));
    let rawY = newY;
    if((oldY < 0 && newY > 0) || (oldY > 0 && newY < 0)){
      newY = -newY;
    }
    newY += 400;

    let newX = (rawY*slope);
    if((oldX < 0 && newX > 0) || (oldX > 0 && newX < 0)){
      newX = -newX;
    }
    newX += 400;

    initX.value = newX;
    initY.value = newY;
  }

  drawDot(initX.value, initY.value, "#000000"); // drawing JP, this is the only point the user will see


}