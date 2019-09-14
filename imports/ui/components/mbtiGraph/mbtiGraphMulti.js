import { Meteor } from 'meteor/meteor';
import { mbtiPoint } from './mbtiGraph';

const GRF_URL = Meteor.settings.public.GRF_URL;

export const mbtiGraphMulti = (canvasID, records, $img1, highlight) => {
  import { Session } from 'meteor/session';
  const tt = [];
  var points = [];
  if(typeof $img1 == "undefined") {
    $img1 = $('#'+canvasID);
  }
  //const canvas = document.getElementById(canvasID);
  //const ctx = canvas.getContext("2d");
  //ctx.canvas.height = ctx.canvas.width;

  // Control size and color of spots
  var sizeBase = 5; // default base size
  var size = sizeBase+2; // default size
  var color = '#000000'; // default color
  var rgb = [0,0,0]; // rgb for spots
  var sizeMax = 20;
  var sizeMultiplyer = 2;
  var tMax = 1;
  var tStep = 0.07;




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
  records.forEach(record => {
    let point = mbtiPoint(record.IE, record.NS, record.TF, record.JP)
    
    var isRecordSelected = false;
    if(record.intensity !== false) {
      let t = record.intensity/10;
      size = 110 - (record.intensity*10);
      //color = ctx.createRadialGradient(point.X, point.Y, sizeBase, point.X, point.Y, size);
      if(!highlight) {
        highlight = [];
      }
      let nameKey = highlight.findIndex(h => {
        return h === record.name;
      });
      if(nameKey > -1) {
        isRecordSelected = true;
        //color.addColorStop(0, "rgba(255, 255, 0, 1)");
        //color.addColorStop(1, "rgba(255, 255, 0, 0");
      } else {
        //color.addColorStop(0, "rgba("+rgb[0]+", "+rgb[1]+", "+rgb[2]+", "+t+")");
        //color.addColorStop(1, "rgba("+rgb[0]+", "+rgb[1]+", "+rgb[2]+", 0");
      }
    }

    console.log("draw dot params",point.X, point.Y, color, size);

    tt.push({
      I: record.intensity,
      r: size,
      ie: record.IE,
      ns: record.NS,
      tf: record.TF,
      jp: record.JP,
      name: record.name
    });
    points.push({
        x: point.X,
        y: point.Y,
        radius: size,
        intensity: record.intensity,
        mark: (isRecordSelected ? 1 : 0)
    });
    //drawDot(point.X, point.Y, color, size); // drawing JP, this is the only point the user will see
    //ctx.lineWidth = 0;
  });

  if(points.length > 0) {
    var graphUrl = 'traits/';
    for (var i = 0; i < points.length; i++) {
        graphUrl += Math.round(points[i].x)+","+Math.round(points[i].y)+","+points[i].radius+","+points[i].intensity+","+points[i].mark+"!";
    }
    graphUrl = GRF_URL+graphUrl.slice(0, -1).split('.').join('i') + ".png";
    $img1.attr('src',graphUrl);
    console.log(graphUrl);

    //drawDot(300,300,"#000000",8);
    Session.set('GraphData', undefined);
    Session.set('GraphData', tt);
  }
}
