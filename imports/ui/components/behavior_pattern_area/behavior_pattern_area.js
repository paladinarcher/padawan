export const behavior_pattern_area = (canvasID, IE, NS, TF, JP, maxOpacity, heatColor) => {

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
  
  // setting initial starting point in center of chart
  let initX = { value: 400 };
  let initY = { value: 400 };
  // drawDot(initX.value, initY.value, "#FFFF00"); // drawing initial center point

  // converting values to work with px chart
  // charting IE
  let ieScalar = 0.66;
  let iexScalar = 2.52;
  let ieyScalar = -1.45;
  let valueIE = personality.IE.Value * ieScalar;
  let IEX = iexScalar * valueIE;
  let IEY = ieyScalar * valueIE;
  let IEP1X = initX.value + IEX + (iexScalar * ieScalar * 50);
  let IEP1Y = initY.value + IEY + (ieyScalar * ieScalar * 50);
  let IEP2X = initX.value + IEX - (iexScalar * ieScalar * 50);
  let IEP2Y = initY.value + IEY - (ieyScalar * ieScalar * 50);
  let IEMX = initX.value + IEX;
  let IEMY = initY.value + IEY;

  // charting NS
  let nsScalar = 0.95
  let nsxScalar = 1;
  let nsyScalar = 1.8;
  let valueNS = personality.NS.Value * nsScalar;
  let NSX = nsxScalar * valueNS;
  let NSY = nsyScalar * valueNS;
  let NSP1X = initX.value + NSX + (nsxScalar * nsScalar * 50);
  let NSP1Y = initY.value + NSY + (nsyScalar * nsScalar * 50);
  let NSP2X = initX.value + NSX - (nsxScalar * nsScalar * 50);
  let NSP2Y = initY.value + NSY - (nsyScalar * nsScalar * 50);
  let NSMX = initX.value + NSX;
  let NSMY = initY.value + NSY;

  // charting TF
  let tfScalar = 0.5;
  let tfxScalar = 3.75;
  let tfyScalar = 1;
  let valueTF = personality.TF.Value * tfScalar;
  let TFX = tfxScalar * valueTF;
  let TFY = tfyScalar * valueTF;
  let TFP1X = initX.value + TFX + (tfxScalar * tfScalar * 50);
  let TFP1Y = initY.value + TFY + (tfyScalar * tfScalar * 50);
  let TFP2X = initX.value + TFX - (tfxScalar * tfScalar * 50);
  let TFP2Y = initY.value + TFY - (tfyScalar * tfScalar * 50);
  let TFMX = initX.value + TFX;
  let TFMY = initY.value + TFY;

  // charting JP
  // let valueJP = personality.JP.Value / 1.0416666666666667; // full circle
  let jpScalar = 0.48
  let jpxScalar = 1.05;
  let jpyScalar = -3.95;
  let valueJP = personality.JP.Value * jpScalar;
  let JPX = jpxScalar * valueJP;
  let JPY = jpyScalar * valueJP;
  let JPP1X = initX.value + JPX + (jpxScalar * jpScalar * 50);
  let JPP1Y = initY.value + JPY + (jpyScalar * jpScalar * 50);
  let JPP2X = initX.value + JPX - (jpxScalar * jpScalar * 50);
  let JPP2Y = initY.value + JPY - (jpyScalar * jpScalar * 50);
  let JPMX = initX.value + JPX;
  let JPMY = initY.value + JPY;


  // ---------uncomment to see personality dots---------
  // drawDot(IEMX, IEMY, "#0000FF"); // drawing IE
  // drawDot(IEP1X, IEP1Y, "#0000FF"); // drawing IE point 1
  // drawDot(IEP2X, IEP2Y, "#0000FF"); // drawing IE point 2
  // drawDot(NSMX, NSMY, "#00FFFF"); // drawing NS
  // drawDot(NSP1X, NSP1Y, "#00FFFF"); // drawing NS point 1
  // drawDot(NSP2X, NSP2Y, "#00FFFF"); // drawing NS point 2
  // drawDot(TFMX, TFMY, "#FF8800"); // drawing TF
  // drawDot(TFP1X, TFP1Y, "#FF8800"); // drawing TF point 1
  // drawDot(TFP2X, TFP2Y, "#FF8800"); // drawing TF point 2
  // drawDot(JPMX, JPMY, "#AA4400"); // drawing JP
  // drawDot(JPP1X, JPP1Y, "#AA4400"); // drawing JP
  // drawDot(JPP2X, JPP2Y, "#AA4400"); // drawing JP

  // ---------uncomment to draw the personality polygon heat map---------
  let polyPoints = [[JPP1X, JPP1Y], [IEP1X, IEP1Y], [TFP1X, TFP1Y], [NSP1X, NSP1Y], 
    [JPP2X, JPP2Y], [IEP2X, IEP2Y], [TFP2X, TFP2Y], [NSP2X, NSP2Y], [JPP1X, JPP1Y]];
  ctx.beginPath();
  ctx.moveTo(polyPoints[0][0], polyPoints[0][1]);
  for (let i = 1, len = polyPoints.length; i < len - 1; i++) {
    ctx.lineTo(polyPoints[i][0], polyPoints[i][1])
  }
  ctx.closePath();
  function fillHeatMap() {
    grd.addColorStop(0, 'rgba(' + heatColor + ', ' + maxOpacity + ')');
    grd.addColorStop(1, 'rgba(' + heatColor + ', 0)');
    ctx.fillStyle = grd;
    ctx.fill();
  }
  let grd = ctx.createRadialGradient(IEMX, IEMY, 0, IEMX, IEMY, 100)
  fillHeatMap();
  grd = ctx.createRadialGradient(NSMX, NSMY, 0, NSMX, NSMY, 100)
  fillHeatMap();
  grd = ctx.createRadialGradient(TFMX, TFMY, 0, TFMX, TFMY, 100)
  fillHeatMap();
  grd = ctx.createRadialGradient(JPMX, JPMY, 0, JPMX, JPMY, 100)
  fillHeatMap();
}