//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rcy_nouislider/packages/rcy_nouislider.js                //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rcy:nouislider/lib/jquery.nouislider.all.js                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/*! noUiSlider - 7.0.6 - 2014-09-11 20:29:06 */                                                                      // 1
                                                                                                                     // 2
(function(){                                                                                                         // 3
                                                                                                                     // 4
        'use strict';                                                                                                // 5
                                                                                                                     // 6
var                                                                                                                  // 7
/** @const */ FormatOptions = [                                                                                      // 8
        'decimals',                                                                                                  // 9
        'thousand',                                                                                                  // 10
        'mark',                                                                                                      // 11
        'prefix',                                                                                                    // 12
        'postfix',                                                                                                   // 13
        'encoder',                                                                                                   // 14
        'decoder',                                                                                                   // 15
        'negativeBefore',                                                                                            // 16
        'negative',                                                                                                  // 17
        'edit',                                                                                                      // 18
        'undo'                                                                                                       // 19
];                                                                                                                   // 20
                                                                                                                     // 21
// General                                                                                                           // 22
                                                                                                                     // 23
        // Reverse a string                                                                                          // 24
        function strReverse ( a ) {                                                                                  // 25
                return a.split('').reverse().join('');                                                               // 26
        }                                                                                                            // 27
                                                                                                                     // 28
        // Check if a string starts with a specified prefix.                                                         // 29
        function strStartsWith ( input, match ) {                                                                    // 30
                return input.substring(0, match.length) === match;                                                   // 31
        }                                                                                                            // 32
                                                                                                                     // 33
        // Check is a string ends in a specified postfix.                                                            // 34
        function strEndsWith ( input, match ) {                                                                      // 35
                return input.slice(-1 * match.length) === match;                                                     // 36
        }                                                                                                            // 37
                                                                                                                     // 38
        // Throw an error if formatting options are incompatible.                                                    // 39
        function throwEqualError( F, a, b ) {                                                                        // 40
                if ( (F[a] || F[b]) && (F[a] === F[b]) ) {                                                           // 41
                        throw new Error(a);                                                                          // 42
                }                                                                                                    // 43
        }                                                                                                            // 44
                                                                                                                     // 45
        // Check if a number is finite and not NaN                                                                   // 46
        function isValidNumber ( input ) {                                                                           // 47
                return typeof input === 'number' && isFinite( input );                                               // 48
        }                                                                                                            // 49
                                                                                                                     // 50
        // Provide rounding-accurate toFixed method.                                                                 // 51
        function toFixed ( value, decimals ) {                                                                       // 52
                var scale = Math.pow(10, decimals);                                                                  // 53
                return ( Math.round(value * scale) / scale).toFixed( decimals );                                     // 54
        }                                                                                                            // 55
                                                                                                                     // 56
                                                                                                                     // 57
// Formatting                                                                                                        // 58
                                                                                                                     // 59
        // Accept a number as input, output formatted string.                                                        // 60
        function formatTo ( decimals, thousand, mark, prefix, postfix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {
                                                                                                                     // 62
                var originalInput = input, inputIsNegative, inputPieces, inputBase, inputDecimals = '', output = ''; // 63
                                                                                                                     // 64
                // Apply user encoder to the input.                                                                  // 65
                // Expected outcome: number.                                                                         // 66
                if ( encoder ) {                                                                                     // 67
                        input = encoder(input);                                                                      // 68
                }                                                                                                    // 69
                                                                                                                     // 70
                // Stop if no valid number was provided, the number is infinite or NaN.                              // 71
                if ( !isValidNumber(input) ) {                                                                       // 72
                        return false;                                                                                // 73
                }                                                                                                    // 74
                                                                                                                     // 75
                // Rounding away decimals might cause a value of -0                                                  // 76
                // when using very small ranges. Remove those cases.                                                 // 77
                if ( decimals && parseFloat(input.toFixed(decimals)) === 0 ) {                                       // 78
                        input = 0;                                                                                   // 79
                }                                                                                                    // 80
                                                                                                                     // 81
                // Formatting is done on absolute numbers,                                                           // 82
                // decorated by an optional negative symbol.                                                         // 83
                if ( input < 0 ) {                                                                                   // 84
                        inputIsNegative = true;                                                                      // 85
                        input = Math.abs(input);                                                                     // 86
                }                                                                                                    // 87
                                                                                                                     // 88
                // Reduce the number of decimals to the specified option.                                            // 89
                if ( decimals !== false ) {                                                                          // 90
                        input = toFixed( input, decimals );                                                          // 91
                }                                                                                                    // 92
                                                                                                                     // 93
                // Transform the number into a string, so it can be split.                                           // 94
                input = input.toString();                                                                            // 95
                                                                                                                     // 96
                // Break the number on the decimal separator.                                                        // 97
                if ( input.indexOf('.') !== -1 ) {                                                                   // 98
                        inputPieces = input.split('.');                                                              // 99
                                                                                                                     // 100
                        inputBase = inputPieces[0];                                                                  // 101
                                                                                                                     // 102
                        if ( mark ) {                                                                                // 103
                                inputDecimals = mark + inputPieces[1];                                               // 104
                        }                                                                                            // 105
                                                                                                                     // 106
                } else {                                                                                             // 107
                                                                                                                     // 108
                // If it isn't split, the entire number will do.                                                     // 109
                        inputBase = input;                                                                           // 110
                }                                                                                                    // 111
                                                                                                                     // 112
                // Group numbers in sets of three.                                                                   // 113
                if ( thousand ) {                                                                                    // 114
                        inputBase = strReverse(inputBase).match(/.{1,3}/g);                                          // 115
                        inputBase = strReverse(inputBase.join( strReverse( thousand ) ));                            // 116
                }                                                                                                    // 117
                                                                                                                     // 118
                // If the number is negative, prefix with negation symbol.                                           // 119
                if ( inputIsNegative && negativeBefore ) {                                                           // 120
                        output += negativeBefore;                                                                    // 121
                }                                                                                                    // 122
                                                                                                                     // 123
                // Prefix the number                                                                                 // 124
                if ( prefix ) {                                                                                      // 125
                        output += prefix;                                                                            // 126
                }                                                                                                    // 127
                                                                                                                     // 128
                // Normal negative option comes after the prefix. Defaults to '-'.                                   // 129
                if ( inputIsNegative && negative ) {                                                                 // 130
                        output += negative;                                                                          // 131
                }                                                                                                    // 132
                                                                                                                     // 133
                // Append the actual number.                                                                         // 134
                output += inputBase;                                                                                 // 135
                output += inputDecimals;                                                                             // 136
                                                                                                                     // 137
                // Apply the postfix.                                                                                // 138
                if ( postfix ) {                                                                                     // 139
                        output += postfix;                                                                           // 140
                }                                                                                                    // 141
                                                                                                                     // 142
                // Run the output through a user-specified post-formatter.                                           // 143
                if ( edit ) {                                                                                        // 144
                        output = edit ( output, originalInput );                                                     // 145
                }                                                                                                    // 146
                                                                                                                     // 147
                // All done.                                                                                         // 148
                return output;                                                                                       // 149
        }                                                                                                            // 150
                                                                                                                     // 151
        // Accept a sting as input, output decoded number.                                                           // 152
        function formatFrom ( decimals, thousand, mark, prefix, postfix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {
                                                                                                                     // 154
                var originalInput = input, inputIsNegative, output = '';                                             // 155
                                                                                                                     // 156
                // User defined pre-decoder. Result must be a non empty string.                                      // 157
                if ( undo ) {                                                                                        // 158
                        input = undo(input);                                                                         // 159
                }                                                                                                    // 160
                                                                                                                     // 161
                // Test the input. Can't be empty.                                                                   // 162
                if ( !input || typeof input !== 'string' ) {                                                         // 163
                        return false;                                                                                // 164
                }                                                                                                    // 165
                                                                                                                     // 166
                // If the string starts with the negativeBefore value: remove it.                                    // 167
                // Remember is was there, the number is negative.                                                    // 168
                if ( negativeBefore && strStartsWith(input, negativeBefore) ) {                                      // 169
                        input = input.replace(negativeBefore, '');                                                   // 170
                        inputIsNegative = true;                                                                      // 171
                }                                                                                                    // 172
                                                                                                                     // 173
                // Repeat the same procedure for the prefix.                                                         // 174
                if ( prefix && strStartsWith(input, prefix) ) {                                                      // 175
                        input = input.replace(prefix, '');                                                           // 176
                }                                                                                                    // 177
                                                                                                                     // 178
                // And again for negative.                                                                           // 179
                if ( negative && strStartsWith(input, negative) ) {                                                  // 180
                        input = input.replace(negative, '');                                                         // 181
                        inputIsNegative = true;                                                                      // 182
                }                                                                                                    // 183
                                                                                                                     // 184
                // Remove the postfix.                                                                               // 185
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice     // 186
                if ( postfix && strEndsWith(input, postfix) ) {                                                      // 187
                        input = input.slice(0, -1 * postfix.length);                                                 // 188
                }                                                                                                    // 189
                                                                                                                     // 190
                // Remove the thousand grouping.                                                                     // 191
                if ( thousand ) {                                                                                    // 192
                        input = input.split(thousand).join('');                                                      // 193
                }                                                                                                    // 194
                                                                                                                     // 195
                // Set the decimal separator back to period.                                                         // 196
                if ( mark ) {                                                                                        // 197
                        input = input.replace(mark, '.');                                                            // 198
                }                                                                                                    // 199
                                                                                                                     // 200
                // Prepend the negative symbol.                                                                      // 201
                if ( inputIsNegative ) {                                                                             // 202
                        output += '-';                                                                               // 203
                }                                                                                                    // 204
                                                                                                                     // 205
                // Add the number                                                                                    // 206
                output += input;                                                                                     // 207
                                                                                                                     // 208
                // Trim all non-numeric characters (allow '.' and '-');                                              // 209
                output = output.replace(/[^0-9\.\-.]/g, '');                                                         // 210
                                                                                                                     // 211
                // The value contains no parse-able number.                                                          // 212
                if ( output === '' ) {                                                                               // 213
                        return false;                                                                                // 214
                }                                                                                                    // 215
                                                                                                                     // 216
                // Covert to number.                                                                                 // 217
                output = Number(output);                                                                             // 218
                                                                                                                     // 219
                // Run the user-specified post-decoder.                                                              // 220
                if ( decoder ) {                                                                                     // 221
                        output = decoder(output);                                                                    // 222
                }                                                                                                    // 223
                                                                                                                     // 224
                // Check is the output is valid, otherwise: return false.                                            // 225
                if ( !isValidNumber(output) ) {                                                                      // 226
                        return false;                                                                                // 227
                }                                                                                                    // 228
                                                                                                                     // 229
                return output;                                                                                       // 230
        }                                                                                                            // 231
                                                                                                                     // 232
                                                                                                                     // 233
// Framework                                                                                                         // 234
                                                                                                                     // 235
        // Validate formatting options                                                                               // 236
        function validate ( inputOptions ) {                                                                         // 237
                                                                                                                     // 238
                var i, optionName, optionValue,                                                                      // 239
                        filteredOptions = {};                                                                        // 240
                                                                                                                     // 241
                for ( i = 0; i < FormatOptions.length; i+=1 ) {                                                      // 242
                                                                                                                     // 243
                        optionName = FormatOptions[i];                                                               // 244
                        optionValue = inputOptions[optionName];                                                      // 245
                                                                                                                     // 246
                        if ( optionValue === undefined ) {                                                           // 247
                                                                                                                     // 248
                                // Only default if negativeBefore isn't set.                                         // 249
                                if ( optionName === 'negative' && !filteredOptions.negativeBefore ) {                // 250
                                        filteredOptions[optionName] = '-';                                           // 251
                                // Don't set a default for mark when 'thousand' is set.                              // 252
                                } else if ( optionName === 'mark' && filteredOptions.thousand !== '.' ) {            // 253
                                        filteredOptions[optionName] = '.';                                           // 254
                                } else {                                                                             // 255
                                        filteredOptions[optionName] = false;                                         // 256
                                }                                                                                    // 257
                                                                                                                     // 258
                        // Floating points in JS are stable up to 7 decimals.                                        // 259
                        } else if ( optionName === 'decimals' ) {                                                    // 260
                                if ( optionValue >= 0 && optionValue < 8 ) {                                         // 261
                                        filteredOptions[optionName] = optionValue;                                   // 262
                                } else {                                                                             // 263
                                        throw new Error(optionName);                                                 // 264
                                }                                                                                    // 265
                                                                                                                     // 266
                        // These options, when provided, must be functions.                                          // 267
                        } else if ( optionName === 'encoder' || optionName === 'decoder' || optionName === 'edit' || optionName === 'undo' ) {
                                if ( typeof optionValue === 'function' ) {                                           // 269
                                        filteredOptions[optionName] = optionValue;                                   // 270
                                } else {                                                                             // 271
                                        throw new Error(optionName);                                                 // 272
                                }                                                                                    // 273
                                                                                                                     // 274
                        // Other options are strings.                                                                // 275
                        } else {                                                                                     // 276
                                                                                                                     // 277
                                if ( typeof optionValue === 'string' ) {                                             // 278
                                        filteredOptions[optionName] = optionValue;                                   // 279
                                } else {                                                                             // 280
                                        throw new Error(optionName);                                                 // 281
                                }                                                                                    // 282
                        }                                                                                            // 283
                }                                                                                                    // 284
                                                                                                                     // 285
                // Some values can't be extracted from a                                                             // 286
                // string if certain combinations are present.                                                       // 287
                throwEqualError(filteredOptions, 'mark', 'thousand');                                                // 288
                throwEqualError(filteredOptions, 'prefix', 'negative');                                              // 289
                throwEqualError(filteredOptions, 'prefix', 'negativeBefore');                                        // 290
                                                                                                                     // 291
                return filteredOptions;                                                                              // 292
        }                                                                                                            // 293
                                                                                                                     // 294
        // Pass all options as function arguments                                                                    // 295
        function passAll ( options, method, input ) {                                                                // 296
                var i, args = [];                                                                                    // 297
                                                                                                                     // 298
                // Add all options in order of FormatOptions                                                         // 299
                for ( i = 0; i < FormatOptions.length; i+=1 ) {                                                      // 300
                        args.push(options[FormatOptions[i]]);                                                        // 301
                }                                                                                                    // 302
                                                                                                                     // 303
                // Append the input, then call the method, presenting all                                            // 304
                // options as arguments.                                                                             // 305
                args.push(input);                                                                                    // 306
                return method.apply('', args);                                                                       // 307
        }                                                                                                            // 308
                                                                                                                     // 309
        /** @constructor */                                                                                          // 310
        function wNumb ( options ) {                                                                                 // 311
                                                                                                                     // 312
                if ( !(this instanceof wNumb) ) {                                                                    // 313
                        return new wNumb ( options );                                                                // 314
                }                                                                                                    // 315
                                                                                                                     // 316
                if ( typeof options !== "object" ) {                                                                 // 317
                        return;                                                                                      // 318
                }                                                                                                    // 319
                                                                                                                     // 320
                options = validate(options);                                                                         // 321
                                                                                                                     // 322
                // Call 'formatTo' with proper arguments.                                                            // 323
                this.to = function ( input ) {                                                                       // 324
                        return passAll(options, formatTo, input);                                                    // 325
                };                                                                                                   // 326
                                                                                                                     // 327
                // Call 'formatFrom' with proper arguments.                                                          // 328
                this.from = function ( input ) {                                                                     // 329
                        return passAll(options, formatFrom, input);                                                  // 330
                };                                                                                                   // 331
        }                                                                                                            // 332
                                                                                                                     // 333
        /** @export */                                                                                               // 334
        window.wNumb = wNumb;                                                                                        // 335
                                                                                                                     // 336
}());                                                                                                                // 337
                                                                                                                     // 338
/*jslint browser: true */                                                                                            // 339
/*jslint white: true */                                                                                              // 340
                                                                                                                     // 341
(function( $ ){                                                                                                      // 342
                                                                                                                     // 343
        'use strict';                                                                                                // 344
                                                                                                                     // 345
// Helpers                                                                                                           // 346
                                                                                                                     // 347
        // Test in an object is an instance of jQuery or Zepto.                                                      // 348
        function isInstance ( a ) {                                                                                  // 349
                return a instanceof $ || ( $.zepto && $.zepto.isZ(a) );                                              // 350
        }                                                                                                            // 351
                                                                                                                     // 352
                                                                                                                     // 353
// Link types                                                                                                        // 354
                                                                                                                     // 355
        function fromPrefix ( target, method ) {                                                                     // 356
                                                                                                                     // 357
                // If target is a string, a new hidden input will be created.                                        // 358
                if ( typeof target === 'string' && target.indexOf('-inline-') === 0 ) {                              // 359
                                                                                                                     // 360
                        // By default, use the 'html' method.                                                        // 361
                        this.method = method || 'html';                                                              // 362
                                                                                                                     // 363
                        // Use jQuery to create the element                                                          // 364
                        this.target = this.el = $( target.replace('-inline-', '') || '<div/>' );                     // 365
                                                                                                                     // 366
                        return true;                                                                                 // 367
                }                                                                                                    // 368
        }                                                                                                            // 369
                                                                                                                     // 370
        function fromString ( target ) {                                                                             // 371
                                                                                                                     // 372
                // If the string doesn't begin with '-', which is reserved, add a new hidden input.                  // 373
                if ( typeof target === 'string' && target.indexOf('-') !== 0 ) {                                     // 374
                                                                                                                     // 375
                        this.method = 'val';                                                                         // 376
                                                                                                                     // 377
                        var element = document.createElement('input');                                               // 378
                                element.name = target;                                                               // 379
                                element.type = 'hidden';                                                             // 380
                        this.target = this.el = $(element);                                                          // 381
                                                                                                                     // 382
                        return true;                                                                                 // 383
                }                                                                                                    // 384
        }                                                                                                            // 385
                                                                                                                     // 386
        function fromFunction ( target ) {                                                                           // 387
                                                                                                                     // 388
                // The target can also be a function, which will be called.                                          // 389
                if ( typeof target === 'function' ) {                                                                // 390
                        this.target = false;                                                                         // 391
                        this.method = target;                                                                        // 392
                                                                                                                     // 393
                        return true;                                                                                 // 394
                }                                                                                                    // 395
        }                                                                                                            // 396
                                                                                                                     // 397
        function fromInstance ( target, method ) {                                                                   // 398
                                                                                                                     // 399
                if ( isInstance( target ) && !method ) {                                                             // 400
                                                                                                                     // 401
                // If a jQuery/Zepto input element is provided, but no method is set,                                // 402
                // the element can assume it needs to respond to 'change'...                                         // 403
                        if ( target.is('input, select, textarea') ) {                                                // 404
                                                                                                                     // 405
                                // Default to .val if this is an input element.                                      // 406
                                this.method = 'val';                                                                 // 407
                                                                                                                     // 408
                                // Fire the API changehandler when the target changes.                               // 409
                                this.target = target.on('change.liblink', this.changeHandler);                       // 410
                                                                                                                     // 411
                        } else {                                                                                     // 412
                                                                                                                     // 413
                                this.target = target;                                                                // 414
                                                                                                                     // 415
                                // If no method is set, and we are not auto-binding an input, default to 'html'.     // 416
                                this.method = 'html';                                                                // 417
                        }                                                                                            // 418
                                                                                                                     // 419
                        return true;                                                                                 // 420
                }                                                                                                    // 421
        }                                                                                                            // 422
                                                                                                                     // 423
        function fromInstanceMethod ( target, method ) {                                                             // 424
                                                                                                                     // 425
                // The method must exist on the element.                                                             // 426
                if ( isInstance( target ) &&                                                                         // 427
                        (typeof method === 'function' ||                                                             // 428
                                (typeof method === 'string' && target[method]))                                      // 429
                ) {                                                                                                  // 430
                        this.method = method;                                                                        // 431
                        this.target = target;                                                                        // 432
                                                                                                                     // 433
                        return true;                                                                                 // 434
                }                                                                                                    // 435
        }                                                                                                            // 436
                                                                                                                     // 437
var                                                                                                                  // 438
/** @const */                                                                                                        // 439
        creationFunctions = [fromPrefix, fromString, fromFunction, fromInstance, fromInstanceMethod];                // 440
                                                                                                                     // 441
                                                                                                                     // 442
// Link Instance                                                                                                     // 443
                                                                                                                     // 444
/** @constructor */                                                                                                  // 445
        function Link ( target, method, format ) {                                                                   // 446
                                                                                                                     // 447
                var that = this, valid = false;                                                                      // 448
                                                                                                                     // 449
                // Forward calls within scope.                                                                       // 450
                this.changeHandler = function ( changeEvent ) {                                                      // 451
                        var decodedValue = that.formatInstance.from( $(this).val() );                                // 452
                                                                                                                     // 453
                        // If the value is invalid, stop this event, as well as it's propagation.                    // 454
                        if ( decodedValue === false || isNaN(decodedValue) ) {                                       // 455
                                                                                                                     // 456
                                // Reset the value.                                                                  // 457
                                $(this).val(that.lastSetValue);                                                      // 458
                                return false;                                                                        // 459
                        }                                                                                            // 460
                                                                                                                     // 461
                        that.changeHandlerMethod.call( '', changeEvent, decodedValue );                              // 462
                };                                                                                                   // 463
                                                                                                                     // 464
                // See if this Link needs individual targets based on its usage.                                     // 465
                // If so, return the element that needs to be copied by the                                          // 466
                // implementing interface.                                                                           // 467
                // Default the element to false.                                                                     // 468
                this.el = false;                                                                                     // 469
                                                                                                                     // 470
                // Store the formatter, or use the default.                                                          // 471
                this.formatInstance = format;                                                                        // 472
                                                                                                                     // 473
                // Try all Link types.                                                                               // 474
                /*jslint unparam: true*/                                                                             // 475
                $.each(creationFunctions, function(i, fn){                                                           // 476
                        valid = fn.call(that, target, method);                                                       // 477
                        return !valid;                                                                               // 478
                });                                                                                                  // 479
                /*jslint unparam: false*/                                                                            // 480
                                                                                                                     // 481
                // Nothing matched, throw error.                                                                     // 482
                if ( !valid ) {                                                                                      // 483
                        throw new RangeError("(Link) Invalid Link.");                                                // 484
                }                                                                                                    // 485
        }                                                                                                            // 486
                                                                                                                     // 487
        // Provides external items with the object value.                                                            // 488
        Link.prototype.set = function ( value ) {                                                                    // 489
                                                                                                                     // 490
                // Ignore the value, so only the passed-on arguments remain.                                         // 491
                var args = Array.prototype.slice.call( arguments ),                                                  // 492
                        additionalArgs = args.slice(1);                                                              // 493
                                                                                                                     // 494
                // Store some values. The actual, numerical value,                                                   // 495
                // the formatted value and the parameters for use in 'resetValue'.                                   // 496
                // Slice additionalArgs to break the relation.                                                       // 497
                this.lastSetValue = this.formatInstance.to( value );                                                 // 498
                                                                                                                     // 499
                // Prepend the value to the function arguments.                                                      // 500
                additionalArgs.unshift(                                                                              // 501
                        this.lastSetValue                                                                            // 502
                );                                                                                                   // 503
                                                                                                                     // 504
                // When target is undefined, the target was a function.                                              // 505
                // In that case, provided the object as the calling scope.                                           // 506
                // Branch between writing to a function or an object.                                                // 507
                ( typeof this.method === 'function' ?                                                                // 508
                        this.method :                                                                                // 509
                        this.target[ this.method ] ).apply( this.target, additionalArgs );                           // 510
        };                                                                                                           // 511
                                                                                                                     // 512
                                                                                                                     // 513
// Developer API                                                                                                     // 514
                                                                                                                     // 515
/** @constructor */                                                                                                  // 516
        function LinkAPI ( origin ) {                                                                                // 517
                this.items = [];                                                                                     // 518
                this.elements = [];                                                                                  // 519
                this.origin = origin;                                                                                // 520
        }                                                                                                            // 521
                                                                                                                     // 522
        LinkAPI.prototype.push = function( item, element ) {                                                         // 523
                this.items.push(item);                                                                               // 524
                                                                                                                     // 525
                // Prevent 'false' elements                                                                          // 526
                if ( element ) {                                                                                     // 527
                        this.elements.push(element);                                                                 // 528
                }                                                                                                    // 529
        };                                                                                                           // 530
                                                                                                                     // 531
        LinkAPI.prototype.reconfirm = function ( flag ) {                                                            // 532
                var i;                                                                                               // 533
                for ( i = 0; i < this.elements.length; i += 1 ) {                                                    // 534
                        this.origin.LinkConfirm(flag, this.elements[i]);                                             // 535
                }                                                                                                    // 536
        };                                                                                                           // 537
                                                                                                                     // 538
        LinkAPI.prototype.remove = function ( flag ) {                                                               // 539
                var i;                                                                                               // 540
                for ( i = 0; i < this.items.length; i += 1 ) {                                                       // 541
                        this.items[i].target.off('.liblink');                                                        // 542
                }                                                                                                    // 543
                for ( i = 0; i < this.elements.length; i += 1 ) {                                                    // 544
                        this.elements[i].remove();                                                                   // 545
                }                                                                                                    // 546
        };                                                                                                           // 547
                                                                                                                     // 548
        LinkAPI.prototype.change = function ( value ) {                                                              // 549
                                                                                                                     // 550
                if ( this.origin.LinkIsEmitting ) {                                                                  // 551
                        return false;                                                                                // 552
                }                                                                                                    // 553
                                                                                                                     // 554
                this.origin.LinkIsEmitting = true;                                                                   // 555
                                                                                                                     // 556
                var args = Array.prototype.slice.call( arguments, 1 ), i;                                            // 557
                args.unshift( value );                                                                               // 558
                                                                                                                     // 559
                // Write values to serialization Links.                                                              // 560
                // Convert the value to the correct relative representation.                                         // 561
                for ( i = 0; i < this.items.length; i += 1 ) {                                                       // 562
                        this.items[i].set.apply(this.items[i], args);                                                // 563
                }                                                                                                    // 564
                                                                                                                     // 565
                this.origin.LinkIsEmitting = false;                                                                  // 566
        };                                                                                                           // 567
                                                                                                                     // 568
                                                                                                                     // 569
// jQuery plugin                                                                                                     // 570
                                                                                                                     // 571
        function binder ( flag, target, method, format ){                                                            // 572
                                                                                                                     // 573
                if ( flag === 0 ) {                                                                                  // 574
                        flag = this.LinkDefaultFlag;                                                                 // 575
                }                                                                                                    // 576
                                                                                                                     // 577
                // Create a list of API's (if it didn't exist yet);                                                  // 578
                if ( !this.linkAPI ) {                                                                               // 579
                        this.linkAPI = {};                                                                           // 580
                }                                                                                                    // 581
                                                                                                                     // 582
                // Add an API point.                                                                                 // 583
                if ( !this.linkAPI[flag] ) {                                                                         // 584
                        this.linkAPI[flag] = new LinkAPI(this);                                                      // 585
                }                                                                                                    // 586
                                                                                                                     // 587
                var linkInstance = new Link ( target, method, format || this.LinkDefaultFormatter );                 // 588
                                                                                                                     // 589
                // Default the calling scope to the linked object.                                                   // 590
                if ( !linkInstance.target ) {                                                                        // 591
                        linkInstance.target = $(this);                                                               // 592
                }                                                                                                    // 593
                                                                                                                     // 594
                // If the Link requires creation of a new element,                                                   // 595
                // Pass the element and request confirmation to get the changehandler.                               // 596
                // Set the method to be called when a Link changes.                                                  // 597
                linkInstance.changeHandlerMethod = this.LinkConfirm( flag, linkInstance.el );                        // 598
                                                                                                                     // 599
                // Store the linkInstance in the flagged list.                                                       // 600
                this.linkAPI[flag].push( linkInstance, linkInstance.el );                                            // 601
                                                                                                                     // 602
                // Now that Link have been connected, request an update.                                             // 603
                this.LinkUpdate( flag );                                                                             // 604
        }                                                                                                            // 605
                                                                                                                     // 606
        /** @export */                                                                                               // 607
        $.fn.Link = function( flag ){                                                                                // 608
                                                                                                                     // 609
                var that = this;                                                                                     // 610
                                                                                                                     // 611
                // Delete all linkAPI                                                                                // 612
                if ( flag === false ) {                                                                              // 613
                                                                                                                     // 614
                        return that.each(function(){                                                                 // 615
                                                                                                                     // 616
                                // .Link(false) can be called on elements without Links.                             // 617
                                // When that happens, the objects can't be looped.                                   // 618
                                if ( !this.linkAPI ) {                                                               // 619
                                        return;                                                                      // 620
                                }                                                                                    // 621
                                                                                                                     // 622
                                $.map(this.linkAPI, function(api){                                                   // 623
                                        api.remove();                                                                // 624
                                });                                                                                  // 625
                                                                                                                     // 626
                                delete this.linkAPI;                                                                 // 627
                        });                                                                                          // 628
                }                                                                                                    // 629
                                                                                                                     // 630
                if ( flag === undefined ) {                                                                          // 631
                                                                                                                     // 632
                        flag = 0;                                                                                    // 633
                                                                                                                     // 634
                } else if ( typeof flag !== 'string') {                                                              // 635
                                                                                                                     // 636
                        throw new Error("Flag must be string.");                                                     // 637
                }                                                                                                    // 638
                                                                                                                     // 639
                return {                                                                                             // 640
                        to: function( a, b, c ){                                                                     // 641
                                return that.each(function(){                                                         // 642
                                        binder.call(this, flag, a, b, c);                                            // 643
                                });                                                                                  // 644
                        }                                                                                            // 645
                };                                                                                                   // 646
        };                                                                                                           // 647
                                                                                                                     // 648
}( window.jQuery || window.Zepto ));                                                                                 // 649
                                                                                                                     // 650
/*jslint browser: true */                                                                                            // 651
/*jslint white: true */                                                                                              // 652
                                                                                                                     // 653
(function( $ ){                                                                                                      // 654
                                                                                                                     // 655
        'use strict';                                                                                                // 656
                                                                                                                     // 657
                                                                                                                     // 658
        // Removes duplicates from an array.                                                                         // 659
        function unique(array) {                                                                                     // 660
                return $.grep(array, function(el, index) {                                                           // 661
                        return index === $.inArray(el, array);                                                       // 662
                });                                                                                                  // 663
        }                                                                                                            // 664
                                                                                                                     // 665
        // Round a value to the closest 'to'.                                                                        // 666
        function closest ( value, to ) {                                                                             // 667
                return Math.round(value / to) * to;                                                                  // 668
        }                                                                                                            // 669
                                                                                                                     // 670
        // Checks whether a value is numerical.                                                                      // 671
        function isNumeric ( a ) {                                                                                   // 672
                return typeof a === 'number' && !isNaN( a ) && isFinite( a );                                        // 673
        }                                                                                                            // 674
                                                                                                                     // 675
        // Rounds a number to 7 supported decimals.                                                                  // 676
        function accurateNumber( number ) {                                                                          // 677
                var p = Math.pow(10, 7);                                                                             // 678
                return Number((Math.round(number*p)/p).toFixed(7));                                                  // 679
        }                                                                                                            // 680
                                                                                                                     // 681
        // Sets a class and removes it after [duration] ms.                                                          // 682
        function addClassFor ( element, className, duration ) {                                                      // 683
                element.addClass(className);                                                                         // 684
                setTimeout(function(){                                                                               // 685
                        element.removeClass(className);                                                              // 686
                }, duration);                                                                                        // 687
        }                                                                                                            // 688
                                                                                                                     // 689
        // Limits a value to 0 - 100                                                                                 // 690
        function limit ( a ) {                                                                                       // 691
                return Math.max(Math.min(a, 100), 0);                                                                // 692
        }                                                                                                            // 693
                                                                                                                     // 694
        // Wraps a variable as an array, if it isn't one yet.                                                        // 695
        function asArray ( a ) {                                                                                     // 696
                return $.isArray(a) ? a : [a];                                                                       // 697
        }                                                                                                            // 698
                                                                                                                     // 699
                                                                                                                     // 700
        var                                                                                                          // 701
        // Cache the document selector;                                                                              // 702
        /** @const */                                                                                                // 703
        doc = $(document),                                                                                           // 704
        // Make a backup of the original jQuery/Zepto .val() method.                                                 // 705
        /** @const */                                                                                                // 706
        $val = $.fn.val,                                                                                             // 707
        // Namespace for binding and unbinding slider events;                                                        // 708
        /** @const */                                                                                                // 709
        namespace = '.nui',                                                                                          // 710
        // Determine the events to bind. IE11 implements pointerEvents without                                       // 711
        // a prefix, which breaks compatibility with the IE10 implementation.                                        // 712
        /** @const */                                                                                                // 713
        actions = window.navigator.pointerEnabled ? {                                                                // 714
                start: 'pointerdown',                                                                                // 715
                move: 'pointermove',                                                                                 // 716
                end: 'pointerup'                                                                                     // 717
        } : window.navigator.msPointerEnabled ? {                                                                    // 718
                start: 'MSPointerDown',                                                                              // 719
                move: 'MSPointerMove',                                                                               // 720
                end: 'MSPointerUp'                                                                                   // 721
        } : {                                                                                                        // 722
                start: 'mousedown touchstart',                                                                       // 723
                move: 'mousemove touchmove',                                                                         // 724
                end: 'mouseup touchend'                                                                              // 725
        },                                                                                                           // 726
        // Re-usable list of classes;                                                                                // 727
        /** @const */                                                                                                // 728
        Classes = [                                                                                                  // 729
/*  0 */  'noUi-target'                                                                                              // 730
/*  1 */ ,'noUi-base'                                                                                                // 731
/*  2 */ ,'noUi-origin'                                                                                              // 732
/*  3 */ ,'noUi-handle'                                                                                              // 733
/*  4 */ ,'noUi-horizontal'                                                                                          // 734
/*  5 */ ,'noUi-vertical'                                                                                            // 735
/*  6 */ ,'noUi-background'                                                                                          // 736
/*  7 */ ,'noUi-connect'                                                                                             // 737
/*  8 */ ,'noUi-ltr'                                                                                                 // 738
/*  9 */ ,'noUi-rtl'                                                                                                 // 739
/* 10 */ ,'noUi-dragable'                                                                                            // 740
/* 11 */ ,''                                                                                                         // 741
/* 12 */ ,'noUi-state-drag'                                                                                          // 742
/* 13 */ ,''                                                                                                         // 743
/* 14 */ ,'noUi-state-tap'                                                                                           // 744
/* 15 */ ,'noUi-active'                                                                                              // 745
/* 16 */ ,''                                                                                                         // 746
/* 17 */ ,'noUi-stacking'                                                                                            // 747
        ];                                                                                                           // 748
                                                                                                                     // 749
                                                                                                                     // 750
// Value calculation                                                                                                 // 751
                                                                                                                     // 752
        // Determine the size of a sub-range in relation to a full range.                                            // 753
        function subRangeRatio ( pa, pb ) {                                                                          // 754
                return (100 / (pb - pa));                                                                            // 755
        }                                                                                                            // 756
                                                                                                                     // 757
        // (percentage) How many percent is this value of this range?                                                // 758
        function fromPercentage ( range, value ) {                                                                   // 759
                return (value * 100) / ( range[1] - range[0] );                                                      // 760
        }                                                                                                            // 761
                                                                                                                     // 762
        // (percentage) Where is this value on this range?                                                           // 763
        function toPercentage ( range, value ) {                                                                     // 764
                return fromPercentage( range, range[0] < 0 ?                                                         // 765
                        value + Math.abs(range[0]) :                                                                 // 766
                                value - range[0] );                                                                  // 767
        }                                                                                                            // 768
                                                                                                                     // 769
        // (value) How much is this percentage on this range?                                                        // 770
        function isPercentage ( range, value ) {                                                                     // 771
                return ((value * ( range[1] - range[0] )) / 100) + range[0];                                         // 772
        }                                                                                                            // 773
                                                                                                                     // 774
                                                                                                                     // 775
// Range conversion                                                                                                  // 776
                                                                                                                     // 777
        function getJ ( value, arr ) {                                                                               // 778
                                                                                                                     // 779
                var j = 1;                                                                                           // 780
                                                                                                                     // 781
                while ( value >= arr[j] ){                                                                           // 782
                        j += 1;                                                                                      // 783
                }                                                                                                    // 784
                                                                                                                     // 785
                return j;                                                                                            // 786
        }                                                                                                            // 787
                                                                                                                     // 788
        // (percentage) Input a value, find where, on a scale of 0-100, it applies.                                  // 789
        function toStepping ( xVal, xPct, value ) {                                                                  // 790
                                                                                                                     // 791
                if ( value >= xVal.slice(-1)[0] ){                                                                   // 792
                        return 100;                                                                                  // 793
                }                                                                                                    // 794
                                                                                                                     // 795
                var j = getJ( value, xVal ), va, vb, pa, pb;                                                         // 796
                                                                                                                     // 797
                va = xVal[j-1];                                                                                      // 798
                vb = xVal[j];                                                                                        // 799
                pa = xPct[j-1];                                                                                      // 800
                pb = xPct[j];                                                                                        // 801
                                                                                                                     // 802
                return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));                                // 803
        }                                                                                                            // 804
                                                                                                                     // 805
        // (value) Input a percentage, find where it is on the specified range.                                      // 806
        function fromStepping ( xVal, xPct, value ) {                                                                // 807
                                                                                                                     // 808
                // There is no range group that fits 100                                                             // 809
                if ( value >= 100 ){                                                                                 // 810
                        return xVal.slice(-1)[0];                                                                    // 811
                }                                                                                                    // 812
                                                                                                                     // 813
                var j = getJ( value, xPct ), va, vb, pa, pb;                                                         // 814
                                                                                                                     // 815
                va = xVal[j-1];                                                                                      // 816
                vb = xVal[j];                                                                                        // 817
                pa = xPct[j-1];                                                                                      // 818
                pb = xPct[j];                                                                                        // 819
                                                                                                                     // 820
                return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));                                // 821
        }                                                                                                            // 822
                                                                                                                     // 823
        // (percentage) Get the step that applies at a certain value.                                                // 824
        function getStep ( xPct, xSteps, snap, value ) {                                                             // 825
                                                                                                                     // 826
                if ( value === 100 ) {                                                                               // 827
                        return value;                                                                                // 828
                }                                                                                                    // 829
                                                                                                                     // 830
                var j = getJ( value, xPct ), a, b;                                                                   // 831
                                                                                                                     // 832
                // If 'snap' is set, steps are used as fixed points on the slider.                                   // 833
                if ( snap ) {                                                                                        // 834
                                                                                                                     // 835
                        a = xPct[j-1];                                                                               // 836
                        b = xPct[j];                                                                                 // 837
                                                                                                                     // 838
                        // Find the closest position, a or b.                                                        // 839
                        if ((value - a) > ((b-a)/2)){                                                                // 840
                                return b;                                                                            // 841
                        }                                                                                            // 842
                                                                                                                     // 843
                        return a;                                                                                    // 844
                }                                                                                                    // 845
                                                                                                                     // 846
                if ( !xSteps[j-1] ){                                                                                 // 847
                        return value;                                                                                // 848
                }                                                                                                    // 849
                                                                                                                     // 850
                return xPct[j-1] + closest(                                                                          // 851
                        value - xPct[j-1],                                                                           // 852
                        xSteps[j-1]                                                                                  // 853
                );                                                                                                   // 854
        }                                                                                                            // 855
                                                                                                                     // 856
                                                                                                                     // 857
// Entry parsing                                                                                                     // 858
                                                                                                                     // 859
        function handleEntryPoint ( index, value, that ) {                                                           // 860
                                                                                                                     // 861
                var percentage;                                                                                      // 862
                                                                                                                     // 863
                // Wrap numerical input in an array.                                                                 // 864
                if ( typeof value === "number" ) {                                                                   // 865
                        value = [value];                                                                             // 866
                }                                                                                                    // 867
                                                                                                                     // 868
                // Reject any invalid input, by testing whether value is an array.                                   // 869
                if ( Object.prototype.toString.call( value ) !== '[object Array]' ){                                 // 870
                        throw new Error("noUiSlider: 'range' contains invalid value.");                              // 871
                }                                                                                                    // 872
                                                                                                                     // 873
                // Covert min/max syntax to 0 and 100.                                                               // 874
                if ( index === 'min' ) {                                                                             // 875
                        percentage = 0;                                                                              // 876
                } else if ( index === 'max' ) {                                                                      // 877
                        percentage = 100;                                                                            // 878
                } else {                                                                                             // 879
                        percentage = parseFloat( index );                                                            // 880
                }                                                                                                    // 881
                                                                                                                     // 882
                // Check for correct input.                                                                          // 883
                if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {                                          // 884
                        throw new Error("noUiSlider: 'range' value isn't numeric.");                                 // 885
                }                                                                                                    // 886
                                                                                                                     // 887
                // Store values.                                                                                     // 888
                that.xPct.push( percentage );                                                                        // 889
                that.xVal.push( value[0] );                                                                          // 890
                                                                                                                     // 891
                // NaN will evaluate to false too, but to keep                                                       // 892
                // logging clear, set step explicitly. Make sure                                                     // 893
                // not to override the 'step' setting with false.                                                    // 894
                if ( !percentage ) {                                                                                 // 895
                        if ( !isNaN( value[1] ) ) {                                                                  // 896
                                that.xSteps[0] = value[1];                                                           // 897
                        }                                                                                            // 898
                } else {                                                                                             // 899
                        that.xSteps.push( isNaN(value[1]) ? false : value[1] );                                      // 900
                }                                                                                                    // 901
        }                                                                                                            // 902
                                                                                                                     // 903
        function handleStepPoint ( i, n, that ) {                                                                    // 904
                                                                                                                     // 905
                // Ignore 'false' stepping.                                                                          // 906
                if ( !n ) {                                                                                          // 907
                        return true;                                                                                 // 908
                }                                                                                                    // 909
                                                                                                                     // 910
                // Factor to range ratio                                                                             // 911
                that.xSteps[i] = fromPercentage([                                                                    // 912
                         that.xVal[i]                                                                                // 913
                        ,that.xVal[i+1]                                                                              // 914
                ], n) / subRangeRatio (                                                                              // 915
                        that.xPct[i],                                                                                // 916
                        that.xPct[i+1] );                                                                            // 917
        }                                                                                                            // 918
                                                                                                                     // 919
                                                                                                                     // 920
// Interface                                                                                                         // 921
                                                                                                                     // 922
        // The interface to Spectrum handles all direction-based                                                     // 923
        // conversions, so the above values are unaware.                                                             // 924
                                                                                                                     // 925
        function Spectrum ( entry, snap, direction, singleStep ) {                                                   // 926
                                                                                                                     // 927
                this.xPct = [];                                                                                      // 928
                this.xVal = [];                                                                                      // 929
                this.xSteps = [ singleStep || false ];                                                               // 930
                this.xNumSteps = [ false ];                                                                          // 931
                                                                                                                     // 932
                this.snap = snap;                                                                                    // 933
                this.direction = direction;                                                                          // 934
                                                                                                                     // 935
                var that = this, index;                                                                              // 936
                                                                                                                     // 937
                // Loop all entries.                                                                                 // 938
                for ( index in entry ) {                                                                             // 939
                        if ( entry.hasOwnProperty(index) ) {                                                         // 940
                                handleEntryPoint(index, entry[index], that);                                         // 941
                        }                                                                                            // 942
                }                                                                                                    // 943
                                                                                                                     // 944
                // Store the actual step values.                                                                     // 945
                that.xNumSteps = that.xSteps.slice(0);                                                               // 946
                                                                                                                     // 947
                for ( index in that.xNumSteps ) {                                                                    // 948
                        if ( that.xNumSteps.hasOwnProperty(index) ) {                                                // 949
                                handleStepPoint(Number(index), that.xNumSteps[index], that);                         // 950
                        }                                                                                            // 951
                }                                                                                                    // 952
        }                                                                                                            // 953
                                                                                                                     // 954
        Spectrum.prototype.getMargin = function ( value ) {                                                          // 955
                return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;                            // 956
        };                                                                                                           // 957
                                                                                                                     // 958
        Spectrum.prototype.toStepping = function ( value ) {                                                         // 959
                                                                                                                     // 960
                value = toStepping( this.xVal, this.xPct, value );                                                   // 961
                                                                                                                     // 962
                // Invert the value if this is a right-to-left slider.                                               // 963
                if ( this.direction ) {                                                                              // 964
                        value = 100 - value;                                                                         // 965
                }                                                                                                    // 966
                                                                                                                     // 967
                return value;                                                                                        // 968
        };                                                                                                           // 969
                                                                                                                     // 970
        Spectrum.prototype.fromStepping = function ( value ) {                                                       // 971
                                                                                                                     // 972
                // Invert the value if this is a right-to-left slider.                                               // 973
                if ( this.direction ) {                                                                              // 974
                        value = 100 - value;                                                                         // 975
                }                                                                                                    // 976
                                                                                                                     // 977
                return accurateNumber(fromStepping( this.xVal, this.xPct, value ));                                  // 978
        };                                                                                                           // 979
                                                                                                                     // 980
        Spectrum.prototype.getStep = function ( value ) {                                                            // 981
                                                                                                                     // 982
                // Find the proper step for rtl sliders by search in inverse direction.                              // 983
                // Fixes issue #262.                                                                                 // 984
                if ( this.direction ) {                                                                              // 985
                        value = 100 - value;                                                                         // 986
                }                                                                                                    // 987
                                                                                                                     // 988
                value = getStep(this.xPct, this.xSteps, this.snap, value );                                          // 989
                                                                                                                     // 990
                if ( this.direction ) {                                                                              // 991
                        value = 100 - value;                                                                         // 992
                }                                                                                                    // 993
                                                                                                                     // 994
                return value;                                                                                        // 995
        };                                                                                                           // 996
                                                                                                                     // 997
        Spectrum.prototype.getApplicableStep = function ( value ) {                                                  // 998
                                                                                                                     // 999
                // If the value is 100%, return the negative step twice.                                             // 1000
                var j = getJ(value, this.xPct), offset = value === 100 ? 2 : 1;                                      // 1001
                return [this.xNumSteps[j-2], this.xVal[j-offset], this.xNumSteps[j-offset]];                         // 1002
        };                                                                                                           // 1003
                                                                                                                     // 1004
        // Outside testing                                                                                           // 1005
        Spectrum.prototype.convert = function ( value ) {                                                            // 1006
                return this.getStep(this.toStepping(value));                                                         // 1007
        };                                                                                                           // 1008
                                                                                                                     // 1009
/*	Every input option is tested and parsed. This'll prevent                                                          // 1010
        endless validation in internal methods. These tests are                                                      // 1011
        structured with an item for every option available. An                                                       // 1012
        option can be marked as required by setting the 'r' flag.                                                    // 1013
        The testing function is provided with three arguments:                                                       // 1014
                - The provided value for the option;                                                                 // 1015
                - A reference to the options object;                                                                 // 1016
                - The name for the option;                                                                           // 1017
                                                                                                                     // 1018
        The testing function returns false when an error is detected,                                                // 1019
        or true when everything is OK. It can also modify the option                                                 // 1020
        object, to make sure all values can be correctly looped elsewhere. */                                        // 1021
                                                                                                                     // 1022
        /** @const */                                                                                                // 1023
        var defaultFormatter = { 'to': function( value ){                                                            // 1024
                return value.toFixed(2);                                                                             // 1025
        }, 'from': Number };                                                                                         // 1026
                                                                                                                     // 1027
        function testStep ( parsed, entry ) {                                                                        // 1028
                                                                                                                     // 1029
                if ( !isNumeric( entry ) ) {                                                                         // 1030
                        throw new Error("noUiSlider: 'step' is not numeric.");                                       // 1031
                }                                                                                                    // 1032
                                                                                                                     // 1033
                // The step option can still be used to set stepping                                                 // 1034
                // for linear sliders. Overwritten if set in 'range'.                                                // 1035
                parsed.singleStep = entry;                                                                           // 1036
        }                                                                                                            // 1037
                                                                                                                     // 1038
        function testRange ( parsed, entry ) {                                                                       // 1039
                                                                                                                     // 1040
                // Filter incorrect input.                                                                           // 1041
                if ( typeof entry !== 'object' || $.isArray(entry) ) {                                               // 1042
                        throw new Error("noUiSlider: 'range' is not an object.");                                    // 1043
                }                                                                                                    // 1044
                                                                                                                     // 1045
                // Catch missing start or end.                                                                       // 1046
                if ( entry.min === undefined || entry.max === undefined ) {                                          // 1047
                        throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");                           // 1048
                }                                                                                                    // 1049
                                                                                                                     // 1050
                parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.dir, parsed.singleStep);                   // 1051
        }                                                                                                            // 1052
                                                                                                                     // 1053
        function testStart ( parsed, entry ) {                                                                       // 1054
                                                                                                                     // 1055
                entry = asArray(entry);                                                                              // 1056
                                                                                                                     // 1057
                // Validate input. Values aren't tested, as the public .val method                                   // 1058
                // will always provide a valid location.                                                             // 1059
                if ( !$.isArray( entry ) || !entry.length || entry.length > 2 ) {                                    // 1060
                        throw new Error("noUiSlider: 'start' option is incorrect.");                                 // 1061
                }                                                                                                    // 1062
                                                                                                                     // 1063
                // Store the number of handles.                                                                      // 1064
                parsed.handles = entry.length;                                                                       // 1065
                                                                                                                     // 1066
                // When the slider is initialized, the .val method will                                              // 1067
                // be called with the start options.                                                                 // 1068
                parsed.start = entry;                                                                                // 1069
        }                                                                                                            // 1070
                                                                                                                     // 1071
        function testSnap ( parsed, entry ) {                                                                        // 1072
                                                                                                                     // 1073
                // Enforce 100% stepping within subranges.                                                           // 1074
                parsed.snap = entry;                                                                                 // 1075
                                                                                                                     // 1076
                if ( typeof entry !== 'boolean' ){                                                                   // 1077
                        throw new Error("noUiSlider: 'snap' option must be a boolean.");                             // 1078
                }                                                                                                    // 1079
        }                                                                                                            // 1080
                                                                                                                     // 1081
        function testAnimate ( parsed, entry ) {                                                                     // 1082
                                                                                                                     // 1083
                // Enforce 100% stepping within subranges.                                                           // 1084
                parsed.animate = entry;                                                                              // 1085
                                                                                                                     // 1086
                if ( typeof entry !== 'boolean' ){                                                                   // 1087
                        throw new Error("noUiSlider: 'animate' option must be a boolean.");                          // 1088
                }                                                                                                    // 1089
        }                                                                                                            // 1090
                                                                                                                     // 1091
        function testConnect ( parsed, entry ) {                                                                     // 1092
                                                                                                                     // 1093
                if ( entry === 'lower' && parsed.handles === 1 ) {                                                   // 1094
                        parsed.connect = 1;                                                                          // 1095
                } else if ( entry === 'upper' && parsed.handles === 1 ) {                                            // 1096
                        parsed.connect = 2;                                                                          // 1097
                } else if ( entry === true && parsed.handles === 2 ) {                                               // 1098
                        parsed.connect = 3;                                                                          // 1099
                } else if ( entry === false ) {                                                                      // 1100
                        parsed.connect = 0;                                                                          // 1101
                } else {                                                                                             // 1102
                        throw new Error("noUiSlider: 'connect' option doesn't match handle count.");                 // 1103
                }                                                                                                    // 1104
        }                                                                                                            // 1105
                                                                                                                     // 1106
        function testOrientation ( parsed, entry ) {                                                                 // 1107
                                                                                                                     // 1108
                // Set orientation to an a numerical value for easy                                                  // 1109
                // array selection.                                                                                  // 1110
                switch ( entry ){                                                                                    // 1111
                  case 'horizontal':                                                                                 // 1112
                        parsed.ort = 0;                                                                              // 1113
                        break;                                                                                       // 1114
                  case 'vertical':                                                                                   // 1115
                        parsed.ort = 1;                                                                              // 1116
                        break;                                                                                       // 1117
                  default:                                                                                           // 1118
                        throw new Error("noUiSlider: 'orientation' option is invalid.");                             // 1119
                }                                                                                                    // 1120
        }                                                                                                            // 1121
                                                                                                                     // 1122
        function testMargin ( parsed, entry ) {                                                                      // 1123
                                                                                                                     // 1124
                if ( !isNumeric(entry) ){                                                                            // 1125
                        throw new Error("noUiSlider: 'margin' option must be numeric.");                             // 1126
                }                                                                                                    // 1127
                                                                                                                     // 1128
                parsed.margin = parsed.spectrum.getMargin(entry);                                                    // 1129
                                                                                                                     // 1130
                if ( !parsed.margin ) {                                                                              // 1131
                        throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.");         // 1132
                }                                                                                                    // 1133
        }                                                                                                            // 1134
                                                                                                                     // 1135
        function testLimit ( parsed, entry ) {                                                                       // 1136
                                                                                                                     // 1137
                if ( !isNumeric(entry) ){                                                                            // 1138
                        throw new Error("noUiSlider: 'limit' option must be numeric.");                              // 1139
                }                                                                                                    // 1140
                                                                                                                     // 1141
                parsed.limit = parsed.spectrum.getMargin(entry);                                                     // 1142
                                                                                                                     // 1143
                if ( !parsed.limit ) {                                                                               // 1144
                        throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.");          // 1145
                }                                                                                                    // 1146
        }                                                                                                            // 1147
                                                                                                                     // 1148
        function testDirection ( parsed, entry ) {                                                                   // 1149
                                                                                                                     // 1150
                // Set direction as a numerical value for easy parsing.                                              // 1151
                // Invert connection for RTL sliders, so that the proper                                             // 1152
                // handles get the connect/background classes.                                                       // 1153
                switch ( entry ) {                                                                                   // 1154
                  case 'ltr':                                                                                        // 1155
                        parsed.dir = 0;                                                                              // 1156
                        break;                                                                                       // 1157
                  case 'rtl':                                                                                        // 1158
                        parsed.dir = 1;                                                                              // 1159
                        parsed.connect = [0,2,1,3][parsed.connect];                                                  // 1160
                        break;                                                                                       // 1161
                  default:                                                                                           // 1162
                        throw new Error("noUiSlider: 'direction' option was not recognized.");                       // 1163
                }                                                                                                    // 1164
        }                                                                                                            // 1165
                                                                                                                     // 1166
        function testBehaviour ( parsed, entry ) {                                                                   // 1167
                                                                                                                     // 1168
                // Make sure the input is a string.                                                                  // 1169
                if ( typeof entry !== 'string' ) {                                                                   // 1170
                        throw new Error("noUiSlider: 'behaviour' must be a string containing options.");             // 1171
                }                                                                                                    // 1172
                                                                                                                     // 1173
                // Check if the string contains any keywords.                                                        // 1174
                // None are required.                                                                                // 1175
                var tap = entry.indexOf('tap') >= 0,                                                                 // 1176
                        drag = entry.indexOf('drag') >= 0,                                                           // 1177
                        fixed = entry.indexOf('fixed') >= 0,                                                         // 1178
                        snap = entry.indexOf('snap') >= 0;                                                           // 1179
                                                                                                                     // 1180
                parsed.events = {                                                                                    // 1181
                        tap: tap || snap,                                                                            // 1182
                        drag: drag,                                                                                  // 1183
                        fixed: fixed,                                                                                // 1184
                        snap: snap                                                                                   // 1185
                };                                                                                                   // 1186
        }                                                                                                            // 1187
                                                                                                                     // 1188
        function testFormat ( parsed, entry ) {                                                                      // 1189
                                                                                                                     // 1190
                parsed.format = entry;                                                                               // 1191
                                                                                                                     // 1192
                // Any object with a to and from method is supported.                                                // 1193
                if ( typeof entry.to === 'function' && typeof entry.from === 'function' ) {                          // 1194
                        return true;                                                                                 // 1195
                }                                                                                                    // 1196
                                                                                                                     // 1197
                throw new Error( "noUiSlider: 'format' requires 'to' and 'from' methods.");                          // 1198
        }                                                                                                            // 1199
                                                                                                                     // 1200
        // Test all developer settings and parse to assumption-safe values.                                          // 1201
        function testOptions ( options ) {                                                                           // 1202
                                                                                                                     // 1203
                var parsed = {                                                                                       // 1204
                        margin: 0,                                                                                   // 1205
                        limit: 0,                                                                                    // 1206
                        animate: true,                                                                               // 1207
                        format: defaultFormatter                                                                     // 1208
                }, tests;                                                                                            // 1209
                                                                                                                     // 1210
                // Tests are executed in the order they are presented here.                                          // 1211
                tests = {                                                                                            // 1212
                        'step': { r: false, t: testStep },                                                           // 1213
                        'start': { r: true, t: testStart },                                                          // 1214
                        'connect': { r: true, t: testConnect },                                                      // 1215
                        'direction': { r: true, t: testDirection },                                                  // 1216
                        'snap': { r: false, t: testSnap },                                                           // 1217
                        'animate': { r: false, t: testAnimate },                                                     // 1218
                        'range': { r: true, t: testRange },                                                          // 1219
                        'orientation': { r: false, t: testOrientation },                                             // 1220
                        'margin': { r: false, t: testMargin },                                                       // 1221
                        'limit': { r: false, t: testLimit },                                                         // 1222
                        'behaviour': { r: true, t: testBehaviour },                                                  // 1223
                        'format': { r: false, t: testFormat }                                                        // 1224
                };                                                                                                   // 1225
                                                                                                                     // 1226
                // Set defaults where applicable.                                                                    // 1227
                options = $.extend({                                                                                 // 1228
                        'connect': false,                                                                            // 1229
                        'direction': 'ltr',                                                                          // 1230
                        'behaviour': 'tap',                                                                          // 1231
                        'orientation': 'horizontal'                                                                  // 1232
                }, options);                                                                                         // 1233
                                                                                                                     // 1234
                // Run all options through a testing mechanism to ensure correct                                     // 1235
                // input. It should be noted that options might get modified to                                      // 1236
                // be handled properly. E.g. wrapping integers in arrays.                                            // 1237
                $.each( tests, function( name, test ){                                                               // 1238
                                                                                                                     // 1239
                        // If the option isn't set, but it is required, throw an error.                              // 1240
                        if ( options[name] === undefined ) {                                                         // 1241
                                                                                                                     // 1242
                                if ( test.r ) {                                                                      // 1243
                                        throw new Error("noUiSlider: '" + name + "' is required.");                  // 1244
                                }                                                                                    // 1245
                                                                                                                     // 1246
                                return true;                                                                         // 1247
                        }                                                                                            // 1248
                                                                                                                     // 1249
                        test.t( parsed, options[name] );                                                             // 1250
                });                                                                                                  // 1251
                                                                                                                     // 1252
                // Pre-define the styles.                                                                            // 1253
                parsed.style = parsed.ort ? 'top' : 'left';                                                          // 1254
                                                                                                                     // 1255
                return parsed;                                                                                       // 1256
        }                                                                                                            // 1257
                                                                                                                     // 1258
// Class handling                                                                                                    // 1259
                                                                                                                     // 1260
        // Delimit proposed values for handle positions.                                                             // 1261
        function getPositions ( a, b, delimit ) {                                                                    // 1262
                                                                                                                     // 1263
                // Add movement to current position.                                                                 // 1264
                var c = a + b[0], d = a + b[1];                                                                      // 1265
                                                                                                                     // 1266
                // Only alter the other position on drag,                                                            // 1267
                // not on standard sliding.                                                                          // 1268
                if ( delimit ) {                                                                                     // 1269
                        if ( c < 0 ) {                                                                               // 1270
                                d += Math.abs(c);                                                                    // 1271
                        }                                                                                            // 1272
                        if ( d > 100 ) {                                                                             // 1273
                                c -= ( d - 100 );                                                                    // 1274
                        }                                                                                            // 1275
                                                                                                                     // 1276
                        // Limit values to 0 and 100.                                                                // 1277
                        return [limit(c), limit(d)];                                                                 // 1278
                }                                                                                                    // 1279
                                                                                                                     // 1280
                return [c,d];                                                                                        // 1281
        }                                                                                                            // 1282
                                                                                                                     // 1283
                                                                                                                     // 1284
// Event handling                                                                                                    // 1285
                                                                                                                     // 1286
        // Provide a clean event with standardized offset values.                                                    // 1287
        function fixEvent ( e ) {                                                                                    // 1288
                                                                                                                     // 1289
                // Prevent scrolling and panning on touch events, while                                              // 1290
                // attempting to slide. The tap event also depends on this.                                          // 1291
                e.preventDefault();                                                                                  // 1292
                                                                                                                     // 1293
                // Filter the event to register the type, which can be                                               // 1294
                // touch, mouse or pointer. Offset changes need to be                                                // 1295
                // made on an event specific basis.                                                                  // 1296
                var  touch = e.type.indexOf('touch') === 0                                                           // 1297
                        ,mouse = e.type.indexOf('mouse') === 0                                                       // 1298
                        ,pointer = e.type.indexOf('pointer') === 0                                                   // 1299
                        ,x,y, event = e;                                                                             // 1300
                                                                                                                     // 1301
                // IE10 implemented pointer events with a prefix;                                                    // 1302
                if ( e.type.indexOf('MSPointer') === 0 ) {                                                           // 1303
                        pointer = true;                                                                              // 1304
                }                                                                                                    // 1305
                                                                                                                     // 1306
                // Get the originalEvent, if the event has been wrapped                                              // 1307
                // by jQuery. Zepto doesn't wrap the event.                                                          // 1308
                if ( e.originalEvent ) {                                                                             // 1309
                        e = e.originalEvent;                                                                         // 1310
                }                                                                                                    // 1311
                                                                                                                     // 1312
                if ( touch ) {                                                                                       // 1313
                        // noUiSlider supports one movement at a time,                                               // 1314
                        // so we can select the first 'changedTouch'.                                                // 1315
                        x = e.changedTouches[0].pageX;                                                               // 1316
                        y = e.changedTouches[0].pageY;                                                               // 1317
                }                                                                                                    // 1318
                                                                                                                     // 1319
                if ( mouse || pointer ) {                                                                            // 1320
                                                                                                                     // 1321
                        // Polyfill the pageXOffset and pageYOffset                                                  // 1322
                        // variables for IE7 and IE8;                                                                // 1323
                        if( !pointer && window.pageXOffset === undefined ){                                          // 1324
                                window.pageXOffset = document.documentElement.scrollLeft;                            // 1325
                                window.pageYOffset = document.documentElement.scrollTop;                             // 1326
                        }                                                                                            // 1327
                                                                                                                     // 1328
                        x = e.clientX + window.pageXOffset;                                                          // 1329
                        y = e.clientY + window.pageYOffset;                                                          // 1330
                }                                                                                                    // 1331
                                                                                                                     // 1332
                event.points = [x, y];                                                                               // 1333
                event.cursor = mouse;                                                                                // 1334
                                                                                                                     // 1335
                return event;                                                                                        // 1336
        }                                                                                                            // 1337
                                                                                                                     // 1338
                                                                                                                     // 1339
// DOM additions                                                                                                     // 1340
                                                                                                                     // 1341
        // Append a handle to the base.                                                                              // 1342
        function addHandle ( direction, index ) {                                                                    // 1343
                                                                                                                     // 1344
                var handle = $('<div><div/></div>').addClass( Classes[2] ),                                          // 1345
                        additions = [ '-lower', '-upper' ];                                                          // 1346
                                                                                                                     // 1347
                if ( direction ) {                                                                                   // 1348
                        additions.reverse();                                                                         // 1349
                }                                                                                                    // 1350
                                                                                                                     // 1351
                handle.children().addClass(                                                                          // 1352
                        Classes[3] + " " + Classes[3]+additions[index]                                               // 1353
                );                                                                                                   // 1354
                                                                                                                     // 1355
                return handle;                                                                                       // 1356
        }                                                                                                            // 1357
                                                                                                                     // 1358
        // Add the proper connection classes.                                                                        // 1359
        function addConnection ( connect, target, handles ) {                                                        // 1360
                                                                                                                     // 1361
                // Apply the required connection classes to the elements                                             // 1362
                // that need them. Some classes are made up for several                                              // 1363
                // segments listed in the class list, to allow easy                                                  // 1364
                // renaming and provide a minor compression benefit.                                                 // 1365
                switch ( connect ) {                                                                                 // 1366
                        case 1:	target.addClass( Classes[7] );                                                       // 1367
                                        handles[0].addClass( Classes[6] );                                           // 1368
                                        break;                                                                       // 1369
                        case 3: handles[1].addClass( Classes[6] );                                                   // 1370
                                        /* falls through */                                                          // 1371
                        case 2: handles[0].addClass( Classes[7] );                                                   // 1372
                                        /* falls through */                                                          // 1373
                        case 0: target.addClass(Classes[6]);                                                         // 1374
                                        break;                                                                       // 1375
                }                                                                                                    // 1376
        }                                                                                                            // 1377
                                                                                                                     // 1378
        // Add handles to the slider base.                                                                           // 1379
        function addHandles ( nrHandles, direction, base ) {                                                         // 1380
                                                                                                                     // 1381
                var index, handles = [];                                                                             // 1382
                                                                                                                     // 1383
                // Append handles.                                                                                   // 1384
                for ( index = 0; index < nrHandles; index += 1 ) {                                                   // 1385
                                                                                                                     // 1386
                        // Keep a list of all added handles.                                                         // 1387
                        handles.push( addHandle( direction, index ).appendTo(base) );                                // 1388
                }                                                                                                    // 1389
                                                                                                                     // 1390
                return handles;                                                                                      // 1391
        }                                                                                                            // 1392
                                                                                                                     // 1393
        // Initialize a single slider.                                                                               // 1394
        function addSlider ( direction, orientation, target ) {                                                      // 1395
                                                                                                                     // 1396
                // Apply classes and data to the target.                                                             // 1397
                target.addClass([                                                                                    // 1398
                        Classes[0],                                                                                  // 1399
                        Classes[8 + direction],                                                                      // 1400
                        Classes[4 + orientation]                                                                     // 1401
                ].join(' '));                                                                                        // 1402
                                                                                                                     // 1403
                return $('<div/>').appendTo(target).addClass( Classes[1] );                                          // 1404
        }                                                                                                            // 1405
                                                                                                                     // 1406
function closure ( target, options, originalOptions ){                                                               // 1407
                                                                                                                     // 1408
// Internal variables                                                                                                // 1409
                                                                                                                     // 1410
        // All variables local to 'closure' are marked $.                                                            // 1411
        var $Target = $(target),                                                                                     // 1412
                $Locations = [-1, -1],                                                                               // 1413
                $Base,                                                                                               // 1414
                $Handles,                                                                                            // 1415
                $Spectrum = options.spectrum,                                                                        // 1416
                $Values = [],                                                                                        // 1417
        // libLink. For rtl sliders, 'lower' and 'upper' should not be inverted                                      // 1418
        // for one-handle sliders, so trim 'upper' it that case.                                                     // 1419
                triggerPos = ['lower', 'upper'].slice(0, options.handles);                                           // 1420
                                                                                                                     // 1421
        // Invert the libLink connection for rtl sliders.                                                            // 1422
        if ( options.dir ) {                                                                                         // 1423
                triggerPos.reverse();                                                                                // 1424
        }                                                                                                            // 1425
                                                                                                                     // 1426
// Helpers                                                                                                           // 1427
                                                                                                                     // 1428
        // Shorthand for base dimensions.                                                                            // 1429
        function baseSize ( ) {                                                                                      // 1430
                return $Base[['width', 'height'][options.ort]]();                                                    // 1431
        }                                                                                                            // 1432
                                                                                                                     // 1433
        // External event handling                                                                                   // 1434
        function fireEvents ( events ) {                                                                             // 1435
                                                                                                                     // 1436
                // Use the external api to get the values.                                                           // 1437
                // Wrap the values in an array, as .trigger takes                                                    // 1438
                // only one additional argument.                                                                     // 1439
                var index, values = [ $Target.val() ];                                                               // 1440
                                                                                                                     // 1441
                for ( index = 0; index < events.length; index += 1 ){                                                // 1442
                        $Target.trigger(events[index], values);                                                      // 1443
                }                                                                                                    // 1444
        }                                                                                                            // 1445
                                                                                                                     // 1446
        // Returns the input array, respecting the slider direction configuration.                                   // 1447
        function inSliderOrder ( values ) {                                                                          // 1448
                                                                                                                     // 1449
                // If only one handle is used, return a single value.                                                // 1450
                if ( values.length === 1 ){                                                                          // 1451
                        return values[0];                                                                            // 1452
                }                                                                                                    // 1453
                                                                                                                     // 1454
                if ( options.dir ) {                                                                                 // 1455
                        return values.reverse();                                                                     // 1456
                }                                                                                                    // 1457
                                                                                                                     // 1458
                return values;                                                                                       // 1459
        }                                                                                                            // 1460
                                                                                                                     // 1461
// libLink integration                                                                                               // 1462
                                                                                                                     // 1463
        // Create a new function which calls .val on input change.                                                   // 1464
        function createChangeHandler ( trigger ) {                                                                   // 1465
                return function ( ignore, value ){                                                                   // 1466
                        // Determine which array position to 'null' based on 'trigger'.                              // 1467
                        $Target.val( [ trigger ? null : value, trigger ? value : null ], true );                     // 1468
                };                                                                                                   // 1469
        }                                                                                                            // 1470
                                                                                                                     // 1471
        // Called by libLink when it wants a set of links updated.                                                   // 1472
        function linkUpdate ( flag ) {                                                                               // 1473
                                                                                                                     // 1474
                var trigger = $.inArray(flag, triggerPos);                                                           // 1475
                                                                                                                     // 1476
                // The API might not have been set yet.                                                              // 1477
                if ( $Target[0].linkAPI && $Target[0].linkAPI[flag] ) {                                              // 1478
                        $Target[0].linkAPI[flag].change(                                                             // 1479
                                $Values[trigger],                                                                    // 1480
                                $Handles[trigger].children(),                                                        // 1481
                                $Target                                                                              // 1482
                        );                                                                                           // 1483
                }                                                                                                    // 1484
        }                                                                                                            // 1485
                                                                                                                     // 1486
        // Called by libLink to append an element to the slider.                                                     // 1487
        function linkConfirm ( flag, element ) {                                                                     // 1488
                                                                                                                     // 1489
                // Find the trigger for the passed flag.                                                             // 1490
                var trigger = $.inArray(flag, triggerPos);                                                           // 1491
                                                                                                                     // 1492
                // If set, append the element to the handle it belongs to.                                           // 1493
                if ( element ) {                                                                                     // 1494
                        element.appendTo( $Handles[trigger].children() );                                            // 1495
                }                                                                                                    // 1496
                                                                                                                     // 1497
                // The public API is reversed for rtl sliders, so the changeHandler                                  // 1498
                // should not be aware of the inverted trigger positions.                                            // 1499
                // On rtl slider with one handle, 'lower' should be used.                                            // 1500
                if ( options.dir && options.handles > 1 ) {                                                          // 1501
                        trigger = trigger === 1 ? 0 : 1;                                                             // 1502
                }                                                                                                    // 1503
                                                                                                                     // 1504
                return createChangeHandler( trigger );                                                               // 1505
        }                                                                                                            // 1506
                                                                                                                     // 1507
        // Place elements back on the slider.                                                                        // 1508
        function reAppendLink ( ) {                                                                                  // 1509
                                                                                                                     // 1510
                var i, flag;                                                                                         // 1511
                                                                                                                     // 1512
                // The API keeps a list of elements: we can re-append them on rebuild.                               // 1513
                for ( i = 0; i < triggerPos.length; i += 1 ) {                                                       // 1514
                        if ( this.linkAPI && this.linkAPI[(flag = triggerPos[i])] ) {                                // 1515
                                this.linkAPI[flag].reconfirm(flag);                                                  // 1516
                        }                                                                                            // 1517
                }                                                                                                    // 1518
        }                                                                                                            // 1519
                                                                                                                     // 1520
        target.LinkUpdate = linkUpdate;                                                                              // 1521
        target.LinkConfirm = linkConfirm;                                                                            // 1522
        target.LinkDefaultFormatter = options.format;                                                                // 1523
        target.LinkDefaultFlag = 'lower';                                                                            // 1524
                                                                                                                     // 1525
        target.reappend = reAppendLink;                                                                              // 1526
                                                                                                                     // 1527
                                                                                                                     // 1528
        // Handler for attaching events trough a proxy.                                                              // 1529
        function attach ( events, element, callback, data ) {                                                        // 1530
                                                                                                                     // 1531
                // This function can be used to 'filter' events to the slider.                                       // 1532
                                                                                                                     // 1533
                // Add the noUiSlider namespace to all events.                                                       // 1534
                events = events.replace( /\s/g, namespace + ' ' ) + namespace;                                       // 1535
                                                                                                                     // 1536
                // Bind a closure on the target.                                                                     // 1537
                return element.on( events, function( e ){                                                            // 1538
                                                                                                                     // 1539
                        // jQuery and Zepto (1) handle unset attributes differently,                                 // 1540
                        // but always falsy; #208                                                                    // 1541
                        if ( !!$Target.attr('disabled') ) {                                                          // 1542
                                return false;                                                                        // 1543
                        }                                                                                            // 1544
                                                                                                                     // 1545
                        // Stop if an active 'tap' transition is taking place.                                       // 1546
                        if ( $Target.hasClass( Classes[14] ) ) {                                                     // 1547
                                return false;                                                                        // 1548
                        }                                                                                            // 1549
                                                                                                                     // 1550
                        e = fixEvent(e);                                                                             // 1551
                        e.calcPoint = e.points[ options.ort ];                                                       // 1552
                                                                                                                     // 1553
                        // Call the event handler with the event [ and additional data ].                            // 1554
                        callback ( e, data );                                                                        // 1555
                });                                                                                                  // 1556
        }                                                                                                            // 1557
                                                                                                                     // 1558
        // Handle movement on document for handle and range drag.                                                    // 1559
        function move ( event, data ) {                                                                              // 1560
                                                                                                                     // 1561
                var handles = data.handles || $Handles, positions, state = false,                                    // 1562
                        proposal = ((event.calcPoint - data.start) * 100) / baseSize(),                              // 1563
                        h = handles[0][0] !== $Handles[0][0] ? 1 : 0;                                                // 1564
                                                                                                                     // 1565
                // Calculate relative positions for the handles.                                                     // 1566
                positions = getPositions( proposal, data.positions, handles.length > 1);                             // 1567
                                                                                                                     // 1568
                state = setHandle ( handles[0], positions[h], handles.length === 1 );                                // 1569
                                                                                                                     // 1570
                if ( handles.length > 1 ) {                                                                          // 1571
                        state = setHandle ( handles[1], positions[h?0:1], false ) || state;                          // 1572
                }                                                                                                    // 1573
                                                                                                                     // 1574
                // Fire the 'slide' event if any handle moved.                                                       // 1575
                if ( state ) {                                                                                       // 1576
                        fireEvents(['slide']);                                                                       // 1577
                }                                                                                                    // 1578
        }                                                                                                            // 1579
                                                                                                                     // 1580
        // Unbind move events on document, call callbacks.                                                           // 1581
        function end ( event ) {                                                                                     // 1582
                                                                                                                     // 1583
                // The handle is no longer active, so remove the class.                                              // 1584
                $('.' + Classes[15]).removeClass(Classes[15]);                                                       // 1585
                                                                                                                     // 1586
                // Remove cursor styles and text-selection events bound to the body.                                 // 1587
                if ( event.cursor ) {                                                                                // 1588
                        $('body').css('cursor', '').off( namespace );                                                // 1589
                }                                                                                                    // 1590
                                                                                                                     // 1591
                // Unbind the move and end events, which are added on 'start'.                                       // 1592
                doc.off( namespace );                                                                                // 1593
                                                                                                                     // 1594
                // Remove dragging class.                                                                            // 1595
                $Target.removeClass(Classes[12]);                                                                    // 1596
                                                                                                                     // 1597
                // Fire the change and set events.                                                                   // 1598
                fireEvents(['set', 'change']);                                                                       // 1599
        }                                                                                                            // 1600
                                                                                                                     // 1601
        // Bind move events on document.                                                                             // 1602
        function start ( event, data ) {                                                                             // 1603
                                                                                                                     // 1604
                // Mark the handle as 'active' so it can be styled.                                                  // 1605
                if( data.handles.length === 1 ) {                                                                    // 1606
                        data.handles[0].children().addClass(Classes[15]);                                            // 1607
                }                                                                                                    // 1608
                                                                                                                     // 1609
                // A drag should never propagate up to the 'tap' event.                                              // 1610
                event.stopPropagation();                                                                             // 1611
                                                                                                                     // 1612
                // Attach the move event.                                                                            // 1613
                attach ( actions.move, doc, move, {                                                                  // 1614
                        start: event.calcPoint,                                                                      // 1615
                        handles: data.handles,                                                                       // 1616
                        positions: [                                                                                 // 1617
                                $Locations[0],                                                                       // 1618
                                $Locations[$Handles.length - 1]                                                      // 1619
                        ]                                                                                            // 1620
                });                                                                                                  // 1621
                                                                                                                     // 1622
                // Unbind all movement when the drag ends.                                                           // 1623
                attach ( actions.end, doc, end, null );                                                              // 1624
                                                                                                                     // 1625
                // Text selection isn't an issue on touch devices,                                                   // 1626
                // so adding cursor styles can be skipped.                                                           // 1627
                if ( event.cursor ) {                                                                                // 1628
                                                                                                                     // 1629
                        // Prevent the 'I' cursor and extend the range-drag cursor.                                  // 1630
                        $('body').css('cursor', $(event.target).css('cursor'));                                      // 1631
                                                                                                                     // 1632
                        // Mark the target with a dragging state.                                                    // 1633
                        if ( $Handles.length > 1 ) {                                                                 // 1634
                                $Target.addClass(Classes[12]);                                                       // 1635
                        }                                                                                            // 1636
                                                                                                                     // 1637
                        // Prevent text selection when dragging the handles.                                         // 1638
                        $('body').on('selectstart' + namespace, false);                                              // 1639
                }                                                                                                    // 1640
        }                                                                                                            // 1641
                                                                                                                     // 1642
        // Move closest handle to tapped location.                                                                   // 1643
        function tap ( event ) {                                                                                     // 1644
                                                                                                                     // 1645
                var location = event.calcPoint, total = 0, to;                                                       // 1646
                                                                                                                     // 1647
                // The tap event shouldn't propagate up and cause 'edge' to run.                                     // 1648
                event.stopPropagation();                                                                             // 1649
                                                                                                                     // 1650
                // Add up the handle offsets.                                                                        // 1651
                $.each( $Handles, function(){                                                                        // 1652
                        total += this.offset()[ options.style ];                                                     // 1653
                });                                                                                                  // 1654
                                                                                                                     // 1655
                // Find the handle closest to the tapped position.                                                   // 1656
                total = ( location < total/2 || $Handles.length === 1 ) ? 0 : 1;                                     // 1657
                                                                                                                     // 1658
                location -= $Base.offset()[ options.style ];                                                         // 1659
                                                                                                                     // 1660
                // Calculate the new position.                                                                       // 1661
                to = ( location * 100 ) / baseSize();                                                                // 1662
                                                                                                                     // 1663
                if ( !options.events.snap ) {                                                                        // 1664
                        // Flag the slider as it is now in a transitional state.                                     // 1665
                        // Transition takes 300 ms, so re-enable the slider afterwards.                              // 1666
                        addClassFor( $Target, Classes[14], 300 );                                                    // 1667
                }                                                                                                    // 1668
                                                                                                                     // 1669
                // Find the closest handle and calculate the tapped point.                                           // 1670
                // The set handle to the new position.                                                               // 1671
                setHandle( $Handles[total], to );                                                                    // 1672
                                                                                                                     // 1673
                fireEvents(['slide', 'set', 'change']);                                                              // 1674
                                                                                                                     // 1675
                if ( options.events.snap ) {                                                                         // 1676
                        start(event, { handles: [$Handles[total]] });                                                // 1677
                }                                                                                                    // 1678
        }                                                                                                            // 1679
                                                                                                                     // 1680
        // Attach events to several slider parts.                                                                    // 1681
        function events ( behaviour ) {                                                                              // 1682
                                                                                                                     // 1683
                var i, drag;                                                                                         // 1684
                                                                                                                     // 1685
                // Attach the standard drag event to the handles.                                                    // 1686
                if ( !behaviour.fixed ) {                                                                            // 1687
                                                                                                                     // 1688
                        for ( i = 0; i < $Handles.length; i += 1 ) {                                                 // 1689
                                                                                                                     // 1690
                                // These events are only bound to the visual handle                                  // 1691
                                // element, not the 'real' origin element.                                           // 1692
                                attach ( actions.start, $Handles[i].children(), start, {                             // 1693
                                        handles: [ $Handles[i] ]                                                     // 1694
                                });                                                                                  // 1695
                        }                                                                                            // 1696
                }                                                                                                    // 1697
                                                                                                                     // 1698
                // Attach the tap event to the slider base.                                                          // 1699
                if ( behaviour.tap ) {                                                                               // 1700
                                                                                                                     // 1701
                        attach ( actions.start, $Base, tap, {                                                        // 1702
                                handles: $Handles                                                                    // 1703
                        });                                                                                          // 1704
                }                                                                                                    // 1705
                                                                                                                     // 1706
                // Make the range dragable.                                                                          // 1707
                if ( behaviour.drag ){                                                                               // 1708
                                                                                                                     // 1709
                        drag = $Base.find( '.' + Classes[7] ).addClass( Classes[10] );                               // 1710
                                                                                                                     // 1711
                        // When the range is fixed, the entire range can                                             // 1712
                        // be dragged by the handles. The handle in the first                                        // 1713
                        // origin will propagate the start event upward,                                             // 1714
                        // but it needs to be bound manually on the other.                                           // 1715
                        if ( behaviour.fixed ) {                                                                     // 1716
                                drag = drag.add($Base.children().not( drag ).children());                            // 1717
                        }                                                                                            // 1718
                                                                                                                     // 1719
                        attach ( actions.start, drag, start, {                                                       // 1720
                                handles: $Handles                                                                    // 1721
                        });                                                                                          // 1722
                }                                                                                                    // 1723
        }                                                                                                            // 1724
                                                                                                                     // 1725
                                                                                                                     // 1726
        // Test suggested values and apply margin, step.                                                             // 1727
        function setHandle ( handle, to, noLimitOption ) {                                                           // 1728
                                                                                                                     // 1729
                var trigger = handle[0] !== $Handles[0][0] ? 1 : 0,                                                  // 1730
                        lowerMargin = $Locations[0] + options.margin,                                                // 1731
                        upperMargin = $Locations[1] - options.margin,                                                // 1732
                        lowerLimit = $Locations[0] + options.limit,                                                  // 1733
                        upperLimit = $Locations[1] - options.limit;                                                  // 1734
                                                                                                                     // 1735
                // For sliders with multiple handles,                                                                // 1736
                // limit movement to the other handle.                                                               // 1737
                // Apply the margin option by adding it to the handle positions.                                     // 1738
                if ( $Handles.length > 1 ) {                                                                         // 1739
                        to = trigger ? Math.max( to, lowerMargin ) : Math.min( to, upperMargin );                    // 1740
                }                                                                                                    // 1741
                                                                                                                     // 1742
                // The limit option has the opposite effect, limiting handles to a                                   // 1743
                // maximum distance from another. Limit must be > 0, as otherwise                                    // 1744
                // handles would be unmoveable. 'noLimitOption' is set to 'false'                                    // 1745
                // for the .val() method, except for pass 4/4.                                                       // 1746
                if ( noLimitOption !== false && options.limit && $Handles.length > 1 ) {                             // 1747
                        to = trigger ? Math.min ( to, lowerLimit ) : Math.max( to, upperLimit );                     // 1748
                }                                                                                                    // 1749
                                                                                                                     // 1750
                // Handle the step option.                                                                           // 1751
                to = $Spectrum.getStep( to );                                                                        // 1752
                                                                                                                     // 1753
                // Limit to 0/100 for .val input, trim anything beyond 7 digits, as                                  // 1754
                // JavaScript has some issues in its floating point implementation.                                  // 1755
                to = limit(parseFloat(to.toFixed(7)));                                                               // 1756
                                                                                                                     // 1757
                // Return false if handle can't move.                                                                // 1758
                if ( to === $Locations[trigger] ) {                                                                  // 1759
                        return false;                                                                                // 1760
                }                                                                                                    // 1761
                                                                                                                     // 1762
                // Set the handle to the new position.                                                               // 1763
                handle.css( options.style, to + '%' );                                                               // 1764
                                                                                                                     // 1765
                // Force proper handle stacking                                                                      // 1766
                if ( handle.is(':first-child') ) {                                                                   // 1767
                        handle.toggleClass(Classes[17], to > 50 );                                                   // 1768
                }                                                                                                    // 1769
                                                                                                                     // 1770
                // Update locations.                                                                                 // 1771
                $Locations[trigger] = to;                                                                            // 1772
                                                                                                                     // 1773
                // Convert the value to the slider stepping/range.                                                   // 1774
                $Values[trigger] = $Spectrum.fromStepping( to );                                                     // 1775
                                                                                                                     // 1776
                linkUpdate(triggerPos[trigger]);                                                                     // 1777
                                                                                                                     // 1778
                return true;                                                                                         // 1779
        }                                                                                                            // 1780
                                                                                                                     // 1781
        // Loop values from value method and apply them.                                                             // 1782
        function setValues ( count, values ) {                                                                       // 1783
                                                                                                                     // 1784
                var i, trigger, to;                                                                                  // 1785
                                                                                                                     // 1786
                // With the limit option, we'll need another limiting pass.                                          // 1787
                if ( options.limit ) {                                                                               // 1788
                        count += 1;                                                                                  // 1789
                }                                                                                                    // 1790
                                                                                                                     // 1791
                // If there are multiple handles to be set run the setting                                           // 1792
                // mechanism twice for the first handle, to make sure it                                             // 1793
                // can be bounced of the second one properly.                                                        // 1794
                for ( i = 0; i < count; i += 1 ) {                                                                   // 1795
                                                                                                                     // 1796
                        trigger = i%2;                                                                               // 1797
                                                                                                                     // 1798
                        // Get the current argument from the array.                                                  // 1799
                        to = values[trigger];                                                                        // 1800
                                                                                                                     // 1801
                        // Setting with null indicates an 'ignore'.                                                  // 1802
                        // Inputting 'false' is invalid.                                                             // 1803
                        if ( to !== null && to !== false ) {                                                         // 1804
                                                                                                                     // 1805
                                // If a formatted number was passed, attemt to decode it.                            // 1806
                                if ( typeof to === 'number' ) {                                                      // 1807
                                        to = String(to);                                                             // 1808
                                }                                                                                    // 1809
                                                                                                                     // 1810
                                to = options.format.from( to );                                                      // 1811
                                                                                                                     // 1812
                                // Request an update for all links if the value was invalid.                         // 1813
                                // Do so too if setting the handle fails.                                            // 1814
                                if ( to === false || isNaN(to) || setHandle( $Handles[trigger], $Spectrum.toStepping( to ), i === (3 - options.dir) ) === false ) {
                                                                                                                     // 1816
                                        linkUpdate(triggerPos[trigger]);                                             // 1817
                                }                                                                                    // 1818
                        }                                                                                            // 1819
                }                                                                                                    // 1820
        }                                                                                                            // 1821
                                                                                                                     // 1822
        // Set the slider value.                                                                                     // 1823
        function valueSet ( input ) {                                                                                // 1824
                                                                                                                     // 1825
                // LibLink: don't accept new values when currently emitting changes.                                 // 1826
                if ( $Target[0].LinkIsEmitting ) {                                                                   // 1827
                        return this;                                                                                 // 1828
                }                                                                                                    // 1829
                                                                                                                     // 1830
                var count, values = asArray( input );                                                                // 1831
                                                                                                                     // 1832
                // The RTL settings is implemented by reversing the front-end,                                       // 1833
                // internal mechanisms are the same.                                                                 // 1834
                if ( options.dir && options.handles > 1 ) {                                                          // 1835
                        values.reverse();                                                                            // 1836
                }                                                                                                    // 1837
                                                                                                                     // 1838
                // Animation is optional.                                                                            // 1839
                // Make sure the initial values where set before using animated                                      // 1840
                // placement. (no report, unit testing);                                                             // 1841
                if ( options.animate && $Locations[0] !== -1 ) {                                                     // 1842
                        addClassFor( $Target, Classes[14], 300 );                                                    // 1843
                }                                                                                                    // 1844
                                                                                                                     // 1845
                // Determine how often to set the handles.                                                           // 1846
                count = $Handles.length > 1 ? 3 : 1;                                                                 // 1847
                                                                                                                     // 1848
                if ( values.length === 1 ) {                                                                         // 1849
                        count = 1;                                                                                   // 1850
                }                                                                                                    // 1851
                                                                                                                     // 1852
                setValues ( count, values );                                                                         // 1853
                                                                                                                     // 1854
                // Fire the 'set' event. As of noUiSlider 7,                                                         // 1855
                // this is no longer optional.                                                                       // 1856
                fireEvents(['set']);                                                                                 // 1857
                                                                                                                     // 1858
                return this;                                                                                         // 1859
        }                                                                                                            // 1860
                                                                                                                     // 1861
        // Get the slider value.                                                                                     // 1862
        function valueGet ( ) {                                                                                      // 1863
                                                                                                                     // 1864
                var i, retour = [];                                                                                  // 1865
                                                                                                                     // 1866
                // Get the value from all handles.                                                                   // 1867
                for ( i = 0; i < options.handles; i += 1 ){                                                          // 1868
                        retour[i] = options.format.to( $Values[i] );                                                 // 1869
                }                                                                                                    // 1870
                                                                                                                     // 1871
                return inSliderOrder( retour );                                                                      // 1872
        }                                                                                                            // 1873
                                                                                                                     // 1874
        // Destroy the slider and unbind all events.                                                                 // 1875
        function destroyTarget ( ) {                                                                                 // 1876
                                                                                                                     // 1877
                // Unbind events on the slider, remove all classes and child elements.                               // 1878
                $(this).off(namespace)                                                                               // 1879
                        .removeClass(Classes.join(' '))                                                              // 1880
                        .empty();                                                                                    // 1881
                                                                                                                     // 1882
                delete this.LinkUpdate;                                                                              // 1883
                delete this.LinkConfirm;                                                                             // 1884
                delete this.LinkDefaultFormatter;                                                                    // 1885
                delete this.LinkDefaultFlag;                                                                         // 1886
                delete this.reappend;                                                                                // 1887
                delete this.vGet;                                                                                    // 1888
                delete this.vSet;                                                                                    // 1889
                delete this.getCurrentStep;                                                                          // 1890
                delete this.getInfo;                                                                                 // 1891
                delete this.destroy;                                                                                 // 1892
                                                                                                                     // 1893
                // Return the original options from the closure.                                                     // 1894
                return originalOptions;                                                                              // 1895
        }                                                                                                            // 1896
                                                                                                                     // 1897
        // Get the current step size for the slider.                                                                 // 1898
        function getCurrentStep ( ) {                                                                                // 1899
                                                                                                                     // 1900
                // Check all locations, map them to their stepping point.                                            // 1901
                // Get the step point, then find it in the input list.                                               // 1902
                var retour = $.map($Locations, function( location, index ){                                          // 1903
                                                                                                                     // 1904
                        var step = $Spectrum.getApplicableStep( location ),                                          // 1905
                                value = $Values[index],                                                              // 1906
                                increment = step[2],                                                                 // 1907
                                decrement = (value - step[2]) >= step[1] ? step[2] : step[0];                        // 1908
                                                                                                                     // 1909
                        return [[decrement, increment]];                                                             // 1910
                });                                                                                                  // 1911
                                                                                                                     // 1912
                // Return values in the proper order.                                                                // 1913
                return inSliderOrder( retour );                                                                      // 1914
        }                                                                                                            // 1915
                                                                                                                     // 1916
        // Get the original set of options.                                                                          // 1917
        function getOriginalOptions ( ) {                                                                            // 1918
                return originalOptions;                                                                              // 1919
        }                                                                                                            // 1920
                                                                                                                     // 1921
                                                                                                                     // 1922
// Initialize slider                                                                                                 // 1923
                                                                                                                     // 1924
        // Throw an error if the slider was already initialized.                                                     // 1925
        if ( $Target.hasClass(Classes[0]) ) {                                                                        // 1926
                throw new Error('Slider was already initialized.');                                                  // 1927
        }                                                                                                            // 1928
                                                                                                                     // 1929
        // Create the base element, initialise HTML and set classes.                                                 // 1930
        // Add handles and links.                                                                                    // 1931
        $Base = addSlider( options.dir, options.ort, $Target );                                                      // 1932
        $Handles = addHandles( options.handles, options.dir, $Base );                                                // 1933
                                                                                                                     // 1934
        // Set the connect classes.                                                                                  // 1935
        addConnection ( options.connect, $Target, $Handles );                                                        // 1936
                                                                                                                     // 1937
        // Attach user events.                                                                                       // 1938
        events( options.events );                                                                                    // 1939
                                                                                                                     // 1940
// Methods                                                                                                           // 1941
                                                                                                                     // 1942
        target.vSet = valueSet;                                                                                      // 1943
        target.vGet = valueGet;                                                                                      // 1944
        target.destroy = destroyTarget;                                                                              // 1945
                                                                                                                     // 1946
        target.getCurrentStep = getCurrentStep;                                                                      // 1947
        target.getOriginalOptions = getOriginalOptions;                                                              // 1948
                                                                                                                     // 1949
        target.getInfo = function(){                                                                                 // 1950
                return [                                                                                             // 1951
                        $Spectrum,                                                                                   // 1952
                        options.style,                                                                               // 1953
                        options.ort                                                                                  // 1954
                ];                                                                                                   // 1955
        };                                                                                                           // 1956
                                                                                                                     // 1957
        // Use the public value method to set the start values.                                                      // 1958
        $Target.val( options.start );                                                                                // 1959
                                                                                                                     // 1960
}                                                                                                                    // 1961
                                                                                                                     // 1962
                                                                                                                     // 1963
        // Run the standard initializer                                                                              // 1964
        function initialize ( originalOptions ) {                                                                    // 1965
                                                                                                                     // 1966
                // Throw error if group is empty.                                                                    // 1967
                if ( !this.length ){                                                                                 // 1968
                        throw new Error("noUiSlider: Can't initialize slider on empty selection.");                  // 1969
                }                                                                                                    // 1970
                                                                                                                     // 1971
                // Test the options once, not for every slider.                                                      // 1972
                var options = testOptions( originalOptions, this );                                                  // 1973
                                                                                                                     // 1974
                // Loop all items, and provide a new closed-scope environment.                                       // 1975
                return this.each(function(){                                                                         // 1976
                        closure(this, options, originalOptions);                                                     // 1977
                });                                                                                                  // 1978
        }                                                                                                            // 1979
                                                                                                                     // 1980
        // Destroy the slider, then re-enter initialization.                                                         // 1981
        function rebuild ( options ) {                                                                               // 1982
                                                                                                                     // 1983
                return this.each(function(){                                                                         // 1984
                                                                                                                     // 1985
                        // The rebuild flag can be used if the slider wasn't initialized yet.                        // 1986
                        if ( !this.destroy ) {                                                                       // 1987
                                $(this).noUiSlider( options );                                                       // 1988
                                return;                                                                              // 1989
                        }                                                                                            // 1990
                                                                                                                     // 1991
                        // Get the current values from the slider,                                                   // 1992
                        // including the initialization options.                                                     // 1993
                        var values = $(this).val(), originalOptions = this.destroy(),                                // 1994
                                                                                                                     // 1995
                                // Extend the previous options with the newly provided ones.                         // 1996
                                newOptions = $.extend( {}, originalOptions, options );                               // 1997
                                                                                                                     // 1998
                        // Run the standard initializer.                                                             // 1999
                        $(this).noUiSlider( newOptions );                                                            // 2000
                                                                                                                     // 2001
                        // Place Link elements back.                                                                 // 2002
                        this.reappend();                                                                             // 2003
                                                                                                                     // 2004
                        // If the start option hasn't changed,                                                       // 2005
                        // reset the previous values.                                                                // 2006
                        if ( originalOptions.start === newOptions.start ) {                                          // 2007
                                $(this).val(values);                                                                 // 2008
                        }                                                                                            // 2009
                });                                                                                                  // 2010
        }                                                                                                            // 2011
                                                                                                                     // 2012
        // Access the internal getting and setting methods based on argument count.                                  // 2013
        function value ( ) {                                                                                         // 2014
                return this[0][ !arguments.length ? 'vGet' : 'vSet' ].apply(this[0], arguments);                     // 2015
        }                                                                                                            // 2016
                                                                                                                     // 2017
        // Override the .val() method. Test every element. Is it a slider? Go to                                     // 2018
        // the slider value handling. No? Use the standard method.                                                   // 2019
        // Note how $.fn.val expects 'this' to be an instance of $. For convenience,                                 // 2020
        // the above 'value' function does too.                                                                      // 2021
        $.fn.val = function ( ) {                                                                                    // 2022
                                                                                                                     // 2023
                // this === instanceof $                                                                             // 2024
                                                                                                                     // 2025
                function valMethod( a ){                                                                             // 2026
                        return a.hasClass(Classes[0]) ? value : $val;                                                // 2027
                }                                                                                                    // 2028
                                                                                                                     // 2029
                var args = arguments,                                                                                // 2030
                        first = $(this[0]);                                                                          // 2031
                                                                                                                     // 2032
                if ( !arguments.length ) {                                                                           // 2033
                        return valMethod(first).call(first);                                                         // 2034
                }                                                                                                    // 2035
                                                                                                                     // 2036
                // Return the set so it remains chainable                                                            // 2037
                return this.each(function(){                                                                         // 2038
                        valMethod($(this)).apply($(this), args);                                                     // 2039
                });                                                                                                  // 2040
        };                                                                                                           // 2041
                                                                                                                     // 2042
// Extend jQuery/Zepto with the noUiSlider method.                                                                   // 2043
        $.fn.noUiSlider = function ( options, rebuildFlag ) {                                                        // 2044
                                                                                                                     // 2045
                switch ( options ) {                                                                                 // 2046
                        case 'step': return this[0].getCurrentStep();                                                // 2047
                        case 'options': return this[0].getOriginalOptions();                                         // 2048
                }                                                                                                    // 2049
                                                                                                                     // 2050
                return ( rebuildFlag ? rebuild : initialize ).call(this, options);                                   // 2051
        };                                                                                                           // 2052
                                                                                                                     // 2053
        function getGroup ( $Spectrum, mode, values, stepped ) {                                                     // 2054
                                                                                                                     // 2055
                // Use the range.                                                                                    // 2056
                if ( mode === 'range' || mode === 'steps' ) {                                                        // 2057
                        return $Spectrum.xVal;                                                                       // 2058
                }                                                                                                    // 2059
                                                                                                                     // 2060
                if ( mode === 'count' ) {                                                                            // 2061
                                                                                                                     // 2062
                        // Divide 0 - 100 in 'count' parts.                                                          // 2063
                        var spread = ( 100 / (values-1) ), v, i = 0;                                                 // 2064
                        values = [];                                                                                 // 2065
                                                                                                                     // 2066
                        // List these parts and have them handled as 'positions'.                                    // 2067
                        while ((v=i++*spread) <= 100 ) {                                                             // 2068
                                values.push(v);                                                                      // 2069
                        }                                                                                            // 2070
                                                                                                                     // 2071
                        mode = 'positions';                                                                          // 2072
                }                                                                                                    // 2073
                                                                                                                     // 2074
                if ( mode === 'positions' ) {                                                                        // 2075
                                                                                                                     // 2076
                        // Map all percentages to on-range values.                                                   // 2077
                        return $.map(values, function( value ){                                                      // 2078
                                return $Spectrum.fromStepping( stepped ? $Spectrum.getStep( value ) : value );       // 2079
                        });                                                                                          // 2080
                }                                                                                                    // 2081
                                                                                                                     // 2082
                if ( mode === 'values' ) {                                                                           // 2083
                                                                                                                     // 2084
                        // If the value must be stepped, it needs to be converted to a percentage first.             // 2085
                        if ( stepped ) {                                                                             // 2086
                                                                                                                     // 2087
                                return $.map(values, function( value ){                                              // 2088
                                                                                                                     // 2089
                                        // Convert to percentage, apply step, return to value.                       // 2090
                                        return $Spectrum.fromStepping( $Spectrum.getStep( $Spectrum.toStepping( value ) ) );
                                });                                                                                  // 2092
                                                                                                                     // 2093
                        }                                                                                            // 2094
                                                                                                                     // 2095
                        // Otherwise, we can simply use the values.                                                  // 2096
                        return values;                                                                               // 2097
                }                                                                                                    // 2098
        }                                                                                                            // 2099
                                                                                                                     // 2100
        function generateSpread ( $Spectrum, density, mode, group ) {                                                // 2101
                                                                                                                     // 2102
                var originalSpectrumDirection = $Spectrum.direction,                                                 // 2103
                        indexes = {},                                                                                // 2104
                        firstInRange = $Spectrum.xVal[0],                                                            // 2105
                        lastInRange = $Spectrum.xVal[$Spectrum.xVal.length-1],                                       // 2106
                        ignoreFirst = false,                                                                         // 2107
                        ignoreLast = false,                                                                          // 2108
                        prevPct = 0;                                                                                 // 2109
                                                                                                                     // 2110
                // This function loops the spectrum in an ltr linear fashion,                                        // 2111
                // while the toStepping method is direction aware. Trick it into                                     // 2112
                // believing it is ltr.                                                                              // 2113
                $Spectrum.direction = 0;                                                                             // 2114
                                                                                                                     // 2115
                // Create a copy of the group, sort it and filter away all duplicates.                               // 2116
                group = unique(group.slice().sort(function(a, b){ return a - b; }));                                 // 2117
                                                                                                                     // 2118
                // Make sure the range starts with the first element.                                                // 2119
                if ( group[0] !== firstInRange ) {                                                                   // 2120
                        group.unshift(firstInRange);                                                                 // 2121
                        ignoreFirst = true;                                                                          // 2122
                }                                                                                                    // 2123
                                                                                                                     // 2124
                // Likewise for the last one.                                                                        // 2125
                if ( group[group.length - 1] !== lastInRange ) {                                                     // 2126
                        group.push(lastInRange);                                                                     // 2127
                        ignoreLast = true;                                                                           // 2128
                }                                                                                                    // 2129
                                                                                                                     // 2130
                $.each(group, function ( index ) {                                                                   // 2131
                                                                                                                     // 2132
                        // Get the current step and the lower + upper positions.                                     // 2133
                        var step, i, q,                                                                              // 2134
                                low = group[index],                                                                  // 2135
                                high = group[index+1],                                                               // 2136
                                newPct, pctDifference, pctPos, type,                                                 // 2137
                                steps, realSteps, stepsize;                                                          // 2138
                                                                                                                     // 2139
                        // When using 'steps' mode, use the provided steps.                                          // 2140
                        // Otherwise, we'll step on to the next subrange.                                            // 2141
                        if ( mode === 'steps' ) {                                                                    // 2142
                                step = $Spectrum.xNumSteps[ index ];                                                 // 2143
                        }                                                                                            // 2144
                                                                                                                     // 2145
                        // Default to a 'full' step.                                                                 // 2146
                        if ( !step ) {                                                                               // 2147
                                step = high-low;                                                                     // 2148
                        }                                                                                            // 2149
                                                                                                                     // 2150
                        // Low can be 0, so test for false. If high is undefined,                                    // 2151
                        // we are at the last subrange. Index 0 is already handled.                                  // 2152
                        if ( low === false || high === undefined ) {                                                 // 2153
                                return;                                                                              // 2154
                        }                                                                                            // 2155
                                                                                                                     // 2156
                        // Find all steps in the subrange.                                                           // 2157
                        for ( i = low; i <= high; i += step ) {                                                      // 2158
                                                                                                                     // 2159
                                // Get the percentage value for the current step,                                    // 2160
                                // calculate the size for the subrange.                                              // 2161
                                newPct = $Spectrum.toStepping( i );                                                  // 2162
                                pctDifference = newPct - prevPct;                                                    // 2163
                                                                                                                     // 2164
                                steps = pctDifference / density;                                                     // 2165
                                realSteps = Math.round(steps);                                                       // 2166
                                                                                                                     // 2167
                                // This ratio represents the ammount of percentage-space a point indicates.          // 2168
                                // For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
                                // Round the percentage offset to an even number, then divide by two                 // 2170
                                // to spread the offset on both sides of the range.                                  // 2171
                                stepsize = pctDifference/realSteps;                                                  // 2172
                                                                                                                     // 2173
                                // Divide all points evenly, adding the correct number to this subrange.             // 2174
                                // Run up to <= so that 100% gets a point, event if ignoreLast is set.               // 2175
                                for ( q = 1; q <= realSteps; q += 1 ) {                                              // 2176
                                                                                                                     // 2177
                                        // The ratio between the rounded value and the actual size might be ~1% off. // 2178
                                        // Correct the percentage offset by the number of points                     // 2179
                                        // per subrange. density = 1 will result in 100 points on the                // 2180
                                        // full range, 2 for 50, 4 for 25, etc.                                      // 2181
                                        pctPos = prevPct + ( q * stepsize );                                         // 2182
                                        indexes[pctPos.toFixed(5)] = ['x', 0];                                       // 2183
                                }                                                                                    // 2184
                                                                                                                     // 2185
                                // Determine the point type.                                                         // 2186
                                type = ($.inArray(i, group) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );                // 2187
                                                                                                                     // 2188
                                // Enforce the 'ignoreFirst' option by overwriting the type for 0.                   // 2189
                                if ( !index && ignoreFirst && !low ) {                                               // 2190
                                        type = 0;                                                                    // 2191
                                }                                                                                    // 2192
                                                                                                                     // 2193
                                if ( !(i === high && ignoreLast)) {                                                  // 2194
                                        // Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value. // 2195
                                        indexes[newPct.toFixed(5)] = [i, type];                                      // 2196
                                }                                                                                    // 2197
                                                                                                                     // 2198
                                // Update the percentage count.                                                      // 2199
                                prevPct = newPct;                                                                    // 2200
                        }                                                                                            // 2201
                });                                                                                                  // 2202
                                                                                                                     // 2203
                // Reset the spectrum.                                                                               // 2204
                $Spectrum.direction = originalSpectrumDirection;                                                     // 2205
                                                                                                                     // 2206
                return indexes;                                                                                      // 2207
        }                                                                                                            // 2208
                                                                                                                     // 2209
        function addMarking ( CSSstyle, orientation, direction, spread, filterFunc, formatter ) {                    // 2210
                                                                                                                     // 2211
                var style = ['horizontal', 'vertical'][orientation],                                                 // 2212
                        element = $('<div/>');                                                                       // 2213
                                                                                                                     // 2214
                element.addClass('noUi-pips noUi-pips-'+style);                                                      // 2215
                                                                                                                     // 2216
                function getSize( type, value ){                                                                     // 2217
                        return [ '-normal', '-large', '-sub' ][(type&&filterFunc) ? filterFunc(value, type) : type]; // 2218
                }                                                                                                    // 2219
                function getTags( offset, source, values ) {                                                         // 2220
                        return 'class="' + source + ' ' +                                                            // 2221
                                source + '-' + style + ' ' +                                                         // 2222
                                source + getSize(values[1], values[0]) +                                             // 2223
                                '" style="' + CSSstyle + ': ' + offset + '%"';                                       // 2224
                }                                                                                                    // 2225
                function addSpread ( offset, values ){                                                               // 2226
                                                                                                                     // 2227
                        if ( direction ) {                                                                           // 2228
                                offset = 100 - offset;                                                               // 2229
                        }                                                                                            // 2230
                                                                                                                     // 2231
                        // Add a marker for every point                                                              // 2232
                        element.append('<div '+getTags(offset, 'noUi-marker', values)+'></div>');                    // 2233
                                                                                                                     // 2234
                        // Values are only appended for points marked '1' or '2'.                                    // 2235
                        if ( values[1] ) {                                                                           // 2236
                                element.append('<div '+getTags(offset, 'noUi-value', values)+'>' + formatter.to(values[0]) + '</div>');
                        }                                                                                            // 2238
                }                                                                                                    // 2239
                                                                                                                     // 2240
                // Append all points.                                                                                // 2241
                $.each(spread, addSpread);                                                                           // 2242
                                                                                                                     // 2243
                return element;                                                                                      // 2244
        }                                                                                                            // 2245
                                                                                                                     // 2246
        $.fn.noUiSlider_pips = function ( grid ) {                                                                   // 2247
                                                                                                                     // 2248
        var mode = grid.mode,                                                                                        // 2249
                density = grid.density || 1,                                                                         // 2250
                filter = grid.filter || false,                                                                       // 2251
                values = grid.values || false,                                                                       // 2252
                format = grid.format || {                                                                            // 2253
                        to: Math.round                                                                               // 2254
                },                                                                                                   // 2255
                stepped = grid.stepped || false;                                                                     // 2256
                                                                                                                     // 2257
                return this.each(function(){                                                                         // 2258
                                                                                                                     // 2259
                var info = this.getInfo(),                                                                           // 2260
                        group = getGroup( info[0], mode, values, stepped ),                                          // 2261
                        spread = generateSpread( info[0], density, mode, group );                                    // 2262
                                                                                                                     // 2263
                        return $(this).append(addMarking(                                                            // 2264
                                info[1],                                                                             // 2265
                                info[2],                                                                             // 2266
                                info[0].direction,                                                                   // 2267
                                spread,                                                                              // 2268
                                filter,                                                                              // 2269
                                format                                                                               // 2270
                        ));                                                                                          // 2271
                });                                                                                                  // 2272
        };                                                                                                           // 2273
                                                                                                                     // 2274
}( window.jQuery || window.Zepto ));                                                                                 // 2275
                                                                                                                     // 2276
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("rcy:nouislider");

})();
