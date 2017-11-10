function scrollLayer() {
    var $frame = $('#basic');
    var $wrap = $frame.parent();
    $frame.sly({
        horizontal: 1,
        itemNav: 'basic',
        smart: 1,
        releaseSwing: 1,
        startAt: 0,
        speed: 300,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        forward: $('#scrollFor'), //向左滑
        backward: $('#scrollBack') //向右滑 
    });
    $(document.body).on('resize', function() {
        $frame.sly({
            horizontal: 1,
            itemNav: 'basic',
            smart: 1,
            releaseSwing: 1,
            startAt: 0,
            speed: 300,
            elasticBounds: 1,
            easing: 'easeOutExpo',
            forward: $('#scrollFor'), //向左滑
            backward: $('#scrollBack') //向右滑 
        });
    });
}

/*
转换标准时间为时间戳
*/
function getDateTimeStamp(dateStr) {
    return Date.parse(dateStr.replace(/-/gi, "/"));
}

/*
执行此方法前，调用getDateTimeStamp()方法转换标准时间为时间戳
*/
function getDateDiff(dateTimeStamp) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
    } else
        result = "刚刚";
    return result;
}

window.XHR = {
    option:{
        url:null,
        data:null,
        success:null,
        error:null
    },
    extend:function(obj){
        for(var key in this.option){
            if(obj[key]){
                this.option[key] = obj[key];
            }
        }
        return this.option;
    },
    factory:function(method, url, args, success, error){
        if(!url){console.error('url未知'); return;}
        
        var xmlhttp =new XMLHttpRequest();
        var info = args ? JSON.stringify(args) : '';
        var fun = (method=='post' || method=='post_form') ? 'post': method;

        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                var res = JSON.parse(xmlhttp.response);
                if(res.code == 200 || res.status){
                    if(success && typeof success === 'function')
                    success(res);
                }else if (res.code == '406.3') {
                    location.href = '#/login'
                } else{
                    toastr.error(res.msg);
                    if(error && typeof error === 'function')
                    error(res);
                }
                xmlhttp = null;
                return null;
            }
        }
        xmlhttp.open(fun, url, true);
        if(method=='post_form'){
            xmlhttp.setRequestHeader("Content-type","x-www-form-urlencoded;charset=utf-8");
        }else{
            xmlhttp.setRequestHeader("Content-type","application/json;charset=utf-8");
        }
        xmlhttp.send(info);
    },
    get: function(params){
        var obj = this.extend(params);
        this.factory('get', obj.url, obj.data, obj.success, obj.error);
    },
    post: function(params){
        var obj = this.extend(params);
        this.factory('post', obj.url, obj.data, obj.success, obj.error);
    },
    put: function(params){
        var obj = this.extend(params);
        this.factory('put', obj.url, obj.data, obj.success, obj.error);
    },
    delete: function(params){
        var obj = this.extend(params);
        this.factory('delete', obj.url, obj.data, obj.success, obj.error);
    },
    post_form: function(params){
        var obj = this.extend(params);
        this.factory('post_form', obj.url, obj.data, obj.success, obj.error);
    }
};
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
// 2016-10-22 24:22:00
// 2016/10/22 24:22:00
String.prototype.parseDateCreateByWX = function(){
    var a = this.split(/-| |:|\//);
    a = new Date(
        parseInt(a[0]),
        (parseInt(a[1]) ? (parseInt(a[1])-1) : 0),
        (parseInt(a[2])||0) ,
        (parseInt(a[3])||0),
        (parseInt(a[4])||0),
        (parseInt(a[5])||0));
    return a;
};
function deepCopyByWX(src){
    if(!src){
        throw Error('拷贝对象不能为空');
        return;
    }
    var a = {};
    for(var key in src){
        a[key] = src[key];
    }
    return a;
};
Array.prototype.deleteItemFromArray = function(index, num){//参数必须大于0
    if(typeof index != 'number'){
        return;
    }
    var t = this;
    if((num+index)>t.length){
        throw Error('长度值无效');
    }
    var t1 = t.slice(0, index);
    var t2 = t.slice(index+num);

    return t1.concat(t2);
};
function loadAudioError(e){
    $(e.target).attr('data-err', '音频文件未找到');
}
function playAudio(){
    jQuery('.audioBox').off();
    jQuery('.audioBox').on('click', function(e){
        var el = e.target;
        var audioInfo = el.querySelectorAll('.audioInfo')[0];
        var cls = el.getAttribute('class');
        var duration = el.querySelectorAll('.duration')[0];
        var currentTime = el.querySelectorAll('.currentTime')[0];
        var a = el.querySelectorAll('audio')[0];

        if(a.getAttribute('data-err')){
            toastr.error('音频文件未找到');
            return;
        }

        a.ondurationchange= function(){
            var time = a.duration;
            var n = parseInt((time/60).toString(10), 10);
            var s = parseInt((time%60).toString(10), 10);
            if(duration){
                duration.innerHTML = ' / '+ (n<10? ('0'+n) : n)+':'+(s<10 ? ('0'+s) : s);
                currentTime.innerHTML = '00:00';
            }
        };

        if(cls.match(/stop/)){
            el.setAttribute('class', 'audioBox');
            if(currentTime)
                currentTime.innerHTML = '00:00';
            a.load();
        }else{
            el.setAttribute('class', 'audioBox stop');
            a.load();
            a.play();//currentTime
            a.ontimeupdate = function(){
                var time = a.currentTime;
                var n = parseInt(time/60);
                var s = parseInt(time%60);
                if(currentTime)
                    currentTime.innerHTML = (n<10? ('0'+n) : n)+':'+(s<10 ? ('0'+s) : s);
                if(a.ended){
                    a.load();
                    el.setAttribute('class', 'audioBox');
                    if(currentTime)
                        currentTime.innerHTML = '00:00';
                }
            }
        }
    });
};
function toThousands(num) {//带千分位的整数
    var num = (num || 0).toString()
        , result = ''
        , dec = ''
        , temp = '';
    if (num.match('.')) {
        var t = num.split('.');
        num = t[0];
        if (t.length > 1)
            dec = t[1];
    }
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    while (dec.length > 3) {
        temp = dec.slice(0, 3) + ',' + temp;
        dec = dec.slice(3);
    }
    if (dec) {
        temp = temp + dec;
    }else{
        if(temp)
            temp = temp.slice(0, temp.length - 2);
    }
    return ( dec ? (result + '.' + temp) : result) ;
}
function showAjaxCallbackModal(data){
    if (data.code == "200") {
        $('#modal-success').modal();
    } else {
        $('#modal-danger').modal().find('.modal-body').html('操作失败: '+data.msg);
    }
};

/*
 1、当天的通知显示：距离时间不足1小时，显示xx分钟前（例如：45分钟前）；距离时间超过1小时且仍未今天00:00分后的通知，显示x小时前（例如：5小时前）。
 2、 除了今天的通知，如果是昨天，则显示：昨天 xx时xx分（例如：昨天 16:34）
 3、除了今天和昨天的通知，如果在本周范围内，则显示：星期x xx时xx分（例如：星期三 11:22）
 4、超过了本周范围的通知，则直接显示日期，xx月xx日 xx时xx分（例如：10月18日 10:55）
 * */
function getRemainTime(str){
    var now = new Date();
    var zero = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);//零点时分
    var oneMin = 1000*60;//一分钟
    var oneHour = 1000*60*60;//一个小时
    var oneDay = 1000*60*60*24;//24小时
    var dateIndex = now.getDate();//今天是第几号
    var weekIndex = now.getDay();//今天是周几
    var result = '';
    if(str){
        str = str.split(/-| |:/);
        var t = new Date(parseInt(str[0]), parseInt(str[1])-1, parseInt(str[2]), parseInt(str[3]), parseInt(str[4]), parseInt(str[5]));
        var sub1 = now.getTime() - t.getTime();//数据创建时间距离当前时间的差值
        var sub2 = zero.getTime() - t.getTime();//数据创建时间距离今天零点时分的差值

        if(sub2>0){//数据创建时间早于今天0点
            if(sub2<= oneDay){//是昨天，则显示：昨天 xx时xx分
                var h1 = t.getHours();
                var m1 = t.getMinutes();
                h1 = (h1<10 ? ('0'+h1) : h1);
                m1 = (m1<10 ? ('0'+m1) : m1);

                result = '昨天 '+h1+'时'+m1+'分';
            }else{
                var td = {dateIndex:dateIndex, weekIndex:weekIndex};
                var o = {dateIndex:t.getDate(), weekIndex:t.getDay()};
                if(isSameWeek(td, o)){//星期x xx时xx分（例如：星期三 11:22）
                    var h2 = t.getHours();
                    var m2 = t.getMinutes();
                    h2 = (h2<10 ? ('0'+h2) : h2);
                    m2 = (m2<10 ? ('0'+m2) : m2);

                    var d1 = t.getDay();
                    var weekday=new Array(7);
                    weekday[0]="星期日";
                    weekday[1]="星期一";
                    weekday[2]="星期二";
                    weekday[3]="星期三";
                    weekday[4]="星期四";
                    weekday[5]="星期五";
                    weekday[6]="星期六";

                    result = weekday[d1]+' '+h2+':'+m2;
                }else{
                    var M1 = t.getMonth()+1;
                    var D1 = t.getDate();
                    M1 = (M1<10 ? ('0'+M1) : M1);
                    D1 = (D1<10 ? ('0'+D1) : D1);
                    var h3 = t.getHours();
                    var m3 = t.getMinutes();
                    h3 = (h3<10 ? ('0'+h3) : h3);
                    m3 = (m3<10 ? ('0'+m3) : m3);

                    result = M1+'月'+D1+'日 '+h3+':'+m3;//例如：10月18日 10:55

                    if(now.getFullYear() != t.getFullYear()){//例如：2015年10月18日 10:55
                        result = t.getFullYear()+result;
                    }
                }
            }
        }else{
            if(sub1 < oneHour){//距离时间不足1小时，显示xx分钟前
                result = parseInt(sub1/oneMin)+'分钟前';
            }else if(sub1<=oneDay){//超过1小时且仍未今天00:00分后的通知，显示x小时前
                result = parseInt(sub1/oneHour)+'小时前';
            }
        }
    }
    return result;

    function isSameWeek(today, other){
        if(today.dateIndex > other.dateIndex){
            if((today.dateIndex - other.dateIndex)<=6 && (today.weekIndex - other.weekIndex)<=6){
                return true;
            }else{
                return false;
            }
        }else if(today.dateIndex < other.dateIndex){
            if((other.dateIndex - today.dateIndex)<=6 && (other.weekIndex - today.weekIndex)<=6){
                return true;
            }else{
                return false;
            }
        }else{
            return true;
        }
    }
};