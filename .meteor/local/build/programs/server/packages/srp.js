(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Random = Package.random.Random;
var check = Package.check.check;
var Match = Package.check.Match;
var SHA256 = Package.sha.SHA256;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var BigInteger, SRP;

var require = meteorInstall({"node_modules":{"meteor":{"srp":{"biginteger.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/srp/biginteger.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/// METEOR WRAPPER
BigInteger = function () {
  /// BEGIN jsbn.js

  /*
   * Copyright (c) 2003-2005  Tom Wu
   * All Rights Reserved.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
   * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
   * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
   *
   * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
   * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
   * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
   * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
   * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * In addition, the following condition applies:
   *
   * All redistributions must retain an intact copy of this copyright notice
   * and disclaimer.
   */
  // Basic JavaScript BN library - subset useful for RSA encryption.
  // Bits per digit
  var dbits; // JavaScript engine analysis

  var canary = 0xdeadbeefcafe;
  var j_lm = (canary & 0xffffff) == 0xefcafe; // (public) Constructor

  function BigInteger(a, b, c) {
    if (a != null) if ("number" == typeof a) this.fromNumber(a, b, c);else if (b == null && "string" != typeof a) this.fromString(a, 256);else this.fromString(a, b);
  } // return new, unset BigInteger


  function nbi() {
    return new BigInteger(null);
  } // am: Compute w_j += (x*this_i), propagate carries,
  // c is initial carry, returns final carry.
  // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
  // We need to select the fastest one that works in this environment.
  // am1: use a single mult and divide to get the high bits,
  // max digit bits should be 26 because
  // max internal value = 2*dvalue^2-2*dvalue (< 2^53)


  function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
      var v = x * this[i++] + w[j] + c;
      c = Math.floor(v / 0x4000000);
      w[j++] = v & 0x3ffffff;
    }

    return c;
  } // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)


  function am2(i, x, w, j, c, n) {
    var xl = x & 0x7fff,
        xh = x >> 15;

    while (--n >= 0) {
      var l = this[i] & 0x7fff;
      var h = this[i++] >> 15;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
      c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
      w[j++] = l & 0x3fffffff;
    }

    return c;
  } // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.


  function am3(i, x, w, j, c, n) {
    var xl = x & 0x3fff,
        xh = x >> 14;

    while (--n >= 0) {
      var l = this[i] & 0x3fff;
      var h = this[i++] >> 14;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
      c = (l >> 28) + (m >> 14) + xh * h;
      w[j++] = l & 0xfffffff;
    }

    return c;
  }
  /* XXX METEOR XXX
  if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
  }
  else if(j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
  }
  else 
  */


  {
    // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = (1 << dbits) - 1;
  BigInteger.prototype.DV = 1 << dbits;
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2, BI_FP);
  BigInteger.prototype.F1 = BI_FP - dbits;
  BigInteger.prototype.F2 = 2 * dbits - BI_FP; // Digit conversions

  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr, vv;
  rr = "0".charCodeAt(0);

  for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;

  rr = "a".charCodeAt(0);

  for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

  rr = "A".charCodeAt(0);

  for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

  function int2char(n) {
    return BI_RM.charAt(n);
  }

  function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return c == null ? -1 : c;
  } // (protected) copy this to r


  function bnpCopyTo(r) {
    for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];

    r.t = this.t;
    r.s = this.s;
  } // (protected) set from integer value x, -DV <= x < DV


  function bnpFromInt(x) {
    this.t = 1;
    this.s = x < 0 ? -1 : 0;
    if (x > 0) this[0] = x;else if (x < -1) this[0] = x + DV;else this.t = 0;
  } // return bigint initialized to value


  function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
  } // (protected) set from string and radix


  function bnpFromString(s, b) {
    var k;
    if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 256) k = 8; // byte array
    else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else {
        this.fromRadix(s, b);
        return;
      }
    this.t = 0;
    this.s = 0;
    var i = s.length,
        mi = false,
        sh = 0;

    while (--i >= 0) {
      var x = k == 8 ? s[i] & 0xff : intAt(s, i);

      if (x < 0) {
        if (s.charAt(i) == "-") mi = true;
        continue;
      }

      mi = false;
      if (sh == 0) this[this.t++] = x;else if (sh + k > this.DB) {
        this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
        this[this.t++] = x >> this.DB - sh;
      } else this[this.t - 1] |= x << sh;
      sh += k;
      if (sh >= this.DB) sh -= this.DB;
    }

    if (k == 8 && (s[0] & 0x80) != 0) {
      this.s = -1;
      if (sh > 0) this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
    }

    this.clamp();
    if (mi) BigInteger.ZERO.subTo(this, this);
  } // (protected) clamp off excess high words


  function bnpClamp() {
    var c = this.s & this.DM;

    while (this.t > 0 && this[this.t - 1] == c) --this.t;
  } // (public) return string representation in given radix


  function bnToString(b) {
    if (this.s < 0) return "-" + this.negate().toString(b);
    var k;
    if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else return this.toRadix(b);
    var km = (1 << k) - 1,
        d,
        m = false,
        r = "",
        i = this.t;
    var p = this.DB - i * this.DB % k;

    if (i-- > 0) {
      if (p < this.DB && (d = this[i] >> p) > 0) {
        m = true;
        r = int2char(d);
      }

      while (i >= 0) {
        if (p < k) {
          d = (this[i] & (1 << p) - 1) << k - p;
          d |= this[--i] >> (p += this.DB - k);
        } else {
          d = this[i] >> (p -= k) & km;

          if (p <= 0) {
            p += this.DB;
            --i;
          }
        }

        if (d > 0) m = true;
        if (m) r += int2char(d);
      }
    }

    return m ? r : "0";
  } // (public) -this


  function bnNegate() {
    var r = nbi();
    BigInteger.ZERO.subTo(this, r);
    return r;
  } // (public) |this|


  function bnAbs() {
    return this.s < 0 ? this.negate() : this;
  } // (public) return + if this > a, - if this < a, 0 if equal


  function bnCompareTo(a) {
    var r = this.s - a.s;
    if (r != 0) return r;
    var i = this.t;
    r = i - a.t;
    if (r != 0) return r;

    while (--i >= 0) if ((r = this[i] - a[i]) != 0) return r;

    return 0;
  } // returns bit length of the integer x


  function nbits(x) {
    var r = 1,
        t;

    if ((t = x >>> 16) != 0) {
      x = t;
      r += 16;
    }

    if ((t = x >> 8) != 0) {
      x = t;
      r += 8;
    }

    if ((t = x >> 4) != 0) {
      x = t;
      r += 4;
    }

    if ((t = x >> 2) != 0) {
      x = t;
      r += 2;
    }

    if ((t = x >> 1) != 0) {
      x = t;
      r += 1;
    }

    return r;
  } // (public) return the number of bits in "this"


  function bnBitLength() {
    if (this.t <= 0) return 0;
    return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
  } // (protected) r = this << n*DB


  function bnpDLShiftTo(n, r) {
    var i;

    for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];

    for (i = n - 1; i >= 0; --i) r[i] = 0;

    r.t = this.t + n;
    r.s = this.s;
  } // (protected) r = this >> n*DB


  function bnpDRShiftTo(n, r) {
    for (var i = n; i < this.t; ++i) r[i - n] = this[i];

    r.t = Math.max(this.t - n, 0);
    r.s = this.s;
  } // (protected) r = this << n


  function bnpLShiftTo(n, r) {
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << cbs) - 1;
    var ds = Math.floor(n / this.DB),
        c = this.s << bs & this.DM,
        i;

    for (i = this.t - 1; i >= 0; --i) {
      r[i + ds + 1] = this[i] >> cbs | c;
      c = (this[i] & bm) << bs;
    }

    for (i = ds - 1; i >= 0; --i) r[i] = 0;

    r[ds] = c;
    r.t = this.t + ds + 1;
    r.s = this.s;
    r.clamp();
  } // (protected) r = this >> n


  function bnpRShiftTo(n, r) {
    r.s = this.s;
    var ds = Math.floor(n / this.DB);

    if (ds >= this.t) {
      r.t = 0;
      return;
    }

    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << bs) - 1;
    r[0] = this[ds] >> bs;

    for (var i = ds + 1; i < this.t; ++i) {
      r[i - ds - 1] |= (this[i] & bm) << cbs;
      r[i - ds] = this[i] >> bs;
    }

    if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
    r.t = this.t - ds;
    r.clamp();
  } // (protected) r = this - a


  function bnpSubTo(a, r) {
    var i = 0,
        c = 0,
        m = Math.min(a.t, this.t);

    while (i < m) {
      c += this[i] - a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }

    if (a.t < this.t) {
      c -= a.s;

      while (i < this.t) {
        c += this[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }

      c += this.s;
    } else {
      c += this.s;

      while (i < a.t) {
        c -= a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }

      c -= a.s;
    }

    r.s = c < 0 ? -1 : 0;
    if (c < -1) r[i++] = this.DV + c;else if (c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  } // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.


  function bnpMultiplyTo(a, r) {
    var x = this.abs(),
        y = a.abs();
    var i = x.t;
    r.t = i + y.t;

    while (--i >= 0) r[i] = 0;

    for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);

    r.s = 0;
    r.clamp();
    if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
  } // (protected) r = this^2, r != this (HAC 14.16)


  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2 * x.t;

    while (--i >= 0) r[i] = 0;

    for (i = 0; i < x.t - 1; ++i) {
      var c = x.am(i, x[i], r, 2 * i, 0, 1);

      if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
        r[i + x.t] -= x.DV;
        r[i + x.t + 1] = 1;
      }
    }

    if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
    r.s = 0;
    r.clamp();
  } // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.


  function bnpDivRemTo(m, q, r) {
    var pm = m.abs();
    if (pm.t <= 0) return;
    var pt = this.abs();

    if (pt.t < pm.t) {
      if (q != null) q.fromInt(0);
      if (r != null) this.copyTo(r);
      return;
    }

    if (r == null) r = nbi();
    var y = nbi(),
        ts = this.s,
        ms = m.s;
    var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus

    if (nsh > 0) {
      pm.lShiftTo(nsh, y);
      pt.lShiftTo(nsh, r);
    } else {
      pm.copyTo(y);
      pt.copyTo(r);
    }

    var ys = y.t;
    var y0 = y[ys - 1];
    if (y0 == 0) return;
    var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
    var d1 = this.FV / yt,
        d2 = (1 << this.F1) / yt,
        e = 1 << this.F2;
    var i = r.t,
        j = i - ys,
        t = q == null ? nbi() : q;
    y.dlShiftTo(j, t);

    if (r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t, r);
    }

    BigInteger.ONE.dlShiftTo(ys, t);
    t.subTo(y, y); // "negative" y so we can replace sub with am later

    while (y.t < ys) y[y.t++] = 0;

    while (--j >= 0) {
      // Estimate quotient digit
      var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);

      if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
        // Try it out
        y.dlShiftTo(j, t);
        r.subTo(t, r);

        while (r[i] < --qd) r.subTo(t, r);
      }
    }

    if (q != null) {
      r.drShiftTo(ys, q);
      if (ts != ms) BigInteger.ZERO.subTo(q, q);
    }

    r.t = ys;
    r.clamp();
    if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder

    if (ts < 0) BigInteger.ZERO.subTo(r, r);
  } // (public) this mod a


  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a, null, r);
    if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
    return r;
  } // Modular reduction using "classic" algorithm


  function Classic(m) {
    this.m = m;
  }

  function cConvert(x) {
    if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);else return x;
  }

  function cRevert(x) {
    return x;
  }

  function cReduce(x) {
    x.divRemTo(this.m, null, x);
  }

  function cMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }

  function cSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }

  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo; // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
  // justification:
  //         xy == 1 (mod m)
  //         xy =  1+km
  //   xy(2-xy) = (1+km)(1-km)
  // x[y(2-xy)] = 1-k^2m^2
  // x[y(2-xy)] == 1 (mod m^2)
  // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
  // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
  // JS multiply "overflows" differently from C/C++, so care is needed here.

  function bnpInvDigit() {
    if (this.t < 1) return 0;
    var x = this[0];
    if ((x & 1) == 0) return 0;
    var y = x & 3; // y == 1/x mod 2^2

    y = y * (2 - (x & 0xf) * y) & 0xf; // y == 1/x mod 2^4

    y = y * (2 - (x & 0xff) * y) & 0xff; // y == 1/x mod 2^8

    y = y * (2 - ((x & 0xffff) * y & 0xffff)) & 0xffff; // y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints

    y = y * (2 - x * y % this.DV) % this.DV; // y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV

    return y > 0 ? this.DV - y : -y;
  } // Montgomery reduction


  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 0x7fff;
    this.mph = this.mp >> 15;
    this.um = (1 << m.DB - 15) - 1;
    this.mt2 = 2 * m.t;
  } // xR mod m


  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
    return r;
  } // x/R mod m


  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  } // x = x/R mod m (HAC 14.32)


  function montReduce(x) {
    while (x.t <= this.mt2) // pad x so am has enough room later
    x[x.t++] = 0;

    for (var i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i] & 0x7fff;
      var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM; // use am to combine the multiply-shift-add into one call

      j = i + this.m.t;
      x[j] += this.m.am(0, u0, x, i, 0, this.m.t); // propagate carry

      while (x[j] >= x.DV) {
        x[j] -= x.DV;
        x[++j]++;
      }
    }

    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
  } // r = "x^2/R mod m"; x != r


  function montSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  } // r = "xy/R mod m"; x,y != r


  function montMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }

  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo; // (protected) true iff this is even

  function bnpIsEven() {
    return (this.t > 0 ? this[0] & 1 : this.s) == 0;
  } // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)


  function bnpExp(e, z) {
    if (e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(),
        r2 = nbi(),
        g = z.convert(this),
        i = nbits(e) - 1;
    g.copyTo(r);

    while (--i >= 0) {
      z.sqrTo(r, r2);
      if ((e & 1 << i) > 0) z.mulTo(r2, g, r);else {
        var t = r;
        r = r2;
        r2 = t;
      }
    }

    return z.revert(r);
  } // (public) this^e % m, 0 <= e < 2^32


  function bnModPowInt(e, m) {
    var z;
    if (e < 256 || m.isEven()) z = new Classic(m);else z = new Montgomery(m);
    return this.exp(e, z);
  } // protected


  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp; // public

  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt; // "constants"

  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1); /// BEGIN jsbn2.js

  /*
   * Copyright (c) 2003-2005  Tom Wu
   * All Rights Reserved.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
   * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
   * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
   *
   * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
   * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
   * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
   * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
   * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * In addition, the following condition applies:
   *
   * All redistributions must retain an intact copy of this copyright notice
   * and disclaimer.
   */
  // Extended JavaScript BN functions, required for RSA private ops.
  // (public)

  function bnClone() {
    var r = nbi();
    this.copyTo(r);
    return r;
  } // (public) return value as integer


  function bnIntValue() {
    if (this.s < 0) {
      if (this.t == 1) return this[0] - this.DV;else if (this.t == 0) return -1;
    } else if (this.t == 1) return this[0];else if (this.t == 0) return 0; // assumes 16 < DB < 32


    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
  } // (public) return value as byte


  function bnByteValue() {
    return this.t == 0 ? this.s : this[0] << 24 >> 24;
  } // (public) return value as short (assumes DB>=16)


  function bnShortValue() {
    return this.t == 0 ? this.s : this[0] << 16 >> 16;
  } // (protected) return x s.t. r^x < DV


  function bnpChunkSize(r) {
    return Math.floor(Math.LN2 * this.DB / Math.log(r));
  } // (public) 0 if this == 0, 1 if this > 0


  function bnSigNum() {
    if (this.s < 0) return -1;else if (this.t <= 0 || this.t == 1 && this[0] <= 0) return 0;else return 1;
  } // (protected) convert to radix string


  function bnpToRadix(b) {
    if (b == null) b = 10;
    if (this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b, cs);
    var d = nbv(a),
        y = nbi(),
        z = nbi(),
        r = "";
    this.divRemTo(d, y, z);

    while (y.signum() > 0) {
      r = (a + z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d, y, z);
    }

    return z.intValue().toString(b) + r;
  } // (protected) convert from radix string


  function bnpFromRadix(s, b) {
    this.fromInt(0);
    if (b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b, cs),
        mi = false,
        j = 0,
        w = 0;

    for (var i = 0; i < s.length; ++i) {
      var x = intAt(s, i);

      if (x < 0) {
        if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
        continue;
      }

      w = b * w + x;

      if (++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w, 0);
        j = 0;
        w = 0;
      }
    }

    if (j > 0) {
      this.dMultiply(Math.pow(b, j));
      this.dAddOffset(w, 0);
    }

    if (mi) BigInteger.ZERO.subTo(this, this);
  } // (protected) alternate constructor


  function bnpFromNumber(a, b, c) {
    if ("number" == typeof b) {
      // new BigInteger(int,int,RNG)
      if (a < 2) this.fromInt(1);else {
        this.fromNumber(a, c);
        if (!this.testBit(a - 1)) // force MSB set
          this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
        if (this.isEven()) this.dAddOffset(1, 0); // force odd

        while (!this.isProbablePrime(b)) {
          this.dAddOffset(2, 0);
          if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
        }
      }
    } else {
      // new BigInteger(int,RNG)
      var x = new Array(),
          t = a & 7;
      x.length = (a >> 3) + 1;
      b.nextBytes(x);
      if (t > 0) x[0] &= (1 << t) - 1;else x[0] = 0;
      this.fromString(x, 256);
    }
  } // (public) convert to bigendian byte array


  function bnToByteArray() {
    var i = this.t,
        r = new Array();
    r[0] = this.s;
    var p = this.DB - i * this.DB % 8,
        d,
        k = 0;

    if (i-- > 0) {
      if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) r[k++] = d | this.s << this.DB - p;

      while (i >= 0) {
        if (p < 8) {
          d = (this[i] & (1 << p) - 1) << 8 - p;
          d |= this[--i] >> (p += this.DB - 8);
        } else {
          d = this[i] >> (p -= 8) & 0xff;

          if (p <= 0) {
            p += this.DB;
            --i;
          }
        }

        if ((d & 0x80) != 0) d |= -256;
        if (k == 0 && (this.s & 0x80) != (d & 0x80)) ++k;
        if (k > 0 || d != this.s) r[k++] = d;
      }
    }

    return r;
  }

  function bnEquals(a) {
    return this.compareTo(a) == 0;
  }

  function bnMin(a) {
    return this.compareTo(a) < 0 ? this : a;
  }

  function bnMax(a) {
    return this.compareTo(a) > 0 ? this : a;
  } // (protected) r = this op a (bitwise)


  function bnpBitwiseTo(a, op, r) {
    var i,
        f,
        m = Math.min(a.t, this.t);

    for (i = 0; i < m; ++i) r[i] = op(this[i], a[i]);

    if (a.t < this.t) {
      f = a.s & this.DM;

      for (i = m; i < this.t; ++i) r[i] = op(this[i], f);

      r.t = this.t;
    } else {
      f = this.s & this.DM;

      for (i = m; i < a.t; ++i) r[i] = op(f, a[i]);

      r.t = a.t;
    }

    r.s = op(this.s, a.s);
    r.clamp();
  } // (public) this & a


  function op_and(x, y) {
    return x & y;
  }

  function bnAnd(a) {
    var r = nbi();
    this.bitwiseTo(a, op_and, r);
    return r;
  } // (public) this | a


  function op_or(x, y) {
    return x | y;
  }

  function bnOr(a) {
    var r = nbi();
    this.bitwiseTo(a, op_or, r);
    return r;
  } // (public) this ^ a


  function op_xor(x, y) {
    return x ^ y;
  }

  function bnXor(a) {
    var r = nbi();
    this.bitwiseTo(a, op_xor, r);
    return r;
  } // (public) this & ~a


  function op_andnot(x, y) {
    return x & ~y;
  }

  function bnAndNot(a) {
    var r = nbi();
    this.bitwiseTo(a, op_andnot, r);
    return r;
  } // (public) ~this


  function bnNot() {
    var r = nbi();

    for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i];

    r.t = this.t;
    r.s = ~this.s;
    return r;
  } // (public) this << n


  function bnShiftLeft(n) {
    var r = nbi();
    if (n < 0) this.rShiftTo(-n, r);else this.lShiftTo(n, r);
    return r;
  } // (public) this >> n


  function bnShiftRight(n) {
    var r = nbi();
    if (n < 0) this.lShiftTo(-n, r);else this.rShiftTo(n, r);
    return r;
  } // return index of lowest 1-bit in x, x < 2^31


  function lbit(x) {
    if (x == 0) return -1;
    var r = 0;

    if ((x & 0xffff) == 0) {
      x >>= 16;
      r += 16;
    }

    if ((x & 0xff) == 0) {
      x >>= 8;
      r += 8;
    }

    if ((x & 0xf) == 0) {
      x >>= 4;
      r += 4;
    }

    if ((x & 3) == 0) {
      x >>= 2;
      r += 2;
    }

    if ((x & 1) == 0) ++r;
    return r;
  } // (public) returns index of lowest 1-bit (or -1 if none)


  function bnGetLowestSetBit() {
    for (var i = 0; i < this.t; ++i) if (this[i] != 0) return i * this.DB + lbit(this[i]);

    if (this.s < 0) return this.t * this.DB;
    return -1;
  } // return number of 1 bits in x


  function cbit(x) {
    var r = 0;

    while (x != 0) {
      x &= x - 1;
      ++r;
    }

    return r;
  } // (public) return number of set bits


  function bnBitCount() {
    var r = 0,
        x = this.s & this.DM;

    for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x);

    return r;
  } // (public) true iff nth bit is set


  function bnTestBit(n) {
    var j = Math.floor(n / this.DB);
    if (j >= this.t) return this.s != 0;
    return (this[j] & 1 << n % this.DB) != 0;
  } // (protected) this op (1<<n)


  function bnpChangeBit(n, op) {
    var r = BigInteger.ONE.shiftLeft(n);
    this.bitwiseTo(r, op, r);
    return r;
  } // (public) this | (1<<n)


  function bnSetBit(n) {
    return this.changeBit(n, op_or);
  } // (public) this & ~(1<<n)


  function bnClearBit(n) {
    return this.changeBit(n, op_andnot);
  } // (public) this ^ (1<<n)


  function bnFlipBit(n) {
    return this.changeBit(n, op_xor);
  } // (protected) r = this + a


  function bnpAddTo(a, r) {
    var i = 0,
        c = 0,
        m = Math.min(a.t, this.t);

    while (i < m) {
      c += this[i] + a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }

    if (a.t < this.t) {
      c += a.s;

      while (i < this.t) {
        c += this[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }

      c += this.s;
    } else {
      c += this.s;

      while (i < a.t) {
        c += a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }

      c += a.s;
    }

    r.s = c < 0 ? -1 : 0;
    if (c > 0) r[i++] = c;else if (c < -1) r[i++] = this.DV + c;
    r.t = i;
    r.clamp();
  } // (public) this + a


  function bnAdd(a) {
    var r = nbi();
    this.addTo(a, r);
    return r;
  } // (public) this - a


  function bnSubtract(a) {
    var r = nbi();
    this.subTo(a, r);
    return r;
  } // (public) this * a


  function bnMultiply(a) {
    var r = nbi();
    this.multiplyTo(a, r);
    return r;
  } // (public) this / a


  function bnDivide(a) {
    var r = nbi();
    this.divRemTo(a, r, null);
    return r;
  } // (public) this % a


  function bnRemainder(a) {
    var r = nbi();
    this.divRemTo(a, null, r);
    return r;
  } // (public) [this/a,this%a]


  function bnDivideAndRemainder(a) {
    var q = nbi(),
        r = nbi();
    this.divRemTo(a, q, r);
    return new Array(q, r);
  } // (protected) this *= n, this >= 0, 1 < n < DV


  function bnpDMultiply(n) {
    this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp();
  } // (protected) this += n << w words, this >= 0


  function bnpDAddOffset(n, w) {
    while (this.t <= w) this[this.t++] = 0;

    this[w] += n;

    while (this[w] >= this.DV) {
      this[w] -= this.DV;
      if (++w >= this.t) this[this.t++] = 0;
      ++this[w];
    }
  } // A "null" reducer


  function NullExp() {}

  function nNop(x) {
    return x;
  }

  function nMulTo(x, y, r) {
    x.multiplyTo(y, r);
  }

  function nSqrTo(x, r) {
    x.squareTo(r);
  }

  NullExp.prototype.convert = nNop;
  NullExp.prototype.revert = nNop;
  NullExp.prototype.mulTo = nMulTo;
  NullExp.prototype.sqrTo = nSqrTo; // (public) this^e

  function bnPow(e) {
    return this.exp(e, new NullExp());
  } // (protected) r = lower n words of "this * a", a.t <= n
  // "this" should be the larger one if appropriate.


  function bnpMultiplyLowerTo(a, n, r) {
    var i = Math.min(this.t + a.t, n);
    r.s = 0; // assumes a,this >= 0

    r.t = i;

    while (i > 0) r[--i] = 0;

    var j;

    for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);

    for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i);

    r.clamp();
  } // (protected) r = "this * a" without lower n words, n > 0
  // "this" should be the larger one if appropriate.


  function bnpMultiplyUpperTo(a, n, r) {
    --n;
    var i = r.t = this.t + a.t - n;
    r.s = 0; // assumes a,this >= 0

    while (--i >= 0) r[i] = 0;

    for (i = Math.max(n - this.t, 0); i < a.t; ++i) r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);

    r.clamp();
    r.drShiftTo(1, r);
  } // Barrett modular reduction


  function Barrett(m) {
    // setup Barrett
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
    this.mu = this.r2.divide(m);
    this.m = m;
  }

  function barrettConvert(x) {
    if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);else if (x.compareTo(this.m) < 0) return x;else {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }
  }

  function barrettRevert(x) {
    return x;
  } // x = x mod m (HAC 14.42)


  function barrettReduce(x) {
    x.drShiftTo(this.m.t - 1, this.r2);

    if (x.t > this.m.t + 1) {
      x.t = this.m.t + 1;
      x.clamp();
    }

    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);

    while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);

    x.subTo(this.r2, x);

    while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
  } // r = x^2 mod m; x != r


  function barrettSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  } // r = x*y mod m; x,y != r


  function barrettMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }

  Barrett.prototype.convert = barrettConvert;
  Barrett.prototype.revert = barrettRevert;
  Barrett.prototype.reduce = barrettReduce;
  Barrett.prototype.mulTo = barrettMulTo;
  Barrett.prototype.sqrTo = barrettSqrTo; // (public) this^e % m (HAC 14.85)

  function bnModPow(e, m) {
    var i = e.bitLength(),
        k,
        r = nbv(1),
        z;
    if (i <= 0) return r;else if (i < 18) k = 1;else if (i < 48) k = 3;else if (i < 144) k = 4;else if (i < 768) k = 5;else k = 6;
    if (i < 8) z = new Classic(m);else if (m.isEven()) z = new Barrett(m);else z = new Montgomery(m); // precomputation

    var g = new Array(),
        n = 3,
        k1 = k - 1,
        km = (1 << k) - 1;
    g[1] = z.convert(this);

    if (k > 1) {
      var g2 = nbi();
      z.sqrTo(g[1], g2);

      while (n <= km) {
        g[n] = nbi();
        z.mulTo(g2, g[n - 2], g[n]);
        n += 2;
      }
    }

    var j = e.t - 1,
        w,
        is1 = true,
        r2 = nbi(),
        t;
    i = nbits(e[j]) - 1;

    while (j >= 0) {
      if (i >= k1) w = e[j] >> i - k1 & km;else {
        w = (e[j] & (1 << i + 1) - 1) << k1 - i;
        if (j > 0) w |= e[j - 1] >> this.DB + i - k1;
      }
      n = k;

      while ((w & 1) == 0) {
        w >>= 1;
        --n;
      }

      if ((i -= n) < 0) {
        i += this.DB;
        --j;
      }

      if (is1) {
        // ret == 1, don't bother squaring or multiplying it
        g[w].copyTo(r);
        is1 = false;
      } else {
        while (n > 1) {
          z.sqrTo(r, r2);
          z.sqrTo(r2, r);
          n -= 2;
        }

        if (n > 0) z.sqrTo(r, r2);else {
          t = r;
          r = r2;
          r2 = t;
        }
        z.mulTo(r2, g[w], r);
      }

      while (j >= 0 && (e[j] & 1 << i) == 0) {
        z.sqrTo(r, r2);
        t = r;
        r = r2;
        r2 = t;

        if (--i < 0) {
          i = this.DB - 1;
          --j;
        }
      }
    }

    return z.revert(r);
  } // (public) gcd(this,a) (HAC 14.54)


  function bnGCD(a) {
    var x = this.s < 0 ? this.negate() : this.clone();
    var y = a.s < 0 ? a.negate() : a.clone();

    if (x.compareTo(y) < 0) {
      var t = x;
      x = y;
      y = t;
    }

    var i = x.getLowestSetBit(),
        g = y.getLowestSetBit();
    if (g < 0) return x;
    if (i < g) g = i;

    if (g > 0) {
      x.rShiftTo(g, x);
      y.rShiftTo(g, y);
    }

    while (x.signum() > 0) {
      if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
      if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);

      if (x.compareTo(y) >= 0) {
        x.subTo(y, x);
        x.rShiftTo(1, x);
      } else {
        y.subTo(x, y);
        y.rShiftTo(1, y);
      }
    }

    if (g > 0) y.lShiftTo(g, y);
    return y;
  } // (protected) this % n, n < 2^26


  function bnpModInt(n) {
    if (n <= 0) return 0;
    var d = this.DV % n,
        r = this.s < 0 ? n - 1 : 0;
    if (this.t > 0) if (d == 0) r = this[0] % n;else for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n;
    return r;
  } // (public) 1/this % m (HAC 14.61)


  function bnModInverse(m) {
    var ac = m.isEven();
    if (this.isEven() && ac || m.signum() == 0) return BigInteger.ZERO;
    var u = m.clone(),
        v = this.clone();
    var a = nbv(1),
        b = nbv(0),
        c = nbv(0),
        d = nbv(1);

    while (u.signum() != 0) {
      while (u.isEven()) {
        u.rShiftTo(1, u);

        if (ac) {
          if (!a.isEven() || !b.isEven()) {
            a.addTo(this, a);
            b.subTo(m, b);
          }

          a.rShiftTo(1, a);
        } else if (!b.isEven()) b.subTo(m, b);

        b.rShiftTo(1, b);
      }

      while (v.isEven()) {
        v.rShiftTo(1, v);

        if (ac) {
          if (!c.isEven() || !d.isEven()) {
            c.addTo(this, c);
            d.subTo(m, d);
          }

          c.rShiftTo(1, c);
        } else if (!d.isEven()) d.subTo(m, d);

        d.rShiftTo(1, d);
      }

      if (u.compareTo(v) >= 0) {
        u.subTo(v, u);
        if (ac) a.subTo(c, a);
        b.subTo(d, b);
      } else {
        v.subTo(u, v);
        if (ac) c.subTo(a, c);
        d.subTo(b, d);
      }
    }

    if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
    if (d.compareTo(m) >= 0) return d.subtract(m);
    if (d.signum() < 0) d.addTo(m, d);else return d;
    if (d.signum() < 0) return d.add(m);else return d;
  }

  var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509];
  var lplim = (1 << 26) / lowprimes[lowprimes.length - 1]; // (public) test primality with certainty >= 1-.5^t

  function bnIsProbablePrime(t) {
    var i,
        x = this.abs();

    if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
      for (i = 0; i < lowprimes.length; ++i) if (x[0] == lowprimes[i]) return true;

      return false;
    }

    if (x.isEven()) return false;
    i = 1;

    while (i < lowprimes.length) {
      var m = lowprimes[i],
          j = i + 1;

      while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];

      m = x.modInt(m);

      while (i < j) if (m % lowprimes[i++] == 0) return false;
    }

    return x.millerRabin(t);
  } // (protected) true if probably prime (HAC 4.24, Miller-Rabin)


  function bnpMillerRabin(t) {
    var n1 = this.subtract(BigInteger.ONE);
    var k = n1.getLowestSetBit();
    if (k <= 0) return false;
    var r = n1.shiftRight(k);
    t = t + 1 >> 1;
    if (t > lowprimes.length) t = lowprimes.length;
    var a = nbi();

    for (var i = 0; i < t; ++i) {
      a.fromInt(lowprimes[i]);
      var y = a.modPow(r, this);

      if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
        var j = 1;

        while (j++ < k && y.compareTo(n1) != 0) {
          y = y.modPowInt(2, this);
          if (y.compareTo(BigInteger.ONE) == 0) return false;
        }

        if (y.compareTo(n1) != 0) return false;
      }
    }

    return true;
  } // protected


  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.fromNumber = bnpFromNumber;
  BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
  BigInteger.prototype.changeBit = bnpChangeBit;
  BigInteger.prototype.addTo = bnpAddTo;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
  BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
  BigInteger.prototype.modInt = bnpModInt;
  BigInteger.prototype.millerRabin = bnpMillerRabin; // public

  BigInteger.prototype.clone = bnClone;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.byteValue = bnByteValue;
  BigInteger.prototype.shortValue = bnShortValue;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.toByteArray = bnToByteArray;
  BigInteger.prototype.equals = bnEquals;
  BigInteger.prototype.min = bnMin;
  BigInteger.prototype.max = bnMax;
  BigInteger.prototype.and = bnAnd;
  BigInteger.prototype.or = bnOr;
  BigInteger.prototype.xor = bnXor;
  BigInteger.prototype.andNot = bnAndNot;
  BigInteger.prototype.not = bnNot;
  BigInteger.prototype.shiftLeft = bnShiftLeft;
  BigInteger.prototype.shiftRight = bnShiftRight;
  BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
  BigInteger.prototype.bitCount = bnBitCount;
  BigInteger.prototype.testBit = bnTestBit;
  BigInteger.prototype.setBit = bnSetBit;
  BigInteger.prototype.clearBit = bnClearBit;
  BigInteger.prototype.flipBit = bnFlipBit;
  BigInteger.prototype.add = bnAdd;
  BigInteger.prototype.subtract = bnSubtract;
  BigInteger.prototype.multiply = bnMultiply;
  BigInteger.prototype.divide = bnDivide;
  BigInteger.prototype.remainder = bnRemainder;
  BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
  BigInteger.prototype.modPow = bnModPow;
  BigInteger.prototype.modInverse = bnModInverse;
  BigInteger.prototype.pow = bnPow;
  BigInteger.prototype.gcd = bnGCD;
  BigInteger.prototype.isProbablePrime = bnIsProbablePrime; // BigInteger interfaces not implemented in jsbn:
  // BigInteger(int signum, byte[] magnitude)
  // double doubleValue()
  // float floatValue()
  // int hashCode()
  // long longValue()
  // static BigInteger valueOf(long val)
  /// METEOR WRAPPER

  return BigInteger;
}();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"srp.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/srp/srp.js                                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/builtin/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/objectSpread"));

// This package contains just enough of the original SRP code to
// support the backwards-compatibility upgrade path.
//
// An SRP (and possibly also accounts-srp) package should eventually be
// available in Atmosphere so that users can continue to use SRP if they
// want to.
SRP = {};
/**
 * Generate a new SRP verifier. Password is the plaintext password.
 *
 * options is optional and can include:
 * - identity: String. The SRP username to user. Mostly this is passed
 *   in for testing.  Random UUID if not provided.
 * - hashedIdentityAndPassword: combined identity and password, already hashed, for the SRP to bcrypt upgrade path.
 * - salt: String. A salt to use.  Mostly this is passed in for
 *   testing.  Random UUID if not provided.
 * - SRP parameters (see _defaults and paramsFromOptions below)
 */

SRP.generateVerifier = function (password, options) {
  var params = paramsFromOptions(options);
  var salt = options && options.salt || Random.secret();
  var identity;
  var hashedIdentityAndPassword = options && options.hashedIdentityAndPassword;

  if (!hashedIdentityAndPassword) {
    identity = options && options.identity || Random.secret();
    hashedIdentityAndPassword = params.hash(identity + ":" + password);
  }

  var x = params.hash(salt + hashedIdentityAndPassword);
  var xi = new BigInteger(x, 16);
  var v = params.g.modPow(xi, params.N);
  return {
    identity: identity,
    salt: salt,
    verifier: v.toString(16)
  };
}; // For use with check().


SRP.matchVerifier = {
  identity: String,
  salt: String,
  verifier: String
};
/**
 * Default parameter values for SRP.
 *
 */

var _defaults = {
  hash: function (x) {
    return SHA256(x).toLowerCase();
  },
  N: new BigInteger("EEAF0AB9ADB38DD69C33F80AFA8FC5E86072618775FF3C0B9EA2314C9C256576D674DF7496EA81D3383B4813D692C6E0E0D5D8E250B98BE48E495C1D6089DAD15DC7D7B46154D6B6CE8EF4AD69B15D4982559B297BCF1885C529F566660E57EC68EDBC3C05726CC02FD4CBF4976EAA9AFD5138FE8376435B9FC61D2FC0EB06E3", 16),
  g: new BigInteger("2")
};
_defaults.k = new BigInteger(_defaults.hash(_defaults.N.toString(16) + _defaults.g.toString(16)), 16);
/**
 * Process an options hash to create SRP parameters.
 *
 * Options can include:
 * - hash: Function. Defaults to SHA256.
 * - N: String or BigInteger. Defaults to 1024 bit value from RFC 5054
 * - g: String or BigInteger. Defaults to 2.
 * - k: String or BigInteger. Defaults to hash(N, g)
 */

var paramsFromOptions = function (options) {
  if (!options) // fast path
    return _defaults;
  var ret = (0, _objectSpread2.default)({}, _defaults);
  ['N', 'g', 'k'].forEach(function (p) {
    if (options[p]) {
      if (typeof options[p] === "string") ret[p] = new BigInteger(options[p], 16);else if (options[p] instanceof BigInteger) ret[p] = options[p];else throw new Error("Invalid parameter: " + p);
    }
  });
  if (options.hash) ret.hash = function (x) {
    return options.hash(x).toLowerCase();
  };

  if (!options.k && (options.N || options.g || options.hash)) {
    ret.k = ret.hash(ret.N.toString(16) + ret.g.toString(16));
  }

  return ret;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("/node_modules/meteor/srp/biginteger.js");
require("/node_modules/meteor/srp/srp.js");

/* Exports */
Package._define("srp", {
  SRP: SRP
});

})();

//# sourceURL=meteor://💻app/packages/srp.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3JwL2JpZ2ludGVnZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3NycC9zcnAuanMiXSwibmFtZXMiOlsiQmlnSW50ZWdlciIsImRiaXRzIiwiY2FuYXJ5Iiwial9sbSIsImEiLCJiIiwiYyIsImZyb21OdW1iZXIiLCJmcm9tU3RyaW5nIiwibmJpIiwiYW0xIiwiaSIsIngiLCJ3IiwiaiIsIm4iLCJ2IiwiTWF0aCIsImZsb29yIiwiYW0yIiwieGwiLCJ4aCIsImwiLCJoIiwibSIsImFtMyIsInByb3RvdHlwZSIsImFtIiwiREIiLCJETSIsIkRWIiwiQklfRlAiLCJGViIsInBvdyIsIkYxIiwiRjIiLCJCSV9STSIsIkJJX1JDIiwiQXJyYXkiLCJyciIsInZ2IiwiY2hhckNvZGVBdCIsImludDJjaGFyIiwiY2hhckF0IiwiaW50QXQiLCJzIiwiYm5wQ29weVRvIiwiciIsInQiLCJibnBGcm9tSW50IiwibmJ2IiwiZnJvbUludCIsImJucEZyb21TdHJpbmciLCJrIiwiZnJvbVJhZGl4IiwibGVuZ3RoIiwibWkiLCJzaCIsImNsYW1wIiwiWkVSTyIsInN1YlRvIiwiYm5wQ2xhbXAiLCJiblRvU3RyaW5nIiwibmVnYXRlIiwidG9TdHJpbmciLCJ0b1JhZGl4Iiwia20iLCJkIiwicCIsImJuTmVnYXRlIiwiYm5BYnMiLCJibkNvbXBhcmVUbyIsIm5iaXRzIiwiYm5CaXRMZW5ndGgiLCJibnBETFNoaWZ0VG8iLCJibnBEUlNoaWZ0VG8iLCJtYXgiLCJibnBMU2hpZnRUbyIsImJzIiwiY2JzIiwiYm0iLCJkcyIsImJucFJTaGlmdFRvIiwiYm5wU3ViVG8iLCJtaW4iLCJibnBNdWx0aXBseVRvIiwiYWJzIiwieSIsImJucFNxdWFyZVRvIiwiYm5wRGl2UmVtVG8iLCJxIiwicG0iLCJwdCIsImNvcHlUbyIsInRzIiwibXMiLCJuc2giLCJsU2hpZnRUbyIsInlzIiwieTAiLCJ5dCIsImQxIiwiZDIiLCJlIiwiZGxTaGlmdFRvIiwiY29tcGFyZVRvIiwiT05FIiwicWQiLCJkclNoaWZ0VG8iLCJyU2hpZnRUbyIsImJuTW9kIiwiZGl2UmVtVG8iLCJDbGFzc2ljIiwiY0NvbnZlcnQiLCJtb2QiLCJjUmV2ZXJ0IiwiY1JlZHVjZSIsImNNdWxUbyIsIm11bHRpcGx5VG8iLCJyZWR1Y2UiLCJjU3FyVG8iLCJzcXVhcmVUbyIsImNvbnZlcnQiLCJyZXZlcnQiLCJtdWxUbyIsInNxclRvIiwiYm5wSW52RGlnaXQiLCJNb250Z29tZXJ5IiwibXAiLCJpbnZEaWdpdCIsIm1wbCIsIm1waCIsInVtIiwibXQyIiwibW9udENvbnZlcnQiLCJtb250UmV2ZXJ0IiwibW9udFJlZHVjZSIsInUwIiwibW9udFNxclRvIiwibW9udE11bFRvIiwiYm5wSXNFdmVuIiwiYm5wRXhwIiwieiIsInIyIiwiZyIsImJuTW9kUG93SW50IiwiaXNFdmVuIiwiZXhwIiwiYml0TGVuZ3RoIiwibW9kUG93SW50IiwiYm5DbG9uZSIsImJuSW50VmFsdWUiLCJibkJ5dGVWYWx1ZSIsImJuU2hvcnRWYWx1ZSIsImJucENodW5rU2l6ZSIsIkxOMiIsImxvZyIsImJuU2lnTnVtIiwiYm5wVG9SYWRpeCIsInNpZ251bSIsImNzIiwiY2h1bmtTaXplIiwiaW50VmFsdWUiLCJzdWJzdHIiLCJibnBGcm9tUmFkaXgiLCJkTXVsdGlwbHkiLCJkQWRkT2Zmc2V0IiwiYm5wRnJvbU51bWJlciIsInRlc3RCaXQiLCJiaXR3aXNlVG8iLCJzaGlmdExlZnQiLCJvcF9vciIsImlzUHJvYmFibGVQcmltZSIsIm5leHRCeXRlcyIsImJuVG9CeXRlQXJyYXkiLCJibkVxdWFscyIsImJuTWluIiwiYm5NYXgiLCJibnBCaXR3aXNlVG8iLCJvcCIsImYiLCJvcF9hbmQiLCJibkFuZCIsImJuT3IiLCJvcF94b3IiLCJiblhvciIsIm9wX2FuZG5vdCIsImJuQW5kTm90IiwiYm5Ob3QiLCJiblNoaWZ0TGVmdCIsImJuU2hpZnRSaWdodCIsImxiaXQiLCJibkdldExvd2VzdFNldEJpdCIsImNiaXQiLCJibkJpdENvdW50IiwiYm5UZXN0Qml0IiwiYm5wQ2hhbmdlQml0IiwiYm5TZXRCaXQiLCJjaGFuZ2VCaXQiLCJibkNsZWFyQml0IiwiYm5GbGlwQml0IiwiYm5wQWRkVG8iLCJibkFkZCIsImFkZFRvIiwiYm5TdWJ0cmFjdCIsImJuTXVsdGlwbHkiLCJibkRpdmlkZSIsImJuUmVtYWluZGVyIiwiYm5EaXZpZGVBbmRSZW1haW5kZXIiLCJibnBETXVsdGlwbHkiLCJibnBEQWRkT2Zmc2V0IiwiTnVsbEV4cCIsIm5Ob3AiLCJuTXVsVG8iLCJuU3FyVG8iLCJiblBvdyIsImJucE11bHRpcGx5TG93ZXJUbyIsImJucE11bHRpcGx5VXBwZXJUbyIsIkJhcnJldHQiLCJxMyIsIm11IiwiZGl2aWRlIiwiYmFycmV0dENvbnZlcnQiLCJiYXJyZXR0UmV2ZXJ0IiwiYmFycmV0dFJlZHVjZSIsIm11bHRpcGx5VXBwZXJUbyIsIm11bHRpcGx5TG93ZXJUbyIsImJhcnJldHRTcXJUbyIsImJhcnJldHRNdWxUbyIsImJuTW9kUG93IiwiazEiLCJnMiIsImlzMSIsImJuR0NEIiwiY2xvbmUiLCJnZXRMb3dlc3RTZXRCaXQiLCJibnBNb2RJbnQiLCJibk1vZEludmVyc2UiLCJhYyIsInUiLCJzdWJ0cmFjdCIsImFkZCIsImxvd3ByaW1lcyIsImxwbGltIiwiYm5Jc1Byb2JhYmxlUHJpbWUiLCJtb2RJbnQiLCJtaWxsZXJSYWJpbiIsImJucE1pbGxlclJhYmluIiwibjEiLCJzaGlmdFJpZ2h0IiwibW9kUG93IiwiYnl0ZVZhbHVlIiwic2hvcnRWYWx1ZSIsInRvQnl0ZUFycmF5IiwiZXF1YWxzIiwiYW5kIiwib3IiLCJ4b3IiLCJhbmROb3QiLCJub3QiLCJiaXRDb3VudCIsInNldEJpdCIsImNsZWFyQml0IiwiZmxpcEJpdCIsIm11bHRpcGx5IiwicmVtYWluZGVyIiwiZGl2aWRlQW5kUmVtYWluZGVyIiwibW9kSW52ZXJzZSIsImdjZCIsIlNSUCIsImdlbmVyYXRlVmVyaWZpZXIiLCJwYXNzd29yZCIsIm9wdGlvbnMiLCJwYXJhbXMiLCJwYXJhbXNGcm9tT3B0aW9ucyIsInNhbHQiLCJSYW5kb20iLCJzZWNyZXQiLCJpZGVudGl0eSIsImhhc2hlZElkZW50aXR5QW5kUGFzc3dvcmQiLCJoYXNoIiwieGkiLCJOIiwidmVyaWZpZXIiLCJtYXRjaFZlcmlmaWVyIiwiU3RyaW5nIiwiX2RlZmF1bHRzIiwiU0hBMjU2IiwidG9Mb3dlckNhc2UiLCJyZXQiLCJmb3JFYWNoIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQUEsYUFBYyxZQUFZO0FBRzFCOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQkE7QUFFQTtBQUNBLE1BQUlDLEtBQUosQ0F2QzBCLENBeUMxQjs7QUFDQSxNQUFJQyxTQUFTLGNBQWI7QUFDQSxNQUFJQyxPQUFRLENBQUNELFNBQU8sUUFBUixLQUFtQixRQUEvQixDQTNDMEIsQ0E2QzFCOztBQUNBLFdBQVNGLFVBQVQsQ0FBb0JJLENBQXBCLEVBQXNCQyxDQUF0QixFQUF3QkMsQ0FBeEIsRUFBMkI7QUFDekIsUUFBR0YsS0FBSyxJQUFSLEVBQ0UsSUFBRyxZQUFZLE9BQU9BLENBQXRCLEVBQXlCLEtBQUtHLFVBQUwsQ0FBZ0JILENBQWhCLEVBQWtCQyxDQUFsQixFQUFvQkMsQ0FBcEIsRUFBekIsS0FDSyxJQUFHRCxLQUFLLElBQUwsSUFBYSxZQUFZLE9BQU9ELENBQW5DLEVBQXNDLEtBQUtJLFVBQUwsQ0FBZ0JKLENBQWhCLEVBQWtCLEdBQWxCLEVBQXRDLEtBQ0EsS0FBS0ksVUFBTCxDQUFnQkosQ0FBaEIsRUFBa0JDLENBQWxCO0FBQ1IsR0FuRHlCLENBcUQxQjs7O0FBQ0EsV0FBU0ksR0FBVCxHQUFlO0FBQUUsV0FBTyxJQUFJVCxVQUFKLENBQWUsSUFBZixDQUFQO0FBQThCLEdBdERyQixDQXdEMUI7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUNBLFdBQVNVLEdBQVQsQ0FBYUMsQ0FBYixFQUFlQyxDQUFmLEVBQWlCQyxDQUFqQixFQUFtQkMsQ0FBbkIsRUFBcUJSLENBQXJCLEVBQXVCUyxDQUF2QixFQUEwQjtBQUN4QixXQUFNLEVBQUVBLENBQUYsSUFBTyxDQUFiLEVBQWdCO0FBQ2QsVUFBSUMsSUFBSUosSUFBRSxLQUFLRCxHQUFMLENBQUYsR0FBWUUsRUFBRUMsQ0FBRixDQUFaLEdBQWlCUixDQUF6QjtBQUNBQSxVQUFJVyxLQUFLQyxLQUFMLENBQVdGLElBQUUsU0FBYixDQUFKO0FBQ0FILFFBQUVDLEdBQUYsSUFBU0UsSUFBRSxTQUFYO0FBQ0Q7O0FBQ0QsV0FBT1YsQ0FBUDtBQUNELEdBdkV5QixDQXdFMUI7QUFDQTtBQUNBOzs7QUFDQSxXQUFTYSxHQUFULENBQWFSLENBQWIsRUFBZUMsQ0FBZixFQUFpQkMsQ0FBakIsRUFBbUJDLENBQW5CLEVBQXFCUixDQUFyQixFQUF1QlMsQ0FBdkIsRUFBMEI7QUFDeEIsUUFBSUssS0FBS1IsSUFBRSxNQUFYO0FBQUEsUUFBbUJTLEtBQUtULEtBQUcsRUFBM0I7O0FBQ0EsV0FBTSxFQUFFRyxDQUFGLElBQU8sQ0FBYixFQUFnQjtBQUNkLFVBQUlPLElBQUksS0FBS1gsQ0FBTCxJQUFRLE1BQWhCO0FBQ0EsVUFBSVksSUFBSSxLQUFLWixHQUFMLEtBQVcsRUFBbkI7QUFDQSxVQUFJYSxJQUFJSCxLQUFHQyxDQUFILEdBQUtDLElBQUVILEVBQWY7QUFDQUUsVUFBSUYsS0FBR0UsQ0FBSCxJQUFNLENBQUNFLElBQUUsTUFBSCxLQUFZLEVBQWxCLElBQXNCWCxFQUFFQyxDQUFGLENBQXRCLElBQTRCUixJQUFFLFVBQTlCLENBQUo7QUFDQUEsVUFBSSxDQUFDZ0IsTUFBSSxFQUFMLEtBQVVFLE1BQUksRUFBZCxJQUFrQkgsS0FBR0UsQ0FBckIsSUFBd0JqQixNQUFJLEVBQTVCLENBQUo7QUFDQU8sUUFBRUMsR0FBRixJQUFTUSxJQUFFLFVBQVg7QUFDRDs7QUFDRCxXQUFPaEIsQ0FBUDtBQUNELEdBdEZ5QixDQXVGMUI7QUFDQTs7O0FBQ0EsV0FBU21CLEdBQVQsQ0FBYWQsQ0FBYixFQUFlQyxDQUFmLEVBQWlCQyxDQUFqQixFQUFtQkMsQ0FBbkIsRUFBcUJSLENBQXJCLEVBQXVCUyxDQUF2QixFQUEwQjtBQUN4QixRQUFJSyxLQUFLUixJQUFFLE1BQVg7QUFBQSxRQUFtQlMsS0FBS1QsS0FBRyxFQUEzQjs7QUFDQSxXQUFNLEVBQUVHLENBQUYsSUFBTyxDQUFiLEVBQWdCO0FBQ2QsVUFBSU8sSUFBSSxLQUFLWCxDQUFMLElBQVEsTUFBaEI7QUFDQSxVQUFJWSxJQUFJLEtBQUtaLEdBQUwsS0FBVyxFQUFuQjtBQUNBLFVBQUlhLElBQUlILEtBQUdDLENBQUgsR0FBS0MsSUFBRUgsRUFBZjtBQUNBRSxVQUFJRixLQUFHRSxDQUFILElBQU0sQ0FBQ0UsSUFBRSxNQUFILEtBQVksRUFBbEIsSUFBc0JYLEVBQUVDLENBQUYsQ0FBdEIsR0FBMkJSLENBQS9CO0FBQ0FBLFVBQUksQ0FBQ2dCLEtBQUcsRUFBSixLQUFTRSxLQUFHLEVBQVosSUFBZ0JILEtBQUdFLENBQXZCO0FBQ0FWLFFBQUVDLEdBQUYsSUFBU1EsSUFBRSxTQUFYO0FBQ0Q7O0FBQ0QsV0FBT2hCLENBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7Ozs7O0FBWUE7QUFBRTtBQUNBTixlQUFXMEIsU0FBWCxDQUFxQkMsRUFBckIsR0FBMEJGLEdBQTFCO0FBQ0F4QixZQUFRLEVBQVI7QUFDRDtBQUVERCxhQUFXMEIsU0FBWCxDQUFxQkUsRUFBckIsR0FBMEIzQixLQUExQjtBQUNBRCxhQUFXMEIsU0FBWCxDQUFxQkcsRUFBckIsR0FBMkIsQ0FBQyxLQUFHNUIsS0FBSixJQUFXLENBQXRDO0FBQ0FELGFBQVcwQixTQUFYLENBQXFCSSxFQUFyQixHQUEyQixLQUFHN0IsS0FBOUI7QUFFQSxNQUFJOEIsUUFBUSxFQUFaO0FBQ0EvQixhQUFXMEIsU0FBWCxDQUFxQk0sRUFBckIsR0FBMEJmLEtBQUtnQixHQUFMLENBQVMsQ0FBVCxFQUFXRixLQUFYLENBQTFCO0FBQ0EvQixhQUFXMEIsU0FBWCxDQUFxQlEsRUFBckIsR0FBMEJILFFBQU05QixLQUFoQztBQUNBRCxhQUFXMEIsU0FBWCxDQUFxQlMsRUFBckIsR0FBMEIsSUFBRWxDLEtBQUYsR0FBUThCLEtBQWxDLENBOUgwQixDQWdJMUI7O0FBQ0EsTUFBSUssUUFBUSxzQ0FBWjtBQUNBLE1BQUlDLFFBQVEsSUFBSUMsS0FBSixFQUFaO0FBQ0EsTUFBSUMsRUFBSixFQUFPQyxFQUFQO0FBQ0FELE9BQUssSUFBSUUsVUFBSixDQUFlLENBQWYsQ0FBTDs7QUFDQSxPQUFJRCxLQUFLLENBQVQsRUFBWUEsTUFBTSxDQUFsQixFQUFxQixFQUFFQSxFQUF2QixFQUEyQkgsTUFBTUUsSUFBTixJQUFjQyxFQUFkOztBQUMzQkQsT0FBSyxJQUFJRSxVQUFKLENBQWUsQ0FBZixDQUFMOztBQUNBLE9BQUlELEtBQUssRUFBVCxFQUFhQSxLQUFLLEVBQWxCLEVBQXNCLEVBQUVBLEVBQXhCLEVBQTRCSCxNQUFNRSxJQUFOLElBQWNDLEVBQWQ7O0FBQzVCRCxPQUFLLElBQUlFLFVBQUosQ0FBZSxDQUFmLENBQUw7O0FBQ0EsT0FBSUQsS0FBSyxFQUFULEVBQWFBLEtBQUssRUFBbEIsRUFBc0IsRUFBRUEsRUFBeEIsRUFBNEJILE1BQU1FLElBQU4sSUFBY0MsRUFBZDs7QUFFNUIsV0FBU0UsUUFBVCxDQUFrQjNCLENBQWxCLEVBQXFCO0FBQUUsV0FBT3FCLE1BQU1PLE1BQU4sQ0FBYTVCLENBQWIsQ0FBUDtBQUF5Qjs7QUFDaEQsV0FBUzZCLEtBQVQsQ0FBZUMsQ0FBZixFQUFpQmxDLENBQWpCLEVBQW9CO0FBQ2xCLFFBQUlMLElBQUkrQixNQUFNUSxFQUFFSixVQUFGLENBQWE5QixDQUFiLENBQU4sQ0FBUjtBQUNBLFdBQVFMLEtBQUcsSUFBSixHQUFVLENBQUMsQ0FBWCxHQUFhQSxDQUFwQjtBQUNELEdBL0l5QixDQWlKMUI7OztBQUNBLFdBQVN3QyxTQUFULENBQW1CQyxDQUFuQixFQUFzQjtBQUNwQixTQUFJLElBQUlwQyxJQUFJLEtBQUtxQyxDQUFMLEdBQU8sQ0FBbkIsRUFBc0JyQyxLQUFLLENBQTNCLEVBQThCLEVBQUVBLENBQWhDLEVBQW1Db0MsRUFBRXBDLENBQUYsSUFBTyxLQUFLQSxDQUFMLENBQVA7O0FBQ25Db0MsTUFBRUMsQ0FBRixHQUFNLEtBQUtBLENBQVg7QUFDQUQsTUFBRUYsQ0FBRixHQUFNLEtBQUtBLENBQVg7QUFDRCxHQXRKeUIsQ0F3SjFCOzs7QUFDQSxXQUFTSSxVQUFULENBQW9CckMsQ0FBcEIsRUFBdUI7QUFDckIsU0FBS29DLENBQUwsR0FBUyxDQUFUO0FBQ0EsU0FBS0gsQ0FBTCxHQUFVakMsSUFBRSxDQUFILEdBQU0sQ0FBQyxDQUFQLEdBQVMsQ0FBbEI7QUFDQSxRQUFHQSxJQUFJLENBQVAsRUFBVSxLQUFLLENBQUwsSUFBVUEsQ0FBVixDQUFWLEtBQ0ssSUFBR0EsSUFBSSxDQUFDLENBQVIsRUFBVyxLQUFLLENBQUwsSUFBVUEsSUFBRWtCLEVBQVosQ0FBWCxLQUNBLEtBQUtrQixDQUFMLEdBQVMsQ0FBVDtBQUNOLEdBL0p5QixDQWlLMUI7OztBQUNBLFdBQVNFLEdBQVQsQ0FBYXZDLENBQWIsRUFBZ0I7QUFBRSxRQUFJb0MsSUFBSXRDLEtBQVI7QUFBZXNDLE1BQUVJLE9BQUYsQ0FBVXhDLENBQVY7QUFBYyxXQUFPb0MsQ0FBUDtBQUFXLEdBbEtoQyxDQW9LMUI7OztBQUNBLFdBQVNLLGFBQVQsQ0FBdUJQLENBQXZCLEVBQXlCeEMsQ0FBekIsRUFBNEI7QUFDMUIsUUFBSWdELENBQUo7QUFDQSxRQUFHaEQsS0FBSyxFQUFSLEVBQVlnRCxJQUFJLENBQUosQ0FBWixLQUNLLElBQUdoRCxLQUFLLENBQVIsRUFBV2dELElBQUksQ0FBSixDQUFYLEtBQ0EsSUFBR2hELEtBQUssR0FBUixFQUFhZ0QsSUFBSSxDQUFKLENBQWIsQ0FBb0I7QUFBcEIsU0FDQSxJQUFHaEQsS0FBSyxDQUFSLEVBQVdnRCxJQUFJLENBQUosQ0FBWCxLQUNBLElBQUdoRCxLQUFLLEVBQVIsRUFBWWdELElBQUksQ0FBSixDQUFaLEtBQ0EsSUFBR2hELEtBQUssQ0FBUixFQUFXZ0QsSUFBSSxDQUFKLENBQVgsS0FDQTtBQUFFLGFBQUtDLFNBQUwsQ0FBZVQsQ0FBZixFQUFpQnhDLENBQWpCO0FBQXFCO0FBQVM7QUFDckMsU0FBSzJDLENBQUwsR0FBUyxDQUFUO0FBQ0EsU0FBS0gsQ0FBTCxHQUFTLENBQVQ7QUFDQSxRQUFJbEMsSUFBSWtDLEVBQUVVLE1BQVY7QUFBQSxRQUFrQkMsS0FBSyxLQUF2QjtBQUFBLFFBQThCQyxLQUFLLENBQW5DOztBQUNBLFdBQU0sRUFBRTlDLENBQUYsSUFBTyxDQUFiLEVBQWdCO0FBQ2QsVUFBSUMsSUFBS3lDLEtBQUcsQ0FBSixHQUFPUixFQUFFbEMsQ0FBRixJQUFLLElBQVosR0FBaUJpQyxNQUFNQyxDQUFOLEVBQVFsQyxDQUFSLENBQXpCOztBQUNBLFVBQUdDLElBQUksQ0FBUCxFQUFVO0FBQ1IsWUFBR2lDLEVBQUVGLE1BQUYsQ0FBU2hDLENBQVQsS0FBZSxHQUFsQixFQUF1QjZDLEtBQUssSUFBTDtBQUN2QjtBQUNEOztBQUNEQSxXQUFLLEtBQUw7QUFDQSxVQUFHQyxNQUFNLENBQVQsRUFDRSxLQUFLLEtBQUtULENBQUwsRUFBTCxJQUFpQnBDLENBQWpCLENBREYsS0FFSyxJQUFHNkMsS0FBR0osQ0FBSCxHQUFPLEtBQUt6QixFQUFmLEVBQW1CO0FBQ3RCLGFBQUssS0FBS29CLENBQUwsR0FBTyxDQUFaLEtBQWtCLENBQUNwQyxJQUFHLENBQUMsS0FBSSxLQUFLZ0IsRUFBTCxHQUFRNkIsRUFBYixJQUFrQixDQUF0QixLQUEyQkEsRUFBN0M7QUFDQSxhQUFLLEtBQUtULENBQUwsRUFBTCxJQUFrQnBDLEtBQUksS0FBS2dCLEVBQUwsR0FBUTZCLEVBQTlCO0FBQ0QsT0FISSxNQUtILEtBQUssS0FBS1QsQ0FBTCxHQUFPLENBQVosS0FBa0JwQyxLQUFHNkMsRUFBckI7QUFDRkEsWUFBTUosQ0FBTjtBQUNBLFVBQUdJLE1BQU0sS0FBSzdCLEVBQWQsRUFBa0I2QixNQUFNLEtBQUs3QixFQUFYO0FBQ25COztBQUNELFFBQUd5QixLQUFLLENBQUwsSUFBVSxDQUFDUixFQUFFLENBQUYsSUFBSyxJQUFOLEtBQWUsQ0FBNUIsRUFBK0I7QUFDN0IsV0FBS0EsQ0FBTCxHQUFTLENBQUMsQ0FBVjtBQUNBLFVBQUdZLEtBQUssQ0FBUixFQUFXLEtBQUssS0FBS1QsQ0FBTCxHQUFPLENBQVosS0FBbUIsQ0FBQyxLQUFJLEtBQUtwQixFQUFMLEdBQVE2QixFQUFiLElBQWtCLENBQW5CLElBQXVCQSxFQUF6QztBQUNaOztBQUNELFNBQUtDLEtBQUw7QUFDQSxRQUFHRixFQUFILEVBQU94RCxXQUFXMkQsSUFBWCxDQUFnQkMsS0FBaEIsQ0FBc0IsSUFBdEIsRUFBMkIsSUFBM0I7QUFDUixHQXpNeUIsQ0EyTTFCOzs7QUFDQSxXQUFTQyxRQUFULEdBQW9CO0FBQ2xCLFFBQUl2RCxJQUFJLEtBQUt1QyxDQUFMLEdBQU8sS0FBS2hCLEVBQXBCOztBQUNBLFdBQU0sS0FBS21CLENBQUwsR0FBUyxDQUFULElBQWMsS0FBSyxLQUFLQSxDQUFMLEdBQU8sQ0FBWixLQUFrQjFDLENBQXRDLEVBQXlDLEVBQUUsS0FBSzBDLENBQVA7QUFDMUMsR0EvTXlCLENBaU4xQjs7O0FBQ0EsV0FBU2MsVUFBVCxDQUFvQnpELENBQXBCLEVBQXVCO0FBQ3JCLFFBQUcsS0FBS3dDLENBQUwsR0FBUyxDQUFaLEVBQWUsT0FBTyxNQUFJLEtBQUtrQixNQUFMLEdBQWNDLFFBQWQsQ0FBdUIzRCxDQUF2QixDQUFYO0FBQ2YsUUFBSWdELENBQUo7QUFDQSxRQUFHaEQsS0FBSyxFQUFSLEVBQVlnRCxJQUFJLENBQUosQ0FBWixLQUNLLElBQUdoRCxLQUFLLENBQVIsRUFBV2dELElBQUksQ0FBSixDQUFYLEtBQ0EsSUFBR2hELEtBQUssQ0FBUixFQUFXZ0QsSUFBSSxDQUFKLENBQVgsS0FDQSxJQUFHaEQsS0FBSyxFQUFSLEVBQVlnRCxJQUFJLENBQUosQ0FBWixLQUNBLElBQUdoRCxLQUFLLENBQVIsRUFBV2dELElBQUksQ0FBSixDQUFYLEtBQ0EsT0FBTyxLQUFLWSxPQUFMLENBQWE1RCxDQUFiLENBQVA7QUFDTCxRQUFJNkQsS0FBSyxDQUFDLEtBQUdiLENBQUosSUFBTyxDQUFoQjtBQUFBLFFBQW1CYyxDQUFuQjtBQUFBLFFBQXNCM0MsSUFBSSxLQUExQjtBQUFBLFFBQWlDdUIsSUFBSSxFQUFyQztBQUFBLFFBQXlDcEMsSUFBSSxLQUFLcUMsQ0FBbEQ7QUFDQSxRQUFJb0IsSUFBSSxLQUFLeEMsRUFBTCxHQUFTakIsSUFBRSxLQUFLaUIsRUFBUixHQUFZeUIsQ0FBNUI7O0FBQ0EsUUFBRzFDLE1BQU0sQ0FBVCxFQUFZO0FBQ1YsVUFBR3lELElBQUksS0FBS3hDLEVBQVQsSUFBZSxDQUFDdUMsSUFBSSxLQUFLeEQsQ0FBTCxLQUFTeUQsQ0FBZCxJQUFtQixDQUFyQyxFQUF3QztBQUFFNUMsWUFBSSxJQUFKO0FBQVV1QixZQUFJTCxTQUFTeUIsQ0FBVCxDQUFKO0FBQWtCOztBQUN0RSxhQUFNeEQsS0FBSyxDQUFYLEVBQWM7QUFDWixZQUFHeUQsSUFBSWYsQ0FBUCxFQUFVO0FBQ1JjLGNBQUksQ0FBQyxLQUFLeEQsQ0FBTCxJQUFTLENBQUMsS0FBR3lELENBQUosSUFBTyxDQUFqQixLQUF1QmYsSUFBRWUsQ0FBN0I7QUFDQUQsZUFBSyxLQUFLLEVBQUV4RCxDQUFQLE1BQVl5RCxLQUFHLEtBQUt4QyxFQUFMLEdBQVF5QixDQUF2QixDQUFMO0FBQ0QsU0FIRCxNQUlLO0FBQ0hjLGNBQUssS0FBS3hELENBQUwsTUFBVXlELEtBQUdmLENBQWIsQ0FBRCxHQUFrQmEsRUFBdEI7O0FBQ0EsY0FBR0UsS0FBSyxDQUFSLEVBQVc7QUFBRUEsaUJBQUssS0FBS3hDLEVBQVY7QUFBYyxjQUFFakIsQ0FBRjtBQUFNO0FBQ2xDOztBQUNELFlBQUd3RCxJQUFJLENBQVAsRUFBVTNDLElBQUksSUFBSjtBQUNWLFlBQUdBLENBQUgsRUFBTXVCLEtBQUtMLFNBQVN5QixDQUFULENBQUw7QUFDUDtBQUNGOztBQUNELFdBQU8zQyxJQUFFdUIsQ0FBRixHQUFJLEdBQVg7QUFDRCxHQTdPeUIsQ0ErTzFCOzs7QUFDQSxXQUFTc0IsUUFBVCxHQUFvQjtBQUFFLFFBQUl0QixJQUFJdEMsS0FBUjtBQUFlVCxlQUFXMkQsSUFBWCxDQUFnQkMsS0FBaEIsQ0FBc0IsSUFBdEIsRUFBMkJiLENBQTNCO0FBQStCLFdBQU9BLENBQVA7QUFBVyxHQWhQckQsQ0FrUDFCOzs7QUFDQSxXQUFTdUIsS0FBVCxHQUFpQjtBQUFFLFdBQVEsS0FBS3pCLENBQUwsR0FBTyxDQUFSLEdBQVcsS0FBS2tCLE1BQUwsRUFBWCxHQUF5QixJQUFoQztBQUF1QyxHQW5QaEMsQ0FxUDFCOzs7QUFDQSxXQUFTUSxXQUFULENBQXFCbkUsQ0FBckIsRUFBd0I7QUFDdEIsUUFBSTJDLElBQUksS0FBS0YsQ0FBTCxHQUFPekMsRUFBRXlDLENBQWpCO0FBQ0EsUUFBR0UsS0FBSyxDQUFSLEVBQVcsT0FBT0EsQ0FBUDtBQUNYLFFBQUlwQyxJQUFJLEtBQUtxQyxDQUFiO0FBQ0FELFFBQUlwQyxJQUFFUCxFQUFFNEMsQ0FBUjtBQUNBLFFBQUdELEtBQUssQ0FBUixFQUFXLE9BQU9BLENBQVA7O0FBQ1gsV0FBTSxFQUFFcEMsQ0FBRixJQUFPLENBQWIsRUFBZ0IsSUFBRyxDQUFDb0MsSUFBRSxLQUFLcEMsQ0FBTCxJQUFRUCxFQUFFTyxDQUFGLENBQVgsS0FBb0IsQ0FBdkIsRUFBMEIsT0FBT29DLENBQVA7O0FBQzFDLFdBQU8sQ0FBUDtBQUNELEdBOVB5QixDQWdRMUI7OztBQUNBLFdBQVN5QixLQUFULENBQWU1RCxDQUFmLEVBQWtCO0FBQ2hCLFFBQUltQyxJQUFJLENBQVI7QUFBQSxRQUFXQyxDQUFYOztBQUNBLFFBQUcsQ0FBQ0EsSUFBRXBDLE1BQUksRUFBUCxLQUFjLENBQWpCLEVBQW9CO0FBQUVBLFVBQUlvQyxDQUFKO0FBQU9ELFdBQUssRUFBTDtBQUFVOztBQUN2QyxRQUFHLENBQUNDLElBQUVwQyxLQUFHLENBQU4sS0FBWSxDQUFmLEVBQWtCO0FBQUVBLFVBQUlvQyxDQUFKO0FBQU9ELFdBQUssQ0FBTDtBQUFTOztBQUNwQyxRQUFHLENBQUNDLElBQUVwQyxLQUFHLENBQU4sS0FBWSxDQUFmLEVBQWtCO0FBQUVBLFVBQUlvQyxDQUFKO0FBQU9ELFdBQUssQ0FBTDtBQUFTOztBQUNwQyxRQUFHLENBQUNDLElBQUVwQyxLQUFHLENBQU4sS0FBWSxDQUFmLEVBQWtCO0FBQUVBLFVBQUlvQyxDQUFKO0FBQU9ELFdBQUssQ0FBTDtBQUFTOztBQUNwQyxRQUFHLENBQUNDLElBQUVwQyxLQUFHLENBQU4sS0FBWSxDQUFmLEVBQWtCO0FBQUVBLFVBQUlvQyxDQUFKO0FBQU9ELFdBQUssQ0FBTDtBQUFTOztBQUNwQyxXQUFPQSxDQUFQO0FBQ0QsR0F6UXlCLENBMlExQjs7O0FBQ0EsV0FBUzBCLFdBQVQsR0FBdUI7QUFDckIsUUFBRyxLQUFLekIsQ0FBTCxJQUFVLENBQWIsRUFBZ0IsT0FBTyxDQUFQO0FBQ2hCLFdBQU8sS0FBS3BCLEVBQUwsSUFBUyxLQUFLb0IsQ0FBTCxHQUFPLENBQWhCLElBQW1Cd0IsTUFBTSxLQUFLLEtBQUt4QixDQUFMLEdBQU8sQ0FBWixJQUFnQixLQUFLSCxDQUFMLEdBQU8sS0FBS2hCLEVBQWxDLENBQTFCO0FBQ0QsR0EvUXlCLENBaVIxQjs7O0FBQ0EsV0FBUzZDLFlBQVQsQ0FBc0IzRCxDQUF0QixFQUF3QmdDLENBQXhCLEVBQTJCO0FBQ3pCLFFBQUlwQyxDQUFKOztBQUNBLFNBQUlBLElBQUksS0FBS3FDLENBQUwsR0FBTyxDQUFmLEVBQWtCckMsS0FBSyxDQUF2QixFQUEwQixFQUFFQSxDQUE1QixFQUErQm9DLEVBQUVwQyxJQUFFSSxDQUFKLElBQVMsS0FBS0osQ0FBTCxDQUFUOztBQUMvQixTQUFJQSxJQUFJSSxJQUFFLENBQVYsRUFBYUosS0FBSyxDQUFsQixFQUFxQixFQUFFQSxDQUF2QixFQUEwQm9DLEVBQUVwQyxDQUFGLElBQU8sQ0FBUDs7QUFDMUJvQyxNQUFFQyxDQUFGLEdBQU0sS0FBS0EsQ0FBTCxHQUFPakMsQ0FBYjtBQUNBZ0MsTUFBRUYsQ0FBRixHQUFNLEtBQUtBLENBQVg7QUFDRCxHQXhSeUIsQ0EwUjFCOzs7QUFDQSxXQUFTOEIsWUFBVCxDQUFzQjVELENBQXRCLEVBQXdCZ0MsQ0FBeEIsRUFBMkI7QUFDekIsU0FBSSxJQUFJcEMsSUFBSUksQ0FBWixFQUFlSixJQUFJLEtBQUtxQyxDQUF4QixFQUEyQixFQUFFckMsQ0FBN0IsRUFBZ0NvQyxFQUFFcEMsSUFBRUksQ0FBSixJQUFTLEtBQUtKLENBQUwsQ0FBVDs7QUFDaENvQyxNQUFFQyxDQUFGLEdBQU0vQixLQUFLMkQsR0FBTCxDQUFTLEtBQUs1QixDQUFMLEdBQU9qQyxDQUFoQixFQUFrQixDQUFsQixDQUFOO0FBQ0FnQyxNQUFFRixDQUFGLEdBQU0sS0FBS0EsQ0FBWDtBQUNELEdBL1J5QixDQWlTMUI7OztBQUNBLFdBQVNnQyxXQUFULENBQXFCOUQsQ0FBckIsRUFBdUJnQyxDQUF2QixFQUEwQjtBQUN4QixRQUFJK0IsS0FBSy9ELElBQUUsS0FBS2EsRUFBaEI7QUFDQSxRQUFJbUQsTUFBTSxLQUFLbkQsRUFBTCxHQUFRa0QsRUFBbEI7QUFDQSxRQUFJRSxLQUFLLENBQUMsS0FBR0QsR0FBSixJQUFTLENBQWxCO0FBQ0EsUUFBSUUsS0FBS2hFLEtBQUtDLEtBQUwsQ0FBV0gsSUFBRSxLQUFLYSxFQUFsQixDQUFUO0FBQUEsUUFBZ0N0QixJQUFLLEtBQUt1QyxDQUFMLElBQVFpQyxFQUFULEdBQWEsS0FBS2pELEVBQXREO0FBQUEsUUFBMERsQixDQUExRDs7QUFDQSxTQUFJQSxJQUFJLEtBQUtxQyxDQUFMLEdBQU8sQ0FBZixFQUFrQnJDLEtBQUssQ0FBdkIsRUFBMEIsRUFBRUEsQ0FBNUIsRUFBK0I7QUFDN0JvQyxRQUFFcEMsSUFBRXNFLEVBQUYsR0FBSyxDQUFQLElBQWEsS0FBS3RFLENBQUwsS0FBU29FLEdBQVYsR0FBZXpFLENBQTNCO0FBQ0FBLFVBQUksQ0FBQyxLQUFLSyxDQUFMLElBQVFxRSxFQUFULEtBQWNGLEVBQWxCO0FBQ0Q7O0FBQ0QsU0FBSW5FLElBQUlzRSxLQUFHLENBQVgsRUFBY3RFLEtBQUssQ0FBbkIsRUFBc0IsRUFBRUEsQ0FBeEIsRUFBMkJvQyxFQUFFcEMsQ0FBRixJQUFPLENBQVA7O0FBQzNCb0MsTUFBRWtDLEVBQUYsSUFBUTNFLENBQVI7QUFDQXlDLE1BQUVDLENBQUYsR0FBTSxLQUFLQSxDQUFMLEdBQU9pQyxFQUFQLEdBQVUsQ0FBaEI7QUFDQWxDLE1BQUVGLENBQUYsR0FBTSxLQUFLQSxDQUFYO0FBQ0FFLE1BQUVXLEtBQUY7QUFDRCxHQWhUeUIsQ0FrVDFCOzs7QUFDQSxXQUFTd0IsV0FBVCxDQUFxQm5FLENBQXJCLEVBQXVCZ0MsQ0FBdkIsRUFBMEI7QUFDeEJBLE1BQUVGLENBQUYsR0FBTSxLQUFLQSxDQUFYO0FBQ0EsUUFBSW9DLEtBQUtoRSxLQUFLQyxLQUFMLENBQVdILElBQUUsS0FBS2EsRUFBbEIsQ0FBVDs7QUFDQSxRQUFHcUQsTUFBTSxLQUFLakMsQ0FBZCxFQUFpQjtBQUFFRCxRQUFFQyxDQUFGLEdBQU0sQ0FBTjtBQUFTO0FBQVM7O0FBQ3JDLFFBQUk4QixLQUFLL0QsSUFBRSxLQUFLYSxFQUFoQjtBQUNBLFFBQUltRCxNQUFNLEtBQUtuRCxFQUFMLEdBQVFrRCxFQUFsQjtBQUNBLFFBQUlFLEtBQUssQ0FBQyxLQUFHRixFQUFKLElBQVEsQ0FBakI7QUFDQS9CLE1BQUUsQ0FBRixJQUFPLEtBQUtrQyxFQUFMLEtBQVVILEVBQWpCOztBQUNBLFNBQUksSUFBSW5FLElBQUlzRSxLQUFHLENBQWYsRUFBa0J0RSxJQUFJLEtBQUtxQyxDQUEzQixFQUE4QixFQUFFckMsQ0FBaEMsRUFBbUM7QUFDakNvQyxRQUFFcEMsSUFBRXNFLEVBQUYsR0FBSyxDQUFQLEtBQWEsQ0FBQyxLQUFLdEUsQ0FBTCxJQUFRcUUsRUFBVCxLQUFjRCxHQUEzQjtBQUNBaEMsUUFBRXBDLElBQUVzRSxFQUFKLElBQVUsS0FBS3RFLENBQUwsS0FBU21FLEVBQW5CO0FBQ0Q7O0FBQ0QsUUFBR0EsS0FBSyxDQUFSLEVBQVcvQixFQUFFLEtBQUtDLENBQUwsR0FBT2lDLEVBQVAsR0FBVSxDQUFaLEtBQWtCLENBQUMsS0FBS3BDLENBQUwsR0FBT21DLEVBQVIsS0FBYUQsR0FBL0I7QUFDWGhDLE1BQUVDLENBQUYsR0FBTSxLQUFLQSxDQUFMLEdBQU9pQyxFQUFiO0FBQ0FsQyxNQUFFVyxLQUFGO0FBQ0QsR0FsVXlCLENBb1UxQjs7O0FBQ0EsV0FBU3lCLFFBQVQsQ0FBa0IvRSxDQUFsQixFQUFvQjJDLENBQXBCLEVBQXVCO0FBQ3JCLFFBQUlwQyxJQUFJLENBQVI7QUFBQSxRQUFXTCxJQUFJLENBQWY7QUFBQSxRQUFrQmtCLElBQUlQLEtBQUttRSxHQUFMLENBQVNoRixFQUFFNEMsQ0FBWCxFQUFhLEtBQUtBLENBQWxCLENBQXRCOztBQUNBLFdBQU1yQyxJQUFJYSxDQUFWLEVBQWE7QUFDWGxCLFdBQUssS0FBS0ssQ0FBTCxJQUFRUCxFQUFFTyxDQUFGLENBQWI7QUFDQW9DLFFBQUVwQyxHQUFGLElBQVNMLElBQUUsS0FBS3VCLEVBQWhCO0FBQ0F2QixZQUFNLEtBQUtzQixFQUFYO0FBQ0Q7O0FBQ0QsUUFBR3hCLEVBQUU0QyxDQUFGLEdBQU0sS0FBS0EsQ0FBZCxFQUFpQjtBQUNmMUMsV0FBS0YsRUFBRXlDLENBQVA7O0FBQ0EsYUFBTWxDLElBQUksS0FBS3FDLENBQWYsRUFBa0I7QUFDaEIxQyxhQUFLLEtBQUtLLENBQUwsQ0FBTDtBQUNBb0MsVUFBRXBDLEdBQUYsSUFBU0wsSUFBRSxLQUFLdUIsRUFBaEI7QUFDQXZCLGNBQU0sS0FBS3NCLEVBQVg7QUFDRDs7QUFDRHRCLFdBQUssS0FBS3VDLENBQVY7QUFDRCxLQVJELE1BU0s7QUFDSHZDLFdBQUssS0FBS3VDLENBQVY7O0FBQ0EsYUFBTWxDLElBQUlQLEVBQUU0QyxDQUFaLEVBQWU7QUFDYjFDLGFBQUtGLEVBQUVPLENBQUYsQ0FBTDtBQUNBb0MsVUFBRXBDLEdBQUYsSUFBU0wsSUFBRSxLQUFLdUIsRUFBaEI7QUFDQXZCLGNBQU0sS0FBS3NCLEVBQVg7QUFDRDs7QUFDRHRCLFdBQUtGLEVBQUV5QyxDQUFQO0FBQ0Q7O0FBQ0RFLE1BQUVGLENBQUYsR0FBT3ZDLElBQUUsQ0FBSCxHQUFNLENBQUMsQ0FBUCxHQUFTLENBQWY7QUFDQSxRQUFHQSxJQUFJLENBQUMsQ0FBUixFQUFXeUMsRUFBRXBDLEdBQUYsSUFBUyxLQUFLbUIsRUFBTCxHQUFReEIsQ0FBakIsQ0FBWCxLQUNLLElBQUdBLElBQUksQ0FBUCxFQUFVeUMsRUFBRXBDLEdBQUYsSUFBU0wsQ0FBVDtBQUNmeUMsTUFBRUMsQ0FBRixHQUFNckMsQ0FBTjtBQUNBb0MsTUFBRVcsS0FBRjtBQUNELEdBbld5QixDQXFXMUI7QUFDQTs7O0FBQ0EsV0FBUzJCLGFBQVQsQ0FBdUJqRixDQUF2QixFQUF5QjJDLENBQXpCLEVBQTRCO0FBQzFCLFFBQUluQyxJQUFJLEtBQUswRSxHQUFMLEVBQVI7QUFBQSxRQUFvQkMsSUFBSW5GLEVBQUVrRixHQUFGLEVBQXhCO0FBQ0EsUUFBSTNFLElBQUlDLEVBQUVvQyxDQUFWO0FBQ0FELE1BQUVDLENBQUYsR0FBTXJDLElBQUU0RSxFQUFFdkMsQ0FBVjs7QUFDQSxXQUFNLEVBQUVyQyxDQUFGLElBQU8sQ0FBYixFQUFnQm9DLEVBQUVwQyxDQUFGLElBQU8sQ0FBUDs7QUFDaEIsU0FBSUEsSUFBSSxDQUFSLEVBQVdBLElBQUk0RSxFQUFFdkMsQ0FBakIsRUFBb0IsRUFBRXJDLENBQXRCLEVBQXlCb0MsRUFBRXBDLElBQUVDLEVBQUVvQyxDQUFOLElBQVdwQyxFQUFFZSxFQUFGLENBQUssQ0FBTCxFQUFPNEQsRUFBRTVFLENBQUYsQ0FBUCxFQUFZb0MsQ0FBWixFQUFjcEMsQ0FBZCxFQUFnQixDQUFoQixFQUFrQkMsRUFBRW9DLENBQXBCLENBQVg7O0FBQ3pCRCxNQUFFRixDQUFGLEdBQU0sQ0FBTjtBQUNBRSxNQUFFVyxLQUFGO0FBQ0EsUUFBRyxLQUFLYixDQUFMLElBQVV6QyxFQUFFeUMsQ0FBZixFQUFrQjdDLFdBQVcyRCxJQUFYLENBQWdCQyxLQUFoQixDQUFzQmIsQ0FBdEIsRUFBd0JBLENBQXhCO0FBQ25CLEdBaFh5QixDQWtYMUI7OztBQUNBLFdBQVN5QyxXQUFULENBQXFCekMsQ0FBckIsRUFBd0I7QUFDdEIsUUFBSW5DLElBQUksS0FBSzBFLEdBQUwsRUFBUjtBQUNBLFFBQUkzRSxJQUFJb0MsRUFBRUMsQ0FBRixHQUFNLElBQUVwQyxFQUFFb0MsQ0FBbEI7O0FBQ0EsV0FBTSxFQUFFckMsQ0FBRixJQUFPLENBQWIsRUFBZ0JvQyxFQUFFcEMsQ0FBRixJQUFPLENBQVA7O0FBQ2hCLFNBQUlBLElBQUksQ0FBUixFQUFXQSxJQUFJQyxFQUFFb0MsQ0FBRixHQUFJLENBQW5CLEVBQXNCLEVBQUVyQyxDQUF4QixFQUEyQjtBQUN6QixVQUFJTCxJQUFJTSxFQUFFZSxFQUFGLENBQUtoQixDQUFMLEVBQU9DLEVBQUVELENBQUYsQ0FBUCxFQUFZb0MsQ0FBWixFQUFjLElBQUVwQyxDQUFoQixFQUFrQixDQUFsQixFQUFvQixDQUFwQixDQUFSOztBQUNBLFVBQUcsQ0FBQ29DLEVBQUVwQyxJQUFFQyxFQUFFb0MsQ0FBTixLQUFVcEMsRUFBRWUsRUFBRixDQUFLaEIsSUFBRSxDQUFQLEVBQVMsSUFBRUMsRUFBRUQsQ0FBRixDQUFYLEVBQWdCb0MsQ0FBaEIsRUFBa0IsSUFBRXBDLENBQUYsR0FBSSxDQUF0QixFQUF3QkwsQ0FBeEIsRUFBMEJNLEVBQUVvQyxDQUFGLEdBQUlyQyxDQUFKLEdBQU0sQ0FBaEMsQ0FBWCxLQUFrREMsRUFBRWtCLEVBQXZELEVBQTJEO0FBQ3pEaUIsVUFBRXBDLElBQUVDLEVBQUVvQyxDQUFOLEtBQVlwQyxFQUFFa0IsRUFBZDtBQUNBaUIsVUFBRXBDLElBQUVDLEVBQUVvQyxDQUFKLEdBQU0sQ0FBUixJQUFhLENBQWI7QUFDRDtBQUNGOztBQUNELFFBQUdELEVBQUVDLENBQUYsR0FBTSxDQUFULEVBQVlELEVBQUVBLEVBQUVDLENBQUYsR0FBSSxDQUFOLEtBQVlwQyxFQUFFZSxFQUFGLENBQUtoQixDQUFMLEVBQU9DLEVBQUVELENBQUYsQ0FBUCxFQUFZb0MsQ0FBWixFQUFjLElBQUVwQyxDQUFoQixFQUFrQixDQUFsQixFQUFvQixDQUFwQixDQUFaO0FBQ1pvQyxNQUFFRixDQUFGLEdBQU0sQ0FBTjtBQUNBRSxNQUFFVyxLQUFGO0FBQ0QsR0FqWXlCLENBbVkxQjtBQUNBOzs7QUFDQSxXQUFTK0IsV0FBVCxDQUFxQmpFLENBQXJCLEVBQXVCa0UsQ0FBdkIsRUFBeUIzQyxDQUF6QixFQUE0QjtBQUMxQixRQUFJNEMsS0FBS25FLEVBQUU4RCxHQUFGLEVBQVQ7QUFDQSxRQUFHSyxHQUFHM0MsQ0FBSCxJQUFRLENBQVgsRUFBYztBQUNkLFFBQUk0QyxLQUFLLEtBQUtOLEdBQUwsRUFBVDs7QUFDQSxRQUFHTSxHQUFHNUMsQ0FBSCxHQUFPMkMsR0FBRzNDLENBQWIsRUFBZ0I7QUFDZCxVQUFHMEMsS0FBSyxJQUFSLEVBQWNBLEVBQUV2QyxPQUFGLENBQVUsQ0FBVjtBQUNkLFVBQUdKLEtBQUssSUFBUixFQUFjLEtBQUs4QyxNQUFMLENBQVk5QyxDQUFaO0FBQ2Q7QUFDRDs7QUFDRCxRQUFHQSxLQUFLLElBQVIsRUFBY0EsSUFBSXRDLEtBQUo7QUFDZCxRQUFJOEUsSUFBSTlFLEtBQVI7QUFBQSxRQUFlcUYsS0FBSyxLQUFLakQsQ0FBekI7QUFBQSxRQUE0QmtELEtBQUt2RSxFQUFFcUIsQ0FBbkM7QUFDQSxRQUFJbUQsTUFBTSxLQUFLcEUsRUFBTCxHQUFRNEMsTUFBTW1CLEdBQUdBLEdBQUczQyxDQUFILEdBQUssQ0FBUixDQUFOLENBQWxCLENBWDBCLENBV1c7O0FBQ3JDLFFBQUdnRCxNQUFNLENBQVQsRUFBWTtBQUFFTCxTQUFHTSxRQUFILENBQVlELEdBQVosRUFBZ0JULENBQWhCO0FBQW9CSyxTQUFHSyxRQUFILENBQVlELEdBQVosRUFBZ0JqRCxDQUFoQjtBQUFxQixLQUF2RCxNQUNLO0FBQUU0QyxTQUFHRSxNQUFILENBQVVOLENBQVY7QUFBY0ssU0FBR0MsTUFBSCxDQUFVOUMsQ0FBVjtBQUFlOztBQUNwQyxRQUFJbUQsS0FBS1gsRUFBRXZDLENBQVg7QUFDQSxRQUFJbUQsS0FBS1osRUFBRVcsS0FBRyxDQUFMLENBQVQ7QUFDQSxRQUFHQyxNQUFNLENBQVQsRUFBWTtBQUNaLFFBQUlDLEtBQUtELE1BQUksS0FBRyxLQUFLakUsRUFBWixLQUFrQmdFLEtBQUcsQ0FBSixHQUFPWCxFQUFFVyxLQUFHLENBQUwsS0FBUyxLQUFLL0QsRUFBckIsR0FBd0IsQ0FBekMsQ0FBVDtBQUNBLFFBQUlrRSxLQUFLLEtBQUtyRSxFQUFMLEdBQVFvRSxFQUFqQjtBQUFBLFFBQXFCRSxLQUFLLENBQUMsS0FBRyxLQUFLcEUsRUFBVCxJQUFha0UsRUFBdkM7QUFBQSxRQUEyQ0csSUFBSSxLQUFHLEtBQUtwRSxFQUF2RDtBQUNBLFFBQUl4QixJQUFJb0MsRUFBRUMsQ0FBVjtBQUFBLFFBQWFsQyxJQUFJSCxJQUFFdUYsRUFBbkI7QUFBQSxRQUF1QmxELElBQUswQyxLQUFHLElBQUosR0FBVWpGLEtBQVYsR0FBZ0JpRixDQUEzQztBQUNBSCxNQUFFaUIsU0FBRixDQUFZMUYsQ0FBWixFQUFja0MsQ0FBZDs7QUFDQSxRQUFHRCxFQUFFMEQsU0FBRixDQUFZekQsQ0FBWixLQUFrQixDQUFyQixFQUF3QjtBQUN0QkQsUUFBRUEsRUFBRUMsQ0FBRixFQUFGLElBQVcsQ0FBWDtBQUNBRCxRQUFFYSxLQUFGLENBQVFaLENBQVIsRUFBVUQsQ0FBVjtBQUNEOztBQUNEL0MsZUFBVzBHLEdBQVgsQ0FBZUYsU0FBZixDQUF5Qk4sRUFBekIsRUFBNEJsRCxDQUE1QjtBQUNBQSxNQUFFWSxLQUFGLENBQVEyQixDQUFSLEVBQVVBLENBQVYsRUExQjBCLENBMEJaOztBQUNkLFdBQU1BLEVBQUV2QyxDQUFGLEdBQU1rRCxFQUFaLEVBQWdCWCxFQUFFQSxFQUFFdkMsQ0FBRixFQUFGLElBQVcsQ0FBWDs7QUFDaEIsV0FBTSxFQUFFbEMsQ0FBRixJQUFPLENBQWIsRUFBZ0I7QUFDZDtBQUNBLFVBQUk2RixLQUFNNUQsRUFBRSxFQUFFcEMsQ0FBSixLQUFRd0YsRUFBVCxHQUFhLEtBQUt0RSxFQUFsQixHQUFxQlosS0FBS0MsS0FBTCxDQUFXNkIsRUFBRXBDLENBQUYsSUFBSzBGLEVBQUwsR0FBUSxDQUFDdEQsRUFBRXBDLElBQUUsQ0FBSixJQUFPNEYsQ0FBUixJQUFXRCxFQUE5QixDQUE5Qjs7QUFDQSxVQUFHLENBQUN2RCxFQUFFcEMsQ0FBRixLQUFNNEUsRUFBRTVELEVBQUYsQ0FBSyxDQUFMLEVBQU9nRixFQUFQLEVBQVU1RCxDQUFWLEVBQVlqQyxDQUFaLEVBQWMsQ0FBZCxFQUFnQm9GLEVBQWhCLENBQVAsSUFBOEJTLEVBQWpDLEVBQXFDO0FBQUU7QUFDckNwQixVQUFFaUIsU0FBRixDQUFZMUYsQ0FBWixFQUFja0MsQ0FBZDtBQUNBRCxVQUFFYSxLQUFGLENBQVFaLENBQVIsRUFBVUQsQ0FBVjs7QUFDQSxlQUFNQSxFQUFFcEMsQ0FBRixJQUFPLEVBQUVnRyxFQUFmLEVBQW1CNUQsRUFBRWEsS0FBRixDQUFRWixDQUFSLEVBQVVELENBQVY7QUFDcEI7QUFDRjs7QUFDRCxRQUFHMkMsS0FBSyxJQUFSLEVBQWM7QUFDWjNDLFFBQUU2RCxTQUFGLENBQVlWLEVBQVosRUFBZVIsQ0FBZjtBQUNBLFVBQUdJLE1BQU1DLEVBQVQsRUFBYS9GLFdBQVcyRCxJQUFYLENBQWdCQyxLQUFoQixDQUFzQjhCLENBQXRCLEVBQXdCQSxDQUF4QjtBQUNkOztBQUNEM0MsTUFBRUMsQ0FBRixHQUFNa0QsRUFBTjtBQUNBbkQsTUFBRVcsS0FBRjtBQUNBLFFBQUdzQyxNQUFNLENBQVQsRUFBWWpELEVBQUU4RCxRQUFGLENBQVdiLEdBQVgsRUFBZWpELENBQWYsRUEzQ2MsQ0EyQ0s7O0FBQy9CLFFBQUcrQyxLQUFLLENBQVIsRUFBVzlGLFdBQVcyRCxJQUFYLENBQWdCQyxLQUFoQixDQUFzQmIsQ0FBdEIsRUFBd0JBLENBQXhCO0FBQ1osR0FsYnlCLENBb2IxQjs7O0FBQ0EsV0FBUytELEtBQVQsQ0FBZTFHLENBQWYsRUFBa0I7QUFDaEIsUUFBSTJDLElBQUl0QyxLQUFSO0FBQ0EsU0FBSzZFLEdBQUwsR0FBV3lCLFFBQVgsQ0FBb0IzRyxDQUFwQixFQUFzQixJQUF0QixFQUEyQjJDLENBQTNCO0FBQ0EsUUFBRyxLQUFLRixDQUFMLEdBQVMsQ0FBVCxJQUFjRSxFQUFFMEQsU0FBRixDQUFZekcsV0FBVzJELElBQXZCLElBQStCLENBQWhELEVBQW1EdkQsRUFBRXdELEtBQUYsQ0FBUWIsQ0FBUixFQUFVQSxDQUFWO0FBQ25ELFdBQU9BLENBQVA7QUFDRCxHQTFieUIsQ0E0YjFCOzs7QUFDQSxXQUFTaUUsT0FBVCxDQUFpQnhGLENBQWpCLEVBQW9CO0FBQUUsU0FBS0EsQ0FBTCxHQUFTQSxDQUFUO0FBQWE7O0FBQ25DLFdBQVN5RixRQUFULENBQWtCckcsQ0FBbEIsRUFBcUI7QUFDbkIsUUFBR0EsRUFBRWlDLENBQUYsR0FBTSxDQUFOLElBQVdqQyxFQUFFNkYsU0FBRixDQUFZLEtBQUtqRixDQUFqQixLQUF1QixDQUFyQyxFQUF3QyxPQUFPWixFQUFFc0csR0FBRixDQUFNLEtBQUsxRixDQUFYLENBQVAsQ0FBeEMsS0FDSyxPQUFPWixDQUFQO0FBQ047O0FBQ0QsV0FBU3VHLE9BQVQsQ0FBaUJ2RyxDQUFqQixFQUFvQjtBQUFFLFdBQU9BLENBQVA7QUFBVzs7QUFDakMsV0FBU3dHLE9BQVQsQ0FBaUJ4RyxDQUFqQixFQUFvQjtBQUFFQSxNQUFFbUcsUUFBRixDQUFXLEtBQUt2RixDQUFoQixFQUFrQixJQUFsQixFQUF1QlosQ0FBdkI7QUFBNEI7O0FBQ2xELFdBQVN5RyxNQUFULENBQWdCekcsQ0FBaEIsRUFBa0IyRSxDQUFsQixFQUFvQnhDLENBQXBCLEVBQXVCO0FBQUVuQyxNQUFFMEcsVUFBRixDQUFhL0IsQ0FBYixFQUFleEMsQ0FBZjtBQUFtQixTQUFLd0UsTUFBTCxDQUFZeEUsQ0FBWjtBQUFpQjs7QUFDN0QsV0FBU3lFLE1BQVQsQ0FBZ0I1RyxDQUFoQixFQUFrQm1DLENBQWxCLEVBQXFCO0FBQUVuQyxNQUFFNkcsUUFBRixDQUFXMUUsQ0FBWDtBQUFlLFNBQUt3RSxNQUFMLENBQVl4RSxDQUFaO0FBQWlCOztBQUV2RGlFLFVBQVF0RixTQUFSLENBQWtCZ0csT0FBbEIsR0FBNEJULFFBQTVCO0FBQ0FELFVBQVF0RixTQUFSLENBQWtCaUcsTUFBbEIsR0FBMkJSLE9BQTNCO0FBQ0FILFVBQVF0RixTQUFSLENBQWtCNkYsTUFBbEIsR0FBMkJILE9BQTNCO0FBQ0FKLFVBQVF0RixTQUFSLENBQWtCa0csS0FBbEIsR0FBMEJQLE1BQTFCO0FBQ0FMLFVBQVF0RixTQUFSLENBQWtCbUcsS0FBbEIsR0FBMEJMLE1BQTFCLENBM2MwQixDQTZjMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsV0FBU00sV0FBVCxHQUF1QjtBQUNyQixRQUFHLEtBQUs5RSxDQUFMLEdBQVMsQ0FBWixFQUFlLE9BQU8sQ0FBUDtBQUNmLFFBQUlwQyxJQUFJLEtBQUssQ0FBTCxDQUFSO0FBQ0EsUUFBRyxDQUFDQSxJQUFFLENBQUgsS0FBUyxDQUFaLEVBQWUsT0FBTyxDQUFQO0FBQ2YsUUFBSTJFLElBQUkzRSxJQUFFLENBQVYsQ0FKcUIsQ0FJUDs7QUFDZDJFLFFBQUtBLEtBQUcsSUFBRSxDQUFDM0UsSUFBRSxHQUFILElBQVEyRSxDQUFiLENBQUQsR0FBa0IsR0FBdEIsQ0FMcUIsQ0FLTTs7QUFDM0JBLFFBQUtBLEtBQUcsSUFBRSxDQUFDM0UsSUFBRSxJQUFILElBQVMyRSxDQUFkLENBQUQsR0FBbUIsSUFBdkIsQ0FOcUIsQ0FNUTs7QUFDN0JBLFFBQUtBLEtBQUcsS0FBSSxDQUFDM0UsSUFBRSxNQUFILElBQVcyRSxDQUFaLEdBQWUsTUFBbEIsQ0FBSCxDQUFELEdBQWdDLE1BQXBDLENBUHFCLENBT3VCO0FBQzVDO0FBQ0E7O0FBQ0FBLFFBQUtBLEtBQUcsSUFBRTNFLElBQUUyRSxDQUFGLEdBQUksS0FBS3pELEVBQWQsQ0FBRCxHQUFvQixLQUFLQSxFQUE3QixDQVZxQixDQVVhO0FBQ2xDOztBQUNBLFdBQVF5RCxJQUFFLENBQUgsR0FBTSxLQUFLekQsRUFBTCxHQUFReUQsQ0FBZCxHQUFnQixDQUFDQSxDQUF4QjtBQUNELEdBcGV5QixDQXNlMUI7OztBQUNBLFdBQVN3QyxVQUFULENBQW9CdkcsQ0FBcEIsRUFBdUI7QUFDckIsU0FBS0EsQ0FBTCxHQUFTQSxDQUFUO0FBQ0EsU0FBS3dHLEVBQUwsR0FBVXhHLEVBQUV5RyxRQUFGLEVBQVY7QUFDQSxTQUFLQyxHQUFMLEdBQVcsS0FBS0YsRUFBTCxHQUFRLE1BQW5CO0FBQ0EsU0FBS0csR0FBTCxHQUFXLEtBQUtILEVBQUwsSUFBUyxFQUFwQjtBQUNBLFNBQUtJLEVBQUwsR0FBVSxDQUFDLEtBQUk1RyxFQUFFSSxFQUFGLEdBQUssRUFBVixJQUFlLENBQXpCO0FBQ0EsU0FBS3lHLEdBQUwsR0FBVyxJQUFFN0csRUFBRXdCLENBQWY7QUFDRCxHQTlleUIsQ0FnZjFCOzs7QUFDQSxXQUFTc0YsV0FBVCxDQUFxQjFILENBQXJCLEVBQXdCO0FBQ3RCLFFBQUltQyxJQUFJdEMsS0FBUjtBQUNBRyxNQUFFMEUsR0FBRixHQUFRa0IsU0FBUixDQUFrQixLQUFLaEYsQ0FBTCxDQUFPd0IsQ0FBekIsRUFBMkJELENBQTNCO0FBQ0FBLE1BQUVnRSxRQUFGLENBQVcsS0FBS3ZGLENBQWhCLEVBQWtCLElBQWxCLEVBQXVCdUIsQ0FBdkI7QUFDQSxRQUFHbkMsRUFBRWlDLENBQUYsR0FBTSxDQUFOLElBQVdFLEVBQUUwRCxTQUFGLENBQVl6RyxXQUFXMkQsSUFBdkIsSUFBK0IsQ0FBN0MsRUFBZ0QsS0FBS25DLENBQUwsQ0FBT29DLEtBQVAsQ0FBYWIsQ0FBYixFQUFlQSxDQUFmO0FBQ2hELFdBQU9BLENBQVA7QUFDRCxHQXZmeUIsQ0F5ZjFCOzs7QUFDQSxXQUFTd0YsVUFBVCxDQUFvQjNILENBQXBCLEVBQXVCO0FBQ3JCLFFBQUltQyxJQUFJdEMsS0FBUjtBQUNBRyxNQUFFaUYsTUFBRixDQUFTOUMsQ0FBVDtBQUNBLFNBQUt3RSxNQUFMLENBQVl4RSxDQUFaO0FBQ0EsV0FBT0EsQ0FBUDtBQUNELEdBL2Z5QixDQWlnQjFCOzs7QUFDQSxXQUFTeUYsVUFBVCxDQUFvQjVILENBQXBCLEVBQXVCO0FBQ3JCLFdBQU1BLEVBQUVvQyxDQUFGLElBQU8sS0FBS3FGLEdBQWxCLEVBQXVCO0FBQ3JCekgsTUFBRUEsRUFBRW9DLENBQUYsRUFBRixJQUFXLENBQVg7O0FBQ0YsU0FBSSxJQUFJckMsSUFBSSxDQUFaLEVBQWVBLElBQUksS0FBS2EsQ0FBTCxDQUFPd0IsQ0FBMUIsRUFBNkIsRUFBRXJDLENBQS9CLEVBQWtDO0FBQ2hDO0FBQ0EsVUFBSUcsSUFBSUYsRUFBRUQsQ0FBRixJQUFLLE1BQWI7QUFDQSxVQUFJOEgsS0FBTTNILElBQUUsS0FBS29ILEdBQVAsSUFBWSxDQUFFcEgsSUFBRSxLQUFLcUgsR0FBUCxHQUFXLENBQUN2SCxFQUFFRCxDQUFGLEtBQU0sRUFBUCxJQUFXLEtBQUt1SCxHQUE1QixHQUFpQyxLQUFLRSxFQUF2QyxLQUE0QyxFQUF4RCxDQUFELEdBQThEeEgsRUFBRWlCLEVBQXpFLENBSGdDLENBSWhDOztBQUNBZixVQUFJSCxJQUFFLEtBQUthLENBQUwsQ0FBT3dCLENBQWI7QUFDQXBDLFFBQUVFLENBQUYsS0FBUSxLQUFLVSxDQUFMLENBQU9HLEVBQVAsQ0FBVSxDQUFWLEVBQVk4RyxFQUFaLEVBQWU3SCxDQUFmLEVBQWlCRCxDQUFqQixFQUFtQixDQUFuQixFQUFxQixLQUFLYSxDQUFMLENBQU93QixDQUE1QixDQUFSLENBTmdDLENBT2hDOztBQUNBLGFBQU1wQyxFQUFFRSxDQUFGLEtBQVFGLEVBQUVrQixFQUFoQixFQUFvQjtBQUFFbEIsVUFBRUUsQ0FBRixLQUFRRixFQUFFa0IsRUFBVjtBQUFjbEIsVUFBRSxFQUFFRSxDQUFKO0FBQVc7QUFDaEQ7O0FBQ0RGLE1BQUU4QyxLQUFGO0FBQ0E5QyxNQUFFZ0csU0FBRixDQUFZLEtBQUtwRixDQUFMLENBQU93QixDQUFuQixFQUFxQnBDLENBQXJCO0FBQ0EsUUFBR0EsRUFBRTZGLFNBQUYsQ0FBWSxLQUFLakYsQ0FBakIsS0FBdUIsQ0FBMUIsRUFBNkJaLEVBQUVnRCxLQUFGLENBQVEsS0FBS3BDLENBQWIsRUFBZVosQ0FBZjtBQUM5QixHQWxoQnlCLENBb2hCMUI7OztBQUNBLFdBQVM4SCxTQUFULENBQW1COUgsQ0FBbkIsRUFBcUJtQyxDQUFyQixFQUF3QjtBQUFFbkMsTUFBRTZHLFFBQUYsQ0FBVzFFLENBQVg7QUFBZSxTQUFLd0UsTUFBTCxDQUFZeEUsQ0FBWjtBQUFpQixHQXJoQmhDLENBdWhCMUI7OztBQUNBLFdBQVM0RixTQUFULENBQW1CL0gsQ0FBbkIsRUFBcUIyRSxDQUFyQixFQUF1QnhDLENBQXZCLEVBQTBCO0FBQUVuQyxNQUFFMEcsVUFBRixDQUFhL0IsQ0FBYixFQUFleEMsQ0FBZjtBQUFtQixTQUFLd0UsTUFBTCxDQUFZeEUsQ0FBWjtBQUFpQjs7QUFFaEVnRixhQUFXckcsU0FBWCxDQUFxQmdHLE9BQXJCLEdBQStCWSxXQUEvQjtBQUNBUCxhQUFXckcsU0FBWCxDQUFxQmlHLE1BQXJCLEdBQThCWSxVQUE5QjtBQUNBUixhQUFXckcsU0FBWCxDQUFxQjZGLE1BQXJCLEdBQThCaUIsVUFBOUI7QUFDQVQsYUFBV3JHLFNBQVgsQ0FBcUJrRyxLQUFyQixHQUE2QmUsU0FBN0I7QUFDQVosYUFBV3JHLFNBQVgsQ0FBcUJtRyxLQUFyQixHQUE2QmEsU0FBN0IsQ0E5aEIwQixDQWdpQjFCOztBQUNBLFdBQVNFLFNBQVQsR0FBcUI7QUFBRSxXQUFPLENBQUUsS0FBSzVGLENBQUwsR0FBTyxDQUFSLEdBQVksS0FBSyxDQUFMLElBQVEsQ0FBcEIsR0FBdUIsS0FBS0gsQ0FBN0IsS0FBbUMsQ0FBMUM7QUFBOEMsR0FqaUIzQyxDQW1pQjFCOzs7QUFDQSxXQUFTZ0csTUFBVCxDQUFnQnRDLENBQWhCLEVBQWtCdUMsQ0FBbEIsRUFBcUI7QUFDbkIsUUFBR3ZDLElBQUksVUFBSixJQUFrQkEsSUFBSSxDQUF6QixFQUE0QixPQUFPdkcsV0FBVzBHLEdBQWxCO0FBQzVCLFFBQUkzRCxJQUFJdEMsS0FBUjtBQUFBLFFBQWVzSSxLQUFLdEksS0FBcEI7QUFBQSxRQUEyQnVJLElBQUlGLEVBQUVwQixPQUFGLENBQVUsSUFBVixDQUEvQjtBQUFBLFFBQWdEL0csSUFBSTZELE1BQU0rQixDQUFOLElBQVMsQ0FBN0Q7QUFDQXlDLE1BQUVuRCxNQUFGLENBQVM5QyxDQUFUOztBQUNBLFdBQU0sRUFBRXBDLENBQUYsSUFBTyxDQUFiLEVBQWdCO0FBQ2RtSSxRQUFFakIsS0FBRixDQUFROUUsQ0FBUixFQUFVZ0csRUFBVjtBQUNBLFVBQUcsQ0FBQ3hDLElBQUcsS0FBRzVGLENBQVAsSUFBYSxDQUFoQixFQUFtQm1JLEVBQUVsQixLQUFGLENBQVFtQixFQUFSLEVBQVdDLENBQVgsRUFBYWpHLENBQWIsRUFBbkIsS0FDSztBQUFFLFlBQUlDLElBQUlELENBQVI7QUFBV0EsWUFBSWdHLEVBQUo7QUFBUUEsYUFBSy9GLENBQUw7QUFBUztBQUNwQzs7QUFDRCxXQUFPOEYsRUFBRW5CLE1BQUYsQ0FBUzVFLENBQVQsQ0FBUDtBQUNELEdBOWlCeUIsQ0FnakIxQjs7O0FBQ0EsV0FBU2tHLFdBQVQsQ0FBcUIxQyxDQUFyQixFQUF1Qi9FLENBQXZCLEVBQTBCO0FBQ3hCLFFBQUlzSCxDQUFKO0FBQ0EsUUFBR3ZDLElBQUksR0FBSixJQUFXL0UsRUFBRTBILE1BQUYsRUFBZCxFQUEwQkosSUFBSSxJQUFJOUIsT0FBSixDQUFZeEYsQ0FBWixDQUFKLENBQTFCLEtBQW1Ec0gsSUFBSSxJQUFJZixVQUFKLENBQWV2RyxDQUFmLENBQUo7QUFDbkQsV0FBTyxLQUFLMkgsR0FBTCxDQUFTNUMsQ0FBVCxFQUFXdUMsQ0FBWCxDQUFQO0FBQ0QsR0FyakJ5QixDQXVqQjFCOzs7QUFDQTlJLGFBQVcwQixTQUFYLENBQXFCbUUsTUFBckIsR0FBOEIvQyxTQUE5QjtBQUNBOUMsYUFBVzBCLFNBQVgsQ0FBcUJ5QixPQUFyQixHQUErQkYsVUFBL0I7QUFDQWpELGFBQVcwQixTQUFYLENBQXFCbEIsVUFBckIsR0FBa0M0QyxhQUFsQztBQUNBcEQsYUFBVzBCLFNBQVgsQ0FBcUJnQyxLQUFyQixHQUE2QkcsUUFBN0I7QUFDQTdELGFBQVcwQixTQUFYLENBQXFCOEUsU0FBckIsR0FBaUM5QixZQUFqQztBQUNBMUUsYUFBVzBCLFNBQVgsQ0FBcUJrRixTQUFyQixHQUFpQ2pDLFlBQWpDO0FBQ0EzRSxhQUFXMEIsU0FBWCxDQUFxQnVFLFFBQXJCLEdBQWdDcEIsV0FBaEM7QUFDQTdFLGFBQVcwQixTQUFYLENBQXFCbUYsUUFBckIsR0FBZ0MzQixXQUFoQztBQUNBbEYsYUFBVzBCLFNBQVgsQ0FBcUJrQyxLQUFyQixHQUE2QnVCLFFBQTdCO0FBQ0FuRixhQUFXMEIsU0FBWCxDQUFxQjRGLFVBQXJCLEdBQWtDakMsYUFBbEM7QUFDQXJGLGFBQVcwQixTQUFYLENBQXFCK0YsUUFBckIsR0FBZ0NqQyxXQUFoQztBQUNBeEYsYUFBVzBCLFNBQVgsQ0FBcUJxRixRQUFyQixHQUFnQ3RCLFdBQWhDO0FBQ0F6RixhQUFXMEIsU0FBWCxDQUFxQnVHLFFBQXJCLEdBQWdDSCxXQUFoQztBQUNBOUgsYUFBVzBCLFNBQVgsQ0FBcUJ3SCxNQUFyQixHQUE4Qk4sU0FBOUI7QUFDQTVJLGFBQVcwQixTQUFYLENBQXFCeUgsR0FBckIsR0FBMkJOLE1BQTNCLENBdGtCMEIsQ0F3a0IxQjs7QUFDQTdJLGFBQVcwQixTQUFYLENBQXFCc0MsUUFBckIsR0FBZ0NGLFVBQWhDO0FBQ0E5RCxhQUFXMEIsU0FBWCxDQUFxQnFDLE1BQXJCLEdBQThCTSxRQUE5QjtBQUNBckUsYUFBVzBCLFNBQVgsQ0FBcUI0RCxHQUFyQixHQUEyQmhCLEtBQTNCO0FBQ0F0RSxhQUFXMEIsU0FBWCxDQUFxQitFLFNBQXJCLEdBQWlDbEMsV0FBakM7QUFDQXZFLGFBQVcwQixTQUFYLENBQXFCMEgsU0FBckIsR0FBaUMzRSxXQUFqQztBQUNBekUsYUFBVzBCLFNBQVgsQ0FBcUJ3RixHQUFyQixHQUEyQkosS0FBM0I7QUFDQTlHLGFBQVcwQixTQUFYLENBQXFCMkgsU0FBckIsR0FBaUNKLFdBQWpDLENBL2tCMEIsQ0FpbEIxQjs7QUFDQWpKLGFBQVcyRCxJQUFYLEdBQWtCVCxJQUFJLENBQUosQ0FBbEI7QUFDQWxELGFBQVcwRyxHQUFYLEdBQWlCeEQsSUFBSSxDQUFKLENBQWpCLENBbmxCMEIsQ0FzbEIxQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0JBO0FBRUE7O0FBQ0EsV0FBU29HLE9BQVQsR0FBbUI7QUFBRSxRQUFJdkcsSUFBSXRDLEtBQVI7QUFBZSxTQUFLb0YsTUFBTCxDQUFZOUMsQ0FBWjtBQUFnQixXQUFPQSxDQUFQO0FBQVcsR0ExbkJyQyxDQTRuQjFCOzs7QUFDQSxXQUFTd0csVUFBVCxHQUFzQjtBQUNwQixRQUFHLEtBQUsxRyxDQUFMLEdBQVMsQ0FBWixFQUFlO0FBQ2IsVUFBRyxLQUFLRyxDQUFMLElBQVUsQ0FBYixFQUFnQixPQUFPLEtBQUssQ0FBTCxJQUFRLEtBQUtsQixFQUFwQixDQUFoQixLQUNLLElBQUcsS0FBS2tCLENBQUwsSUFBVSxDQUFiLEVBQWdCLE9BQU8sQ0FBQyxDQUFSO0FBQ3RCLEtBSEQsTUFJSyxJQUFHLEtBQUtBLENBQUwsSUFBVSxDQUFiLEVBQWdCLE9BQU8sS0FBSyxDQUFMLENBQVAsQ0FBaEIsS0FDQSxJQUFHLEtBQUtBLENBQUwsSUFBVSxDQUFiLEVBQWdCLE9BQU8sQ0FBUCxDQU5ELENBT3BCOzs7QUFDQSxXQUFRLENBQUMsS0FBSyxDQUFMLElBQVMsQ0FBQyxLQUFJLEtBQUcsS0FBS3BCLEVBQWIsSUFBa0IsQ0FBNUIsS0FBaUMsS0FBS0EsRUFBdkMsR0FBMkMsS0FBSyxDQUFMLENBQWxEO0FBQ0QsR0F0b0J5QixDQXdvQjFCOzs7QUFDQSxXQUFTNEgsV0FBVCxHQUF1QjtBQUFFLFdBQVEsS0FBS3hHLENBQUwsSUFBUSxDQUFULEdBQVksS0FBS0gsQ0FBakIsR0FBb0IsS0FBSyxDQUFMLEtBQVMsRUFBVixJQUFlLEVBQXpDO0FBQThDLEdBem9CN0MsQ0Eyb0IxQjs7O0FBQ0EsV0FBUzRHLFlBQVQsR0FBd0I7QUFBRSxXQUFRLEtBQUt6RyxDQUFMLElBQVEsQ0FBVCxHQUFZLEtBQUtILENBQWpCLEdBQW9CLEtBQUssQ0FBTCxLQUFTLEVBQVYsSUFBZSxFQUF6QztBQUE4QyxHQTVvQjlDLENBOG9CMUI7OztBQUNBLFdBQVM2RyxZQUFULENBQXNCM0csQ0FBdEIsRUFBeUI7QUFBRSxXQUFPOUIsS0FBS0MsS0FBTCxDQUFXRCxLQUFLMEksR0FBTCxHQUFTLEtBQUsvSCxFQUFkLEdBQWlCWCxLQUFLMkksR0FBTCxDQUFTN0csQ0FBVCxDQUE1QixDQUFQO0FBQWtELEdBL29CbkQsQ0FpcEIxQjs7O0FBQ0EsV0FBUzhHLFFBQVQsR0FBb0I7QUFDbEIsUUFBRyxLQUFLaEgsQ0FBTCxHQUFTLENBQVosRUFBZSxPQUFPLENBQUMsQ0FBUixDQUFmLEtBQ0ssSUFBRyxLQUFLRyxDQUFMLElBQVUsQ0FBVixJQUFnQixLQUFLQSxDQUFMLElBQVUsQ0FBVixJQUFlLEtBQUssQ0FBTCxLQUFXLENBQTdDLEVBQWlELE9BQU8sQ0FBUCxDQUFqRCxLQUNBLE9BQU8sQ0FBUDtBQUNOLEdBdHBCeUIsQ0F3cEIxQjs7O0FBQ0EsV0FBUzhHLFVBQVQsQ0FBb0J6SixDQUFwQixFQUF1QjtBQUNyQixRQUFHQSxLQUFLLElBQVIsRUFBY0EsSUFBSSxFQUFKO0FBQ2QsUUFBRyxLQUFLMEosTUFBTCxNQUFpQixDQUFqQixJQUFzQjFKLElBQUksQ0FBMUIsSUFBK0JBLElBQUksRUFBdEMsRUFBMEMsT0FBTyxHQUFQO0FBQzFDLFFBQUkySixLQUFLLEtBQUtDLFNBQUwsQ0FBZTVKLENBQWYsQ0FBVDtBQUNBLFFBQUlELElBQUlhLEtBQUtnQixHQUFMLENBQVM1QixDQUFULEVBQVcySixFQUFYLENBQVI7QUFDQSxRQUFJN0YsSUFBSWpCLElBQUk5QyxDQUFKLENBQVI7QUFBQSxRQUFnQm1GLElBQUk5RSxLQUFwQjtBQUFBLFFBQTJCcUksSUFBSXJJLEtBQS9CO0FBQUEsUUFBc0NzQyxJQUFJLEVBQTFDO0FBQ0EsU0FBS2dFLFFBQUwsQ0FBYzVDLENBQWQsRUFBZ0JvQixDQUFoQixFQUFrQnVELENBQWxCOztBQUNBLFdBQU12RCxFQUFFd0UsTUFBRixLQUFhLENBQW5CLEVBQXNCO0FBQ3BCaEgsVUFBSSxDQUFDM0MsSUFBRTBJLEVBQUVvQixRQUFGLEVBQUgsRUFBaUJsRyxRQUFqQixDQUEwQjNELENBQTFCLEVBQTZCOEosTUFBN0IsQ0FBb0MsQ0FBcEMsSUFBeUNwSCxDQUE3QztBQUNBd0MsUUFBRXdCLFFBQUYsQ0FBVzVDLENBQVgsRUFBYW9CLENBQWIsRUFBZXVELENBQWY7QUFDRDs7QUFDRCxXQUFPQSxFQUFFb0IsUUFBRixHQUFhbEcsUUFBYixDQUFzQjNELENBQXRCLElBQTJCMEMsQ0FBbEM7QUFDRCxHQXJxQnlCLENBdXFCMUI7OztBQUNBLFdBQVNxSCxZQUFULENBQXNCdkgsQ0FBdEIsRUFBd0J4QyxDQUF4QixFQUEyQjtBQUN6QixTQUFLOEMsT0FBTCxDQUFhLENBQWI7QUFDQSxRQUFHOUMsS0FBSyxJQUFSLEVBQWNBLElBQUksRUFBSjtBQUNkLFFBQUkySixLQUFLLEtBQUtDLFNBQUwsQ0FBZTVKLENBQWYsQ0FBVDtBQUNBLFFBQUk4RCxJQUFJbEQsS0FBS2dCLEdBQUwsQ0FBUzVCLENBQVQsRUFBVzJKLEVBQVgsQ0FBUjtBQUFBLFFBQXdCeEcsS0FBSyxLQUE3QjtBQUFBLFFBQW9DMUMsSUFBSSxDQUF4QztBQUFBLFFBQTJDRCxJQUFJLENBQS9DOztBQUNBLFNBQUksSUFBSUYsSUFBSSxDQUFaLEVBQWVBLElBQUlrQyxFQUFFVSxNQUFyQixFQUE2QixFQUFFNUMsQ0FBL0IsRUFBa0M7QUFDaEMsVUFBSUMsSUFBSWdDLE1BQU1DLENBQU4sRUFBUWxDLENBQVIsQ0FBUjs7QUFDQSxVQUFHQyxJQUFJLENBQVAsRUFBVTtBQUNSLFlBQUdpQyxFQUFFRixNQUFGLENBQVNoQyxDQUFULEtBQWUsR0FBZixJQUFzQixLQUFLb0osTUFBTCxNQUFpQixDQUExQyxFQUE2Q3ZHLEtBQUssSUFBTDtBQUM3QztBQUNEOztBQUNEM0MsVUFBSVIsSUFBRVEsQ0FBRixHQUFJRCxDQUFSOztBQUNBLFVBQUcsRUFBRUUsQ0FBRixJQUFPa0osRUFBVixFQUFjO0FBQ1osYUFBS0ssU0FBTCxDQUFlbEcsQ0FBZjtBQUNBLGFBQUttRyxVQUFMLENBQWdCekosQ0FBaEIsRUFBa0IsQ0FBbEI7QUFDQUMsWUFBSSxDQUFKO0FBQ0FELFlBQUksQ0FBSjtBQUNEO0FBQ0Y7O0FBQ0QsUUFBR0MsSUFBSSxDQUFQLEVBQVU7QUFDUixXQUFLdUosU0FBTCxDQUFlcEosS0FBS2dCLEdBQUwsQ0FBUzVCLENBQVQsRUFBV1MsQ0FBWCxDQUFmO0FBQ0EsV0FBS3dKLFVBQUwsQ0FBZ0J6SixDQUFoQixFQUFrQixDQUFsQjtBQUNEOztBQUNELFFBQUcyQyxFQUFILEVBQU94RCxXQUFXMkQsSUFBWCxDQUFnQkMsS0FBaEIsQ0FBc0IsSUFBdEIsRUFBMkIsSUFBM0I7QUFDUixHQWhzQnlCLENBa3NCMUI7OztBQUNBLFdBQVMyRyxhQUFULENBQXVCbkssQ0FBdkIsRUFBeUJDLENBQXpCLEVBQTJCQyxDQUEzQixFQUE4QjtBQUM1QixRQUFHLFlBQVksT0FBT0QsQ0FBdEIsRUFBeUI7QUFDdkI7QUFDQSxVQUFHRCxJQUFJLENBQVAsRUFBVSxLQUFLK0MsT0FBTCxDQUFhLENBQWIsRUFBVixLQUNLO0FBQ0gsYUFBSzVDLFVBQUwsQ0FBZ0JILENBQWhCLEVBQWtCRSxDQUFsQjtBQUNBLFlBQUcsQ0FBQyxLQUFLa0ssT0FBTCxDQUFhcEssSUFBRSxDQUFmLENBQUosRUFBdUI7QUFDckIsZUFBS3FLLFNBQUwsQ0FBZXpLLFdBQVcwRyxHQUFYLENBQWVnRSxTQUFmLENBQXlCdEssSUFBRSxDQUEzQixDQUFmLEVBQTZDdUssS0FBN0MsRUFBbUQsSUFBbkQ7QUFDRixZQUFHLEtBQUt6QixNQUFMLEVBQUgsRUFBa0IsS0FBS29CLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBa0IsQ0FBbEIsRUFKZixDQUlxQzs7QUFDeEMsZUFBTSxDQUFDLEtBQUtNLGVBQUwsQ0FBcUJ2SyxDQUFyQixDQUFQLEVBQWdDO0FBQzlCLGVBQUtpSyxVQUFMLENBQWdCLENBQWhCLEVBQWtCLENBQWxCO0FBQ0EsY0FBRyxLQUFLbEIsU0FBTCxLQUFtQmhKLENBQXRCLEVBQXlCLEtBQUt3RCxLQUFMLENBQVc1RCxXQUFXMEcsR0FBWCxDQUFlZ0UsU0FBZixDQUF5QnRLLElBQUUsQ0FBM0IsQ0FBWCxFQUF5QyxJQUF6QztBQUMxQjtBQUNGO0FBQ0YsS0FiRCxNQWNLO0FBQ0g7QUFDQSxVQUFJUSxJQUFJLElBQUkwQixLQUFKLEVBQVI7QUFBQSxVQUFxQlUsSUFBSTVDLElBQUUsQ0FBM0I7QUFDQVEsUUFBRTJDLE1BQUYsR0FBVyxDQUFDbkQsS0FBRyxDQUFKLElBQU8sQ0FBbEI7QUFDQUMsUUFBRXdLLFNBQUYsQ0FBWWpLLENBQVo7QUFDQSxVQUFHb0MsSUFBSSxDQUFQLEVBQVVwQyxFQUFFLENBQUYsS0FBUyxDQUFDLEtBQUdvQyxDQUFKLElBQU8sQ0FBaEIsQ0FBVixLQUFtQ3BDLEVBQUUsQ0FBRixJQUFPLENBQVA7QUFDbkMsV0FBS0osVUFBTCxDQUFnQkksQ0FBaEIsRUFBa0IsR0FBbEI7QUFDRDtBQUNGLEdBMXRCeUIsQ0E0dEIxQjs7O0FBQ0EsV0FBU2tLLGFBQVQsR0FBeUI7QUFDdkIsUUFBSW5LLElBQUksS0FBS3FDLENBQWI7QUFBQSxRQUFnQkQsSUFBSSxJQUFJVCxLQUFKLEVBQXBCO0FBQ0FTLE1BQUUsQ0FBRixJQUFPLEtBQUtGLENBQVo7QUFDQSxRQUFJdUIsSUFBSSxLQUFLeEMsRUFBTCxHQUFTakIsSUFBRSxLQUFLaUIsRUFBUixHQUFZLENBQTVCO0FBQUEsUUFBK0J1QyxDQUEvQjtBQUFBLFFBQWtDZCxJQUFJLENBQXRDOztBQUNBLFFBQUcxQyxNQUFNLENBQVQsRUFBWTtBQUNWLFVBQUd5RCxJQUFJLEtBQUt4QyxFQUFULElBQWUsQ0FBQ3VDLElBQUksS0FBS3hELENBQUwsS0FBU3lELENBQWQsS0FBb0IsQ0FBQyxLQUFLdkIsQ0FBTCxHQUFPLEtBQUtoQixFQUFiLEtBQWtCdUMsQ0FBeEQsRUFDRXJCLEVBQUVNLEdBQUYsSUFBU2MsSUFBRyxLQUFLdEIsQ0FBTCxJQUFTLEtBQUtqQixFQUFMLEdBQVF3QyxDQUE3Qjs7QUFDRixhQUFNekQsS0FBSyxDQUFYLEVBQWM7QUFDWixZQUFHeUQsSUFBSSxDQUFQLEVBQVU7QUFDUkQsY0FBSSxDQUFDLEtBQUt4RCxDQUFMLElBQVMsQ0FBQyxLQUFHeUQsQ0FBSixJQUFPLENBQWpCLEtBQXVCLElBQUVBLENBQTdCO0FBQ0FELGVBQUssS0FBSyxFQUFFeEQsQ0FBUCxNQUFZeUQsS0FBRyxLQUFLeEMsRUFBTCxHQUFRLENBQXZCLENBQUw7QUFDRCxTQUhELE1BSUs7QUFDSHVDLGNBQUssS0FBS3hELENBQUwsTUFBVXlELEtBQUcsQ0FBYixDQUFELEdBQWtCLElBQXRCOztBQUNBLGNBQUdBLEtBQUssQ0FBUixFQUFXO0FBQUVBLGlCQUFLLEtBQUt4QyxFQUFWO0FBQWMsY0FBRWpCLENBQUY7QUFBTTtBQUNsQzs7QUFDRCxZQUFHLENBQUN3RCxJQUFFLElBQUgsS0FBWSxDQUFmLEVBQWtCQSxLQUFLLENBQUMsR0FBTjtBQUNsQixZQUFHZCxLQUFLLENBQUwsSUFBVSxDQUFDLEtBQUtSLENBQUwsR0FBTyxJQUFSLE1BQWtCc0IsSUFBRSxJQUFwQixDQUFiLEVBQXdDLEVBQUVkLENBQUY7QUFDeEMsWUFBR0EsSUFBSSxDQUFKLElBQVNjLEtBQUssS0FBS3RCLENBQXRCLEVBQXlCRSxFQUFFTSxHQUFGLElBQVNjLENBQVQ7QUFDMUI7QUFDRjs7QUFDRCxXQUFPcEIsQ0FBUDtBQUNEOztBQUVELFdBQVNnSSxRQUFULENBQWtCM0ssQ0FBbEIsRUFBcUI7QUFBRSxXQUFPLEtBQUtxRyxTQUFMLENBQWVyRyxDQUFmLEtBQW1CLENBQTFCO0FBQStCOztBQUN0RCxXQUFTNEssS0FBVCxDQUFlNUssQ0FBZixFQUFrQjtBQUFFLFdBQU8sS0FBS3FHLFNBQUwsQ0FBZXJHLENBQWYsSUFBa0IsQ0FBbkIsR0FBc0IsSUFBdEIsR0FBMkJBLENBQWpDO0FBQXFDOztBQUN6RCxXQUFTNkssS0FBVCxDQUFlN0ssQ0FBZixFQUFrQjtBQUFFLFdBQU8sS0FBS3FHLFNBQUwsQ0FBZXJHLENBQWYsSUFBa0IsQ0FBbkIsR0FBc0IsSUFBdEIsR0FBMkJBLENBQWpDO0FBQXFDLEdBdnZCL0IsQ0F5dkIxQjs7O0FBQ0EsV0FBUzhLLFlBQVQsQ0FBc0I5SyxDQUF0QixFQUF3QitLLEVBQXhCLEVBQTJCcEksQ0FBM0IsRUFBOEI7QUFDNUIsUUFBSXBDLENBQUo7QUFBQSxRQUFPeUssQ0FBUDtBQUFBLFFBQVU1SixJQUFJUCxLQUFLbUUsR0FBTCxDQUFTaEYsRUFBRTRDLENBQVgsRUFBYSxLQUFLQSxDQUFsQixDQUFkOztBQUNBLFNBQUlyQyxJQUFJLENBQVIsRUFBV0EsSUFBSWEsQ0FBZixFQUFrQixFQUFFYixDQUFwQixFQUF1Qm9DLEVBQUVwQyxDQUFGLElBQU93SyxHQUFHLEtBQUt4SyxDQUFMLENBQUgsRUFBV1AsRUFBRU8sQ0FBRixDQUFYLENBQVA7O0FBQ3ZCLFFBQUdQLEVBQUU0QyxDQUFGLEdBQU0sS0FBS0EsQ0FBZCxFQUFpQjtBQUNmb0ksVUFBSWhMLEVBQUV5QyxDQUFGLEdBQUksS0FBS2hCLEVBQWI7O0FBQ0EsV0FBSWxCLElBQUlhLENBQVIsRUFBV2IsSUFBSSxLQUFLcUMsQ0FBcEIsRUFBdUIsRUFBRXJDLENBQXpCLEVBQTRCb0MsRUFBRXBDLENBQUYsSUFBT3dLLEdBQUcsS0FBS3hLLENBQUwsQ0FBSCxFQUFXeUssQ0FBWCxDQUFQOztBQUM1QnJJLFFBQUVDLENBQUYsR0FBTSxLQUFLQSxDQUFYO0FBQ0QsS0FKRCxNQUtLO0FBQ0hvSSxVQUFJLEtBQUt2SSxDQUFMLEdBQU8sS0FBS2hCLEVBQWhCOztBQUNBLFdBQUlsQixJQUFJYSxDQUFSLEVBQVdiLElBQUlQLEVBQUU0QyxDQUFqQixFQUFvQixFQUFFckMsQ0FBdEIsRUFBeUJvQyxFQUFFcEMsQ0FBRixJQUFPd0ssR0FBR0MsQ0FBSCxFQUFLaEwsRUFBRU8sQ0FBRixDQUFMLENBQVA7O0FBQ3pCb0MsUUFBRUMsQ0FBRixHQUFNNUMsRUFBRTRDLENBQVI7QUFDRDs7QUFDREQsTUFBRUYsQ0FBRixHQUFNc0ksR0FBRyxLQUFLdEksQ0FBUixFQUFVekMsRUFBRXlDLENBQVosQ0FBTjtBQUNBRSxNQUFFVyxLQUFGO0FBQ0QsR0F6d0J5QixDQTJ3QjFCOzs7QUFDQSxXQUFTMkgsTUFBVCxDQUFnQnpLLENBQWhCLEVBQWtCMkUsQ0FBbEIsRUFBcUI7QUFBRSxXQUFPM0UsSUFBRTJFLENBQVQ7QUFBYTs7QUFDcEMsV0FBUytGLEtBQVQsQ0FBZWxMLENBQWYsRUFBa0I7QUFBRSxRQUFJMkMsSUFBSXRDLEtBQVI7QUFBZSxTQUFLZ0ssU0FBTCxDQUFlckssQ0FBZixFQUFpQmlMLE1BQWpCLEVBQXdCdEksQ0FBeEI7QUFBNEIsV0FBT0EsQ0FBUDtBQUFXLEdBN3dCaEQsQ0Erd0IxQjs7O0FBQ0EsV0FBUzRILEtBQVQsQ0FBZS9KLENBQWYsRUFBaUIyRSxDQUFqQixFQUFvQjtBQUFFLFdBQU8zRSxJQUFFMkUsQ0FBVDtBQUFhOztBQUNuQyxXQUFTZ0csSUFBVCxDQUFjbkwsQ0FBZCxFQUFpQjtBQUFFLFFBQUkyQyxJQUFJdEMsS0FBUjtBQUFlLFNBQUtnSyxTQUFMLENBQWVySyxDQUFmLEVBQWlCdUssS0FBakIsRUFBdUI1SCxDQUF2QjtBQUEyQixXQUFPQSxDQUFQO0FBQVcsR0FqeEI5QyxDQW14QjFCOzs7QUFDQSxXQUFTeUksTUFBVCxDQUFnQjVLLENBQWhCLEVBQWtCMkUsQ0FBbEIsRUFBcUI7QUFBRSxXQUFPM0UsSUFBRTJFLENBQVQ7QUFBYTs7QUFDcEMsV0FBU2tHLEtBQVQsQ0FBZXJMLENBQWYsRUFBa0I7QUFBRSxRQUFJMkMsSUFBSXRDLEtBQVI7QUFBZSxTQUFLZ0ssU0FBTCxDQUFlckssQ0FBZixFQUFpQm9MLE1BQWpCLEVBQXdCekksQ0FBeEI7QUFBNEIsV0FBT0EsQ0FBUDtBQUFXLEdBcnhCaEQsQ0F1eEIxQjs7O0FBQ0EsV0FBUzJJLFNBQVQsQ0FBbUI5SyxDQUFuQixFQUFxQjJFLENBQXJCLEVBQXdCO0FBQUUsV0FBTzNFLElBQUUsQ0FBQzJFLENBQVY7QUFBYzs7QUFDeEMsV0FBU29HLFFBQVQsQ0FBa0J2TCxDQUFsQixFQUFxQjtBQUFFLFFBQUkyQyxJQUFJdEMsS0FBUjtBQUFlLFNBQUtnSyxTQUFMLENBQWVySyxDQUFmLEVBQWlCc0wsU0FBakIsRUFBMkIzSSxDQUEzQjtBQUErQixXQUFPQSxDQUFQO0FBQVcsR0F6eEJ0RCxDQTJ4QjFCOzs7QUFDQSxXQUFTNkksS0FBVCxHQUFpQjtBQUNmLFFBQUk3SSxJQUFJdEMsS0FBUjs7QUFDQSxTQUFJLElBQUlFLElBQUksQ0FBWixFQUFlQSxJQUFJLEtBQUtxQyxDQUF4QixFQUEyQixFQUFFckMsQ0FBN0IsRUFBZ0NvQyxFQUFFcEMsQ0FBRixJQUFPLEtBQUtrQixFQUFMLEdBQVEsQ0FBQyxLQUFLbEIsQ0FBTCxDQUFoQjs7QUFDaENvQyxNQUFFQyxDQUFGLEdBQU0sS0FBS0EsQ0FBWDtBQUNBRCxNQUFFRixDQUFGLEdBQU0sQ0FBQyxLQUFLQSxDQUFaO0FBQ0EsV0FBT0UsQ0FBUDtBQUNELEdBbHlCeUIsQ0FveUIxQjs7O0FBQ0EsV0FBUzhJLFdBQVQsQ0FBcUI5SyxDQUFyQixFQUF3QjtBQUN0QixRQUFJZ0MsSUFBSXRDLEtBQVI7QUFDQSxRQUFHTSxJQUFJLENBQVAsRUFBVSxLQUFLOEYsUUFBTCxDQUFjLENBQUM5RixDQUFmLEVBQWlCZ0MsQ0FBakIsRUFBVixLQUFvQyxLQUFLa0QsUUFBTCxDQUFjbEYsQ0FBZCxFQUFnQmdDLENBQWhCO0FBQ3BDLFdBQU9BLENBQVA7QUFDRCxHQXp5QnlCLENBMnlCMUI7OztBQUNBLFdBQVMrSSxZQUFULENBQXNCL0ssQ0FBdEIsRUFBeUI7QUFDdkIsUUFBSWdDLElBQUl0QyxLQUFSO0FBQ0EsUUFBR00sSUFBSSxDQUFQLEVBQVUsS0FBS2tGLFFBQUwsQ0FBYyxDQUFDbEYsQ0FBZixFQUFpQmdDLENBQWpCLEVBQVYsS0FBb0MsS0FBSzhELFFBQUwsQ0FBYzlGLENBQWQsRUFBZ0JnQyxDQUFoQjtBQUNwQyxXQUFPQSxDQUFQO0FBQ0QsR0FoekJ5QixDQWt6QjFCOzs7QUFDQSxXQUFTZ0osSUFBVCxDQUFjbkwsQ0FBZCxFQUFpQjtBQUNmLFFBQUdBLEtBQUssQ0FBUixFQUFXLE9BQU8sQ0FBQyxDQUFSO0FBQ1gsUUFBSW1DLElBQUksQ0FBUjs7QUFDQSxRQUFHLENBQUNuQyxJQUFFLE1BQUgsS0FBYyxDQUFqQixFQUFvQjtBQUFFQSxZQUFNLEVBQU47QUFBVW1DLFdBQUssRUFBTDtBQUFVOztBQUMxQyxRQUFHLENBQUNuQyxJQUFFLElBQUgsS0FBWSxDQUFmLEVBQWtCO0FBQUVBLFlBQU0sQ0FBTjtBQUFTbUMsV0FBSyxDQUFMO0FBQVM7O0FBQ3RDLFFBQUcsQ0FBQ25DLElBQUUsR0FBSCxLQUFXLENBQWQsRUFBaUI7QUFBRUEsWUFBTSxDQUFOO0FBQVNtQyxXQUFLLENBQUw7QUFBUzs7QUFDckMsUUFBRyxDQUFDbkMsSUFBRSxDQUFILEtBQVMsQ0FBWixFQUFlO0FBQUVBLFlBQU0sQ0FBTjtBQUFTbUMsV0FBSyxDQUFMO0FBQVM7O0FBQ25DLFFBQUcsQ0FBQ25DLElBQUUsQ0FBSCxLQUFTLENBQVosRUFBZSxFQUFFbUMsQ0FBRjtBQUNmLFdBQU9BLENBQVA7QUFDRCxHQTV6QnlCLENBOHpCMUI7OztBQUNBLFdBQVNpSixpQkFBVCxHQUE2QjtBQUMzQixTQUFJLElBQUlyTCxJQUFJLENBQVosRUFBZUEsSUFBSSxLQUFLcUMsQ0FBeEIsRUFBMkIsRUFBRXJDLENBQTdCLEVBQ0UsSUFBRyxLQUFLQSxDQUFMLEtBQVcsQ0FBZCxFQUFpQixPQUFPQSxJQUFFLEtBQUtpQixFQUFQLEdBQVVtSyxLQUFLLEtBQUtwTCxDQUFMLENBQUwsQ0FBakI7O0FBQ25CLFFBQUcsS0FBS2tDLENBQUwsR0FBUyxDQUFaLEVBQWUsT0FBTyxLQUFLRyxDQUFMLEdBQU8sS0FBS3BCLEVBQW5CO0FBQ2YsV0FBTyxDQUFDLENBQVI7QUFDRCxHQXAwQnlCLENBczBCMUI7OztBQUNBLFdBQVNxSyxJQUFULENBQWNyTCxDQUFkLEVBQWlCO0FBQ2YsUUFBSW1DLElBQUksQ0FBUjs7QUFDQSxXQUFNbkMsS0FBSyxDQUFYLEVBQWM7QUFBRUEsV0FBS0EsSUFBRSxDQUFQO0FBQVUsUUFBRW1DLENBQUY7QUFBTTs7QUFDaEMsV0FBT0EsQ0FBUDtBQUNELEdBMzBCeUIsQ0E2MEIxQjs7O0FBQ0EsV0FBU21KLFVBQVQsR0FBc0I7QUFDcEIsUUFBSW5KLElBQUksQ0FBUjtBQUFBLFFBQVduQyxJQUFJLEtBQUtpQyxDQUFMLEdBQU8sS0FBS2hCLEVBQTNCOztBQUNBLFNBQUksSUFBSWxCLElBQUksQ0FBWixFQUFlQSxJQUFJLEtBQUtxQyxDQUF4QixFQUEyQixFQUFFckMsQ0FBN0IsRUFBZ0NvQyxLQUFLa0osS0FBSyxLQUFLdEwsQ0FBTCxJQUFRQyxDQUFiLENBQUw7O0FBQ2hDLFdBQU9tQyxDQUFQO0FBQ0QsR0FsMUJ5QixDQW8xQjFCOzs7QUFDQSxXQUFTb0osU0FBVCxDQUFtQnBMLENBQW5CLEVBQXNCO0FBQ3BCLFFBQUlELElBQUlHLEtBQUtDLEtBQUwsQ0FBV0gsSUFBRSxLQUFLYSxFQUFsQixDQUFSO0FBQ0EsUUFBR2QsS0FBSyxLQUFLa0MsQ0FBYixFQUFnQixPQUFPLEtBQUtILENBQUwsSUFBUSxDQUFmO0FBQ2hCLFdBQU8sQ0FBQyxLQUFLL0IsQ0FBTCxJQUFTLEtBQUlDLElBQUUsS0FBS2EsRUFBckIsS0FBNEIsQ0FBbkM7QUFDRCxHQXoxQnlCLENBMjFCMUI7OztBQUNBLFdBQVN3SyxZQUFULENBQXNCckwsQ0FBdEIsRUFBd0JvSyxFQUF4QixFQUE0QjtBQUMxQixRQUFJcEksSUFBSS9DLFdBQVcwRyxHQUFYLENBQWVnRSxTQUFmLENBQXlCM0osQ0FBekIsQ0FBUjtBQUNBLFNBQUswSixTQUFMLENBQWUxSCxDQUFmLEVBQWlCb0ksRUFBakIsRUFBb0JwSSxDQUFwQjtBQUNBLFdBQU9BLENBQVA7QUFDRCxHQWgyQnlCLENBazJCMUI7OztBQUNBLFdBQVNzSixRQUFULENBQWtCdEwsQ0FBbEIsRUFBcUI7QUFBRSxXQUFPLEtBQUt1TCxTQUFMLENBQWV2TCxDQUFmLEVBQWlCNEosS0FBakIsQ0FBUDtBQUFpQyxHQW4yQjlCLENBcTJCMUI7OztBQUNBLFdBQVM0QixVQUFULENBQW9CeEwsQ0FBcEIsRUFBdUI7QUFBRSxXQUFPLEtBQUt1TCxTQUFMLENBQWV2TCxDQUFmLEVBQWlCMkssU0FBakIsQ0FBUDtBQUFxQyxHQXQyQnBDLENBdzJCMUI7OztBQUNBLFdBQVNjLFNBQVQsQ0FBbUJ6TCxDQUFuQixFQUFzQjtBQUFFLFdBQU8sS0FBS3VMLFNBQUwsQ0FBZXZMLENBQWYsRUFBaUJ5SyxNQUFqQixDQUFQO0FBQWtDLEdBejJCaEMsQ0EyMkIxQjs7O0FBQ0EsV0FBU2lCLFFBQVQsQ0FBa0JyTSxDQUFsQixFQUFvQjJDLENBQXBCLEVBQXVCO0FBQ3JCLFFBQUlwQyxJQUFJLENBQVI7QUFBQSxRQUFXTCxJQUFJLENBQWY7QUFBQSxRQUFrQmtCLElBQUlQLEtBQUttRSxHQUFMLENBQVNoRixFQUFFNEMsQ0FBWCxFQUFhLEtBQUtBLENBQWxCLENBQXRCOztBQUNBLFdBQU1yQyxJQUFJYSxDQUFWLEVBQWE7QUFDWGxCLFdBQUssS0FBS0ssQ0FBTCxJQUFRUCxFQUFFTyxDQUFGLENBQWI7QUFDQW9DLFFBQUVwQyxHQUFGLElBQVNMLElBQUUsS0FBS3VCLEVBQWhCO0FBQ0F2QixZQUFNLEtBQUtzQixFQUFYO0FBQ0Q7O0FBQ0QsUUFBR3hCLEVBQUU0QyxDQUFGLEdBQU0sS0FBS0EsQ0FBZCxFQUFpQjtBQUNmMUMsV0FBS0YsRUFBRXlDLENBQVA7O0FBQ0EsYUFBTWxDLElBQUksS0FBS3FDLENBQWYsRUFBa0I7QUFDaEIxQyxhQUFLLEtBQUtLLENBQUwsQ0FBTDtBQUNBb0MsVUFBRXBDLEdBQUYsSUFBU0wsSUFBRSxLQUFLdUIsRUFBaEI7QUFDQXZCLGNBQU0sS0FBS3NCLEVBQVg7QUFDRDs7QUFDRHRCLFdBQUssS0FBS3VDLENBQVY7QUFDRCxLQVJELE1BU0s7QUFDSHZDLFdBQUssS0FBS3VDLENBQVY7O0FBQ0EsYUFBTWxDLElBQUlQLEVBQUU0QyxDQUFaLEVBQWU7QUFDYjFDLGFBQUtGLEVBQUVPLENBQUYsQ0FBTDtBQUNBb0MsVUFBRXBDLEdBQUYsSUFBU0wsSUFBRSxLQUFLdUIsRUFBaEI7QUFDQXZCLGNBQU0sS0FBS3NCLEVBQVg7QUFDRDs7QUFDRHRCLFdBQUtGLEVBQUV5QyxDQUFQO0FBQ0Q7O0FBQ0RFLE1BQUVGLENBQUYsR0FBT3ZDLElBQUUsQ0FBSCxHQUFNLENBQUMsQ0FBUCxHQUFTLENBQWY7QUFDQSxRQUFHQSxJQUFJLENBQVAsRUFBVXlDLEVBQUVwQyxHQUFGLElBQVNMLENBQVQsQ0FBVixLQUNLLElBQUdBLElBQUksQ0FBQyxDQUFSLEVBQVd5QyxFQUFFcEMsR0FBRixJQUFTLEtBQUttQixFQUFMLEdBQVF4QixDQUFqQjtBQUNoQnlDLE1BQUVDLENBQUYsR0FBTXJDLENBQU47QUFDQW9DLE1BQUVXLEtBQUY7QUFDRCxHQTE0QnlCLENBNDRCMUI7OztBQUNBLFdBQVNnSixLQUFULENBQWV0TSxDQUFmLEVBQWtCO0FBQUUsUUFBSTJDLElBQUl0QyxLQUFSO0FBQWUsU0FBS2tNLEtBQUwsQ0FBV3ZNLENBQVgsRUFBYTJDLENBQWI7QUFBaUIsV0FBT0EsQ0FBUDtBQUFXLEdBNzRCckMsQ0ErNEIxQjs7O0FBQ0EsV0FBUzZKLFVBQVQsQ0FBb0J4TSxDQUFwQixFQUF1QjtBQUFFLFFBQUkyQyxJQUFJdEMsS0FBUjtBQUFlLFNBQUttRCxLQUFMLENBQVd4RCxDQUFYLEVBQWEyQyxDQUFiO0FBQWlCLFdBQU9BLENBQVA7QUFBVyxHQWg1QjFDLENBazVCMUI7OztBQUNBLFdBQVM4SixVQUFULENBQW9Cek0sQ0FBcEIsRUFBdUI7QUFBRSxRQUFJMkMsSUFBSXRDLEtBQVI7QUFBZSxTQUFLNkcsVUFBTCxDQUFnQmxILENBQWhCLEVBQWtCMkMsQ0FBbEI7QUFBc0IsV0FBT0EsQ0FBUDtBQUFXLEdBbjVCL0MsQ0FxNUIxQjs7O0FBQ0EsV0FBUytKLFFBQVQsQ0FBa0IxTSxDQUFsQixFQUFxQjtBQUFFLFFBQUkyQyxJQUFJdEMsS0FBUjtBQUFlLFNBQUtzRyxRQUFMLENBQWMzRyxDQUFkLEVBQWdCMkMsQ0FBaEIsRUFBa0IsSUFBbEI7QUFBeUIsV0FBT0EsQ0FBUDtBQUFXLEdBdDVCaEQsQ0F3NUIxQjs7O0FBQ0EsV0FBU2dLLFdBQVQsQ0FBcUIzTSxDQUFyQixFQUF3QjtBQUFFLFFBQUkyQyxJQUFJdEMsS0FBUjtBQUFlLFNBQUtzRyxRQUFMLENBQWMzRyxDQUFkLEVBQWdCLElBQWhCLEVBQXFCMkMsQ0FBckI7QUFBeUIsV0FBT0EsQ0FBUDtBQUFXLEdBejVCbkQsQ0EyNUIxQjs7O0FBQ0EsV0FBU2lLLG9CQUFULENBQThCNU0sQ0FBOUIsRUFBaUM7QUFDL0IsUUFBSXNGLElBQUlqRixLQUFSO0FBQUEsUUFBZXNDLElBQUl0QyxLQUFuQjtBQUNBLFNBQUtzRyxRQUFMLENBQWMzRyxDQUFkLEVBQWdCc0YsQ0FBaEIsRUFBa0IzQyxDQUFsQjtBQUNBLFdBQU8sSUFBSVQsS0FBSixDQUFVb0QsQ0FBVixFQUFZM0MsQ0FBWixDQUFQO0FBQ0QsR0FoNkJ5QixDQWs2QjFCOzs7QUFDQSxXQUFTa0ssWUFBVCxDQUFzQmxNLENBQXRCLEVBQXlCO0FBQ3ZCLFNBQUssS0FBS2lDLENBQVYsSUFBZSxLQUFLckIsRUFBTCxDQUFRLENBQVIsRUFBVVosSUFBRSxDQUFaLEVBQWMsSUFBZCxFQUFtQixDQUFuQixFQUFxQixDQUFyQixFQUF1QixLQUFLaUMsQ0FBNUIsQ0FBZjtBQUNBLE1BQUUsS0FBS0EsQ0FBUDtBQUNBLFNBQUtVLEtBQUw7QUFDRCxHQXY2QnlCLENBeTZCMUI7OztBQUNBLFdBQVN3SixhQUFULENBQXVCbk0sQ0FBdkIsRUFBeUJGLENBQXpCLEVBQTRCO0FBQzFCLFdBQU0sS0FBS21DLENBQUwsSUFBVW5DLENBQWhCLEVBQW1CLEtBQUssS0FBS21DLENBQUwsRUFBTCxJQUFpQixDQUFqQjs7QUFDbkIsU0FBS25DLENBQUwsS0FBV0UsQ0FBWDs7QUFDQSxXQUFNLEtBQUtGLENBQUwsS0FBVyxLQUFLaUIsRUFBdEIsRUFBMEI7QUFDeEIsV0FBS2pCLENBQUwsS0FBVyxLQUFLaUIsRUFBaEI7QUFDQSxVQUFHLEVBQUVqQixDQUFGLElBQU8sS0FBS21DLENBQWYsRUFBa0IsS0FBSyxLQUFLQSxDQUFMLEVBQUwsSUFBaUIsQ0FBakI7QUFDbEIsUUFBRSxLQUFLbkMsQ0FBTCxDQUFGO0FBQ0Q7QUFDRixHQWw3QnlCLENBbzdCMUI7OztBQUNBLFdBQVNzTSxPQUFULEdBQW1CLENBQUU7O0FBQ3JCLFdBQVNDLElBQVQsQ0FBY3hNLENBQWQsRUFBaUI7QUFBRSxXQUFPQSxDQUFQO0FBQVc7O0FBQzlCLFdBQVN5TSxNQUFULENBQWdCek0sQ0FBaEIsRUFBa0IyRSxDQUFsQixFQUFvQnhDLENBQXBCLEVBQXVCO0FBQUVuQyxNQUFFMEcsVUFBRixDQUFhL0IsQ0FBYixFQUFleEMsQ0FBZjtBQUFvQjs7QUFDN0MsV0FBU3VLLE1BQVQsQ0FBZ0IxTSxDQUFoQixFQUFrQm1DLENBQWxCLEVBQXFCO0FBQUVuQyxNQUFFNkcsUUFBRixDQUFXMUUsQ0FBWDtBQUFnQjs7QUFFdkNvSyxVQUFRekwsU0FBUixDQUFrQmdHLE9BQWxCLEdBQTRCMEYsSUFBNUI7QUFDQUQsVUFBUXpMLFNBQVIsQ0FBa0JpRyxNQUFsQixHQUEyQnlGLElBQTNCO0FBQ0FELFVBQVF6TCxTQUFSLENBQWtCa0csS0FBbEIsR0FBMEJ5RixNQUExQjtBQUNBRixVQUFRekwsU0FBUixDQUFrQm1HLEtBQWxCLEdBQTBCeUYsTUFBMUIsQ0E3N0IwQixDQSs3QjFCOztBQUNBLFdBQVNDLEtBQVQsQ0FBZWhILENBQWYsRUFBa0I7QUFBRSxXQUFPLEtBQUs0QyxHQUFMLENBQVM1QyxDQUFULEVBQVcsSUFBSTRHLE9BQUosRUFBWCxDQUFQO0FBQW1DLEdBaDhCN0IsQ0FrOEIxQjtBQUNBOzs7QUFDQSxXQUFTSyxrQkFBVCxDQUE0QnBOLENBQTVCLEVBQThCVyxDQUE5QixFQUFnQ2dDLENBQWhDLEVBQW1DO0FBQ2pDLFFBQUlwQyxJQUFJTSxLQUFLbUUsR0FBTCxDQUFTLEtBQUtwQyxDQUFMLEdBQU81QyxFQUFFNEMsQ0FBbEIsRUFBb0JqQyxDQUFwQixDQUFSO0FBQ0FnQyxNQUFFRixDQUFGLEdBQU0sQ0FBTixDQUZpQyxDQUV4Qjs7QUFDVEUsTUFBRUMsQ0FBRixHQUFNckMsQ0FBTjs7QUFDQSxXQUFNQSxJQUFJLENBQVYsRUFBYW9DLEVBQUUsRUFBRXBDLENBQUosSUFBUyxDQUFUOztBQUNiLFFBQUlHLENBQUo7O0FBQ0EsU0FBSUEsSUFBSWlDLEVBQUVDLENBQUYsR0FBSSxLQUFLQSxDQUFqQixFQUFvQnJDLElBQUlHLENBQXhCLEVBQTJCLEVBQUVILENBQTdCLEVBQWdDb0MsRUFBRXBDLElBQUUsS0FBS3FDLENBQVQsSUFBYyxLQUFLckIsRUFBTCxDQUFRLENBQVIsRUFBVXZCLEVBQUVPLENBQUYsQ0FBVixFQUFlb0MsQ0FBZixFQUFpQnBDLENBQWpCLEVBQW1CLENBQW5CLEVBQXFCLEtBQUtxQyxDQUExQixDQUFkOztBQUNoQyxTQUFJbEMsSUFBSUcsS0FBS21FLEdBQUwsQ0FBU2hGLEVBQUU0QyxDQUFYLEVBQWFqQyxDQUFiLENBQVIsRUFBeUJKLElBQUlHLENBQTdCLEVBQWdDLEVBQUVILENBQWxDLEVBQXFDLEtBQUtnQixFQUFMLENBQVEsQ0FBUixFQUFVdkIsRUFBRU8sQ0FBRixDQUFWLEVBQWVvQyxDQUFmLEVBQWlCcEMsQ0FBakIsRUFBbUIsQ0FBbkIsRUFBcUJJLElBQUVKLENBQXZCOztBQUNyQ29DLE1BQUVXLEtBQUY7QUFDRCxHQTc4QnlCLENBKzhCMUI7QUFDQTs7O0FBQ0EsV0FBUytKLGtCQUFULENBQTRCck4sQ0FBNUIsRUFBOEJXLENBQTlCLEVBQWdDZ0MsQ0FBaEMsRUFBbUM7QUFDakMsTUFBRWhDLENBQUY7QUFDQSxRQUFJSixJQUFJb0MsRUFBRUMsQ0FBRixHQUFNLEtBQUtBLENBQUwsR0FBTzVDLEVBQUU0QyxDQUFULEdBQVdqQyxDQUF6QjtBQUNBZ0MsTUFBRUYsQ0FBRixHQUFNLENBQU4sQ0FIaUMsQ0FHeEI7O0FBQ1QsV0FBTSxFQUFFbEMsQ0FBRixJQUFPLENBQWIsRUFBZ0JvQyxFQUFFcEMsQ0FBRixJQUFPLENBQVA7O0FBQ2hCLFNBQUlBLElBQUlNLEtBQUsyRCxHQUFMLENBQVM3RCxJQUFFLEtBQUtpQyxDQUFoQixFQUFrQixDQUFsQixDQUFSLEVBQThCckMsSUFBSVAsRUFBRTRDLENBQXBDLEVBQXVDLEVBQUVyQyxDQUF6QyxFQUNFb0MsRUFBRSxLQUFLQyxDQUFMLEdBQU9yQyxDQUFQLEdBQVNJLENBQVgsSUFBZ0IsS0FBS1ksRUFBTCxDQUFRWixJQUFFSixDQUFWLEVBQVlQLEVBQUVPLENBQUYsQ0FBWixFQUFpQm9DLENBQWpCLEVBQW1CLENBQW5CLEVBQXFCLENBQXJCLEVBQXVCLEtBQUtDLENBQUwsR0FBT3JDLENBQVAsR0FBU0ksQ0FBaEMsQ0FBaEI7O0FBQ0ZnQyxNQUFFVyxLQUFGO0FBQ0FYLE1BQUU2RCxTQUFGLENBQVksQ0FBWixFQUFjN0QsQ0FBZDtBQUNELEdBMTlCeUIsQ0E0OUIxQjs7O0FBQ0EsV0FBUzJLLE9BQVQsQ0FBaUJsTSxDQUFqQixFQUFvQjtBQUNsQjtBQUNBLFNBQUt1SCxFQUFMLEdBQVV0SSxLQUFWO0FBQ0EsU0FBS2tOLEVBQUwsR0FBVWxOLEtBQVY7QUFDQVQsZUFBVzBHLEdBQVgsQ0FBZUYsU0FBZixDQUF5QixJQUFFaEYsRUFBRXdCLENBQTdCLEVBQStCLEtBQUsrRixFQUFwQztBQUNBLFNBQUs2RSxFQUFMLEdBQVUsS0FBSzdFLEVBQUwsQ0FBUThFLE1BQVIsQ0FBZXJNLENBQWYsQ0FBVjtBQUNBLFNBQUtBLENBQUwsR0FBU0EsQ0FBVDtBQUNEOztBQUVELFdBQVNzTSxjQUFULENBQXdCbE4sQ0FBeEIsRUFBMkI7QUFDekIsUUFBR0EsRUFBRWlDLENBQUYsR0FBTSxDQUFOLElBQVdqQyxFQUFFb0MsQ0FBRixHQUFNLElBQUUsS0FBS3hCLENBQUwsQ0FBT3dCLENBQTdCLEVBQWdDLE9BQU9wQyxFQUFFc0csR0FBRixDQUFNLEtBQUsxRixDQUFYLENBQVAsQ0FBaEMsS0FDSyxJQUFHWixFQUFFNkYsU0FBRixDQUFZLEtBQUtqRixDQUFqQixJQUFzQixDQUF6QixFQUE0QixPQUFPWixDQUFQLENBQTVCLEtBQ0E7QUFBRSxVQUFJbUMsSUFBSXRDLEtBQVI7QUFBZUcsUUFBRWlGLE1BQUYsQ0FBUzlDLENBQVQ7QUFBYSxXQUFLd0UsTUFBTCxDQUFZeEUsQ0FBWjtBQUFnQixhQUFPQSxDQUFQO0FBQVc7QUFDL0Q7O0FBRUQsV0FBU2dMLGFBQVQsQ0FBdUJuTixDQUF2QixFQUEwQjtBQUFFLFdBQU9BLENBQVA7QUFBVyxHQTUrQmIsQ0E4K0IxQjs7O0FBQ0EsV0FBU29OLGFBQVQsQ0FBdUJwTixDQUF2QixFQUEwQjtBQUN4QkEsTUFBRWdHLFNBQUYsQ0FBWSxLQUFLcEYsQ0FBTCxDQUFPd0IsQ0FBUCxHQUFTLENBQXJCLEVBQXVCLEtBQUsrRixFQUE1Qjs7QUFDQSxRQUFHbkksRUFBRW9DLENBQUYsR0FBTSxLQUFLeEIsQ0FBTCxDQUFPd0IsQ0FBUCxHQUFTLENBQWxCLEVBQXFCO0FBQUVwQyxRQUFFb0MsQ0FBRixHQUFNLEtBQUt4QixDQUFMLENBQU93QixDQUFQLEdBQVMsQ0FBZjtBQUFrQnBDLFFBQUU4QyxLQUFGO0FBQVk7O0FBQ3JELFNBQUtrSyxFQUFMLENBQVFLLGVBQVIsQ0FBd0IsS0FBS2xGLEVBQTdCLEVBQWdDLEtBQUt2SCxDQUFMLENBQU93QixDQUFQLEdBQVMsQ0FBekMsRUFBMkMsS0FBSzJLLEVBQWhEO0FBQ0EsU0FBS25NLENBQUwsQ0FBTzBNLGVBQVAsQ0FBdUIsS0FBS1AsRUFBNUIsRUFBK0IsS0FBS25NLENBQUwsQ0FBT3dCLENBQVAsR0FBUyxDQUF4QyxFQUEwQyxLQUFLK0YsRUFBL0M7O0FBQ0EsV0FBTW5JLEVBQUU2RixTQUFGLENBQVksS0FBS3NDLEVBQWpCLElBQXVCLENBQTdCLEVBQWdDbkksRUFBRTBKLFVBQUYsQ0FBYSxDQUFiLEVBQWUsS0FBSzlJLENBQUwsQ0FBT3dCLENBQVAsR0FBUyxDQUF4Qjs7QUFDaENwQyxNQUFFZ0QsS0FBRixDQUFRLEtBQUttRixFQUFiLEVBQWdCbkksQ0FBaEI7O0FBQ0EsV0FBTUEsRUFBRTZGLFNBQUYsQ0FBWSxLQUFLakYsQ0FBakIsS0FBdUIsQ0FBN0IsRUFBZ0NaLEVBQUVnRCxLQUFGLENBQVEsS0FBS3BDLENBQWIsRUFBZVosQ0FBZjtBQUNqQyxHQXYvQnlCLENBeS9CMUI7OztBQUNBLFdBQVN1TixZQUFULENBQXNCdk4sQ0FBdEIsRUFBd0JtQyxDQUF4QixFQUEyQjtBQUFFbkMsTUFBRTZHLFFBQUYsQ0FBVzFFLENBQVg7QUFBZSxTQUFLd0UsTUFBTCxDQUFZeEUsQ0FBWjtBQUFpQixHQTEvQm5DLENBNC9CMUI7OztBQUNBLFdBQVNxTCxZQUFULENBQXNCeE4sQ0FBdEIsRUFBd0IyRSxDQUF4QixFQUEwQnhDLENBQTFCLEVBQTZCO0FBQUVuQyxNQUFFMEcsVUFBRixDQUFhL0IsQ0FBYixFQUFleEMsQ0FBZjtBQUFtQixTQUFLd0UsTUFBTCxDQUFZeEUsQ0FBWjtBQUFpQjs7QUFFbkUySyxVQUFRaE0sU0FBUixDQUFrQmdHLE9BQWxCLEdBQTRCb0csY0FBNUI7QUFDQUosVUFBUWhNLFNBQVIsQ0FBa0JpRyxNQUFsQixHQUEyQm9HLGFBQTNCO0FBQ0FMLFVBQVFoTSxTQUFSLENBQWtCNkYsTUFBbEIsR0FBMkJ5RyxhQUEzQjtBQUNBTixVQUFRaE0sU0FBUixDQUFrQmtHLEtBQWxCLEdBQTBCd0csWUFBMUI7QUFDQVYsVUFBUWhNLFNBQVIsQ0FBa0JtRyxLQUFsQixHQUEwQnNHLFlBQTFCLENBbmdDMEIsQ0FxZ0MxQjs7QUFDQSxXQUFTRSxRQUFULENBQWtCOUgsQ0FBbEIsRUFBb0IvRSxDQUFwQixFQUF1QjtBQUNyQixRQUFJYixJQUFJNEYsRUFBRTZDLFNBQUYsRUFBUjtBQUFBLFFBQXVCL0YsQ0FBdkI7QUFBQSxRQUEwQk4sSUFBSUcsSUFBSSxDQUFKLENBQTlCO0FBQUEsUUFBc0M0RixDQUF0QztBQUNBLFFBQUduSSxLQUFLLENBQVIsRUFBVyxPQUFPb0MsQ0FBUCxDQUFYLEtBQ0ssSUFBR3BDLElBQUksRUFBUCxFQUFXMEMsSUFBSSxDQUFKLENBQVgsS0FDQSxJQUFHMUMsSUFBSSxFQUFQLEVBQVcwQyxJQUFJLENBQUosQ0FBWCxLQUNBLElBQUcxQyxJQUFJLEdBQVAsRUFBWTBDLElBQUksQ0FBSixDQUFaLEtBQ0EsSUFBRzFDLElBQUksR0FBUCxFQUFZMEMsSUFBSSxDQUFKLENBQVosS0FDQUEsSUFBSSxDQUFKO0FBQ0wsUUFBRzFDLElBQUksQ0FBUCxFQUNFbUksSUFBSSxJQUFJOUIsT0FBSixDQUFZeEYsQ0FBWixDQUFKLENBREYsS0FFSyxJQUFHQSxFQUFFMEgsTUFBRixFQUFILEVBQ0hKLElBQUksSUFBSTRFLE9BQUosQ0FBWWxNLENBQVosQ0FBSixDQURHLEtBR0hzSCxJQUFJLElBQUlmLFVBQUosQ0FBZXZHLENBQWYsQ0FBSixDQWJtQixDQWVyQjs7QUFDQSxRQUFJd0gsSUFBSSxJQUFJMUcsS0FBSixFQUFSO0FBQUEsUUFBcUJ2QixJQUFJLENBQXpCO0FBQUEsUUFBNEJ1TixLQUFLakwsSUFBRSxDQUFuQztBQUFBLFFBQXNDYSxLQUFLLENBQUMsS0FBR2IsQ0FBSixJQUFPLENBQWxEO0FBQ0EyRixNQUFFLENBQUYsSUFBT0YsRUFBRXBCLE9BQUYsQ0FBVSxJQUFWLENBQVA7O0FBQ0EsUUFBR3JFLElBQUksQ0FBUCxFQUFVO0FBQ1IsVUFBSWtMLEtBQUs5TixLQUFUO0FBQ0FxSSxRQUFFakIsS0FBRixDQUFRbUIsRUFBRSxDQUFGLENBQVIsRUFBYXVGLEVBQWI7O0FBQ0EsYUFBTXhOLEtBQUttRCxFQUFYLEVBQWU7QUFDYjhFLFVBQUVqSSxDQUFGLElBQU9OLEtBQVA7QUFDQXFJLFVBQUVsQixLQUFGLENBQVEyRyxFQUFSLEVBQVd2RixFQUFFakksSUFBRSxDQUFKLENBQVgsRUFBa0JpSSxFQUFFakksQ0FBRixDQUFsQjtBQUNBQSxhQUFLLENBQUw7QUFDRDtBQUNGOztBQUVELFFBQUlELElBQUl5RixFQUFFdkQsQ0FBRixHQUFJLENBQVo7QUFBQSxRQUFlbkMsQ0FBZjtBQUFBLFFBQWtCMk4sTUFBTSxJQUF4QjtBQUFBLFFBQThCekYsS0FBS3RJLEtBQW5DO0FBQUEsUUFBMEN1QyxDQUExQztBQUNBckMsUUFBSTZELE1BQU0rQixFQUFFekYsQ0FBRixDQUFOLElBQVksQ0FBaEI7O0FBQ0EsV0FBTUEsS0FBSyxDQUFYLEVBQWM7QUFDWixVQUFHSCxLQUFLMk4sRUFBUixFQUFZek4sSUFBSzBGLEVBQUV6RixDQUFGLEtBQU9ILElBQUUyTixFQUFWLEdBQWVwSyxFQUFuQixDQUFaLEtBQ0s7QUFDSHJELFlBQUksQ0FBQzBGLEVBQUV6RixDQUFGLElBQU0sQ0FBQyxLQUFJSCxJQUFFLENBQVAsSUFBVyxDQUFsQixLQUF3QjJOLEtBQUczTixDQUEvQjtBQUNBLFlBQUdHLElBQUksQ0FBUCxFQUFVRCxLQUFLMEYsRUFBRXpGLElBQUUsQ0FBSixLQUFTLEtBQUtjLEVBQUwsR0FBUWpCLENBQVIsR0FBVTJOLEVBQXhCO0FBQ1g7QUFFRHZOLFVBQUlzQyxDQUFKOztBQUNBLGFBQU0sQ0FBQ3hDLElBQUUsQ0FBSCxLQUFTLENBQWYsRUFBa0I7QUFBRUEsY0FBTSxDQUFOO0FBQVMsVUFBRUUsQ0FBRjtBQUFNOztBQUNuQyxVQUFHLENBQUNKLEtBQUtJLENBQU4sSUFBVyxDQUFkLEVBQWlCO0FBQUVKLGFBQUssS0FBS2lCLEVBQVY7QUFBYyxVQUFFZCxDQUFGO0FBQU07O0FBQ3ZDLFVBQUcwTixHQUFILEVBQVE7QUFBRTtBQUNSeEYsVUFBRW5JLENBQUYsRUFBS2dGLE1BQUwsQ0FBWTlDLENBQVo7QUFDQXlMLGNBQU0sS0FBTjtBQUNELE9BSEQsTUFJSztBQUNILGVBQU16TixJQUFJLENBQVYsRUFBYTtBQUFFK0gsWUFBRWpCLEtBQUYsQ0FBUTlFLENBQVIsRUFBVWdHLEVBQVY7QUFBZUQsWUFBRWpCLEtBQUYsQ0FBUWtCLEVBQVIsRUFBV2hHLENBQVg7QUFBZWhDLGVBQUssQ0FBTDtBQUFTOztBQUN0RCxZQUFHQSxJQUFJLENBQVAsRUFBVStILEVBQUVqQixLQUFGLENBQVE5RSxDQUFSLEVBQVVnRyxFQUFWLEVBQVYsS0FBOEI7QUFBRS9GLGNBQUlELENBQUo7QUFBT0EsY0FBSWdHLEVBQUo7QUFBUUEsZUFBSy9GLENBQUw7QUFBUztBQUN4RDhGLFVBQUVsQixLQUFGLENBQVFtQixFQUFSLEVBQVdDLEVBQUVuSSxDQUFGLENBQVgsRUFBZ0JrQyxDQUFoQjtBQUNEOztBQUVELGFBQU1qQyxLQUFLLENBQUwsSUFBVSxDQUFDeUYsRUFBRXpGLENBQUYsSUFBTSxLQUFHSCxDQUFWLEtBQWlCLENBQWpDLEVBQW9DO0FBQ2xDbUksVUFBRWpCLEtBQUYsQ0FBUTlFLENBQVIsRUFBVWdHLEVBQVY7QUFBZS9GLFlBQUlELENBQUo7QUFBT0EsWUFBSWdHLEVBQUo7QUFBUUEsYUFBSy9GLENBQUw7O0FBQzlCLFlBQUcsRUFBRXJDLENBQUYsR0FBTSxDQUFULEVBQVk7QUFBRUEsY0FBSSxLQUFLaUIsRUFBTCxHQUFRLENBQVo7QUFBZSxZQUFFZCxDQUFGO0FBQU07QUFDcEM7QUFDRjs7QUFDRCxXQUFPZ0ksRUFBRW5CLE1BQUYsQ0FBUzVFLENBQVQsQ0FBUDtBQUNELEdBOWpDeUIsQ0Fna0MxQjs7O0FBQ0EsV0FBUzBMLEtBQVQsQ0FBZXJPLENBQWYsRUFBa0I7QUFDaEIsUUFBSVEsSUFBSyxLQUFLaUMsQ0FBTCxHQUFPLENBQVIsR0FBVyxLQUFLa0IsTUFBTCxFQUFYLEdBQXlCLEtBQUsySyxLQUFMLEVBQWpDO0FBQ0EsUUFBSW5KLElBQUtuRixFQUFFeUMsQ0FBRixHQUFJLENBQUwsR0FBUXpDLEVBQUUyRCxNQUFGLEVBQVIsR0FBbUIzRCxFQUFFc08sS0FBRixFQUEzQjs7QUFDQSxRQUFHOU4sRUFBRTZGLFNBQUYsQ0FBWWxCLENBQVosSUFBaUIsQ0FBcEIsRUFBdUI7QUFBRSxVQUFJdkMsSUFBSXBDLENBQVI7QUFBV0EsVUFBSTJFLENBQUo7QUFBT0EsVUFBSXZDLENBQUo7QUFBUTs7QUFDbkQsUUFBSXJDLElBQUlDLEVBQUUrTixlQUFGLEVBQVI7QUFBQSxRQUE2QjNGLElBQUl6RCxFQUFFb0osZUFBRixFQUFqQztBQUNBLFFBQUczRixJQUFJLENBQVAsRUFBVSxPQUFPcEksQ0FBUDtBQUNWLFFBQUdELElBQUlxSSxDQUFQLEVBQVVBLElBQUlySSxDQUFKOztBQUNWLFFBQUdxSSxJQUFJLENBQVAsRUFBVTtBQUNScEksUUFBRWlHLFFBQUYsQ0FBV21DLENBQVgsRUFBYXBJLENBQWI7QUFDQTJFLFFBQUVzQixRQUFGLENBQVdtQyxDQUFYLEVBQWF6RCxDQUFiO0FBQ0Q7O0FBQ0QsV0FBTTNFLEVBQUVtSixNQUFGLEtBQWEsQ0FBbkIsRUFBc0I7QUFDcEIsVUFBRyxDQUFDcEosSUFBSUMsRUFBRStOLGVBQUYsRUFBTCxJQUE0QixDQUEvQixFQUFrQy9OLEVBQUVpRyxRQUFGLENBQVdsRyxDQUFYLEVBQWFDLENBQWI7QUFDbEMsVUFBRyxDQUFDRCxJQUFJNEUsRUFBRW9KLGVBQUYsRUFBTCxJQUE0QixDQUEvQixFQUFrQ3BKLEVBQUVzQixRQUFGLENBQVdsRyxDQUFYLEVBQWE0RSxDQUFiOztBQUNsQyxVQUFHM0UsRUFBRTZGLFNBQUYsQ0FBWWxCLENBQVosS0FBa0IsQ0FBckIsRUFBd0I7QUFDdEIzRSxVQUFFZ0QsS0FBRixDQUFRMkIsQ0FBUixFQUFVM0UsQ0FBVjtBQUNBQSxVQUFFaUcsUUFBRixDQUFXLENBQVgsRUFBYWpHLENBQWI7QUFDRCxPQUhELE1BSUs7QUFDSDJFLFVBQUUzQixLQUFGLENBQVFoRCxDQUFSLEVBQVUyRSxDQUFWO0FBQ0FBLFVBQUVzQixRQUFGLENBQVcsQ0FBWCxFQUFhdEIsQ0FBYjtBQUNEO0FBQ0Y7O0FBQ0QsUUFBR3lELElBQUksQ0FBUCxFQUFVekQsRUFBRVUsUUFBRixDQUFXK0MsQ0FBWCxFQUFhekQsQ0FBYjtBQUNWLFdBQU9BLENBQVA7QUFDRCxHQTFsQ3lCLENBNGxDMUI7OztBQUNBLFdBQVNxSixTQUFULENBQW1CN04sQ0FBbkIsRUFBc0I7QUFDcEIsUUFBR0EsS0FBSyxDQUFSLEVBQVcsT0FBTyxDQUFQO0FBQ1gsUUFBSW9ELElBQUksS0FBS3JDLEVBQUwsR0FBUWYsQ0FBaEI7QUFBQSxRQUFtQmdDLElBQUssS0FBS0YsQ0FBTCxHQUFPLENBQVIsR0FBVzlCLElBQUUsQ0FBYixHQUFlLENBQXRDO0FBQ0EsUUFBRyxLQUFLaUMsQ0FBTCxHQUFTLENBQVosRUFDRSxJQUFHbUIsS0FBSyxDQUFSLEVBQVdwQixJQUFJLEtBQUssQ0FBTCxJQUFRaEMsQ0FBWixDQUFYLEtBQ0ssS0FBSSxJQUFJSixJQUFJLEtBQUtxQyxDQUFMLEdBQU8sQ0FBbkIsRUFBc0JyQyxLQUFLLENBQTNCLEVBQThCLEVBQUVBLENBQWhDLEVBQW1Db0MsSUFBSSxDQUFDb0IsSUFBRXBCLENBQUYsR0FBSSxLQUFLcEMsQ0FBTCxDQUFMLElBQWNJLENBQWxCO0FBQzFDLFdBQU9nQyxDQUFQO0FBQ0QsR0FwbUN5QixDQXNtQzFCOzs7QUFDQSxXQUFTOEwsWUFBVCxDQUFzQnJOLENBQXRCLEVBQXlCO0FBQ3ZCLFFBQUlzTixLQUFLdE4sRUFBRTBILE1BQUYsRUFBVDtBQUNBLFFBQUksS0FBS0EsTUFBTCxNQUFpQjRGLEVBQWxCLElBQXlCdE4sRUFBRXVJLE1BQUYsTUFBYyxDQUExQyxFQUE2QyxPQUFPL0osV0FBVzJELElBQWxCO0FBQzdDLFFBQUlvTCxJQUFJdk4sRUFBRWtOLEtBQUYsRUFBUjtBQUFBLFFBQW1CMU4sSUFBSSxLQUFLME4sS0FBTCxFQUF2QjtBQUNBLFFBQUl0TyxJQUFJOEMsSUFBSSxDQUFKLENBQVI7QUFBQSxRQUFnQjdDLElBQUk2QyxJQUFJLENBQUosQ0FBcEI7QUFBQSxRQUE0QjVDLElBQUk0QyxJQUFJLENBQUosQ0FBaEM7QUFBQSxRQUF3Q2lCLElBQUlqQixJQUFJLENBQUosQ0FBNUM7O0FBQ0EsV0FBTTZMLEVBQUVoRixNQUFGLE1BQWMsQ0FBcEIsRUFBdUI7QUFDckIsYUFBTWdGLEVBQUU3RixNQUFGLEVBQU4sRUFBa0I7QUFDaEI2RixVQUFFbEksUUFBRixDQUFXLENBQVgsRUFBYWtJLENBQWI7O0FBQ0EsWUFBR0QsRUFBSCxFQUFPO0FBQ0wsY0FBRyxDQUFDMU8sRUFBRThJLE1BQUYsRUFBRCxJQUFlLENBQUM3SSxFQUFFNkksTUFBRixFQUFuQixFQUErQjtBQUFFOUksY0FBRXVNLEtBQUYsQ0FBUSxJQUFSLEVBQWF2TSxDQUFiO0FBQWlCQyxjQUFFdUQsS0FBRixDQUFRcEMsQ0FBUixFQUFVbkIsQ0FBVjtBQUFlOztBQUNqRUQsWUFBRXlHLFFBQUYsQ0FBVyxDQUFYLEVBQWF6RyxDQUFiO0FBQ0QsU0FIRCxNQUlLLElBQUcsQ0FBQ0MsRUFBRTZJLE1BQUYsRUFBSixFQUFnQjdJLEVBQUV1RCxLQUFGLENBQVFwQyxDQUFSLEVBQVVuQixDQUFWOztBQUNyQkEsVUFBRXdHLFFBQUYsQ0FBVyxDQUFYLEVBQWF4RyxDQUFiO0FBQ0Q7O0FBQ0QsYUFBTVcsRUFBRWtJLE1BQUYsRUFBTixFQUFrQjtBQUNoQmxJLFVBQUU2RixRQUFGLENBQVcsQ0FBWCxFQUFhN0YsQ0FBYjs7QUFDQSxZQUFHOE4sRUFBSCxFQUFPO0FBQ0wsY0FBRyxDQUFDeE8sRUFBRTRJLE1BQUYsRUFBRCxJQUFlLENBQUMvRSxFQUFFK0UsTUFBRixFQUFuQixFQUErQjtBQUFFNUksY0FBRXFNLEtBQUYsQ0FBUSxJQUFSLEVBQWFyTSxDQUFiO0FBQWlCNkQsY0FBRVAsS0FBRixDQUFRcEMsQ0FBUixFQUFVMkMsQ0FBVjtBQUFlOztBQUNqRTdELFlBQUV1RyxRQUFGLENBQVcsQ0FBWCxFQUFhdkcsQ0FBYjtBQUNELFNBSEQsTUFJSyxJQUFHLENBQUM2RCxFQUFFK0UsTUFBRixFQUFKLEVBQWdCL0UsRUFBRVAsS0FBRixDQUFRcEMsQ0FBUixFQUFVMkMsQ0FBVjs7QUFDckJBLFVBQUUwQyxRQUFGLENBQVcsQ0FBWCxFQUFhMUMsQ0FBYjtBQUNEOztBQUNELFVBQUc0SyxFQUFFdEksU0FBRixDQUFZekYsQ0FBWixLQUFrQixDQUFyQixFQUF3QjtBQUN0QitOLFVBQUVuTCxLQUFGLENBQVE1QyxDQUFSLEVBQVUrTixDQUFWO0FBQ0EsWUFBR0QsRUFBSCxFQUFPMU8sRUFBRXdELEtBQUYsQ0FBUXRELENBQVIsRUFBVUYsQ0FBVjtBQUNQQyxVQUFFdUQsS0FBRixDQUFRTyxDQUFSLEVBQVU5RCxDQUFWO0FBQ0QsT0FKRCxNQUtLO0FBQ0hXLFVBQUU0QyxLQUFGLENBQVFtTCxDQUFSLEVBQVUvTixDQUFWO0FBQ0EsWUFBRzhOLEVBQUgsRUFBT3hPLEVBQUVzRCxLQUFGLENBQVF4RCxDQUFSLEVBQVVFLENBQVY7QUFDUDZELFVBQUVQLEtBQUYsQ0FBUXZELENBQVIsRUFBVThELENBQVY7QUFDRDtBQUNGOztBQUNELFFBQUduRCxFQUFFeUYsU0FBRixDQUFZekcsV0FBVzBHLEdBQXZCLEtBQStCLENBQWxDLEVBQXFDLE9BQU8xRyxXQUFXMkQsSUFBbEI7QUFDckMsUUFBR1EsRUFBRXNDLFNBQUYsQ0FBWWpGLENBQVosS0FBa0IsQ0FBckIsRUFBd0IsT0FBTzJDLEVBQUU2SyxRQUFGLENBQVd4TixDQUFYLENBQVA7QUFDeEIsUUFBRzJDLEVBQUU0RixNQUFGLEtBQWEsQ0FBaEIsRUFBbUI1RixFQUFFd0ksS0FBRixDQUFRbkwsQ0FBUixFQUFVMkMsQ0FBVixFQUFuQixLQUFzQyxPQUFPQSxDQUFQO0FBQ3RDLFFBQUdBLEVBQUU0RixNQUFGLEtBQWEsQ0FBaEIsRUFBbUIsT0FBTzVGLEVBQUU4SyxHQUFGLENBQU16TixDQUFOLENBQVAsQ0FBbkIsS0FBeUMsT0FBTzJDLENBQVA7QUFDMUM7O0FBRUQsTUFBSStLLFlBQVksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsRUFBVCxFQUFZLEVBQVosRUFBZSxFQUFmLEVBQWtCLEVBQWxCLEVBQXFCLEVBQXJCLEVBQXdCLEVBQXhCLEVBQTJCLEVBQTNCLEVBQThCLEVBQTlCLEVBQWlDLEVBQWpDLEVBQW9DLEVBQXBDLEVBQXVDLEVBQXZDLEVBQTBDLEVBQTFDLEVBQTZDLEVBQTdDLEVBQWdELEVBQWhELEVBQW1ELEVBQW5ELEVBQXNELEVBQXRELEVBQXlELEVBQXpELEVBQTRELEVBQTVELEVBQStELEVBQS9ELEVBQWtFLEVBQWxFLEVBQXFFLEVBQXJFLEVBQXdFLEdBQXhFLEVBQTRFLEdBQTVFLEVBQWdGLEdBQWhGLEVBQW9GLEdBQXBGLEVBQXdGLEdBQXhGLEVBQTRGLEdBQTVGLEVBQWdHLEdBQWhHLEVBQW9HLEdBQXBHLEVBQXdHLEdBQXhHLEVBQTRHLEdBQTVHLEVBQWdILEdBQWhILEVBQW9ILEdBQXBILEVBQXdILEdBQXhILEVBQTRILEdBQTVILEVBQWdJLEdBQWhJLEVBQW9JLEdBQXBJLEVBQXdJLEdBQXhJLEVBQTRJLEdBQTVJLEVBQWdKLEdBQWhKLEVBQW9KLEdBQXBKLEVBQXdKLEdBQXhKLEVBQTRKLEdBQTVKLEVBQWdLLEdBQWhLLEVBQW9LLEdBQXBLLEVBQXdLLEdBQXhLLEVBQTRLLEdBQTVLLEVBQWdMLEdBQWhMLEVBQW9MLEdBQXBMLEVBQXdMLEdBQXhMLEVBQTRMLEdBQTVMLEVBQWdNLEdBQWhNLEVBQW9NLEdBQXBNLEVBQXdNLEdBQXhNLEVBQTRNLEdBQTVNLEVBQWdOLEdBQWhOLEVBQW9OLEdBQXBOLEVBQXdOLEdBQXhOLEVBQTROLEdBQTVOLEVBQWdPLEdBQWhPLEVBQW9PLEdBQXBPLEVBQXdPLEdBQXhPLEVBQTRPLEdBQTVPLEVBQWdQLEdBQWhQLEVBQW9QLEdBQXBQLEVBQXdQLEdBQXhQLEVBQTRQLEdBQTVQLEVBQWdRLEdBQWhRLEVBQW9RLEdBQXBRLEVBQXdRLEdBQXhRLEVBQTRRLEdBQTVRLEVBQWdSLEdBQWhSLEVBQW9SLEdBQXBSLEVBQXdSLEdBQXhSLEVBQTRSLEdBQTVSLEVBQWdTLEdBQWhTLEVBQW9TLEdBQXBTLEVBQXdTLEdBQXhTLEVBQTRTLEdBQTVTLEVBQWdULEdBQWhULEVBQW9ULEdBQXBULEVBQXdULEdBQXhULEVBQTRULEdBQTVULEVBQWdVLEdBQWhVLEVBQW9VLEdBQXBVLEVBQXdVLEdBQXhVLEVBQTRVLEdBQTVVLEVBQWdWLEdBQWhWLEVBQW9WLEdBQXBWLEVBQXdWLEdBQXhWLEVBQTRWLEdBQTVWLEVBQWdXLEdBQWhXLEVBQW9XLEdBQXBXLENBQWhCO0FBQ0EsTUFBSUMsUUFBUSxDQUFDLEtBQUcsRUFBSixJQUFRRCxVQUFVQSxVQUFVM0wsTUFBVixHQUFpQixDQUEzQixDQUFwQixDQWpwQzBCLENBbXBDMUI7O0FBQ0EsV0FBUzZMLGlCQUFULENBQTJCcE0sQ0FBM0IsRUFBOEI7QUFDNUIsUUFBSXJDLENBQUo7QUFBQSxRQUFPQyxJQUFJLEtBQUswRSxHQUFMLEVBQVg7O0FBQ0EsUUFBRzFFLEVBQUVvQyxDQUFGLElBQU8sQ0FBUCxJQUFZcEMsRUFBRSxDQUFGLEtBQVFzTyxVQUFVQSxVQUFVM0wsTUFBVixHQUFpQixDQUEzQixDQUF2QixFQUFzRDtBQUNwRCxXQUFJNUMsSUFBSSxDQUFSLEVBQVdBLElBQUl1TyxVQUFVM0wsTUFBekIsRUFBaUMsRUFBRTVDLENBQW5DLEVBQ0UsSUFBR0MsRUFBRSxDQUFGLEtBQVFzTyxVQUFVdk8sQ0FBVixDQUFYLEVBQXlCLE9BQU8sSUFBUDs7QUFDM0IsYUFBTyxLQUFQO0FBQ0Q7O0FBQ0QsUUFBR0MsRUFBRXNJLE1BQUYsRUFBSCxFQUFlLE9BQU8sS0FBUDtBQUNmdkksUUFBSSxDQUFKOztBQUNBLFdBQU1BLElBQUl1TyxVQUFVM0wsTUFBcEIsRUFBNEI7QUFDMUIsVUFBSS9CLElBQUkwTixVQUFVdk8sQ0FBVixDQUFSO0FBQUEsVUFBc0JHLElBQUlILElBQUUsQ0FBNUI7O0FBQ0EsYUFBTUcsSUFBSW9PLFVBQVUzTCxNQUFkLElBQXdCL0IsSUFBSTJOLEtBQWxDLEVBQXlDM04sS0FBSzBOLFVBQVVwTyxHQUFWLENBQUw7O0FBQ3pDVSxVQUFJWixFQUFFeU8sTUFBRixDQUFTN04sQ0FBVCxDQUFKOztBQUNBLGFBQU1iLElBQUlHLENBQVYsRUFBYSxJQUFHVSxJQUFFME4sVUFBVXZPLEdBQVYsQ0FBRixJQUFvQixDQUF2QixFQUEwQixPQUFPLEtBQVA7QUFDeEM7O0FBQ0QsV0FBT0MsRUFBRTBPLFdBQUYsQ0FBY3RNLENBQWQsQ0FBUDtBQUNELEdBcHFDeUIsQ0FzcUMxQjs7O0FBQ0EsV0FBU3VNLGNBQVQsQ0FBd0J2TSxDQUF4QixFQUEyQjtBQUN6QixRQUFJd00sS0FBSyxLQUFLUixRQUFMLENBQWNoUCxXQUFXMEcsR0FBekIsQ0FBVDtBQUNBLFFBQUlyRCxJQUFJbU0sR0FBR2IsZUFBSCxFQUFSO0FBQ0EsUUFBR3RMLEtBQUssQ0FBUixFQUFXLE9BQU8sS0FBUDtBQUNYLFFBQUlOLElBQUl5TSxHQUFHQyxVQUFILENBQWNwTSxDQUFkLENBQVI7QUFDQUwsUUFBS0EsSUFBRSxDQUFILElBQU8sQ0FBWDtBQUNBLFFBQUdBLElBQUlrTSxVQUFVM0wsTUFBakIsRUFBeUJQLElBQUlrTSxVQUFVM0wsTUFBZDtBQUN6QixRQUFJbkQsSUFBSUssS0FBUjs7QUFDQSxTQUFJLElBQUlFLElBQUksQ0FBWixFQUFlQSxJQUFJcUMsQ0FBbkIsRUFBc0IsRUFBRXJDLENBQXhCLEVBQTJCO0FBQ3pCUCxRQUFFK0MsT0FBRixDQUFVK0wsVUFBVXZPLENBQVYsQ0FBVjtBQUNBLFVBQUk0RSxJQUFJbkYsRUFBRXNQLE1BQUYsQ0FBUzNNLENBQVQsRUFBVyxJQUFYLENBQVI7O0FBQ0EsVUFBR3dDLEVBQUVrQixTQUFGLENBQVl6RyxXQUFXMEcsR0FBdkIsS0FBK0IsQ0FBL0IsSUFBb0NuQixFQUFFa0IsU0FBRixDQUFZK0ksRUFBWixLQUFtQixDQUExRCxFQUE2RDtBQUMzRCxZQUFJMU8sSUFBSSxDQUFSOztBQUNBLGVBQU1BLE1BQU11QyxDQUFOLElBQVdrQyxFQUFFa0IsU0FBRixDQUFZK0ksRUFBWixLQUFtQixDQUFwQyxFQUF1QztBQUNyQ2pLLGNBQUlBLEVBQUU4RCxTQUFGLENBQVksQ0FBWixFQUFjLElBQWQsQ0FBSjtBQUNBLGNBQUc5RCxFQUFFa0IsU0FBRixDQUFZekcsV0FBVzBHLEdBQXZCLEtBQStCLENBQWxDLEVBQXFDLE9BQU8sS0FBUDtBQUN0Qzs7QUFDRCxZQUFHbkIsRUFBRWtCLFNBQUYsQ0FBWStJLEVBQVosS0FBbUIsQ0FBdEIsRUFBeUIsT0FBTyxLQUFQO0FBQzFCO0FBQ0Y7O0FBQ0QsV0FBTyxJQUFQO0FBQ0QsR0E1ckN5QixDQThyQzFCOzs7QUFDQXhQLGFBQVcwQixTQUFYLENBQXFCdUksU0FBckIsR0FBaUNQLFlBQWpDO0FBQ0ExSixhQUFXMEIsU0FBWCxDQUFxQnVDLE9BQXJCLEdBQStCNkYsVUFBL0I7QUFDQTlKLGFBQVcwQixTQUFYLENBQXFCNEIsU0FBckIsR0FBaUM4RyxZQUFqQztBQUNBcEssYUFBVzBCLFNBQVgsQ0FBcUJuQixVQUFyQixHQUFrQ2dLLGFBQWxDO0FBQ0F2SyxhQUFXMEIsU0FBWCxDQUFxQitJLFNBQXJCLEdBQWlDUyxZQUFqQztBQUNBbEwsYUFBVzBCLFNBQVgsQ0FBcUI0SyxTQUFyQixHQUFpQ0YsWUFBakM7QUFDQXBNLGFBQVcwQixTQUFYLENBQXFCaUwsS0FBckIsR0FBNkJGLFFBQTdCO0FBQ0F6TSxhQUFXMEIsU0FBWCxDQUFxQjJJLFNBQXJCLEdBQWlDNEMsWUFBakM7QUFDQWpOLGFBQVcwQixTQUFYLENBQXFCNEksVUFBckIsR0FBa0M0QyxhQUFsQztBQUNBbE4sYUFBVzBCLFNBQVgsQ0FBcUJ3TSxlQUFyQixHQUF1Q1Ysa0JBQXZDO0FBQ0F4TixhQUFXMEIsU0FBWCxDQUFxQnVNLGVBQXJCLEdBQXVDUixrQkFBdkM7QUFDQXpOLGFBQVcwQixTQUFYLENBQXFCMk4sTUFBckIsR0FBOEJULFNBQTlCO0FBQ0E1TyxhQUFXMEIsU0FBWCxDQUFxQjROLFdBQXJCLEdBQW1DQyxjQUFuQyxDQTNzQzBCLENBNnNDMUI7O0FBQ0F2UCxhQUFXMEIsU0FBWCxDQUFxQmdOLEtBQXJCLEdBQTZCcEYsT0FBN0I7QUFDQXRKLGFBQVcwQixTQUFYLENBQXFCd0ksUUFBckIsR0FBZ0NYLFVBQWhDO0FBQ0F2SixhQUFXMEIsU0FBWCxDQUFxQmlPLFNBQXJCLEdBQWlDbkcsV0FBakM7QUFDQXhKLGFBQVcwQixTQUFYLENBQXFCa08sVUFBckIsR0FBa0NuRyxZQUFsQztBQUNBekosYUFBVzBCLFNBQVgsQ0FBcUJxSSxNQUFyQixHQUE4QkYsUUFBOUI7QUFDQTdKLGFBQVcwQixTQUFYLENBQXFCbU8sV0FBckIsR0FBbUMvRSxhQUFuQztBQUNBOUssYUFBVzBCLFNBQVgsQ0FBcUJvTyxNQUFyQixHQUE4Qi9FLFFBQTlCO0FBQ0EvSyxhQUFXMEIsU0FBWCxDQUFxQjBELEdBQXJCLEdBQTJCNEYsS0FBM0I7QUFDQWhMLGFBQVcwQixTQUFYLENBQXFCa0QsR0FBckIsR0FBMkJxRyxLQUEzQjtBQUNBakwsYUFBVzBCLFNBQVgsQ0FBcUJxTyxHQUFyQixHQUEyQnpFLEtBQTNCO0FBQ0F0TCxhQUFXMEIsU0FBWCxDQUFxQnNPLEVBQXJCLEdBQTBCekUsSUFBMUI7QUFDQXZMLGFBQVcwQixTQUFYLENBQXFCdU8sR0FBckIsR0FBMkJ4RSxLQUEzQjtBQUNBekwsYUFBVzBCLFNBQVgsQ0FBcUJ3TyxNQUFyQixHQUE4QnZFLFFBQTlCO0FBQ0EzTCxhQUFXMEIsU0FBWCxDQUFxQnlPLEdBQXJCLEdBQTJCdkUsS0FBM0I7QUFDQTVMLGFBQVcwQixTQUFYLENBQXFCZ0osU0FBckIsR0FBaUNtQixXQUFqQztBQUNBN0wsYUFBVzBCLFNBQVgsQ0FBcUIrTixVQUFyQixHQUFrQzNELFlBQWxDO0FBQ0E5TCxhQUFXMEIsU0FBWCxDQUFxQmlOLGVBQXJCLEdBQXVDM0MsaUJBQXZDO0FBQ0FoTSxhQUFXMEIsU0FBWCxDQUFxQjBPLFFBQXJCLEdBQWdDbEUsVUFBaEM7QUFDQWxNLGFBQVcwQixTQUFYLENBQXFCOEksT0FBckIsR0FBK0IyQixTQUEvQjtBQUNBbk0sYUFBVzBCLFNBQVgsQ0FBcUIyTyxNQUFyQixHQUE4QmhFLFFBQTlCO0FBQ0FyTSxhQUFXMEIsU0FBWCxDQUFxQjRPLFFBQXJCLEdBQWdDL0QsVUFBaEM7QUFDQXZNLGFBQVcwQixTQUFYLENBQXFCNk8sT0FBckIsR0FBK0IvRCxTQUEvQjtBQUNBeE0sYUFBVzBCLFNBQVgsQ0FBcUJ1TixHQUFyQixHQUEyQnZDLEtBQTNCO0FBQ0ExTSxhQUFXMEIsU0FBWCxDQUFxQnNOLFFBQXJCLEdBQWdDcEMsVUFBaEM7QUFDQTVNLGFBQVcwQixTQUFYLENBQXFCOE8sUUFBckIsR0FBZ0MzRCxVQUFoQztBQUNBN00sYUFBVzBCLFNBQVgsQ0FBcUJtTSxNQUFyQixHQUE4QmYsUUFBOUI7QUFDQTlNLGFBQVcwQixTQUFYLENBQXFCK08sU0FBckIsR0FBaUMxRCxXQUFqQztBQUNBL00sYUFBVzBCLFNBQVgsQ0FBcUJnUCxrQkFBckIsR0FBMEMxRCxvQkFBMUM7QUFDQWhOLGFBQVcwQixTQUFYLENBQXFCZ08sTUFBckIsR0FBOEJyQixRQUE5QjtBQUNBck8sYUFBVzBCLFNBQVgsQ0FBcUJpUCxVQUFyQixHQUFrQzlCLFlBQWxDO0FBQ0E3TyxhQUFXMEIsU0FBWCxDQUFxQk8sR0FBckIsR0FBMkJzTCxLQUEzQjtBQUNBdk4sYUFBVzBCLFNBQVgsQ0FBcUJrUCxHQUFyQixHQUEyQm5DLEtBQTNCO0FBQ0F6TyxhQUFXMEIsU0FBWCxDQUFxQmtKLGVBQXJCLEdBQXVDd0UsaUJBQXZDLENBOXVDMEIsQ0FndkMxQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUNBLFNBQU9wUCxVQUFQO0FBQ0MsQ0EzdkNZLEVBQWIsQzs7Ozs7Ozs7Ozs7Ozs7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE2USxNQUFNLEVBQU47QUFFQTs7Ozs7Ozs7Ozs7O0FBV0FBLElBQUlDLGdCQUFKLEdBQXVCLFVBQVVDLFFBQVYsRUFBb0JDLE9BQXBCLEVBQTZCO0FBQ2xELE1BQUlDLFNBQVNDLGtCQUFrQkYsT0FBbEIsQ0FBYjtBQUVBLE1BQUlHLE9BQVFILFdBQVdBLFFBQVFHLElBQXBCLElBQTZCQyxPQUFPQyxNQUFQLEVBQXhDO0FBRUEsTUFBSUMsUUFBSjtBQUNBLE1BQUlDLDRCQUE0QlAsV0FBV0EsUUFBUU8seUJBQW5EOztBQUNBLE1BQUksQ0FBQ0EseUJBQUwsRUFBZ0M7QUFDOUJELGVBQVlOLFdBQVdBLFFBQVFNLFFBQXBCLElBQWlDRixPQUFPQyxNQUFQLEVBQTVDO0FBQ0FFLGdDQUE0Qk4sT0FBT08sSUFBUCxDQUFZRixXQUFXLEdBQVgsR0FBaUJQLFFBQTdCLENBQTVCO0FBQ0Q7O0FBRUQsTUFBSW5RLElBQUlxUSxPQUFPTyxJQUFQLENBQVlMLE9BQU9JLHlCQUFuQixDQUFSO0FBQ0EsTUFBSUUsS0FBSyxJQUFJelIsVUFBSixDQUFlWSxDQUFmLEVBQWtCLEVBQWxCLENBQVQ7QUFDQSxNQUFJSSxJQUFJaVEsT0FBT2pJLENBQVAsQ0FBUzBHLE1BQVQsQ0FBZ0IrQixFQUFoQixFQUFvQlIsT0FBT1MsQ0FBM0IsQ0FBUjtBQUVBLFNBQU87QUFDTEosY0FBVUEsUUFETDtBQUVMSCxVQUFNQSxJQUZEO0FBR0xRLGNBQVUzUSxFQUFFZ0QsUUFBRixDQUFXLEVBQVg7QUFITCxHQUFQO0FBS0QsQ0FyQkQsQyxDQXVCQTs7O0FBQ0E2TSxJQUFJZSxhQUFKLEdBQW9CO0FBQ2xCTixZQUFVTyxNQURRO0FBRWxCVixRQUFNVSxNQUZZO0FBR2xCRixZQUFVRTtBQUhRLENBQXBCO0FBT0E7Ozs7O0FBSUEsSUFBSUMsWUFBWTtBQUNkTixRQUFNLFVBQVU1USxDQUFWLEVBQWE7QUFBRSxXQUFPbVIsT0FBT25SLENBQVAsRUFBVW9SLFdBQVYsRUFBUDtBQUFpQyxHQUR4QztBQUVkTixLQUFHLElBQUkxUixVQUFKLENBQWUsa1FBQWYsRUFBbVIsRUFBblIsQ0FGVztBQUdkZ0osS0FBRyxJQUFJaEosVUFBSixDQUFlLEdBQWY7QUFIVyxDQUFoQjtBQUtBOFIsVUFBVXpPLENBQVYsR0FBYyxJQUFJckQsVUFBSixDQUNaOFIsVUFBVU4sSUFBVixDQUNFTSxVQUFVSixDQUFWLENBQVkxTixRQUFaLENBQXFCLEVBQXJCLElBQ0U4TixVQUFVOUksQ0FBVixDQUFZaEYsUUFBWixDQUFxQixFQUFyQixDQUZKLENBRFksRUFJWixFQUpZLENBQWQ7QUFNQTs7Ozs7Ozs7OztBQVNBLElBQUlrTixvQkFBb0IsVUFBVUYsT0FBVixFQUFtQjtBQUN6QyxNQUFJLENBQUNBLE9BQUwsRUFBYztBQUNaLFdBQU9jLFNBQVA7QUFFRixNQUFJRyxzQ0FBV0gsU0FBWCxDQUFKO0FBRUEsR0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0JJLE9BQWhCLENBQXdCLFVBQVU5TixDQUFWLEVBQWE7QUFDbkMsUUFBSTRNLFFBQVE1TSxDQUFSLENBQUosRUFBZ0I7QUFDZCxVQUFJLE9BQU80TSxRQUFRNU0sQ0FBUixDQUFQLEtBQXNCLFFBQTFCLEVBQ0U2TixJQUFJN04sQ0FBSixJQUFTLElBQUlwRSxVQUFKLENBQWVnUixRQUFRNU0sQ0FBUixDQUFmLEVBQTJCLEVBQTNCLENBQVQsQ0FERixLQUVLLElBQUk0TSxRQUFRNU0sQ0FBUixhQUFzQnBFLFVBQTFCLEVBQ0hpUyxJQUFJN04sQ0FBSixJQUFTNE0sUUFBUTVNLENBQVIsQ0FBVCxDQURHLEtBR0gsTUFBTSxJQUFJK04sS0FBSixDQUFVLHdCQUF3Qi9OLENBQWxDLENBQU47QUFDSDtBQUNGLEdBVEQ7QUFXQSxNQUFJNE0sUUFBUVEsSUFBWixFQUNFUyxJQUFJVCxJQUFKLEdBQVcsVUFBVTVRLENBQVYsRUFBYTtBQUFFLFdBQU9vUSxRQUFRUSxJQUFSLENBQWE1USxDQUFiLEVBQWdCb1IsV0FBaEIsRUFBUDtBQUF1QyxHQUFqRTs7QUFFRixNQUFJLENBQUNoQixRQUFRM04sQ0FBVCxLQUFlMk4sUUFBUVUsQ0FBUixJQUFhVixRQUFRaEksQ0FBckIsSUFBMEJnSSxRQUFRUSxJQUFqRCxDQUFKLEVBQTREO0FBQzFEUyxRQUFJNU8sQ0FBSixHQUFRNE8sSUFBSVQsSUFBSixDQUFTUyxJQUFJUCxDQUFKLENBQU0xTixRQUFOLENBQWUsRUFBZixJQUFxQmlPLElBQUlqSixDQUFKLENBQU1oRixRQUFOLENBQWUsRUFBZixDQUE5QixDQUFSO0FBQ0Q7O0FBRUQsU0FBT2lPLEdBQVA7QUFDRCxDQXpCRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zcnAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gTUVURU9SIFdSQVBQRVJcbkJpZ0ludGVnZXIgPSAoZnVuY3Rpb24gKCkge1xuXG5cbi8vLyBCRUdJTiBqc2JuLmpzXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDMtMjAwNSAgVG9tIFd1XG4gKiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuICogYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4gKiBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbiAqIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbiAqIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG4gKiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbiAqIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTLUlTXCIgQU5EIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIFxuICogRVhQUkVTUywgSU1QTElFRCBPUiBPVEhFUldJU0UsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04sIEFOWSBcbiAqIFdBUlJBTlRZIE9GIE1FUkNIQU5UQUJJTElUWSBPUiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFxuICpcbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRPTSBXVSBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBJTkNJREVOVEFMLFxuICogSU5ESVJFQ1QgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9GIEFOWSBLSU5ELCBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSXG4gKiBSRVNVTFRJTkcgRlJPTSBMT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIE9SIE5PVCBBRFZJU0VEIE9GXG4gKiBUSEUgUE9TU0lCSUxJVFkgT0YgREFNQUdFLCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIEFSSVNJTkcgT1VUXG4gKiBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUiBQRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxuICpcbiAqIEluIGFkZGl0aW9uLCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbiBhcHBsaWVzOlxuICpcbiAqIEFsbCByZWRpc3RyaWJ1dGlvbnMgbXVzdCByZXRhaW4gYW4gaW50YWN0IGNvcHkgb2YgdGhpcyBjb3B5cmlnaHQgbm90aWNlXG4gKiBhbmQgZGlzY2xhaW1lci5cbiAqL1xuXG4vLyBCYXNpYyBKYXZhU2NyaXB0IEJOIGxpYnJhcnkgLSBzdWJzZXQgdXNlZnVsIGZvciBSU0EgZW5jcnlwdGlvbi5cblxuLy8gQml0cyBwZXIgZGlnaXRcbnZhciBkYml0cztcblxuLy8gSmF2YVNjcmlwdCBlbmdpbmUgYW5hbHlzaXNcbnZhciBjYW5hcnkgPSAweGRlYWRiZWVmY2FmZTtcbnZhciBqX2xtID0gKChjYW5hcnkmMHhmZmZmZmYpPT0weGVmY2FmZSk7XG5cbi8vIChwdWJsaWMpIENvbnN0cnVjdG9yXG5mdW5jdGlvbiBCaWdJbnRlZ2VyKGEsYixjKSB7XG4gIGlmKGEgIT0gbnVsbClcbiAgICBpZihcIm51bWJlclwiID09IHR5cGVvZiBhKSB0aGlzLmZyb21OdW1iZXIoYSxiLGMpO1xuICAgIGVsc2UgaWYoYiA9PSBudWxsICYmIFwic3RyaW5nXCIgIT0gdHlwZW9mIGEpIHRoaXMuZnJvbVN0cmluZyhhLDI1Nik7XG4gICAgZWxzZSB0aGlzLmZyb21TdHJpbmcoYSxiKTtcbn1cblxuLy8gcmV0dXJuIG5ldywgdW5zZXQgQmlnSW50ZWdlclxuZnVuY3Rpb24gbmJpKCkgeyByZXR1cm4gbmV3IEJpZ0ludGVnZXIobnVsbCk7IH1cblxuLy8gYW06IENvbXB1dGUgd19qICs9ICh4KnRoaXNfaSksIHByb3BhZ2F0ZSBjYXJyaWVzLFxuLy8gYyBpcyBpbml0aWFsIGNhcnJ5LCByZXR1cm5zIGZpbmFsIGNhcnJ5LlxuLy8gYyA8IDMqZHZhbHVlLCB4IDwgMipkdmFsdWUsIHRoaXNfaSA8IGR2YWx1ZVxuLy8gV2UgbmVlZCB0byBzZWxlY3QgdGhlIGZhc3Rlc3Qgb25lIHRoYXQgd29ya3MgaW4gdGhpcyBlbnZpcm9ubWVudC5cblxuLy8gYW0xOiB1c2UgYSBzaW5nbGUgbXVsdCBhbmQgZGl2aWRlIHRvIGdldCB0aGUgaGlnaCBiaXRzLFxuLy8gbWF4IGRpZ2l0IGJpdHMgc2hvdWxkIGJlIDI2IGJlY2F1c2Vcbi8vIG1heCBpbnRlcm5hbCB2YWx1ZSA9IDIqZHZhbHVlXjItMipkdmFsdWUgKDwgMl41MylcbmZ1bmN0aW9uIGFtMShpLHgsdyxqLGMsbikge1xuICB3aGlsZSgtLW4gPj0gMCkge1xuICAgIHZhciB2ID0geCp0aGlzW2krK10rd1tqXStjO1xuICAgIGMgPSBNYXRoLmZsb29yKHYvMHg0MDAwMDAwKTtcbiAgICB3W2orK10gPSB2JjB4M2ZmZmZmZjtcbiAgfVxuICByZXR1cm4gYztcbn1cbi8vIGFtMiBhdm9pZHMgYSBiaWcgbXVsdC1hbmQtZXh0cmFjdCBjb21wbGV0ZWx5LlxuLy8gTWF4IGRpZ2l0IGJpdHMgc2hvdWxkIGJlIDw9IDMwIGJlY2F1c2Ugd2UgZG8gYml0d2lzZSBvcHNcbi8vIG9uIHZhbHVlcyB1cCB0byAyKmhkdmFsdWVeMi1oZHZhbHVlLTEgKDwgMl4zMSlcbmZ1bmN0aW9uIGFtMihpLHgsdyxqLGMsbikge1xuICB2YXIgeGwgPSB4JjB4N2ZmZiwgeGggPSB4Pj4xNTtcbiAgd2hpbGUoLS1uID49IDApIHtcbiAgICB2YXIgbCA9IHRoaXNbaV0mMHg3ZmZmO1xuICAgIHZhciBoID0gdGhpc1tpKytdPj4xNTtcbiAgICB2YXIgbSA9IHhoKmwraCp4bDtcbiAgICBsID0geGwqbCsoKG0mMHg3ZmZmKTw8MTUpK3dbal0rKGMmMHgzZmZmZmZmZik7XG4gICAgYyA9IChsPj4+MzApKyhtPj4+MTUpK3hoKmgrKGM+Pj4zMCk7XG4gICAgd1tqKytdID0gbCYweDNmZmZmZmZmO1xuICB9XG4gIHJldHVybiBjO1xufVxuLy8gQWx0ZXJuYXRlbHksIHNldCBtYXggZGlnaXQgYml0cyB0byAyOCBzaW5jZSBzb21lXG4vLyBicm93c2VycyBzbG93IGRvd24gd2hlbiBkZWFsaW5nIHdpdGggMzItYml0IG51bWJlcnMuXG5mdW5jdGlvbiBhbTMoaSx4LHcsaixjLG4pIHtcbiAgdmFyIHhsID0geCYweDNmZmYsIHhoID0geD4+MTQ7XG4gIHdoaWxlKC0tbiA+PSAwKSB7XG4gICAgdmFyIGwgPSB0aGlzW2ldJjB4M2ZmZjtcbiAgICB2YXIgaCA9IHRoaXNbaSsrXT4+MTQ7XG4gICAgdmFyIG0gPSB4aCpsK2gqeGw7XG4gICAgbCA9IHhsKmwrKChtJjB4M2ZmZik8PDE0KSt3W2pdK2M7XG4gICAgYyA9IChsPj4yOCkrKG0+PjE0KSt4aCpoO1xuICAgIHdbaisrXSA9IGwmMHhmZmZmZmZmO1xuICB9XG4gIHJldHVybiBjO1xufVxuXG4vKiBYWFggTUVURU9SIFhYWFxuaWYoal9sbSAmJiAobmF2aWdhdG9yLmFwcE5hbWUgPT0gXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIikpIHtcbiAgQmlnSW50ZWdlci5wcm90b3R5cGUuYW0gPSBhbTI7XG4gIGRiaXRzID0gMzA7XG59XG5lbHNlIGlmKGpfbG0gJiYgKG5hdmlnYXRvci5hcHBOYW1lICE9IFwiTmV0c2NhcGVcIikpIHtcbiAgQmlnSW50ZWdlci5wcm90b3R5cGUuYW0gPSBhbTE7XG4gIGRiaXRzID0gMjY7XG59XG5lbHNlIFxuKi9cblxueyAvLyBNb3ppbGxhL05ldHNjYXBlIHNlZW1zIHRvIHByZWZlciBhbTNcbiAgQmlnSW50ZWdlci5wcm90b3R5cGUuYW0gPSBhbTM7XG4gIGRiaXRzID0gMjg7XG59XG5cbkJpZ0ludGVnZXIucHJvdG90eXBlLkRCID0gZGJpdHM7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5ETSA9ICgoMTw8ZGJpdHMpLTEpO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRFYgPSAoMTw8ZGJpdHMpO1xuXG52YXIgQklfRlAgPSA1MjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLkZWID0gTWF0aC5wb3coMixCSV9GUCk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5GMSA9IEJJX0ZQLWRiaXRzO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRjIgPSAyKmRiaXRzLUJJX0ZQO1xuXG4vLyBEaWdpdCBjb252ZXJzaW9uc1xudmFyIEJJX1JNID0gXCIwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcbnZhciBCSV9SQyA9IG5ldyBBcnJheSgpO1xudmFyIHJyLHZ2O1xucnIgPSBcIjBcIi5jaGFyQ29kZUF0KDApO1xuZm9yKHZ2ID0gMDsgdnYgPD0gOTsgKyt2dikgQklfUkNbcnIrK10gPSB2djtcbnJyID0gXCJhXCIuY2hhckNvZGVBdCgwKTtcbmZvcih2diA9IDEwOyB2diA8IDM2OyArK3Z2KSBCSV9SQ1tycisrXSA9IHZ2O1xucnIgPSBcIkFcIi5jaGFyQ29kZUF0KDApO1xuZm9yKHZ2ID0gMTA7IHZ2IDwgMzY7ICsrdnYpIEJJX1JDW3JyKytdID0gdnY7XG5cbmZ1bmN0aW9uIGludDJjaGFyKG4pIHsgcmV0dXJuIEJJX1JNLmNoYXJBdChuKTsgfVxuZnVuY3Rpb24gaW50QXQocyxpKSB7XG4gIHZhciBjID0gQklfUkNbcy5jaGFyQ29kZUF0KGkpXTtcbiAgcmV0dXJuIChjPT1udWxsKT8tMTpjO1xufVxuXG4vLyAocHJvdGVjdGVkKSBjb3B5IHRoaXMgdG8gclxuZnVuY3Rpb24gYm5wQ29weVRvKHIpIHtcbiAgZm9yKHZhciBpID0gdGhpcy50LTE7IGkgPj0gMDsgLS1pKSByW2ldID0gdGhpc1tpXTtcbiAgci50ID0gdGhpcy50O1xuICByLnMgPSB0aGlzLnM7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHNldCBmcm9tIGludGVnZXIgdmFsdWUgeCwgLURWIDw9IHggPCBEVlxuZnVuY3Rpb24gYm5wRnJvbUludCh4KSB7XG4gIHRoaXMudCA9IDE7XG4gIHRoaXMucyA9ICh4PDApPy0xOjA7XG4gIGlmKHggPiAwKSB0aGlzWzBdID0geDtcbiAgZWxzZSBpZih4IDwgLTEpIHRoaXNbMF0gPSB4K0RWO1xuICBlbHNlIHRoaXMudCA9IDA7XG59XG5cbi8vIHJldHVybiBiaWdpbnQgaW5pdGlhbGl6ZWQgdG8gdmFsdWVcbmZ1bmN0aW9uIG5idihpKSB7IHZhciByID0gbmJpKCk7IHIuZnJvbUludChpKTsgcmV0dXJuIHI7IH1cblxuLy8gKHByb3RlY3RlZCkgc2V0IGZyb20gc3RyaW5nIGFuZCByYWRpeFxuZnVuY3Rpb24gYm5wRnJvbVN0cmluZyhzLGIpIHtcbiAgdmFyIGs7XG4gIGlmKGIgPT0gMTYpIGsgPSA0O1xuICBlbHNlIGlmKGIgPT0gOCkgayA9IDM7XG4gIGVsc2UgaWYoYiA9PSAyNTYpIGsgPSA4OyAvLyBieXRlIGFycmF5XG4gIGVsc2UgaWYoYiA9PSAyKSBrID0gMTtcbiAgZWxzZSBpZihiID09IDMyKSBrID0gNTtcbiAgZWxzZSBpZihiID09IDQpIGsgPSAyO1xuICBlbHNlIHsgdGhpcy5mcm9tUmFkaXgocyxiKTsgcmV0dXJuOyB9XG4gIHRoaXMudCA9IDA7XG4gIHRoaXMucyA9IDA7XG4gIHZhciBpID0gcy5sZW5ndGgsIG1pID0gZmFsc2UsIHNoID0gMDtcbiAgd2hpbGUoLS1pID49IDApIHtcbiAgICB2YXIgeCA9IChrPT04KT9zW2ldJjB4ZmY6aW50QXQocyxpKTtcbiAgICBpZih4IDwgMCkge1xuICAgICAgaWYocy5jaGFyQXQoaSkgPT0gXCItXCIpIG1pID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBtaSA9IGZhbHNlO1xuICAgIGlmKHNoID09IDApXG4gICAgICB0aGlzW3RoaXMudCsrXSA9IHg7XG4gICAgZWxzZSBpZihzaCtrID4gdGhpcy5EQikge1xuICAgICAgdGhpc1t0aGlzLnQtMV0gfD0gKHgmKCgxPDwodGhpcy5EQi1zaCkpLTEpKTw8c2g7XG4gICAgICB0aGlzW3RoaXMudCsrXSA9ICh4Pj4odGhpcy5EQi1zaCkpO1xuICAgIH1cbiAgICBlbHNlXG4gICAgICB0aGlzW3RoaXMudC0xXSB8PSB4PDxzaDtcbiAgICBzaCArPSBrO1xuICAgIGlmKHNoID49IHRoaXMuREIpIHNoIC09IHRoaXMuREI7XG4gIH1cbiAgaWYoayA9PSA4ICYmIChzWzBdJjB4ODApICE9IDApIHtcbiAgICB0aGlzLnMgPSAtMTtcbiAgICBpZihzaCA+IDApIHRoaXNbdGhpcy50LTFdIHw9ICgoMTw8KHRoaXMuREItc2gpKS0xKTw8c2g7XG4gIH1cbiAgdGhpcy5jbGFtcCgpO1xuICBpZihtaSkgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMsdGhpcyk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGNsYW1wIG9mZiBleGNlc3MgaGlnaCB3b3Jkc1xuZnVuY3Rpb24gYm5wQ2xhbXAoKSB7XG4gIHZhciBjID0gdGhpcy5zJnRoaXMuRE07XG4gIHdoaWxlKHRoaXMudCA+IDAgJiYgdGhpc1t0aGlzLnQtMV0gPT0gYykgLS10aGlzLnQ7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW4gZ2l2ZW4gcmFkaXhcbmZ1bmN0aW9uIGJuVG9TdHJpbmcoYikge1xuICBpZih0aGlzLnMgPCAwKSByZXR1cm4gXCItXCIrdGhpcy5uZWdhdGUoKS50b1N0cmluZyhiKTtcbiAgdmFyIGs7XG4gIGlmKGIgPT0gMTYpIGsgPSA0O1xuICBlbHNlIGlmKGIgPT0gOCkgayA9IDM7XG4gIGVsc2UgaWYoYiA9PSAyKSBrID0gMTtcbiAgZWxzZSBpZihiID09IDMyKSBrID0gNTtcbiAgZWxzZSBpZihiID09IDQpIGsgPSAyO1xuICBlbHNlIHJldHVybiB0aGlzLnRvUmFkaXgoYik7XG4gIHZhciBrbSA9ICgxPDxrKS0xLCBkLCBtID0gZmFsc2UsIHIgPSBcIlwiLCBpID0gdGhpcy50O1xuICB2YXIgcCA9IHRoaXMuREItKGkqdGhpcy5EQiklaztcbiAgaWYoaS0tID4gMCkge1xuICAgIGlmKHAgPCB0aGlzLkRCICYmIChkID0gdGhpc1tpXT4+cCkgPiAwKSB7IG0gPSB0cnVlOyByID0gaW50MmNoYXIoZCk7IH1cbiAgICB3aGlsZShpID49IDApIHtcbiAgICAgIGlmKHAgPCBrKSB7XG4gICAgICAgIGQgPSAodGhpc1tpXSYoKDE8PHApLTEpKTw8KGstcCk7XG4gICAgICAgIGQgfD0gdGhpc1stLWldPj4ocCs9dGhpcy5EQi1rKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkID0gKHRoaXNbaV0+PihwLT1rKSkma207XG4gICAgICAgIGlmKHAgPD0gMCkgeyBwICs9IHRoaXMuREI7IC0taTsgfVxuICAgICAgfVxuICAgICAgaWYoZCA+IDApIG0gPSB0cnVlO1xuICAgICAgaWYobSkgciArPSBpbnQyY2hhcihkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG0/cjpcIjBcIjtcbn1cblxuLy8gKHB1YmxpYykgLXRoaXNcbmZ1bmN0aW9uIGJuTmVnYXRlKCkgeyB2YXIgciA9IG5iaSgpOyBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcyxyKTsgcmV0dXJuIHI7IH1cblxuLy8gKHB1YmxpYykgfHRoaXN8XG5mdW5jdGlvbiBibkFicygpIHsgcmV0dXJuICh0aGlzLnM8MCk/dGhpcy5uZWdhdGUoKTp0aGlzOyB9XG5cbi8vIChwdWJsaWMpIHJldHVybiArIGlmIHRoaXMgPiBhLCAtIGlmIHRoaXMgPCBhLCAwIGlmIGVxdWFsXG5mdW5jdGlvbiBibkNvbXBhcmVUbyhhKSB7XG4gIHZhciByID0gdGhpcy5zLWEucztcbiAgaWYociAhPSAwKSByZXR1cm4gcjtcbiAgdmFyIGkgPSB0aGlzLnQ7XG4gIHIgPSBpLWEudDtcbiAgaWYociAhPSAwKSByZXR1cm4gcjtcbiAgd2hpbGUoLS1pID49IDApIGlmKChyPXRoaXNbaV0tYVtpXSkgIT0gMCkgcmV0dXJuIHI7XG4gIHJldHVybiAwO1xufVxuXG4vLyByZXR1cm5zIGJpdCBsZW5ndGggb2YgdGhlIGludGVnZXIgeFxuZnVuY3Rpb24gbmJpdHMoeCkge1xuICB2YXIgciA9IDEsIHQ7XG4gIGlmKCh0PXg+Pj4xNikgIT0gMCkgeyB4ID0gdDsgciArPSAxNjsgfVxuICBpZigodD14Pj44KSAhPSAwKSB7IHggPSB0OyByICs9IDg7IH1cbiAgaWYoKHQ9eD4+NCkgIT0gMCkgeyB4ID0gdDsgciArPSA0OyB9XG4gIGlmKCh0PXg+PjIpICE9IDApIHsgeCA9IHQ7IHIgKz0gMjsgfVxuICBpZigodD14Pj4xKSAhPSAwKSB7IHggPSB0OyByICs9IDE7IH1cbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiB0aGUgbnVtYmVyIG9mIGJpdHMgaW4gXCJ0aGlzXCJcbmZ1bmN0aW9uIGJuQml0TGVuZ3RoKCkge1xuICBpZih0aGlzLnQgPD0gMCkgcmV0dXJuIDA7XG4gIHJldHVybiB0aGlzLkRCKih0aGlzLnQtMSkrbmJpdHModGhpc1t0aGlzLnQtMV1eKHRoaXMucyZ0aGlzLkRNKSk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzIDw8IG4qREJcbmZ1bmN0aW9uIGJucERMU2hpZnRUbyhuLHIpIHtcbiAgdmFyIGk7XG4gIGZvcihpID0gdGhpcy50LTE7IGkgPj0gMDsgLS1pKSByW2krbl0gPSB0aGlzW2ldO1xuICBmb3IoaSA9IG4tMTsgaSA+PSAwOyAtLWkpIHJbaV0gPSAwO1xuICByLnQgPSB0aGlzLnQrbjtcbiAgci5zID0gdGhpcy5zO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA+PiBuKkRCXG5mdW5jdGlvbiBibnBEUlNoaWZ0VG8obixyKSB7XG4gIGZvcih2YXIgaSA9IG47IGkgPCB0aGlzLnQ7ICsraSkgcltpLW5dID0gdGhpc1tpXTtcbiAgci50ID0gTWF0aC5tYXgodGhpcy50LW4sMCk7XG4gIHIucyA9IHRoaXMucztcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPDwgblxuZnVuY3Rpb24gYm5wTFNoaWZ0VG8obixyKSB7XG4gIHZhciBicyA9IG4ldGhpcy5EQjtcbiAgdmFyIGNicyA9IHRoaXMuREItYnM7XG4gIHZhciBibSA9ICgxPDxjYnMpLTE7XG4gIHZhciBkcyA9IE1hdGguZmxvb3Iobi90aGlzLkRCKSwgYyA9ICh0aGlzLnM8PGJzKSZ0aGlzLkRNLCBpO1xuICBmb3IoaSA9IHRoaXMudC0xOyBpID49IDA7IC0taSkge1xuICAgIHJbaStkcysxXSA9ICh0aGlzW2ldPj5jYnMpfGM7XG4gICAgYyA9ICh0aGlzW2ldJmJtKTw8YnM7XG4gIH1cbiAgZm9yKGkgPSBkcy0xOyBpID49IDA7IC0taSkgcltpXSA9IDA7XG4gIHJbZHNdID0gYztcbiAgci50ID0gdGhpcy50K2RzKzE7XG4gIHIucyA9IHRoaXMucztcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA+PiBuXG5mdW5jdGlvbiBibnBSU2hpZnRUbyhuLHIpIHtcbiAgci5zID0gdGhpcy5zO1xuICB2YXIgZHMgPSBNYXRoLmZsb29yKG4vdGhpcy5EQik7XG4gIGlmKGRzID49IHRoaXMudCkgeyByLnQgPSAwOyByZXR1cm47IH1cbiAgdmFyIGJzID0gbiV0aGlzLkRCO1xuICB2YXIgY2JzID0gdGhpcy5EQi1icztcbiAgdmFyIGJtID0gKDE8PGJzKS0xO1xuICByWzBdID0gdGhpc1tkc10+PmJzO1xuICBmb3IodmFyIGkgPSBkcysxOyBpIDwgdGhpcy50OyArK2kpIHtcbiAgICByW2ktZHMtMV0gfD0gKHRoaXNbaV0mYm0pPDxjYnM7XG4gICAgcltpLWRzXSA9IHRoaXNbaV0+PmJzO1xuICB9XG4gIGlmKGJzID4gMCkgclt0aGlzLnQtZHMtMV0gfD0gKHRoaXMucyZibSk8PGNicztcbiAgci50ID0gdGhpcy50LWRzO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzIC0gYVxuZnVuY3Rpb24gYm5wU3ViVG8oYSxyKSB7XG4gIHZhciBpID0gMCwgYyA9IDAsIG0gPSBNYXRoLm1pbihhLnQsdGhpcy50KTtcbiAgd2hpbGUoaSA8IG0pIHtcbiAgICBjICs9IHRoaXNbaV0tYVtpXTtcbiAgICByW2krK10gPSBjJnRoaXMuRE07XG4gICAgYyA+Pj0gdGhpcy5EQjtcbiAgfVxuICBpZihhLnQgPCB0aGlzLnQpIHtcbiAgICBjIC09IGEucztcbiAgICB3aGlsZShpIDwgdGhpcy50KSB7XG4gICAgICBjICs9IHRoaXNbaV07XG4gICAgICByW2krK10gPSBjJnRoaXMuRE07XG4gICAgICBjID4+PSB0aGlzLkRCO1xuICAgIH1cbiAgICBjICs9IHRoaXMucztcbiAgfVxuICBlbHNlIHtcbiAgICBjICs9IHRoaXMucztcbiAgICB3aGlsZShpIDwgYS50KSB7XG4gICAgICBjIC09IGFbaV07XG4gICAgICByW2krK10gPSBjJnRoaXMuRE07XG4gICAgICBjID4+PSB0aGlzLkRCO1xuICAgIH1cbiAgICBjIC09IGEucztcbiAgfVxuICByLnMgPSAoYzwwKT8tMTowO1xuICBpZihjIDwgLTEpIHJbaSsrXSA9IHRoaXMuRFYrYztcbiAgZWxzZSBpZihjID4gMCkgcltpKytdID0gYztcbiAgci50ID0gaTtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyAqIGEsIHIgIT0gdGhpcyxhIChIQUMgMTQuMTIpXG4vLyBcInRoaXNcIiBzaG91bGQgYmUgdGhlIGxhcmdlciBvbmUgaWYgYXBwcm9wcmlhdGUuXG5mdW5jdGlvbiBibnBNdWx0aXBseVRvKGEscikge1xuICB2YXIgeCA9IHRoaXMuYWJzKCksIHkgPSBhLmFicygpO1xuICB2YXIgaSA9IHgudDtcbiAgci50ID0gaSt5LnQ7XG4gIHdoaWxlKC0taSA+PSAwKSByW2ldID0gMDtcbiAgZm9yKGkgPSAwOyBpIDwgeS50OyArK2kpIHJbaSt4LnRdID0geC5hbSgwLHlbaV0scixpLDAseC50KTtcbiAgci5zID0gMDtcbiAgci5jbGFtcCgpO1xuICBpZih0aGlzLnMgIT0gYS5zKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8ocixyKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXNeMiwgciAhPSB0aGlzIChIQUMgMTQuMTYpXG5mdW5jdGlvbiBibnBTcXVhcmVUbyhyKSB7XG4gIHZhciB4ID0gdGhpcy5hYnMoKTtcbiAgdmFyIGkgPSByLnQgPSAyKngudDtcbiAgd2hpbGUoLS1pID49IDApIHJbaV0gPSAwO1xuICBmb3IoaSA9IDA7IGkgPCB4LnQtMTsgKytpKSB7XG4gICAgdmFyIGMgPSB4LmFtKGkseFtpXSxyLDIqaSwwLDEpO1xuICAgIGlmKChyW2kreC50XSs9eC5hbShpKzEsMip4W2ldLHIsMippKzEsYyx4LnQtaS0xKSkgPj0geC5EVikge1xuICAgICAgcltpK3gudF0gLT0geC5EVjtcbiAgICAgIHJbaSt4LnQrMV0gPSAxO1xuICAgIH1cbiAgfVxuICBpZihyLnQgPiAwKSByW3IudC0xXSArPSB4LmFtKGkseFtpXSxyLDIqaSwwLDEpO1xuICByLnMgPSAwO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGRpdmlkZSB0aGlzIGJ5IG0sIHF1b3RpZW50IGFuZCByZW1haW5kZXIgdG8gcSwgciAoSEFDIDE0LjIwKVxuLy8gciAhPSBxLCB0aGlzICE9IG0uICBxIG9yIHIgbWF5IGJlIG51bGwuXG5mdW5jdGlvbiBibnBEaXZSZW1UbyhtLHEscikge1xuICB2YXIgcG0gPSBtLmFicygpO1xuICBpZihwbS50IDw9IDApIHJldHVybjtcbiAgdmFyIHB0ID0gdGhpcy5hYnMoKTtcbiAgaWYocHQudCA8IHBtLnQpIHtcbiAgICBpZihxICE9IG51bGwpIHEuZnJvbUludCgwKTtcbiAgICBpZihyICE9IG51bGwpIHRoaXMuY29weVRvKHIpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZihyID09IG51bGwpIHIgPSBuYmkoKTtcbiAgdmFyIHkgPSBuYmkoKSwgdHMgPSB0aGlzLnMsIG1zID0gbS5zO1xuICB2YXIgbnNoID0gdGhpcy5EQi1uYml0cyhwbVtwbS50LTFdKTtcdC8vIG5vcm1hbGl6ZSBtb2R1bHVzXG4gIGlmKG5zaCA+IDApIHsgcG0ubFNoaWZ0VG8obnNoLHkpOyBwdC5sU2hpZnRUbyhuc2gscik7IH1cbiAgZWxzZSB7IHBtLmNvcHlUbyh5KTsgcHQuY29weVRvKHIpOyB9XG4gIHZhciB5cyA9IHkudDtcbiAgdmFyIHkwID0geVt5cy0xXTtcbiAgaWYoeTAgPT0gMCkgcmV0dXJuO1xuICB2YXIgeXQgPSB5MCooMTw8dGhpcy5GMSkrKCh5cz4xKT95W3lzLTJdPj50aGlzLkYyOjApO1xuICB2YXIgZDEgPSB0aGlzLkZWL3l0LCBkMiA9ICgxPDx0aGlzLkYxKS95dCwgZSA9IDE8PHRoaXMuRjI7XG4gIHZhciBpID0gci50LCBqID0gaS15cywgdCA9IChxPT1udWxsKT9uYmkoKTpxO1xuICB5LmRsU2hpZnRUbyhqLHQpO1xuICBpZihyLmNvbXBhcmVUbyh0KSA+PSAwKSB7XG4gICAgcltyLnQrK10gPSAxO1xuICAgIHIuc3ViVG8odCxyKTtcbiAgfVxuICBCaWdJbnRlZ2VyLk9ORS5kbFNoaWZ0VG8oeXMsdCk7XG4gIHQuc3ViVG8oeSx5KTtcdC8vIFwibmVnYXRpdmVcIiB5IHNvIHdlIGNhbiByZXBsYWNlIHN1YiB3aXRoIGFtIGxhdGVyXG4gIHdoaWxlKHkudCA8IHlzKSB5W3kudCsrXSA9IDA7XG4gIHdoaWxlKC0taiA+PSAwKSB7XG4gICAgLy8gRXN0aW1hdGUgcXVvdGllbnQgZGlnaXRcbiAgICB2YXIgcWQgPSAoclstLWldPT15MCk/dGhpcy5ETTpNYXRoLmZsb29yKHJbaV0qZDErKHJbaS0xXStlKSpkMik7XG4gICAgaWYoKHJbaV0rPXkuYW0oMCxxZCxyLGosMCx5cykpIDwgcWQpIHtcdC8vIFRyeSBpdCBvdXRcbiAgICAgIHkuZGxTaGlmdFRvKGosdCk7XG4gICAgICByLnN1YlRvKHQscik7XG4gICAgICB3aGlsZShyW2ldIDwgLS1xZCkgci5zdWJUbyh0LHIpO1xuICAgIH1cbiAgfVxuICBpZihxICE9IG51bGwpIHtcbiAgICByLmRyU2hpZnRUbyh5cyxxKTtcbiAgICBpZih0cyAhPSBtcykgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHEscSk7XG4gIH1cbiAgci50ID0geXM7XG4gIHIuY2xhbXAoKTtcbiAgaWYobnNoID4gMCkgci5yU2hpZnRUbyhuc2gscik7XHQvLyBEZW5vcm1hbGl6ZSByZW1haW5kZXJcbiAgaWYodHMgPCAwKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8ocixyKTtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyBtb2QgYVxuZnVuY3Rpb24gYm5Nb2QoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmFicygpLmRpdlJlbVRvKGEsbnVsbCxyKTtcbiAgaWYodGhpcy5zIDwgMCAmJiByLmNvbXBhcmVUbyhCaWdJbnRlZ2VyLlpFUk8pID4gMCkgYS5zdWJUbyhyLHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gTW9kdWxhciByZWR1Y3Rpb24gdXNpbmcgXCJjbGFzc2ljXCIgYWxnb3JpdGhtXG5mdW5jdGlvbiBDbGFzc2ljKG0pIHsgdGhpcy5tID0gbTsgfVxuZnVuY3Rpb24gY0NvbnZlcnQoeCkge1xuICBpZih4LnMgPCAwIHx8IHguY29tcGFyZVRvKHRoaXMubSkgPj0gMCkgcmV0dXJuIHgubW9kKHRoaXMubSk7XG4gIGVsc2UgcmV0dXJuIHg7XG59XG5mdW5jdGlvbiBjUmV2ZXJ0KHgpIHsgcmV0dXJuIHg7IH1cbmZ1bmN0aW9uIGNSZWR1Y2UoeCkgeyB4LmRpdlJlbVRvKHRoaXMubSxudWxsLHgpOyB9XG5mdW5jdGlvbiBjTXVsVG8oeCx5LHIpIHsgeC5tdWx0aXBseVRvKHkscik7IHRoaXMucmVkdWNlKHIpOyB9XG5mdW5jdGlvbiBjU3FyVG8oeCxyKSB7IHguc3F1YXJlVG8ocik7IHRoaXMucmVkdWNlKHIpOyB9XG5cbkNsYXNzaWMucHJvdG90eXBlLmNvbnZlcnQgPSBjQ29udmVydDtcbkNsYXNzaWMucHJvdG90eXBlLnJldmVydCA9IGNSZXZlcnQ7XG5DbGFzc2ljLnByb3RvdHlwZS5yZWR1Y2UgPSBjUmVkdWNlO1xuQ2xhc3NpYy5wcm90b3R5cGUubXVsVG8gPSBjTXVsVG87XG5DbGFzc2ljLnByb3RvdHlwZS5zcXJUbyA9IGNTcXJUbztcblxuLy8gKHByb3RlY3RlZCkgcmV0dXJuIFwiLTEvdGhpcyAlIDJeREJcIjsgdXNlZnVsIGZvciBNb250LiByZWR1Y3Rpb25cbi8vIGp1c3RpZmljYXRpb246XG4vLyAgICAgICAgIHh5ID09IDEgKG1vZCBtKVxuLy8gICAgICAgICB4eSA9ICAxK2ttXG4vLyAgIHh5KDIteHkpID0gKDEra20pKDEta20pXG4vLyB4W3koMi14eSldID0gMS1rXjJtXjJcbi8vIHhbeSgyLXh5KV0gPT0gMSAobW9kIG1eMilcbi8vIGlmIHkgaXMgMS94IG1vZCBtLCB0aGVuIHkoMi14eSkgaXMgMS94IG1vZCBtXjJcbi8vIHNob3VsZCByZWR1Y2UgeCBhbmQgeSgyLXh5KSBieSBtXjIgYXQgZWFjaCBzdGVwIHRvIGtlZXAgc2l6ZSBib3VuZGVkLlxuLy8gSlMgbXVsdGlwbHkgXCJvdmVyZmxvd3NcIiBkaWZmZXJlbnRseSBmcm9tIEMvQysrLCBzbyBjYXJlIGlzIG5lZWRlZCBoZXJlLlxuZnVuY3Rpb24gYm5wSW52RGlnaXQoKSB7XG4gIGlmKHRoaXMudCA8IDEpIHJldHVybiAwO1xuICB2YXIgeCA9IHRoaXNbMF07XG4gIGlmKCh4JjEpID09IDApIHJldHVybiAwO1xuICB2YXIgeSA9IHgmMztcdFx0Ly8geSA9PSAxL3ggbW9kIDJeMlxuICB5ID0gKHkqKDItKHgmMHhmKSp5KSkmMHhmO1x0Ly8geSA9PSAxL3ggbW9kIDJeNFxuICB5ID0gKHkqKDItKHgmMHhmZikqeSkpJjB4ZmY7XHQvLyB5ID09IDEveCBtb2QgMl44XG4gIHkgPSAoeSooMi0oKCh4JjB4ZmZmZikqeSkmMHhmZmZmKSkpJjB4ZmZmZjtcdC8vIHkgPT0gMS94IG1vZCAyXjE2XG4gIC8vIGxhc3Qgc3RlcCAtIGNhbGN1bGF0ZSBpbnZlcnNlIG1vZCBEViBkaXJlY3RseTtcbiAgLy8gYXNzdW1lcyAxNiA8IERCIDw9IDMyIGFuZCBhc3N1bWVzIGFiaWxpdHkgdG8gaGFuZGxlIDQ4LWJpdCBpbnRzXG4gIHkgPSAoeSooMi14KnkldGhpcy5EVikpJXRoaXMuRFY7XHRcdC8vIHkgPT0gMS94IG1vZCAyXmRiaXRzXG4gIC8vIHdlIHJlYWxseSB3YW50IHRoZSBuZWdhdGl2ZSBpbnZlcnNlLCBhbmQgLURWIDwgeSA8IERWXG4gIHJldHVybiAoeT4wKT90aGlzLkRWLXk6LXk7XG59XG5cbi8vIE1vbnRnb21lcnkgcmVkdWN0aW9uXG5mdW5jdGlvbiBNb250Z29tZXJ5KG0pIHtcbiAgdGhpcy5tID0gbTtcbiAgdGhpcy5tcCA9IG0uaW52RGlnaXQoKTtcbiAgdGhpcy5tcGwgPSB0aGlzLm1wJjB4N2ZmZjtcbiAgdGhpcy5tcGggPSB0aGlzLm1wPj4xNTtcbiAgdGhpcy51bSA9ICgxPDwobS5EQi0xNSkpLTE7XG4gIHRoaXMubXQyID0gMiptLnQ7XG59XG5cbi8vIHhSIG1vZCBtXG5mdW5jdGlvbiBtb250Q29udmVydCh4KSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHguYWJzKCkuZGxTaGlmdFRvKHRoaXMubS50LHIpO1xuICByLmRpdlJlbVRvKHRoaXMubSxudWxsLHIpO1xuICBpZih4LnMgPCAwICYmIHIuY29tcGFyZVRvKEJpZ0ludGVnZXIuWkVSTykgPiAwKSB0aGlzLm0uc3ViVG8ocixyKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIHgvUiBtb2QgbVxuZnVuY3Rpb24gbW9udFJldmVydCh4KSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHguY29weVRvKHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIHggPSB4L1IgbW9kIG0gKEhBQyAxNC4zMilcbmZ1bmN0aW9uIG1vbnRSZWR1Y2UoeCkge1xuICB3aGlsZSh4LnQgPD0gdGhpcy5tdDIpXHQvLyBwYWQgeCBzbyBhbSBoYXMgZW5vdWdoIHJvb20gbGF0ZXJcbiAgICB4W3gudCsrXSA9IDA7XG4gIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLm0udDsgKytpKSB7XG4gICAgLy8gZmFzdGVyIHdheSBvZiBjYWxjdWxhdGluZyB1MCA9IHhbaV0qbXAgbW9kIERWXG4gICAgdmFyIGogPSB4W2ldJjB4N2ZmZjtcbiAgICB2YXIgdTAgPSAoaip0aGlzLm1wbCsoKChqKnRoaXMubXBoKyh4W2ldPj4xNSkqdGhpcy5tcGwpJnRoaXMudW0pPDwxNSkpJnguRE07XG4gICAgLy8gdXNlIGFtIHRvIGNvbWJpbmUgdGhlIG11bHRpcGx5LXNoaWZ0LWFkZCBpbnRvIG9uZSBjYWxsXG4gICAgaiA9IGkrdGhpcy5tLnQ7XG4gICAgeFtqXSArPSB0aGlzLm0uYW0oMCx1MCx4LGksMCx0aGlzLm0udCk7XG4gICAgLy8gcHJvcGFnYXRlIGNhcnJ5XG4gICAgd2hpbGUoeFtqXSA+PSB4LkRWKSB7IHhbal0gLT0geC5EVjsgeFsrK2pdKys7IH1cbiAgfVxuICB4LmNsYW1wKCk7XG4gIHguZHJTaGlmdFRvKHRoaXMubS50LHgpO1xuICBpZih4LmNvbXBhcmVUbyh0aGlzLm0pID49IDApIHguc3ViVG8odGhpcy5tLHgpO1xufVxuXG4vLyByID0gXCJ4XjIvUiBtb2QgbVwiOyB4ICE9IHJcbmZ1bmN0aW9uIG1vbnRTcXJUbyh4LHIpIHsgeC5zcXVhcmVUbyhyKTsgdGhpcy5yZWR1Y2Uocik7IH1cblxuLy8gciA9IFwieHkvUiBtb2QgbVwiOyB4LHkgIT0gclxuZnVuY3Rpb24gbW9udE11bFRvKHgseSxyKSB7IHgubXVsdGlwbHlUbyh5LHIpOyB0aGlzLnJlZHVjZShyKTsgfVxuXG5Nb250Z29tZXJ5LnByb3RvdHlwZS5jb252ZXJ0ID0gbW9udENvbnZlcnQ7XG5Nb250Z29tZXJ5LnByb3RvdHlwZS5yZXZlcnQgPSBtb250UmV2ZXJ0O1xuTW9udGdvbWVyeS5wcm90b3R5cGUucmVkdWNlID0gbW9udFJlZHVjZTtcbk1vbnRnb21lcnkucHJvdG90eXBlLm11bFRvID0gbW9udE11bFRvO1xuTW9udGdvbWVyeS5wcm90b3R5cGUuc3FyVG8gPSBtb250U3FyVG87XG5cbi8vIChwcm90ZWN0ZWQpIHRydWUgaWZmIHRoaXMgaXMgZXZlblxuZnVuY3Rpb24gYm5wSXNFdmVuKCkgeyByZXR1cm4gKCh0aGlzLnQ+MCk/KHRoaXNbMF0mMSk6dGhpcy5zKSA9PSAwOyB9XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXNeZSwgZSA8IDJeMzIsIGRvaW5nIHNxciBhbmQgbXVsIHdpdGggXCJyXCIgKEhBQyAxNC43OSlcbmZ1bmN0aW9uIGJucEV4cChlLHopIHtcbiAgaWYoZSA+IDB4ZmZmZmZmZmYgfHwgZSA8IDEpIHJldHVybiBCaWdJbnRlZ2VyLk9ORTtcbiAgdmFyIHIgPSBuYmkoKSwgcjIgPSBuYmkoKSwgZyA9IHouY29udmVydCh0aGlzKSwgaSA9IG5iaXRzKGUpLTE7XG4gIGcuY29weVRvKHIpO1xuICB3aGlsZSgtLWkgPj0gMCkge1xuICAgIHouc3FyVG8ocixyMik7XG4gICAgaWYoKGUmKDE8PGkpKSA+IDApIHoubXVsVG8ocjIsZyxyKTtcbiAgICBlbHNlIHsgdmFyIHQgPSByOyByID0gcjI7IHIyID0gdDsgfVxuICB9XG4gIHJldHVybiB6LnJldmVydChyKTtcbn1cblxuLy8gKHB1YmxpYykgdGhpc15lICUgbSwgMCA8PSBlIDwgMl4zMlxuZnVuY3Rpb24gYm5Nb2RQb3dJbnQoZSxtKSB7XG4gIHZhciB6O1xuICBpZihlIDwgMjU2IHx8IG0uaXNFdmVuKCkpIHogPSBuZXcgQ2xhc3NpYyhtKTsgZWxzZSB6ID0gbmV3IE1vbnRnb21lcnkobSk7XG4gIHJldHVybiB0aGlzLmV4cChlLHopO1xufVxuXG4vLyBwcm90ZWN0ZWRcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNvcHlUbyA9IGJucENvcHlUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21JbnQgPSBibnBGcm9tSW50O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbVN0cmluZyA9IGJucEZyb21TdHJpbmc7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jbGFtcCA9IGJucENsYW1wO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZGxTaGlmdFRvID0gYm5wRExTaGlmdFRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZHJTaGlmdFRvID0gYm5wRFJTaGlmdFRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubFNoaWZ0VG8gPSBibnBMU2hpZnRUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLnJTaGlmdFRvID0gYm5wUlNoaWZ0VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zdWJUbyA9IGJucFN1YlRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlUbyA9IGJucE11bHRpcGx5VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zcXVhcmVUbyA9IGJucFNxdWFyZVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZGl2UmVtVG8gPSBibnBEaXZSZW1UbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmludkRpZ2l0ID0gYm5wSW52RGlnaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5pc0V2ZW4gPSBibnBJc0V2ZW47XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5leHAgPSBibnBFeHA7XG5cbi8vIHB1YmxpY1xuQmlnSW50ZWdlci5wcm90b3R5cGUudG9TdHJpbmcgPSBiblRvU3RyaW5nO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubmVnYXRlID0gYm5OZWdhdGU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hYnMgPSBibkFicztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNvbXBhcmVUbyA9IGJuQ29tcGFyZVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYml0TGVuZ3RoID0gYm5CaXRMZW5ndGg7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2QgPSBibk1vZDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1vZFBvd0ludCA9IGJuTW9kUG93SW50O1xuXG4vLyBcImNvbnN0YW50c1wiXG5CaWdJbnRlZ2VyLlpFUk8gPSBuYnYoMCk7XG5CaWdJbnRlZ2VyLk9ORSA9IG5idigxKTtcblxuXG4vLy8gQkVHSU4ganNibjIuanNcblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAwMy0yMDA1ICBUb20gV3VcbiAqIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG4gKiBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbiAqIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuICogd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuICogZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbiAqIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuICogaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMtSVNcIiBBTkQgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgXG4gKiBFWFBSRVNTLCBJTVBMSUVEIE9SIE9USEVSV0lTRSwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiwgQU5ZIFxuICogV0FSUkFOVFkgT0YgTUVSQ0hBTlRBQklMSVRZIE9SIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgXG4gKlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVE9NIFdVIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIElOQ0lERU5UQUwsXG4gKiBJTkRJUkVDVCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT0YgQU5ZIEtJTkQsIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVJcbiAqIFJFU1VMVElORyBGUk9NIExPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgT1IgTk9UIEFEVklTRUQgT0ZcbiAqIFRIRSBQT1NTSUJJTElUWSBPRiBEQU1BR0UsIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgQVJJU0lORyBPVVRcbiAqIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SIFBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXG4gKlxuICogSW4gYWRkaXRpb24sIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uIGFwcGxpZXM6XG4gKlxuICogQWxsIHJlZGlzdHJpYnV0aW9ucyBtdXN0IHJldGFpbiBhbiBpbnRhY3QgY29weSBvZiB0aGlzIGNvcHlyaWdodCBub3RpY2VcbiAqIGFuZCBkaXNjbGFpbWVyLlxuICovXG5cbi8vIEV4dGVuZGVkIEphdmFTY3JpcHQgQk4gZnVuY3Rpb25zLCByZXF1aXJlZCBmb3IgUlNBIHByaXZhdGUgb3BzLlxuXG4vLyAocHVibGljKVxuZnVuY3Rpb24gYm5DbG9uZSgpIHsgdmFyIHIgPSBuYmkoKTsgdGhpcy5jb3B5VG8ocik7IHJldHVybiByOyB9XG5cbi8vIChwdWJsaWMpIHJldHVybiB2YWx1ZSBhcyBpbnRlZ2VyXG5mdW5jdGlvbiBibkludFZhbHVlKCkge1xuICBpZih0aGlzLnMgPCAwKSB7XG4gICAgaWYodGhpcy50ID09IDEpIHJldHVybiB0aGlzWzBdLXRoaXMuRFY7XG4gICAgZWxzZSBpZih0aGlzLnQgPT0gMCkgcmV0dXJuIC0xO1xuICB9XG4gIGVsc2UgaWYodGhpcy50ID09IDEpIHJldHVybiB0aGlzWzBdO1xuICBlbHNlIGlmKHRoaXMudCA9PSAwKSByZXR1cm4gMDtcbiAgLy8gYXNzdW1lcyAxNiA8IERCIDwgMzJcbiAgcmV0dXJuICgodGhpc1sxXSYoKDE8PCgzMi10aGlzLkRCKSktMSkpPDx0aGlzLkRCKXx0aGlzWzBdO1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gdmFsdWUgYXMgYnl0ZVxuZnVuY3Rpb24gYm5CeXRlVmFsdWUoKSB7IHJldHVybiAodGhpcy50PT0wKT90aGlzLnM6KHRoaXNbMF08PDI0KT4+MjQ7IH1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIHNob3J0IChhc3N1bWVzIERCPj0xNilcbmZ1bmN0aW9uIGJuU2hvcnRWYWx1ZSgpIHsgcmV0dXJuICh0aGlzLnQ9PTApP3RoaXMuczoodGhpc1swXTw8MTYpPj4xNjsgfVxuXG4vLyAocHJvdGVjdGVkKSByZXR1cm4geCBzLnQuIHJeeCA8IERWXG5mdW5jdGlvbiBibnBDaHVua1NpemUocikgeyByZXR1cm4gTWF0aC5mbG9vcihNYXRoLkxOMip0aGlzLkRCL01hdGgubG9nKHIpKTsgfVxuXG4vLyAocHVibGljKSAwIGlmIHRoaXMgPT0gMCwgMSBpZiB0aGlzID4gMFxuZnVuY3Rpb24gYm5TaWdOdW0oKSB7XG4gIGlmKHRoaXMucyA8IDApIHJldHVybiAtMTtcbiAgZWxzZSBpZih0aGlzLnQgPD0gMCB8fCAodGhpcy50ID09IDEgJiYgdGhpc1swXSA8PSAwKSkgcmV0dXJuIDA7XG4gIGVsc2UgcmV0dXJuIDE7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGNvbnZlcnQgdG8gcmFkaXggc3RyaW5nXG5mdW5jdGlvbiBibnBUb1JhZGl4KGIpIHtcbiAgaWYoYiA9PSBudWxsKSBiID0gMTA7XG4gIGlmKHRoaXMuc2lnbnVtKCkgPT0gMCB8fCBiIDwgMiB8fCBiID4gMzYpIHJldHVybiBcIjBcIjtcbiAgdmFyIGNzID0gdGhpcy5jaHVua1NpemUoYik7XG4gIHZhciBhID0gTWF0aC5wb3coYixjcyk7XG4gIHZhciBkID0gbmJ2KGEpLCB5ID0gbmJpKCksIHogPSBuYmkoKSwgciA9IFwiXCI7XG4gIHRoaXMuZGl2UmVtVG8oZCx5LHopO1xuICB3aGlsZSh5LnNpZ251bSgpID4gMCkge1xuICAgIHIgPSAoYSt6LmludFZhbHVlKCkpLnRvU3RyaW5nKGIpLnN1YnN0cigxKSArIHI7XG4gICAgeS5kaXZSZW1UbyhkLHkseik7XG4gIH1cbiAgcmV0dXJuIHouaW50VmFsdWUoKS50b1N0cmluZyhiKSArIHI7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGNvbnZlcnQgZnJvbSByYWRpeCBzdHJpbmdcbmZ1bmN0aW9uIGJucEZyb21SYWRpeChzLGIpIHtcbiAgdGhpcy5mcm9tSW50KDApO1xuICBpZihiID09IG51bGwpIGIgPSAxMDtcbiAgdmFyIGNzID0gdGhpcy5jaHVua1NpemUoYik7XG4gIHZhciBkID0gTWF0aC5wb3coYixjcyksIG1pID0gZmFsc2UsIGogPSAwLCB3ID0gMDtcbiAgZm9yKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgeCA9IGludEF0KHMsaSk7XG4gICAgaWYoeCA8IDApIHtcbiAgICAgIGlmKHMuY2hhckF0KGkpID09IFwiLVwiICYmIHRoaXMuc2lnbnVtKCkgPT0gMCkgbWkgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHcgPSBiKncreDtcbiAgICBpZigrK2ogPj0gY3MpIHtcbiAgICAgIHRoaXMuZE11bHRpcGx5KGQpO1xuICAgICAgdGhpcy5kQWRkT2Zmc2V0KHcsMCk7XG4gICAgICBqID0gMDtcbiAgICAgIHcgPSAwO1xuICAgIH1cbiAgfVxuICBpZihqID4gMCkge1xuICAgIHRoaXMuZE11bHRpcGx5KE1hdGgucG93KGIsaikpO1xuICAgIHRoaXMuZEFkZE9mZnNldCh3LDApO1xuICB9XG4gIGlmKG1pKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcyx0aGlzKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgYWx0ZXJuYXRlIGNvbnN0cnVjdG9yXG5mdW5jdGlvbiBibnBGcm9tTnVtYmVyKGEsYixjKSB7XG4gIGlmKFwibnVtYmVyXCIgPT0gdHlwZW9mIGIpIHtcbiAgICAvLyBuZXcgQmlnSW50ZWdlcihpbnQsaW50LFJORylcbiAgICBpZihhIDwgMikgdGhpcy5mcm9tSW50KDEpO1xuICAgIGVsc2Uge1xuICAgICAgdGhpcy5mcm9tTnVtYmVyKGEsYyk7XG4gICAgICBpZighdGhpcy50ZXN0Qml0KGEtMSkpXHQvLyBmb3JjZSBNU0Igc2V0XG4gICAgICAgIHRoaXMuYml0d2lzZVRvKEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChhLTEpLG9wX29yLHRoaXMpO1xuICAgICAgaWYodGhpcy5pc0V2ZW4oKSkgdGhpcy5kQWRkT2Zmc2V0KDEsMCk7IC8vIGZvcmNlIG9kZFxuICAgICAgd2hpbGUoIXRoaXMuaXNQcm9iYWJsZVByaW1lKGIpKSB7XG4gICAgICAgIHRoaXMuZEFkZE9mZnNldCgyLDApO1xuICAgICAgICBpZih0aGlzLmJpdExlbmd0aCgpID4gYSkgdGhpcy5zdWJUbyhCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoYS0xKSx0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gbmV3IEJpZ0ludGVnZXIoaW50LFJORylcbiAgICB2YXIgeCA9IG5ldyBBcnJheSgpLCB0ID0gYSY3O1xuICAgIHgubGVuZ3RoID0gKGE+PjMpKzE7XG4gICAgYi5uZXh0Qnl0ZXMoeCk7XG4gICAgaWYodCA+IDApIHhbMF0gJj0gKCgxPDx0KS0xKTsgZWxzZSB4WzBdID0gMDtcbiAgICB0aGlzLmZyb21TdHJpbmcoeCwyNTYpO1xuICB9XG59XG5cbi8vIChwdWJsaWMpIGNvbnZlcnQgdG8gYmlnZW5kaWFuIGJ5dGUgYXJyYXlcbmZ1bmN0aW9uIGJuVG9CeXRlQXJyYXkoKSB7XG4gIHZhciBpID0gdGhpcy50LCByID0gbmV3IEFycmF5KCk7XG4gIHJbMF0gPSB0aGlzLnM7XG4gIHZhciBwID0gdGhpcy5EQi0oaSp0aGlzLkRCKSU4LCBkLCBrID0gMDtcbiAgaWYoaS0tID4gMCkge1xuICAgIGlmKHAgPCB0aGlzLkRCICYmIChkID0gdGhpc1tpXT4+cCkgIT0gKHRoaXMucyZ0aGlzLkRNKT4+cClcbiAgICAgIHJbaysrXSA9IGR8KHRoaXMuczw8KHRoaXMuREItcCkpO1xuICAgIHdoaWxlKGkgPj0gMCkge1xuICAgICAgaWYocCA8IDgpIHtcbiAgICAgICAgZCA9ICh0aGlzW2ldJigoMTw8cCktMSkpPDwoOC1wKTtcbiAgICAgICAgZCB8PSB0aGlzWy0taV0+PihwKz10aGlzLkRCLTgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGQgPSAodGhpc1tpXT4+KHAtPTgpKSYweGZmO1xuICAgICAgICBpZihwIDw9IDApIHsgcCArPSB0aGlzLkRCOyAtLWk7IH1cbiAgICAgIH1cbiAgICAgIGlmKChkJjB4ODApICE9IDApIGQgfD0gLTI1NjtcbiAgICAgIGlmKGsgPT0gMCAmJiAodGhpcy5zJjB4ODApICE9IChkJjB4ODApKSArK2s7XG4gICAgICBpZihrID4gMCB8fCBkICE9IHRoaXMucykgcltrKytdID0gZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5cbmZ1bmN0aW9uIGJuRXF1YWxzKGEpIHsgcmV0dXJuKHRoaXMuY29tcGFyZVRvKGEpPT0wKTsgfVxuZnVuY3Rpb24gYm5NaW4oYSkgeyByZXR1cm4odGhpcy5jb21wYXJlVG8oYSk8MCk/dGhpczphOyB9XG5mdW5jdGlvbiBibk1heChhKSB7IHJldHVybih0aGlzLmNvbXBhcmVUbyhhKT4wKT90aGlzOmE7IH1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgb3AgYSAoYml0d2lzZSlcbmZ1bmN0aW9uIGJucEJpdHdpc2VUbyhhLG9wLHIpIHtcbiAgdmFyIGksIGYsIG0gPSBNYXRoLm1pbihhLnQsdGhpcy50KTtcbiAgZm9yKGkgPSAwOyBpIDwgbTsgKytpKSByW2ldID0gb3AodGhpc1tpXSxhW2ldKTtcbiAgaWYoYS50IDwgdGhpcy50KSB7XG4gICAgZiA9IGEucyZ0aGlzLkRNO1xuICAgIGZvcihpID0gbTsgaSA8IHRoaXMudDsgKytpKSByW2ldID0gb3AodGhpc1tpXSxmKTtcbiAgICByLnQgPSB0aGlzLnQ7XG4gIH1cbiAgZWxzZSB7XG4gICAgZiA9IHRoaXMucyZ0aGlzLkRNO1xuICAgIGZvcihpID0gbTsgaSA8IGEudDsgKytpKSByW2ldID0gb3AoZixhW2ldKTtcbiAgICByLnQgPSBhLnQ7XG4gIH1cbiAgci5zID0gb3AodGhpcy5zLGEucyk7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyAmIGFcbmZ1bmN0aW9uIG9wX2FuZCh4LHkpIHsgcmV0dXJuIHgmeTsgfVxuZnVuY3Rpb24gYm5BbmQoYSkgeyB2YXIgciA9IG5iaSgpOyB0aGlzLmJpdHdpc2VUbyhhLG9wX2FuZCxyKTsgcmV0dXJuIHI7IH1cblxuLy8gKHB1YmxpYykgdGhpcyB8IGFcbmZ1bmN0aW9uIG9wX29yKHgseSkgeyByZXR1cm4geHx5OyB9XG5mdW5jdGlvbiBibk9yKGEpIHsgdmFyIHIgPSBuYmkoKTsgdGhpcy5iaXR3aXNlVG8oYSxvcF9vcixyKTsgcmV0dXJuIHI7IH1cblxuLy8gKHB1YmxpYykgdGhpcyBeIGFcbmZ1bmN0aW9uIG9wX3hvcih4LHkpIHsgcmV0dXJuIHheeTsgfVxuZnVuY3Rpb24gYm5Yb3IoYSkgeyB2YXIgciA9IG5iaSgpOyB0aGlzLmJpdHdpc2VUbyhhLG9wX3hvcixyKTsgcmV0dXJuIHI7IH1cblxuLy8gKHB1YmxpYykgdGhpcyAmIH5hXG5mdW5jdGlvbiBvcF9hbmRub3QoeCx5KSB7IHJldHVybiB4Jn55OyB9XG5mdW5jdGlvbiBibkFuZE5vdChhKSB7IHZhciByID0gbmJpKCk7IHRoaXMuYml0d2lzZVRvKGEsb3BfYW5kbm90LHIpOyByZXR1cm4gcjsgfVxuXG4vLyAocHVibGljKSB+dGhpc1xuZnVuY3Rpb24gYm5Ob3QoKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnQ7ICsraSkgcltpXSA9IHRoaXMuRE0mfnRoaXNbaV07XG4gIHIudCA9IHRoaXMudDtcbiAgci5zID0gfnRoaXMucztcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgPDwgblxuZnVuY3Rpb24gYm5TaGlmdExlZnQobikge1xuICB2YXIgciA9IG5iaSgpO1xuICBpZihuIDwgMCkgdGhpcy5yU2hpZnRUbygtbixyKTsgZWxzZSB0aGlzLmxTaGlmdFRvKG4scik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzID4+IG5cbmZ1bmN0aW9uIGJuU2hpZnRSaWdodChuKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIGlmKG4gPCAwKSB0aGlzLmxTaGlmdFRvKC1uLHIpOyBlbHNlIHRoaXMuclNoaWZ0VG8obixyKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIHJldHVybiBpbmRleCBvZiBsb3dlc3QgMS1iaXQgaW4geCwgeCA8IDJeMzFcbmZ1bmN0aW9uIGxiaXQoeCkge1xuICBpZih4ID09IDApIHJldHVybiAtMTtcbiAgdmFyIHIgPSAwO1xuICBpZigoeCYweGZmZmYpID09IDApIHsgeCA+Pj0gMTY7IHIgKz0gMTY7IH1cbiAgaWYoKHgmMHhmZikgPT0gMCkgeyB4ID4+PSA4OyByICs9IDg7IH1cbiAgaWYoKHgmMHhmKSA9PSAwKSB7IHggPj49IDQ7IHIgKz0gNDsgfVxuICBpZigoeCYzKSA9PSAwKSB7IHggPj49IDI7IHIgKz0gMjsgfVxuICBpZigoeCYxKSA9PSAwKSArK3I7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSByZXR1cm5zIGluZGV4IG9mIGxvd2VzdCAxLWJpdCAob3IgLTEgaWYgbm9uZSlcbmZ1bmN0aW9uIGJuR2V0TG93ZXN0U2V0Qml0KCkge1xuICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy50OyArK2kpXG4gICAgaWYodGhpc1tpXSAhPSAwKSByZXR1cm4gaSp0aGlzLkRCK2xiaXQodGhpc1tpXSk7XG4gIGlmKHRoaXMucyA8IDApIHJldHVybiB0aGlzLnQqdGhpcy5EQjtcbiAgcmV0dXJuIC0xO1xufVxuXG4vLyByZXR1cm4gbnVtYmVyIG9mIDEgYml0cyBpbiB4XG5mdW5jdGlvbiBjYml0KHgpIHtcbiAgdmFyIHIgPSAwO1xuICB3aGlsZSh4ICE9IDApIHsgeCAmPSB4LTE7ICsrcjsgfVxuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIG51bWJlciBvZiBzZXQgYml0c1xuZnVuY3Rpb24gYm5CaXRDb3VudCgpIHtcbiAgdmFyIHIgPSAwLCB4ID0gdGhpcy5zJnRoaXMuRE07XG4gIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnQ7ICsraSkgciArPSBjYml0KHRoaXNbaV1eeCk7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0cnVlIGlmZiBudGggYml0IGlzIHNldFxuZnVuY3Rpb24gYm5UZXN0Qml0KG4pIHtcbiAgdmFyIGogPSBNYXRoLmZsb29yKG4vdGhpcy5EQik7XG4gIGlmKGogPj0gdGhpcy50KSByZXR1cm4odGhpcy5zIT0wKTtcbiAgcmV0dXJuKCh0aGlzW2pdJigxPDwobiV0aGlzLkRCKSkpIT0wKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyBvcCAoMTw8bilcbmZ1bmN0aW9uIGJucENoYW5nZUJpdChuLG9wKSB7XG4gIHZhciByID0gQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KG4pO1xuICB0aGlzLmJpdHdpc2VUbyhyLG9wLHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyB8ICgxPDxuKVxuZnVuY3Rpb24gYm5TZXRCaXQobikgeyByZXR1cm4gdGhpcy5jaGFuZ2VCaXQobixvcF9vcik7IH1cblxuLy8gKHB1YmxpYykgdGhpcyAmIH4oMTw8bilcbmZ1bmN0aW9uIGJuQ2xlYXJCaXQobikgeyByZXR1cm4gdGhpcy5jaGFuZ2VCaXQobixvcF9hbmRub3QpOyB9XG5cbi8vIChwdWJsaWMpIHRoaXMgXiAoMTw8bilcbmZ1bmN0aW9uIGJuRmxpcEJpdChuKSB7IHJldHVybiB0aGlzLmNoYW5nZUJpdChuLG9wX3hvcik7IH1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgKyBhXG5mdW5jdGlvbiBibnBBZGRUbyhhLHIpIHtcbiAgdmFyIGkgPSAwLCBjID0gMCwgbSA9IE1hdGgubWluKGEudCx0aGlzLnQpO1xuICB3aGlsZShpIDwgbSkge1xuICAgIGMgKz0gdGhpc1tpXSthW2ldO1xuICAgIHJbaSsrXSA9IGMmdGhpcy5ETTtcbiAgICBjID4+PSB0aGlzLkRCO1xuICB9XG4gIGlmKGEudCA8IHRoaXMudCkge1xuICAgIGMgKz0gYS5zO1xuICAgIHdoaWxlKGkgPCB0aGlzLnQpIHtcbiAgICAgIGMgKz0gdGhpc1tpXTtcbiAgICAgIHJbaSsrXSA9IGMmdGhpcy5ETTtcbiAgICAgIGMgPj49IHRoaXMuREI7XG4gICAgfVxuICAgIGMgKz0gdGhpcy5zO1xuICB9XG4gIGVsc2Uge1xuICAgIGMgKz0gdGhpcy5zO1xuICAgIHdoaWxlKGkgPCBhLnQpIHtcbiAgICAgIGMgKz0gYVtpXTtcbiAgICAgIHJbaSsrXSA9IGMmdGhpcy5ETTtcbiAgICAgIGMgPj49IHRoaXMuREI7XG4gICAgfVxuICAgIGMgKz0gYS5zO1xuICB9XG4gIHIucyA9IChjPDApPy0xOjA7XG4gIGlmKGMgPiAwKSByW2krK10gPSBjO1xuICBlbHNlIGlmKGMgPCAtMSkgcltpKytdID0gdGhpcy5EVitjO1xuICByLnQgPSBpO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgKyBhXG5mdW5jdGlvbiBibkFkZChhKSB7IHZhciByID0gbmJpKCk7IHRoaXMuYWRkVG8oYSxyKTsgcmV0dXJuIHI7IH1cblxuLy8gKHB1YmxpYykgdGhpcyAtIGFcbmZ1bmN0aW9uIGJuU3VidHJhY3QoYSkgeyB2YXIgciA9IG5iaSgpOyB0aGlzLnN1YlRvKGEscik7IHJldHVybiByOyB9XG5cbi8vIChwdWJsaWMpIHRoaXMgKiBhXG5mdW5jdGlvbiBibk11bHRpcGx5KGEpIHsgdmFyIHIgPSBuYmkoKTsgdGhpcy5tdWx0aXBseVRvKGEscik7IHJldHVybiByOyB9XG5cbi8vIChwdWJsaWMpIHRoaXMgLyBhXG5mdW5jdGlvbiBibkRpdmlkZShhKSB7IHZhciByID0gbmJpKCk7IHRoaXMuZGl2UmVtVG8oYSxyLG51bGwpOyByZXR1cm4gcjsgfVxuXG4vLyAocHVibGljKSB0aGlzICUgYVxuZnVuY3Rpb24gYm5SZW1haW5kZXIoYSkgeyB2YXIgciA9IG5iaSgpOyB0aGlzLmRpdlJlbVRvKGEsbnVsbCxyKTsgcmV0dXJuIHI7IH1cblxuLy8gKHB1YmxpYykgW3RoaXMvYSx0aGlzJWFdXG5mdW5jdGlvbiBibkRpdmlkZUFuZFJlbWFpbmRlcihhKSB7XG4gIHZhciBxID0gbmJpKCksIHIgPSBuYmkoKTtcbiAgdGhpcy5kaXZSZW1UbyhhLHEscik7XG4gIHJldHVybiBuZXcgQXJyYXkocSxyKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyAqPSBuLCB0aGlzID49IDAsIDEgPCBuIDwgRFZcbmZ1bmN0aW9uIGJucERNdWx0aXBseShuKSB7XG4gIHRoaXNbdGhpcy50XSA9IHRoaXMuYW0oMCxuLTEsdGhpcywwLDAsdGhpcy50KTtcbiAgKyt0aGlzLnQ7XG4gIHRoaXMuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyArPSBuIDw8IHcgd29yZHMsIHRoaXMgPj0gMFxuZnVuY3Rpb24gYm5wREFkZE9mZnNldChuLHcpIHtcbiAgd2hpbGUodGhpcy50IDw9IHcpIHRoaXNbdGhpcy50KytdID0gMDtcbiAgdGhpc1t3XSArPSBuO1xuICB3aGlsZSh0aGlzW3ddID49IHRoaXMuRFYpIHtcbiAgICB0aGlzW3ddIC09IHRoaXMuRFY7XG4gICAgaWYoKyt3ID49IHRoaXMudCkgdGhpc1t0aGlzLnQrK10gPSAwO1xuICAgICsrdGhpc1t3XTtcbiAgfVxufVxuXG4vLyBBIFwibnVsbFwiIHJlZHVjZXJcbmZ1bmN0aW9uIE51bGxFeHAoKSB7fVxuZnVuY3Rpb24gbk5vcCh4KSB7IHJldHVybiB4OyB9XG5mdW5jdGlvbiBuTXVsVG8oeCx5LHIpIHsgeC5tdWx0aXBseVRvKHkscik7IH1cbmZ1bmN0aW9uIG5TcXJUbyh4LHIpIHsgeC5zcXVhcmVUbyhyKTsgfVxuXG5OdWxsRXhwLnByb3RvdHlwZS5jb252ZXJ0ID0gbk5vcDtcbk51bGxFeHAucHJvdG90eXBlLnJldmVydCA9IG5Ob3A7XG5OdWxsRXhwLnByb3RvdHlwZS5tdWxUbyA9IG5NdWxUbztcbk51bGxFeHAucHJvdG90eXBlLnNxclRvID0gblNxclRvO1xuXG4vLyAocHVibGljKSB0aGlzXmVcbmZ1bmN0aW9uIGJuUG93KGUpIHsgcmV0dXJuIHRoaXMuZXhwKGUsbmV3IE51bGxFeHAoKSk7IH1cblxuLy8gKHByb3RlY3RlZCkgciA9IGxvd2VyIG4gd29yZHMgb2YgXCJ0aGlzICogYVwiLCBhLnQgPD0gblxuLy8gXCJ0aGlzXCIgc2hvdWxkIGJlIHRoZSBsYXJnZXIgb25lIGlmIGFwcHJvcHJpYXRlLlxuZnVuY3Rpb24gYm5wTXVsdGlwbHlMb3dlclRvKGEsbixyKSB7XG4gIHZhciBpID0gTWF0aC5taW4odGhpcy50K2EudCxuKTtcbiAgci5zID0gMDsgLy8gYXNzdW1lcyBhLHRoaXMgPj0gMFxuICByLnQgPSBpO1xuICB3aGlsZShpID4gMCkgclstLWldID0gMDtcbiAgdmFyIGo7XG4gIGZvcihqID0gci50LXRoaXMudDsgaSA8IGo7ICsraSkgcltpK3RoaXMudF0gPSB0aGlzLmFtKDAsYVtpXSxyLGksMCx0aGlzLnQpO1xuICBmb3IoaiA9IE1hdGgubWluKGEudCxuKTsgaSA8IGo7ICsraSkgdGhpcy5hbSgwLGFbaV0scixpLDAsbi1pKTtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gXCJ0aGlzICogYVwiIHdpdGhvdXQgbG93ZXIgbiB3b3JkcywgbiA+IDBcbi8vIFwidGhpc1wiIHNob3VsZCBiZSB0aGUgbGFyZ2VyIG9uZSBpZiBhcHByb3ByaWF0ZS5cbmZ1bmN0aW9uIGJucE11bHRpcGx5VXBwZXJUbyhhLG4scikge1xuICAtLW47XG4gIHZhciBpID0gci50ID0gdGhpcy50K2EudC1uO1xuICByLnMgPSAwOyAvLyBhc3N1bWVzIGEsdGhpcyA+PSAwXG4gIHdoaWxlKC0taSA+PSAwKSByW2ldID0gMDtcbiAgZm9yKGkgPSBNYXRoLm1heChuLXRoaXMudCwwKTsgaSA8IGEudDsgKytpKVxuICAgIHJbdGhpcy50K2ktbl0gPSB0aGlzLmFtKG4taSxhW2ldLHIsMCwwLHRoaXMudCtpLW4pO1xuICByLmNsYW1wKCk7XG4gIHIuZHJTaGlmdFRvKDEscik7XG59XG5cbi8vIEJhcnJldHQgbW9kdWxhciByZWR1Y3Rpb25cbmZ1bmN0aW9uIEJhcnJldHQobSkge1xuICAvLyBzZXR1cCBCYXJyZXR0XG4gIHRoaXMucjIgPSBuYmkoKTtcbiAgdGhpcy5xMyA9IG5iaSgpO1xuICBCaWdJbnRlZ2VyLk9ORS5kbFNoaWZ0VG8oMiptLnQsdGhpcy5yMik7XG4gIHRoaXMubXUgPSB0aGlzLnIyLmRpdmlkZShtKTtcbiAgdGhpcy5tID0gbTtcbn1cblxuZnVuY3Rpb24gYmFycmV0dENvbnZlcnQoeCkge1xuICBpZih4LnMgPCAwIHx8IHgudCA+IDIqdGhpcy5tLnQpIHJldHVybiB4Lm1vZCh0aGlzLm0pO1xuICBlbHNlIGlmKHguY29tcGFyZVRvKHRoaXMubSkgPCAwKSByZXR1cm4geDtcbiAgZWxzZSB7IHZhciByID0gbmJpKCk7IHguY29weVRvKHIpOyB0aGlzLnJlZHVjZShyKTsgcmV0dXJuIHI7IH1cbn1cblxuZnVuY3Rpb24gYmFycmV0dFJldmVydCh4KSB7IHJldHVybiB4OyB9XG5cbi8vIHggPSB4IG1vZCBtIChIQUMgMTQuNDIpXG5mdW5jdGlvbiBiYXJyZXR0UmVkdWNlKHgpIHtcbiAgeC5kclNoaWZ0VG8odGhpcy5tLnQtMSx0aGlzLnIyKTtcbiAgaWYoeC50ID4gdGhpcy5tLnQrMSkgeyB4LnQgPSB0aGlzLm0udCsxOyB4LmNsYW1wKCk7IH1cbiAgdGhpcy5tdS5tdWx0aXBseVVwcGVyVG8odGhpcy5yMix0aGlzLm0udCsxLHRoaXMucTMpO1xuICB0aGlzLm0ubXVsdGlwbHlMb3dlclRvKHRoaXMucTMsdGhpcy5tLnQrMSx0aGlzLnIyKTtcbiAgd2hpbGUoeC5jb21wYXJlVG8odGhpcy5yMikgPCAwKSB4LmRBZGRPZmZzZXQoMSx0aGlzLm0udCsxKTtcbiAgeC5zdWJUbyh0aGlzLnIyLHgpO1xuICB3aGlsZSh4LmNvbXBhcmVUbyh0aGlzLm0pID49IDApIHguc3ViVG8odGhpcy5tLHgpO1xufVxuXG4vLyByID0geF4yIG1vZCBtOyB4ICE9IHJcbmZ1bmN0aW9uIGJhcnJldHRTcXJUbyh4LHIpIHsgeC5zcXVhcmVUbyhyKTsgdGhpcy5yZWR1Y2Uocik7IH1cblxuLy8gciA9IHgqeSBtb2QgbTsgeCx5ICE9IHJcbmZ1bmN0aW9uIGJhcnJldHRNdWxUbyh4LHkscikgeyB4Lm11bHRpcGx5VG8oeSxyKTsgdGhpcy5yZWR1Y2Uocik7IH1cblxuQmFycmV0dC5wcm90b3R5cGUuY29udmVydCA9IGJhcnJldHRDb252ZXJ0O1xuQmFycmV0dC5wcm90b3R5cGUucmV2ZXJ0ID0gYmFycmV0dFJldmVydDtcbkJhcnJldHQucHJvdG90eXBlLnJlZHVjZSA9IGJhcnJldHRSZWR1Y2U7XG5CYXJyZXR0LnByb3RvdHlwZS5tdWxUbyA9IGJhcnJldHRNdWxUbztcbkJhcnJldHQucHJvdG90eXBlLnNxclRvID0gYmFycmV0dFNxclRvO1xuXG4vLyAocHVibGljKSB0aGlzXmUgJSBtIChIQUMgMTQuODUpXG5mdW5jdGlvbiBibk1vZFBvdyhlLG0pIHtcbiAgdmFyIGkgPSBlLmJpdExlbmd0aCgpLCBrLCByID0gbmJ2KDEpLCB6O1xuICBpZihpIDw9IDApIHJldHVybiByO1xuICBlbHNlIGlmKGkgPCAxOCkgayA9IDE7XG4gIGVsc2UgaWYoaSA8IDQ4KSBrID0gMztcbiAgZWxzZSBpZihpIDwgMTQ0KSBrID0gNDtcbiAgZWxzZSBpZihpIDwgNzY4KSBrID0gNTtcbiAgZWxzZSBrID0gNjtcbiAgaWYoaSA8IDgpXG4gICAgeiA9IG5ldyBDbGFzc2ljKG0pO1xuICBlbHNlIGlmKG0uaXNFdmVuKCkpXG4gICAgeiA9IG5ldyBCYXJyZXR0KG0pO1xuICBlbHNlXG4gICAgeiA9IG5ldyBNb250Z29tZXJ5KG0pO1xuXG4gIC8vIHByZWNvbXB1dGF0aW9uXG4gIHZhciBnID0gbmV3IEFycmF5KCksIG4gPSAzLCBrMSA9IGstMSwga20gPSAoMTw8ayktMTtcbiAgZ1sxXSA9IHouY29udmVydCh0aGlzKTtcbiAgaWYoayA+IDEpIHtcbiAgICB2YXIgZzIgPSBuYmkoKTtcbiAgICB6LnNxclRvKGdbMV0sZzIpO1xuICAgIHdoaWxlKG4gPD0ga20pIHtcbiAgICAgIGdbbl0gPSBuYmkoKTtcbiAgICAgIHoubXVsVG8oZzIsZ1tuLTJdLGdbbl0pO1xuICAgICAgbiArPSAyO1xuICAgIH1cbiAgfVxuXG4gIHZhciBqID0gZS50LTEsIHcsIGlzMSA9IHRydWUsIHIyID0gbmJpKCksIHQ7XG4gIGkgPSBuYml0cyhlW2pdKS0xO1xuICB3aGlsZShqID49IDApIHtcbiAgICBpZihpID49IGsxKSB3ID0gKGVbal0+PihpLWsxKSkma207XG4gICAgZWxzZSB7XG4gICAgICB3ID0gKGVbal0mKCgxPDwoaSsxKSktMSkpPDwoazEtaSk7XG4gICAgICBpZihqID4gMCkgdyB8PSBlW2otMV0+Pih0aGlzLkRCK2ktazEpO1xuICAgIH1cblxuICAgIG4gPSBrO1xuICAgIHdoaWxlKCh3JjEpID09IDApIHsgdyA+Pj0gMTsgLS1uOyB9XG4gICAgaWYoKGkgLT0gbikgPCAwKSB7IGkgKz0gdGhpcy5EQjsgLS1qOyB9XG4gICAgaWYoaXMxKSB7XHQvLyByZXQgPT0gMSwgZG9uJ3QgYm90aGVyIHNxdWFyaW5nIG9yIG11bHRpcGx5aW5nIGl0XG4gICAgICBnW3ddLmNvcHlUbyhyKTtcbiAgICAgIGlzMSA9IGZhbHNlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHdoaWxlKG4gPiAxKSB7IHouc3FyVG8ocixyMik7IHouc3FyVG8ocjIscik7IG4gLT0gMjsgfVxuICAgICAgaWYobiA+IDApIHouc3FyVG8ocixyMik7IGVsc2UgeyB0ID0gcjsgciA9IHIyOyByMiA9IHQ7IH1cbiAgICAgIHoubXVsVG8ocjIsZ1t3XSxyKTtcbiAgICB9XG5cbiAgICB3aGlsZShqID49IDAgJiYgKGVbal0mKDE8PGkpKSA9PSAwKSB7XG4gICAgICB6LnNxclRvKHIscjIpOyB0ID0gcjsgciA9IHIyOyByMiA9IHQ7XG4gICAgICBpZigtLWkgPCAwKSB7IGkgPSB0aGlzLkRCLTE7IC0tajsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gei5yZXZlcnQocik7XG59XG5cbi8vIChwdWJsaWMpIGdjZCh0aGlzLGEpIChIQUMgMTQuNTQpXG5mdW5jdGlvbiBibkdDRChhKSB7XG4gIHZhciB4ID0gKHRoaXMuczwwKT90aGlzLm5lZ2F0ZSgpOnRoaXMuY2xvbmUoKTtcbiAgdmFyIHkgPSAoYS5zPDApP2EubmVnYXRlKCk6YS5jbG9uZSgpO1xuICBpZih4LmNvbXBhcmVUbyh5KSA8IDApIHsgdmFyIHQgPSB4OyB4ID0geTsgeSA9IHQ7IH1cbiAgdmFyIGkgPSB4LmdldExvd2VzdFNldEJpdCgpLCBnID0geS5nZXRMb3dlc3RTZXRCaXQoKTtcbiAgaWYoZyA8IDApIHJldHVybiB4O1xuICBpZihpIDwgZykgZyA9IGk7XG4gIGlmKGcgPiAwKSB7XG4gICAgeC5yU2hpZnRUbyhnLHgpO1xuICAgIHkuclNoaWZ0VG8oZyx5KTtcbiAgfVxuICB3aGlsZSh4LnNpZ251bSgpID4gMCkge1xuICAgIGlmKChpID0geC5nZXRMb3dlc3RTZXRCaXQoKSkgPiAwKSB4LnJTaGlmdFRvKGkseCk7XG4gICAgaWYoKGkgPSB5LmdldExvd2VzdFNldEJpdCgpKSA+IDApIHkuclNoaWZ0VG8oaSx5KTtcbiAgICBpZih4LmNvbXBhcmVUbyh5KSA+PSAwKSB7XG4gICAgICB4LnN1YlRvKHkseCk7XG4gICAgICB4LnJTaGlmdFRvKDEseCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgeS5zdWJUbyh4LHkpO1xuICAgICAgeS5yU2hpZnRUbygxLHkpO1xuICAgIH1cbiAgfVxuICBpZihnID4gMCkgeS5sU2hpZnRUbyhnLHkpO1xuICByZXR1cm4geTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyAlIG4sIG4gPCAyXjI2XG5mdW5jdGlvbiBibnBNb2RJbnQobikge1xuICBpZihuIDw9IDApIHJldHVybiAwO1xuICB2YXIgZCA9IHRoaXMuRFYlbiwgciA9ICh0aGlzLnM8MCk/bi0xOjA7XG4gIGlmKHRoaXMudCA+IDApXG4gICAgaWYoZCA9PSAwKSByID0gdGhpc1swXSVuO1xuICAgIGVsc2UgZm9yKHZhciBpID0gdGhpcy50LTE7IGkgPj0gMDsgLS1pKSByID0gKGQqcit0aGlzW2ldKSVuO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgMS90aGlzICUgbSAoSEFDIDE0LjYxKVxuZnVuY3Rpb24gYm5Nb2RJbnZlcnNlKG0pIHtcbiAgdmFyIGFjID0gbS5pc0V2ZW4oKTtcbiAgaWYoKHRoaXMuaXNFdmVuKCkgJiYgYWMpIHx8IG0uc2lnbnVtKCkgPT0gMCkgcmV0dXJuIEJpZ0ludGVnZXIuWkVSTztcbiAgdmFyIHUgPSBtLmNsb25lKCksIHYgPSB0aGlzLmNsb25lKCk7XG4gIHZhciBhID0gbmJ2KDEpLCBiID0gbmJ2KDApLCBjID0gbmJ2KDApLCBkID0gbmJ2KDEpO1xuICB3aGlsZSh1LnNpZ251bSgpICE9IDApIHtcbiAgICB3aGlsZSh1LmlzRXZlbigpKSB7XG4gICAgICB1LnJTaGlmdFRvKDEsdSk7XG4gICAgICBpZihhYykge1xuICAgICAgICBpZighYS5pc0V2ZW4oKSB8fCAhYi5pc0V2ZW4oKSkgeyBhLmFkZFRvKHRoaXMsYSk7IGIuc3ViVG8obSxiKTsgfVxuICAgICAgICBhLnJTaGlmdFRvKDEsYSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKCFiLmlzRXZlbigpKSBiLnN1YlRvKG0sYik7XG4gICAgICBiLnJTaGlmdFRvKDEsYik7XG4gICAgfVxuICAgIHdoaWxlKHYuaXNFdmVuKCkpIHtcbiAgICAgIHYuclNoaWZ0VG8oMSx2KTtcbiAgICAgIGlmKGFjKSB7XG4gICAgICAgIGlmKCFjLmlzRXZlbigpIHx8ICFkLmlzRXZlbigpKSB7IGMuYWRkVG8odGhpcyxjKTsgZC5zdWJUbyhtLGQpOyB9XG4gICAgICAgIGMuclNoaWZ0VG8oMSxjKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoIWQuaXNFdmVuKCkpIGQuc3ViVG8obSxkKTtcbiAgICAgIGQuclNoaWZ0VG8oMSxkKTtcbiAgICB9XG4gICAgaWYodS5jb21wYXJlVG8odikgPj0gMCkge1xuICAgICAgdS5zdWJUbyh2LHUpO1xuICAgICAgaWYoYWMpIGEuc3ViVG8oYyxhKTtcbiAgICAgIGIuc3ViVG8oZCxiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2LnN1YlRvKHUsdik7XG4gICAgICBpZihhYykgYy5zdWJUbyhhLGMpO1xuICAgICAgZC5zdWJUbyhiLGQpO1xuICAgIH1cbiAgfVxuICBpZih2LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgIT0gMCkgcmV0dXJuIEJpZ0ludGVnZXIuWkVSTztcbiAgaWYoZC5jb21wYXJlVG8obSkgPj0gMCkgcmV0dXJuIGQuc3VidHJhY3QobSk7XG4gIGlmKGQuc2lnbnVtKCkgPCAwKSBkLmFkZFRvKG0sZCk7IGVsc2UgcmV0dXJuIGQ7XG4gIGlmKGQuc2lnbnVtKCkgPCAwKSByZXR1cm4gZC5hZGQobSk7IGVsc2UgcmV0dXJuIGQ7XG59XG5cbnZhciBsb3dwcmltZXMgPSBbMiwzLDUsNywxMSwxMywxNywxOSwyMywyOSwzMSwzNyw0MSw0Myw0Nyw1Myw1OSw2MSw2Nyw3MSw3Myw3OSw4Myw4OSw5NywxMDEsMTAzLDEwNywxMDksMTEzLDEyNywxMzEsMTM3LDEzOSwxNDksMTUxLDE1NywxNjMsMTY3LDE3MywxNzksMTgxLDE5MSwxOTMsMTk3LDE5OSwyMTEsMjIzLDIyNywyMjksMjMzLDIzOSwyNDEsMjUxLDI1NywyNjMsMjY5LDI3MSwyNzcsMjgxLDI4MywyOTMsMzA3LDMxMSwzMTMsMzE3LDMzMSwzMzcsMzQ3LDM0OSwzNTMsMzU5LDM2NywzNzMsMzc5LDM4MywzODksMzk3LDQwMSw0MDksNDE5LDQyMSw0MzEsNDMzLDQzOSw0NDMsNDQ5LDQ1Nyw0NjEsNDYzLDQ2Nyw0NzksNDg3LDQ5MSw0OTksNTAzLDUwOV07XG52YXIgbHBsaW0gPSAoMTw8MjYpL2xvd3ByaW1lc1tsb3dwcmltZXMubGVuZ3RoLTFdO1xuXG4vLyAocHVibGljKSB0ZXN0IHByaW1hbGl0eSB3aXRoIGNlcnRhaW50eSA+PSAxLS41XnRcbmZ1bmN0aW9uIGJuSXNQcm9iYWJsZVByaW1lKHQpIHtcbiAgdmFyIGksIHggPSB0aGlzLmFicygpO1xuICBpZih4LnQgPT0gMSAmJiB4WzBdIDw9IGxvd3ByaW1lc1tsb3dwcmltZXMubGVuZ3RoLTFdKSB7XG4gICAgZm9yKGkgPSAwOyBpIDwgbG93cHJpbWVzLmxlbmd0aDsgKytpKVxuICAgICAgaWYoeFswXSA9PSBsb3dwcmltZXNbaV0pIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZih4LmlzRXZlbigpKSByZXR1cm4gZmFsc2U7XG4gIGkgPSAxO1xuICB3aGlsZShpIDwgbG93cHJpbWVzLmxlbmd0aCkge1xuICAgIHZhciBtID0gbG93cHJpbWVzW2ldLCBqID0gaSsxO1xuICAgIHdoaWxlKGogPCBsb3dwcmltZXMubGVuZ3RoICYmIG0gPCBscGxpbSkgbSAqPSBsb3dwcmltZXNbaisrXTtcbiAgICBtID0geC5tb2RJbnQobSk7XG4gICAgd2hpbGUoaSA8IGopIGlmKG0lbG93cHJpbWVzW2krK10gPT0gMCkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB4Lm1pbGxlclJhYmluKHQpO1xufVxuXG4vLyAocHJvdGVjdGVkKSB0cnVlIGlmIHByb2JhYmx5IHByaW1lIChIQUMgNC4yNCwgTWlsbGVyLVJhYmluKVxuZnVuY3Rpb24gYm5wTWlsbGVyUmFiaW4odCkge1xuICB2YXIgbjEgPSB0aGlzLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKTtcbiAgdmFyIGsgPSBuMS5nZXRMb3dlc3RTZXRCaXQoKTtcbiAgaWYoayA8PSAwKSByZXR1cm4gZmFsc2U7XG4gIHZhciByID0gbjEuc2hpZnRSaWdodChrKTtcbiAgdCA9ICh0KzEpPj4xO1xuICBpZih0ID4gbG93cHJpbWVzLmxlbmd0aCkgdCA9IGxvd3ByaW1lcy5sZW5ndGg7XG4gIHZhciBhID0gbmJpKCk7XG4gIGZvcih2YXIgaSA9IDA7IGkgPCB0OyArK2kpIHtcbiAgICBhLmZyb21JbnQobG93cHJpbWVzW2ldKTtcbiAgICB2YXIgeSA9IGEubW9kUG93KHIsdGhpcyk7XG4gICAgaWYoeS5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpICE9IDAgJiYgeS5jb21wYXJlVG8objEpICE9IDApIHtcbiAgICAgIHZhciBqID0gMTtcbiAgICAgIHdoaWxlKGorKyA8IGsgJiYgeS5jb21wYXJlVG8objEpICE9IDApIHtcbiAgICAgICAgeSA9IHkubW9kUG93SW50KDIsdGhpcyk7XG4gICAgICAgIGlmKHkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSA9PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZih5LmNvbXBhcmVUbyhuMSkgIT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gcHJvdGVjdGVkXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jaHVua1NpemUgPSBibnBDaHVua1NpemU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS50b1JhZGl4ID0gYm5wVG9SYWRpeDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21SYWRpeCA9IGJucEZyb21SYWRpeDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21OdW1iZXIgPSBibnBGcm9tTnVtYmVyO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYml0d2lzZVRvID0gYm5wQml0d2lzZVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuY2hhbmdlQml0ID0gYm5wQ2hhbmdlQml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYWRkVG8gPSBibnBBZGRUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRNdWx0aXBseSA9IGJucERNdWx0aXBseTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRBZGRPZmZzZXQgPSBibnBEQWRkT2Zmc2V0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlMb3dlclRvID0gYm5wTXVsdGlwbHlMb3dlclRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlVcHBlclRvID0gYm5wTXVsdGlwbHlVcHBlclRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubW9kSW50ID0gYm5wTW9kSW50O1xuQmlnSW50ZWdlci5wcm90b3R5cGUubWlsbGVyUmFiaW4gPSBibnBNaWxsZXJSYWJpbjtcblxuLy8gcHVibGljXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jbG9uZSA9IGJuQ2xvbmU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5pbnRWYWx1ZSA9IGJuSW50VmFsdWU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5ieXRlVmFsdWUgPSBibkJ5dGVWYWx1ZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNob3J0VmFsdWUgPSBiblNob3J0VmFsdWU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zaWdudW0gPSBiblNpZ051bTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnRvQnl0ZUFycmF5ID0gYm5Ub0J5dGVBcnJheTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmVxdWFscyA9IGJuRXF1YWxzO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubWluID0gYm5NaW47XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tYXggPSBibk1heDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmFuZCA9IGJuQW5kO1xuQmlnSW50ZWdlci5wcm90b3R5cGUub3IgPSBibk9yO1xuQmlnSW50ZWdlci5wcm90b3R5cGUueG9yID0gYm5Yb3I7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmROb3QgPSBibkFuZE5vdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm5vdCA9IGJuTm90O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc2hpZnRMZWZ0ID0gYm5TaGlmdExlZnQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdFJpZ2h0ID0gYm5TaGlmdFJpZ2h0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZ2V0TG93ZXN0U2V0Qml0ID0gYm5HZXRMb3dlc3RTZXRCaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXRDb3VudCA9IGJuQml0Q291bnQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS50ZXN0Qml0ID0gYm5UZXN0Qml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc2V0Qml0ID0gYm5TZXRCaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jbGVhckJpdCA9IGJuQ2xlYXJCaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5mbGlwQml0ID0gYm5GbGlwQml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYWRkID0gYm5BZGQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zdWJ0cmFjdCA9IGJuU3VidHJhY3Q7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseSA9IGJuTXVsdGlwbHk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGUgPSBibkRpdmlkZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnJlbWFpbmRlciA9IGJuUmVtYWluZGVyO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZGl2aWRlQW5kUmVtYWluZGVyID0gYm5EaXZpZGVBbmRSZW1haW5kZXI7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RQb3cgPSBibk1vZFBvdztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1vZEludmVyc2UgPSBibk1vZEludmVyc2U7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5wb3cgPSBiblBvdztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmdjZCA9IGJuR0NEO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuaXNQcm9iYWJsZVByaW1lID0gYm5Jc1Byb2JhYmxlUHJpbWU7XG5cbi8vIEJpZ0ludGVnZXIgaW50ZXJmYWNlcyBub3QgaW1wbGVtZW50ZWQgaW4ganNibjpcblxuLy8gQmlnSW50ZWdlcihpbnQgc2lnbnVtLCBieXRlW10gbWFnbml0dWRlKVxuLy8gZG91YmxlIGRvdWJsZVZhbHVlKClcbi8vIGZsb2F0IGZsb2F0VmFsdWUoKVxuLy8gaW50IGhhc2hDb2RlKClcbi8vIGxvbmcgbG9uZ1ZhbHVlKClcbi8vIHN0YXRpYyBCaWdJbnRlZ2VyIHZhbHVlT2YobG9uZyB2YWwpXG5cbi8vLyBNRVRFT1IgV1JBUFBFUlxucmV0dXJuIEJpZ0ludGVnZXI7XG59KSgpO1xuIiwiLy8gVGhpcyBwYWNrYWdlIGNvbnRhaW5zIGp1c3QgZW5vdWdoIG9mIHRoZSBvcmlnaW5hbCBTUlAgY29kZSB0b1xuLy8gc3VwcG9ydCB0aGUgYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgdXBncmFkZSBwYXRoLlxuLy9cbi8vIEFuIFNSUCAoYW5kIHBvc3NpYmx5IGFsc28gYWNjb3VudHMtc3JwKSBwYWNrYWdlIHNob3VsZCBldmVudHVhbGx5IGJlXG4vLyBhdmFpbGFibGUgaW4gQXRtb3NwaGVyZSBzbyB0aGF0IHVzZXJzIGNhbiBjb250aW51ZSB0byB1c2UgU1JQIGlmIHRoZXlcbi8vIHdhbnQgdG8uXG5cblNSUCA9IHt9O1xuXG4vKipcbiAqIEdlbmVyYXRlIGEgbmV3IFNSUCB2ZXJpZmllci4gUGFzc3dvcmQgaXMgdGhlIHBsYWludGV4dCBwYXNzd29yZC5cbiAqXG4gKiBvcHRpb25zIGlzIG9wdGlvbmFsIGFuZCBjYW4gaW5jbHVkZTpcbiAqIC0gaWRlbnRpdHk6IFN0cmluZy4gVGhlIFNSUCB1c2VybmFtZSB0byB1c2VyLiBNb3N0bHkgdGhpcyBpcyBwYXNzZWRcbiAqICAgaW4gZm9yIHRlc3RpbmcuICBSYW5kb20gVVVJRCBpZiBub3QgcHJvdmlkZWQuXG4gKiAtIGhhc2hlZElkZW50aXR5QW5kUGFzc3dvcmQ6IGNvbWJpbmVkIGlkZW50aXR5IGFuZCBwYXNzd29yZCwgYWxyZWFkeSBoYXNoZWQsIGZvciB0aGUgU1JQIHRvIGJjcnlwdCB1cGdyYWRlIHBhdGguXG4gKiAtIHNhbHQ6IFN0cmluZy4gQSBzYWx0IHRvIHVzZS4gIE1vc3RseSB0aGlzIGlzIHBhc3NlZCBpbiBmb3JcbiAqICAgdGVzdGluZy4gIFJhbmRvbSBVVUlEIGlmIG5vdCBwcm92aWRlZC5cbiAqIC0gU1JQIHBhcmFtZXRlcnMgKHNlZSBfZGVmYXVsdHMgYW5kIHBhcmFtc0Zyb21PcHRpb25zIGJlbG93KVxuICovXG5TUlAuZ2VuZXJhdGVWZXJpZmllciA9IGZ1bmN0aW9uIChwYXNzd29yZCwgb3B0aW9ucykge1xuICB2YXIgcGFyYW1zID0gcGFyYW1zRnJvbU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgdmFyIHNhbHQgPSAob3B0aW9ucyAmJiBvcHRpb25zLnNhbHQpIHx8IFJhbmRvbS5zZWNyZXQoKTtcblxuICB2YXIgaWRlbnRpdHk7XG4gIHZhciBoYXNoZWRJZGVudGl0eUFuZFBhc3N3b3JkID0gb3B0aW9ucyAmJiBvcHRpb25zLmhhc2hlZElkZW50aXR5QW5kUGFzc3dvcmQ7XG4gIGlmICghaGFzaGVkSWRlbnRpdHlBbmRQYXNzd29yZCkge1xuICAgIGlkZW50aXR5ID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5pZGVudGl0eSkgfHwgUmFuZG9tLnNlY3JldCgpO1xuICAgIGhhc2hlZElkZW50aXR5QW5kUGFzc3dvcmQgPSBwYXJhbXMuaGFzaChpZGVudGl0eSArIFwiOlwiICsgcGFzc3dvcmQpO1xuICB9XG5cbiAgdmFyIHggPSBwYXJhbXMuaGFzaChzYWx0ICsgaGFzaGVkSWRlbnRpdHlBbmRQYXNzd29yZCk7XG4gIHZhciB4aSA9IG5ldyBCaWdJbnRlZ2VyKHgsIDE2KTtcbiAgdmFyIHYgPSBwYXJhbXMuZy5tb2RQb3coeGksIHBhcmFtcy5OKTtcblxuICByZXR1cm4ge1xuICAgIGlkZW50aXR5OiBpZGVudGl0eSxcbiAgICBzYWx0OiBzYWx0LFxuICAgIHZlcmlmaWVyOiB2LnRvU3RyaW5nKDE2KVxuICB9O1xufTtcblxuLy8gRm9yIHVzZSB3aXRoIGNoZWNrKCkuXG5TUlAubWF0Y2hWZXJpZmllciA9IHtcbiAgaWRlbnRpdHk6IFN0cmluZyxcbiAgc2FsdDogU3RyaW5nLFxuICB2ZXJpZmllcjogU3RyaW5nXG59O1xuXG5cbi8qKlxuICogRGVmYXVsdCBwYXJhbWV0ZXIgdmFsdWVzIGZvciBTUlAuXG4gKlxuICovXG52YXIgX2RlZmF1bHRzID0ge1xuICBoYXNoOiBmdW5jdGlvbiAoeCkgeyByZXR1cm4gU0hBMjU2KHgpLnRvTG93ZXJDYXNlKCk7IH0sXG4gIE46IG5ldyBCaWdJbnRlZ2VyKFwiRUVBRjBBQjlBREIzOERENjlDMzNGODBBRkE4RkM1RTg2MDcyNjE4Nzc1RkYzQzBCOUVBMjMxNEM5QzI1NjU3NkQ2NzRERjc0OTZFQTgxRDMzODNCNDgxM0Q2OTJDNkUwRTBENUQ4RTI1MEI5OEJFNDhFNDk1QzFENjA4OURBRDE1REM3RDdCNDYxNTRENkI2Q0U4RUY0QUQ2OUIxNUQ0OTgyNTU5QjI5N0JDRjE4ODVDNTI5RjU2NjY2MEU1N0VDNjhFREJDM0MwNTcyNkNDMDJGRDRDQkY0OTc2RUFBOUFGRDUxMzhGRTgzNzY0MzVCOUZDNjFEMkZDMEVCMDZFM1wiLCAxNiksXG4gIGc6IG5ldyBCaWdJbnRlZ2VyKFwiMlwiKVxufTtcbl9kZWZhdWx0cy5rID0gbmV3IEJpZ0ludGVnZXIoXG4gIF9kZWZhdWx0cy5oYXNoKFxuICAgIF9kZWZhdWx0cy5OLnRvU3RyaW5nKDE2KSArXG4gICAgICBfZGVmYXVsdHMuZy50b1N0cmluZygxNikpLFxuICAxNik7XG5cbi8qKlxuICogUHJvY2VzcyBhbiBvcHRpb25zIGhhc2ggdG8gY3JlYXRlIFNSUCBwYXJhbWV0ZXJzLlxuICpcbiAqIE9wdGlvbnMgY2FuIGluY2x1ZGU6XG4gKiAtIGhhc2g6IEZ1bmN0aW9uLiBEZWZhdWx0cyB0byBTSEEyNTYuXG4gKiAtIE46IFN0cmluZyBvciBCaWdJbnRlZ2VyLiBEZWZhdWx0cyB0byAxMDI0IGJpdCB2YWx1ZSBmcm9tIFJGQyA1MDU0XG4gKiAtIGc6IFN0cmluZyBvciBCaWdJbnRlZ2VyLiBEZWZhdWx0cyB0byAyLlxuICogLSBrOiBTdHJpbmcgb3IgQmlnSW50ZWdlci4gRGVmYXVsdHMgdG8gaGFzaChOLCBnKVxuICovXG52YXIgcGFyYW1zRnJvbU9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIC8vIGZhc3QgcGF0aFxuICAgIHJldHVybiBfZGVmYXVsdHM7XG5cbiAgdmFyIHJldCA9IHsgLi4uX2RlZmF1bHRzIH07XG5cbiAgWydOJywgJ2cnLCAnayddLmZvckVhY2goZnVuY3Rpb24gKHApIHtcbiAgICBpZiAob3B0aW9uc1twXSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zW3BdID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXRbcF0gPSBuZXcgQmlnSW50ZWdlcihvcHRpb25zW3BdLCAxNik7XG4gICAgICBlbHNlIGlmIChvcHRpb25zW3BdIGluc3RhbmNlb2YgQmlnSW50ZWdlcilcbiAgICAgICAgcmV0W3BdID0gb3B0aW9uc1twXTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwYXJhbWV0ZXI6IFwiICsgcCk7XG4gICAgfVxuICB9KTtcblxuICBpZiAob3B0aW9ucy5oYXNoKVxuICAgIHJldC5oYXNoID0gZnVuY3Rpb24gKHgpIHsgcmV0dXJuIG9wdGlvbnMuaGFzaCh4KS50b0xvd2VyQ2FzZSgpOyB9O1xuXG4gIGlmICghb3B0aW9ucy5rICYmIChvcHRpb25zLk4gfHwgb3B0aW9ucy5nIHx8IG9wdGlvbnMuaGFzaCkpIHtcbiAgICByZXQuayA9IHJldC5oYXNoKHJldC5OLnRvU3RyaW5nKDE2KSArIHJldC5nLnRvU3RyaW5nKDE2KSk7XG4gIH1cblxuICByZXR1cm4gcmV0O1xufTtcbiJdfQ==
