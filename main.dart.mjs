  let buildArgsList;

// `modulePromise` is a promise to the `WebAssembly.module` object to be
//   instantiated.
// `importObjectPromise` is a promise to an object that contains any additional
//   imports needed by the module that aren't provided by the standard runtime.
//   The fields on this object will be merged into the importObject with which
//   the module will be instantiated.
// This function returns a promise to the instantiated module.
export const instantiate = async (modulePromise, importObjectPromise) => {
    let dartInstance;

      function stringFromDartString(string) {
        const totalLength = dartInstance.exports.$stringLength(string);
        let result = '';
        let index = 0;
        while (index < totalLength) {
          let chunkLength = Math.min(totalLength - index, 0xFFFF);
          const array = new Array(chunkLength);
          for (let i = 0; i < chunkLength; i++) {
              array[i] = dartInstance.exports.$stringRead(string, index++);
          }
          result += String.fromCharCode(...array);
        }
        return result;
    }

    function stringToDartString(string) {
        const length = string.length;
        let range = 0;
        for (let i = 0; i < length; i++) {
            range |= string.codePointAt(i);
        }
        if (range < 256) {
            const dartString = dartInstance.exports.$stringAllocate1(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite1(dartString, i, string.codePointAt(i));
            }
            return dartString;
        } else {
            const dartString = dartInstance.exports.$stringAllocate2(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite2(dartString, i, string.charCodeAt(i));
            }
            return dartString;
        }
    }

      // Converts a Dart List to a JS array. Any Dart objects will be converted, but
    // this will be cheap for JSValues.
    function arrayFromDartList(constructor, list) {
        const length = dartInstance.exports.$listLength(list);
        const array = new constructor(length);
        for (let i = 0; i < length; i++) {
            array[i] = dartInstance.exports.$listRead(list, i);
        }
        return array;
    }

    buildArgsList = function(list) {
        const dartList = dartInstance.exports.$makeStringList();
        for (let i = 0; i < list.length; i++) {
            dartInstance.exports.$listAdd(dartList, stringToDartString(list[i]));
        }
        return dartList;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
        wrapped.dartFunction = dartFunction;
        wrapped[jsWrappedDartFunctionSymbol] = true;
        return wrapped;
    }

    if (WebAssembly.String === undefined) {
        console.log("WebAssembly.String is undefined, adding polyfill");
        WebAssembly.String = {
            "charCodeAt": (s, i) => s.charCodeAt(i),
            "compare": (s1, s2) => {
                if (s1 < s2) return -1;
                if (s1 > s2) return 1;
                return 0;
            },
            "concat": (s1, s2) => s1 + s2,
            "equals": (s1, s2) => s1 === s2,
            "fromCharCode": (i) => String.fromCharCode(i),
            "length": (s) => s.length,
            "substring": (s, a, b) => s.substring(a, b),
        };
    }

    // Imports
    const dart2wasm = {

  _1589: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
_1590: (x0,x1) => x0.matchMedia(x1),
_3925: () => globalThis.window,
_4017: x0 => x0.navigator,
_4509: x0 => x0.userAgent,
_1873: () => globalThis.window,
_1893: x0 => x0.matches,
_1897: x0 => x0.platform,
_1902: x0 => x0.navigator,
_1659: s => stringToDartString(JSON.stringify(stringFromDartString(s))),
_1660: s => console.log(stringFromDartString(s)),
_1792: o => o === undefined,
_1793: o => typeof o === 'boolean',
_1794: o => typeof o === 'number',
_1796: o => typeof o === 'string',
_1799: o => o instanceof Int8Array,
_1800: o => o instanceof Uint8Array,
_1801: o => o instanceof Uint8ClampedArray,
_1802: o => o instanceof Int16Array,
_1803: o => o instanceof Uint16Array,
_1804: o => o instanceof Int32Array,
_1805: o => o instanceof Uint32Array,
_1806: o => o instanceof Float32Array,
_1807: o => o instanceof Float64Array,
_1808: o => o instanceof ArrayBuffer,
_1809: o => o instanceof DataView,
_1810: o => o instanceof Array,
_1811: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_1813: o => {
            const proto = Object.getPrototypeOf(o);
            return proto === Object.prototype || proto === null;
          },
_1814: o => o instanceof RegExp,
_1815: (l, r) => l === r,
_1816: o => o,
_1817: o => o,
_1818: o => o,
_1819: b => !!b,
_1820: o => o.length,
_1823: (o, i) => o[i],
_1824: f => f.dartFunction,
_1825: l => arrayFromDartList(Int8Array, l),
_1826: l => arrayFromDartList(Uint8Array, l),
_1827: l => arrayFromDartList(Uint8ClampedArray, l),
_1828: l => arrayFromDartList(Int16Array, l),
_1829: l => arrayFromDartList(Uint16Array, l),
_1830: l => arrayFromDartList(Int32Array, l),
_1831: l => arrayFromDartList(Uint32Array, l),
_1832: l => arrayFromDartList(Float32Array, l),
_1833: l => arrayFromDartList(Float64Array, l),
_1834: (data, length) => {
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
              view.setUint8(i, dartInstance.exports.$byteDataGetUint8(data, i));
          }
          return view;
        },
_1835: l => arrayFromDartList(Array, l),
_1836: stringFromDartString,
_1837: stringToDartString,
_1838: () => ({}),
_1839: () => [],
_1841: () => globalThis,
_1842: (constructor, args) => {
      const factoryFunction = constructor.bind.apply(
          constructor, [null, ...args]);
      return new factoryFunction();
    },
_1843: (o, p) => p in o,
_1844: (o, p) => o[p],
_1845: (o, p, v) => o[p] = v,
_1846: (o, m, a) => o[m].apply(o, a),
_1849: (p, s, f) => p.then(s, f),
_1850: s => {
      let jsString = stringFromDartString(s);
      if (/[[\]{}()*+?.\\^$|]/.test(jsString)) {
          jsString = jsString.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
      }
      return stringToDartString(jsString);
    },
_1781: (s, m) => {
          try {
            return new RegExp(s, m);
          } catch (e) {
            return String(e);
          }
        },
_1782: (x0,x1) => x0.exec(x1),
_1783: (x0,x1) => x0.test(x1),
_1784: (x0,x1) => x0.exec(x1),
_1785: (x0,x1) => x0.exec(x1),
_1786: x0 => x0.pop(),
_1790: (x0,x1,x2) => x0[x1] = x2,
_1840: l => new Array(l),
_1848: o => String(o),
_1853: x0 => x0.index,
_1855: x0 => x0.length,
_1857: (x0,x1) => x0[x1],
_1861: x0 => x0.flags,
_1862: x0 => x0.multiline,
_1863: x0 => x0.ignoreCase,
_1864: x0 => x0.unicode,
_1865: x0 => x0.dotAll,
_1866: (x0,x1) => x0.lastIndex = x1,
_1741: Object.is,
_1743: WebAssembly.String.concat,
_1749: (t, s) => t.set(s),
_1751: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_1753: o => o.buffer,
_1701: (a, i) => a.push(i),
_1705: a => a.pop(),
_1706: (a, i) => a.splice(i, 1),
_1712: a => a.length,
_1714: (a, i) => a[i],
_1715: (a, i, v) => a[i] = v,
_1717: a => a.join(''),
_1720: (s, t) => s.split(t),
_1721: s => s.toLowerCase(),
_1722: s => s.toUpperCase(),
_1723: s => s.trim(),
_1724: s => s.trimLeft(),
_1725: s => s.trimRight(),
_1727: (s, p, i) => s.indexOf(p, i),
_1728: (s, p, i) => s.lastIndexOf(p, i),
_1730: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_1731: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_1732: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_1733: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_1734: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_1735: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_1736: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_1738: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
_1739: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_1740: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_1742: WebAssembly.String.charCodeAt,
_1744: WebAssembly.String.substring,
_1745: WebAssembly.String.length,
_1746: WebAssembly.String.equals,
_1747: WebAssembly.String.compare,
_1748: WebAssembly.String.fromCharCode,
_1754: o => o.byteOffset,
_1755: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_1756: (b, o) => new DataView(b, o),
_1757: (b, o, l) => new DataView(b, o, l),
_1758: Function.prototype.call.bind(DataView.prototype.getUint8),
_1759: Function.prototype.call.bind(DataView.prototype.setUint8),
_1760: Function.prototype.call.bind(DataView.prototype.getInt8),
_1761: Function.prototype.call.bind(DataView.prototype.setInt8),
_1762: Function.prototype.call.bind(DataView.prototype.getUint16),
_1763: Function.prototype.call.bind(DataView.prototype.setUint16),
_1764: Function.prototype.call.bind(DataView.prototype.getInt16),
_1765: Function.prototype.call.bind(DataView.prototype.setInt16),
_1766: Function.prototype.call.bind(DataView.prototype.getUint32),
_1767: Function.prototype.call.bind(DataView.prototype.setUint32),
_1768: Function.prototype.call.bind(DataView.prototype.getInt32),
_1769: Function.prototype.call.bind(DataView.prototype.setInt32),
_1772: Function.prototype.call.bind(DataView.prototype.getBigInt64),
_1773: Function.prototype.call.bind(DataView.prototype.setBigInt64),
_1774: Function.prototype.call.bind(DataView.prototype.getFloat32),
_1775: Function.prototype.call.bind(DataView.prototype.setFloat32),
_1776: Function.prototype.call.bind(DataView.prototype.getFloat64),
_1777: Function.prototype.call.bind(DataView.prototype.setFloat64),
_1666: (ms, c) =>
              setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
_1667: (handle) => clearTimeout(handle),
_1670: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_1601: x0 => new Array(x0),
_1661: (o, t) => o instanceof t,
_1663: f => finalizeWrapper(f,x0 => dartInstance.exports._1663(f,x0)),
_1664: f => finalizeWrapper(f,x0 => dartInstance.exports._1664(f,x0)),
_1665: o => Object.keys(o),
_1778: s => stringToDartString(stringFromDartString(s).toUpperCase()),
_1779: s => stringToDartString(stringFromDartString(s).toLowerCase()),
_1635: v => stringToDartString(v.toString()),
_1636: (d, digits) => stringToDartString(d.toFixed(digits)),
_1639: (d, precision) => stringToDartString(d.toPrecision(precision)),
_1640: o => new WeakRef(o),
_1641: r => r.deref(),
_1646: Date.now,
_1648: s => new Date(s * 1000).getTimezoneOffset() * 60 ,
_1649: s => {
      const jsSource = stringFromDartString(s);
      if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(jsSource)) {
        return NaN;
      }
      return parseFloat(jsSource);
    },
_1650: () => {
          let stackString = new Error().stack.toString();
          let frames = stackString.split('\n');
          let drop = 2;
          if (frames[0] === 'Error') {
              drop += 1;
          }
          return frames.slice(drop).join('\n');
        },
_1651: () => typeof dartUseDateNowForTicks !== "undefined",
_1652: () => 1000 * performance.now(),
_1653: () => Date.now(),
_1656: () => new WeakMap(),
_1657: (map, o) => map.get(o),
_1658: (map, o, v) => map.set(o, v),
_13: (x0,x1) => x0.append(x1),
_14: x0 => x0.save(),
_15: x0 => x0.remove(),
_16: x0 => x0.restore(),
_17: x0 => x0.save(),
_18: x0 => x0.save(),
_19: x0 => x0.restore(),
_20: x0 => x0.beginPath(),
_22: x0 => x0.beginPath(),
_30: x0 => x0.beginPath(),
_31: x0 => x0.closePath(),
_32: x0 => x0.beginPath(),
_33: x0 => x0.beginPath(),
_34: x0 => x0.closePath(),
_35: x0 => x0.beginPath(),
_36: x0 => x0.beginPath(),
_37: x0 => x0.save(),
_38: x0 => x0.restore(),
_39: x0 => x0.remove(),
_42: x0 => x0.stroke(),
_43: x0 => x0.stroke(),
_44: (x0,x1) => x0.drawPaint(x1),
_45: (x0,x1,x2) => x0.drawPath(x1,x2),
_46: (x0,x1) => x0.drawPicture(x1),
_48: x0 => x0.restore(),
_49: x0 => ({locateFile: x0}),
_50: (x0,x1) => ({antialias: x0,majorVersion: x1}),
_51: () => new window.flutterCanvasKit.Paint(),
_54: () => new window.flutterCanvasKit.Path(),
_58: () => new window.flutterCanvasKit.PictureRecorder(),
_59: () => ({}),
_60: () => ({}),
_62: () => ({}),
_65: () => ({}),
_66: x0 => new window.flutterCanvasKit.Font(x0),
_67: (x0,x1) => ({ambient: x0,spot: x1}),
_81: x0 => x0.remove(),
_89: (x0,x1,x2) => x0.insertBefore(x1,x2),
_91: (x0,x1) => x0.append(x1),
_92: (x0,x1) => x0.append(x1),
_95: (x0,x1) => x0.append(x1),
_99: x0 => x0.delete(),
_100: x0 => x0.delete(),
_101: x0 => x0.Make(),
_102: x0 => x0.Make(),
_103: x0 => x0.enableFontFallback(),
_104: (x0,x1) => x0.setDefaultFontManager(x1),
_110: x0 => x0.delete(),
_111: (x0,x1) => x0.setBlendMode(x1),
_112: (x0,x1) => x0.setStyle(x1),
_113: (x0,x1) => x0.setStrokeCap(x1),
_116: (x0,x1) => x0.setShader(x1),
_121: (x0,x1) => x0.setFillType(x1),
_124: (x0,x1) => x0.setFillType(x1),
_125: (x0,x1) => x0.setFillType(x1),
_127: x0 => x0.close(),
_129: x0 => x0.copy(),
_134: x0 => x0.finishRecordingAsPicture(),
_135: x0 => x0.delete(),
_136: (x0,x1) => x0.prepend(x1),
_137: (x0,x1) => x0.append(x1),
_138: (x0,x1) => x0.transferFromImageBitmap(x1),
_139: x0 => x0.remove(),
_140: x0 => x0.remove(),
_141: x0 => x0.remove(),
_142: x0 => x0.releaseResourcesAndAbandonContext(),
_143: x0 => x0.delete(),
_144: x0 => x0.stopPropagation(),
_145: x0 => x0.preventDefault(),
_146: x0 => x0.preventDefault(),
_147: (x0,x1) => x0.MakeSWCanvasSurface(x1),
_148: (x0,x1) => x0.MakeSWCanvasSurface(x1),
_149: x0 => x0.getCanvas(),
_150: x0 => x0.flush(),
_151: x0 => x0.dispose(),
_152: (x0,x1) => x0.ParagraphStyle(x1),
_153: (x0,x1) => x0.TextStyle(x1),
_154: (x0,x1,x2) => x0.MakeFromFontCollection(x1,x2),
_155: x0 => x0.build(),
_156: x0 => x0.delete(),
_157: x0 => x0.pop(),
_158: (x0,x1,x2,x3) => x0.pushPaintStyle(x1,x2,x3),
_159: (x0,x1) => x0.pushStyle(x1),
_160: x0 => x0.focus(),
_161: x0 => x0.select(),
_162: (x0,x1) => x0.append(x1),
_163: x0 => x0.remove(),
_166: x0 => x0.unlock(),
_171: x0 => x0.getReader(),
_174: (x0,x1,x2) => new FontFace(x0,x1,x2),
_181: x0 => new MutationObserver(x0),
_198: (x0,x1) => new OffscreenCanvas(x0,x1),
_200: (x0,x1,x2) => x0.addEventListener(x1,x2),
_201: (x0,x1,x2) => x0.removeEventListener(x1,x2),
_204: x0 => new ResizeObserver(x0),
_206: x0 => ({createScriptURL: x0}),
_207: (x0,x1) => new Intl.Segmenter(x0,x1),
_208: x0 => x0.next(),
_209: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
_216: x0 => x0.remove(),
_217: (x0,x1) => x0.append(x1),
_218: (x0,x1) => x0.append(x1),
_224: x0 => x0.save(),
_225: x0 => x0.restore(),
_226: (x0,x1) => x0.append(x1),
_227: (x0,x1) => x0.append(x1),
_228: (x0,x1) => x0.append(x1),
_229: (x0,x1) => x0.append(x1),
_231: (x0,x1) => x0.append(x1),
_232: (x0,x1) => x0.append(x1),
_233: x0 => x0.remove(),
_234: (x0,x1) => x0.append(x1),
_235: x0 => x0.remove(),
_236: x0 => x0.remove(),
_261: (x0,x1) => x0.append(x1),
_262: (x0,x1) => x0.append(x1),
_263: (x0,x1) => x0.append(x1),
_265: (x0,x1) => x0.append(x1),
_275: x0 => x0.remove(),
_276: (x0,x1) => x0.append(x1),
_277: (x0,x1) => x0.append(x1),
_278: (x0,x1) => x0.append(x1),
_279: (x0,x1) => x0.append(x1),
_280: (x0,x1) => x0.append(x1),
_281: (x0,x1) => x0.append(x1),
_282: (x0,x1) => x0.append(x1),
_283: (x0,x1,x2) => x0.insertBefore(x1,x2),
_291: f => finalizeWrapper(f,x0 => dartInstance.exports._291(f,x0)),
_292: f => finalizeWrapper(f,x0 => dartInstance.exports._292(f,x0)),
_293: (x0,x1) => ({addView: x0,removeView: x1}),
_294: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._294(f,arguments.length,x0) }),
_295: f => finalizeWrapper(f,() => dartInstance.exports._295(f)),
_296: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
_297: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._297(f,arguments.length,x0) }),
_298: x0 => ({runApp: x0}),
_301: x0 => x0.preventDefault(),
_302: x0 => x0.stopPropagation(),
_303: (x0,x1) => x0.addListener(x1),
_304: (x0,x1) => x0.removeListener(x1),
_305: x0 => x0.disconnect(),
_306: (x0,x1) => x0.addListener(x1),
_307: (x0,x1) => x0.removeListener(x1),
_308: (x0,x1) => x0.append(x1),
_309: x0 => x0.remove(),
_310: x0 => x0.stopPropagation(),
_314: x0 => x0.preventDefault(),
_315: (x0,x1) => x0.append(x1),
_316: x0 => x0.remove(),
_317: x0 => x0.beginPath(),
_326: (x0,x1) => x0.append(x1),
_327: (x0,x1) => x0.append(x1),
_328: (x0,x1) => x0.append(x1),
_329: x0 => x0.remove(),
_330: x0 => x0.focus(),
_331: x0 => x0.focus(),
_332: x0 => x0.remove(),
_333: x0 => x0.focus(),
_334: x0 => x0.remove(),
_335: (x0,x1) => x0.append(x1),
_336: x0 => x0.focus(),
_337: (x0,x1) => x0.append(x1),
_338: x0 => x0.remove(),
_339: (x0,x1) => x0.append(x1),
_340: (x0,x1) => x0.append(x1),
_341: (x0,x1,x2) => x0.insertBefore(x1,x2),
_342: (x0,x1) => x0.append(x1),
_343: (x0,x1,x2) => x0.insertBefore(x1,x2),
_344: x0 => x0.remove(),
_345: x0 => x0.remove(),
_346: x0 => x0.remove(),
_347: (x0,x1) => x0.append(x1),
_348: x0 => x0.remove(),
_349: x0 => x0.remove(),
_350: x0 => x0.getBoundingClientRect(),
_351: x0 => x0.remove(),
_352: x0 => x0.blur(),
_354: x0 => x0.focus(),
_355: x0 => x0.focus(),
_356: x0 => x0.remove(),
_357: x0 => x0.focus(),
_358: x0 => x0.focus(),
_359: x0 => x0.blur(),
_360: x0 => x0.remove(),
_361: (x0,x1) => x0.append(x1),
_362: x0 => x0.clear(),
_363: (x0,x1) => x0.add(x1),
_365: (x0,x1) => x0.appendChild(x1),
_366: x0 => x0.remove(),
_367: (x0,x1) => x0.append(x1),
_368: (x0,x1) => x0.append(x1),
_369: x0 => x0.getBoundingClientRect(),
_370: x0 => x0.getBoundingClientRect(),
_372: (x0,x1) => x0.append(x1),
_373: (x0,x1) => x0.append(x1),
_374: x0 => x0.remove(),
_375: (x0,x1) => x0.append(x1),
_376: (x0,x1,x2) => x0.insertBefore(x1,x2),
_377: (x0,x1) => x0.append(x1),
_378: x0 => x0.focus(),
_379: x0 => x0.focus(),
_380: x0 => x0.focus(),
_381: x0 => x0.focus(),
_382: x0 => x0.focus(),
_383: (x0,x1) => x0.append(x1),
_384: x0 => x0.focus(),
_385: x0 => x0.blur(),
_386: x0 => x0.remove(),
_388: x0 => x0.preventDefault(),
_389: x0 => x0.focus(),
_390: x0 => x0.preventDefault(),
_391: x0 => x0.preventDefault(),
_392: x0 => x0.preventDefault(),
_393: x0 => x0.focus(),
_394: x0 => x0.focus(),
_395: (x0,x1) => x0.append(x1),
_396: x0 => x0.focus(),
_397: x0 => x0.focus(),
_398: x0 => x0.focus(),
_399: x0 => x0.focus(),
_400: (x0,x1) => x0.observe(x1),
_401: x0 => x0.disconnect(),
_402: (x0,x1) => x0.appendChild(x1),
_403: (x0,x1) => x0.appendChild(x1),
_404: (x0,x1) => x0.appendChild(x1),
_405: (x0,x1) => x0.append(x1),
_406: (x0,x1) => x0.append(x1),
_407: (x0,x1) => x0.append(x1),
_408: x0 => x0.remove(),
_409: (x0,x1) => x0.append(x1),
_411: (x0,x1) => x0.appendChild(x1),
_413: (x0,x1) => x0.append(x1),
_415: x0 => x0.remove(),
_416: (x0,x1) => x0.append(x1),
_420: (x0,x1) => x0.appendChild(x1),
_421: x0 => x0.remove(),
_422: x0 => globalThis.window.flutterCanvasKit = x0,
_423: () => globalThis.window.flutterCanvasKit,
_424: () => globalThis.window.flutterCanvasKitLoaded,
_425: x0 => x0.BlendMode,
_426: x0 => x0.PaintStyle,
_427: x0 => x0.StrokeCap,
_430: x0 => x0.TileMode,
_433: x0 => x0.FillType,
_437: x0 => x0.ClipOp,
_440: x0 => x0.RectHeightStyle,
_441: x0 => x0.RectWidthStyle,
_443: x0 => x0.TextAlign,
_444: x0 => x0.TextHeightBehavior,
_445: x0 => x0.TextDirection,
_446: x0 => x0.FontWeight,
_450: x0 => x0.Shader,
_455: (x0,x1) => x0.computeTonalColors(x1),
_457: x0 => x0.ParagraphBuilder,
_463: x0 => x0.NoDecoration,
_464: x0 => x0.UnderlineDecoration,
_465: x0 => x0.OverlineDecoration,
_466: x0 => x0.LineThroughDecoration,
_467: x0 => x0.DecorationStyle,
_468: x0 => x0.TextBaseline,
_471: x0 => x0.TypefaceFontProvider,
_472: x0 => x0.FontCollection,
_473: x0 => x0.Typeface,
_474: (x0,x1,x2) => x0.GetWebGLContext(x1,x2),
_476: (x0,x1,x2) => x0.GetWebGLContext(x1,x2),
_477: (x0,x1) => x0.MakeGrContext(x1),
_478: (x0,x1,x2,x3,x4,x5,x6) => x0.MakeOnScreenGLSurface(x1,x2,x3,x4,x5,x6),
_486: x0 => globalThis.window.CanvasKitInit(x0),
_487: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._487(f,x0,x1)),
_488: () => globalThis.window.flutterCanvasKit.ColorSpace.SRGB,
_498: (x0,x1) => x0.setResourceCacheLimitBytes(x1),
_504: x0 => x0.Thin,
_505: x0 => x0.ExtraLight,
_506: x0 => x0.Light,
_507: x0 => x0.Normal,
_508: x0 => x0.Medium,
_509: x0 => x0.SemiBold,
_510: x0 => x0.Bold,
_511: x0 => x0.ExtraBold,
_512: x0 => x0.ExtraBlack,
_517: x0 => x0.RTL,
_518: x0 => x0.LTR,
_519: x0 => x0.value,
_520: x0 => x0.Left,
_521: x0 => x0.Right,
_522: x0 => x0.Center,
_523: x0 => x0.Justify,
_524: x0 => x0.Start,
_525: x0 => x0.End,
_527: x0 => x0.All,
_528: x0 => x0.DisableFirstAscent,
_529: x0 => x0.DisableLastDescent,
_530: x0 => x0.DisableAll,
_532: x0 => x0.Tight,
_533: x0 => x0.Max,
_534: x0 => x0.IncludeLineSpacingMiddle,
_535: x0 => x0.IncludeLineSpacingTop,
_536: x0 => x0.IncludeLineSpacingBottom,
_537: x0 => x0.Strut,
_539: x0 => x0.Tight,
_540: x0 => x0.Max,
_550: x0 => x0.Difference,
_551: x0 => x0.Intersect,
_553: x0 => x0.Winding,
_554: x0 => x0.EvenOdd,
_567: x0 => x0.Butt,
_568: x0 => x0.Round,
_569: x0 => x0.Square,
_571: x0 => x0.Stroke,
_572: x0 => x0.Fill,
_574: x0 => x0.Clear,
_575: x0 => x0.Src,
_576: x0 => x0.Dst,
_577: x0 => x0.SrcOver,
_578: x0 => x0.DstOver,
_579: x0 => x0.SrcIn,
_580: x0 => x0.DstIn,
_581: x0 => x0.SrcOut,
_582: x0 => x0.DstOut,
_583: x0 => x0.SrcATop,
_584: x0 => x0.DstATop,
_585: x0 => x0.Xor,
_586: x0 => x0.Plus,
_587: x0 => x0.Modulate,
_588: x0 => x0.Screen,
_589: x0 => x0.Overlay,
_590: x0 => x0.Darken,
_591: x0 => x0.Lighten,
_592: x0 => x0.ColorDodge,
_593: x0 => x0.ColorBurn,
_594: x0 => x0.HardLight,
_595: x0 => x0.SoftLight,
_596: x0 => x0.Difference,
_597: x0 => x0.Exclusion,
_598: x0 => x0.Multiply,
_599: x0 => x0.Hue,
_600: x0 => x0.Saturation,
_601: x0 => x0.Color,
_602: x0 => x0.Luminosity,
_608: x0 => x0.Clamp,
_609: x0 => x0.Repeat,
_610: x0 => x0.Mirror,
_611: x0 => x0.Decal,
_658: (x0,x1,x2,x3,x4,x5,x6) => x0.MakeLinearGradient(x1,x2,x3,x4,x5,x6),
_666: (x0,x1) => x0.setStrokeWidth(x1),
_670: (x0,x1) => x0.setAntiAlias(x1),
_671: (x0,x1) => x0.setColorInt(x1),
_696: () => globalThis.Float32Array,
_698: (x0,x1) => globalThis.window.flutterCanvasKit.Malloc(x0,x1),
_702: x0 => x0.toTypedArray(),
_708: (x0,x1,x2,x3) => x0.addOval(x1,x2,x3),
_711: (x0,x1,x2) => x0.addRRect(x1,x2),
_713: (x0,x1) => x0.addRect(x1),
_714: (x0,x1,x2,x3,x4) => x0.arcToOval(x1,x2,x3,x4),
_718: (x0,x1,x2) => x0.contains(x1,x2),
_721: x0 => x0.getBounds(),
_737: (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9) => x0.transform(x1,x2,x3,x4,x5,x6,x7,x8,x9),
_748: (x0,x1,x2) => x0.beginRecording(x1,x2),
_751: (x0,x1) => x0.clear(x1),
_752: (x0,x1,x2,x3) => x0.clipPath(x1,x2,x3),
_754: (x0,x1,x2,x3) => x0.clipRRect(x1,x2,x3),
_755: (x0,x1,x2,x3) => x0.clipRect(x1,x2,x3),
_758: (x0,x1,x2,x3,x4,x5) => x0.drawArc(x1,x2,x3,x4,x5),
_760: (x0,x1,x2,x3,x4) => x0.drawCircle(x1,x2,x3,x4),
_763: (x0,x1,x2,x3) => x0.drawDRRect(x1,x2,x3),
_770: (x0,x1,x2) => x0.drawOval(x1,x2),
_774: (x0,x1,x2) => x0.drawRRect(x1,x2),
_775: (x0,x1,x2) => x0.drawRect(x1,x2),
_777: (x0,x1,x2,x3,x4,x5,x6,x7) => x0.drawShadow(x1,x2,x3,x4,x5,x6,x7),
_779: x0 => x0.save(),
_781: (x0,x1,x2,x3,x4) => x0.saveLayer(x1,x2,x3,x4),
_784: (x0,x1,x2,x3) => x0.rotate(x1,x2,x3),
_788: (x0,x1) => x0.concat(x1),
_789: (x0,x1,x2) => x0.translate(x1,x2),
_793: (x0,x1,x2,x3) => x0.drawParagraph(x1,x2,x3),
_795: x0 => x0.cullRect(),
_799: (x0,x1) => x0.addText(x1),
_805: x0 => x0.getText(),
_807: (x0,x1) => x0.setWordsUtf16(x1),
_809: (x0,x1) => x0.setGraphemeBreaksUtf16(x1),
_812: (x0,x1) => x0.setLineBreaksUtf16(x1),
_815: (x0,x1) => x0.textAlign = x1,
_816: (x0,x1) => x0.textDirection = x1,
_817: (x0,x1) => x0.heightMultiplier = x1,
_818: (x0,x1) => x0.textHeightBehavior = x1,
_820: (x0,x1) => x0.ellipsis = x1,
_821: (x0,x1) => x0.textStyle = x1,
_823: (x0,x1) => x0.replaceTabCharacters = x1,
_824: (x0,x1) => x0.applyRoundingHack = x1,
_825: x0 => x0.Solid,
_826: x0 => x0.Double,
_827: x0 => x0.Dotted,
_828: x0 => x0.Dashed,
_829: x0 => x0.Wavy,
_831: x0 => x0.Alphabetic,
_832: x0 => x0.Ideographic,
_841: (x0,x1) => x0.backgroundColor = x1,
_842: (x0,x1) => x0.color = x1,
_844: (x0,x1) => x0.decoration = x1,
_845: (x0,x1) => x0.decorationThickness = x1,
_846: (x0,x1) => x0.decorationColor = x1,
_847: (x0,x1) => x0.decorationStyle = x1,
_848: (x0,x1) => x0.textBaseline = x1,
_849: (x0,x1) => x0.fontSize = x1,
_850: (x0,x1) => x0.letterSpacing = x1,
_851: (x0,x1) => x0.wordSpacing = x1,
_852: (x0,x1) => x0.heightMultiplier = x1,
_853: (x0,x1) => x0.halfLeading = x1,
_855: (x0,x1) => x0.fontFamilies = x1,
_856: (x0,x1) => x0.fontStyle = x1,
_859: (x0,x1) => x0.fontVariations = x1,
_868: (x0,x1) => x0.weight = x1,
_875: (x0,x1) => x0.axis = x1,
_876: (x0,x1) => x0.value = x1,
_878: (x0,x1) => x0.getGlyphIDs(x1),
_879: (x0,x1,x2,x3) => x0.getGlyphBounds(x1,x2,x3),
_884: (x0,x1,x2) => x0.registerFont(x1,x2),
_900: x0 => x0.graphemeLayoutBounds,
_901: x0 => x0.dir,
_902: x0 => x0.graphemeClusterTextRange,
_903: x0 => x0.rect,
_905: x0 => x0.dir,
_907: x0 => x0.getAlphabeticBaseline(),
_908: x0 => x0.didExceedMaxLines(),
_909: x0 => x0.getHeight(),
_910: x0 => x0.getIdeographicBaseline(),
_915: x0 => x0.getLongestLine(),
_916: x0 => x0.getMaxIntrinsicWidth(),
_917: x0 => x0.getMinIntrinsicWidth(),
_918: x0 => x0.getMaxWidth(),
_919: (x0,x1,x2,x3,x4) => x0.getRectsForRange(x1,x2,x3,x4),
_921: x0 => x0.getRectsForPlaceholders(),
_924: (x0,x1,x2) => x0.getClosestGlyphInfoAtCoordinate(x1,x2),
_926: (x0,x1) => x0.layout(x1),
_930: x0 => x0.start,
_931: x0 => x0.end,
_933: x0 => x0.ambient,
_934: x0 => x0.spot,
_939: (x0,x1) => x0.MakeFreeTypeFaceFromData(x1),
_941: x0 => x0.isDeleted(),
_966: x0 => globalThis.window.flutterCanvasKit.RuntimeEffect.Make(x0),
_967: (x0,x1) => x0.makeShader(x1),
_969: (x0,x1,x2) => x0.makeShaderWithChildren(x1,x2),
_970: x0 => x0.remove(),
_971: x0 => x0.remove(),
_972: (x0,x1) => x0.appendChild(x1),
_974: () => globalThis.window.flutterConfiguration,
_975: x0 => x0.assetBase,
_976: x0 => x0.canvasKitBaseUrl,
_977: x0 => x0.canvasKitVariant,
_978: x0 => x0.canvasKitForceCpuOnly,
_979: x0 => x0.debugShowSemanticsNodes,
_980: x0 => x0.hostElement,
_981: x0 => x0.multiViewEnabled,
_982: x0 => x0.nonce,
_983: x0 => x0.renderer,
_984: x0 => x0.useColorEmoji,
_985: () => globalThis.window.flutterWebRenderer,
_988: x0 => x0.console,
_989: x0 => x0.devicePixelRatio,
_990: x0 => x0.document,
_991: x0 => x0.history,
_992: x0 => x0.innerHeight,
_993: x0 => x0.innerWidth,
_994: x0 => x0.location,
_995: x0 => x0.navigator,
_996: x0 => x0.visualViewport,
_997: x0 => x0.performance,
_998: (x0,x1) => x0.fetch(x1),
_1001: (x0,x1) => x0.dispatchEvent(x1),
_1002: (x0,x1) => x0.matchMedia(x1),
_1003: (x0,x1) => x0.getComputedStyle(x1),
_1005: x0 => x0.screen,
_1006: (x0,x1) => x0.requestAnimationFrame(x1),
_1007: f => finalizeWrapper(f,x0 => dartInstance.exports._1007(f,x0)),
_1010: x0 => x0.trustedTypes,
_1011: (x0,x1) => x0.warn(x1),
_1013: (x0,x1) => x0.error(x1),
_1014: (x0,x1) => x0.debug(x1),
_1015: () => globalThis.window,
_1016: () => globalThis.Intl,
_1017: () => globalThis.Symbol,
_1019: (x0,x1,x2,x3,x4) => globalThis.createImageBitmap(x0,x1,x2,x3,x4),
_1020: x0 => x0.clipboard,
_1021: x0 => x0.maxTouchPoints,
_1022: x0 => x0.vendor,
_1023: x0 => x0.language,
_1024: x0 => x0.platform,
_1025: x0 => x0.userAgent,
_1026: x0 => x0.languages,
_1027: x0 => x0.documentElement,
_1029: (x0,x1) => x0.querySelector(x1),
_1031: (x0,x1) => x0.createElement(x1),
_1034: (x0,x1) => x0.execCommand(x1),
_1036: (x0,x1,x2) => x0.createElementNS(x1,x2),
_1037: (x0,x1) => x0.createTextNode(x1),
_1038: (x0,x1) => x0.createEvent(x1),
_1042: x0 => x0.fonts,
_1043: x0 => x0.head,
_1044: x0 => x0.body,
_1045: (x0,x1) => x0.title = x1,
_1048: x0 => x0.activeElement,
_1051: () => globalThis.document,
_1052: (x0,x1,x2) => x0.addEventListener(x1,x2),
_1053: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1055: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1056: (x0,x1,x2) => x0.removeEventListener(x1,x2),
_1057: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
_1059: f => finalizeWrapper(f,x0 => dartInstance.exports._1059(f,x0)),
_1060: x0 => x0.target,
_1062: x0 => x0.timeStamp,
_1063: x0 => x0.type,
_1064: x0 => x0.preventDefault(),
_1068: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
_1073: x0 => x0.firstChild,
_1076: x0 => x0.lastChild,
_1079: x0 => x0.parentElement,
_1081: x0 => x0.parentNode,
_1084: (x0,x1) => x0.removeChild(x1),
_1085: (x0,x1) => x0.removeChild(x1),
_1086: x0 => x0.isConnected,
_1087: (x0,x1) => x0.textContent = x1,
_1088: (x0,x1) => x0.cloneNode(x1),
_1089: (x0,x1) => x0.contains(x1),
_1093: x0 => x0.children,
_1097: x0 => x0.clientHeight,
_1098: x0 => x0.clientWidth,
_1099: x0 => x0.id,
_1100: (x0,x1) => x0.id = x1,
_1103: (x0,x1) => x0.spellcheck = x1,
_1104: x0 => x0.tagName,
_1105: x0 => x0.style,
_1107: (x0,x1) => x0.append(x1),
_1111: x0 => x0.getBoundingClientRect(),
_1117: (x0,x1) => x0.querySelectorAll(x1),
_1118: x0 => x0.remove(),
_1119: (x0,x1,x2) => x0.setAttribute(x1,x2),
_1120: (x0,x1) => x0.removeAttribute(x1),
_1121: (x0,x1) => x0.tabIndex = x1,
_1125: x0 => x0.scrollTop,
_1126: (x0,x1) => x0.scrollTop = x1,
_1127: x0 => x0.scrollLeft,
_1128: (x0,x1) => x0.scrollLeft = x1,
_1129: x0 => x0.classList,
_1130: (x0,x1) => x0.className = x1,
_1134: (x0,x1) => x0.getElementsByClassName(x1),
_1135: x0 => x0.click(),
_1136: (x0,x1) => x0.hasAttribute(x1),
_1139: (x0,x1) => x0.attachShadow(x1),
_1142: (x0,x1) => x0.getPropertyValue(x1),
_1144: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
_1146: (x0,x1) => x0.removeProperty(x1),
_1148: x0 => x0.offsetLeft,
_1149: x0 => x0.offsetTop,
_1150: x0 => x0.offsetParent,
_1152: (x0,x1) => x0.name = x1,
_1153: x0 => x0.content,
_1154: (x0,x1) => x0.content = x1,
_1164: (x0,x1) => x0.src = x1,
_1165: (x0,x1) => x0.nonce = x1,
_1167: (x0,x1) => x0.nonce = x1,
_1172: x0 => x0.now(),
_1174: (x0,x1) => x0.width = x1,
_1176: (x0,x1) => x0.height = x1,
_1179: (x0,x1) => x0.toDataURL(x1),
_1180: (x0,x1) => x0.getContext(x1),
_1181: (x0,x1,x2) => x0.getContext(x1,x2),
_1182: (x0,x1) => x0.getParameter(x1),
_1183: x0 => x0.SAMPLES,
_1184: x0 => x0.STENCIL_BITS,
_1186: x0 => x0.fillStyle,
_1187: (x0,x1) => x0.fillStyle = x1,
_1188: x0 => x0.font,
_1189: (x0,x1) => x0.font = x1,
_1191: (x0,x1) => x0.direction = x1,
_1192: (x0,x1) => x0.lineWidth = x1,
_1193: (x0,x1) => x0.strokeStyle = x1,
_1194: x0 => x0.strokeStyle,
_1200: (x0,x1,x2,x3,x4) => x0.createLinearGradient(x1,x2,x3,x4),
_1201: (x0,x1,x2) => x0.createPattern(x1,x2),
_1204: (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9) => x0.drawImage(x1,x2,x3,x4,x5,x6,x7,x8,x9),
_1205: x0 => x0.fill(),
_1206: (x0,x1) => x0.fill(x1),
_1207: (x0,x1,x2,x3,x4) => x0.fillRect(x1,x2,x3,x4),
_1208: (x0,x1,x2,x3) => x0.fillText(x1,x2,x3),
_1213: (x0,x1,x2) => x0.lineTo(x1,x2),
_1215: (x0,x1) => x0.measureText(x1),
_1217: (x0,x1,x2) => x0.moveTo(x1,x2),
_1218: x0 => x0.save(),
_1220: (x0,x1,x2,x3,x4) => x0.rect(x1,x2,x3,x4),
_1223: x0 => x0.restore(),
_1225: (x0,x1,x2,x3,x4,x5,x6) => x0.setTransform(x1,x2,x3,x4,x5,x6),
_1227: (x0,x1,x2,x3,x4,x5,x6) => x0.transform(x1,x2,x3,x4,x5,x6),
_1228: x0 => x0.clip(),
_1229: (x0,x1) => x0.clip(x1),
_1230: (x0,x1,x2) => x0.scale(x1,x2),
_1231: (x0,x1,x2,x3,x4) => x0.clearRect(x1,x2,x3,x4),
_1232: (x0,x1,x2) => x0.translate(x1,x2),
_1233: (x0,x1) => x0.rotate(x1),
_1234: (x0,x1,x2,x3,x4,x5,x6) => x0.bezierCurveTo(x1,x2,x3,x4,x5,x6),
_1235: (x0,x1,x2,x3,x4) => x0.quadraticCurveTo(x1,x2,x3,x4),
_1236: (x0,x1) => x0.globalCompositeOperation = x1,
_1237: (x0,x1) => x0.lineCap = x1,
_1238: (x0,x1) => x0.lineJoin = x1,
_1239: (x0,x1) => x0.shadowBlur = x1,
_1240: (x0,x1,x2,x3,x4,x5,x6) => x0.arc(x1,x2,x3,x4,x5,x6),
_1241: (x0,x1) => x0.filter = x1,
_1242: (x0,x1) => x0.shadowOffsetX = x1,
_1243: (x0,x1) => x0.shadowOffsetY = x1,
_1244: (x0,x1) => x0.shadowColor = x1,
_1246: (x0,x1,x2,x3,x4,x5,x6,x7,x8) => x0.ellipse(x1,x2,x3,x4,x5,x6,x7,x8),
_1248: (x0,x1,x2,x3) => x0.strokeText(x1,x2,x3),
_1249: (x0,x1) => x0.globalAlpha = x1,
_1254: x0 => x0.width,
_1255: x0 => x0.height,
_1257: (x0,x1,x2) => x0.addColorStop(x1,x2),
_1258: x0 => x0.status,
_1260: x0 => x0.body,
_1261: x0 => x0.arrayBuffer(),
_1267: x0 => x0.read(),
_1268: x0 => x0.value,
_1269: x0 => x0.done,
_1270: x0 => x0.width,
_1272: x0 => x0.x,
_1273: x0 => x0.y,
_1274: x0 => x0.width,
_1275: x0 => x0.height,
_1276: x0 => x0.top,
_1277: x0 => x0.right,
_1278: x0 => x0.bottom,
_1279: x0 => x0.left,
_1280: x0 => x0.load(),
_1289: x0 => x0.height,
_1290: x0 => x0.width,
_1291: (x0,x1) => x0.value = x1,
_1293: (x0,x1) => x0.placeholder = x1,
_1294: (x0,x1) => x0.name = x1,
_1295: x0 => x0.selectionDirection,
_1296: x0 => x0.selectionStart,
_1297: x0 => x0.selectionEnd,
_1300: x0 => x0.value,
_1301: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
_1305: x0 => x0.readText(),
_1306: (x0,x1) => x0.writeText(x1),
_1307: x0 => x0.altKey,
_1308: x0 => x0.code,
_1309: x0 => x0.ctrlKey,
_1310: x0 => x0.key,
_1311: x0 => x0.keyCode,
_1312: x0 => x0.location,
_1313: x0 => x0.metaKey,
_1314: x0 => x0.repeat,
_1315: x0 => x0.shiftKey,
_1316: x0 => x0.isComposing,
_1317: (x0,x1) => x0.getModifierState(x1),
_1318: x0 => x0.state,
_1320: (x0,x1) => x0.go(x1),
_1322: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
_1323: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
_1324: x0 => x0.pathname,
_1325: x0 => x0.search,
_1326: x0 => x0.hash,
_1329: x0 => x0.state,
_1333: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1333(f,x0,x1)),
_1335: (x0,x1,x2) => x0.observe(x1,x2),
_1338: x0 => x0.attributeName,
_1339: x0 => x0.type,
_1340: x0 => x0.matches,
_1343: x0 => x0.matches,
_1344: x0 => x0.clientX,
_1345: x0 => x0.clientY,
_1346: x0 => x0.offsetX,
_1347: x0 => x0.offsetY,
_1350: x0 => x0.button,
_1351: x0 => x0.buttons,
_1352: x0 => x0.ctrlKey,
_1353: (x0,x1) => x0.getModifierState(x1),
_1354: x0 => x0.pointerId,
_1355: x0 => x0.pointerType,
_1356: x0 => x0.pressure,
_1357: x0 => x0.tiltX,
_1358: x0 => x0.tiltY,
_1359: x0 => x0.getCoalescedEvents(),
_1360: x0 => x0.deltaX,
_1361: x0 => x0.deltaY,
_1362: x0 => x0.wheelDeltaX,
_1363: x0 => x0.wheelDeltaY,
_1364: x0 => x0.deltaMode,
_1369: x0 => x0.changedTouches,
_1371: x0 => x0.clientX,
_1372: x0 => x0.clientY,
_1373: x0 => x0.data,
_1374: (x0,x1) => x0.type = x1,
_1375: (x0,x1) => x0.max = x1,
_1376: (x0,x1) => x0.min = x1,
_1377: (x0,x1) => x0.value = x1,
_1378: x0 => x0.value,
_1379: x0 => x0.disabled,
_1380: (x0,x1) => x0.disabled = x1,
_1381: (x0,x1) => x0.placeholder = x1,
_1382: (x0,x1) => x0.name = x1,
_1383: (x0,x1) => x0.autocomplete = x1,
_1384: x0 => x0.selectionDirection,
_1385: x0 => x0.selectionStart,
_1386: x0 => x0.selectionEnd,
_1389: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
_1395: (x0,x1) => x0.add(x1),
_1399: (x0,x1) => x0.noValidate = x1,
_1400: (x0,x1) => x0.method = x1,
_1401: (x0,x1) => x0.action = x1,
_1404: (x0,x1) => x0.height = x1,
_1405: (x0,x1) => x0.width = x1,
_1406: (x0,x1) => x0.getContext(x1),
_1407: (x0,x1,x2) => x0.getContext(x1,x2),
_1426: x0 => x0.orientation,
_1427: x0 => x0.width,
_1428: x0 => x0.height,
_1430: (x0,x1) => x0.lock(x1),
_1446: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1446(f,x0,x1)),
_1451: x0 => x0.contentRect,
_1453: (x0,x1,x2) => x0.createPolicy(x1,x2),
_1454: (x0,x1) => x0.createScriptURL(x1),
_1457: x0 => x0.length,
_1458: (x0,x1) => x0.item(x1),
_1459: x0 => x0.length,
_1460: (x0,x1) => x0.item(x1),
_1461: x0 => x0.iterator,
_1462: x0 => x0.Segmenter,
_1463: x0 => x0.v8BreakIterator,
_1464: (x0,x1) => x0.segment(x1),
_1466: x0 => x0.done,
_1467: x0 => x0.value,
_1468: x0 => x0.index,
_1472: (x0,x1) => x0.adoptText(x1),
_1473: x0 => x0.first(),
_1474: x0 => x0.next(),
_1476: x0 => x0.current(),
_1479: () => globalThis.window.FinalizationRegistry,
_1480: (x0,x1,x2) => x0.register(x1,x2),
_1483: () => globalThis.window.OffscreenCanvas,
_1484: () => globalThis.window.createImageBitmap,
_1488: x0 => x0.hostElement,
_1490: x0 => x0.loader,
_1491: () => globalThis._flutter,
_1492: (x0,x1) => x0.didCreateEngineInitializer(x1),
_1493: (x0,x1,x2) => x0.call(x1,x2),
_1494: () => globalThis.Promise,
_1495: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1495(f,x0,x1)),
_1563: f => finalizeWrapper(f,x0 => dartInstance.exports._1563(f,x0)),
_1564: f => finalizeWrapper(f,x0 => dartInstance.exports._1564(f,x0)),
_1632: (decoder, codeUnits) => decoder.decode(codeUnits),
_1633: () => new TextDecoder("utf-8", {fatal: true}),
_1634: () => new TextDecoder("utf-8", {fatal: false})
      };

    const baseImports = {
        dart2wasm: dart2wasm,

  
          Math: Math,
        Date: Date,
        Object: Object,
        Array: Array,
        Reflect: Reflect,
    };
    dartInstance = await WebAssembly.instantiate(await modulePromise, {
        ...baseImports,
        ...(await importObjectPromise),
    });

    return dartInstance;
}

// Call the main function for the instantiated module
// `moduleInstance` is the instantiated dart2wasm module
// `args` are any arguments that should be passed into the main function.
export const invoke = (moduleInstance, ...args) => {
    const dartMain = moduleInstance.exports.$getMain();
    const dartArgs = buildArgsList(args);
    moduleInstance.exports.$invokeMain(dartMain, dartArgs);
}
