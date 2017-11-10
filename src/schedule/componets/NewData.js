import React from 'react';

module.exports = React.createClass({
    getInitialState: function () {
        return {
            st:{}
        }
    },
    componentDidMount: function () {
    },
    componentWillUnmount: function() {
    },
    show: function(o){
        var ret = this.refs.crmScheduleNewData.parentNode.getBoundingClientRect();
        this.setState({st:{
            left: (o.left-ret.left-87)+'px',//-ret.left
            top: (o.top-ret.top+7)+'px',
            marginLeft: '0px',
            display: 'block'
        }});
    },
    hide: function(){
        this.setState({st:{}});
    },
    /**
     * 1. 点击事件轴任何一位置都可以创建生日/日程/任务/活动。默认创建生日：时间为当天，日程/任务/活动：坐标轴的时间带入开始时间，结束时间为坐标轴时间延后一小时。
     * 2. 如果指针区域正好为横线中间值。则取下面的时间。
     */
    addSchedule:function(){
        $('#addScheduleModal').modal('show');
        $(document).trigger('addNewSchedule');
    },
    addBirthday:function(){
        $('#addBirthdayModal').modal('show');
        $(document).trigger('addNewBirthday');
    },

    render: function(){
        return (
            <ul ref="crmScheduleNewData" className="optItemList dropdown-menu dropdown-arrow dropdown-login-area" style={this.state.st} onClick={this.hide} onMouseLeave={this.hide}>
                <li>
                    <a onClick={this.addBirthday}>
                        <i className="icon fa pcicon green pcicon-addBirthday"></i>
                        新建生日
                    </a>
                </li>
                <li>
                    <a onClick={this.addSchedule}>
                        <i className="icon fa pcicon orange pcicon-addSchedule"></i>
                        新建日程
                    </a>
                </li>
                <li>
                    <a href="#/task/addTask/0?from=schedule">
                        <i className="icon fa pcicon blue pcicon-addTask"></i>
                        新建任务
                    </a>
                </li>
                <li>
                    <a href="#/activity/add/a?from=schedule">
                        <i className="icon fa pcicon yellow pcicon-addActivity"></i>
                        新建活动
                    </a>
                </li>
            </ul>
        );
    }
});