if ("undefined" === typeof Meteor) {
    //console.log("ttttttttttttttttttt");
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('questions.json')
});
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://localhost:27017/";

let i = 0;

let qnaire = {
    "_id":"5c9544d9baef97574",
    title: 'mbti',
    description: 'Myers-Briggs Trait Inventory',
    onAnswered: `
if (qq.label[0] == 'q') {
    let categories = qq.list[2].split('|');

    let catLetters = ["IE", "NS", "TF", "JP"];

    for (let i = 0; i < categories.length; i++) {
        let totLbl = '_'+catLetters[categories[i]];
        console.log("typeof $a",typeof $a(totLbl));
        console.log("totLbl", totLbl);
        if ("undefined" === typeof $a(totLbl)) {
			console.log('onanswered undefined 1')
            $set(totLbl, 0);
        }
        if ("undefined" === typeof $a(totLbl+'_count')) {
			console.log('onanswered undefined 2')
            $set(totLbl+'_count', 0);
        }
        $set(totLbl+'_count', $a(totLbl+'_count')+1);
		console.log('onanswered defined 1, totLbl+"_count", $a(totLbl+"_count")+1', totLbl+'_count', $a(totLbl+'_count')+1)
        $set(totLbl, $a(totLbl)+dbVal);
		console.log('onanswered devined 2 totLbl, $a(totLbl)+dbVal', totLbl, $a(totLbl)+dbVal)
    }
}
`,
//    onAnswered: `
//if (qq.label[0] == 'q') {
//    let categories = qq.list[2].split('|');
//
//    let catLetters = ["IE", "NS", "TF", "JP"];
//
//    for (let i = 0; i < categories.length; i++) {
//        let totLbl = '_'+catLetters[categories[i]];
//        console.log("typeof $a",typeof $a(totLbl));
//        if ("undefined" === typeof $a(totLbl)) {
//            $set(totLbl, 0);
//        }
//        if ("undefined" === typeof $a(totLbl+'_count')) {
//            $set(totLbl+'_count', 0);
//        }
//        $set(totLbl+'_count', $a(totLbl+'_count')+1);
//        $set(totLbl, $a(totLbl)+dbVal);
//    }
//}
//`,
    questions: [
        {
            label:"_IE",
            qtype: 1,
            deactivated: true
        },
        {
            label:"_NS",
            qtype: 1,
            deactivated: true
        },
        {
            label:"_TF",
            qtype: 1,
            dactivated: true
        },
        {
            label:"_JP",
            qtype: 1,
            deactivated: true
        },
        {
            label:"_IE_count",
            qtype: 1,
            deactivated: true
        },
        {
            label:"_NS_count",
            qtype: 1,
            deactivated: true
        },
        {
            label:"_TF_count",
            qtype: 1,
            dactivated: true
        },
        {
            label:"_JP_count",
            qtype: 1,
            deactivated: true
        },
    ],
    qqPerPage: 4
}
let delimiter = '|';
let converted = {}, old = {};
lineReader.on('line', function (line) {
    converted = {}, old = {};
    //console.log(old);
    old = JSON.parse(line);
    i++;
    converted.label = "q" + i;
    converted.text = '';//JSON.stringify(old.Readings);
    converted.template = "qqslider";
    converted.qtype = 1;
    converted.list = [];
    converted.list[0] = "-50"+delimiter+old.LeftText;
    converted.list[1] = "50"+delimiter+old.RightText;
    let cats = [];
    for (let j = 0; j < old.Categories.length; j++) {
        cats[j] = old.Categories[j]['$numberInt'];
    }
    converted.list[2] = cats.join(delimiter);
    for (let j = 0; j < old.Readings.length; j++) {
        converted.list[j+3] = old.Readings[j].Rank["$numberInt"] + delimiter + old.Readings[j].Text;
    }
    converted.condition = "";
    converted.onAnswered = "";
    converted.createdAt = new Date(parseInt(old.createdAt['$date']['$numberLong']));
    converted.updatedAt = new Date(parseInt(old.updatedAt['$date']['$numberLong']));
    //console.log(converted);
    qnaire.questions.push(converted);
    //console.log(converted.list);
    //if (i > 5) {
    //    lineReader.close();
    //}
});

lineReader.on('close', function() {
    console.log('[' + JSON.stringify(qnaire) + ']');
    //console.log('goodbye!');
    process.exit(0);
	
});
}
