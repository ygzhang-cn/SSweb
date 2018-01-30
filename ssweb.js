/*! 
 * SSweb Library
 * SSweb is a JS prototype or an extension library of its own.
 * @version 1.5.1 01/19/2018
 * @author ygzhang.cn@msn.com
 * @link https://github.com/ygzhang-cn/SSweb
 * @copyright 2015-2018 Kunming Dongring Technology Co., Ltd.
 * -----------------------------------------------------
 * SSweb (被前端狗称为丝袜库)用于公司传统网页前端项目常用JS基础&工具库,支持传统方式引入或AMD/CMD方式加载
 * 
 * 造轮子的目的或目标：传统网页前端项目需要考虑N多兼容问题，使用频繁且繁琐，几代前端早的小轮子,经过N个项目不断修正迭代的JS原型或其SSweb自身的扩展库
 * 1、对于IE/6/7/8这种古董浏览器，丝袜库尝试检查并扩展ES5几个很常用原生方法（支持动态扩展定义或关闭）
 * 
 * (trimLeft/trimRight/forEach/map/some/every/filter/indexOf/lastIndexOf/JSON)
 * 引入或AMD/CMD加载时，文件后缀增加查询参数即可关闭原生扩展, 如 ../ssweb.min.js?prototypeExtend=0
 * 
 * 2、实现了类似JQ的扩展插件机制（SSweb.extend/SSweb.fn.extend）
 */
(function(window) {
    'use strict';
    window.console = window.console || { log: function() {}, debug: function() {}, info: function() {}, warn: function() {}, error: function() {} };
    var _SSweb = window.SSweb || {},
        SSweb = function(obj) {
            return new SSweb.fn.instance((obj !== void 0 ? obj : undefined));
        },
        _obj_types = {
            '[object Array]': 'array',
            '[object Boolean]': 'boolean',
            '[object Date]': 'date',
            '[object Function]': 'function',
            '[object Number]': 'number',
            '[object Object]': 'object',
            '[object RegExp]': 'regexp',
            '[object String]': 'string'
        },
        _run_args = {
            debug: 0,
            prototypeExtend: 1
        };
    /*
     * 取得正在解析的Script SRC , 参考 司徒正美 方法实现
     * @link https://www.cnblogs.com/rubylouvre/archive/2013/01/23/2872618.html
     */
    SSweb.currentScript = function(_window, _document) {
        var Win = _window || window;
        var Dom = _document || document;
        if (Dom.currentScript) { //firefox 4+
            return Dom.currentScript.src;
        }
        var stack;
        try {
            a.b.c();
        } catch (e) {
            stack = e.stack;
            if (!stack && Win.opera) {
                stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
            }
        }
        if (stack) {
            stack = stack.split(/[@ ]/g).pop();
            stack = stack[0] == "(" ? stack.slice(1, -1) : stack;
            return stack.replace(/(:\d+)?:\d+$/i, "");
        }
        var nodes = Dom.getElementsByTagName("script");
        for (var i = 0, node; node = nodes[i++];) {
            if (node.readyState === "interactive") {
                return node.className = node.src;
            }
        }
        return '';
    };

    (function() {
        var src = SSweb.currentScript();
        if (typeof src == 'string' && src.indexOf("?") > 0 && src.indexOf("=")) {
            src = src.substr(src.indexOf("?") + 1).split("&");
            var kv, i, l = src.length,
                args = {};
            for (i = 0; i < l; i++) {
                var kv = src[i].split("=");
                if (kv.length > 1 && typeof kv[0] == 'string' && _run_args.hasOwnProperty(kv[0])) {
                    _run_args[kv[0]] = kv[1] == 0 ? 0 : (kv[1] == 1 ? 1 : kv[1]);
                }
            }
        }
    })();
    _run_args.debug && console.info('SSweb Runing Args:');
    _run_args.debug && console.info(_run_args)

    /*
    是否检查并扩展ES5几个很常用原生方法
    */
    if (_run_args.prototypeExtend) {
        if (!String.prototype.trim) {
            console.info('SSweb Extend: String.prototype.trim');
            String.prototype.trim = function() {
                return this.replace(/(^\s*)|(\s*$)/g, '');
            };
        }
        if (!String.prototype.trimLeft) {
            console.info('SSweb Extend: String.prototype.trimLeft');
            String.prototype.trimLeft = function() {
                return this.replace(/(^\s*)/g, '');
            };
        }
        if (!String.prototype.trimRight) {
            console.info('SSweb Extend: String.prototype.trimRight');
            String.prototype.trimRight = function() {
                return this.replace(/(\s*$)/g, '');
            };
        }
        /*
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
         */
        if (!Array.isArray) {
            console.info('SSweb Extend: Array.isArray');
            Array.isArray = function(arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }
        /*
        Array.forEach(callback[, thisArg])  Aand Object{LikeArray}.forEach(callback[, thisArg])
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
        */
        if (!Array.prototype.forEach) {
            console.info('SSweb Extend: Array.prototype.forEach');
            Array.prototype.forEach = function(callback /*function(currentValue[, index[, array]){}[,thisArg]*/ ) {
                var T, k;
                if (this == null) {
                    throw new TypeError('this is null or not defined');
                }
                var O = Object(this);
                var len = O.length >>> 0;
                if (typeof callback !== 'function') {
                    throw new TypeError(callback + ' is not a function');
                }
                if (arguments.length > 1) {
                    T = arguments[1];
                }
                k = 0;
                while (k < len) {
                    var kValue;
                    if (k in O) {
                        kValue = O[k];
                        callback.call(T, kValue, k, O);
                    }
                    k++;
                }
            };
        }
        /*
        Array.map(callback[, thisArg])  Aand Object{LikeArray}.map(callback[, thisArg])
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
        */
        if (!Array.prototype.map) {
            console.info('SSweb Extend: Array.prototype.map');
            Array.prototype.map = function(callback /*function(currentValue[, index[, array]){}[,thisArg]*/ ) {
                var T, A, k;
                if (this == null) {
                    throw new TypeError('this is null or not defined');
                }
                var O = Object(this);
                var len = O.length >>> 0;
                if (typeof callback !== 'function') {
                    throw new TypeError(callback + ' is not a function');
                }
                if (arguments.length > 1) {
                    T = arguments[1];
                }
                A = new Array(len);
                k = 0;
                while (k < len) {
                    var kValue, mappedValue;
                    if (k in O) {
                        kValue = O[k];
                        mappedValue = callback.call(T, kValue, k, O);
                        A[k] = mappedValue;
                    }
                    k++;
                }
                return A;
            };
        }
        /*
        Array.some(callback[, thisArg])  Aand Object{LikeArray}.some(callback[, thisArg])
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
        */
        if (!Array.prototype.some) {
            console.info('SSweb Extend: Array.prototype.some');
            Array.prototype.some = function(callback /*function(currentValue[, index[, array]){}[,thisArg]*/ ) {

                if (this == null) {
                    throw new TypeError('Array.prototype.some called on null or undefined');
                }

                if (typeof callback !== 'function') {
                    throw new TypeError('Array.prototype.some callback not function');
                }
                var t = Object(this);
                var len = t.length >>> 0;
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for (var i = 0; i < len; i++) {
                    if (i in t && callback.call(thisArg, t[i], i, t)) {
                        return true;
                    }
                }
                return false;
            };
        }
        /*
        Array.every(callback[, thisArg])  Aand Object{LikeArray}.every(callback[, thisArg])
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
        */
        if (!Array.prototype.every) {
            console.info('SSweb Extend: Array.prototype.every');
            Array.prototype.every = function(callback /*function(currentValue[, index[, array]){}[,thisArg]*/ ) {
                var T, k;
                if (this == null) {
                    throw new TypeError('this is null or not defined');
                }
                var O = Object(this);
                var len = O.length >>> 0;
                if (typeof callback !== 'function') {
                    throw new TypeError();
                }
                if (arguments.length > 1) {
                    T = thisArg;
                }
                k = 0;
                while (k < len) {
                    var kValue;
                    if (k in O) {
                        kValue = O[k];
                        var testResult = callback.call(T, kValue, k, O);
                        if (!testResult) {
                            return false;
                        }
                    }
                    k++;
                }
                return true;
            };
        }
        /*
        Array.filter (callback[, thisArg])  Aand Object{LikeArray}.filter (callback[, thisArg])
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter 
        */
        if (!Array.prototype.filter) {
            console.info('SSweb Extend: Array.prototype.filter');
            Array.prototype.filter = function(callback /*function(currentValue[, index[, array]){}[,thisArg]*/ ) {
                if (!(typeof callback === 'function' && this))
                    throw new TypeError();
                var len = this.length >>> 0,
                    res = new Array(len),
                    t = this,
                    c = 0,
                    i = -1;
                if (thisArg === undefined)
                    while (++i !== len)
                        if (i in this)
                            if (callback(t[i], i, t))
                                res[c++] = t[i];
                            else
                                while (++i !== len)
                                    if (i in this)
                                        if (callback.call(thisArg, t[i], i, t))
                                            res[c++] = t[i];

                res.length = c;
                return res;
            };
        }
        /*
        Array.indexOf(searchElement[, fromIndex])
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
        */
        if (!Array.prototype.indexOf) {
            console.info('SSweb Extend: Array.prototype.indexOf');
            Array.prototype.indexOf = function(member, startFrom) {
                if (this == null) {
                    throw new TypeError('Array.prototype.indexOf() - can\'t convert `' + this + '` to object');
                }
                var
                    index = isFinite(startFrom) ? Math.floor(startFrom) : 0,
                    that = this instanceof Object ? this : new Object(this),
                    length = isFinite(that.length) ? Math.floor(that.length) : 0;

                if (index >= length) {
                    return -1;
                }

                if (index < 0) {
                    index = Math.max(length + index, 0);
                }

                if (member === undefined) {
                    /*
                      Since `member` is undefined, keys that don't exist will have the same
                      value as `member`, and thus do need to be checked.
                    */
                    do {
                        if (index in that && that[index] === undefined) {
                            return index;
                        }
                    } while (++index < length);
                } else {
                    do {
                        if (that[index] === member) {
                            return index;
                        }
                    } while (++index < length);
                }

                return -1;
            };
        }
        /*
        Array.lastIndexOf(searchElement, fromIndex)
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
        */
        if (!Array.prototype.lastIndexOf) {
            console.info('SSweb Extend: Array.prototype.lastIndexOf');
            Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/ ) {
                if (this === void 0 || this === null) {
                    throw new TypeError();
                }
                var n, k,
                    t = Object(this),
                    len = t.length >>> 0;
                if (len === 0) {
                    return -1;
                }
                n = len - 1;
                if (arguments.length > 1) {
                    n = Number(arguments[1]);
                    if (n != n) {
                        n = 0;
                    } else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
                        n = (n > 0 || -1) * Math.floor(Math.abs(n));
                    }
                }
                for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
                    if (k in t && t[k] === searchElement) {
                        return k;
                    }
                }
                return -1;
            };
        }
        /*
         * https://github.com/douglascrockford/JSON-js/blob/master/json2.js
         */
        if (typeof JSON !== "object") {
            console.info('SSweb Extend: JSON');
            JSON = {};
            ! function() {
                function f(a) {
                    return 10 > a ? "0" + a : a;
                }

                function this_value() {
                    return this.valueOf();
                }

                function quote(a) {
                    return rx_escapable.lastIndex = 0, rx_escapable.test(a) ? '"' + a.replace(rx_escapable, function(a) {
                        var b = meta[a];
                        return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                    }) + '"' : '"' + a + '"';
                }

                function str(a, b) {
                    var c, d, e, f, h, g = gap,
                        i = b[a];
                    switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(a)),
                        "function" == typeof rep && (i = rep.call(b, a, i)), typeof i) {
                        case "string":
                            return quote(i);

                        case "number":
                            return isFinite(i) ? String(i) : "null";

                        case "boolean":
                        case "null":
                            return String(i);

                        case "object":
                            if (!i) return "null";
                            if (gap += indent, h = [], "[object Array]" === Object.prototype.toString.apply(i)) {
                                for (f = i.length, c = 0; f > c; c += 1) h[c] = str(c, i) || "null";
                                return e = 0 === h.length ? "[]" : gap ? "[\n" + gap + h.join(",\n" + gap) + "\n" + g + "]" : "[" + h.join(",") + "]",
                                    gap = g, e;
                            }
                            if (rep && "object" == typeof rep)
                                for (f = rep.length, c = 0; f > c; c += 1) "string" == typeof rep[c] && (d = rep[c],
                                    e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e));
                            else
                                for (d in i) Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i),
                                    e && h.push(quote(d) + (gap ? ": " : ":") + e));
                            return e = 0 === h.length ? "{}" : gap ? "{\n" + gap + h.join(",\n" + gap) + "\n" + g + "}" : "{" + h.join(",") + "}",
                                gap = g, e;
                    }
                }
                var gap, indent, meta, rep, rx_one = /^[\],:{}\s]*$/,
                    rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                    rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                    rx_four = /(?:^|:|,)(?:\s*\[)+/g,
                    rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
                "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
                        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
                    }, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value,
                    String.prototype.toJSON = this_value), "function" != typeof JSON.stringify && (meta = {
                    "\b": "\\b",
                    "   ": "\\t",
                    "\n": "\\n",
                    "\f": "\\f",
                    "\r": "\\r",
                    '"': '\\"',
                    "\\": "\\\\"
                }, JSON.stringify = function(a, b, c) {
                    var d;
                    if (gap = "", indent = "", "number" == typeof c)
                        for (d = 0; c > d; d += 1) indent += " ";
                    else "string" == typeof c && (indent = c);
                    if (rep = b, b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length)) throw new Error("JSON.stringify");
                    return str("", {
                        "": a
                    });
                }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
                    function walk(a, b) {
                        var c, d, e = a[b];
                        if (e && "object" == typeof e)
                            for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c),
                                void 0 !== d ? e[c] = d : delete e[c]);
                        return reviver.call(a, b, e);
                    }
                    var j;
                    if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function(a) {
                            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                        })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) return j = eval("(" + text + ")"),
                        "function" == typeof reviver ? walk({
                            "": j
                        }, "") : j;
                    throw new SyntaxError("JSON.parse");
                }), window.JSON = JSON;
            }();

        }
    }
    SSweb.fn = SSweb.prototype = {
        SSweb: '1.0.3',
        constructor: SSweb,
        selector_type: undefined,
        selector_obj: undefined,
        instance: function(_that) {
            if (_that !== void 0) {
                this.selector_obj = _that;
                this.selector_type = SSweb.objectType(_that);
            }
            //SSweb.log('SSweb.selector_obj:'+this.selector_obj);
            //SSweb.log('SSweb.selector_type:'+this.selector_type);
            return this;
        },
        length: 0,
        toArray: function() {
            return Array.prototype.slice.call(this);
        }
    };
    SSweb.fn.instance.prototype = SSweb.fn;
    SSweb.extend = SSweb.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === 'boolean') {
            //第一个参数表示是否要深递归，类型是布尔值
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }
        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== 'object' && !SSweb.isFunction(target)) {
            target = {};
        }
        // extend jQuery itself if only one argument is passed
        if (length === i) {
            //$('#id').extend(dest)的时候
            target = this;
            --i;
        }
        for (; i < length; i++) { //可以传入多个复制源
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                //将每个源的属性全部复制到target上
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        //防止有环，例如 extend(true, target, {'target':target});
                        continue;
                    }
                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (SSweb.isPlainObject(copy) || (copyIsArray = SSweb.isArray(copy)))) {
                        //如果是深复制
                        if (copyIsArray) {
                            copyIsArray = false; //这句话我认为是多余的。
                            //克隆原来target上的原属性
                            clone = src && SSweb.isArray(src) ? src : [];
                        } else {
                            clone = src && SSweb.isPlainObject(src) ? src : {};
                        }
                        //递归深复制
                        target[name] = SSweb.extend(deep, clone, copy);
                        //undefined的属性对时不会复制到target上的
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    };
    //核心方法属性定义
    var baseMethod = {
        selector_type: SSweb.selector_type,
        selector_obj: SSweb.selector_obj,
        objectType: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            if (v === null) {
                return v + '';
            }
            return typeof v === 'object' || typeof v === 'function' ? _obj_types[Object.prototype.toString.call(v)] || 'object' : typeof v;
        },
        log: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            window.console.log(v);
        },
        isUndefined: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            return v === void 0 || typeof v === 'undefined';
        },
        isInt: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj,
                reg = /^(-|\+)?\d+$/;
            return reg.test(v);
        },
        isFloat: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj,
                reg = /^(-|\+)?\d+\.\d*$/;
            return reg.test(v);
        },
        isNaN: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            return v == null || !/\d/.test(v) || isNaN(v);
        },
        isNumber: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            return v != null && /\d/.test(v) && !isNaN(v);
        },
        toInt: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            return (parseInt(v) || 0);
        },
        toFloat: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            return (parseFloat(v) || 0).toFixed(2);
        },
        isString: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            return typeof v === 'string';
        },
        isArray: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            if (!Array.prototype.isArray) {
                return '[object Array]' === Object.prototype.toString.call(v);
            }
            return Array.isArray(v);
        },
        inArray: function(_v, _array) {
            var v = _v,
                array;
            if (arguments.length > 1) {
                array = _array;
            } else {
                array = this.selector_obj;
            }
            if (!this.isArray(v)) {
                return false;
            }
            v.forEach(function(item) {
                console.log(item)
                if (item === v) {
                    return true;
                }
            });
            return false;
        },
        isFunction: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            if ('object' === typeof document.getElementById) {
                try {
                    return /^\s*\bfunction\b/.test('' + v);
                } catch (x) {
                    return false
                }
            } else {
                return '[object Function]' === Object.prototype.toString.call(v);
            }
        },
        //检测目标是否是可回调函数(字符串或函数名)，并返回结果函数自身
        isCallFunction: function(_v, _obj) {
            var v, obj = window;
            if (arguments.length >= 2) {
                v = _v;
                obj = _obj;
            } else if (arguments.length == 1) {
                if (this.selector_obj) {
                    v = this.selector_obj;
                    obj = _v;
                } else {
                    v = _v;
                }
            } else {
                v = this.selector_obj;
            }
            if (!this.isObject(obj)) {
                obj = window;
            }
            if (typeof v === 'string') {
                if (!obj.hasOwnProperty(v) || !this.isFunction(obj[v])) {
                    return false;
                } else {
                    return obj[v];
                }
            } else if (this.isFunction(v)) {
                return v;
            }
            return false;
        },
        isTrue: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            if (typeof v === 'undefined' || typeof v === 'null') {
                return false;
            }
            if (v === 1 || v === '1' || v === true || v === 'true') {
                return true;
            }
            if (v === 0 || v === '0' || v === false || v === 'false' || v === 'undefined' || v === 'null' || v === '') {
                return false;
            }
            if (typeof v === 'object') {
                if (v === '{}') {
                    return false;
                }
                for (var name in v) {
                    return true;
                }
            }
            return true;
        },
        isEmpty: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            if (v === null || typeof v == 'undefined')
                return true;
            if (typeof v == 'string' && v.length < 1)
                return true;
            if (this.isNumber(v) && v == 0)
                return true;
            if (this.isArray(v) && v.length < 1)
                return true;
            return false;
        },
        isObject: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            var type = typeof v;
            return !!(v && type === 'function' || type === 'object');
        },
        isEmptyObject: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            if (this.isObject(v)) {
                var i;
                for (var i in v) {
                    return false;
                }
                return true;
            }
            return false;
        },
        //isPlainObject 方法暂没有完美方式
        isPlainObject: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            if (Object.prototype.toString.call(v) === '[object Object]' && v.constructor === Object && !hasOwnProperty.call(v, 'constructor')) {
                var key;
                for (key in v) {}
                return key === void 0 || hasOwnProperty.call(v, key);
            }
            return false;
        },
        isjQueryObject: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            if (typeof jQuery === 'undefined') {
                return false;
            } else {
                return !!(v && v instanceof jQuery);
            }
        },
        isWindow: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            return v != null && v == v.window;
        },
        isDocument: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            return v != null && v.nodeType == v.DOCUMENT_NODE;
        },
        isDomElement: function(_v) {
            var v = _v !== void 0 ? _v : this.selector_obj;
            if (typeof HTMLElement === 'object') {
                return !!(v && v instanceof HTMLElement);
            } else {
                return !!(v && typeof v === 'object' && v.nodeType === 1 && typeof v.nodeName === 'string');
            }
        }
    };
    //注入核心方法库
    SSweb.extend(baseMethod);
    SSweb.fn.extend(baseMethod);

    //常用工具函数定义
    var helpsMethod = {
        trim: function(v) {
            return typeof v === 'string' ? v.replace(/(^\s*)|(\s*$)/g, '') : '';
        },
        trimLeft: function(v) {
            return typeof v === 'string' ? v.replace(/(^\s*)/g, '') : '';
        },
        trimRight: function(v) {
            return typeof v === 'string' ? v.replace(/(\s*$)/g, '') : '';
        },
        /*
        仿后端语言 删除数组中重复的元素 ,返回一个新数组
        */
        arrayUnique: function(array) {
            var res = [];
            if (SSweb.isArray(array)) {
                if (array.length < 2) {
                    return [array[0]] || [];
                }
                var defined = {},
                    i, l = array.length;
                for (i = 0; i < l; i++) {
                    if (!defined[array[i]]) {
                        res.push(array[i]);
                        defined[array[i]] = 1;
                    }
                }
            }
            return res;
        },
        /*
        仿后端语言 删除数组中指定的元素(如有多个全部移除),返回一个新数组
        */
        arrayRemove: function(array, item) {
            if (!SSweb.isArray(array)) {
                return [];
            }
            var i = 0,
                l = array.length,
                newArr = [];
            for (i; i < l; i++) {
                if (item != array[i]) {
                    newArr.push(array[i]);
                }
            }
            return newArr;
        },
        //仿后端语言删除数组中指定键对应某个元素,返回一个新数组
        arrayUnset: function(array, index) {
            if (!SSweb.isArray(array)) {
                return [];
            }
            if (!SSweb.isNumber(index)) {
                return array;
            }
            index = parseInt(index);
            var i = 0,
                l = array.length,
                newArr = [];
            //是否倒序处理   
            if (index < 0) {
                index = index + l;
            }
            for (i; i < l; i++) {
                if (array[i] && index != i) {
                    newArr.push(array[i]);
                }
            }
            return newArr;
        },
        //Float 转换百分数并保留两位小数
        toPercent: function(v) {
            if (!this.isNumber(v))
                return '0.00%';
            return (v * 100).toFixed(2) + '%';
        },
        //格式化保留两位小数转为百分比显示
        formatPercent: function(v) {
            if (!this.isNumber(v))
                return '0.00%';
            return v.toFixed(2) + '%';
        },
        formatBytesSize: function(v) {
            if (!this.isNumber(v))
                return '0 B';
            if (v < 1)
                return '0 B';
            var k = 1024;
            var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var i = Math.floor(Math.log(v) / Math.log(k));
            return (v / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
        },
        formatMoney: function(_number, _places, _symbol, _thousand) {
            var number = _number || 0,
                places = !isNaN(_places = Math.abs(_places)) ? _places : 2,
                symbol = (typeof _symbol == 'string' || typeof _symbol !== 'undefined') ? _symbol : '￥',
                thousand = (typeof _thousand == 'string' || typeof _thousand !== 'undefined') ? _thousand : ',',
                negative = number < 0 ? '-' : '';
            if (!SSweb.isNumber(number))
                return places < 1 ? '0' : '0.' + (0).toFixed(places).slice(2);
            var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + '',
                j = (j = i.length) > 3 ? j % 3 : 0;
            return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? '.' + Math.abs(number - i).toFixed(places).slice(2) : '');
        },
        /** 
         * 替换字符串变量 
         * str=>This is [name] And This is [form.a]
         * obj=>{name:ygzhang,form:{a:1,b:2}}
         */
        replaceValueMatch: function(str, obj) {
            if (SSweb.objectType(str) != 'string') {
                return '';
            }
            if (SSweb.objectType(obj) != 'object') {
                return str;
            }
            str = str.replace('%5B', '[').replace('%5D', ']');
            var _search = str.match(/\[\w+\]/g);
            if (_search.length > 0) {
                var v = [];
                _search.forEach(function(_s) {
                    if (typeof _s === 'string') {
                        v = _s.replace('[', '').replace(']', '');
                        if (v.indexOf('.') > 0) {
                            v = v.split('.');
                            if (v[0] && v[1] && obj[v[0]][v[1]]) {
                                str = str.replace(_s, obj[v[0]][v[1]]);
                            }
                        } else if (obj[v]) {
                            str = str.replace(_s, obj[v]);
                        }
                    }
                });
            }
            return str;
        },

        /** 
         * 对 UnixTime 日期进行格式化， 
         * @param time 要格式化的 时间戳
         * @param format 进行格式化的模式字符串
         *  支持的模式字母有： 
         *  y:年, 
         *  m:年中的月份(1-12), 
         *  d:月份中的天(1-31), 
         *  h:小时(0-23), 
         *  i:分(0-59), 
         *  s:秒(0-59), 
         *  S:毫秒(0-999),
         *  q:季度(1-4)
         * @return String
         */
        dateFormat: function(time, format) {
            if (SSweb.isNumber(time)) {
                //JS时间戳为13位，包含3位毫秒的，而PHP只有10位不包含毫秒
                if (time >= 1000000000 && time <= 9999999999) {
                    time = time * 1000;
                } else if (time < 1000000000) {
                    return '';
                }
            } else if (typeof time === 'string') {
                var mts = time.match(/(\/Date\((\d+)\)\/)/);
                if (mts && mts.length >= 3) {
                    time = parseInt(mts[2]);
                } else {
                    return time;
                }
            } else {
                return '';
            }
            var date = new Date(time);
            if (!date || date.toUTCString() == 'Invalid Date') {
                return '';
            }
            if (typeof format !== 'string') {
                format = 'yyyy-mm-dd hh:ii:ss';
            }
            var map = {
                'm': date.getMonth() + 1, //月份 
                'd': date.getDate(), //日 
                'h': date.getHours(), //小时 
                'i': date.getMinutes(), //分 
                's': date.getSeconds(), //秒 
                'q': Math.floor((date.getMonth() + 3) / 3), //季度 
                'S': date.getMilliseconds() //毫秒 
            };
            format = format.replace(/([ymdhisqS])+/g, function(all, t) {
                var v = map[t];
                if (v !== undefined) {
                    if (all.length > 1) {
                        v = '0' + v;
                        v = v.substr(v.length - 2);
                    }
                    return v;
                } else if (t === 'y') {
                    return (date.getFullYear() + '').substr(4 - all.length);
                }
                return all;
            });
            return format;
        },
        urlGetParam: function(_name, _url) {
            var name = typeof _name === 'string' ? this.trim(_name) : false,
                url = typeof _url === 'string' ? this.trim(_url) : window.location.href;
            if (url == '' || !name) {
                return '';
            }
            var paramValue = '',
                isFound = !1,
                arrSource = '',
                i = 0;
            if (url.indexOf('?') > 0 && url.indexOf('=') > 0) {
                url = unescape(url).split('?');
                if (!url[1]) {
                    return '';
                }
                arrSource = url[1].split('&');
                if (name == '') {
                    return arrSource;
                }
                while (i < arrSource.length && !isFound) arrSource[i].indexOf('=') > 0 && arrSource[i].split('=')[0].toLowerCase() == name.toLowerCase() && (paramValue = arrSource[i].split('=')[1], isFound = !0), i++
            }
            return (paramValue == '' || paramValue == null) ? '' : paramValue;
        },
        urlAddParam: function(_name, _value, _url) {
            var name = typeof _name === 'string' ? this.trim(_name) : false,
                value = (typeof _value === 'undefined') ? 'undefined' : _value,
                url = typeof _url === 'string' ? this.trim(_url) : window.location.href;
            if (!name) {
                return url;
            }
            var newUrl = '';
            var reg = new RegExp('(^|)' + name + '=([^&]*)(|$)');
            var tmp = name + '=' + value;
            if (url.match(reg) != null) {
                newUrl = url.replace(eval(reg), tmp);
            } else {
                if (url.match('[\?]')) {
                    newUrl = url + '&' + tmp;
                } else {
                    newUrl = url + '?' + tmp;
                }
            }
            return newUrl;
        },
        urlParse: function(_url) {
            var url = (typeof _url === 'string') ? _url : window.location.href;
            var domain = '',
                query = '',
                data = {
                    domain: '',
                    port: 80,
                    ssl: 0,
                    params: {}
                }
            url = this.trim(url);
            if (url == '') {
                return data;
            }
            url = url.split('?');
            if (url[0] && typeof url[0] === 'string') {
                domain = url[0].toLowerCase();
                if (url.length > 1) {
                    url[0] = '';
                }
            }
            query = url.join('');
            var sslReg = /^((https|http):\/\/)?/;
            if (domain.indexOf('https://') !== -1) {
                data.ssl = 1;
                data.port = 443;
            } else {
                data.ssl = 0;
                data.port = 80;
            }
            var domainReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
            var domainSearch = domainReg.exec(domain);
            if (domainSearch && typeof domainSearch[0] === 'string') {
                data.domain = domainSearch[0];
            }
            query = query.split('&'); //在逗号处断开  
            for (var i = 0; i < query.length; i++) {
                var pos = query[i].indexOf('='); //查找name=value   
                if (pos == -1) {
                    continue; //如果没有找到就跳过  
                }
                var argname = query[i].substring(0, pos); //提取name  
                if (typeof argname !== 'string' || argname == '') {
                    continue; //如果没有找到就跳过  
                }
                var value = query[i].substring(pos + 1); //提取value  
                data.params[argname] = value; //存为属性   
            }
            return data;
        },

        //产生固定长度的随机字符串  
        randomString: function(_length, _str) {
            var length = SSweb.isNumber(_length) && parseInt(_length) || 16,
                str = typeof _str === 'string' && _str || '';
            var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            if (str == 'alpha') {
                arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            } else if (str == 'number') {
                arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            }
            str = '';
            var i, pos;
            for (i = 0; i < length; i++) {
                pos = Math.round(Math.random() * (arr.length - 1));
                str += arr[pos];
            }
            return str;
        }
    };
    //注入常用工具方法库
    SSweb.extend(helpsMethod);

    //客户端/浏览器信息获取
    var _getClient = function() {
        var plat = navigator.platform.toLowerCase(),
            ua = navigator.userAgent.toLowerCase(),
            os = {
                win: false,
                mac: false,
                ios: false,
                android: false,
                unix: false,
                linux: false,
                other: false
            };
        if (plat.indexOf('win') > -1) {
            os.windows = true;
        } else if (plat.indexOf('mac') > -1) {
            os.mac = true;
        } else if (plat.indexOf('android') > -1) {
            os.android = true;
        } else if (plat.indexOf('linux') > -1) {
            os.linux = true;
        } else if (plat == 'x11') {
            os.unix = true;
        } else {
            os.other = true;
        }
        var device = {
            pc: false,
            mobile: false,
            android: false,
            iphone: false,
            ipad: false,
            ipod: false
        };
        if (!!ua.match(/applewebkit.*mobile.*/) || ua.indexOf('windows ce') > -1 || ua.indexOf('windows mobile') > -1) {
            device.mobile = true;
        }
        if (ua.match(/iphone|ipad|ipod/i)) {
            os.ios = true;
            device.mobile = true;
            if (ua.match(/ipad/i)) {
                device.ipad = true;
            } else if (ua.match(/ipad/i)) {
                device.ipad = true;
            } else {
                device.iphone = true;
            }
        } else if (ua.match(/(android);?[\s\/]+([\d.]+)?/)) {
            device.android = true;
        } else {
            device.pc = true;
        }


        var name, browser = {
            lang: (navigator.browserLanguage || navigator.language || '').toLowerCase(),
            version: 0,
            versionFull: '',
            isIE: false,
            isIE6: false,
            isIE7: false,
            isIE8: false,
            isIE9: false,
            isIE10: false,
            isIE11: false,
            isEdge: false,
            isChrome: false,
            isSafari: false,
            isFirefox: false,
            isOpera: false
        };
        var s, is = {};
        (s = ua.match(/edge\/([\d.]+)/)) ? is.edge = s[1]:
            (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? is.ie = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? is.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? is.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? is.chrome = s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? is.opera = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? is.safari = s[1] : 0;

        if (is.edge) {
            browser.isEdge = true;
            browser.versionFull = is.edge;
        }
        if (is.ie) {
            browser.isIE = true;
            browser.versionFull = is.ie;
        }
        if (is.firefox) {
            browser.isFirefox = true;
            browser.versionFull = is.firefox;
        }
        if (is.chrome) {
            browser.isChrome = true;
            browser.versionFull = is.chrome;
        }
        if (is.opera) {
            browser.isOpera = true;
            browser.versionFull = is.opera;
        }
        if (is.safari) {
            browser.isSafari = true;
            browser.versionFull = is.safari;
        }
        if (browser.versionFull < 1) {
            browser.versionFull = navigator.appVersion || 0;
        }
        browser.version = parseInt(browser.versionFull, 10);
        if (is.ie) {
            is.ie = parseInt((is.ie || 6), 10);
            if (browser.hasOwnProperty('isIE' + is.ie)) {
                browser['isIE' + is.ie] = true;
            }
        }
        var touchSupport = 'ontouchend' in document ? true : false;
        return {
            'os': os,
            'device': device,
            'browser': browser,
            'touchSupport': touchSupport,
            'touchEvent': touchSupport ? 'touchstart' : 'click'
        };
    };
    var _client = _getClient();
    //[ Cookies ] 扩展
    var _cookies = function(key, value, options) {
        if (arguments.length === 1) {
            return _cookies.get(key);
        } else if (arguments.length > 1 && value === null && value !== void 0) {
            return _cookies.rm(key, options);
        } else if (arguments.length > 1) {
            if (typeof options === 'number') {
                return _cookies.set(key, value, { expires: options });
            } else {
                return _cookies.set(key, value, options);
            }
        } else {
            return _cookies;
        }
    };

    // Allows for setter injection in unit tests
    _cookies._document = window.document;

    // Used to ensure cookie keys do not collide with
    // built-in `Object` properties
    _cookies._cacheKeyPrefix = 'sw_'; // Hurr hurr, :)

    _cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

    _cookies.defaults = {
        path: '/',
        domain: '',
        prefix: 'sw_',
        expires: 0,
        secure: false
    };
    _cookies.config = function(k, v) {
        if (typeof k === 'object') {
            _cookies.defaults = SSweb.extend(_cookies.defaults, k);
        } else if (typeof k === 'string') {
            _cookies.defaults[SSweb.trim(k)] = v === void 0 ? undefined : v;
        }
        _cookies._cacheKeyPrefix = _cookies.defaults.prefix;
        return _cookies;
    };
    _cookies.get = function(key) {
        if (typeof key !== 'string') {
            console.info('SSweb cookies `key` must be a string');
            return false;
        }
        if (_cookies._cachedDocumentCookie !== _cookies._document.cookie) {
            _cookies._renewCache();
        }
        var value = _cookies._cache[_cookies._cacheKeyPrefix + key];
        if (value === '[=UNDEFINED]') {
            return undefined;
        }
        return value === void 0 ? null : value;
    };
    _cookies.set = function(key, value, _options) {
        if (typeof key !== 'string') {
            console.info('SSweb cookies `key` must be a string');
            return false;
        }
        var options;
        if (typeof _options === 'number') {
            options = _cookies._getExtendedOptions({ expires: _options });
        } else {
            options = _cookies._getExtendedOptions(_options);
        }
        if (value === void 0) {
            value = '[=UNDEFINED]';
        } else if (typeof value !== 'string' && !SSweb.isFunction(value)) {
            try {
                value = '[=JSON]' + JSON.stringify(value);
            } catch (e) {
                if (!(value.toString || false)) {
                    value = value.toString()
                } else {
                    console.info('SSweb cookies `value` types does not support');
                    return false;
                }
            }
        } else {
            console.info('SSweb cookies `value` types does not support');
            return false;
        }

        options.expires = _cookies._getExpiresDate(options.expires);
        _cookies._document.cookie = _cookies._generateCookieString(key, value, options);
        return true;
    };

    _cookies.rm = function(key) {
        return _cookies.set(key, undefined, { expires: -1 });
    };
    _cookies._getExtendedOptions = function(options) {
        return {
            path: options && options.path || _cookies.defaults.path,
            domain: options && options.domain || _cookies.defaults.domain,
            expires: options && options.expires || _cookies.defaults.expires,
            secure: options && options.secure !== undefined ? options.secure : _cookies.defaults.secure
        };
    };
    _cookies._isValidDate = function(date) {
        return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
    };
    _cookies._getExpiresDate = function(expires, now) {
        now = now || new Date();

        if (typeof expires === 'number' && expires != 0) {
            expires = expires === Infinity ?
                _cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
        } else if (typeof expires === 'string' && expires != '') {
            expires = new Date(expires);
        } else {
            expires = undefined;
        }
        if (expires && !_cookies._isValidDate(expires)) {
            throw new Error('SSweb cookies `expires` cannot be converted to a valid Date instance');
        }
        return expires;
    };
    _cookies._generateCookieString = function(key, value, options) {
        key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
        key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
        options = options || {};
        var cookieString = _cookies._cacheKeyPrefix + key + '=' + value;
        cookieString += options.path && options.path != '' ? ';path=' + options.path : '';
        cookieString += options.domain && options.domain != '' ? ';domain=' + options.domain : '';
        cookieString += options.expires && options.expires != '' && options.expires != 0 ? ';expires=' + options.expires.toUTCString() : '';
        cookieString += options.secure ? ';secure' : '';

        return cookieString;
    };
    _cookies._getCacheFromString = function(documentCookie) {
        var cookieCache = {};
        var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

        for (var i = 0; i < cookiesArray.length; i++) {
            var cookieKvp = _cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

            if (cookieKvp && cookieCache[cookieKvp.key] === undefined) {
                cookieCache[cookieKvp.key] = cookieKvp.value;
            }
        }

        return cookieCache;
    };
    _cookies._getKeyValuePairFromCookieString = function(cookieString) {
        // '=' is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
        var separatorIndex = cookieString.indexOf('=');
        // IE omits the '=' when the cookie value is an empty string
        separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

        var key, is_key = false,
            decodedKey, decodedValue;
        try {
            key = cookieString.substr(0, separatorIndex);
            decodedKey = decodeURIComponent(key);
            if (decodedKey.indexOf(_cookies._cacheKeyPrefix) === 0) {
                decodedValue = cookieString.substr(separatorIndex + 1);
                if (typeof decodedValue === 'string') {
                    if (decodedValue.indexOf('[=JSON]') === 0 && decodedValue.length > 7) {
                        decodedValue = JSON.parse(decodedValue.substr(7));
                    }
                } else {
                    decodedValue = null;
                }
                is_key = true;
            }
        } catch (e) {
            console.error('SSweb cookies could not decode cookie with key "' + key + '"', e);
        }
        return is_key ? {
            'key': decodedKey,
            'value': decodedValue
        } : false;
    };
    _cookies._renewCache = function() {
        _cookies._cache = _cookies._getCacheFromString(_cookies._document.cookie);
        _cookies._cachedDocumentCookie = _cookies._document.cookie;
    };
    _cookies._areEnabled = function() {
        var testKey = 'testKey';
        _cookies.set(testKey, 1)
        var areEnabled = _cookies.get(testKey) === 1;
        _cookies.rm(testKey);
        return areEnabled;
    };
    _cookies.enabled = _cookies._areEnabled();
    if (!_cookies.enabled) {
        console.info('SSweb: Browser/client does not support cookies');
    }
    if (!(window.localStorage || false)) {
        console.info('SSweb: Browser/client does not support localStorage');
    }
    var _storage = function(key, value) {
        if (!_storage.db) {
            return false;
        }
        if (arguments.length === 1) {
            return _storage.get(key);
        } else if (arguments.length > 1 && value === null && value !== void 0) {
            return _storage.rm(key);
        } else if (arguments.length > 1) {
            return _storage.set(key, value);
        } else {
            return _storage;
        }
    };
    _storage.db = window.localStorage || false;
    _storage.set = function(key, value) {
        if (_storage.db && arguments.length > 1 && typeof key === 'string') {
            if (value === void 0) {
                value = '[=UNDEFINED]';
                _storage.db.setItem(key, value);
                return true;
            } else if (typeof value !== 'string' && !SSweb.isFunction(value)) {
                try {
                    _storage.db.setItem(key, '[=JSON]' + JSON.stringify(value));
                    return true;
                } catch (e) {
                    if (value.toString) {
                        _storage.db.setItem(key, value.toString());
                        return true;
                    }
                }
            }
        }
        console.info('SSweb storage `value` types does not support');
        return false;
    };
    _storage.get = function(key) {
        if (_storage.db && typeof key === 'string') {
            var value = _storage.db.getItem(key);
            if (value === void 0) {
                return null;
            } else if (typeof value === 'string') {
                if (value === '[=UNDEFINED]') {
                    return undefined;
                } else if (value.indexOf('[=JSON]') === 0 && value.length > 7) {
                    value = JSON.parse(value.substr(7));
                }
            }
            return value;
        }
        return false;
    };
    _storage.rm = function(key) {
        if (_storage.db && typeof key === 'string') {
            _storage.db.removeItem(key);
            return true;
        }
        return false;
    };
    _storage.clear = function() {
        if (_storage.db) {
            _storage.db.clear(key);
            return true;
        }
        return false;
    };

    SSweb.extend({
        client: _client,
        cookies: _cookies,
        storage: _storage
    });
    if (typeof module === 'object' && module && typeof module.exports === 'object') {
        module.exports = SSweb;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return SSweb;
        });
    } else {
        window.SSweb = window.sw = SSweb;
    }
})(window);