import './slider.html';
Template.qqslider.helpers({
    getReadingsAsJSON(question) {
        return JSON.stringify(question.text);
    },
    leftText(qq) {
        //console.log("left!",qq);
        let splt = qq.list[0].split(";");
        if (splt.length === 1) {
            return "";
        }
        return splt[splt.length-1];
    },
    rightText(qq) {
        //console.log("right!",qq);
        let splt = qq.list[1].split(";");
        if (splt.length === 1) {
            return "";
        }
        return splt[splt.length-1];
    }
});
Template.qqslider.onRendered(function() {
    //console.log("onRendered", this);
    let updateValue = function(elem, value) {
        let parent = $(elem).data('value', value);
        parent.find('div.left-option span.percent').html(Math.abs(Math.round(value) - 50)+"%");
        parent.find('div.right-option span.percent').html((Math.round(value) + 50)+"%");
        updateBGOpacity($(elem).find('.left-option'), 0.5 - (value / 100));
        updateBGOpacity($(elem).find('.right-option'), 0.5 + (value / 100));
        updateReading(parent, value);
    };
    let updateReading = function(elem, value) {
        let readings = $(elem).data('readings');
        let index = -1;
        let curMax = (value < 0 ? -100 : 100);
        $.each(readings, function (i, reading) {
            if((value < 0 && reading.Rank <= value && reading.Rank > curMax) || (value > 0 && reading.Rank >= value && reading.Rank < curMax)) {
                index = i;
                curMax = reading.Rank;
            }
        });
        if(index < 0) { return; }
        $(elem).find('div.reading').html(readings[index].Text);
    };
    let updateBGOpacity = function(elem, value) {
        let m;
        m = $(elem).css('background-color').replace(/^rgba?\(|\s+|\)$/g,'').split(',');
        let btn = $(elem).parents('div.answer-question').find('button.answer-button');
        let reading = $(elem).parents('div.answer-question').find('div.reading');
        reading.css('visibility', 'visible');
        btn.css('visibility','visible');
        if(value > 0.5) {
            $(elem).css('color','white');
        } else if(value == 0.5) {
            $(elem).css('color','Grey');
            btn.css('visibility','hidden');
            reading.css('visibility','hidden');
            value = 0.1;
        } else {
            $(elem).css('color','black');
        }
        let newRGBA = "rgba("+m[0]+", "+m[1]+", "+m[2]+", "+value+")";
        $(elem).css('background-color', newRGBA);
        //console.log($(elem).css('background-color'), m, newRGBA, value);
    }
    $('.slider', this.firstNode).each(function () {
        $(this).noUiSlider({
            start: $(this).data('value'),
            step:1,
            range: {
                min:-50,
                max:50
            }
        }).on('slide', function(event, val){ //console.log(arguments);
            updateValue($(event.target).closest('.answer-question'), val);
        }).on('set', function(event, val){
            updateValue($(event.target).closest('.answer-question'), val);
        });
        updateValue($(this).closest('.answer-question'), $(this).data('value'));
    });
});
