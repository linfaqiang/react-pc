import React from 'react';
import {CrossDayEventList} from './Events';

module.exports = React.createClass({
    componentDidMount: function () {
    },
    componentDidUpdate: function () {
    },
    handleClick: function(e){
        //console.log(e.target);
    },
    getWeekEdge: function(){
        var start, end;
        var t = new Date();
        var weekIndex = t.getDate();
        if(weekIndex == 0){
            start = new Date(t.getFullYear, t.getMonth(), (t.getDate()-7+1), 0, 0, 0);
            end = t;
        }else{
            start = new Date(t.getFullYear, t.getMonth(), (t.getDate()-weekIndex+1), 0, 0, 0);
            end = new Date(t.getFullYear, t.getMonth(), (t.getDate()+7-weekIndex), 0, 0, 0);
        }
        return {
            start: start,
            end: end
        };
    },
    sortEvent: function (list, week) {
        var data = list;
        var temp = {};
        var weekEdge = week.length > 0 ? ({
                start: week[0].text.parseDateCreateByWX(),
                end: week[6].text.parseDateCreateByWX()
            }) : (this.getWeekEdge());
        var monDay = weekEdge.start.getTime();//todo:处理跨周数据
        var sunDay = weekEdge.end.getTime();
        var oneDay = 1000 * 60 * 60 * 24;

        for(var i = 0; i < data.length; i++) {//初始化位置数据
            data[i].startTimestamp = data[i].start.parseDateCreateByWX().getTime();
            data[i].endTimestamp = data[i].end.parseDateCreateByWX().getTime();
            data[i].width = data[i].multi_day*100;
            data[i].left = (data[i].startDay-1)*100;
            data[i].top = 0;
            
            if(data[i].startTime < monDay){//开始时间小于本周一
                if(data[i].endTime < monDay){//结束时间小于本周一
                    //todo:不存在的情况
                }else if(data[i].endTime >= monDay && data[i].endTime <= (sunDay+oneDay)){//结束时间在本周
                    data[i].left = 0;
                    data[i].cls = 'crossWeek left';
                    //data[i].width = (7-data[i].startDay+1)*100;
                    if(data[i].endDay == 0){
                        data[i].width = 7*100;
                    }else{
                        data[i].width = data[i].endDay*100;
                    }
                }else if(data[i].endTime > (sunDay+oneDay)){//结束时间大于本周日
                    data[i].left = 0;
                    data[i].cls = 'crossWeek left right';
                    data[i].width = 7*100;
                }
            }else if(data[i].startTime >= monDay && data[i].startTime <= (sunDay+oneDay)){//开始时间在本周
                if(data[i].endTime < monDay){
                    //todo:不存在的情况
                }else if(data[i].endTime >= monDay && data[i].endTime <= (sunDay+oneDay)){
                    //todo: 开始时间 和 结束时间都在本周
                    if(data[i].startDay==0){
                        data[i].left = 6*100;
                        data[i].width = 100;
                    }else{
                        data[i].left = (data[i].startDay-1)*100;
                        data[i].width = data[i].multi_day*100;
                    }
                }else if(data[i].endTime > (sunDay+oneDay)){
                    data[i].cls = 'crossWeek right';

                    if(data[i].startDay==0){
                        data[i].left = 6*100;
                        data[i].width = 100;
                    }else{
                        data[i].left = (data[i].startDay-1)*100;
                        data[i].width = (7-data[i].startDay+1)*100;
                    }
                }
            }else if(data[i].startTime > (sunDay+oneDay)){//开始时间大于本周日
                if(data[i].endTime < monDay){
                    //todo:不存在的情况
                }else if(data[i].endTime >= monDay && data[i].endTime <= (sunDay+oneDay)){
                    //todo:不存在的情况
                }else if(data[i].endTime > (sunDay+oneDay)){
                    //todo:不存在的情况
                }
            }
        }
        for(var i = 0; i < data.length; i++) {//按开始时间排序
            for (var j = i; j < data.length; j++) {
                if (data[i].startTimestamp > data[j].startTimestamp) {
                    var t = data[i];
                    data[i] = data[j];
                    data[j] = t;
                }
            }
        }

        var index=0;
        while(data.length>0){
            var first = data[0];
            first.top = index;

            var tmp = new Array();
            var n = first.multi_day;

            tmp.push(first);
            data = data.deleteItemFromArray(0,1);

            for(var i=0; i<data.length; i++){
                if( (data[i].endTimestamp < first.startTimestamp) || (data[i].startTimestamp > first.endTimestamp) ){
                    if( (data[i].multi_day + n) <=7 ){
                        var noReapet = true;
                        for(var j=0; j<tmp.length; j++){
                            if(data[i].startTimestamp == tmp[j].startTimestamp) {
                                noReapet = false;
                                break;
                            }
                        }
                        if(noReapet){
                            n += data[i].multi_day;
                            data[i].top = index;
                            tmp.push(data[i]);
                            data = data.deleteItemFromArray(i,1);
                        }
                    }else{
                        break;
                    }
                }
            }
            temp[index.toString()] = tmp;
            index++;//TODO：行数，需要返回
        }

        var result = new Array();

        for(var key in temp){
            result = result.concat(temp[key]);
        }
        return {
            list: result,
            maxRow: index
        };
    },
    showAll: function(maxRow, e){
        e.stopPropagation();
        e.preventDefault();

        var allDay = this.refs.allDay;
        var className = e.target.getAttribute('class');
        if(!className.match('up')){
            e.target.setAttribute('class', 'showAllEvent up');
            allDay.style.height = maxRow*30+1+'px';
        }else{
            e.target.setAttribute('class', 'showAllEvent');
            allDay.style.height = 3*30+1+'px';
        }
        this.refs.allDayList.showAll();
    },//style={{height: (maxRow>0 ? (maxRow>3 ? (3*30+1+'px') : (maxRow*30+1+'px')) : 'inherit')}}
    render: function(){
        var self = this;
        var week = this.props.week;
        var tmp = this.sortEvent(this.props.list, week);
        var list = tmp.list;
        var maxRow = tmp.maxRow;
        
        var weekDays = week.map(function(item, key){
            if(key==0){// goDetail={self.props.goDetail}
                return (
                    <td ref="allDay" data-date={item.text} key={key} onClick={this.handleClick}>
                        <CrossDayEventList ref="allDayList" list={list} maxRow={maxRow}></CrossDayEventList>
                        <span className="showAllEvent" onClick={self.showAll.bind(this, maxRow)} style={{display: (maxRow>3 ? 'block' : 'none')}}></span>
                    </td>
                )
            }else{
                return (
                    <td data-date={item.text} key={key} onClick={this.handleClick}>
                    </td>
                );
            }
        }.bind(this));
        
        return (
            <table className="table table-striped rich allDay">
                <tbody>
                <tr>
                    <td>
                    </td>
                    {weekDays}
                </tr>
                </tbody>
            </table>
        );
    }
});