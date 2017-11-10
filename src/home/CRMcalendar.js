/**
 * CRMalendar
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    require('./ccalendar.css');
    var _$window = $(window),
        _$document = $(document),
        _expando = "CRMcalender-" + (+new Date()) + "-",
        _count = 0;

    function CRMcalender(element, options) {
        this.initialize.apply(this, arguments);
        _count++;
    }
    module.exports=CRMcalender;
    /** 原型函数 **/
    CRMcalender.prototype = {
        //构造函数
        constructor: CRMcalender,
        //初始化函數
        initialize: function (element, options) {
            options = options || {};
            this.element = $(element);
            this.format = GLOBLE.parseFormat(options.format || this.element.data('date-format') || 'yyyy-mm-dd');
            this.isInput = this.element.is("input");

            // 合并默认配置
            var dftCfg = CRMcalender.defcfg;
            for (var i in dftCfg) {
                if (options[i] === undefined) {
                    options[i] = dftCfg[i];
                }
            }

            this.direction = options.direction || CRMcalender.direction.Left;     //默认提示控件在左边
            options.id = options.id || _expando + _count;
            this.picker = $("<div/>", {"id": options.id, "class": "ui-date staticPos"})
                .appendTo(options.thisDom ? $(options.thisDom) : 'body').bind({
                    click: $.proxy(this.click, this)
                });

            this.component = this.element.is('.date') ? this.element.find('.add-on') : false;
            this.create(options);
            this.monthChange(JSON.stringify(this.date));
            //如果是输入框

            // if (this.isInput) {   zhushi
            //     this.element.bind({
            //         focus: $.proxy(this.show, this),    //当有一个日历出现时，ie下不执行
            //         keyup: $.proxy(this.update, this)
            //     });
            // } else {
            //     if (this.component) {
            //         this.component.bind('click', $.proxy(this.show, this));
            //     } else {
            //         this.element.bind('click', $.proxy(this.show, this));
            //     }
            // }
        },
        //初始化配置
        setOptions: function (options) {
            this.options = options;
            this.options.monthType = options.monthType || 1 ;
            this.options.inWeek = options.inWeek || false ;

            this.options.startDate && typeof this.options.startDate === "string" && (this.options.startDate = GLOBLE.parseDate(this.options.startDate, this.format));
            this.lang =  GLOBLE.lang[this.options.lang];
            (this.options.maxDate && (this.options.maxDate = GLOBLE.parseDate(this.options.maxDate, this.format)));
            (this.options.minDate && (this.options.minDate = GLOBLE.parseDate(this.options.minDate, this.format)));
            this.date = {
                year: this.options.startDate.getFullYear(),
                month: this.options.startDate.getMonth(),
                days: this.options.startDate.getDate()
            };
        },
        //创建日历
        create: function (options) {
            this.setOptions(options);
            this.fill(this.date);
            var week = this.getWeek();//获取本周日期
            if(this.options.inWeek){
                this.setDayInWeek(week);
            }
            this.calendarCreated(week);
        },
        //监听点击事件
        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var dp = this,
                options = dp.options,
                el = $(e.target),
                target = $(e.target).closest('a')[0];
            var name = el[0].nodeName.toLowerCase();
            if(name==='div'){
                if(el.attr('class').match('d-')){
                    target = el.children('a')[0];
                }
            }
            if (!target) return false;
            if (target.getAttribute('data-disabled') == "true") return false;
            var action = target.getAttribute('data-action');
            if (!action) return false;

            $(target).addClass('hover').closest('div').siblings().find('a').removeClass('hover');

            //$('.ui-days-current').removeClass('ui-days-current');

            switch (action) {
                case "SELECT_YEAR":
                {
                    //dp.createYearModel(dp.date.year, target);
                }
                    break;
                case "PREV-10-YEAR":
                case "NEXT-10-YEAR":
                {
                    dp.createYearModel(parseInt(target.getAttribute("data-year")), null);
                }
                    break;
                case "SELECT_MONTH":
                {
                    //dp.createMonthModel(dp.date.month, target);
                }
                    break;
                case "YEAR":
                {
                    dp.fill({
                        year: parseInt(target.getAttribute("data-year"))
                    });
                }
                    break;
                case "MONTH":
                {
                    dp.fill({
                        month: parseInt(target.getAttribute("data-month") - 1)
                    });
                }
                    break;
                case "DAY":
                {
                    this.select(target);
                }
                    break;
                case "TODAY":
                {
                    dp.select(target);
                    dp.update();
                }
                    break;
                case "YEAR_LEFT":
                {
                    dp.date.year -= options.showCount;
                    dp.fill(dp.date);
                    dp.monthChange(JSON.stringify(dp.date));
                }
                    break;
                case "YEAR_RIGHT":
                {
                    dp.date.year += options.showCount;
                    dp.fill(dp.date);
                    dp.monthChange(JSON.stringify(dp.date));
                }
                    break;
                case "MONTH_LEFT":
                {
                    dp.date.month -= options.showCount;
                    if (dp.date.month < 0) {
                        dp.date.month = dp.date.month + 12;
                        dp.date.year--;
                    }
                    dp.fill(dp.date);
                    dp.monthChange(JSON.stringify(dp.date));
                }
                    break;
                case "MONTH_RIGHT":
                {
                    dp.date.month += options.showCount;
                    if (dp.date.month > 11) {
                        dp.date.month = dp.date.month - 12;
                        dp.date.year++;
                    }
                    dp.fill(dp.date);
                    dp.monthChange(JSON.stringify(dp.date));
                }
                    break;
                default :
                {
                }
            }
        },
        //构建主体
        fill: function (date) {
            var dp = this,
                options = dp.options;

            var disabled,
                isShowToday = true,
                year = (date.year || this.date.year),
                month = (date.month==0)?0:(date.month || this.date.month),
                __today = new Date(GLOBLE.today.year, GLOBLE.today.month, GLOBLE.today.date);

            this.date.year = year,
                this.date.month = month;

            var main = this.dom ? this.dom.main : $("<div/>", {"class": "main"}).appendTo(this.picker);
            main.empty();

            for (var i = 0; i < options.showCount; i++) {

                var dayCount = GLOBLE.getDaysInMonth(year, month),
                    prev = GLOBLE.getPNDate(year, (month + 1), -1),
                    next = GLOBLE.getPNDate(year, (month + 1), 1),
                    startPad = new Date(year, month, 1).getDay(),
                    pday,
                    list = $("<div/>", {
                        "class": "ui-date-list ui-month" + i + (options.showCount > 1 && year == GLOBLE.today.year && month == (GLOBLE.today.month + 1) ? ' ui-month-cur' : '')
                    });
                var html;
                if(this.options.monthType == 1){
                    html = ['<div class="ui-date-head ui-date-top">'];
                    (i == 0) && html.push('<a  data-action="YEAR_LEFT" class="ui-year-left" href="javascript:void(0)" title="' + dp.lang.previousYear + '">&laquo;</a><a  data-action="MONTH_LEFT" class="ui-month-left" href="javascript:void(0)" title="' + dp.lang.previousMonth + '">&lsaquo;</a>');

                    html.push('<a  data-action="SELECT_YEAR"  class="ui-year" href="javascript:void(0)" title="' + dp.lang.selectYear + '">' + year + '</a>年<a  data-action="SELECT_MONTH" class="ui-month" data-year="' + year + '" href="javascript:void(0)" data-dom="month" title="' + dp.lang.selectMonth + '" >' + (((month + 1) < 10 ? '0' : '') + (month + 1)) + '</a>月');

                    (i + 1 == options.showCount) && html.push('<a  data-action="MONTH_RIGHT"  class="ui-month-right" href="javascript:void(0)" title="' + dp.lang.nextMonth + '">&rsaquo;</a><a  data-action="YEAR_RIGHT"  class="ui-year-right" href="javascript:void(0)" title="' + dp.lang.nextYear + '">&raquo;</a>');

                    //星期
                    html.push('</div><div class="ui-date-content clearfix"><div class="ui-date-week">');
                    for (var j = 0; j < 7; j++) html.push('<span class="ui-week ' + j + '">' + dp.lang.week[j] + '</span>');

                    html.push('</div><div class="ui-date-days">');
                    var nday = startPad = startPad == 0 ? 6 : startPad - 1;
                    for (; startPad >= 0; startPad--) {
                        pday = (prev.day - startPad);
                        _innerDay(prev, pday, true);
                    }


                    for (var j = 1; j <= dayCount; j++) {
                        disabled = false;
                        var day = new Date(year, month, j).getDay();
                        html.push('<div class="d-' + day);

                        if (options.maxDate && options.maxDate <= new Date(year, month, j) || options.minDate && options.minDate >= new Date(year, month, j)) {
                            disabled = true;
                            html.push(' ui-days-disabled');
                        }

                        if (options.expired && new Date(year, month, j) < __today)
                            html.push(' ui-days-old');

                        if (GLOBLE.today.year == year && GLOBLE.today.month == month && GLOBLE.today.date == j) {
                            html.push(' ui-days-current');
                            if (disabled) isShowToday = false;
                        }
                        html.push('"><a  data-action="DAY"  href="javascript:void(0)" data-year="' + year + '" data-date="' + year +'-'+ (month>=9? (month + 1) : ('0'+(month + 1)) )+'-' + (j>9? j : ('0'+j)) + '" data-month="' + (month + 1 ) + '" data-day="' + j + '" data-disabled="' + disabled + '" data-old="' + (new Date(year, month, j) < __today ? 1 : 0 ) + '" >' + j + '</a></div>');
                    }

                    for (var j = 1; j < 42 - dayCount - nday; j++) {
                        _innerDay(next, j);
                    }

                    html.push('</div></div>');
                }
                else {
                    html = ['<div class="ui-date-head ui-date-top ui-month-top">'];
                    (i == 0) && html.push('<a  data-action="YEAR_LEFT" class="ui-year-left" href="javascript:void(0)" title="' + dp.lang.previousYear + '">&laquo;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>');
                    html.push('<a  data-action="SELECT_YEAR"  class="ui-year" href="javascript:void(0)" title="' + dp.lang.selectYear + '">' + year + '</a>年');
                    (i + 1 == options.showCount) && html.push('<a  data-action="YEAR_RIGHT"  class="ui-year-right" href="javascript:void(0)" title="' + dp.lang.nextYear + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&raquo;</a></div>');
                    html.push('<div class="ui-date-content clearfix"><div class="ui-date-days ui-date-month">');
                    for (var z = 1; z <= 12; z++) {
                        disabled = false;    //先不做限制
                        html.push('<div class="m-' + z);   // 月份，class会有样式的话，就需要修改
                        if (options.maxDate && options.maxDate <= new Date(year, z) || options.minDate && options.minDate >= new Date(year, z)) {
                            disabled = true;
                            html.push(' ui-days-disabled');
                        }
                        //                    if (options.expired && new Date(year, month, z) < __today)     //猜测是当月的日的样式不一样,月报表不需要这个
                        //                        html.push(' ui-days-old');
                        if (GLOBLE.today.year == year && GLOBLE.today.month == z-1) {
                            html.push(' ui-days-current');   //先借用日的样式
                            //  if (disabled) isShowToday = false;
                        }
                        html.push('"><a  data-action="DAY"  href="javascript:void(0)" data-year="' + year + '" data-month="' + z + '" data-day="' + 1 + '" data-disabled="' + disabled + '" >' + z + '月</a></div>');
                    }
                    html.push('</div></div>');
                }
                list.html(html.join(""));

                main.append(list);
                if (++month == 12) {
                    year++;
                    month = 0;
                }
            }

            if (GLOBLE.ie) {
                this.picker.width(200 * options.showCount);
                if (GLOBLE.ie == 6) {
                    var background = $('<div />', {"class": "ui-date-mark"}).css({
                        width: this.picker.innerWidth(),
                        height: this.picker.innerHeight()
                    }).html('<iframe frameborder="0" src="about:blank" scrolling="no"></iframe>');
                    this.picker.append(background);
                }
            }
            this.dom = {
                main: main
            };


            function _innerDay(obj, pday, flag) {
                html.push('<div class="d-' + pday);
                disabled = true;
                //html.push(' ui-days-disabled');
                html.push(' ui-days-old');
               /* if (options.maxDate && options.maxDate <= new Date(obj.year, obj.month, pday) || options.minDate && options.minDate >= new Date(obj.year, obj.month, pday)) {
                    disabled = true;
                    html.push(' ui-days-disabled');
                }else{
                    disabled = false;
                };

                if (options.expired && new Date(obj.year, obj.month, pday) < __today)
                    html.push(' ui-days-old');*/

                html.push(' ui-days-other">');
                html.push('<a data-action="DAY"  href="javascript:void(0)" data-date="' + obj.year +'-'+ (obj.month>=9? (obj.month + 1) : ('0'+(obj.month + 1)) )+'-' + (pday>9? pday : ('0'+pday)) + '" data-year="' + obj.year + '"  data-disabled="' + disabled + '" data-month="' + (obj.month + 1 ) + '" data-day="' + pday + '">' + pday + '</a>');
                html.push('</div>');
            }
        },
        getWeek:function(){
            var t = '', d = null;
            var week = new Array();
            var selDay = $('#calender-first .ui-date-days a.hover');
            var dayBox = $('#calender-first .ui-date-days div.ui-days-current');

            if(selDay.length>0){
                t = selDay.eq(0).attr('data-date');
            }else if(dayBox.length>0){
                t = dayBox.eq(0).find('a').attr('data-date');
            }

            if(t){
                t = t.split(/-| |:/);
                d = new Date(parseInt(t[0]), parseInt(t[1])-1, parseInt(t[2]), 0, 0, 0);
            }else{
                d = new Date();
            }
            var weekIndex = d.getDay();

            for(var i=0; i<7; i++){
                var sub = 0;
                if(weekIndex==0){
                    sub = weekIndex - i;
                }else{
                    sub = i - weekIndex+1;
                }
                var nd = new Date(d.getFullYear(), d.getMonth(), d.getDate()+sub, 0, 0, 0);//nd.Format('yyyy-MM-dd')||
                var str = (d.getFullYear()+'-'+(d.getMonth()+1>9 ? d.getMonth()+1 : '0'+d.getMonth()+1)+'-'+(d.getDate()+sub>9 ? (d.getDate()+sub) : '0'+(d.getDate()+sub)));
                week.push({text: str});
            }
            if(weekIndex==0){
                week.reverse();
            }
            return week;
        },
        setDayInWeek: function(week){
            if(week instanceof Array){
                var days = $('#calender-first .ui-date-days a');
                var dayBox = $('#calender-first .ui-date-days div');
                dayBox.removeClass('inWeek');

                for(var i=0; i<week.length; i++){
                    for(var j=0; j<days.length; j++){
                        if(days.eq(j).attr('data-date') == week[i].text){
                            days.eq(j).closest('div').eq(0).addClass('inWeek');
                            break;
                        }
                    }
                }
            }
        },
        //创建年份面板
        createYearModel: function (year, target) {
            var self = this,
                years = $(".ui-year-list", self.dom.main);

            if (years.length == 0) {
                years = $("<div/>", {"class": "ui-year-list"});
                self.dom.main.append(years);
                self.dom["year"] = years;
                self.dom.main.bind("mousedown", function (ev) {
                    if ($(ev.target).closest('.ui-year-list').length == 0) {
                        years.hide();
                    }
                    return false;
                });
            }

            if (target) {
                var offset = $(target).position();
                years.css({
                    top: offset.top + 17,
                    left: offset.left - 37 / 2
                }).show();
            }

            var items = [
                {
                    value: year - 10,
                    label: '&laquo;',
                    role: 'PREV-10-YEAR'
                }
            ];

            for (var i = year - 6; i < year + 4; i++) {
                items.push({
                    value: i,
                    label: i,
                    role: 'YEAR'
                });
            }
            items[7] = {value: year, label: year, role: 'YEAR', current: true};
            items.push({
                value: year + 10,
                label: '&raquo;',
                role: 'NEXT-10-YEAR'
            });

            var current = {
                value: year,
                label: year
            };
            var html = [];
            for (var j = 0, l = items.length; j < l; j++) {
                var y = items[j]
                html.push('<a href="javascript:void(0)" data-action="' + y.role + '" class="' + (y.value < GLOBLE.today.year ? " ui-date-old" : "") + (y.value == GLOBLE.today.year ? " ui-date-current" : "") + '" data-year="' + y.value + '">' + y.label + '</a>');

            }
            years.html(html.join(""));
        },
        //创建月份面板
        createMonthModel: function (month, target) {
            var self = this,
                list = $(".ui-month-list", self.dom.main);

            if (list.length == 0) {
                list = $("<div/>", {"class": "ui-month-list"});
                self.dom.main.append(list);
                self.dom["month"] = list;
                self.dom.main.bind("mousedown", function (ev) {
                    if ($(ev.target).closest('.ui-month-list').length == 0) {
                        list.hide();
                    }
                    return false;
                });
            }

            if (target) {
                var offset = $(target).position();
                list.css({
                    top: offset.top + 26,
                    left: offset.left - 23 / 2
                }).show();
            }


            var items = [];

            for (var i = 1; i <= 12; i++) {
                items.push({
                    value: i,
                    label: i,
                    role: 'MONTH'
                });
            }

            var current = {
                value: month,
                label: month
            };
            var html = [];
            for (var j = 0, l = items.length; j < l; j++) {
                var m = items[j]
                html.push('<a href="javascript:void(0)" data-action="' + m.role + '" class="' + (m.value < GLOBLE.today.month + 1 ? " ui-date-old" : "") + (m.value == GLOBLE.today.month + 1 ? " ui-date-current" : "") + '" data-month="' + m.value + '">' + m.label + '</a>');

            }
            list.html(html.join(""));
        },
        //更新
        update: function (newDate,monthType) {
            // console.log("update");
            var date = GLOBLE.parseDate(
                typeof newDate === 'string' ? newDate : (this.isInput ? this.element.prop('value') : this.element.data('date')),
                this.format
            );
            if(monthType){
                this.options.monthType = monthType;   //1 代表日   ，2  代表月
            }
            this.fill({
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate()
            });
        },
        select: function (target) {
            var dp = this,
                options = dp.options;

            if (options.expired && target.getAttribute('data-old') == 1) return false;
            var yyyy = target.getAttribute('data-year'),
                yy = yyyy.substr(2),
                m = parseInt(target.getAttribute('data-month')),
                mm = m < 10 ? '0' + m : m,
                d = parseInt(target.getAttribute('data-day')),
                dd = d < 10 ? '0' + d : d,
                date = new Date(yyyy, m - 1, d),
                time = date.getTime(),
                back = GLOBLE.formatDate(date, dp.format),
                backData = {
                    yyyy: yyyy,
                    yy: yy,
                    mm: mm,
                    m: m,
                    dd: dd,
                    d: d,
                    back: back,
                    date: date,
                    time: time
                };

            //选择日期前
            if (this.options.onSelect){
                var week = this.options.onSelect(backData);// && !this.options.onSelect.call(dp, backData)

                if(!week)return null;

                if(week instanceof Array){
                    this.setDayInWeek(week);
                }

            }
            if (!dp.isInput) {
                if (dp.component) {
                    dp.element.find('input').prop('value', backData.back);
                }
                dp.element.data('date', backData.back);
            } else {
                dp.element.prop('value', backData.back);
            }

            //选择日期后
            if (this.options.onSelectBack) {
                if (this.options.onSelectBack.call(dp, backData)) dp.hide();
                return false;
            }
        },
        monthChange:function(data){
            if (this.options.onMonthChange){
                this.options.onMonthChange(data);
            }
        },
        calendarCreated:function(data){
            if (this.options.onCalendarCreated){
                this.options.onCalendarCreated(data);
            }
        },
        //显示
        show: function (e) {   //当元素focus时，执行
            this.picker.show();
            //console.log("show");
            this.height = this.component ? this.component.outerHeight() : this.element.offsetHeight;
            this.width = this.component ? this.component.outerWidth() : this.element.offsetHeight;
            this.offset();    //定位日历的位置，日历控件使用的是absolute定位
            _$window.bind('resize', $.proxy(this.offset, this));   //窗口放大缩小时，也会重新定位
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }

            var that = this;
            _$document.unbind('mousedown mousewheel');
            _$document.bind({
                'mousedown':function (ev){
                    var target = $(ev.target);
                    if (target.closest('.ui-date').length == 0 && target.attr("id") != that.element.attr("id")) {
                        //that.hide();  zhushi
                        if($(target).is("div.containerBox")){  //这是针对T平台的div设置的，以防在谷歌浏览器下，点击滚动条，input焦点不消失问题
                            that.element.blur();    //为什么加if，因为在IE下，目标元素不是div.containerBox，那么会使input点击两次才能出来日历插件
                        }   //本hack只有在谷歌浏览器下，点击日历控件后，再点击滚动条，才会出现问题。因此只针对T平台。其他平台使用必须添加div.containerBox

                    }
                },
                'mousewheel': function(ev) {
                    var target = $(ev.target);
                    if (target.closest('.ui-date').length == 0) {

                        //that.hide();   zhushi
                        that.element.blur();
                    }
                }

            });

            this.element.trigger({
                type: 'show',
                date: this.date
            });
        },
        offset: function () {
            var offset = this.component ? this.component.offset() : this.element.offset();
            var top = offset.top,
                left = offset.left,
                ww = _$window.width(),
                pw = this.picker.width();

            var css = { top: top + this.height };
            switch (this.direction) {
                case "Left":
                    css.left = left >= pw ? (left - pw ) + this.width : left
                    break;
                case "Right":
                    css.left = ww <= (pw + left) ? left - pw + this.width : left
                    break;
            }

            this.picker.css(css);
        },
        //隐藏
        hide: function () {
            this.picker.hide();
            //this.element.blur();
            _$window.unbind('resize', this.offset);
            if (!this.isInput) {           //不知道什么意思
                $(document).unbind('mousedown', this.hide);
            }
            this.element.trigger({
                type: 'hide',
                date: this.date
            });

            typeof this.options.onHide == "function" && this.options.onHide.call(this);
        },
        /**
         * 关闭日历
         */
        close: function () {
            //this.hide();  zhushi
            this.picker.remove();

            this.element.unbind({
                focus: $.proxy(this.show, this),
                keyup: $.proxy(this.update, this)
            });

            var callback = this.options.onClose;

            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    delete this[i];
                }
            }
            typeof callback == "function" && callback.call(this, true);
        }
    };

    /** 静态对象 **/
    var GLOBLE = {
        ie: document.all && navigator.userAgent.match(/\s{1}\d{1}/),
        //语言包
        lang: {
            "zh-cn": {
                week: ['日', '一', '二', '三', '四', '五', '六'],
                previousMonth: '上一月',
                nextMonth: '下一月',
                previousYear: '上一年',
                nextYear: '下一年',
                selectYear: '选择年',
                selectMonth: '选择月',
                more: '更多',
                today: '今'
            }
        },
        //今天
        today: {
            year: new Date().getUTCFullYear(),
            month: new Date().getMonth(),
            date: new Date().getDate()
        },
        //是否是闰年
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
        },
        //获取月份的天数
        getDaysInMonth: function (year, month) {
            return [31, (GLOBLE.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
        },
        //获取上下月
        getPNDate: function (year, month, path) {
            if ((month += (path || 0)) < 1) {
                month = 12;
                year--;
            } else if (month > 12) {
                month = 1;
                year++;
            }
            var date = new Date(year, month, 0);
            return {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate()
            };
        },
        //转换为格式对象
        parseFormat: function (format) {
            var separator = format.match(/[.\/\-\s].*?/), parts = format.split(/\W+/);
            if (!separator || !parts || parts.length === 0) {
                throw new Error("Invalid date format.");
            }
            return {
                separator: separator,
                parts: parts
            };
        },
        //格式化字符日期
        parseDate: function (date, format) {
            var parts = date.split(format.separator), date = new Date(), val;
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            if (parts.length === format.parts.length) {
                var year = date.getFullYear(), day = date.getDate(), month = date.getMonth();
                for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
                    val = parseInt(parts[i], 10) || 1;
                    switch (format.parts[i]) {
                        case 'dd':
                        case 'd':
                            day = val;
                            date.setDate(val);
                            break;
                        case 'mm':
                        case 'm':
                            month = val - 1;
                            date.setMonth(val - 1);
                            break;
                        case 'yy':
                            year = 2000 + val;
                            date.setFullYear(2000 + val);
                            break;
                        case 'yyyy':
                            year = val;
                            date.setFullYear(val);
                            break;
                    }
                }
                date = new Date(year, month, day, 0, 0, 0);
            }
            return date;
        },
        //格式化日期字符串
        formatDate: function (date, format) {
            var val = {
                d: date.getDate(),
                m: date.getMonth() + 1,
                yy: date.getFullYear().toString().substring(2),
                yyyy: date.getFullYear()
            };
            val.dd = (val.d < 10 ? '0' : '') + val.d;
            val.mm = (val.m < 10 ? '0' : '') + val.m;
            var date = [];
            for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
                date.push(val[format.parts[i]]);
            }
            return date.join(format.separator);
        }
    };

    //定义常量
    CRMcalender.direction = {
        Top: 'Top',			//上边
        Right: 'Right',		//右边
        Bottom: 'Bottom',	//下边
        Left: 'Left'		//左边
    };
    //默认配置
    CRMcalender.defcfg = {
        id: null,
        showCount: 1,
        direction: "Left",
        startDate: new Date(),
        maxDate: false,
        minDate: false,
        expired: false,
        lang: 'zh-cn',
        isShowTo: false,
        onSelect: null,
        onSelectBack: null,
        onHide: null,
        onClose: null
    };

    /** 全局变量  **/
    $.fn.CRMcalender = function (option) {
        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this),
                data = $this.data('CRMcalender'),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('CRMcalender', (data = new CRMcalender(this, options)));
            }
            if (typeof option == 'string' && typeof data[option] == 'function') {
                data[option].apply(data, args);
            }
        });
    };
    $.fn.CRMcalender.Constructor = CRMcalender;
    // return CRMcalender;
});