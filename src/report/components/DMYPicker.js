import React from 'react';

const weekText = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
module.exports = React.createClass({
    getInitialState: function () {
        return {
            queryType: 'day',
            day: {
                label: '指定周',
                placeholder: '通过日期选择周',
                format: 'yyyy-mm-dd'
            },
            week: {
                label: '指定月份',
                placeholder: '选择月份',
                format: 'yyyy-mm'
            },
            month: {
                label: '指定年份',
                placeholder: '选择年份',
                format: 'yyyy'
            }
        };
    },
    componentDidMount: function () {
        this.initDatePicker({toDisplay: this.toDisplay, toValue:this.toValue}, 'days', 'changeDate');
        this.changeDateHandle(new Date());
    },
    changeQueryType: function(type) {
        this.setState({queryType: type});

        if (type == 'week') {
            this.initDatePicker('yyyy-mm', 'months', 'changeMonth');
            this.changeMonthHandle(new Date());
        } else if (type == 'month') {
            this.initDatePicker('yyyy', 'years', 'changeYear');
            this.changeYearHandle(new Date());
        } else {
            this.initDatePicker({toDisplay: this.toDisplay, toValue:this.toValue}, 'days', 'changeDate');
            this.changeDateHandle(new Date());
        }
    },
    initDatePicker: function (format, viewMode, ev) {
        var self = this;
        var dpicker = $('.wrPicker');
        dpicker.val('').off().datepicker('destroy');
        dpicker.datepicker({
            format: format,
            viewMode: viewMode,
            minViewMode: viewMode,
            local: 'ZH_CN'
        }).on(ev, function (e) {
            if (self[ev + 'Handle'] && (typeof self[ev + 'Handle'] == 'function')) {
                self[ev + 'Handle'](e.date)
            }
        });
    },
    toDisplay: function (date, format, language) {
        var arr = this.getWeek(date);
        return arr[0].value + ' 至 ' + arr[arr.length-1].value;
    },
    toValue: function (date, format, language) {
        return date;
    },
    getWeek: function(sd){
        var d = new Date(sd);
        var dayIndex = d.getDay();
        var date = d.getDate();
        var month = d.getMonth();
        var year = d.getFullYear();
        if(dayIndex > 0){
            var newSun = new Date(year, month, (date + (7-dayIndex)), 0, 0, 0);
            date = newSun.getDate();
            month = newSun.getMonth();
            year = newSun.getFullYear();
        }

        var arr = [];
        for(var i=0; i<7; i++){
            var tmp = new Date(year, month, date-i, 0, 0, 0);
            var str = tmp.Format('yyyy/MM/dd').substring(5);
            var value = tmp.Format('yyyy-MM-dd');
            arr.push({text: str + weekText[tmp.getDay()], value:value, date:tmp});
        }
        arr.reverse();
        console.log(JSON.stringify(arr));
        return arr;
    },
    changeDateHandle: function (d) {
        var arr = this.getWeek(d);
        this.props.setDays(arr);
    },
    changeMonthHandle: function (d) {
        var firstDate = {
            value: d,
            year: d.getFullYear(),
            month: d.getMonth(),
            date: d.getDate(),
            dayIndex: d.getDay()
        };
        if(firstDate.date !== 1){
            firstDate.value = new Date(firstDate.year, firstDate.month, 1, 0, 0, 0);
            firstDate.year = firstDate.value.getFullYear();
            firstDate.month = firstDate.value.getMonth();
            firstDate.date = firstDate.value.getDate();
            firstDate.dayIndex = firstDate.value.getDay();
        }

        var tmp = new Date(firstDate.year, firstDate.month+1, 0, 0, 0, 0);
        var lastDate = {
            value: tmp,
            year: tmp.getFullYear(),
            month: tmp.getMonth(),
            date: tmp.getDate(),
            dayIndex: tmp.getDay()
        };
        if(firstDate.dayIndex !== 1){//首周跨月
            var start = new Date(firstDate.year, firstDate.month, (firstDate.date - firstDate.dayIndex + 1), 0, 0, 0);
            firstDate = {
                value: start,
                year: start.getFullYear(),
                month: start.getMonth(),
                date: start.getDate(),
                dayIndex: start.getDay()
            };
        }
        if(lastDate.dayIndex !== 0){//末周跨月
            var end = new Date(lastDate.year, lastDate.month, (lastDate.date+ 7 - lastDate.dayIndex), 0, 0, 0);
            lastDate = {
                value: end,
                year: end.getFullYear(),
                month: end.getMonth(),
                date: end.getDate(),
                dayIndex: end.getDay()
            };
        }
        var arr = [];
        var t = {
            dates: [],
            text: ''
        };
        for(var i=1; i<43; i++){
            var tt = new Date(firstDate.year, firstDate.month, (firstDate.date + i-1), 0, 0, 0);
            var str = tt.Format('yyyy-MM-dd');
            t.dates.push({date:tt, value: str, text:str.substring(5)});
            if( (i>0) && (i%7 === 0) ){
                t.text = t.dates[0].text+'至'+t.dates[6].text;
                t.start = t.dates[0].value;
                t.end = t.dates[6].value;
                arr.push(t);
                t = {
                    dates: [],
                    text: ''
                };
            }

            if(tt.getTime() == lastDate.value.getTime()) {
                break;
            }
        }
        console.log(JSON.stringify(arr));
        this.props.setWeeks(arr);
    },
    changeYearHandle: function (d) {
        var year = d.getFullYear();
        var arr = [];
        for(var i=0; i<12; i++){
            var start = new Date(year, i, 1, 0, 0, 0);
            if(i==11){
                var end = new Date(year, i, 31, 0, 0, 0);
            }else{
                var end = new Date(year, i+1, 0, 0, 0, 0);
            }
            arr.push({
                text: start.Format('yyyy-MM'),
                start: start.Format('yyyy-MM-dd'),
                end: end.Format('yyyy-MM-dd')
            });
        }
        console.log(JSON.stringify(arr));
        this.props.setMonths(arr);
    },
    render: function () {
        var queryType = this.state.queryType;
        return (
            <div className="form-group">
                <label>{this.state[queryType].label}</label>
                <div className="input-icon icon-right">
                    <div className="input-group">
                        <input ref="dmyPicker" className="form-control date-picker wrPicker" type="text"
                               placeholder={this.state[queryType].placeholder}/>
                        <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
                    </div>
                </div>
            </div>
        )
    }
});