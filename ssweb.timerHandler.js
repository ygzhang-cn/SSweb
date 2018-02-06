/*! 
 * SSweb timerHandler扩展 (需要 ssweb.query 或 jQuery 或 Zepto支持 )
 * 定时器插件支持动态注册管理，支持已ms/s/m/h时间设置间隔周期时间、暂停、限制运行次数及自动销毁机制
 * @version 1.0.2 01/30/2018
 * @author ygzhang.cn@msn.com
 * @link https://github.com/ygzhang-cn/timerHandler
 * @copyright 2015-2018 Kunming Dongring Technology Co., Ltd.
 * -----------------------------------------------------
 */
(function(window, sw) {
    "use strict";
    if (sw.length < 0) {
        console.warn('SSweb not loaded')
    }
    var WIN = window || this.window || false;
    var BODY = window ? 'body' : false;
    if (sw.isFunction(sw.timerHandler)) {
        return sw.timerHandler;
    }
    var _timerHandlerData = {};
    var _timerHandler = function(name) {
        this._name = name; //定时器名称
        this._timer = null; //定时器注册标识
        this._interval = 0; //间隔周期时间
        this._limit = 0; //重复次数，0不限制，具体数值N 限制运行N次后自动销毁
        this._counter = 0; //运行次数缓存
        this._callback = false; //定时器回调主函数
        this._callbackStart = false; //开始之前的回调函数
        this._callbackStartEnd = false; //开始之后的回调函数
        this._callbackPause = false; //暂停之前的回调函数
        this._callbackPauseEnd = false; //暂停之后的回调函数
        this._callbackStop = false; //停止之前的回调函数
        this._callbackStopEnd = false; //停止之后的回调函数
        this._runing = 0; //运行状态
        this._bindDom = false; //是否绑定到Dom节点，适用于Ajax加载的脚本定时器，将会监听Dom移除事件，Dom移除后，绑定的定时器也将销毁，如不指定定时器绑定在全局
    };
    _timerHandler.prototype = {
        time: function(value) {
            if (value == undefined || value == null)
                throw new Error('timerHandler.time(`value`) must be a string or number');
            var regex = /^([0-9]+)\s*([smh]+)?$/,
                powers = {
                    's': 1000, //秒
                    'ms': 1, //毫秒
                    'm': 60000, //分钟
                    'h': 3600000 //小时
                };
            var result = regex.exec(sw.trim(value.toString()));
            if (result && result.length > 1) {
                var num = parseFloat(result[1]);
                var mult = powers[result[2]] || 1;
                this._interval = parseInt(num * mult);
            } else {
                this._interval = value; //如不指定单位默认毫秒
            }
            return this;
        },
        limit: function(value) {
            if (typeof value == 'number') {
                this._limit = parseInt(value);
            } else {
                console.info('timerHandler.limit(`value`) must be a integer')
            }
            return this;
        },
        bindDom: function(selector) {
            if (selector == undefined || selector == null) {
                throw new Error('timerHandler.bindDom(`selector`) must be a string');
            } else if (WIN) {
                this._bindDom = selector;
                var _this = this;
                if (sw.isjQuery(selector) || sw.isZepto(selector)) {
                    selector.on('DOMNodeRemoved', function() {
                        _this.stop();
                    });
                } else if (sw.query) {
                    sw('body').on('DOMNodeRemoved', selector, function() {
                        _this.stop();
                    });
                } else if (typeof jQuery !== 'undefined') {
                    jQuery('body').on('DOMNodeRemoved', selector, function() {
                        _this.stop();
                    });
                } else if (typeof Zepto !== 'undefined') {
                    Zepto('body').on('DOMNodeRemoved', selector, function() {
                        _this.stop();
                    });
                }
            }
            if(sw.client.browser.isIE && sw.client.browser.version<9){
                console.info('timerHandler.bindDom does not support IE7|IE8')
            }
            return this;
        },
        call: function(value) {
            if (sw.isFunction(value)) {
                this._callback = value;
            } else {
                console.info('timerHandler.callback(`value`) must be a function')
            }
            return this;
        },
        callStart: function(value) {
            if (sw.isFunction(value)) {
                this._callbackStart = value;
            }
            return this;
        },
        callStartEnd: function(value) {
            if (sw.isFunction(value)) {
                this._callbackStartEnd = value;
            }
            return this;
        },
        callPause: function(value) {
            if (sw.isFunction(value)) {
                this._callbackPause = value;
            }
            return this;
        },
        callPauseEnd: function(value) {
            if (sw.isFunction(value)) {
                this._callbackPauseEnd = value;
            }
            return this;
        },
        callStop: function(value) {
            if (sw.isFunction(value)) {
                this._callbackStop = value;
            }
            return this;
        },
        callStopEnd: function(value) {
            if (sw.isFunction(value)) {
                this._callbackStopEnd = value;
            }
            return this;
        },
        start: function() {
            if (this._timer === null) {
                var _this = this;
                var handler = function() {
                    if (_this._runing == 0) {
                        this._callbackStart && this._callbackStart();
                        _this._runing = 1;
                        if (_this._limit == 0 || _this._counter < _this._limit) {
                            _this._counter++;
                            if (_this._callback.call(_this, _this._counter) === false) {
                                _this.stop();
                            }
                        } else {
                            _this.stop();
                        }
                        _this._runing = 0;
                        this._callbackStartEnd && this._callbackStartEnd();
                    }
                };
                this._timer = window.setInterval(handler, this._interval);
            }
            return this;
        },
        pause: function() {
            if (timerHandler.data[this._name]) {
                this._callbackPause && this._callbackPause();
                window.clearInterval(this._timer);
                this._timer = null;
                this._runing = 0;
                this._callbackPauseEnd && this._callbackPauseEnd();
            }
            return this;
        },
        stop: function() {
            if (timerHandler.data[this._name]) {
                this._callbackStop && this._callbackStop();
                window.clearInterval(this._timer);
                if (this._bindDom && WIN) {
                    var _this = this;
                    if (sw.isjQuery(this._bindDom) || sw.isZepto(this._bindDom)) {
                        this._bindDom.off('DOMNodeRemoved');
                    } else if (sw.query) {
                        sw('body').off('DOMNodeRemoved', this._bindDom);
                    } else if (typeof jQuery !== 'undefined') {
                        jQuery('body').off("DOMNodeRemoved", this._bindDom);
                    } else if (typeof Zepto !== 'undefined') {
                        Zepto('body').off("DOMNodeRemoved", this._bindDom);
                    }
                }
                delete timerHandler.data[this._name];
                this._callbackStopEnd && this._callbackStopEnd();
                return true;
            }
            return false;
        }
    };
    var timerHandler = function(_name) {
        var name;
        if ((typeof _name == 'number' || typeof _name == 'string') && _name.length > 0) {
            name = sw.trim(_name.toString());
        } else {
            throw new Error('timerHandler(`name`) must be a string');
        }
        if (!timerHandler.data[name]) {
            timerHandler.data[name] = new _timerHandler(name);
        }
        return timerHandler.data[name];
    };
    timerHandler.data = {};
    if (WIN) {
        if (sw.query) {
            sw(WIN).on("unload", function() {
                for (var Key in timerHandler.data) {
                    timerHandler.data[Key].stop();
                }
            });
        } else if (typeof jQuery !== 'undefined') {
            jQuery(WIN).on("unload", function() {
                for (var Key in timerHandler.data) {
                    timerHandler.data[Key].stop();
                }
            });
        } else if (typeof Zepto !== 'undefined') {
            Zepto(WIN).on("unload", function() {
                for (var Key in timerHandler.data) {
                    timerHandler.data[Key].stop();
                }
            });
        }
    }
    sw.timerHandler = timerHandler;
})(window, SSweb);