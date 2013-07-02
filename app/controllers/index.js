var countly = require('count.ly');
countly.start('e068932d185d525a2ee3ed0119a45a31151b4bd7','http://goheritage.info');

var lastTarget;

function round() {
    return $.roundSwitch.value === true;
}

function reset() {
    lastTarget = undefined;
    $.x1.value = 1024;
    $.y1.value = 768;
    $.x2.value = '';
    $.y2.value = '';
    $.x1.blur();
    $.y1.blur();
    $.x2.blur();
    $.y2.blur();
    onKeyup({});
}

/**
 * Reduce a numerator and denominator to it's smallest, integer ratio using Euclid's Algorithm
 */
function reduceRatio(numerator, denominator) {
    var gcd, temp, divisor;

    // from: http://pages.pacificcoast.net/~cazelais/euclid.html
    gcd = function (a, b) {
        if (b === 0) return a;
        return gcd(b, a % b);
    }

    // take care of some simple cases
    if (!isInteger(numerator) || !isInteger(denominator)) return '? : ?';
    if (numerator === denominator) return '1 : 1';

    // make sure numerator is always the larger number
    if (+numerator < +denominator) {
        temp        = numerator;
        numerator   = denominator;
        denominator = temp;
    }

    divisor = gcd(+numerator, +denominator);

    return 'undefined' === typeof temp ? (numerator / divisor) + ' : ' + (denominator / divisor) : (denominator / divisor) + ' : ' + (numerator / divisor);
};

function ratio2css(numerator, denominator) {
    var width, height;

    if (+numerator > +denominator) {
        width  = 200;
        height = solve(width, undefined, numerator, denominator);
    }
    else {
        height = 200;
        width  = solve(undefined, height, numerator, denominator);
    }

    return {
        width      : width + 'px',
        height     : height + 'px',
        lineHeight : height + 'px'
    };
}

/**
 * Determine whether a value is an integer (ie. only numbers)
 */
function isInteger(value) {
    return /^[0-9]+$/.test(value);
};

/**
 * Solve for the 4th value
 * @param int num2 Numerator from the right side of the equation
 * @param int den2 Denominator from the right side of the equation
 * @param int num1 Numerator from the left side of the equation
 * @param int den1 Denominator from the left side of the equation
 * @return int
 */
function solve(width, height, numerator, denominator) {
    var value;

//    Ti.API.info(width +' ' + height);

    // solve for width
    if ('undefined' !== typeof width) {
        value = Math.round(width / (numerator / denominator)); // : width / (numerator / denominator);
      //  Ti.API.info('width ' + typeof width);
    }
    // solve for height
    else if ('undefined' !== typeof height) {
        value = Math.round(height * (numerator / denominator)); // : height * (numerator / denominator);
     //   Ti.API.info('height ' + typeof height);
    }

    return value;
}

/**
 * Handle a keyup event
 */
function onKeyup(evt) {
    var x1, y1, x2, y2, x1v, y1v, x2v, y2v, ratio;

    lastTarget = evt.source;

    x1 = $.x1;
    y1 = $.y1;
    x2 = $.x2;
    y2 = $.y2;

    x1v = x1.value;
    y1v = y1.value;
    x2v = x2.value;
    y2v = y2.value;

    // display new ratio
    ratio = reduceRatio(x1v, y1v);
    $.ratio.text = ratio;
//    $('#visual-ratio').css(ratio2css(x1v, y1v));
//    resizeSample();

	Ti.API.info(evt.source + ' ' + x2);

    switch(evt.source) {
        case x1:
            if (!isInteger(x1v) || !isInteger(y1v) || !isInteger(y2v)) return;
            $.x2.value = solve(undefined, y2v, x1v, y1v);
            break;
        case y1:
            if (!isInteger(y1v) || !isInteger(x1v) || !isInteger(x2v)) return;
            $.y2.value = solve(x2v, undefined, x1v, y1v);
            break;
        case x2:
            if (!isInteger(x2v) || !isInteger(x1v) || !isInteger(y1v)) return;
            $.y2.value = solve(x2v, undefined, x1v, y1v);
            break;
        case y2:
            if (!isInteger(y2v) || !isInteger(x1v) || !isInteger(y1v)) return;
            $.x2.value = solve(undefined, y2v, x1v, y1v);
            break;
    }

    return false;
};
// END: onKeyup
$.x1.addEventListener('focus', function(e) {
	$.x1.addEventListener('change', onKeyup);
});
$.x1.addEventListener('blur', function(e) {
	$.x1.removeEventListener('change', onKeyup);
});
$.y1.addEventListener('focus', function(e) {
	$.y1.addEventListener('change', onKeyup);
});
$.y1.addEventListener('blur', function(e) {
	$.y1.removeEventListener('change', onKeyup);
});
$.x2.addEventListener('focus', function(e) {
	$.x2.addEventListener('change', onKeyup);
});
$.x2.addEventListener('blur', function(e) {
	$.x2.removeEventListener('change', onKeyup);
});
$.y2.addEventListener('focus', function(e) {
	$.y2.addEventListener('change', onKeyup);
});
$.y2.addEventListener('blur', function(e) {
	$.y2.removeEventListener('change', onKeyup);
});
$.y1.addEventListener('return', onKeyup);
$.x2.addEventListener('return', onKeyup);
$.y2.addEventListener('return', onKeyup);

// reset values
$.reset.addEventListener('click', function (evt) {
    reset();
});
/*
function hideSample() {
    $('#visual-ratio').html('Example').css({ backgroundImage : 'none' });
}


function showSample() {
    var img;
    img     = document.createElement('IMG');
    img.src = $('input[name=sample-url]').val();
    img.onload = resizeSample;
    $('#visual-ratio').html('').append(img);
}

function resizeSample() {
    var img, imgRatio, width, height, boxRatio, imgW, imgH, css;

    if (0 === $('input[name=sample-display]:checked').length) {
        return;
    }

    img = $('#visual-ratio img');

    imgRatio = img.width() / img.height();

    width  = $('#visual-ratio').width();
    height = $('#visual-ratio').height();

    boxRatio = width / height;

    function cropToWidth() {
        img.css({ width  : width + 'px', height : 'auto' });
        img.css({ top  : 0 - Math.round((img.height() - height) / 2) + 'px', left : 0 });
    }

    function cropToHeight() {
        img.css({ width  : 'auto', height : height + 'px' });
        img.css({ top  : 0, left : 0 - Math.round((img.width() - width) / 2) + 'px' });
    }

    function boxToWidth() {
        img.css({ width  : width + 'px', height : 'auto' });
        img.css({ top  : Math.round((height - img.height()) / 2) + 'px', left : 0 });
    }

    function boxToHeight() {
        img.css({ width  : 'auto', height : height + 'px' });
        img.css({ top  : 0, left : Math.round((width - img.width()) / 2) + 'px' });
    }

    if ('crop' === $(selectors.crop).val()) {
        if (imgRatio > boxRatio) {
            cropToHeight();
        }
        else {
            cropToWidth();
        }
    }
    else { // box
        if (imgRatio > boxRatio) {
            boxToWidth();
        }
        else {
            boxToHeight();
        }
    }
}

// show sample
$('input[name=sample-display]').click(function (evt) {
    if (true === this.checked) {
        $('#croptions').show();
        showSample();
    }
    else {
        $('#croptions').hide();
        hideSample();
    }
});

$(selectors.crops).click(function (evt) {
    resizeSample();
});

$('input[name=sample-url]').keyup(function (evt) {
    hideSample();
    showSample();
});
*/
// hit the function to get things in the right state
onKeyup({});

$.ratio.addEventListener('click', function() {
	$.x1.blur();
    $.y1.blur();
    $.x2.blur();
    $.y2.blur();
});

$.index.open();

