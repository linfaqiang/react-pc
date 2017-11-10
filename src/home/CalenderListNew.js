import React from 'react';
//import ListPager from '../core/components/TableList/ListPager';
import {Pagination, Select} from 'antd';

var Content = React.createClass({

    renderIcon: function (type) {

        var icon = '';

        switch (type) {
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

    render: function () {

        var lists = this.props.list;

        if (!Array.isArray(lists)) throw new Error('this.props.lists必须是数组');

        function timeSet(data) {
            var result = '';
            result = data.isAllDay ? '全天' : data.taskTime;

            if (data.isAllDay) {
                result = '全天';
            } else {
                var t1 = new Date(data.startTime);
                var t2 = new Date(data.endTime);
                result = t1.Format('yyyy-MM-dd hh:mm').split(' ')[1] + '-' + t2.Format('yyyy-MM-dd hh:mm').split(' ')[1];
            }

            if (data.scheduleTypeName == '生日') {
                result = (new Date(data.startTime)).Format('yyyy-MM-dd');
            }
            return result;
        }

        function renderTitle(item){
            if(item.subject){
                return <h5>{item.subject}</h5>
            }else if(item.audioSubjectFileUrl){
                return (
                    <div className="audioBox" style={item.audioSubjectFileUrl && item.audioSubjectFileUrl.length>0? {} : {display:'none'}}>
                        <audio  src={item.audioSubjectFileUrl ? item.audioSubjectFileUrl.replace('.amr', '.mp3') : 'javascript:void(0);'}>你的浏览器不支持audio</audio>
                        <p className='audioInfo'>
                            <span className="currentTime"></span><span className="duration"></span>
                        </p>
                    </div>
                )
            }
        }

        var lis = lists.map(function (qst, key) {
            return (
                <li key={key}>
                        <span className="left-icon">
                            <span className={'scheduleIcon pcicon ' + this.renderIcon(qst.scheduleTypeName)}></span>
                            <span>{qst.scheduleTypeName}</span>
                        </span>
                    {renderTitle(qst)}
                    {/*<h5>{qst.subject}</h5>*/}
                    <p style={qst.myScheduleDesc.length > 0 ? {color: '#333'} : {display: 'none'}}>{qst.myScheduleDesc}</p>
                    <p>{timeSet(qst)}</p>
                </li>
            )
        }.bind(this));

        return (
            <ul className="calender-list">
                {lis}
            </ul>
        )
    }
});

module.exports = React.createClass({
    getInitialState: function () {
        var pageSize = this.props.trackData.pageSize;
        return {
            /*pageData:{
             currentPage:1,
             totalSize:0,
             num:0
             },*/
            list: [],
            pageData: {
                pageNo: 1,
                totalSize: 0,
                pageSize: pageSize
            },
            curPage: 1
        }
    },
    componentDidMount: function () {

    },
    componentDidUpdate:function(){
        playAudio();
    },

    setPagerData: function (data) {    //设置页码信息
        var self = this;
        var param = self.state.pageData;

        param.pageNo = data.pageNo || self.state.curPage || 1;
        param.totalSize = data.totalSize || 0;
        param.pageSize = data.pageSize || self.props.trackData.pageSize || 10;

        self.setState({
            pageData: param,
            list: data.data
        });

        // self.finishLoad(data);
    },
    PageChange: function (page) {
        var self = this;
        var pageData = self.state.pageData;
        self.state.curPage = page;
        self.props.getData({
            pageSize: pageData.pageSize,
            pageNo: page,
            today: self.props.trackData.today
        });
    },

    /*setCurrentPage:function (num) {

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
     },*/

    render: function () {
        return (
            <div className="calender-list-wrap">
                <Content list={this.state.list}/>
                <div style={{position: 'absolute', right: '5px', bottom: '10px'}}>
                    <Pagination
                        size="small"
                        selectComponentClass={Select}
                        total={this.state.pageData.totalSize}
                        showTotal={total => `共 ${total} 条记录`}
                        pageSize={this.state.pageData.pageSize}
                        defaultCurrent={this.state.pageData.pageNo}
                        current={this.state.pageData.pageNo}
                        onChange={this.PageChange}
                        showQuickJumper
                    />
                </div>
                {/*<p className="padding-left-10"><a href="javascript:void(0)">查看更多>></a></p>*/}
            </div>
        )
    }
});