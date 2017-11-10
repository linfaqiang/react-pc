import React from 'react';
import ListPager from '../core/components/TableList/ListPager';

var Content = React.createClass({

    renderIcon:function (type) {

         var icon = '';

         switch(type){
             case '活动':
                 icon = 'pcicon-active';
                 break;
             case '日程':
                 icon = 'pcicon-schedule';
                 break;
             case '任务':
                 icon = 'pcicon-task2';
                 break;
             case '生日':
                 icon = 'pcicon-birthday';
                 break;
             default :
                 icon = 'pcicon-clock';//提醒
                 break;
         }

         return icon;
    },
    
    render:function(){

        var lists = this.props.list;

        if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');

        function timeSet(data){
            var result = '';
            result = data.isAllDay? '全天' : data.taskTime;

            if(data.isAllDay){
                result = '全天';
            }else{
                var t1 = new Date(data.startTime);
                var t2 = new Date(data.endTime);
                result = t1.Format('yyyy-MM-dd hh:mm').split(' ')[1]+'-'+t2.Format('yyyy-MM-dd hh:mm').split(' ')[1];
            }

            if(data.scheduleTypeName == '生日'){
                result = (new Date(data.startTime)).Format('yyyy-MM-dd');
            }
            return result;
        }

        var lis = lists.map(function(qst,key){
            return <li key={key}>
                        <span className="left-icon">
                            <span className={'scheduleIcon pcicon '+this.renderIcon(qst.scheduleTypeName)}></span>
                            <span>{qst.scheduleTypeName}</span>
                        </span>
                        <h5>{qst.subject}</h5>
                        <p style={qst.myScheduleDesc.length>0 ? {color:'#333'} : {display:'none'}}>{qst.myScheduleDesc}</p>
                        <p>{timeSet(qst)}</p>
                   </li>
        }.bind(this));
        
        return (
            <ul className="calender-list">
                {lis}
            </ul>
        )
    }
});

module.exports = React.createClass({

    getInitialState:function(){
        return {
            pageData:{
                currentPage:1,
                totalSize:0,
                num:0
            },
            lists:[

            ]
        }
    },

    componentDidMount:function(){

    },

    setPagerData:function (list) {    //设置页码信息

        var totalSize = list.totalSize||100,
            pageSize = this.props.trackData.pageSize||10,
            num =  (totalSize % pageSize == 0) ? totalSize/pageSize : parseInt(totalSize/pageSize)+1;

        this.setState({
            lists:list.data,
            pageData:{
                currentPage:this.state.pageData.currentPage,
                totalSize:list.totalSize,
                num:num
            }
        })
    },


    setCurrentPage:function (num) {

        this.state.pageData.currentPage = num;

        this.setState(this.state.pageData);
    },

    goPage:function (num,cb) {

        var param = {
            pageSize:this.props.trackData.pageSize,
            today:this.props.trackData.today,
            isDesktop:this.props.trackData.isDesktop,
            pageNo:num
        };

        if(typeof cb == 'function'){
            cb();
        }else{
            this.setCurrentPage(num);
        }

        this.props.getData(param);


    },

    prePage:function (num) {
        var self = this;
        if(num-1 < 1){
            return;
        }

        this.goPage(num-1,function () {
            self.setCurrentPage(num-1);
        })
    },

    nextPage:function (num) {
        var self = this;
        if(num+1 > this.state.pageData.num){
            return;
        }

        this.goPage(num+1,function () {
            self.setCurrentPage(num+1);
        })
    },

    render:function(){
        return (
            <div className="calender-list-wrap">
                <Content list={this.state.lists} />
                <ListPager pageData={this.state.pageData}
                           num={this.state.pageData.num}
                           pagesize={this.props.trackData.pageSize}
                           prePage={this.prePage}
                           goPage={this.goPage}
                           nextPage={this.nextPage}
                />
                {/*<p className="padding-left-10"><a href="javascript:void(0)">查看更多>></a></p>*/}
            </div>
        )
    }
});