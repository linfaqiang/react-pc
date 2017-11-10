import React from 'react';

function getScheduleDateInfo(str) {
    var t = str.split(/-| |:|\//);
    var hour = parseInt(t[3], 10);
    var stageText = '';
    if(hour<6){
        stageText = '凌晨';
    }else if(hour<9){
        stageText = '早上';
    }else if(hour<12){
        stageText = '上午';
    }else if(hour==12){
        stageText = '中午';
    }else if(hour<18){
        stageText = '下午';
    }else if(hour<=23){
        stageText = '晚上';
    }
    if(hour>12) hour -= 12;

    return {
        year: t[0],
        month: parseInt(t[1], 10),
        date: parseInt(t[2], 10),
        hour: hour,
        minute: parseInt(t[4], 10),
        stageText: stageText
    };
}
function returnScheduleLink(type, id){
    //0、日程、1生日、3任务、4活动
    if(type == 3){
        return '#/task';
    }
    if(type == 4){
        return '#/activity';
    }
    if(type == 0){
        return '#/schedule/schedule/'+id;
    }
    if(type==1){
        return '#/schedule/birthday/'+id;
    }
}

var CrossDayEventList = React.createClass({
    getInitialState: function(){
        return {
            showAll: false
        }
    },
    componentDidMount: function () {
    },
    showAll: function(){
        var self = this;
        self.setState({showAll: !self.state.showAll});
    },
    /*goDetail: function(type, id, e){
        this.props.goDetail(id, type);
    },*/
    render:function(){
        var self = this;
        var showAll = this.state.showAll;
        var list = this.props.list;
        var maxRow = this.props.maxRow;
        var lis = list.map(function(item, key){
            var startInfo = getScheduleDateInfo(item.tipStart);
            var endInfo = getScheduleDateInfo(item.tipEnd);

            var st = {
                width: item.width + '%',
                top: (item.top * 30) + 'px',
                left: (item.left ? (item.left + '%') : '0px'), 
                display: (item.top>=3 ? (showAll ? 'block' : 'none') : 'block')
            };
            
            return (// onClick={self.goDetail.bind(this, item.scheduleType, item.myScheduleId)}
                <li key={key} className={item.cls ? item.cls : ''} style={st}>
                    <p>
                        <a href={returnScheduleLink(item.scheduleType, item.myScheduleId)}>
                            <b title={"事件带有指定开始和结束时间："+startInfo.year+"年"+startInfo.month+"月"+startInfo.date+"日"
                                +item.weekStart+startInfo.stageText+startInfo.hour+"点"+startInfo.minute+"分 – "+
                                endInfo.year+"年"+endInfo.month+"月"+endInfo.date+"日"
                                +item.weekEnd+endInfo.stageText+endInfo.hour+"点"+endInfo.minute+"分"}>{item.start} ~ {item.end}</b>
                            &nbsp;&nbsp;
                            {item.subject}
                        </a>
                    </p>
                </li>
            );
        }.bind(this));

        return (
            <ul className="events days" style={{height: (maxRow>0 ? (maxRow>3 ? (3*30+1+'px') : (maxRow*30+1+'px')) : 'inherit')}}>
                {lis}
            </ul>
        )
    }
});

var EventsInDayList = React.createClass({
    componentDidMount: function () {
    },
    sortOneDayEvent: function(list){
        var data = list;
        var temp = {};

        for(var i = 0; i < data.length; i++) {//初始化位置数据
            var t = data[i].start.split('-');
            t = new Date(parseInt(t[0]), parseInt(t[1])-1, parseInt(t[2]), 0, 0, 0);
            data[i].top = Math.ceil((data[i].startTime - t.getTime())/(1000*60));
            data[i].width = parseFloat(((1/data.length)*100).toFixed(5));
            data[i].height = data[i].multi_min;
            data[i].left = 0;
        }
        for(var i = 0; i < data.length; i++) {//按开始时间排序
            for (var j = i; j < data.length; j++) {
                if (data[i].startTime > data[j].startTime) {
                    var t = data[i];
                    data[i] = data[j];
                    data[j] = t;
                }
            }
        }

        var colNum=0;
        while(data.length>0){
            var first = data[0];
            first.left = colNum;

            var tmp = new Array();
            var n = first.multi_min;

            tmp.push(first);
            data = data.deleteItemFromArray(0,1);

            for(var i=0; i<data.length; i++){
                if( (data[i].endTime < first.startTime) || (data[i].startTime > first.endTime) ){
                    if( (data[i].multi_min + n) <=1440 ){
                        var noReapet = true;
                        for(var j=0; j<tmp.length; j++){
                            if(data[i].startTime == tmp[j].startTime) {
                                noReapet = false;
                                break;
                            }
                        }
                        if(noReapet){
                            n += data[i].multi_min;
                            data[i].left = colNum;
                            tmp.push(data[i]);
                            data = data.deleteItemFromArray(i,1);
                        }
                    }else{
                        break;
                    }
                }
            }
            temp[colNum.toString()] = tmp;
            colNum++;//TODO：行数，需要返回
        }
        var result = new Array();

        for(var key in temp){
            result = result.concat(temp[key]);
        }
        for(var i=0; i<result.length; i++){//重设宽度
            result[i].width = parseFloat(((1/colNum)*100).toFixed(5));
        }
        return result;
    },
    /*goDetail: function(type, id){
        this.props.goDetail(id, type);
    },*/
    render:function(){
        var self = this;
        var list = this.sortOneDayEvent(this.props.list);
        var cls = this.props.cls;
        var lis = null;
        if(list.length > 0){
            lis = list.map(function(item, key){
                var st = {
                    width: item.width+'%',
                    height: item.height,
                    top: item.top+'px',
                    left: (key>0 ? (item.left*item.width+'%') : (0+'px'))
                };
                var startInfo = getScheduleDateInfo(item.tipStart);
                var endInfo = getScheduleDateInfo(item.tipEnd);

                return (// onClick={self.goDetail.bind(this, item.scheduleType, item.myScheduleId)}
                    <li key={key} style={st}>
                        <p>
                            <a href={returnScheduleLink(item.scheduleType, item.myScheduleId)}>
                                <b title={"事件带有指定开始和结束时间："+startInfo.year+"年"+startInfo.month+"月"+startInfo.date+"日"
                                +item.weekStart+startInfo.stageText+startInfo.hour+"点"+startInfo.minute+"分 – "+
                                endInfo.year+"年"+endInfo.month+"月"+endInfo.date+"日"
                                +item.weekEnd+endInfo.stageText+endInfo.hour+"点"+endInfo.minute+"分"}>{item.tipStart} ~ {item.tipEnd}</b>
                                <br />
                                {item.subject}
                            </a>
                        </p>
                    </li>
                );
            }.bind(this));
        }
        return (
            <ul className={cls? "events hours "+cls: "events hours"}>
                {lis}
            </ul>
        )
    }
});

module.exports = {
    CrossDayEventList: CrossDayEventList,
    EventsInDayList: EventsInDayList
};