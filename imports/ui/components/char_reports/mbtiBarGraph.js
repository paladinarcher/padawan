import { Meteor } from 'meteor/meteor';



const mbtiBarGraph = (userObj, barGraphId, myMinQuestionsAnswered) => {



    function letterByCategory(category, myUsrObj) {
        if (typeof myUsrObj === "undefined") return false;
        var identifier = myUsrObj.MyProfile.UserType.Personality.getIdentifierById(category);
        var value = myUsrObj.MyProfile.UserType.Personality[identifier].Value;
        console.log('asdfvalue: ', value);
        console.log('asdfidentifier: ', identifier);
        if (myUsrObj.MyProfile.UserType.AnsweredQuestions.length >= myMinQuestionsAnswered) {
            return (value === 0 ? "?" : (value < 0 ? identifier.slice(0, 1) : identifier.slice(1, 2)));
        } else {
            return "?";
        }
    }
    function results(category, myUsrObj) {
        let identifier = myUsrObj.MyProfile.UserType.Personality.getIdentifierById(
            category
        );

        let identifierValue =
            myUsrObj.MyProfile.UserType.Personality[identifier].Value;

        let percentageValue =
            myUsrObj.MyProfile.UserType.Personality[
            myUsrObj.MyProfile.UserType.Personality.getIdentifierById(category)
            ];

        let percentage = Math.round(Math.abs(percentageValue.Value));

        if (identifierValue) {
            return 50 + percentage;
        }
    }


    let iColor = '#ABA6BF';
    let eColor = '#595775';
    let nColor = '#583E2E';
    let sColor = '#BF988F';
    let tColor = '#192E5B';
    let fColor = '#1D65A6';
    let jColor = '#00743F';
    let pColor = '#F2A104';

    let sortGraph = {
        ie: {
            largeLetter: 'todo',
            largePercent: 'todo',
            largeColor: 'todo',
            smallLetter: 'todo',
            smallPercent: 'todo',
            smallColor: 'todo',
            graphOrder: 'todo'
        },
        ns: {
            largeLetter: 'todo',
            largePercent: 'todo',
            largeColor: 'todo',
            smallLetter: 'todo',
            smallPercent: 'todo',
            smallColor: 'todo',
            graphOrder: 'todo'
        },
        tf: {
            largeLetter: 'todo',
            largePercent: 'todo',
            largeColor: 'todo',
            smallLetter: 'todo',
            smallPercent: 'todo',
            smallColor: 'todo',
            graphOrder: 'todo'
        },
        jp: {
            largeLetter: 'todo',
            largePercent: 'todo',
            largeColor: 'todo',
            smallLetter: 'todo',
            smallPercent: 'todo',
            smallColor: 'todo',
            graphOrder: 'todo'
        }
    }
    console.log('sortGraph', sortGraph);

    // IE letters, colors, and percentages
    console.log('beforeBrake');
    sortGraph.ie.largeLetter = letterByCategory(0, userObj);
    console.log('sortGraphIE: ', sortGraph);
    if (sortGraph.ie.largeLetter == '?') {
        sortGraph.ie.largeLetter = 'I';
        sortGraph.ie.smallLetter = 'E';
        sortGraph.ie.largeColor = iColor;
        sortGraph.ie.smallColor = eColor;
    } else if (sortGraph.ie.largeLetter == 'I') {
        sortGraph.ie.smallLetter = 'E';
        sortGraph.ie.largeColor = iColor;
        sortGraph.ie.smallColor = eColor;
    } else if (sortGraph.ie.largeLetter == 'E') {
        sortGraph.ie.smallLetter = 'I';
        sortGraph.ie.largeColor = eColor;
        sortGraph.ie.smallColor = iColor;
    }
    sortGraph.ie.largePercent = results(0, userObj);
    if (sortGraph.ie.largePercent == undefined) {
        sortGraph.ie.largePercent = 50
        sortGraph.ie.smallPercent = 50
    } else {
        sortGraph.ie.smallPercent = 100 - sortGraph.ie.largePercent;
    }

    // NS letters, colors, and percentages
    sortGraph.ns.largeLetter = letterByCategory(1, userObj);
    if (sortGraph.ns.largeLetter == '?') {
        sortGraph.ns.largeLetter = 'N';
        sortGraph.ns.smallLetter = 'S';
        sortGraph.ns.largeColor = nColor;
        sortGraph.ns.smallColor = sColor;
    } else if (sortGraph.ns.largeLetter == 'N') {
        sortGraph.ns.smallLetter = 'S';
        sortGraph.ns.largeColor = nColor;
        sortGraph.ns.smallColor = sColor;
    } else if (sortGraph.ns.largeLetter == 'S') {
        sortGraph.ns.smallLetter = 'N';
        sortGraph.ns.largeColor = sColor;
        sortGraph.ns.smallColor = nColor;
    }
    sortGraph.ns.largePercent = results(1, userObj);
    if (sortGraph.ns.largePercent == undefined) {
        sortGraph.ns.largePercent = 50
        sortGraph.ns.smallPercent = 50
    } else {
        sortGraph.ns.smallPercent = 100 - sortGraph.ns.largePercent;
    }

    // TF letters, colors, and percentages
    sortGraph.tf.largeLetter = letterByCategory(2, userObj);
    if (sortGraph.tf.largeLetter == '?') {
        sortGraph.tf.largeLetter = 'T';
        sortGraph.tf.smallLetter = 'F';
        sortGraph.tf.largeColor = tColor;
        sortGraph.tf.smallColor = fColor;
    } else if (sortGraph.tf.largeLetter == 'T') {
        sortGraph.tf.smallLetter = 'F';
        sortGraph.tf.largeColor = tColor;
        sortGraph.tf.smallColor = fColor;
    } else if (sortGraph.tf.largeLetter == 'F') {
        sortGraph.tf.smallLetter = 'T';
        sortGraph.tf.largeColor = fColor;
        sortGraph.tf.smallColor = tColor;
    }
    sortGraph.tf.largePercent = results(2, userObj);
    if (sortGraph.tf.largePercent == undefined) {
        sortGraph.tf.largePercent = 50
        sortGraph.tf.smallPercent = 50
    } else {
        sortGraph.tf.smallPercent = 100 - sortGraph.tf.largePercent;
    }

    // JP letters, colors, and percentages
    sortGraph.jp.largeLetter = letterByCategory(3, userObj);
    if (sortGraph.jp.largeLetter == '?') {
        sortGraph.jp.largeLetter = 'J';
        sortGraph.jp.smallLetter = 'P';
        sortGraph.jp.largeColor = jColor;
        sortGraph.jp.smallColor = pColor;
    } else if (sortGraph.jp.largeLetter == 'J') {
        sortGraph.jp.smallLetter = 'P';
        sortGraph.jp.largeColor = jColor;
        sortGraph.jp.smallColor = pColor;
    } else if (sortGraph.jp.largeLetter == 'P') {
        sortGraph.jp.smallLetter = 'J';
        sortGraph.jp.largeColor = pColor;
        sortGraph.jp.smallColor = jColor;
    }
    sortGraph.jp.largePercent = results(3, userObj);
    if (sortGraph.jp.largePercent == undefined) {
        sortGraph.jp.largePercent = 50
        sortGraph.jp.smallPercent = 50
    } else {
        sortGraph.jp.smallPercent = 100 - sortGraph.jp.largePercent;
    }

    // Sort the sortGraph (bubble sort)
    let mbtiArr = [sortGraph.ie, sortGraph.ns, sortGraph.tf, sortGraph.jp];
    let sorted = false;
    while (!sorted) {
        sorted = true;
        for (let i = 1; i < mbtiArr.length; i++) {
            if (mbtiArr[i].largePercent > mbtiArr[i - 1].largePercent) {
                let tempLetters = mbtiArr[i];
                mbtiArr[i] = mbtiArr[i - 1];
                mbtiArr[i - 1] = tempLetters;
                sorted = false;
            }
        }
    }
    // Apply mbtiArr sort to the sortGraph
    console.log('mbtiArr: ', mbtiArr);
    for (let i = 0; i < mbtiArr.length; i++) {
        if (mbtiArr[i].largeLetter == 'I' || mbtiArr[i].largeLetter == 'E') {
            sortGraph.ie.graphOrder = i;
        } else if (mbtiArr[i].largeLetter == 'N' || mbtiArr[i].largeLetter == 'S') {
            sortGraph.ns.graphOrder = i;
        } else if (mbtiArr[i].largeLetter == 'T' || mbtiArr[i].largeLetter == 'F') {
            sortGraph.tf.graphOrder = i;
        } else if (mbtiArr[i].largeLetter == 'J' || mbtiArr[i].largeLetter == 'P') {
            sortGraph.jp.graphOrder = i;
        }
    }

    console.log('sortGraph', sortGraph);


    let canvas = document.getElementById(barGraphId);
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
    let letterFont = (wid / 25) + "px Arial";
    // sortGraph.ie.c
    // let dpr = windowPixelRatio || 1;
    // context.scale(dpr, dpr)

    context.moveTo(0, 0);
    context.lineTo(canvas.width, 0);
    context.lineTo(canvas.width, canvas.height);
    context.lineTo(0, canvas.height);
    context.lineTo(0, 0);
    context.fillStyle = "#FF8800";
    context.stroke();

    // context.font = "30px Arial";
    // context.fillText("Hello World", 10, 50);

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
    // context.moveTo(0, graphMid);
    // context.lineTo(wid, graphMid);
    // context.fillStyle = "#DDDDDD";
    // context.stroke();

    // draw bar graphs
    // let mbtiArr = [sortGraph.ie, sortGraph.ns, sortGraph.tf, sortGraph.jp];
    for (let i = 0; i < 4; i++) {
        if (mbtiArr[i].graphOrder == 0) {
            // bigger bar
            context.beginPath();
            context.rect(barSpacing - barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].largePercent / 100));
            context.fillStyle = mbtiArr[i].largeColor;
            context.fill();
            // smaller bar
            context.beginPath();
            context.rect(barSpacing + barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].smallPercent / 100));
            context.fillStyle = mbtiArr[i].smallColor;
            context.fill();

            // large letter and percent
            context.font = letterFont;
            context.fillStyle = "black";
            context.fillText(mbtiArr[i].largeLetter, barSpacing - barWidth / 1.5, hei / 13);
            context.fillText(mbtiArr[i].largePercent + "%", barSpacing - barWidth / 1.5, hei / 6.5);
            // small letter and percent
            context.fillText(mbtiArr[i].smallLetter, barSpacing + barWidth / 1.5, - hei / 13 + graphMin - (graphHeight * mbtiArr[i].smallPercent / 100));
            context.fillText(mbtiArr[i].smallPercent + "%", barSpacing + barWidth / 1.5, - hei / 13 + hei / 14 + graphMin - (graphHeight * mbtiArr[i].smallPercent / 100));
        }
        if (mbtiArr[i].graphOrder == 1) {
            // bigger bar
            context.beginPath();
            context.rect(2 * barSpacing - barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].largePercent / 100));
            context.fillStyle = mbtiArr[i].largeColor;
            context.fill();
            // smaller bar
            context.beginPath();
            context.rect(2 * barSpacing + barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].smallPercent / 100));
            context.fillStyle = mbtiArr[i].smallColor;
            context.fill();

            // large letter and percent
            context.font = letterFont;
            context.fillStyle = "black";
            context.fillText(mbtiArr[i].largeLetter, 2 * barSpacing - barWidth / 1.5, hei / 13);
            context.fillText(mbtiArr[i].largePercent + "%", 2 * barSpacing - barWidth / 1.5, hei / 6.5);
            // small letter and percent
            context.fillText(mbtiArr[i].smallLetter, 2 * barSpacing + barWidth / 1.5, - hei / 13 + graphMin - (graphHeight * mbtiArr[i].smallPercent / 100));
            context.fillText(mbtiArr[i].smallPercent + "%", 2 * barSpacing + barWidth / 1.5, - hei / 13 + hei / 14 + graphMin - (graphHeight * mbtiArr[i].smallPercent / 100));
        }
        if (mbtiArr[i].graphOrder == 2) {
            // bigger bar
            context.beginPath();
            context.rect(3 * barSpacing - barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].largePercent / 100));
            context.fillStyle = mbtiArr[i].largeColor;
            context.fill();
            // smaller bar
            context.beginPath();
            context.rect(3 * barSpacing + barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].smallPercent / 100));
            context.fillStyle = mbtiArr[i].smallColor;
            context.fill();

            // large letter and percent
            context.font = letterFont;
            context.fillStyle = "black";
            context.fillText(mbtiArr[i].largeLetter, 3 * barSpacing - barWidth / 1.5, hei / 13);
            context.fillText(mbtiArr[i].largePercent + "%", 3 * barSpacing - barWidth / 1.5, hei / 6.5);
            // small letter and percent
            context.fillText(mbtiArr[i].smallLetter, 3 * barSpacing + barWidth / 1.5, - hei / 13 + graphMin - (graphHeight * mbtiArr[i].smallPercent / 100));
            context.fillText(mbtiArr[i].smallPercent + "%", 3 * barSpacing + barWidth / 1.5, - hei / 13 + hei / 14 + graphMin - (graphHeight * mbtiArr[i].smallPercent / 100));
        }
        if (mbtiArr[i].graphOrder == 3) {
            // bigger bar
            context.beginPath();
            context.rect(4 * barSpacing - barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].largePercent / 100));
            context.fillStyle = mbtiArr[i].largeColor;
            context.fill();
            // smaller bar
            context.beginPath();
            context.rect(4 * barSpacing + barWidth / 1.5, graphMin, barWidth, -(graphHeight * mbtiArr[i].smallPercent / 100));
            context.fillStyle = mbtiArr[i].smallColor;
            context.fill();

            // large letter and percent
            context.font = letterFont;
            context.fillStyle = "black";
            context.fillText(mbtiArr[i].largeLetter, 4 * barSpacing - barWidth / 1.5, hei / 13);
            context.fillText(mbtiArr[i].largePercent + "%", 4 * barSpacing - barWidth / 1.5, hei / 6.5);
            // small letter and percent
            context.fillText(mbtiArr[i].smallLetter, 4 * barSpacing + barWidth / 1.5, - hei / 13 + graphMin - (graphHeight * mbtiArr[i].smallPercent / 100));
            context.fillText(mbtiArr[i].smallPercent + "%", 4 * barSpacing + barWidth / 1.5, - hei / 13 + hei / 14 + graphMin - (graphHeight * mbtiArr[i].smallPercent / 100));
        }
    }

}


export { mbtiBarGraph };