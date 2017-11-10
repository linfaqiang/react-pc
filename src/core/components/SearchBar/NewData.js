import React from 'react';

module.exports = React.createClass({

    getInitialState:function(){
        return {
        }
    },

    componentDidMount:function(){
    },

    render:function(){

        function renderClueBtn(){
            if(CONFIG.Exclude && CONFIG.Exclude.clue) return null;
            return (
                <li>
                    <a href="#/clue/add/0">
                        <i className="icon fa pcicon green pcicon-addClue"></i>
                        新建线索
                    </a>
                </li>
            );
        };
        function renderChanceBtn(){
            if(CONFIG.Exclude && CONFIG.Exclude.chance) return null;
            return (
                <li>
                    <a href="#/chance/add/0">
                        <i className="icon fa pcicon orange pcicon-addChance"></i>
                        新建商机
                    </a>
                </li>
            );
        };
        return(
            <div className="btnBlock">
                <div className="btnBlock dropdown-toggle" data-toggle="dropdown">
                    <a href="#">
                        <i className="icon fa pcicon pcicon-add"></i>
                    </a>
                </div>
                <ul className="optItemList dropdown-menu dropdown-arrow dropdown-login-area">
                    {renderClueBtn()}
                    <li>
                        <a href="#/customer/add/0">
                            <i className="icon fa pcicon orange pcicon-addCustomer"></i>
                            新建客户

                        </a>
                    </li>
                    <li>
                        <a href="#/linkman/addLinkman/0">
                            <i className="icon fa pcicon blue pcicon-addContacts"></i>
                            新建联系人

                        </a>
                    </li>
                    {renderChanceBtn()}
                    <li>
                        <a href="#/activity/add/0">
                            <i className="icon fa pcicon yellow pcicon-addActivity"></i>
                            新建活动

                        </a>
                    </li>
                    <li>
                        <a href="#/task/addTask/0">
                            <i className="icon fa pcicon blue pcicon-addTask"></i>
                            新建任务

                        </a>
                    </li>
                    <li>
                        <a data-toggle="modal" data-target='#addScheduleModal'>
                            <i className="icon fa pcicon orange pcicon-addSchedule"></i>
                            新建日程

                        </a>
                    </li>
                    <li>
                        <a data-toggle="modal" data-target='#addBirthdayModal'>
                            <i className="icon fa pcicon green pcicon-addBirthday"></i>
                            新建生日

                        </a>
                    </li>
                    <li>
                        <a href="#/working/add/0">
                            <i className="icon fa pcicon blue pcicon-addReport"></i>
                            新建工作报告

                        </a>
                    </li>
                </ul>
            </div>
        );
    }
});