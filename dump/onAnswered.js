/*
if (qq.label[0] == 'q') {
    let categories = qq.list[2].split('|');

    let catLetters = ["IE", "NS", "TF", "JP"];

    for (let i = 0; i < categories.length; i++) {
        let totLbl = '_'+catLetters[categories[i]];
        console.log("typeof $a",typeof $a(totLbl));
        if ("undefined" === typeof $a(totLbl)) {
            $set(totLbl, 0);
        }
        if ("undefined" === typeof $a(totLbl+'_count')) {
            $set(totLbl+'_count', 0);
        }
        $set(totLbl+'_count', $a(totLbl+'_count')+1);
        $set(totLbl, $a(totLbl)+dbVal);
    }
}
*/
