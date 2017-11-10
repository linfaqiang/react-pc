import {APIS} from '../../core/common/config.js';
/**
 * Created by zhangruifeng on 16/9/22.
 */
define(function(require, exports, module) {


    var tools = {

        //这里的都是公用方法

        MONTH_NAMES: ["\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708", "\u56db\u6708", "\u4e94\u6708", "\u516d\u6708", "\u4e03\u6708", "\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708", "\u5341\u4e00\u6708", "\u5341\u4e8c\u6708", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        DAY_NAMES: ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        //时间格式化
        formatDate: function (objDate, strFormat) {
            var format = strFormat || "yyyy-mm-dd HH:nn:ss";
            var date = (objDate instanceof Date) ? objDate : new Date(objDate);
            format = format + "";
            var result = "";
            var i_format = 0;
            var c = "";
            var token = "";
            var yyyy = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            var w = date.getDay();
            var h = date.getHours();
            var n = date.getMinutes();
            var s = date.getSeconds();
            var sss = date.getMilliseconds();

            var value = [];
            //年份
            value["y"] = (yyyy < 2000) ? yyyy - 1900 : yyyy;
            value["yyyy"] = yyyy;
            value["yy"] = yyyy.toString().substring(2, 4);
            //月份
            value["m"] = m;
            value["mm"] = this.appendZero(m);
            value["mmm"] = this.MONTH_NAMES[m - 1];
            value["MM"] = this.MONTH_NAMES[m + 11];
            value["M"] = this.MONTH_NAMES[m + 23];
            //天
            value["d"] = d;
            value["dd"] = this.appendZero(d);
            //星期
            value["w"] = w;
            value["ww"] = this.DAY_NAMES[w];
            value["W"] = this.DAY_NAMES[w + 14];
            value["WW"] = this.DAY_NAMES[w + 7];
            //小时
            value["H"] = h;
            value["HH"] = this.appendZero(h);
            if (h == 0) {
                value["h"] = 12;
            }
            else if (h > 12) {
                value["h"] = h - 12;
            }
            else {
                value["h"] = h;
            }
            value["hh"] = this.appendZero(value["h"]);
            if (h > 11) {
                value["K"] = h - 12;
            } else {
                value["K"] = h;
            }
            value["k"] = h + 1;
            value["KK"] = this.appendZero(value["K"]);
            value["kk"] = this.appendZero(value["k"]);
            if (h > 11) {
                value["a"] = "PM";
            }
            else {
                value["a"] = "AM";
            }
            //分钟
            value["n"] = n;
            value["nn"] = this.appendZero(n);
            //秒
            value["s"] = s;
            value["ss"] = this.appendZero(s);
            //毫秒
            value["sss"] = sss;

            while (i_format < format.length) {
                c = format.charAt(i_format);
                token = "";
                while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                    token += format.charAt(i_format++);
                }
                if (value[token] != null) {
                    result += value[token];
                }
                else {
                    result += token;
                }
            }
            return result;
        },
        //时间增加(Number为负时,是减少)
        dateAdd: function (strInterval, Number, date) {
            var dtTmp = date || new Date();
            switch (strInterval) {
                case 's': //秒
                    return new Date(dtTmp.getTime() + (1000 * Number));
                case 'n': //分钟
                    return new Date(dtTmp.getTime() + (60000 * Number));
                case 'h': //小时
                    return new Date(dtTmp.getTime() + (3600000 * Number));
                case 'd': //天
                    return new Date(dtTmp.getTime() + (86400000 * Number));
                case 'w': //周
                    return new Date(dtTmp.getTime() + ((86400000 * 7) * Number));
                case 'q': //季度
                    return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                case 'm': //月
                    return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                case 'y': //年
                    return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            }
        },
        appendZero: function (x) {
            return (x < 0 || x > 9 ? "" : "0") + x;
        },
        imgLoadError:function(){
            //为加载失败的img,设置error事件
            /*$("img").error(function () {
                $(this).attr("src", defaultImg);
            });*/

            $("img").each(function(){
                var error = false;
                if (!this.complete) {
                    error = true;
                }

                if (typeof this.naturalWidth != "undefined" && this.naturalWidth == 0) {
                    error = true;
                }

                if(error){
                    var defaultImg = APIS.img_path+"/assets/crm/images/ic-defalut-pic.png";
                    if(this.name && this.name == 'defaultPic'){
                        defaultImg = APIS.img_path+"/assets/crm/images/ic-defalut-pic.png";
                    }else if(this.name && this.name == 'headPhoto'){
                        defaultImg = APIS.img_path+"/assets/crm/images/default_user.png";
                    }

                    $(this).bind('error.replaceSrc',function(){
                        this.src = defaultImg;
                        $(this).unbind('error.replaceSrc');
                    }).trigger('load');
                }
            });
        },

    };

    module.exports = tools;

});

(function(global) {
    'use strict';
    // existing version for noConflict()
    var _Base64 = global.Base64;
    var version = "2.1.9";
    // if node.js, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        try {
            buffer = require('buffer').Buffer;
        } catch (err) {}
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
            + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
            + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
            + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
            + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
            + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
            + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16
                | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
            chars = [
                b64chars.charAt( ord >>> 18),
                b64chars.charAt((ord >>> 12) & 63),
                padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
            ];
        return chars.join('');
    };
    var btoa = global.btoa ? function(b) {
        return global.btoa(b);
    } : function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer ? function (u) {
            return (u.constructor === buffer.constructor ? u : new buffer(u))
                .toString('base64')
        }
            : function (u) { return btoa(utob(u)) }
        ;
    var encode = function(u, urisafe) {
        return !urisafe
            ? _encode(String(u))
            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
            return m0 == '+' ? '-' : '_';
        }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');
    var cb_btou = function(cccc) {
        switch(cccc.length) {
            case 4:
                var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                        |    ((0x3f & cccc.charCodeAt(1)) << 12)
                        |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                        |     (0x3f & cccc.charCodeAt(3)),
                    offset = cp - 0x10000;
                return (fromCharCode((offset  >>> 10) + 0xD800)
                + fromCharCode((offset & 0x3FF) + 0xDC00));
            case 3:
                return fromCharCode(
                    ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
                );
            default:
                return  fromCharCode(
                    ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
                );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
            padlen = len % 4,
            n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
                | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
                | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
                | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
            chars = [
                fromCharCode( n >>> 16),
                fromCharCode((n >>>  8) & 0xff),
                fromCharCode( n         & 0xff)
            ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var atob = global.atob ? function(a) {
        return global.atob(a);
    } : function(a){
        return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };
    var _decode = buffer ? function(a) {
        return (a.constructor === buffer.constructor
            ? a : new buffer(a, 'base64')).toString();
    }
        : function(a) { return btou(atob(a)) };
    var decode = function(a){
        return _decode(
            String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    // that's it!
    
     window.Base64 = global.Base64; // for normal export in Meteor.js
    
})(window);