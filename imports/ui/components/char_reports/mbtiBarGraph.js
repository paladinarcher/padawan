import { Meteor } from 'meteor/meteor';



const mbtiBarGraph = (sortGraph) => {
    console.log('sortGraph in canvas: ', sortGraph);
    // alert('mbtiBarGraph working');
    let canvas = document.getElementById("mbtiBarGraph");
    let context = canvas.getContext("2d");
    let wid = canvas.width;
    let hei = canvas.height;
    let aboveGraph = hei / 6;
    let dividerHeight = hei / 50;
    let graphHeight = canvas.height - aboveGraph - (2 * dividerHeight);
    let graphMax = aboveGraph + dividerHeight;
    let graphMin = aboveGraph + dividerHeight + graphHeight;
    let graphMid = (graphMax + graphMin) / 2;
    let barSpacing = wid / 5.4;
    let barWidth = wid / 25;
    // sortGraph.ie.c
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

    // draw bar graphs
    let mbtiArr = [sortGraph.ie, sortGraph.ns, sortGraph.tf, sortGraph.jp];
    for (let i = 0; i < 4; i++) {
        if (mbtiArr[i].graphOrder == 0) {
            // bigger bar
            context.beginPath();
            context.rect(barSpacing - barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].largePercent / 100));
            context.fillStyle = "blue";
            context.fill();
            // smaller bar
            context.beginPath();
            context.rect(barSpacing + barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].smallPercent / 100));
            context.fillStyle = "green";
            context.fill();
        }
        if (mbtiArr[i].graphOrder == 1) {
            // bigger bar
            context.beginPath();
            context.rect(2 * barSpacing - barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].largePercent / 100));
            context.fillStyle = "blue";
            context.fill();
            // smaller bar
            context.beginPath();
            context.rect(2 * barSpacing + barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].smallPercent / 100));
            context.fillStyle = "green";
            context.fill();
        }
        if (mbtiArr[i].graphOrder == 2) {
            // bigger bar
            context.beginPath();
            context.rect(3 * barSpacing - barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].largePercent / 100));
            context.fillStyle = "blue";
            context.fill();
            // smaller bar
            context.beginPath();
            context.rect(3 * barSpacing + barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].smallPercent / 100));
            context.fillStyle = "green";
            context.fill();
        }
        if (mbtiArr[i].graphOrder == 3) {
            // bigger bar
            context.beginPath();
            context.rect(4 * barSpacing - barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].largePercent / 100));
            context.fillStyle = "blue";
            context.fill();
            // smaller bar
            context.beginPath();
            context.rect(4 * barSpacing + barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].smallPercent / 100));
            context.fillStyle = "green";
            context.fill();
        }
    }

}


export { mbtiBarGraph };