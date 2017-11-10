import React from 'react';
import CurrentPosition from '../core/components/layout/CurrentPosition'
import AjaxRequest from '../core/common/ajaxRequest.js';
import UserInfo from '../core/common/UserInfo.js';

module.exports = React.createClass({
    getInitialState: function() {
        return {
            tableData:[]
        };
    },
    componentDidMount: function() {
        this.getData();
    },

    getData() {
        var self = this,
            taskUrl = CONFIG.APIS.market_detail+'/'+self.props.params.marketId + '/saleTask?undone=1';
        AjaxRequest.get(taskUrl, null, function(data){
            self.setState({
                tableData:data.data
            });
        });
    },

    render: function() {
        var self = this;
        var lists = this.state.tableData;
        var id = this.props.params.marketId;
        var currentId = UserInfo.staffId();

        var lis = lists.map(function(qst,key){
            var level = qst.priorityLevel;
            var flagUrl = "";
            if(level == 0){//一般
                flagUrl = APIS.img_path+"/assets/img/blue.png";
            }else if(level == 1){//较急
                flagUrl = APIS.img_path+"/assets/img/yellow.png";
            }else if(level == 2){//紧急
                flagUrl = APIS.img_path+"/assets/img/violet.png";
            }else if(level == 3){//非常紧急
                flagUrl = APIS.img_path+"/assets/img/red.png";
            }
            var bgcolor = "#fbfbfb";
            if(qst.id == currentId){
                bgcolor = "#f2f5f5";
            }

            return	(
                <li id={'libg'+qst.id} style={{backgroundColor:bgcolor,cursor:'pointer', padding:'10px'}} key={key}>
                    {/*<div className="div-flag"><img src={flagUrl} width="32" height="32" alt="" name="defaultPic" /></div>*/}
                    <h5 className={qst.status == 2 ? 'line-font':''}>任务名称：{qst.subject?qst.subject:""}</h5>
                    {/*<h5 className="line-font" style={qst.audioSubjectFileUrl? {} : {display:'none'}}>
                        <div className="audioBox">
                            <audio  src={qst.audioSubjectFileUrl.replace('.amr', '.mp3')}>你的浏览器不支持audio</audio>
                            <p className='audioInfo'>
                                <span className="currentTime"></span><span className="duration"></span>
                            </p>
                        </div>
                    </h5>*/}
                    <p>任务描述：{qst.description?qst.description:"任务描述暂无"}</p>
                    <p>关联客户：{qst.customerName?qst.customerName:"关联客户暂无"}</p>
                    <span className="taskTime">{qst.createdOn}</span>
                </li>
            )
        }.bind(self) );

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="dashboard-box">
                                <div className="box-tabbs">
                                    <div className="tabbable">
                                        <ul className="nav nav-tabs myTab">
                                            <li>
                                                <a className="btnBack" href={`#/marketing/${id}?tab=otherInfo`}></a>
                                            </li>
                                            <li className="active">
                                                <a>{this.props.route.name}</a>
                                            </li>
                                            {/*<li className="tabBtns btnGroup">
                                                <a href={`#/clue/${clueId}/linkman/add/0`}>
                                                    <i class="fa fa-file-text"></i>
                                                    新建
                                                </a>
                                            </li>*/}
                                        </ul>
                                        <div className="tab-content tabs-flat no-padding">
                                            <div id="visits" className="tab-pane animated fadeInUp active">
                                                <div className="row">
                                                    <div className="col-lg-12">

                                                        {/*<List ref="taskList" getData={this.getData} initParam={this.state.queryParam}  tableData={this.state.tableData}/>
                                                    */}
                                                        <div className="taskList">
                                                            <ul className="taskList_ul">
                                                                {lis}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});