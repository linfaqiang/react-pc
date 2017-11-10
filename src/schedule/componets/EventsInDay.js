import React from 'react';
import {EventsInDayList} from './Events';

module.exports = React.createClass({
    getInitialState: function () {
        var times = this.getTimesList();
        return {
            times: times,
        }
    },
    componentDidMount: function () {
        this.initSly();
    },
    componentDidUpdate: function () {
    },
    /**
     * 1. 点击事件轴任何一位置都可以创建生日/日程/任务/活动。默认创建生日：时间为当天，日程/任务/活动：坐标轴的时间带入开始时间，结束时间为坐标轴时间延后一小时。
     * 2. 如果指针区域正好为横线中间值。则取下面的时间。
     */
    clickHandle: function(e){
        var self = this;
        if(e.target.nodeName.toLowerCase() == 'td'){
            var rect = e.target.getBoundingClientRect();
            var clientY = e.clientY;
            var d = e.target.getAttribute('data-date');
            var h = e.target.parentNode.getAttribute('data-hour');

            if((clientY-rect.top)>30){//半小时
                h = h.split(':')[0]+':30';
            }

            var t = (d+' '+h).split(/-| |:/);
            var end = (new Date(parseInt(t[0]), parseInt(t[1])-1, parseInt(t[2]), parseInt(t[3])+1, parseInt(t[4]), 0)).Format('yyyy-MM-dd hh:mm');

            localStorage.setItem('CRM_AddSchedule_StartTime', (d+' '+h));
            localStorage.setItem('CRM_AddSchedule_EndTime', end);

            if(self.props.showNewData){
                self.props.showNewData({left:e.clientX, top:e.clientY});
            }
        }
    },
    getTimesList:function(){
        return [
            {cn:'凌晨12点00分', en:'00:00'},
            {cn:'凌晨1点00分', en:'01:00'},
            {cn:'凌晨2点00分', en:'02:00'},
            {cn:'凌晨3点00分', en:'03:00'},
            {cn:'凌晨4点00分', en:'04:00'},
            {cn:'凌晨5点00分', en:'05:00'},
            {cn:'早上6点00分', en:'06:00'},
            {cn:'早上7点00分', en:'07:00'},
            {cn:'早上8点00分', en:'08:00'},
            {cn:'上午9点00分', en:'09:00'},
            {cn:'上午10点00分', en:'10:00'},
            {cn:'上午11点00分', en:'11:00'},
            {cn:'中午12点00分', en:'12:00'},
            {cn:'下午1点00分', en:'13:00'},
            {cn:'下午2点00分', en:'14:00'},
            {cn:'下午3点00分', en:'15:00'},
            {cn:'下午4点00分', en:'16:00'},
            {cn:'下午5点00分', en:'17:00'},
            {cn:'晚上6点00分', en:'18:00'},
            {cn:'晚上7点00分', en:'19:00'},
            {cn:'晚上8点00分', en:'20:00'},
            {cn:'晚上9点00分', en:'21:00'},
            {cn:'晚上10点00分', en:'22:00'},
            {cn:'晚上11点00分', en:'23:00'}
        ];
    },
    initSly: function(){
        var $frame = $('#nonitembased');
        var $wrap = $frame.parent();

        var frame = new Sly('#nonitembased', {
            speed: 300,
            easing: 'easeOutExpo',
            pagesBar: null,
            activatePageOn: 'click',
            scrollBar: $wrap.find('.scrollbar'),
            scrollBy: 100,
            dragHandle: 1,
            dynamicHandle: 1,
            elasticBounds: 1,
            clickBar: 1,
        }).init();
        frame.on('moveStart', function (eventName) {
            var pos = this.pos;
            for(var key in pos){
                if(key !== 'old'){
                    this.pos.old[key] = pos[key];
                }
            }
        });
        frame.on('moveEnd', function (eventName) {
            if(this.pos.cur==0 && this.pos.old.cur==0){//用户持续向上滑
                console.log('tatatata');
            }
        });
    },
    render: function () {
        var self = this;
        var list = this.props.list;
        var week = this.props.week;
        var times = this.state.times;

        var tds = week.map(function(item, key){// goDetail={self.props.goDetail}
            var cls = (key==6 ? 'sunday' : '');
            return (
                <td data-date={item.text} key={key}>
                    <div className="eventListBox">
                        <EventsInDayList ref={'list'+item.text.replace(/-/g, '')} list={list[item.day+'']} cls={cls}></EventsInDayList>
                    </div>
                </td>
            );
        }.bind(this));//, 'eee', 'qqq', 'm'

        var trs = times.map(function(item, key){
            if(key==0) return null;

            var tdss = week.map(function(t, key){
                return <td data-date={t.text} key={key}></td>
            }.bind(this));

            return (
                <tr data-hour={item.en} key={key}>
                    <td><i>{item.cn}</i></td>{tdss}
                </tr>
            );
        }.bind(this));

        return (
            <div className="ver_wrap">
                <div className="scrollbar">
                    <div className="handle">
                        <div className="mousearea"></div>
                    </div>
                </div>
                <div className="frame nonitembased" id="nonitembased">
                    <div className="slidee">
                        <table className="table table-striped rich half" onClick={this.clickHandle}>
                            <tbody>
                                <tr data-hour="00:00">
                                    <td>
                                        <i>凌晨12点00分</i>
                                    </td>
                                    {tds}
                                </tr>
                                {trs}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});