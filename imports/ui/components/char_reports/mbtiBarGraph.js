import { Meteor } from 'meteor/meteor';



const mbtiBarGraph = (sortGraph) => {
    console.log('sortGraph in canvas: ', sortGraph);
    // alert('mbtiBarGraph working');
    let canvas = document.getElementById("mbtiBarGraph");
    let context = canvas.getContext("2d");
    let wid = canvas.width;
    let hei = canvas.height;
    let aboveGraph = hei/6;
    let dividerHeight = hei/50;
    let graphHeight = canvas.height - aboveGraph - (2 * dividerHeight);
    let graphMax = aboveGraph + dividerHeight;
    let graphMin = aboveGraph + dividerHeight + graphHeight;
    let graphMid = (graphMax + graphMin) / 2;
    // let dpr = windowPixelRatio || 1;
    // context.scale(dpr, dpr)

    // context.moveTo(0, 0);
    // context.lineTo(canvas.width, 0);
    // context.lineTo(canvas.width, canvas.height);
    // context.lineTo(0, canvas.height);
    // context.lineTo(0, 0);
    // context.fillStyle = "#FF8800";
    // context.stroke();
    
    context.font = "30px Arial";
    context.fillText("Hello World", 10, 50);

    // top divider
    context.beginPath();
    context.rect(0, aboveGraph, wid, dividerHeight);
    context.fillStyle = "black";
    context.fill();

    // bottom divider
    context.beginPath();
    context.rect(0, hei - dividerHeight, wid, dividerHeight);
    context.fillStyle = "black";
    context.fill();

    // graph middle line
    context.moveTo(0, graphMid);
    context.lineTo(wid, graphMid);
    context.fillStyle = "black";
    context.stroke();

}


export { mbtiBarGraph };